(() => {
  // Apply the same allowlist as the tracker, including for manual events.
  const domains = document.currentScript?.dataset.domains?.split(",") || [];
  if (domains.length && !domains.includes(window.location.hostname)) return;

  const eventName = (link) => {
    const url = new URL(link.href, window.location.href);
    if (["mailto:", "tel:"].includes(url.protocol)) return "contact_click";
    if (!["http:", "https:"].includes(url.protocol)) return null;

    if (link.hasAttribute("download") || /\.(pdf|zip|gz|tar|csv|nwb|mp4)(?:$)/i.test(url.pathname)) {
      return "download_click";
    }

    if (link.matches(".event-card__link")) {
      if (/\b(apply|application)\b/i.test(link.textContent)) return "application_click";
      if (/\b(register|registration|sign up)\b/i.test(link.textContent)) return "registration_click";
      return "event_link_click";
    }

    if (url.origin === window.location.origin) {
      if (url.pathname === "/about/contact/" || (url.pathname === "/about/team/" && url.hash === "#contact")) {
        return "contact_click";
      }
      return null;
    }

    if (window.location.pathname.startsWith("/resources/") || link.closest("#resources, .page-controller")) {
      return "resource_link_click";
    }
    return null;
  };

  const trackLink = (event) => {
    if (event.type === "click" ? event.button !== 0 : event.button !== 1) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link || link.getAttribute("aria-disabled") === "true" || typeof window.umami?.track !== "function") return;

    const name = eventName(link);
    if (!name) return;
    // Send only the category; destinations and email addresses are not properties.
    // Tracking must never delay or prevent the normal link action.
    try {
      window.umami.track(name)?.catch?.(() => {});
    } catch {
      // Keep links usable if the tracker is unavailable or fails.
    }
  };

  document.addEventListener("click", trackLink);
  document.addEventListener("auxclick", trackLink);
})();
