import assert from "node:assert/strict";

// Exercise the resource index's filtering and its no-JavaScript fallback.
// The predicate itself is unit tested; what needs a browser is whether the
// markup feeding it carries the right values, which a template change can
// break silently.
export async function checkResourceIndex(browser, origin) {
  const page = await browser.newPage();
  try {
    await page.goto(`${origin}/resources/`, { waitUntil: "networkidle" });

    // The grid alone: the workflows band holds cards of its own that the
    // filters never touch.
    const grid = ":not([data-workflows-band]) > .resource-cards > [data-resource-card]:not([hidden])";
    const shown = () => page.locator(grid).count();
    const names = () => page.locator(`${grid} .resource-card__title`).allInnerTexts();

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

    // Access routes are a property of datasets, so the row only makes sense
    // once Datasets is selected. It appears directly under Type and takes its
    // own selection with it when Datasets is deselected.
    const accessRow = page.locator('[data-filter-row="access"]');
    const labels = () =>
      page.locator("[data-resource-filters] .resource-filters__row:not([hidden]) .resource-filters__label").allInnerTexts();

    assert(await accessRow.isHidden(), "The access row was offered before Datasets was selected.");
    assert.deepEqual(
      await labels(),
      ["I want to...", "Type", "Modality"],
      "Unexpected filter rows before Datasets was selected.",
    );

    await page.click('[data-filter-group="type"][data-filter-value="data"]');
    assert(await accessRow.isVisible(), "Selecting Datasets did not reveal the access row.");
    assert.deepEqual(
      await labels(),
      ["I want to...", "Type", "Access route", "Modality"],
      "The access row did not sit directly under Type.",
    );

    await page.locator('[data-filter-group="access"][data-filter-value="dandi"]').first().click();
    const viaDandi = await shown();
    assert(viaDandi > 0 && viaDandi < total, "The access chip did not narrow the grid.");

    await page.click('[data-filter-group="type"][data-filter-value="data"]');
    assert(await accessRow.isHidden(), "Deselecting Datasets left the access row on screen.");
    assert.equal(await shown(), total, "Deselecting Datasets kept its access filter applied.");

    // A workflow answers a goal, so the goal row narrows the band as well as
    // the grid. Nothing else does.
    const bandTitles = () =>
      page.locator("[data-workflows-band] [data-resource-card]:not([hidden]) .resource-card__title").allInnerTexts();
    const everyWorkflow = await bandTitles();
    assert(everyWorkflow.length > 1, "The workflows band needs more than one card to be worth checking.");

    const benchmark = page.locator('[data-filter-group="stage"][data-filter-value="benchmark"]').first();
    await benchmark.click();
    assert.deepEqual(
      await bandTitles(),
      ["Benchmark a model on brain-wide recordings"],
      "The goal row did not narrow the workflows band.",
    );

    // The goal row is offered once, with the workflows, and narrows the grid
    // below it from there.
    const benchmarkChips = page.locator('[data-resource-filters] [data-filter-group="stage"][data-filter-value="benchmark"]');
    assert.equal(await benchmarkChips.count(), 1, "The goal row should be offered once, with the workflows.");
    assert.equal(await benchmark.getAttribute("aria-pressed"), "true", "The goal chip did not mark itself.");
    const viaBenchmark = await shown();
    assert(viaBenchmark > 0 && viaBenchmark < total, "The goal chip did not narrow the grid below the workflows.");

    await benchmark.click();
    assert.equal(await benchmark.getAttribute("aria-pressed"), "false", "Releasing the goal chip did not unmark it.");
    assert.equal(await shown(), total, "Releasing the goal chip left the grid narrowed.");
    assert.deepEqual(await bandTitles(), everyWorkflow, "Releasing the goal chip left workflows hidden.");

    // Groups intersect, and an impossible combination shows the empty state.
    await page.click('[data-filter-group="type"][data-filter-value="tools"]');
    const tools = await shown();
    assert(tools > 0 && tools < total, "The type chip did not narrow the grid.");
    assert.equal(new URL(page.url()).pathname, "/resources/tools/", "The chip did not name its view in the URL.");

    await page.fill("#resource-search-input", "zzzznothing");
    assert.equal(await shown(), 0, "An impossible filter still showed cards.");
    assert(await page.locator("[data-resource-empty]").isVisible(), "The empty state did not appear.");
    assert.deepEqual(
      await bandTitles(),
      everyWorkflow,
      "A type chip, and a search matching nothing, should leave the workflows band whole.",
    );
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
    assert(
      await page.locator('[data-filter-row="access"]').isVisible(),
      "The access row was hidden without a script to reveal it.",
    );
    const chip = page.locator('[data-filter-group="type"][data-filter-value="tools"]').first();
    assert.equal(await chip.getAttribute("href"), "/resources/tools/", "A chip is not a link to its section page.");
  } finally {
    await context.close();
  }

  console.log("Resource index check passed (filters, search, and no-script fallback).");
}

// Text the same colour as what it sits on is invisible but passes every
// behavioural check: the markup is correct and Playwright still reports it
// visible with a real bounding box. The portal's sections sit on a dark band
// while its cards are white, so a rule written for one surface disappears on
// the other. Measure contrast instead of trusting either.
const PORTAL_ROUTES = [
  "/resources/", "/resources/workflows/", "/resources/workflows/explore-ibl-data/",
  "/resources/workflows/benchmark-a-model/",
  "/resources/data/", "/resources/data/brainwide-map/", "/resources/tools/",
  "/resources/tools/alyx/", "/resources/hardware/", "/resources/stages/",
  "/resources/stages/analyse/", "/resources/stages/benchmark/",
  "/resources/modalities/neuropixels/", "/resources/access-routes/dandi/",
  "/resources/protocols/", "/resources/tools/brainwide-bench/",
  "/resources/tools/data-explorer/",
];

// WCAG relative luminance; 3:1 is the large-text floor, so anything below it is
// a genuine defect rather than a borderline choice.
const MIN_CONTRAST = 3;

export async function checkResourceContrast(browser, origin) {
  const page = await browser.newPage();
  try {
    for (const route of PORTAL_ROUTES) {
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      const failures = await page.evaluate((min) => {
        const parse = (colour) => (colour.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
        const luminance = ([r, g, b]) => {
          const channel = (c) => {
            const v = c / 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        };
        const backgroundOf = (element) => {
          for (let node = element; node; node = node.parentElement) {
            const background = getComputedStyle(node).backgroundColor;
            if (background && !background.startsWith("rgba(0, 0, 0, 0)")) return parse(background);
          }
          return [255, 255, 255];
        };
        return [...document.querySelectorAll("main *")]
          .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
          .filter((el) => el.getBoundingClientRect().width > 0)
          .map((el) => {
            const [lighter, darker] = [
              luminance(parse(getComputedStyle(el).color)),
              luminance(backgroundOf(el)),
            ].sort((a, b) => b - a);
            return {
              ratio: (lighter + 0.05) / (darker + 0.05),
              where: el.className || el.tagName,
              text: el.textContent.trim().slice(0, 40),
            };
          })
          .filter((row) => row.ratio < min);
      }, MIN_CONTRAST);

      assert.equal(
        failures.length,
        0,
        `${route}: unreadable text — ${failures
          .map((f) => `"${f.text}" (${f.where}, ${f.ratio.toFixed(2)}:1)`)
          .join("; ")}`,
      );
    }
  } finally {
    await page.close();
  }

  console.log(`Resource contrast check passed (${PORTAL_ROUTES.length} pages).`);
}
