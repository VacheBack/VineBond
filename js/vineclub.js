/**
 * VineClub — Loyalty Membership Module
 *
 * Responsibilities:
 *  1. Credit calculation engine
 *  2. Tier determination
 *  3. Multi-step registration form
 *  4. Stripe.js frontend tokenisation (no raw card data stored locally)
 *  5. Canvas API certificate generation (800×560 px per tier)
 *  6. Certificate download (PNG) and share (URL hash)
 *  7. URL hash routing for direct certificate links
 */

'use strict';

/* ================================================================
   CONSTANTS
   ================================================================ */

const VC_CREDITS = {
  one:   10,   // 1-person booking
  three: 35,   // 3-person booking
  five:  65,   // 5-person booking
  wine:  15,   // wine pre-purchase bonus
};

const VC_TIERS = [
  {
    name:    'Platinum',
    slug:    'platinum',
    min:     500,
    emoji:   '💎',
    /* Gradient stops used in canvas drawing */
    bgStops: ['#E8E6F0', '#B0ACCC', '#D8D4EC', '#9890BC'],
    borderColor: '#9890BC',
    textColor:   '#2a1f4a',
    accentColor: '#6B61A0',
    labelColor:  '#4a3f80',
  },
  {
    name:    'Gold',
    slug:    'gold',
    min:     200,
    emoji:   '🥇',
    bgStops: ['#D4AF37', '#B8960F', '#D4AF37', '#B8960F'],
    borderColor: '#B8960F',
    textColor:   '#fff',
    accentColor: '#fff',
    labelColor:  'rgba(255,255,255,0.75)',
  },
  {
    name:    'Silver',
    slug:    'silver',
    min:     0,
    emoji:   '🥈',
    bgStops: ['#E8E8E8', '#C0C0C0', '#E4E4E4', '#B8B8B8'],
    borderColor: '#AAAAAA',
    textColor:   '#333',
    accentColor: '#555',
    labelColor:  '#777',
  },
];


/* ================================================================
   CREDIT & TIER LOGIC
   ================================================================ */

/**
 * Return total credits for a booking.
 * @param {'one'|'three'|'five'} bookingType
 * @param {boolean} winePrePurchase
 * @returns {number}
 */
function calcCredits(bookingType, winePrePurchase = false) {
  const base = VC_CREDITS[bookingType] || 0;
  return base + (winePrePurchase ? VC_CREDITS.wine : 0);
}

/**
 * Return the tier object matching the given points total.
 * @param {number} points
 * @returns {object}
 */
function getTier(points) {
  return VC_TIERS.find(t => points >= t.min) || VC_TIERS[VC_TIERS.length - 1];
}


/* ================================================================
   MULTI-STEP FORM
   ================================================================ */

let currentStep = 1;

function showStep(n) {
  [1, 2, 3].forEach(i => {
    const panel = document.getElementById('vcStep' + i);
    const dot   = document.querySelector('.vine-step[data-step="' + i + '"]');
    if (!panel || !dot) return;

    if (i === n) {
      panel.classList.add('active');
      dot.classList.add('active');
      dot.classList.remove('done');
    } else if (i < n) {
      panel.classList.remove('active');
      dot.classList.remove('active');
      dot.classList.add('done');
      dot.querySelector('.vine-step-circle').textContent = '✓';
    } else {
      panel.classList.remove('active');
      dot.classList.remove('active', 'done');
      dot.querySelector('.vine-step-circle').textContent = i;
    }
  });
  currentStep = n;
}

function validateStep(n) {
  if (n === 1) {
    const first  = document.getElementById('vcFirstName');
    const last   = document.getElementById('vcLastName');
    const email  = document.getElementById('vcEmail');
    const dob    = document.getElementById('vcDob');
    if (!first.value.trim()) { first.focus(); return false; }
    if (!last.value.trim())  { last.focus();  return false; }
    if (!email.value.trim() || !email.validity.valid) { email.focus(); return false; }
    if (!dob.value)          { dob.focus();   return false; }
    return true;
  }
  /* Step 2 has no required fields — preferences are optional */
  return true;
}

function initForm() {
  const next1   = document.getElementById('vcNext1');
  const next2   = document.getElementById('vcNext2');
  const back2   = document.getElementById('vcBack2');
  const back3   = document.getElementById('vcBack3');
  const submit  = document.getElementById('vcSubmit');

  if (next1)  next1.addEventListener('click',  () => { if (validateStep(1)) showStep(2); });
  if (back2)  back2.addEventListener('click',  () => showStep(1));
  if (next2)  next2.addEventListener('click',  () => { if (validateStep(2)) showStep(3); });
  if (back3)  back3.addEventListener('click',  () => showStep(2));

  /* Live certificate name preview when user types their name */
  const firstName = document.getElementById('vcFirstName');
  const lastName  = document.getElementById('vcLastName');
  if (firstName) {
    firstName.addEventListener('input', refreshCertPreviews);
    lastName.addEventListener('input',  refreshCertPreviews);
  }

  if (submit) submit.addEventListener('click', handleSubmit);
}

function getLiveName() {
  const f = (document.getElementById('vcFirstName') || {}).value || '';
  const l = (document.getElementById('vcLastName')  || {}).value || '';
  const name = (f + ' ' + l).trim();
  return name || 'Your Name';
}


/* ================================================================
   STRIPE.JS INTEGRATION
   ─────────────────────────────────────────────────────────────────
   IMPORTANT: Replace 'pk_test_REPLACE_WITH_YOUR_STRIPE_KEY' with
   your actual Stripe publishable key before going live.
   The card element iframe communicates directly with Stripe servers.
   No raw card data ever reaches VineBond or is stored locally.
   ================================================================ */

let stripeInstance = null;
let cardElement    = null;
let stripeReady    = false;

function initStripe() {
  /* Guard: Stripe.js CDN loaded? */
  if (typeof Stripe === 'undefined') {
    showFallbackCardUI();
    return;
  }

  try {
    /* ⚠️  Replace with your Stripe publishable key */
    stripeInstance = Stripe('pk_test_REPLACE_WITH_YOUR_STRIPE_KEY');

    const elements = stripeInstance.elements({
      fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap' }],
    });

    cardElement = elements.create('card', {
      style: {
        base: {
          color:           '#4A1528',
          fontFamily:      "'Inter', -apple-system, sans-serif",
          fontSize:        '15px',
          fontSmoothing:   'antialiased',
          '::placeholder': { color: '#b0a898' },
        },
        invalid: { color: '#C0392B', iconColor: '#C0392B' },
      },
      hidePostalCode: false,
    });

    cardElement.mount('#stripe-card-element');

    cardElement.on('change', (event) => {
      const errEl = document.getElementById('stripe-card-errors');
      if (errEl) errEl.textContent = event.error ? event.error.message : '';
    });

    stripeReady = true;
  } catch (err) {
    console.warn('[VineClub] Stripe init failed:', err.message);
    showFallbackCardUI();
  }
}

/** Shown when Stripe.js is blocked or key is invalid. */
function showFallbackCardUI() {
  const wrap = document.getElementById('stripe-card-element');
  if (!wrap) return;
  wrap.innerHTML = `
    <input type="text" id="fallbackCard"
      style="width:100%;background:transparent;border:none;outline:none;font-size:0.93rem;color:#4A1528;"
      placeholder="Card number (Stripe not configured)" />`;
}

async function handleSubmit() {
  const btn = document.getElementById('vcSubmit');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; }

  /* If Stripe is ready, tokenise the card */
  if (stripeReady && stripeInstance && cardElement) {
    const cardholderName = (document.getElementById('vcCardName') || {}).value || '';
    const { token, error } = await stripeInstance.createToken(cardElement, {
      name: cardholderName,
    });

    if (error) {
      const errEl = document.getElementById('stripe-card-errors');
      if (errEl) errEl.textContent = error.message;
      if (btn) { btn.disabled = false; btn.textContent = 'Complete Registration'; }
      return;
    }

    /* token.id is what you'd POST to your backend to vault the card.
       It is NEVER stored in localStorage or sessionStorage.
       For this static demo we log it to the console only. */
    console.info('[VineClub] Stripe token created (demo):', token.id);
  }

  showSuccessState();
}

function showSuccessState() {
  /* Hide all step panels, show success */
  [1, 2, 3].forEach(i => {
    const p = document.getElementById('vcStep' + i);
    if (p) p.classList.remove('active');
  });
  const success = document.getElementById('vcSuccess');
  if (success) success.classList.add('visible');

  /* Mark all steps done */
  document.querySelectorAll('.vine-step').forEach(s => {
    s.classList.remove('active');
    s.classList.add('done');
    const circle = s.querySelector('.vine-step-circle');
    if (circle) circle.textContent = '✓';
  });

  /* Refresh certs with the user's actual name */
  refreshCertPreviews();
}


/* ================================================================
   CERTIFICATE GENERATION (Canvas API, 800×560 px)
   ================================================================ */

/**
 * Draw a tier certificate onto a <canvas> element.
 * @param {HTMLCanvasElement} canvas
 * @param {object} tier  — one entry from VC_TIERS
 * @param {string} userName
 */
function drawCertificate(canvas, tier, userName) {
  const W = canvas.width  = 800;
  const H = canvas.height = 560;
  const ctx = canvas.getContext('2d');

  /* ── Background gradient ── */
  const grad = ctx.createLinearGradient(0, 0, W, H);
  const stops = tier.bgStops;
  stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  /* ── Outer border (double-line) ── */
  ctx.strokeStyle = tier.borderColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.lineWidth = 2;
  ctx.strokeStyle = tier.borderColor + 'AA';
  ctx.strokeRect(28, 28, W - 56, H - 56);

  /* ── Shimmer overlay for Platinum ── */
  if (tier.slug === 'platinum') {
    const shimmer = ctx.createLinearGradient(0, 0, W, H);
    shimmer.addColorStop(0,   'rgba(255,255,255,0)');
    shimmer.addColorStop(0.4, 'rgba(255,255,255,0.12)');
    shimmer.addColorStop(0.6, 'rgba(255,255,255,0.22)');
    shimmer.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── VineBond wordmark (top-left) ── */
  ctx.fillStyle = tier.slug === 'silver' ? '#6B1F3C' : 'rgba(255,255,255,0.85)';
  ctx.font = 'italic bold 18px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('VineBond', 52, 62);

  /* ── Issue date (top-right) ── */
  const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillStyle = tier.labelColor;
  ctx.font = '11px -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Issued ' + today, W - 52, 62);

  /* ── "CERTIFICATE OF MEMBERSHIP" label ── */
  ctx.textAlign = 'center';
  ctx.fillStyle = tier.labelColor;
  ctx.font = '700 11px -apple-system, sans-serif';
  ctx.letterSpacing = '0.15em';
  ctx.fillText('CERTIFICATE OF MEMBERSHIP', W / 2, 130);
  ctx.letterSpacing = '0';

  /* ── Decorative horizontal rule ── */
  const ruleGrad = ctx.createLinearGradient(120, 0, W - 120, 0);
  ruleGrad.addColorStop(0,   'transparent');
  ruleGrad.addColorStop(0.3, tier.borderColor + 'CC');
  ruleGrad.addColorStop(0.7, tier.borderColor + 'CC');
  ruleGrad.addColorStop(1,   'transparent');
  ctx.strokeStyle = ruleGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 145); ctx.lineTo(W - 120, 145);
  ctx.stroke();

  /* ── Tier emoji ── */
  ctx.font = '64px serif';
  ctx.textAlign = 'center';
  ctx.fillText(tier.emoji, W / 2, 240);

  /* ── Tier name (large) ── */
  ctx.fillStyle = tier.textColor;
  ctx.font = 'bold 52px Georgia, "Times New Roman", serif';
  ctx.fillText(tier.name.toUpperCase(), W / 2, 310);

  /* ── "Presented to" label ── */
  ctx.fillStyle = tier.labelColor;
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillText('Presented to', W / 2, 360);

  /* ── Member name ── */
  ctx.fillStyle = tier.textColor;
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(userName, W / 2, 398);

  /* ── Decorative vine divider ── */
  ctx.fillStyle = tier.labelColor;
  ctx.font = '20px serif';
  ctx.fillText('— 🍇 —', W / 2, 440);

  /* ── Footer ── */
  ctx.fillStyle = tier.labelColor;
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('VineClub · Rheingau Wine Region · vinebond.com', W / 2, 510);

  /* ── Corner ornaments ── */
  const corners = [[52, 52], [W - 52, 52], [52, H - 52], [W - 52, H - 52]];
  ctx.fillStyle = tier.borderColor + 'AA';
  ctx.font = '14px serif';
  corners.forEach(([x, y]) => {
    ctx.textAlign = 'center';
    ctx.fillText('✦', x, y + 5);
  });
}

function refreshCertPreviews() {
  const name = getLiveName();
  VC_TIERS.forEach(tier => {
    const canvas = document.getElementById('cert-' + tier.slug);
    if (canvas) drawCertificate(canvas, tier, name);
  });
}

function downloadCertificate(tierSlug) {
  const canvas = document.getElementById('cert-' + tierSlug);
  if (!canvas) return;
  const link = document.createElement('a');
  link.href     = canvas.toDataURL('image/png');
  link.download = 'vineclub-' + tierSlug + '-certificate.png';
  link.click();
}

function getShareURL(tierSlug) {
  return window.location.origin + window.location.pathname + '#certificate/' + tierSlug;
}

function copyShareLink(tierSlug) {
  const url = getShareURL(tierSlug);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!'));
  } else {
    /* Fallback for older browsers */
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Link copied!');
  }
}


/* ================================================================
   TOAST NOTIFICATION
   ================================================================ */

function showToast(msg) {
  let toast = document.getElementById('vcToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vcToast';
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '32px',
      left:         '50%',
      transform:    'translateX(-50%)',
      background:   '#4A5D3E',
      color:        '#fff',
      padding:      '10px 24px',
      borderRadius: '100px',
      fontSize:     '0.88rem',
      fontWeight:   '700',
      zIndex:       '9999',
      boxShadow:    '0 4px 20px rgba(0,0,0,0.25)',
      transition:   'opacity 0.3s',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}


/* ================================================================
   URL HASH ROUTING
   ── vine club.html#certificate/platinum → scroll + highlight
   ================================================================ */

function handleHashRouting() {
  const hash = window.location.hash; // e.g. "#certificate/platinum"
  const match = hash.match(/^#certificate\/(.+)$/);
  if (!match) return;

  const slug = match[1].toLowerCase();
  const validSlugs = VC_TIERS.map(t => t.slug);
  if (!validSlugs.includes(slug)) return;

  /* Scroll to certificates section */
  const section = document.getElementById('vc-certificates');
  if (section) {
    setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  }

  /* Highlight the matching certificate card */
  const wrap = document.getElementById('certWrap-' + slug);
  if (wrap) {
    setTimeout(() => {
      wrap.style.outline = '3px solid #D4AF37';
      wrap.style.outlineOffset = '4px';
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 800);
  }
}


/* ================================================================
   INIT
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* 1. Draw all certificate previews with placeholder name */
  refreshCertPreviews();

  /* 2. Wire up form steps */
  initForm();

  /* 3. Initialise Stripe */
  initStripe();

  /* 4. Certificate download + share buttons */
  document.querySelectorAll('.cert-btn-download').forEach(btn => {
    btn.addEventListener('click', () => downloadCertificate(btn.dataset.tier));
  });
  document.querySelectorAll('.cert-btn-share').forEach(btn => {
    btn.addEventListener('click', () => copyShareLink(btn.dataset.tier));
  });

  /* 5. Smooth scroll for hero CTA */
  document.querySelectorAll('a[href="#vc-register"], a[href="#vc-certificates"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* 6. Handle URL hash on load */
  handleHashRouting();
  window.addEventListener('hashchange', handleHashRouting);
});
