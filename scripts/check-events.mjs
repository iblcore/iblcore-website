import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const publicRoot = path.resolve("public");
const chromeCandidates = process.platform === "darwin"
  ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
  : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

const existingChrome = async () => {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  for (const candidate of chromeCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next system browser before using Playwright's managed browser.
    }
  }
  return undefined;
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const filePath = path.resolve(publicRoot, `.${pathname}`);
    if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    let body = await fs.readFile(filePath);
    if (requestUrl.searchParams.has("invalid-events") && pathname === "/events/index.html") {
      body = Buffer.from(body.toString("utf8").replace(
        /(<script type="application\/json" data-events-data>)[\s\S]*?(<\/script>)/,
        "$1{invalid-json$2",
      ));
    }
    if (requestUrl.searchParams.has("multiweek-events") && pathname === "/events/index.html") {
      const html = body.toString("utf8");
      body = Buffer.from(html.replace(
        /(<script type="application\/json" data-events-data>)([\s\S]*?)(<\/script>)/,
        (_, opening, json, closing) => `${opening}${JSON.stringify([
          ...JSON.parse(json),
          {
            id: "multi-week-test",
            name: "Multi-week test event",
            location: "London",
            latitude: 51.5074,
            longitude: -0.1278,
            start_date: "2026-07-01",
            end_date: "2026-07-12",
          },
        ])}${closing}`,
      ));
    }
    response.writeHead(200, { "content-type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream" });
    response.end(body);
  } catch (error) {
    response.writeHead(error?.code === "ENOENT" ? 404 : 500).end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const origin = `http://127.0.0.1:${address.port}`;
const executablePath = await existingChrome();
const browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

try {
  const page = await browser.newPage();
  await page.goto(`${origin}/events/`, { waitUntil: "networkidle" });

  const calendarButton = page.locator('[data-events-view-button="calendar"]');
  const mapButton = page.locator('[data-events-view-button="map"]');
  await calendarButton.waitFor({ state: "visible" });
  assert(await calendarButton.isEnabled(), "Calendar did not become available.");
  assert(await calendarButton.getAttribute("aria-pressed") === "true", "Calendar did not become the default view.");
  await mapButton.waitFor({ state: "visible" });
  assert(await mapButton.isEnabled(), "Map did not become available after its data loaded.");
  await mapButton.click();
  const onlineButton = page.locator("[data-events-map-online-button]");
  await onlineButton.waitFor({ state: "visible" });
  await onlineButton.click();
  assert(await onlineButton.evaluate((button) => button.classList.contains("is-selected")), "Online Events selection was not applied.");
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.waitForTimeout(100);
  assert(await onlineButton.evaluate((button) => button.classList.contains("is-selected")), "Online Events selection was lost after map rerender.");
  const eventData = JSON.parse(await page.locator("[data-events-data]").textContent());
  const onlineEvents = eventData.filter((event) => event.format === "online");
  const physicalEvents = eventData.filter((event) => event.format !== "online");
  assert(onlineEvents.length > 0, "No explicitly identified online event was found.");
  assert(physicalEvents.every((event) => (
    Number.isFinite(Number(event.latitude))
    && Number.isFinite(Number(event.longitude))
    && Number(event.latitude) >= -90
    && Number(event.latitude) <= 90
    && Number(event.longitude) >= -180
    && Number(event.longitude) <= 180
  )), "A physical event is missing valid coordinates.");
  const linkedOrganisers = eventData.flatMap((event) => event.co_organisers || []);
  assert(linkedOrganisers.every((organiser) => /^issue-\d+$/.test(organiser.profile_id)), "Event co-organisers do not use stable profile IDs.");
  assert(linkedOrganisers.every((organiser) => !organiser.profile_url && !organiser.name), "Event data still duplicates profile URLs or names.");
  const chiniLink = page.locator('.event-card__co-organisers a[href*="#profile-issue-210"]').first();
  const acneiLink = page.locator('.event-card__co-organisers a[href*="#profile-issue-236"]').first();
  assert(await chiniLink.textContent() === "Mattia Chini", "Mattia Chini's name was not resolved from project data.");
  assert(await acneiLink.textContent() === "ACNEI", "ACNEI's short name was not resolved from project data.");

  const upcomingFilter = page.locator('[data-events-status-filter="upcoming"]');
  await upcomingFilter.click();
  assert(await upcomingFilter.getAttribute("aria-pressed") === "true", "The Upcoming filter is not interactive.");
  const upcomingTop = await page.locator('[data-events-status-group="upcoming"]').evaluate((element) => element.getBoundingClientRect().top);
  const pastFilter = page.locator('[data-events-status-filter="past"]');
  await pastFilter.click();
  const pastTop = await page.locator('[data-events-status-group="past"]').evaluate((element) => element.getBoundingClientRect().top);
  assert(Math.abs(upcomingTop - pastTop) < 1, "Upcoming and Past lists do not start at the same vertical position.");
  await upcomingFilter.click();
  await calendarButton.click();
  await page.locator('button[aria-label^="November 2026,"]').click();
  const calendarGroup = page.locator('.events-calendar__grid[role="group"]');
  assert(await calendarGroup.count() === 1, "The expanded calendar is not exposed as an accessible group.");
  assert(await page.locator('.events-calendar__grid[role="grid"]').count() === 0, "The visual calendar still uses invalid grid semantics.");
  assert(await page.locator('[role="columnheader"], [role="gridcell"]').count() === 0, "Invalid calendar child roles remain.");
  assert(await page.locator('[data-calendar-selection][role="region"] .event-card').count() === 1, "The selected month does not provide an accessible event list.");
  await page.close();

  const multiweekPage = await browser.newPage();
  await multiweekPage.goto(`${origin}/events/?multiweek-events=1`, { waitUntil: "networkidle" });
  await multiweekPage.locator('[data-events-view-button="calendar"]').waitFor({ state: "visible" });
  await multiweekPage.locator('button[aria-label^="July 2026,"]').click();
  assert(await multiweekPage.locator('[data-calendar-event-id="multi-week-test"]').count() === 2, "A multi-week event did not render all calendar segments.");
  assert(await multiweekPage.locator('button[data-calendar-event-id="multi-week-test"]').count() === 1, "A multi-week event rendered multiple interactive buttons.");
  assert(await multiweekPage.locator('span.events-calendar__event-continuation[data-calendar-event-id="multi-week-test"]').count() === 1, "A multi-week continuation is not a non-interactive visual segment.");
  await multiweekPage.close();

  const fallbackPage = await browser.newPage();
  await fallbackPage.goto(`${origin}/events/?invalid-events=1`, { waitUntil: "networkidle" });
  assert(await fallbackPage.locator('[data-events-view-panel="list"]').isVisible(), "List fallback is not visible when event data is invalid.");
  assert(await fallbackPage.locator('[data-events-view-button="list"]').getAttribute("aria-pressed") === "true", "List is not the fallback view.");
  assert(await fallbackPage.locator('[data-events-view-button="calendar"]').isHidden(), "Unavailable Calendar control should stay hidden.");
  assert(await fallbackPage.locator('[data-events-view-button="map"]').isHidden(), "Unavailable Map control should stay hidden.");
  assert(await fallbackPage.locator("[data-events-enhanced-controls]").isHidden(), "Unavailable filters should stay hidden.");
  await fallbackPage.close();

  const mapFallbackPage = await browser.newPage();
  await mapFallbackPage.route("**/data/world-countries-110m.json", (route) => route.abort());
  await mapFallbackPage.goto(`${origin}/events/`, { waitUntil: "networkidle" });
  await mapFallbackPage.locator('[data-events-view-button="calendar"]').waitFor({ state: "visible" });
  assert(await mapFallbackPage.locator('[data-events-view-button="calendar"]').getAttribute("aria-pressed") === "true", "Calendar should remain the default when the map fails.");
  assert(await mapFallbackPage.locator('[data-events-view-button="map"]').isHidden(), "Unavailable Map control should stay hidden when map data fails.");
  await mapFallbackPage.close();

  const partnersPage = await browser.newPage();
  await partnersPage.goto(`${origin}/new-partner-projects/?view=list`, { waitUntil: "networkidle" });
  const partnerMapButton = partnersPage.locator('[data-project-view-button="map"]');
  await partnerMapButton.waitFor({ state: "visible" });
  assert(await partnerMapButton.isEnabled(), "The Partners map did not initialize through the shared map helper.");
  await partnerMapButton.click();
  assert(await partnersPage.locator('[data-project-view-panel="map"]').isVisible(), "The Partners map view did not open.");
  await partnersPage.locator(".new-partners-map__marker").first().waitFor({ state: "visible" });
  assert(await partnersPage.locator(".new-partners-map__marker").count() > 0, "The shared map helper did not render Partners map markers.");
  await partnersPage.close();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

console.log("Events interaction check passed (enhanced views and List fallback).");
