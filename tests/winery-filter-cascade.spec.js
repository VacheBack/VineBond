// tests/winery-filter-cascade.spec.js
// VineBond — Cascading Filter Dropdowns (winery.html)
//
// Traceability matrix:
//   TC-01  Village=Assmannshausen hides Riesling in Grape dropdown          FR-1, FR-2
//   TC-02  Village=Assmannshausen shows Spätburgunder in Grape dropdown     FR-1, FR-6
//   TC-03  Village=Assmannshausen hides 1G in Classification dropdown       FR-1, FR-2
//   TC-04  Grape=Riesling hides Assmannshausen in Village dropdown          FR-1, FR-2
//   TC-05  Grape=Riesling keeps GG and 1G visible in Classification         FR-1, FR-6
//   TC-06  Checked option stays visible when context count drops to 0       FR-3
//   TC-07  Unchecking a filter reveals previously hidden options            FR-4
//   TC-08  Clear All restores all options in all dropdowns                  FR-5
//   TC-09  Dropdown with zero visible options is hidden entirely            FR-7
//   TC-10  Results count is correct after filter                            FR-8
//   TC-11  Clear All button visible when active, hidden when none active    FR-9

const { test, expect } = require('@playwright/test');

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Navigate to winery.html with a clean localStorage (default dataset). */
async function goToWinery(page) {
  await page.goto('/winery.html');
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('vb_'))
      .forEach(k => localStorage.removeItem(k));
  });
  await page.reload();
  await page.waitForSelector('#filterDropdowns .filter-dropdown');
}

/**
 * Activate a filter option by directly setting the checkbox and dispatching
 * a change event via page.evaluate(). This works regardless of whether the
 * dropdown panel is visually open or hidden by CSS.
 */
async function checkFilter(page, key, value) {
  await page.evaluate(({ key, value }) => {
    const panel = document.querySelector(
      `.filter-dropdown[data-filter-key="${key}"] .filter-dropdown-panel`
    );
    if (!panel) throw new Error(`Filter panel not found for key: ${key}`);
    const cb = panel.querySelector(`input[value="${value}"]`);
    if (!cb) throw new Error(`Checkbox not found: key=${key} value=${value}`);
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  }, { key, value });
}

/**
 * Deactivate a filter option.
 */
async function uncheckFilter(page, key, value) {
  await page.evaluate(({ key, value }) => {
    const panel = document.querySelector(
      `.filter-dropdown[data-filter-key="${key}"] .filter-dropdown-panel`
    );
    if (!panel) throw new Error(`Filter panel not found for key: ${key}`);
    const cb = panel.querySelector(`input[value="${value}"]`);
    if (!cb) throw new Error(`Checkbox not found: key=${key} value=${value}`);
    cb.checked = false;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  }, { key, value });
}

/**
 * Returns true if the label for `value` inside dropdown `key` is currently
 * visible (its inline display style is not 'none').
 */
async function isOptionVisible(page, key, value) {
  return page.evaluate(({ key, value }) => {
    const panel = document.querySelector(
      `.filter-dropdown[data-filter-key="${key}"] .filter-dropdown-panel`
    );
    if (!panel) return false;
    const labels = Array.from(panel.querySelectorAll('label'));
    const label = labels.find(l => {
      const cb = l.querySelector('input[type="checkbox"]');
      return cb && cb.value === value;
    });
    if (!label) return false;
    return label.style.display !== 'none';
  }, { key, value });
}

/**
 * Returns the text content of the count badge for a specific option,
 * or null if not found.
 */
async function getOptionCount(page, key, value) {
  return page.evaluate(({ key, value }) => {
    const panel = document.querySelector(
      `.filter-dropdown[data-filter-key="${key}"] .filter-dropdown-panel`
    );
    if (!panel) return null;
    const labels = Array.from(panel.querySelectorAll('label'));
    const label = labels.find(l => {
      const cb = l.querySelector('input[type="checkbox"]');
      return cb && cb.value === value;
    });
    if (!label) return null;
    const badge = label.querySelector('.panel-count');
    return badge ? badge.textContent : null;
  }, { key, value });
}

/**
 * Returns true if the entire dropdown wrapper for `key` is hidden (display:none).
 */
async function isDropdownHidden(page, key) {
  return page.evaluate((key) => {
    const dd = document.querySelector(`.filter-dropdown[data-filter-key="${key}"]`);
    if (!dd) return true;
    return dd.style.display === 'none';
  }, key);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Cascading filters — winery.html', () => {

  // TC-01 — FR-1, FR-2
  test('TC-01: Village=Assmannshausen hides Riesling in Grape dropdown', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'village', 'Assmannshausen');
    const rieslingVisible = await isOptionVisible(page, 'grape', 'Riesling');
    expect(rieslingVisible).toBe(false);
  });

  // TC-02 — FR-1, FR-6
  test('TC-02: Village=Assmannshausen keeps Spätburgunder visible in Grape dropdown', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'village', 'Assmannshausen');
    const spVisible = await isOptionVisible(page, 'grape', 'Spätburgunder (Pinot Noir)');
    expect(spVisible).toBe(true);
  });

  // TC-03 — FR-1, FR-2
  test('TC-03: Village=Assmannshausen hides 1G in Classification dropdown', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'village', 'Assmannshausen');
    const oneGVisible = await isOptionVisible(page, 'classification', '1G');
    expect(oneGVisible).toBe(false);
  });

  // TC-04 — FR-1, FR-2
  test('TC-04: Grape=Riesling hides Assmannshausen in Village dropdown', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'grape', 'Riesling');
    const assVisible = await isOptionVisible(page, 'village', 'Assmannshausen');
    expect(assVisible).toBe(false);
  });

  // TC-05 — FR-1, FR-6
  test('TC-05: Grape=Riesling keeps both GG and 1G visible in Classification dropdown', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'grape', 'Riesling');
    // Rüdesheim-1G and Hattenheim-1G both grow Riesling → both types must remain visible
    const ggVisible   = await isOptionVisible(page, 'classification', 'GG');
    const oneGVisible = await isOptionVisible(page, 'classification', '1G');
    expect(ggVisible).toBe(true);
    expect(oneGVisible).toBe(true);
  });

  // TC-06 — FR-3
  test('TC-06: Checked option stays visible with 0 badge when context count drops to zero', async ({ page }) => {
    await goToWinery(page);
    // Check two villages (multi-select OR logic)
    await checkFilter(page, 'village', 'Assmannshausen');
    await checkFilter(page, 'village', 'Johannisberg');
    // Add Grape=Riesling: Assmannshausen has no Riesling → its Village context count = 0
    // BUT Assmannshausen IS checked, so it must remain visible with badge "0" (FR-3)
    await checkFilter(page, 'grape', 'Riesling');

    const assVisible = await isOptionVisible(page, 'village', 'Assmannshausen');
    expect(assVisible).toBe(true);

    const badgeText = await getOptionCount(page, 'village', 'Assmannshausen');
    expect(badgeText).toBe('0');
  });

  // TC-07 — FR-4
  test('TC-07: Unchecking a Village filter reveals previously hidden option in Grape', async ({ page }) => {
    await goToWinery(page);
    // Johannisberg has only Riesling → Spätburgunder gets hidden
    await checkFilter(page, 'village', 'Johannisberg');
    expect(await isOptionVisible(page, 'grape', 'Spätburgunder (Pinot Noir)')).toBe(false);

    // Uncheck → Spätburgunder must reappear
    await uncheckFilter(page, 'village', 'Johannisberg');
    expect(await isOptionVisible(page, 'grape', 'Spätburgunder (Pinot Noir)')).toBe(true);
  });

  // TC-08 — FR-5
  test('TC-08: Clear All restores all hidden options across all dropdowns', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'village', 'Assmannshausen');
    expect(await isOptionVisible(page, 'grape', 'Riesling')).toBe(false);

    await page.locator('#clearAllFilters').click();

    expect(await isOptionVisible(page, 'grape', 'Riesling')).toBe(true);
    expect(await isOptionVisible(page, 'grape', 'Spätburgunder (Pinot Noir)')).toBe(true);
    expect(await isOptionVisible(page, 'village', 'Assmannshausen')).toBe(true);
  });

  // TC-09 — FR-7
  test('TC-09: Incompatible filters hide Soil and Classification dropdowns entirely', async ({ page }) => {
    await goToWinery(page);
    // Assmannshausen (Spätburgunder, GG) + Riesling = 0 matching wineries
    // → Soil and Classification have 0 context wineries → 0 visible options → wrappers hidden
    await checkFilter(page, 'village', 'Assmannshausen');
    await checkFilter(page, 'grape', 'Riesling');

    expect(await isDropdownHidden(page, 'soil')).toBe(true);
    expect(await isDropdownHidden(page, 'classification')).toBe(true);
  });

  // TC-10 — FR-8
  test('TC-10: Results count shows 1 after selecting Village=Assmannshausen', async ({ page }) => {
    await goToWinery(page);
    await checkFilter(page, 'village', 'Assmannshausen');
    const count = await page.locator('#resultsCount').textContent();
    expect(count).toBe('1');
  });

  // TC-11 — FR-9
  test('TC-11: Clear All button appears when filter active, disappears after clear', async ({ page }) => {
    await goToWinery(page);
    const clearBtn = page.locator('#clearAllFilters');

    // No filter active → button must not have .visible
    expect(await clearBtn.evaluate(el => el.classList.contains('visible'))).toBe(false);

    // Activate a filter → button must appear
    await checkFilter(page, 'village', 'Assmannshausen');
    expect(await clearBtn.evaluate(el => el.classList.contains('visible'))).toBe(true);

    // Clear All → button must disappear
    await clearBtn.click();
    expect(await clearBtn.evaluate(el => el.classList.contains('visible'))).toBe(false);
  });

});
