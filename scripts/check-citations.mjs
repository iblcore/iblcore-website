import assert from "node:assert/strict";

// The pages that cite anything render it from one partial and style it with
// one set of rules. Renaming the classes on one side only leaves the other
// side unstyled while the build still passes, which is how the BrainWideBench
// page lost its citation styling, so the contract is asserted on both kinds of
// page rather than on the one that happened to be edited.
const ROUTES = [
  "/resources/benchmarking/ibl-brainwidebench/",
  "/resources/data/brainwide-map/",
];

/**
 * Check that every page carrying citations renders them styled and usable.
 *
 * Assertions are on computed style rather than on class names, so a class that
 * is emitted but has no rule behind it fails here instead of shipping.
 */
export async function checkCitations(browser, origin) {
  const page = await browser.newPage();
  try {
    for (const route of ROUTES) {
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      const entries = page.locator("[data-citation]");
      assert(await entries.count() > 0, `${route}: no citation entries rendered`);

      const styles = await entries.first().evaluate((item) => {
        const kind = item.querySelector("[class$='__kind']");
        const bibtex = item.querySelector("pre");
        const style = getComputedStyle(item);
        return {
          background: style.backgroundColor,
          padding: style.paddingTop,
          kindTransform: kind ? getComputedStyle(kind).textTransform : null,
          bibtexWhiteSpace: bibtex ? getComputedStyle(bibtex).whiteSpace : null,
        };
      });

      assert.notEqual(styles.background, "rgba(0, 0, 0, 0)", `${route}: citation entry has no panel behind it`);
      assert.notEqual(styles.padding, "0px", `${route}: citation entry has no padding`);
      assert.equal(styles.kindTransform, "uppercase", `${route}: citation kind label is unstyled`);
      // Long author lists have no break opportunities, so an unwrapped entry
      // scrolls sideways on a phone.
      assert.equal(styles.bibtexWhiteSpace, "pre-wrap", `${route}: BibTeX entry is not wrapped`);

      // citation.js adds one pair of controls per entry. Two pairs means two
      // templates are emitting the same section.
      const buttons = entries.first().locator("button");
      assert.equal(await buttons.count(), 2, `${route}: expected one Copy and one Show control per citation`);
    }
  } finally {
    await page.close();
  }
  console.log(`Citation check passed (${ROUTES.length} page kinds).`);
}
