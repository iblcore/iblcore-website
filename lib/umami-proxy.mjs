export const WEBSITE_ID = "b174e1b4-4d3b-41e2-b49c-f8d30d49c8f9";
export const HOSTNAME = "iblcore.org";
const ORIGIN = `https://${HOSTNAME}`;
const MAX_BODY_BYTES = 8192;
const EVENT_NAMES = new Set([
  "resource_link_click", "download_click", "contact_click",
  "application_click", "registration_click", "event_link_click",
]);

export function reply(message, status, headers = {}) {
  return new Response(message, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

// Only bounded pageviews and the site's named clicks are supported. No identify,
// replay, performance, or custom properties are forwarded by this endpoint.
function validEvent(event) {
  if (!event || event.type !== "event" || !event.payload || typeof event.payload !== "object") return false;
  if (Object.keys(event).some((key) => !["type", "payload"].includes(key))) return false;
  const payload = event.payload;
  const limits = { website: 36, hostname: 255, url: 4096, referrer: 4096, screen: 32, language: 64, title: 1024, name: 50 };
  for (const [key, value] of Object.entries(payload)) {
    if (!Object.hasOwn(limits, key) || typeof value !== "string" || value.length > limits[key]) return false;
  }
  if (payload.website !== WEBSITE_ID || payload.hostname !== HOSTNAME) return false;
  if (payload.name !== undefined && !EVENT_NAMES.has(payload.name)) return false;
  try {
    return new URL(payload.url).origin === ORIGIN;
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

export async function collect(request) {
  // Even a crafted request to a PR deployment must not reach Umami.
  if (new URL(request.url).hostname !== HOSTNAME) return reply("Not found", 404);
  if (request.method !== "POST") return reply("Method not allowed", 405, { Allow: "POST" });
  if (request.headers.get("Origin") !== ORIGIN ||
      (request.headers.has("Sec-Fetch-Site") && request.headers.get("Sec-Fetch-Site") !== "same-origin")) {
    return reply("Forbidden", 403);
  }
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply("Expected JSON", 415);
  }
  if (Number(request.headers.get("Content-Length")) > MAX_BODY_BYTES) return reply("Payload too large", 413);
  let body;
  try {
    body = await readBody(request);
    if (body === null) return reply("Payload too large", 413);
    if (!validEvent(JSON.parse(body))) return reply("Invalid event", 400);
  } catch {
    return reply("Invalid JSON", 400);
  }

  const clientIP = request.headers.get("CF-Connecting-IPv6") || request.headers.get("CF-Connecting-IP");
  if (!clientIP) return reply("Client address unavailable", 503);
  const cache = request.headers.get("x-umami-cache");
  if (cache && cache.length > 4096) return reply("Invalid session cache", 400);
  const headers = new Headers({
    "Content-Type": "application/json",
    "User-Agent": request.headers.get("User-Agent") || "",
    "X-Forwarded-For": clientIP,
    "x-umami-website-id": WEBSITE_ID,
    "x-umami-hostname": HOSTNAME,
  });
  if (cache) headers.set("x-umami-cache", cache);
  try {
    const upstream = await fetch("https://gateway.umami.is/api/send", {
      method: "POST", headers, body, redirect: "manual", signal: AbortSignal.timeout(5000),
    });
    if (upstream.status >= 300 && upstream.status < 400) return reply("Unexpected analytics redirect", 502);
    // Preserve the JSON session cache/disabled response and error statuses;
    // discard cookies, CORS, and all other upstream response headers.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return reply("Analytics temporarily unavailable", 502);
  }
}

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
        headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600", "X-Content-Type-Options": "nosniff" },
      });
      if (cache) waitUntil(cache.put(key, response.clone()).catch(() => {}));
    }
    return request.method === "HEAD" ? new Response(null, { headers: response.headers }) : response;
  } catch {
    return reply("Tracker temporarily unavailable", 502);
  }
}
