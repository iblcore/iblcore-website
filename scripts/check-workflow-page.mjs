import assert from "node:assert/strict";

// Exercise a workflow page's stepper, its dataset picker and the fork the
// picker drives. All of it is template and script behaviour over front matter,
// which a unit test cannot see.
export async function checkWorkflowPage(browser, origin) {
  const page = await browser.newPage();
  try {
    await page.goto(`${origin}/resources/workflows/explore-ibl-data/`, { waitUntil: "networkidle" });

    const stepTitles = await page.locator(".workflow-step__title").allInnerTexts();
    assert.deepEqual(
      stepTitles,
      ["Choose a dataset and access route", "Find the sessions you need", "Visualise what you load"],
      "The workflow no longer opens by choosing a dataset and its access route.",
    );

    const stepper = page.locator("[data-workflow-stepper]");
    assert(await stepper.isVisible(), "The workflow page has no stepper.");
    assert.deepEqual(
      await stepper.locator(".workflow-stepper__label").allInnerTexts(),
      stepTitles,
      "The stepper does not name every step in order.",
    );

    // Every stepper link must land on the step it names.
    for (const [index, title] of stepTitles.entries()) {
      const href = await stepper.locator("a").nth(index).getAttribute("href");
      const target = page.locator(href);
      assert.equal(await target.count(), 1, `The stepper link ${href} lands nowhere.`);
      assert.equal(
        (await target.locator(".workflow-step__title").innerText()),
        title,
        `The stepper link ${href} lands on the wrong step.`,
      );
    }

    const card = (slug) => page.locator(`[data-resource-card][data-path$="/${slug}"]`);
    const visible = (slug) => card(slug).isVisible();
    const guideRow = (slug, route) =>
      card(slug).locator(`.guide-row:has(.guide-row__name:text-is("${route}"))`);

    // Inside a workflow a dataset has to say what it is best for, which is
    // what short_description is.
    assert.match(
      await card("brainwide-map").locator("p:not([class])").first().innerText(),
      /Neuropixels/,
      "The step card did not describe the dataset.",
    );

    // Each dataset card offers one row per access route, and the row either
    // links its guide or says the guide is still to come.
    assert.equal(
      await card("brainwide-map").locator(".guide-row").count(),
      3,
      "The Brainwide Map is published through three routes, so it needs three guide rows.",
    );
    assert.equal(
      await guideRow("brainwide-map", "ONE").locator("a.guide-action--ready").getAttribute("href"),
      "https://int-brain-lab.github.io/iblenv/notebooks_external/data_release_brainwidemap.html",
      "The ONE guide row did not link the guide from the dataset's access_guides.",
    );
    assert(
      await guideRow("brainwide-map", "DANDI & NWB").locator(".guide-action--pending").isVisible(),
      "A route with no guide yet should still have a row saying so.",
    );
    assert.equal(
      await card("widefield").locator(".guide-row").count(),
      1,
      "Widefield is ONE only, so it needs one guide row.",
    );

    const picker = page.locator("[data-dataset-picker]");
    assert(await picker.isVisible(), "The chooser step offers no dataset picker.");
    const datasets = page.locator("[data-wf-select] option:not([value=''])");
    assert.equal(await datasets.count(), 5, "Every dataset in the chooser step needs an option.");

    // The route comparison: all three routes before anything is picked.
    const help = page.locator("[data-route-help]");
    const helpItem = (route) => help.locator(`[data-help-route="${route}"]`);
    assert(await help.isVisible(), "The route comparison is missing while there is a choice to make.");
    await help.locator("summary").click();
    for (const route of ["one", "dandi", "ibl-ai-agent"]) {
      assert(await helpItem(route).isVisible(), `${route} should be compared before a dataset is chosen.`);
    }
    assert.match(
      await helpItem("one").innerText(),
      /best for deep, IBL-specific analysis/,
      "The comparison did not use the route's own short description.",
    );

    // Modality shortens the dataset list without choosing for the reader.
    await page.selectOption("[data-wf-modality]", "neuropixels");
    assert.equal(
      await page.locator("[data-wf-select] option:not([value='']):not([hidden])").count(),
      3,
      "Three datasets include Neuropixels recordings.",
    );
    assert(await visible("brainwide-map"), "A Neuropixels dataset left the step.");
    assert(!(await visible("widefield")), "Widefield has no Neuropixels recordings.");
    assert.equal(await page.locator("[data-wf-select]").inputValue(), "", "Modality alone must not pick a dataset.");

    // A modality only one dataset has made the choice already.
    await page.selectOption("[data-wf-modality]", "widefield");
    assert.equal(
      await page.locator("[data-wf-select]").inputValue(),
      "/resources/data/widefield",
      "A modality matching one dataset should choose it.",
    );

    // The fork: the chosen dataset narrows the steps below to what works with
    // it, and says so in the URL.
    assert.equal(new URL(page.url()).search, "?dataset=widefield", "The choice is not in the URL.");
    assert(await visible("widefield"), "The chosen dataset disappeared from its own step.");
    assert(!(await visible("brainwide-map")), "The chooser step did not collapse to the chosen dataset.");
    assert(await visible("alyx"), "Alyx claims no datasets, so it applies to all of them.");
    assert(await visible("datoviz"), "Datoviz claims no datasets, so it applies to all of them.");
    assert(!(await visible("data-explorer")), "The Explorer is Brainwide Map only.");

    // Widefield is ONE only, so there is no route left to compare.
    assert(await help.isHidden(), "The route comparison stayed up with only one route in play.");
    assert.equal(
      await page.locator(".workflow-stepper__status").first().innerText(),
      "Widefield",
      "The overview does not say which dataset was chosen.",
    );

    // Two routes: the comparison returns, naming only those two.
    await page.selectOption("[data-wf-modality]", "");
    await page.selectOption("[data-wf-select]", "/resources/data/behavior");
    assert(await help.isVisible(), "Behavior is published two ways, so the comparison applies.");
    // Hiding the panel closed it, so reopen it to see which routes it kept.
    await help.locator("summary").click();
    assert(await helpItem("one").isVisible(), "ONE publishes Behavior.");
    assert(await helpItem("dandi").isVisible(), "DANDI publishes Behavior.");
    assert(await helpItem("ibl-ai-agent").isHidden(), "The AI Agent does not serve Behavior.");
    assert.match(
      await page.locator("[data-route-help-hint]").innerText(),
      /Compare ONE and DANDI & NWB\./,
      "The comparison does not name the two routes left in play.",
    );

    await page.click("[data-wf-clear]");
    assert(await visible("data-explorer"), "Clearing the choice did not restore the other steps.");
    assert.equal(new URL(page.url()).search, "", "Clearing the choice left it in the URL.");
    assert.equal(await page.locator(".workflow-stepper__status").first().innerText(), "");
  } finally {
    await page.close();
  }

  // A dataset in the URL arrives already narrowed, so a forked view can be linked.
  const linked = await browser.newPage();
  try {
    await linked.goto(`${origin}/resources/workflows/explore-ibl-data/?dataset=widefield`, { waitUntil: "networkidle" });
    assert(
      await linked.locator('[data-resource-card][data-path$="/data-explorer"]').isHidden(),
      "A dataset named in the URL did not narrow the page on arrival.",
    );
  } finally {
    await linked.close();
  }

  // Without a script the workflow is still the whole document.
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const plain = await context.newPage();
    await plain.goto(`${origin}/resources/workflows/explore-ibl-data/`, { waitUntil: "load" });
    assert(
      await plain.locator('[data-resource-card][data-path$="/data-explorer"]').isVisible(),
      "The no-script page hid a step's card.",
    );
    assert(
      await plain.locator("[data-dataset-picker]").isHidden(),
      "The picker was offered without a script to act on it.",
    );
    assert(
      await plain.locator("[data-route-help]").isVisible(),
      "The route comparison is static content and needs no script.",
    );
    assert(await plain.locator("[data-workflow-stepper]").isVisible(), "The stepper needs no script.");
  } finally {
    await context.close();
  }

  console.log("Workflow page check passed (stepper, dataset picker, guides and fork).");
}
