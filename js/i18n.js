/**
 * VineBond i18n Engine v2.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture:
 *   1. Primary  → fetch('/assets/i18n/translations.json')  [HTTP server]
 *   2. Fallback → window.VB_TRANSLATIONS embedded below    [file:// protocol]
 *
 * Usage in HTML:
 *   data-i18n="key"              → sets el.textContent
 *   data-i18n-html="key"        → sets el.innerHTML  (for keys with <span>)
 *   data-i18n-placeholder="key" → sets el.placeholder
 *   data-i18n-title="key"       → sets el.title
 *   data-i18n-page-title="key"  → sets document.title (on <body>)
 *
 * Events dispatched on document:
 *   vb:i18n:ready   → { lang }
 *   vb:i18n:changed → { lang }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const VB_TRANSLATIONS_FALLBACK = {
  en: {
    "nav.wineries": "Wineries", "nav.book": "Book", "nav.vinemap": "VineMap",    "nav.sign_in": "Sign In",    "nav.search_placeholder": "Search wineries…", "nav.book_tasting": "Book a Tasting",
    "hero.label": "Explore Global Vineyards",
    "hero.title": "Discover the World's Finest Wine Experiences",
    "hero.subtitle": "Book exclusive vineyard tours, cellar tastings, and terroir explorations at hand-picked wineries across the globe.",
    "hero.cta_explore": "Explore Experiences", "hero.cta_map": "Open VineMap",
    "hero.booking_title": "Quick Booking", "hero.booking_destination_label": "City or Village",
    "hero.booking_date_label": "Date", "hero.booking_guests_label": "Guests",
    "hero.booking_experience_label": "Experience Type",
    "hero.booking_price_label": "Estimated price", "hero.booking_price_unit": "/ person",
    "hero.booking_cta": "Check Availability",
    "filter.label": "Filter by:", "filter.visitors_default": "Amount of visitors",
    "filter.wines_default": "Types of wines", "filter.chip_open": "Open Today",
    "filter.chip_organic": "Organic", "filter.chip_family": "Family-Owned", "filter.apply": "Apply",
    "terroir.section_label": "Vineyard Parcels & Terroir",
    "terroir.section_title": "Understand the Land Behind Every Bottle",
    "terroir.section_subtitle": "Explore the soil composition, microclimate, and seasonal vine care that define each winery's unique character.",
    "terroir.soil_title": "Soil & Geology",
    "terroir.soil_desc": "From chalk limestone in Champagne to volcanic basalt in Sicily — browse parcel-level soil data to understand a wine's mineral DNA.",
    "terroir.soil_badge": "Clay · Limestone · Schist",
    "terroir.climate_title": "Microclimate & Sunlight",
    "terroir.climate_desc": "Altitude, sun exposure, and seasonal rainfall shape every grape. Compare climate profiles across regions to find your ideal terroir match.",
    "terroir.climate_badge": "Mediterranean · Continental",
    "terroir.vine_title": "Seasonal Vine Care",
    "terroir.vine_desc": "Pruning, canopy management, harvest timing — learn the hands-on viticulture practices each winery employs throughout the year.",
    "terroir.vine_badge": "Pruning · Green Harvest",
    "sustain.label": "Sustainability Initiatives", "sustain.title": "Committed to the Land",
    "sustain.desc": "Discover wineries leading the way in organic farming, biodynamic practices, and carbon-neutral production. Every VineBond partner meets strict environmental standards.",
    "sustain.cta": "View Certified Wineries",
    "sustain.stat1_label": "Organic Wineries", "sustain.stat2_label": "Water Recycled", "sustain.stat3_label": "Vines Planted",
    "exp.section_label": "Experience Availability & Pricing",
    "exp.section_title": "Book Your Next Wine Adventure",
    "exp.section_subtitle": "Handpicked experiences at the world's finest wineries — with real-time availability.",
    "exp.view_all": "View All Experiences", "exp.slots_left": "slots left",
    "exp.per_person": "/ person", "exp.book_btn": "Book",
    "map.section_label": "Region & Terroir Browser",
    "map.section_title": "Explore Wine Regions on the VineMap",
    "map.section_subtitle": "Navigate global wine trails, discover hidden vineyards, and plan your terroir journey.",
    "map.placeholder_title": "Interactive VineMap",
    "map.placeholder_desc": "Click a region to explore vineyards, terroir profiles, and bookable experiences on the trail.",
    "map.launch_btn": "Launch Full Map",
    "community.section_label": "Reviews, Ratings & Loyalty",
    "community.section_title": "Trusted by Wine Enthusiasts Worldwide",
    "community.section_subtitle": "Hear from fellow travellers who've walked the vineyards and tasted the terroir first-hand.",
    "loyalty.section_label": "Badges & Loyalty Program",
    "loyalty.title": "Earn Rewards with Every Visit",
    "loyalty.desc": "Collect badges for vineyard visits, terroir explorations, and wine trail completions. Unlock exclusive perks and members-only experiences.",
    "loyalty.cta": "Join the VineClub",
    "loyalty.badge_explorer": "Explorer", "loyalty.badge_terroir": "Terroir",
    "loyalty.badge_harvest": "Harvest", "loyalty.badge_cellar": "Cellar", "loyalty.badge_trail": "Trail",
    "footer.brand_desc": "Connecting wine enthusiasts with the world's finest vineyards. Book authentic experiences, explore terroir, and join a global community of wine lovers.",
    "footer.explore_title": "Explore", "footer.bookings_title": "Bookings", "footer.company_title": "Company",
    "footer.copyright": "© 2026 VineBond. All rights reserved.",
    "footer.legal": "Adults 18+ only. Please enjoy responsibly.",
    "winery.page_title": "Wineries — VineBond",
    "winery.section_label": "Our Winery Partners", "winery.section_title": "Discover Exceptional Wine Estates",
    "winery.section_subtitle": "Hand-selected wineries offering unique terroir experiences, from acclaimed Rheingau Grosses Gewächs estates to iconic global châteaux.",
    "winery.filter_all": "All Regions", "winery.filter_gg": "Grosses Gewächs",
    "winery.filter_1g": "Erstes Gewächs", "winery.filter_organic": "Organic",
    "winery.detail_grape": "Grape Variety", "winery.detail_classification": "Classification",
    "winery.detail_soil": "Soil Type", "winery.detail_region": "Region",
    "winery.book_btn": "Book an Experience", "winery.map_btn": "View on VineMap",
    "book.page_title": "Book — VineBond", "book.section_label": "Reserve Your Experience",
    "book.section_title": "Authentic Vineyard Experiences",
    "book.section_subtitle": "Select your date, group size, and preferred experience. Instant confirmation guaranteed.",
    "book.form_winery": "Select Winery", "book.form_date": "Date",
    "book.form_guests": "Number of Guests", "book.form_exp": "Experience Type",
    "book.form_name": "Full Name", "book.form_email": "Email Address",
    "book.form_phone": "Phone (optional)", "book.form_notes": "Special Requests",
    "book.form_notes_placeholder": "Dietary requirements, occasion details…",
    "book.summary_title": "Booking Summary", "book.summary_price": "Price per Person",
    "book.summary_total": "Total", "book.submit_btn": "Confirm Booking",
    "book.terms": "By booking you agree to our Terms of Service. All experiences are strictly for adults (18+).",
    "book.exp_cellar": "Cellar Tasting", "book.exp_walk": "Vineyard Walk",
    "book.exp_trail": "Full-Day Trail", "book.exp_dinner": "Winemaker's Dinner",
    "book.perk_confirm": "Instant confirmation via email",
    "book.perk_cancel": "Free cancellation up to 48h before",
    "book.perk_loyalty": "VineClub loyalty points earned",
    "book.confirm_title": "Booking Confirmed!",
    "book.confirm_desc": "Your experience is reserved. A confirmation has been sent to your email. We look forward to welcoming you to the vineyard.",
    "vinemap.page_title": "VineMap — VineBond",
    "vinemap.section_label": "Interactive Wine Region Map",
    "vinemap.section_title": "Rheingau — Grosses Gewächs & Erstes Gewächs",
    "vinemap.section_subtitle": "Explore the precise vineyard sites of Germany's most prestigious white wine region. Click any marker to view terroir details and book a visit.",
    "vinemap.legend_gg": "Grosses Gewächs (GG)", "vinemap.legend_1g": "Erstes Gewächs (1G)",
    "vinemap.filter_all": "All Sites", "vinemap.filter_gg": "GG Only", "vinemap.filter_1g": "1G Only",
    "vinemap.popup_estate": "Estate", "vinemap.popup_grape": "Primary Grape",
    "vinemap.popup_soil": "Soil", "vinemap.popup_book": "Book a Visit",
    "vinemap.filter_label": "Filter:",
    "vinemap.trail_rheingau": "Rheingau Riesling Trail", "vinemap.trail_burgundy": "Burgundy Trail",
    "vinemap.trail_bordeaux": "Bordeaux Route", "vinemap.trail_tuscany": "Via della Vendemmia, Tuscany",
    "vinemap.trail_armenia": "Armenian Highland Route",
    "vinemap.gg_title": "Grosses Gew\u00e4chs (GG)",
    "vinemap.gg_desc": "Germany's highest classification for dry wines, equivalent to Grand Cru. Awarded only to vineyards with exceptional terroir and producers holding VDP membership.",
    "vinemap.gg_stat": "10 GG Sites",
    "vinemap.1g_title": "Erstes Gew\u00e4chs (1G)",
    "vinemap.1g_desc": "The Rheingau-specific \"First Growth\" classification, predating the national GG system. Covers historic Cistercian and estate vineyards with documented provenance since the 12th century.",
    "vinemap.1g_stat": "4 1G Sites",
    "vinemap.terroir_title": "Rheingau Terroir",
    "vinemap.terroir_desc": "South-facing slopes above the Rhine between R\u00fcdesheim and Hochheim. Phyllite slate, quartzite, loess, and limestone create the diversity behind Germany's most celebrated Rieslings.",
    "vinemap.terroir_stat": "Phyllitschiefer",
    "winery.region_all": "All Regions", "winery.region_tuscany": "Tuscany", "winery.results_suffix": "wineries found",
    "book.step1_title": "1 \u2014 Winery & Experience", "book.step2_title": "2 \u2014 Date & Guests", "book.step3_title": "3 \u2014 Your Details",
    "book.winery_placeholder": "\u2014 Choose a winery \u2014",
    "book.guest_opt_1": "1 guest", "book.guest_opt_2": "2 guests", "book.guest_opt_3": "3 guests",
    "book.guest_opt_4": "4 guests", "book.guest_opt_5": "5 guests", "book.guest_opt_6": "6 guests",
    "book.guest_opt_7_10": "7\u201310 guests", "book.guest_opt_11_20": "11\u201320 guests",
    "book.incl_vat": "incl. VAT", "book.return_home": "Return to Home",
    "login.page_title": "Sign In \u2014 VineBond",
    "login.scenic_title": "Your Journey into<br/><span>Fine Wine</span> Awaits",
    "login.scenic_desc": "Access exclusive vineyard experiences, earn loyalty badges, and explore terroir-driven stories from estates across the globe.",
    "login.pill_wineries": "Explore 340+ certified wineries worldwide",
    "login.pill_booking": "Instant booking with free cancellation",
    "login.pill_rewards": "Earn VineClub badges & exclusive rewards",
    "login.label_welcome": "Welcome to VineBond",
    "login.title_unified": "Sign in or create an account",
    "login.subtitle_unified": "Enter your email to sign in. If you don't have an account yet, we'll help you create one.",
    "login.email_label": "Email address", "login.email_placeholder": "you@example.com",
    "login.email_error": "Please enter a valid email address.",
    "login.cta_continue_email": "Continue with email",
    "login.divider_or_social": "or use",
    "login.social_google": "Continue with Google", "login.social_apple": "Continue with Apple", "login.social_facebook": "Continue with Facebook",
    "login.guest_continue": "Continue as a Guest",
    "login.legal_notice": "By signing in or creating an account, you agree to our <a href=\"#\">Terms&nbsp;of&nbsp;Service</a> &amp; <a href=\"#\">Privacy&nbsp;Policy</a>.<br/>Adults 18+ only. Please enjoy responsibly.",
    "login.label_verify": "Verify your email", "login.title_verify": "Check your inbox",
    "login.subtitle_verify": "We've sent a 6-digit verification code to:",
    "login.otp_error": "Invalid code. Please try again.", "login.cta_verify": "Verify email",
    "login.spam_tip": "Check your spam folder", "login.resend_code": "Request another code",
    "login.back_to_signin": "Back to sign-in",
    "hero.title_html": "Discover the World's<br/>Finest <span>Wine Experiences</span>",
    "hero.dest_placeholder": "Select a destination\u2026",
    "hero.exp_cellar_tasting": "Cellar Tasting", "hero.exp_walk_tasting": "Vineyard Walk & Tasting",
    "hero.exp_full_day_trail": "Full-Day Wine Trail", "hero.exp_harvest": "Harvest Experience",
    "hero.exp_winemaker_dinner": "Winemaker's Dinner",
    "hero.guest_1": "1 guest", "hero.guest_2": "2 guests", "hero.guest_3": "3 guests",
    "hero.guest_4": "4 guests", "hero.guest_5p": "5+ guests",
    "vinemap.trail_napa": "Napa Valley Trail", "vinemap.trail_rioja": "Rioja Trail",
    "footer.link_trails": "Wine Trails", "footer.link_terroir": "Terroir Browser",
    "footer.link_experiences": "Experiences", "footer.link_group": "Group Tastings",
    "footer.link_gifts": "Gift Cards", "footer.link_vineclub": "VineClub",
    "footer.link_about": "About Us", "footer.link_sustainability": "Sustainability",
    "footer.link_careers": "Careers", "footer.link_contact": "Contact",
    "a11y.skip_to_content": "Skip to content",
    "hero.page_title": "VineBond \u2014 Connect with Global Wineries",
    "filter.visitors_intimate": "Intimate (1-4)", "filter.visitors_small": "Small Group (5-10)",
    "filter.visitors_medium": "Medium (11-20)", "filter.visitors_large": "Large (20+)",
    "filter.wine_red_cab": "Red \u2014 Cabernet Sauvignon", "filter.wine_red_pinot": "Red \u2014 Pinot Noir",
    "filter.wine_white_chard": "White \u2014 Chardonnay", "filter.wine_white_sauv": "White \u2014 Sauvignon Blanc",
    "filter.wine_rose": "Ros\u00e9", "filter.wine_sparkling": "Sparkling", "filter.wine_orange": "Orange / Natural",
    "book.form_name_placeholder": "Your full name",
    "book.form_email_placeholder": "your@email.com",
    "book.form_phone_placeholder": "+49 6722 \u2026"
  },

  de: {
    "nav.wineries": "Weingüter", "nav.book": "Buchen", "nav.vinemap": "WeinKarte",    "nav.sign_in": "Anmelden",    "nav.search_placeholder": "Weingüter suchen…", "nav.book_tasting": "Weinprobe buchen",
    "hero.label": "Globale Weinberge entdecken",
    "hero.title": "Die feinsten Weinerlebnisse der Welt entdecken",
    "hero.subtitle": "Buchen Sie exklusive Weinbergsführungen, Kellerverkostungen und Terroir-Erkundungen bei handverlesenen Weingütern weltweit.",
    "hero.cta_explore": "Erlebnisse entdecken", "hero.cta_map": "WeinKarte öffnen",
    "hero.booking_title": "Schnellbuchung", "hero.booking_destination_label": "Stadt oder Ort",
    "hero.booking_date_label": "Datum", "hero.booking_guests_label": "Gäste",
    "hero.booking_experience_label": "Erlebnisart",
    "hero.booking_price_label": "Geschätzter Preis", "hero.booking_price_unit": "/ Person",
    "hero.booking_cta": "Verfügbarkeit prüfen",
    "filter.label": "Filtern nach:", "filter.visitors_default": "Besucheranzahl",
    "filter.wines_default": "Rebsorten & Weintypen", "filter.chip_open": "Heute geöffnet",
    "filter.chip_organic": "Biologisch", "filter.chip_family": "Familienweingut", "filter.apply": "Anwenden",
    "terroir.section_label": "Weinbergsparzellen & Terroir",
    "terroir.section_title": "Das Fundament hinter jedem Wein verstehen",
    "terroir.section_subtitle": "Entdecken Sie Bodenkomposition, Mikroklima und saisonale Rebpflege, die den einzigartigen Charakter jedes Weinguts prägen.",
    "terroir.soil_title": "Boden & Geologie",
    "terroir.soil_desc": "Von Kreidekalk in der Champagne bis zum vulkanischen Basalt Siziliens — parzellengenaue Bodendaten, um die mineralische DNA eines Weins zu verstehen.",
    "terroir.soil_badge": "Ton · Kalkstein · Schiefer",
    "terroir.climate_title": "Mikroklima & Sonneneinstrahlung",
    "terroir.climate_desc": "Höhenlage, Sonneneinstrahlung und saisonale Niederschläge prägen jede Traube. Vergleichen Sie Klimaprofile verschiedener Regionen und finden Sie Ihr ideales Terroir.",
    "terroir.climate_badge": "Mediterran · Kontinental",
    "terroir.vine_title": "Saisonale Rebpflege",
    "terroir.vine_desc": "Rebschnitt, Laubarbeit, Lesezeitpunkt — erfahren Sie mehr über die praktische Weinbergsarbeit im Jahreskreis.",
    "terroir.vine_badge": "Rebschnitt · Grünernte",
    "sustain.label": "Nachhaltigkeitsinitiativen", "sustain.title": "Im Einklang mit der Natur",
    "sustain.desc": "Entdecken Sie Weingüter, die Vorreiter in ökologischem Anbau, biodynamischer Bewirtschaftung und CO₂-neutraler Produktion sind.",
    "sustain.cta": "Zertifizierte Weingüter anzeigen",
    "sustain.stat1_label": "Bio-Weingüter", "sustain.stat2_label": "Wasserrecycling", "sustain.stat3_label": "Rebstöcke gepflanzt",
    "exp.section_label": "Erlebnisverfügbarkeit & Preise",
    "exp.section_title": "Ihr nächstes Weinerlebnis buchen",
    "exp.section_subtitle": "Handverlesene Erlebnisse bei den renommiertesten Weingütern der Welt — mit Echtzeit-Verfügbarkeit.",
    "exp.view_all": "Alle Erlebnisse anzeigen", "exp.slots_left": "Plätze verfügbar",
    "exp.per_person": "/ Person", "exp.book_btn": "Buchen",
    "map.section_label": "Weinregionen & Terroir-Browser",
    "map.section_title": "Weinregionen auf der WeinKarte erkunden",
    "map.section_subtitle": "Navigieren Sie durch globale Weinpfade, entdecken Sie versteckte Weingüter und planen Sie Ihre Terroir-Reise.",
    "map.placeholder_title": "Interaktive WeinKarte",
    "map.placeholder_desc": "Klicken Sie auf eine Region, um Weingüter, Terroir-Profile und buchbare Erlebnisse zu entdecken.",
    "map.launch_btn": "Vollständige Karte öffnen",
    "community.section_label": "Bewertungen & Treueprogramm",
    "community.section_title": "Das Vertrauen von Weinliebhabern weltweit",
    "community.section_subtitle": "Erfahrungsberichte von Reisenden, die die Weinberge entdeckt und das Terroir aus erster Hand erlebt haben.",
    "loyalty.section_label": "Abzeichen & Treueprogramm",
    "loyalty.title": "Prämien mit jedem Besuch verdienen",
    "loyalty.desc": "Sammeln Sie Abzeichen für Weingutbesuche, Terroir-Erkundungen und Weinpfade. Schalten Sie exklusive Mitgliedervorteile frei.",
    "loyalty.cta": "VineClub beitreten",
    "loyalty.badge_explorer": "Entdecker", "loyalty.badge_terroir": "Terroir",
    "loyalty.badge_harvest": "Weinlese", "loyalty.badge_cellar": "Keller", "loyalty.badge_trail": "Weinpfad",
    "footer.brand_desc": "Wir verbinden Weinliebhäber mit den feinsten Weingütern der Welt. Authentische Erlebnisse buchen, Terroir erkunden, globale Weingemeinschaft.",
    "footer.explore_title": "Entdecken", "footer.bookings_title": "Buchungen", "footer.company_title": "Unternehmen",
    "footer.copyright": "© 2026 VineBond. Alle Rechte vorbehalten.",
    "footer.legal": "Nur für Erwachsene ab 18 Jahren. Bitte genießen Sie verantwortungsbewusst.",
    "winery.page_title": "Weingüter — VineBond",
    "winery.section_label": "Unsere Weingut-Partner", "winery.section_title": "Außergewöhnliche Weingüter entdecken",
    "winery.section_subtitle": "Handverlesene Weingüter mit einzigartigen Terroir-Erlebnissen — von renommierten Rheingauer Grosses-Gewächs-Weingütern bis zu ikonischen Châteaux weltweit.",
    "winery.filter_all": "Alle Regionen", "winery.filter_gg": "Grosses Gewächs",
    "winery.filter_1g": "Erstes Gewächs", "winery.filter_organic": "Biologisch",
    "winery.detail_grape": "Rebsorte", "winery.detail_classification": "Klassifizierung",
    "winery.detail_soil": "Bodentyp", "winery.detail_region": "Anbaugebiet",
    "winery.book_btn": "Erlebnis buchen", "winery.map_btn": "Auf WeinKarte anzeigen",
    "book.page_title": "Buchen — VineBond", "book.section_label": "Ihr Erlebnis reservieren",
    "book.section_title": "Authentische Weingutserlebnisse",
    "book.section_subtitle": "Datum, Gruppengröße und Erlebnisart wählen. Sofortige Bestätigung garantiert.",
    "book.form_winery": "Weingut auswählen", "book.form_date": "Datum",
    "book.form_guests": "Anzahl der Gäste", "book.form_exp": "Erlebnisart",
    "book.form_name": "Vollständiger Name", "book.form_email": "E-Mail-Adresse",
    "book.form_phone": "Telefon (optional)", "book.form_notes": "Besondere Wünsche",
    "book.form_notes_placeholder": "Ernährungswünsche, Anlass, Barrierefreiheit…",
    "book.summary_title": "Buchungsübersicht", "book.summary_price": "Preis pro Person",
    "book.summary_total": "Gesamtbetrag", "book.submit_btn": "Buchung bestätigen",
    "book.terms": "Mit der Buchung stimmen Sie unseren Nutzungsbedingungen zu. Alle Erlebnisse richten sich ausschließlich an Erwachsene (18+).",
    "book.exp_cellar": "Kellerverkostung", "book.exp_walk": "Weinbergsspaziergang",
    "book.exp_trail": "Ganztages-Weinpfad", "book.exp_dinner": "Abendessen beim Winzer",
    "book.perk_confirm": "Sofortige Bestätigung per E-Mail",
    "book.perk_cancel": "Kostenlose Stornierung bis 48 Std. vorher",
    "book.perk_loyalty": "VineClub-Treuepunkte gesammelt",
    "book.confirm_title": "Buchung bestätigt!",
    "book.confirm_desc": "Ihr Erlebnis ist reserviert. Eine Bestätigung wurde an Ihre E-Mail gesendet. Wir freuen uns darauf, Sie im Weingut zu begrüßen.",
    "vinemap.page_title": "WeinKarte — VineBond",
    "vinemap.section_label": "Interaktive Weinkarte",
    "vinemap.section_title": "Rheingau — Grosses Gewächs & Erstes Gewächs",
    "vinemap.section_subtitle": "Entdecken Sie die präzisen Weinberglagen Deutschlands renommiertester Weißweinregion. Klicken Sie auf einen Marker für Terroir-Details und Buchungsoptionen.",
    "vinemap.legend_gg": "Grosses Gewächs (GG)", "vinemap.legend_1g": "Erstes Gewächs (1G)",
    "vinemap.filter_all": "Alle Lagen", "vinemap.filter_gg": "Nur GG", "vinemap.filter_1g": "Nur 1G",
    "vinemap.popup_estate": "Weingut", "vinemap.popup_grape": "Hauptrebsorte",
    "vinemap.popup_soil": "Bodentyp", "vinemap.popup_book": "Besuch buchen",
    "vinemap.filter_label": "Filter:",
    "vinemap.trail_rheingau": "Rheingauer Riesling-Pfad", "vinemap.trail_burgundy": "Burgund-Pfad",
    "vinemap.trail_bordeaux": "Bordeaux-Route", "vinemap.trail_tuscany": "Via della Vendemmia, Toskana",
    "vinemap.trail_armenia": "Armenische Hochlandroute",
    "vinemap.gg_title": "Grosses Gew\u00e4chs (GG)",
    "vinemap.gg_desc": "Deutschlands h\u00f6chste Klassifizierung f\u00fcr trockene Weine, vergleichbar mit Grand Cru. Wird nur an Weinberge mit au\u00dfergew\u00f6hnlichem Terroir und VDP-Mitgliedsbetriebe vergeben.",
    "vinemap.gg_stat": "10 GG-Lagen",
    "vinemap.1g_title": "Erstes Gew\u00e4chs (1G)",
    "vinemap.1g_desc": "Die rheingauspezifische \"Erstes Gew\u00e4chs\"-Klassifizierung, die dem nationalen GG-System vorausgeht. Umfasst historische Zisterzienser- und Gutsweing\u00fcter mit dokumentierter Herkunft seit dem 12. Jahrhundert.",
    "vinemap.1g_stat": "4 1G-Lagen",
    "vinemap.terroir_title": "Rheingauer Terroir",
    "vinemap.terroir_desc": "S\u00fcdh\u00e4nge oberhalb des Rheins zwischen R\u00fcdesheim und Hochheim. Phyllitschiefer, Quarzit, L\u00f6ss und Kalkstein pr\u00e4gen die Vielfalt hinter Deutschlands ber\u00fchmtesten Rieslings.",
    "vinemap.terroir_stat": "Phyllitschiefer",
    "winery.region_all": "Alle Regionen", "winery.region_tuscany": "Toskana", "winery.results_suffix": "Weing\u00fcter gefunden",
    "book.step1_title": "1 \u2014 Weingut & Erlebnis", "book.step2_title": "2 \u2014 Datum & G\u00e4ste", "book.step3_title": "3 \u2014 Ihre Angaben",
    "book.winery_placeholder": "\u2014 Weingut w\u00e4hlen \u2014",
    "book.guest_opt_1": "1 Gast", "book.guest_opt_2": "2 G\u00e4ste", "book.guest_opt_3": "3 G\u00e4ste",
    "book.guest_opt_4": "4 G\u00e4ste", "book.guest_opt_5": "5 G\u00e4ste", "book.guest_opt_6": "6 G\u00e4ste",
    "book.guest_opt_7_10": "7\u201310 G\u00e4ste", "book.guest_opt_11_20": "11\u201320 G\u00e4ste",
    "book.incl_vat": "inkl. MwSt.", "book.return_home": "Zur Startseite",
    "login.page_title": "Anmelden \u2014 VineBond",
    "login.scenic_title": "Ihre Reise in die Welt<br/><span>edler Weine</span> beginnt",
    "login.scenic_desc": "Exklusive Weingutserlebnisse entdecken, Treue-Abzeichen sammeln und Terroir-Geschichten von Weing\u00fctern weltweit erkunden.",
    "login.pill_wineries": "\u00dcber 340 zertifizierte Weing\u00fcter weltweit",
    "login.pill_booking": "Sofortige Buchung mit kostenloser Stornierung",
    "login.pill_rewards": "VineClub-Abzeichen & exklusive Pr\u00e4mien sammeln",
    "login.label_welcome": "Willkommen bei VineBond",
    "login.title_unified": "Anmelden oder Konto erstellen",
    "login.subtitle_unified": "Geben Sie Ihre E-Mail-Adresse ein, um sich anzumelden. Falls Sie noch kein Konto haben, helfen wir Ihnen bei der Erstellung.",
    "login.email_label": "E-Mail-Adresse", "login.email_placeholder": "ihre@email.com",
    "login.email_error": "Bitte geben Sie eine g\u00fcltige E-Mail-Adresse ein.",
    "login.cta_continue_email": "Mit E-Mail fortfahren",
    "login.divider_or_social": "oder mit",
    "login.social_google": "Mit Google fortfahren", "login.social_apple": "Mit Apple fortfahren", "login.social_facebook": "Mit Facebook fortfahren",
    "login.guest_continue": "Als Gast fortfahren",
    "login.legal_notice": "Mit der Anmeldung oder Kontoerstellung stimmen Sie unseren <a href=\"#\">Nutzungsbedingungen</a> und der <a href=\"#\">Datenschutzerkl\u00e4rung</a> zu.<br/>Nur f\u00fcr Erwachsene ab 18 Jahren. Bitte genie\u00dfen Sie verantwortungsbewusst.",
    "login.label_verify": "E-Mail best\u00e4tigen", "login.title_verify": "Pr\u00fcfen Sie Ihren Posteingang",
    "login.subtitle_verify": "Wir haben einen 6-stelligen Best\u00e4tigungscode gesendet an:",
    "login.otp_error": "Ung\u00fcltiger Code. Bitte versuchen Sie es erneut.", "login.cta_verify": "E-Mail best\u00e4tigen",
    "login.spam_tip": "Pr\u00fcfen Sie Ihren Spam-Ordner", "login.resend_code": "Neuen Code anfordern",
    "login.back_to_signin": "Zur\u00fcck zur Anmeldung",
    "hero.title_html": "Die feinsten<br/><span>Weinerlebnisse</span> der Welt",
    "hero.dest_placeholder": "Reiseziel ausw\u00e4hlen\u2026",
    "hero.exp_cellar_tasting": "Kellerverkostung", "hero.exp_walk_tasting": "Weinbergswanderung & Verkostung",
    "hero.exp_full_day_trail": "Ganztages-Weinpfad", "hero.exp_harvest": "Leseerlebnis",
    "hero.exp_winemaker_dinner": "Abendessen beim Winzer",
    "hero.guest_1": "1 Gast", "hero.guest_2": "2 G\u00e4ste", "hero.guest_3": "3 G\u00e4ste",
    "hero.guest_4": "4 G\u00e4ste", "hero.guest_5p": "5+ G\u00e4ste",
    "vinemap.trail_napa": "Napa-Valley-Route", "vinemap.trail_rioja": "Rioja-Pfad",
    "footer.link_trails": "Weinpfade", "footer.link_terroir": "Terroir-Browser",
    "footer.link_experiences": "Erlebnisse", "footer.link_group": "Gruppenverkostungen",
    "footer.link_gifts": "Geschenkkarten", "footer.link_vineclub": "VineClub",
    "footer.link_about": "\u00dcber uns", "footer.link_sustainability": "Nachhaltigkeit",
    "footer.link_careers": "Karriere", "footer.link_contact": "Kontakt",
    "a11y.skip_to_content": "Zum Inhalt springen",
    "hero.page_title": "VineBond \u2014 Verbindung zu Weing\u00fctern weltweit",
    "filter.visitors_intimate": "Intim (1\u20134)", "filter.visitors_small": "Kleingruppe (5\u201310)",
    "filter.visitors_medium": "Mittelgro\u00df (11\u201320)", "filter.visitors_large": "Gro\u00df (20+)",
    "filter.wine_red_cab": "Rot \u2014 Cabernet Sauvignon", "filter.wine_red_pinot": "Rot \u2014 Pinot Noir",
    "filter.wine_white_chard": "Wei\u00df \u2014 Chardonnay", "filter.wine_white_sauv": "Wei\u00df \u2014 Sauvignon Blanc",
    "filter.wine_rose": "Ros\u00e9", "filter.wine_sparkling": "Schaumwein", "filter.wine_orange": "Orange / Naturwein",
    "book.form_name_placeholder": "Ihr vollst\u00e4ndiger Name",
    "book.form_email_placeholder": "ihre@email.com",
    "book.form_phone_placeholder": "+49 6722 \u2026"
  }
};

/* ─────────────────────────────────────────────── */

class VineBondI18n {
  constructor() {
    this.lang = localStorage.getItem('vb_lang') || this._detectBrowserLang();
    this.data = {};
  }

  _detectBrowserLang() {
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return browser === 'de' ? 'de' : 'en';
  }

  async init() {
    // 1 · Apply embedded fallback immediately — eliminates language flash on every page load
    this.data = VB_TRANSLATIONS_FALLBACK;
    this._apply();
    this._bindToggle();
    this._bindSearch();
    // Reveal page (was hidden by html.i18n-loading CSS rule set in <head>)
    document.documentElement.classList.remove('i18n-loading');
    document.dispatchEvent(new CustomEvent('vb:i18n:ready', { detail: { lang: this.lang } }));

    // 2 · Silently upgrade data with JSON for future setLang() calls — no re-render needed
    // (embedded fallback is kept in sync with JSON, so re-applying would be identical)
    try {
      const res = await fetch('assets/i18n/translations.json?v=3');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const freshData = await res.json();
      // Merge so fallback keys not in JSON are preserved
      this.data = {
        en: Object.assign({}, VB_TRANSLATIONS_FALLBACK.en, freshData.en || {}),
        de: Object.assign({}, VB_TRANSLATIONS_FALLBACK.de, freshData.de || {})
      };
      this._apply();
    } catch (_) { /* already using embedded fallback, no action needed */ }
  }

  /** Translate a key with optional {{var}} interpolation.
   *  Returns fallback chain: current lang → EN → key itself.
   *  Usage: i18n.t('guests_summary', { adults: 2, children: 0, rooms: 1 })
   */
  t(key, vars) {
    let str = (this.data[this.lang] || {})[key]
           || (this.data['en'] || {})[key]
           || key;
    if (vars && typeof str === 'string') {
      Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp('\\{\\{\\s*' + k + '\\s*\\}\\}', 'g'), vars[k]);
      });
    }
    return str;
  }

  setLang(lang) {
    if (!this.data[lang]) return;
    this.lang = lang;
    localStorage.setItem('vb_lang', lang);
    this._apply();
    document.querySelectorAll('.lang-option').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.lang === lang)
    );
    document.dispatchEvent(new CustomEvent('vb:i18n:changed', { detail: { lang } }));
  }

  _apply() {
    // Suppress all CSS transitions during text replacement
    // to prevent animated layout jumps when switching languages
    document.documentElement.classList.add('i18n-switching');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.dataset.i18nTitle);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.dataset.i18nAriaLabel));
    });
    const pageTitleKey = document.body && document.body.dataset.i18nPageTitle;
    if (pageTitleKey) document.title = this.t(pageTitleKey);
    // RTL/LTR — the only permitted structural change on language switch (Rule 4)
    const _RTL = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = _RTL.includes(this.lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = this.lang;
    document.querySelectorAll('.lang-option').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.lang === this.lang)
    );

    // Re-enable transitions after the browser paints the new text
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('i18n-switching');
    });
  }

  _bindToggle() {
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
    });
  }

  /** Search bar: on Enter navigate to winery.html?q=term */
  _bindSearch() {
    const input = document.getElementById('winerySearch');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `winery.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
    // Live filter on winery.html
    if (window.location.pathname.includes('winery')) {
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        document.querySelectorAll('.winery-card').forEach(card => {
          const name = (card.dataset.name || '').toLowerCase();
          const region = (card.dataset.region || '').toLowerCase();
          card.style.display = (!q || name.includes(q) || region.includes(q)) ? '' : 'none';
        });
      });
    }
  }
}

/* Init on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new VineBondI18n();
  window.i18n.init();
});
