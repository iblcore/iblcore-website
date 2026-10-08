import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { collect, tracker, WEBSITE_ID, HOSTNAME } from "../lib/umami-proxy.mjs";

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
  for (const payload of [event, { ...event, payload: { ...event.payload, name: "application_click" } }]) {
    const response = await collect(request(payload, { "x-umami-cache": "previous-session", Cookie: "private=1", Authorization: "Bearer private", "X-Forwarded-For": "spoofed", "x-umami-hostname": "spoofed" }));
    assert.deepEqual(await response.json(), { cache: "next-session", disabled: false });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Set-Cookie"), null);
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
    [request(event, { "Sec-Fetch-Site": "cross-site" }), 403],
    [request(event, { "Content-Type": "text/plain" }), 415],
    [request("{"), 400],
    [request(changed({ website: "another-website" })), 400],
    [request(changed({ hostname: "pr-23.pages.dev" })), 400],
    [request(changed({ url: "https://pr-23.pages.dev/" })), 400],
    [request(changed({ data: { email: "private" } })), 400],
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
  assert.match(response.headers.get("Cache-Control"), /s-maxage=3600/);
  await Promise.all(pending);
  response = await tracker(context("HEAD", "?b=2"));
  assert.equal(await response.text(), "");
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
