// The vocabularies Hugo builds the resource taxonomies from. They are declared
// here rather than read from hugo.yaml because hugo.yaml names the taxonomies,
// not their permitted terms: a typo in a content file would otherwise become a
// new term page with one member rather than an error.
export const VOCABULARIES = {
  modality: ["neuropixels", "mesoscope", "fibre-photometry", "widefield", "behavior", "video"],
  stage: ["collect", "pre-process", "analyse", "visualise", "benchmark"],
  access: ["one", "dandi", "ibl-ai-agent"],
};

/**
 * The front matter of one content file, as a plain object.
 *
 * Hugo content is YAML front matter between --- fences followed by the body,
 * which this discards: none of the rules here concern prose.
 *
 * @param {string} source Whole file contents.
 * @param {string} label Path used in parse error messages.
 * @param {(source: string, label: string) => {value: object, errors: string[]}} parse
 * @returns {object}
 */
export function parseFrontMatter(source, label, parse) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const { value, errors } = parse(match[1], label);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return value || {};
}

const REQUIRED_RESOURCE_FIELDS = ["title", "description"];

// The choices a workflow page knows how to fork on. A step carrying one turns
// its resources into the chooser the rest of the steps narrow to.
const CHOICES = ["dataset"];
const STATUSES = ["released", "coming-soon"];
// Whether a figure is rendered on a dark frame or a light card. Diagrams lifted
// from papers sit on white; rendered clips sit on black.
const FIGURE_TONES = ["light", "dark"];
const LINK_KINDS = ["docs", "code", "platform", "preprint"];

// Front matter that "about" replaced. A file still carrying one would render
// nothing at all, so the copy has to be reported rather than quietly dropped.
const RETIRED_RESOURCE_KEYS = ["project", "task"];

const isAbsoluteUrl = (value) => typeof value === "string" && /^https?:\/\//.test(value);

function checkRequiredStrings(data, fields, path, errors) {
  for (const field of fields) {
    if (typeof data?.[field] !== "string" || data[field].trim() === "") {
      errors.push(`${path}: required field "${field}" is missing`);
    }
  }
}

function checkVocabulary(data, taxonomy, path, errors) {
  const terms = data?.[taxonomy];
  if (terms === undefined) return [];
  if (!Array.isArray(terms)) {
    errors.push(`${path}: "${taxonomy}" must be a list`);
    return [];
  }
  for (const term of terms) {
    if (!VOCABULARIES[taxonomy].includes(term)) {
      errors.push(`${path}: ${taxonomy} "${term}" is not in the ${taxonomy} vocabulary`);
    }
  }
  return terms;
}

/**
 * Check the "about" entries a resource page renders as its narrative section.
 *
 * Entries are reported by their 1-based position rather than by heading,
 * because the entry that fails is often the one whose heading is missing too.
 *
 * @param {object} data Front matter of one resource.
 * @param {string} path File the entries came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkAbout(data, path, errors) {
  const entries = data?.about;
  if (entries === undefined) return;
  if (!Array.isArray(entries)) {
    errors.push(`${path}: "about" must be a list`);
    return;
  }
  entries.forEach((entry, index) => {
    const label = `${path}: about entry ${index + 1}`;
    if (typeof entry?.description !== "string" || entry.description.trim() === "") {
      errors.push(`${label} is missing "description"`);
    }
    if (entry?.paper_link !== undefined && !isAbsoluteUrl(entry.paper_link)) {
      errors.push(`${label}: paper_link must be an absolute URL`);
    }
    // Links render as captioned citations, so a label is the caption rather
    // than decoration: defaulting it would caption the link with a guess.
    if (entry?.link !== undefined && `${entry?.link_label ?? ""}`.trim() === "") {
      errors.push(`${label} sets "link" without "link_label"`);
    }
    if (entry?.figure !== undefined) checkFigure(entry.figure, `${label}: figure`, errors);
  });
}

/**
 * Check the illustration attached to one "about" entry.
 *
 * A figure is either a still ("src") or a looping clip ("video"), never both.
 * A clip carries a "poster" so the first frame is painted before it loads and
 * so readers who have asked for reduced motion get a still instead.
 *
 * @param {object} figure The entry's figure map.
 * @param {string} label Entry and file the figure came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkFigure(figure, label, errors) {
  checkRequiredStrings(figure, ["alt"], label, errors);

  const sources = ["src", "video"].filter((key) => figure?.[key] !== undefined);
  if (sources.length !== 1) {
    errors.push(`${label} needs exactly one of "src" or "video"`);
  }
  if (figure?.video !== undefined && `${figure?.poster ?? ""}`.trim() === "") {
    errors.push(`${label} sets "video" without "poster"`);
  }
  if (figure?.tone !== undefined && !FIGURE_TONES.includes(figure.tone)) {
    errors.push(`${label} tone "${figure.tone}" must be one of ${FIGURE_TONES.join(", ")}`);
  }
}

/**
 * Check the "explore" block a dataset page renders as its call to action.
 *
 * Its figure is the same shape as an entry's, so it goes through the same
 * check; the highlights are the few things a visitor can do at the link.
 *
 * @param {object} data Front matter of one resource.
 * @param {string} path File the block came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkExplore(data, path, errors) {
  const explore = data?.explore;
  if (explore === undefined) return;

  const label = `${path}: explore`;
  if (explore.figure !== undefined) checkFigure(explore.figure, `${label}: figure`, errors);

  if (explore.highlights === undefined) return;
  if (!Array.isArray(explore.highlights)) {
    errors.push(`${label}: "highlights" must be a list`);
    return;
  }
  explore.highlights.forEach((highlight, index) => {
    if (typeof highlight !== "string" || highlight.trim() === "") {
      errors.push(`${label}: highlight ${index + 1} must be a string`);
    }
  });
}

/**
 * Check the headline figures a resource page renders as its stats strip.
 *
 * Values stay strings: they are display text such as "699" or "12", never
 * arithmetic, and YAML would otherwise coerce some of them to numbers and
 * others not depending on how they are written.
 *
 * @param {object} data Front matter of one resource.
 * @param {string} path File the entries came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkStats(data, path, errors) {
  const entries = data?.stats;
  if (entries === undefined) return;
  if (!Array.isArray(entries)) {
    errors.push(`${path}: "stats" must be a list`);
    return;
  }
  entries.forEach((entry, index) => {
    for (const field of ["value", "label"]) {
      if (`${entry?.[field] ?? ""}`.trim() === "") {
        errors.push(`${path}: stats entry ${index + 1} is missing "${field}"`);
      }
    }
  });
}

/**
 * Validate the resource and workflow front matter behind the resources portal.
 *
 * @param {{path: string, data: object}[]} resources
 * @param {{path: string, data: object}[]} workflows
 * @returns {string[]} One message per problem, each naming the file it is in.
 */
export function validateResourcesData(resources, workflows) {
  const errors = [];

  // A resource is named by page path wherever one file points at another; the
  // file that provides one lives at content/<path>.md, so the two are compared
  // through that mapping.
  const resourcePaths = new Set(
    resources.map(({ path }) => path.replace(/^content/, "").replace(/\.md$/, "")),
  );

  const checkReferences = (references, label) => {
    for (const reference of [references].flat()) {
      if (!resourcePaths.has(reference)) {
        errors.push(`${label} refers to "${reference}", which is not a resource file`);
      }
    }
  };

  for (const { path, data } of resources) {
    checkRequiredStrings(data, REQUIRED_RESOURCE_FIELDS, path, errors);
    for (const taxonomy of Object.keys(VOCABULARIES)) {
      checkVocabulary(data, taxonomy, path, errors);
    }
    if (!Array.isArray(data?.stage) || data.stage.length === 0) {
      errors.push(`${path}: every resource needs at least one "stage"`);
    }

    // A resource may declare the datasets it applies to, which narrows where it
    // is offered inside a workflow.
    if (data?.datasets !== undefined) checkReferences(data.datasets, `${path}: datasets`);

    // A guide for a route the resource does not offer would never render.
    const access = Array.isArray(data?.access) ? data.access : [];
    for (const key of Object.keys(data?.access_guides || {})) {
      if (!access.includes(key)) {
        errors.push(`${path}: access_guides key "${key}" is not in this resource's access list`);
      }
    }

    checkAbout(data, path, errors);
    checkStats(data, path, errors);
    checkExplore(data, path, errors);

    for (const key of RETIRED_RESOURCE_KEYS) {
      if (data?.[key] !== undefined) {
        errors.push(`${path}: "${key}" is retired; move its copy into "about"`);
      }
    }

    if (data?.status !== undefined && !STATUSES.includes(data.status)) {
      errors.push(`${path}: status "${data.status}" must be one of ${STATUSES.join(", ")}`);
    }

    for (const [kind, url] of Object.entries(data?.links || {})) {
      if (!LINK_KINDS.includes(kind)) {
        errors.push(`${path}: links key "${kind}" must be one of ${LINK_KINDS.join(", ")}`);
      } else if (!isAbsoluteUrl(url)) {
        errors.push(`${path}: links.${kind} must be an absolute URL`);
      }
    }
  }

  for (const { path, data } of workflows) {
    checkRequiredStrings(data, REQUIRED_RESOURCE_FIELDS, path, errors);
    const steps = data?.steps;
    if (!Array.isArray(steps) || steps.length === 0) {
      errors.push(`${path}: a workflow needs at least one entry in "steps"`);
      continue;
    }
    let chooserSeen = false;
    steps.forEach((step, index) => {
      const label = `${path}: step ${index + 1}`;
      if (typeof step?.title !== "string" || step.title.trim() === "") {
        errors.push(`${label} is missing "title"`);
      }
      if (step?.choice !== undefined) {
        if (!CHOICES.includes(step.choice)) {
          errors.push(`${label}: choice "${step.choice}" must be one of ${CHOICES.join(", ")}`);
        } else if (chooserSeen) {
          errors.push(`${label}: a workflow can only have one "choice" step`);
        }
        chooserSeen = true;
      }
      // A step compares access routes beside its cards, and both sides are
      // resource files: the comparison copy lives on the tool's own page.
      if (step?.routes !== undefined) checkReferences(step.routes, `${label}: routes`);
      if (step?.resource === undefined) {
        errors.push(`${label} is missing "resource"`);
        return;
      }
      checkReferences(step.resource, label);
    });
  }

  return errors;
}
