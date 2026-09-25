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
const LINK_KINDS = ["docs", "code", "platform", "preprint"];

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

    if (data?.status !== undefined && !STATUSES.includes(data.status)) {
      errors.push(`${path}: status "${data.status}" must be one of ${STATUSES.join(", ")}`);
    }

    for (const [kind, url] of Object.entries(data?.links || {})) {
      if (!LINK_KINDS.includes(kind)) {
        errors.push(`${path}: links key "${kind}" must be one of ${LINK_KINDS.join(", ")}`);
      } else if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
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
