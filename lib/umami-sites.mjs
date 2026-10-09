// The proxy stays on this origin. Add other production sites to TRACKED_SITES;
// each entry owns its website ID and the custom events it may submit. Events map
// each name to its allowed property keys; Umami bills each stored property as an
// extra event, so keep the lists short.
export const PROXY_ORIGIN = "https://iblcore.org";

export const TRACKED_SITES = [
  {
    origin: "https://iblcore.org",
    websiteID: "b174e1b4-4d3b-41e2-b49c-f8d30d49c8f9",
    events: {
      "resource_link_click": ["target"],
      "download_click": ["file"],
      "contact_click": [],
      "application_click": ["event"],
      "registration_click": ["event"],
      "event_link_click": ["event"],
    },
  },
];
