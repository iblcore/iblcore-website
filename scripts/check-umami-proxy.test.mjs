import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { collect, createCollector, tracker } from "../lib/umami-proxy.mjs";
import { PROXY_ORIGIN, TRACKED_SITES } from "../lib/umami-sites.mjs";

const primarySite = TRACKED_SITES.find((site) => site.origin === PROXY_ORIGIN);
const WEBSITE_ID = primarySite.websiteID;
const HOSTNAME = new URL(primarySite.origin).hostname;
const secondSite = { origin: "https://research.example", websiteID: "11111111-2222-3333-4444-555555555555", events: { resource_open: [] } };
const secondEvent = { type: "event", payload: { website: secondSite.websiteID, hostname: "research.example", url: `${secondSite.origin}/resources/`, title: "Research resources" } };

const event = { type: "event", payload: { website: WEBSITE_ID, hostname: HOSTNAME, url: "https://iblcore.org/events/", title: "Events", screen: "1440x900", language: "en", referrer: "" } };
function request(body = event, headers = {}, url = "https://iblcore.org/api/send", method = "POST") {
  return new Request(url, {
    method,
    headers: { Origin: "https://iblcore.org", "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.10", "User-Agent": "Visitor browser", ...headers },
    ...(method === "POST" ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  });
}

test("Hugo settings and invocation routes agree with the production guard", () => {
  const settings = parse(readFileSync("hugo.yaml", "utf8")).params.umami;
  assert.equal(settings.websiteID, WEBSITE_ID);
  assert.deepEqual(settings.domains, [HOSTNAME]);
  assert.equal(settings.scriptURL, "/t.js");
  assert.equal(settings.hostURL, `https://${HOSTNAME}`);
  assert.equal(settings.hostURL, PROXY_ORIGIN);
  assert.ok(!TRACKED_SITES.some((site) => site.origin === secondSite.origin), "The simulated site must not be enabled in production");
  const routes = JSON.parse(readFileSync("static/_routes.json", "utf8"));
  assert.deepEqual(routes.include, ["/t.js", "/api/send", "/api/send/"]);
  assert.deepEqual(routes.exclude, []);
});

test("pageviews and clicks preserve session headers, response, and trusted visitor identity", async (t) => {
  const sent = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    sent.push({ url, ...options });
    return new Response('{"cache":"next-session","disabled":false}', { headers: { "Content-Type": "application/json", "Set-Cookie": "upstream=secret", "Cache-Control": "public" } });
  });
  for (const payload of [event, { ...event, payload: { ...event.payload, name: "contact_click" } },
    { ...event, payload: { ...event.payload, name: "application_click", data: { event: "IBL Summer School 2027" } } }]) {
    const response = await collect(request(payload, { "x-umami-cache": "previous-session", Cookie: "private=1", Authorization: "Bearer private", "X-Forwarded-For": "spoofed", "x-umami-hostname": "spoofed" }));
    assert.deepEqual(await response.json(), { cache: "next-session", disabled: false });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Set-Cookie"), null);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), PROXY_ORIGIN);
    assert.equal(response.headers.get("Vary"), "Origin");
    assert.equal(response.headers.get("Access-Control-Allow-Credentials"), null);
    const outbound = sent.at(-1);
    assert.equal(outbound.url, "https://gateway.umami.is/api/send");
    assert.deepEqual(JSON.parse(outbound.body), payload);
    assert.equal(outbound.headers.get("X-Forwarded-For"), "203.0.113.10");
    assert.equal(outbound.headers.get("User-Agent"), "Visitor browser");
    assert.equal(outbound.headers.get("x-umami-cache"), "previous-session");
    assert.equal(outbound.headers.get("x-umami-hostname"), HOSTNAME);
    assert.equal(outbound.headers.get("Cookie"), null);
    assert.equal(outbound.headers.get("Authorization"), null);
    assert.equal(outbound.redirect, "manual");
    assert.ok(outbound.signal instanceof AbortSignal);
  }
  await collect(request(event, { "CF-Connecting-IPv6": "2001:db8::1" }));
  assert.equal(sent.at(-1).headers.get("X-Forwarded-For"), "2001:db8::1");
});

test("previews, cross-origin requests, invalid and oversized events never reach upstream", async (t) => {
  const outbound = t.mock.method(globalThis, "fetch", () => { throw Error("Must not reach upstream"); });
  const changed = (fields) => ({ ...event, payload: { ...event.payload, ...fields } });
  const cases = [
    [request(event, {}, "https://pr-23.pages.dev/api/send"), 404],
    [request(event, {}, "http://localhost/api/send"), 404],
    [request(event, {}, undefined, "GET"), 405],
    [request(event, { Origin: "https://pr-23.pages.dev" }), 403],
    [request(event, { Origin: "" }), 403],
    [request(event, { Origin: secondSite.origin, "Sec-Fetch-Site": "cross-site" }), 403],
    [request(event, { "Content-Type": "text/plain" }), 415],
    [request("{"), 400],
    [request(changed({ website: "another-website" })), 400],
    [request(changed({ hostname: "pr-23.pages.dev" })), 400],
    [request(changed({ url: "https://pr-23.pages.dev/" })), 400],
    [request(changed({ data: { email: "private" } })), 400],
    [request(changed({ name: "contact_click", data: { target: "mail@example.org" } })), 400],
    [request(changed({ name: "resource_link_click", data: { file: "data.zip" } })), 400],
    [request(changed({ name: "resource_link_click", data: { target: "github.com", Extra: "x" } })), 400],
    [request(changed({ name: "resource_link_click", data: { target: "x".repeat(201) } })), 400],
    [request(changed({ name: "resource_link_click", data: { target: "" } })), 400],
    [request(changed({ name: "resource_link_click", data: { target: 1 } })), 400],
    [request(changed({ name: "resource_link_click", data: [] })), 400],
    [request(changed({ toString: "invalid-property" })), 400],
    [request(changed({ name: "unapproved-event" })), 400],
    [request({ ...event, type: "identify" }), 400],
    [request(" ".repeat(8193)), 413],
    [request(event, { "Content-Length": "8193" }), 413],
    [request(event, { "CF-Connecting-IP": "" }), 503],
    [request(event, { "x-umami-cache": "x".repeat(4097) }), 400],
  ];
  for (const [incoming, status] of cases) {
    const response = await collect(incoming);
    assert.equal(response.status, status, `${incoming.url}: ${status}`);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
  assert.equal(outbound.mock.callCount(), 0);
});

test("registered sites get bounded CORS preflights without contacting upstream", async (t) => {
  const outbound = t.mock.method(globalThis, "fetch", () => { throw Error("Preflight must not reach upstream"); });
  const shared = createCollector([...TRACKED_SITES, secondSite]);
  const preflight = (origin, extra = {}, url) => request(undefined, {
    Origin: origin, "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "Content-Type, X-Umami-Website-Id, X-Umami-Hostname, X-Umami-Cache", ...extra,
  }, url, "OPTIONS");
  for (const origin of [PROXY_ORIGIN, secondSite.origin]) {
    const response = await shared(preflight(origin));
    assert.equal(response.status, 204);
    assert.equal(await response.text(), "");
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
    assert.equal(response.headers.get("Access-Control-Allow-Methods"), "POST");
    assert.match(response.headers.get("Access-Control-Allow-Headers"), /x-umami-cache/);
    assert.equal(response.headers.get("Access-Control-Allow-Credentials"), null);
    assert.match(response.headers.get("Vary"), /Origin/);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
  for (const incoming of [
    preflight("https://unapproved.example"), preflight("null"), preflight("https://research.example.attacker.test"),
    preflight(secondSite.origin, { "Access-Control-Request-Method": "DELETE" }),
    preflight(secondSite.origin, { "Access-Control-Request-Headers": "authorization" }),
  ]) assert.equal((await shared(incoming)).status, 403);
  const unknown = await shared(preflight("https://unapproved.example"));
  assert.equal(unknown.headers.get("Access-Control-Allow-Origin"), null);
  const preview = await shared(preflight(secondSite.origin, {}, "https://preview.pages.dev/api/send"));
  assert.equal(preview.status, 404);
  assert.equal(preview.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal(outbound.mock.callCount(), 0);
});

test("cross-site pageviews and events retain each site's identity, events, and session cache", async (t) => {
  const sent = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    sent.push({ url, ...options });
    return new Response('{"cache":"second-site-session","disabled":false}', { headers: { "Access-Control-Allow-Origin": "*", "Set-Cookie": "private=1" } });
  });
  const shared = createCollector([...TRACKED_SITES, secondSite]);
  for (const payload of [secondEvent, { ...secondEvent, payload: { ...secondEvent.payload, name: "resource_open" } },
    { ...secondEvent, payload: { ...secondEvent.payload, name: "resource_open", data: {} } }]) {
    const response = await shared(request(payload, { Origin: secondSite.origin, "Sec-Fetch-Site": "cross-site", "x-umami-cache": "previous-second-site-session" }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { cache: "second-site-session", disabled: false });
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), secondSite.origin);
    assert.equal(response.headers.get("Set-Cookie"), null);
    assert.equal(sent.at(-1).headers.get("x-umami-website-id"), secondSite.websiteID);
    assert.equal(sent.at(-1).headers.get("x-umami-hostname"), "research.example");
    assert.equal(sent.at(-1).headers.get("x-umami-cache"), "previous-second-site-session");
    assert.deepEqual(JSON.parse(sent.at(-1).body), payload);
  }
  const count = sent.length;
  for (const [body, origin] of [
    [event, secondSite.origin], [secondEvent, PROXY_ORIGIN],
    [{ ...secondEvent, payload: { ...secondEvent.payload, name: "application_click" } }, secondSite.origin],
    [{ ...secondEvent, payload: { ...secondEvent.payload, url: "https://preview.research.example/" } }, secondSite.origin],
    [{ ...secondEvent, payload: { ...secondEvent.payload, name: "resource_open", data: { item: "extra-property" } } }, secondSite.origin],
    [{ ...secondEvent, payload: { ...secondEvent.payload, name: "resource_open", data: [] } }, secondSite.origin],
  ]) assert.equal((await shared(request(body, { Origin: origin }))).status, 400);
  assert.equal(sent.length, count);
  assert.equal((await collect(request(secondEvent, { Origin: secondSite.origin }))).status, 403, "Test site is never registered in production");
});

test("CORS is preserved on validation and upstream failures for approved sites", async (t) => {
  const shared = createCollector([...TRACKED_SITES, secondSite]);
  const mocked = t.mock.method(globalThis, "fetch", async () => new Response("limited", { status: 429 }));
  for (const body of [secondEvent, "invalid JSON"]) {
    const response = await shared(request(body, { Origin: secondSite.origin }));
    assert.equal(response.status, body === secondEvent ? 429 : 400);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), secondSite.origin);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
  mocked.mock.mockImplementation(async () => { throw Error("timeout"); });
  const failure = await shared(request(secondEvent, { Origin: secondSite.origin }));
  assert.equal(failure.status, 502);
  assert.equal(failure.headers.get("Access-Control-Allow-Origin"), secondSite.origin);
});

test("site configuration rejects duplicate, insecure, and malformed entries", () => {
  for (const sites of [
    [secondSite, secondSite], [{ ...secondSite, origin: "http://research.example" }],
    [{ ...secondSite, origin: "https://research.example/path" }],
    [{ ...secondSite, websiteID: "invalid" }], [{ ...secondSite, events: { ["x".repeat(51)]: [] } }],
    [{ ...secondSite, events: ["resource_open"] }], [{ ...secondSite, events: { resource_open: "target" } }],
    [{ ...secondSite, events: { resource_open: ["x".repeat(51)] } }],
  ]) assert.throws(() => createCollector(sites), /Invalid or duplicate/);
});

test("collection preserves upstream errors and handles network failures", async (t) => {
  const mocked = t.mock.method(globalThis, "fetch", async () => new Response('{"error":"limit"}', { status: 429 }));
  let response = await collect(request());
  assert.equal(response.status, 429);
  assert.equal(await response.text(), '{"error":"limit"}');
  mocked.mock.mockImplementation(async () => { throw Error("network/timeout"); });
  response = await collect(request());
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  mocked.mock.mockImplementation(async () => new Response(null, { status: 307, headers: { Location: "https://unexpected.example/" } }));
  response = await collect(request());
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("Location"), null);
});

test("script caching ignores query strings, supports HEAD, and strips upstream cookies", async (t) => {
  const entries = new Map();
  const pending = [];
  const previous = globalThis.caches;
  globalThis.caches = { default: {
    match: async (key) => entries.get(key.url)?.clone(),
    put: async (key, response) => { entries.set(key.url, response); },
  } };
  t.after(() => { if (previous === undefined) delete globalThis.caches; else globalThis.caches = previous; });
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response("window.umami={};", { headers: { "Content-Type": "application/javascript", "Set-Cookie": "secret=1" } }));
  const context = (method, query) => ({ request: new Request(`https://iblcore.org/t.js${query}`, { method }), waitUntil: (promise) => pending.push(promise) });
  let response = await tracker(context("GET", "?a=1"));
  assert.equal(await response.text(), "window.umami={};");
  assert.equal(response.headers.get("Set-Cookie"), null);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "*");
  assert.equal(response.headers.get("Cross-Origin-Resource-Policy"), "cross-origin");
  assert.match(response.headers.get("Cache-Control"), /s-maxage=3600/);
  await Promise.all(pending);
  // Old cached responses from an earlier deploy may lack public script headers.
  entries.set("https://iblcore.org/t.js", new Response("older script", { headers: { "Content-Type": "application/javascript" } }));
  response = await tracker(context("HEAD", "?b=2"));
  assert.equal(await response.text(), "");
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "*");
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal((await tracker(context("POST", ""))).status, 405);
});

test("script errors are not cached; cache outages do not prevent fetching", async (t) => {
  const previous = globalThis.caches;
  const put = t.mock.fn(async () => {});
  globalThis.caches = { default: { match: async () => { throw Error("cache unavailable"); }, put } };
  t.after(() => { if (previous === undefined) delete globalThis.caches; else globalThis.caches = previous; });
  const mocked = t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  const context = { request: new Request("https://iblcore.org/t.js"), waitUntil: () => {} };
  let response = await tracker(context);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  mocked.mock.mockImplementation(async () => new Response("<html>error</html>", { headers: { "Content-Type": "text/html" } }));
  assert.equal((await tracker(context)).status, 502);
  mocked.mock.mockImplementation(async () => { throw Error("network/timeout"); });
  assert.equal((await tracker(context)).status, 502);
  assert.equal(put.mock.callCount(), 0);
  mocked.mock.mockImplementation(async () => new Response("ok", { headers: { "Content-Type": "text/javascript" } }));
  assert.equal((await tracker(context)).status, 200);
});
