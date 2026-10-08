import { collect } from "../../lib/umami-proxy.mjs";

export function onRequest({ request }) {
  return collect(request);
}
