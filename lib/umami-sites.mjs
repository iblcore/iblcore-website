// The proxy stays on this origin. Add other production sites to TRACKED_SITES;
// each entry owns its website ID and the custom event names it may submit.
export const PROXY_ORIGIN = "https://iblcore.org";

export const TRACKED_SITES = [
  {
    origin: "https://iblcore.org",
    websiteID: "b174e1b4-4d3b-41e2-b49c-f8d30d49c8f9",
    events: [
      "resource_link_click", "download_click", "contact_click",
      "application_click", "registration_click", "event_link_click",
    ],
  },
];
