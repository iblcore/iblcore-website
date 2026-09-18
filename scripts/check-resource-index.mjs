import assert from "node:assert/strict";

// Exercise the resource index's filtering and its no-JavaScript fallback.
// The predicate itself is unit tested; what needs a browser is whether the
// markup feeding it carries the right values, which a template change can
// break silently.
export async function checkResourceIndex(browser, origin) {
  const page = await browser.newPage();
  try {
    await page.goto(`${origin}/resources/`, { waitUntil: "networkidle" });

    const shown = () => page.locator("[data-resource-card]:not([hidden])").count();
    const names = () =>
      page.locator("[data-resource-card]:not([hidden]) .resource-card__title").allInnerTexts();

    const total = await shown();
    assert(total > 0, "The resource index rendered no cards.");
    assert(await page.locator("[data-resource-search]").isVisible(), "The search box stayed hidden.");

    // A tag must be searchable even when the word appears nowhere in the prose:
    // Brainwide Map carries video as a modality only.
    await page.fill("#resource-search-input", "video");
    assert(
      (await names()).includes("Brainwide Map"),
      "Searching a modality term missed a resource that carries it only as a tag.",
    );

    await page.fill("#resource-search-input", "");
    assert.equal(await shown(), total, "Clearing the search did not restore every card.");

    // Groups intersect, and an impossible combination shows the empty state.
    await page.click('[data-filter-group="type"][data-filter-value="tools"]');
    const tools = await shown();
    assert(tools > 0 && tools < total, "The type chip did not narrow the grid.");
    assert.equal(new URL(page.url()).pathname, "/resources/tools/", "The chip did not name its view in the URL.");

    await page.fill("#resource-search-input", "zzzznothing");
    assert.equal(await shown(), 0, "An impossible filter still showed cards.");
    assert(await page.locator("[data-resource-empty]").isVisible(), "The empty state did not appear.");
  } finally {
    await page.close();
  }

  // Without JavaScript the grid is complete and the chips are ordinary links.
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${origin}/resources/`, { waitUntil: "load" });
    assert(
      (await page.locator("[data-resource-card]:not([hidden])").count()) > 0,
      "The index listed nothing without JavaScript.",
    );
    assert(await page.locator("[data-resource-search]").isHidden(), "The search box was offered without a script to run it.");
    const chip = page.locator('[data-filter-group="type"][data-filter-value="tools"]').first();
    assert.equal(await chip.getAttribute("href"), "/resources/tools/", "A chip is not a link to its section page.");
  } finally {
    await context.close();
  }

  console.log("Resource index check passed (filters, search, and no-script fallback).");
}
