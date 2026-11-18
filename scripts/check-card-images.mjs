import assert from "node:assert/strict";

// The card picture spans the card and the card's width varies with the grid.
// Serving the full-size artwork into it leaves the browser to downscale
// roughly five times at draw time, which turns hairline illustrations and
// small labels to mush. The pictures are processed to a set of candidate
// widths instead, so this asserts the file actually chosen is sized for the
// box it lands in rather than merely constrained by CSS.
const GRID = "/resources/data/";

// A 2x candidate is the largest a card ever needs; anything beyond that is the
// original being squeezed by the browser.
const MAX_DENSITY = 2;

// Two widths, because the picture is fluid and `sizes` has to describe the
// grid at both: a stale expression misfires at one width while looking right
// at the other.
const VIEWPORTS = [1280, 768];

/**
 * Check that every dataset card serves a picture sized for its box.
 *
 * Asserts on the chosen file rather than the markup, so a `srcset` that exists
 * but still points at the original is caught, and in both directions: too
 * large means the browser downscales at draw time, too small means it enlarges
 * a picture that was never big enough.
 */
export async function checkCardImages(browser, origin) {
  const page = await browser.newPage();
  try {
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${origin}${GRID}`, { waitUntil: "networkidle" });
      const images = page.locator("[data-resource-card] .resource-card__image img");
      const count = await images.count();
      assert(count > 0, `${GRID}: no card images rendered`);

      for (let index = 0; index < count; index += 1) {
        const image = images.nth(index);
        await image.scrollIntoViewIfNeeded();
        const measured = await image.evaluate(async (node) => {
          if (!node.complete) await node.decode();
          // naturalWidth on an element with "w" descriptors is corrected by
          // the density the browser derived, so it reports the box rather than
          // the file and would pass whatever was served. The chosen file is
          // measured on its own, where nothing corrects it.
          const probe = new Image();
          probe.src = node.currentSrc;
          await probe.decode();
          return {
            src: node.currentSrc,
            natural: probe.naturalWidth,
            box: Math.round(node.getBoundingClientRect().width),
            hasDimensions: node.hasAttribute("width") && node.hasAttribute("height"),
            hasSrcset: node.hasAttribute("srcset"),
          };
        });

        const where = `${measured.src.split("/").pop()} at ${width}px`;
        assert(
          measured.natural <= measured.box * MAX_DENSITY,
          `${where}: served at ${measured.natural}px into a ${measured.box}px box, ` +
            `so the browser downscales it ${(measured.natural / measured.box).toFixed(1)}x`,
        );
        assert(
          measured.natural >= measured.box,
          `${where}: served at ${measured.natural}px into a ${measured.box}px box, ` +
            `so the browser enlarges it even before screen density`,
        );
        assert(measured.hasDimensions, `${where}: no width/height attributes, so the card reflows as it loads`);
        assert(measured.hasSrcset, `${where}: no srcset, so the card cannot ask for the size it needs`);
      }
    }
  } finally {
    await page.close();
  }
  console.log("Card image check passed (dataset cards sized to their box).");
}
