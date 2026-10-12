import { PROXY_ORIGIN, TRACKED_SITES } from "./umami-sites.mjs";

const MAX_BODY_BYTES = 8192;
const MAX_PROPERTY_LENGTH = 200;
const CORS_HEADERS = ["content-type", "x-umami-cache", "x-umami-hostname", "x-umami-website-id"];

export function reply(message, status, headers = {}) {
  return new Response(message, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

// Only bounded pageviews and the site's named clicks are supported. No identify,
// replay, or performance data is forwarded. Event properties are limited to the
// short string keys registered for that event name.
function validData(data, allowed) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  return Object.entries(data).every(([key, value]) => allowed?.has(key) &&
    typeof value === "string" && value.length > 0 && value.length <= MAX_PROPERTY_LENGTH);
}

function validEvent(event, site) {
  if (!event || event.type !== "event" || !event.payload || typeof event.payload !== "object") return false;
  if (Object.keys(event).some((key) => !["type", "payload"].includes(key))) return false;
  const payload = event.payload;
  const limits = { website: 36, hostname: 255, url: 4096, referrer: 4096, screen: 32, language: 64, title: 1024, name: 50 };
  for (const [key, value] of Object.entries(payload)) {
    // Umami's native data-umami-event handler includes an empty data object;
    // pageviews and unregistered keys cannot carry properties.
    if (key === "data") {
      if (!validData(value, site.events.get(payload.name))) return false;
      continue;
    }
    if (!Object.hasOwn(limits, key) || typeof value !== "string" || value.length > limits[key]) return false;
  }
  if (payload.website !== site.websiteID || payload.hostname !== site.hostname) return false;
  if (payload.name !== undefined && !site.events.has(payload.name)) return false;
  try {
    return new URL(payload.url).origin === site.origin;
  } catch {
    return false;
  }
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

// Inject a registry in tests only; production uses the checked-in site list.
export function createCollector(sites = TRACKED_SITES) {
  const registry = new Map();
  for (const site of sites) {
    const url = new URL(site.origin);
    if (url.protocol !== "https:" || url.origin !== site.origin || registry.has(site.origin) ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(site.websiteID) ||
        !site.events || typeof site.events !== "object" || Array.isArray(site.events) ||
        Object.entries(site.events).some(([name, keys]) => !name.length || name.length > 50 ||
          !Array.isArray(keys) || keys.some((key) => typeof key !== "string" || !key.length || key.length > 50))) {
      throw new Error("Invalid or duplicate Umami site configuration");
    }
    const events = new Map(Object.entries(site.events).map(([name, keys]) => [name, new Set(keys)]));
    registry.set(site.origin, { ...site, hostname: url.hostname, events });
  }
  return async (request) => {
    const origin = request.headers.get("Origin");
    const site = registry.get(origin);
    const cors = site ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : { Vary: "Origin" };
    const respond = (message, status, headers = {}) => reply(message, status, { ...cors, ...headers });
    return collectForSite(request, site, respond, cors);
  };
}

async function collectForSite(request, site, respond, cors) {
  // Even a crafted request to a PR deployment must not reach Umami.
  if (new URL(request.url).origin !== PROXY_ORIGIN) return reply("Not found", 404);
  if (!site) return respond("Forbidden", 403);
  if (request.method === "OPTIONS") {
    const requestedHeaders = (request.headers.get("Access-Control-Request-Headers") || "")
      .split(",").map((name) => name.trim().toLowerCase()).filter(Boolean);
    if (request.headers.get("Access-Control-Request-Method") !== "POST" ||
        requestedHeaders.some((name) => !CORS_HEADERS.includes(name))) {
      return respond("Forbidden preflight", 403);
    }
    return respond(null, 204, {
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": CORS_HEADERS.join(", "),
      "Access-Control-Max-Age": "600",
      Vary: "Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
    });
  }
  if (request.method !== "POST") return respond("Method not allowed", 405, { Allow: "POST, OPTIONS" });
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return respond("Expected JSON", 415);
  }
  if (Number(request.headers.get("Content-Length")) > MAX_BODY_BYTES) return respond("Payload too large", 413);
  let body;
  try {
    body = await readBody(request);
    if (body === null) return respond("Payload too large", 413);
    if (!validEvent(JSON.parse(body), site)) return respond("Invalid event", 400);
  } catch {
    return respond("Invalid JSON", 400);
  }

  const clientIP = request.headers.get("CF-Connecting-IPv6") || request.headers.get("CF-Connecting-IP");
  if (!clientIP) return respond("Client address unavailable", 503);
  const cache = request.headers.get("x-umami-cache");
  if (cache && cache.length > 4096) return respond("Invalid session cache", 400);
  const headers = new Headers({
    "Content-Type": "application/json",
    "User-Agent": request.headers.get("User-Agent") || "",
    "X-Forwarded-For": clientIP,
    "x-umami-website-id": site.websiteID,
    "x-umami-hostname": site.hostname,
  });
  if (cache) headers.set("x-umami-cache", cache);
  try {
    const upstream = await fetch("https://gateway.umami.is/api/send", {
      method: "POST", headers, body, redirect: "manual", signal: AbortSignal.timeout(5000),
    });
    if (upstream.status >= 300 && upstream.status < 400) return respond("Unexpected analytics redirect", 502);
    // Preserve the JSON session cache/disabled response and error statuses;
    // discard cookies, CORS, and all other upstream response headers.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": upstream.headers.get("Content-Type") || "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return respond("Analytics temporarily unavailable", 502);
  }
}

export const collect = createCollector();

export async function tracker({ request, waitUntil }) {
  if (!["GET", "HEAD"].includes(request.method)) return reply("Method not allowed", 405, { Allow: "GET, HEAD" });
  const url = new URL(request.url);
  // Query strings must not create unlimited edge cache entries.
  url.search = "";
  const key = new Request(url, { method: "GET" });
  const cache = globalThis.caches?.default;
  let response;
  try {
    response = await cache?.match(key).catch(() => undefined);
    if (!response) {
      const upstream = await fetch("https://cloud.umami.is/script.js", {
        redirect: "manual", signal: AbortSignal.timeout(5000),
      });
      if (upstream.status !== 200) return reply("Tracker temporarily unavailable", upstream.status >= 400 ? upstream.status : 502);
      if (!/^(application|text)\/(javascript|x-javascript)/i.test(upstream.headers.get("Content-Type") || "")) {
        return reply("Invalid tracker response", 502);
      }
      response = new Response(upstream.body, {
        headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600", "X-Content-Type-Options": "nosniff", "Access-Control-Allow-Origin": "*", "Cross-Origin-Resource-Policy": "cross-origin" },
      });
      if (cache) waitUntil(cache.put(key, response.clone()).catch(() => {}));
    }
    // Also apply sharing headers to cache entries created before this deploy.
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    return new Response(request.method === "HEAD" ? null : response.body, { headers });
  } catch {
    return reply("Tracker temporarily unavailable", 502);
  }
}
