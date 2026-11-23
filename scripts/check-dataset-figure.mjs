import assert from "node:assert/strict";

// A looping clip is opted into, not switched off after the fact: the markup
// carries no autoplay and no preload, so a visitor who has asked for reduced
// motion neither sees the motion nor pays for the file behind it, and every
// visitor can stop it. Both pages that carry a clip are checked, because the
// behaviour comes from one shared script.
const CLIP_PAGES = [
  "/resources/data/brainwide-map/",
  "/resources/benchmarking/ibl-brainwidebench/",
];

const settle = (page) => page.waitForTimeout(600);

/**
 * Check that auto-playing clips honour a reduced-motion preference.
 *
 * Asserts on the network as well as on playback: hiding a clip in CSS stops
 * the motion but still downloads megabytes the visitor will never see.
 */
export async function checkDatasetFigure(browser, origin) {
  for (const route of CLIP_PAGES) {
    for (const reducedMotion of ["reduce", "no-preference"]) {
      const page = await browser.newPage();
      const clipRequests = [];
      page.on("request", (request) => {
        if (/\.mp4(\?|#|$)/.test(request.url())) clipRequests.push(request.url());
      });
      try {
        await page.emulateMedia({ reducedMotion });
        await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
        const clip = page.locator("video").first();
        assert.equal(await clip.count(), 1, `${route}: expected one clip`);
        // Evaluated rather than scrolled to, because today's reduced-motion
        // handling hides the clip in CSS: a visibility-bound action would time
        // out instead of reporting what the clip is doing.
        await clip.evaluate((node) => node.scrollIntoView({ block: "center" }));
        await settle(page);

        const state = await clip.evaluate((node) => ({
          paused: node.paused,
          controls: node.controls,
          preload: node.getAttribute("preload"),
          markupAutoplay: node.outerHTML.includes(" autoplay"),
        }));

        assert(state.controls, `${route}: the clip has no controls, so it cannot be stopped`);

        if (reducedMotion === "reduce") {
          // The script returns early here, so the element still carries
          // exactly what the markup shipped: this is where the served shape
          // can be asserted without JavaScript having upgraded it.
          assert.equal(state.preload, "none", `${route}: the markup preloads, so it downloads before anyone asks`);
          assert(!state.markupAutoplay, `${route}: autoplay is in the markup, where a preference cannot gate it`);
          assert(state.paused, `${route}: the clip played despite a reduced-motion preference`);
          assert.equal(
            clipRequests.length, 0,
            `${route}: downloaded ${clipRequests.length} clip file(s) for a visitor who will never see them`,
          );
        } else {
          assert(!state.paused, `${route}: the clip did not start for a visitor who allows motion`);
          assert(clipRequests.length > 0, `${route}: the clip never loaded for a visitor who allows motion`);
        }
      } finally {
        await page.close();
      }
    }
  }
  console.log(`Clip check passed (${CLIP_PAGES.length} pages, both motion preferences).`);
}
