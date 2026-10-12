(() => {
  // Apply the same allowlist as the tracker, including for manual events.
  const domains = document.currentScript?.dataset.domains?.split(",") || [];
  if (domains.length && !domains.includes(window.location.hostname)) return;

  // Umami bills each stored property as an extra event, so each click carries at
  // most one short property. Names and keys must match lib/umami-sites.mjs.
  const MAX_VALUE = 200;
  const property = (key, value) => {
    const text = value?.replace(/\s+/g, " ").trim().slice(0, MAX_VALUE);
    return text ? { [key]: text } : undefined;
  };
  const fileName = (url) => {
    const segment = url.pathname.split("/").filter(Boolean).pop() || url.hostname;
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  };

  // Returns [event name, optional properties] or null for untracked links.
  const eventFor = (link) => {
    const url = new URL(link.href, window.location.href);
    // Contact clicks carry no property: email addresses are never recorded.
    if (["mailto:", "tel:"].includes(url.protocol)) return ["contact_click"];
    if (!["http:", "https:"].includes(url.protocol)) return null;

    if (link.hasAttribute("download") || /\.(pdf|zip|gz|tar|csv|nwb|mp4)(?:$)/i.test(url.pathname)) {
      return ["download_click", property("file", fileName(url))];
    }

    if (link.matches(".event-card__link")) {
      const data = property("event", link.closest(".event-card")?.querySelector(".event-card__title")?.textContent);
      if (/\b(apply|application)\b/i.test(link.textContent)) return ["application_click", data];
      if (/\b(register|registration|sign up)\b/i.test(link.textContent)) return ["registration_click", data];
      return ["event_link_click", data];
    }

    if (url.origin === window.location.origin) {
      if (url.pathname === "/about/contact/" || (url.pathname === "/about/team/" && url.hash === "#contact")) {
        return ["contact_click"];
      }
      return null;
    }

    if (window.location.pathname.startsWith("/resources/") || link.closest("#resources, .page-controller")) {
      // Hostname and path only; query strings and fragments may hold identifiers.
      return ["resource_link_click", property("target", `${url.hostname}${url.pathname.replace(/\/+$/, "")}`)];
    }
    return null;
  };

  const trackLink = (event) => {
    if (event.type === "click" ? event.button !== 0 : event.button !== 1) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link || link.getAttribute("aria-disabled") === "true" || typeof window.umami?.track !== "function") return;

    const tracked = eventFor(link);
    if (!tracked) return;
    const [name, data] = tracked;
    // Tracking must never delay or prevent the normal link action.
    try {
      (data ? window.umami.track(name, data) : window.umami.track(name))?.catch?.(() => {});
    } catch {
      // Keep links usable if the tracker is unavailable or fails.
    }
  };

  document.addEventListener("click", trackLink);
  document.addEventListener("auxclick", trackLink);
})();
