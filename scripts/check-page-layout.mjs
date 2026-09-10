import assert from "node:assert/strict";

// Exercise the rendered contract shared by specialized and default layouts.
export async function checkPageLayout(browser, origin) {
  const page = await browser.newPage();
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      let reference;
      for (const route of [
        "/about/team/", "/about/strategic-priorities/", "/about/history/",
        "/about/support/", "/about/faq/", "/events/", "/projects/",
        "/new-partner-projects/", "/publications/", "/news/", "/categories/",
      ]) {
        await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
        assert.equal(await page.locator("h1").count(), 1, `${route}: one page title`);
        const styles = await page.locator(".page-header").evaluate((header) => {
          const title = header.querySelector("h1");
          const titleStyle = getComputedStyle(title);
          const banner = header.querySelector(".section-banner--intro");
          const copy = banner?.querySelector("p");
          const inner = banner?.querySelector(".section-banner__inner");
          return {
            title: [titleStyle.color, titleStyle.fontSize, titleStyle.fontWeight],
            banner: banner ? [getComputedStyle(banner).backgroundColor,
              getComputedStyle(banner).backgroundImage, getComputedStyle(banner).backdropFilter,
              getComputedStyle(copy || banner).color,
              getComputedStyle(inner).paddingTop, getComputedStyle(inner).paddingBottom] : null,
            titleBeforeBanner: !banner || title.getBoundingClientRect().bottom <= banner.getBoundingClientRect().top,
            fits: document.documentElement.scrollWidth <= innerWidth,
          };
        });
        reference ||= styles;
        assert.deepEqual(styles.title, reference.title, `${route}: shared title styling at ${width}px`);
        if (styles.banner) assert.deepEqual(styles.banner, reference.banner, `${route}: shared banner styling at ${width}px`);
        assert(styles.titleBeforeBanner, `${route}: title must sit above its banner`);
        assert(styles.fits, `${route}: horizontal overflow at ${width}px`);
      }

      await page.goto(`${origin}/new-partner-projects/?view=map&filter=affiliate`, { waitUntil: "networkidle" });
      assert.equal(await page.locator("h1").textContent(), "Affiliates");
      for (const view of ["list", "map"]) {
        await page.locator(`[data-project-view-button="${view}"]`).click();
        for (const [filter, title] of [["partner", "Partners"], ["affiliate", "Affiliates"], ["all", "Partners and Affiliates"]]) {
          await page.locator(`[data-project-filter="${filter}"]`).click();
          assert.equal(await page.locator("h1").textContent(), title);
          assert.equal(await page.locator(`[data-project-view-button="${view}"]`).getAttribute("aria-pressed"), "true");
          assert.equal(await page.locator(`[data-project-banner-content="${filter}"]`).getAttribute("aria-hidden"), "false");
        }
      }
      const controls = await page.locator(".page-controls").evaluate((bar) => getComputedStyle(bar).backgroundColor);
      assert.notEqual(controls, "rgb(255, 255, 255)", "Control bar must use the dark theme");
      await page.goto(`${origin}/events/`, { waitUntil: "networkidle" });
      assert.equal(await page.locator(".page-controls").evaluate((bar) => getComputedStyle(bar).backgroundColor), controls);
    }
  } finally {
    await page.close();
  }
  console.log("Shared page layout check passed (desktop, mobile, and Partners title switching).");
}
