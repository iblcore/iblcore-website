import { parseDocument } from "yaml";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EVENT_FORMATS = new Set(["online", "physical"]);

export function parseYaml(source, label) {
  const document = parseDocument(source, { prettyErrors: true, strict: true });
  const errors = document.errors.map((error) => `${label}: ${error.message}`);
  return { value: document.toJS(), errors };
}

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isValidCoordinate(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function addError(errors, eventLabel, message) {
  errors.push(`Event ${eventLabel}: ${message}`);
}

export function validateEventsData(eventsData, projectsData) {
  const errors = [];
  const events = eventsData?.events;
  if (!Array.isArray(events)) {
    errors.push("data/events.yaml: the top-level events field must be a list");
    return errors;
  }

  // Co-organisers may be Partner or Affiliate records; both live in data/projects.yaml.
  const profileIds = new Set();
  for (const sectionId of ["new-partner-projects", "affiliates"]) {
    const items = projectsData?.sections?.find((section) => section.id === sectionId)?.items;
    if (!Array.isArray(items)) {
      errors.push(`data/projects.yaml: the ${sectionId} section must contain an items list`);
      continue;
    }
    for (const record of items) {
      if (!record?.id) continue;
      if (profileIds.has(record.id)) errors.push(`data/projects.yaml: duplicate Partner or Affiliate ID "${record.id}"`);
      profileIds.add(record.id);
    }
  }

  const eventIds = new Set();
  events.forEach((event, index) => {
    const eventLabel = JSON.stringify(event?.id || `#${index + 1}`);
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      errors.push(`Event #${index + 1}: each entry must be a mapping`);
      return;
    }
    for (const field of ["id", "name", "start_date", "end_date"]) {
      if (typeof event[field] !== "string" || event[field].trim() === "") {
        addError(errors, eventLabel, `required field "${field}" is missing`);
      }
    }
    if (event.id && eventIds.has(event.id)) addError(errors, eventLabel, `duplicate id "${event.id}"`);
    if (event.id) eventIds.add(event.id);

    for (const field of ["start_date", "end_date"]) {
      if (event[field] !== undefined && !isValidDate(event[field])) {
        addError(errors, eventLabel, `${field} must be a valid YYYY-MM-DD date`);
      }
    }
    if (isValidDate(event.start_date) && isValidDate(event.end_date) && event.end_date < event.start_date) {
      addError(errors, eventLabel, "end_date cannot be earlier than start_date");
    }

    const format = event.format || "physical";
    if (!EVENT_FORMATS.has(format)) {
      addError(errors, eventLabel, `format must be "online" or "physical" when provided`);
    }
    const isOnline = format === "online";
    if (isOnline) {
      if (event.latitude !== undefined || event.longitude !== undefined) {
        addError(errors, eventLabel, "online events must not define map coordinates");
      }
    } else {
      if (typeof event.location !== "string" || event.location.trim() === "") {
        addError(errors, eventLabel, "physical events require location");
      }
      if (!isValidCoordinate(event.latitude, -90, 90)) {
        addError(errors, eventLabel, "physical events require latitude between -90 and 90");
      }
      if (!isValidCoordinate(event.longitude, -180, 180)) {
        addError(errors, eventLabel, "physical events require longitude between -180 and 180");
      }
    }

    if (event.website !== undefined && event.website !== null) {
      try {
        const website = new URL(event.website);
        if (!["http:", "https:"].includes(website.protocol)) throw new Error();
      } catch {
        addError(errors, eventLabel, "website must be an http(s) URL or null");
      }
    }

    if (event.co_organisers !== undefined) {
      if (!Array.isArray(event.co_organisers)) {
        addError(errors, eventLabel, "co_organisers must be a list");
      } else {
        event.co_organisers.forEach((organiser, organiserIndex) => {
          const organiserLabel = `co_organisers[${organiserIndex}]`;
          if (!organiser || typeof organiser.profile_id !== "string" || organiser.profile_id.trim() === "") {
            addError(errors, eventLabel, `${organiserLabel} requires profile_id`);
          } else if (!profileIds.has(organiser.profile_id)) {
            addError(errors, eventLabel, `${organiserLabel} references unknown Partner or Affiliate ID "${organiser.profile_id}"`);
          }
          for (const legacyField of ["profile_url", "name"]) {
            if (organiser?.[legacyField] !== undefined) {
              addError(errors, eventLabel, `${organiserLabel} must not duplicate ${legacyField}; resolve it from projects.yaml`);
            }
          }
        });
      }
    }
  });

  return errors;
}
