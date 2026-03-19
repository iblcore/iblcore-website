import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.LANDING_BASE_URL || "http://127.0.0.1:1313/";
const outputDir = path.resolve("reports", "landing");

const viewports = [
  {
    name: "desktop",
    width: 1067,
    height: 768,
    fullPage: true,
  },
  {
    name: "wide",
    width: 1440,
    height: 768,
    fullPage: true,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
    fullPage: true,
  },
];

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(outputDir, `landing-${viewport.name}.png`),
      fullPage: viewport.fullPage,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Saved landing screenshots to ${outputDir}`);
