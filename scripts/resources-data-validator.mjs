// The vocabularies Hugo builds the resource taxonomies from. They are declared
// here rather than read from hugo.yaml because hugo.yaml names the taxonomies,
// not their permitted terms: a typo in a content file would otherwise become a
// new term page with one member rather than an error.
export const VOCABULARIES = {
  modality: ["neuropixels", "mesoscope", "fibre-photometry", "widefield", "behavior", "video"],
  stage: ["collect", "pre-process", "analyse", "visualise", "benchmark"],
  access: ["explorer", "one", "dandi", "ibl-ai-agent"],
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
// Whether a card picture fills its band or is fitted whole inside it. A
// photograph or screenshot fills it; a logo is fitted.
const CARD_IMAGE_FITS = ["cover", "contain"];
// Whether a figure is rendered on a dark frame or a light card. Diagrams lifted
// from papers sit on white; rendered clips sit on black.
const FIGURE_TONES = ["light", "dark"];
const LINK_KINDS = ["docs", "code", "platform", "preprint"];

// Front matter that "about" replaced. A file still carrying one would render
// nothing at all, so the copy has to be reported rather than quietly dropped.
const RETIRED_RESOURCE_KEYS = ["project", "task"];

// Dataset pages follow a fixed spine the other resource sections do not, so
// several rules below are keyed on the section a file sits in.
const DATASET_SECTION = "content/resources/data/";
const isDatasetPath = (path) => path.startsWith(DATASET_SECTION);

// The headings a dataset page's "about" section carries, in the order it
// renders them. The set is closed: a page cannot omit, rename, reorder or add
// one, which is what keeps six dataset pages reading as one series.
const DATASET_ABOUT_HEADINGS = ["The project", "The experiment", "What's in the dataset"];

// What a dataset's four headline figures are allowed to count. The list is
// closed so that the same quantity is called the same thing on every page and
// so the strip cannot fill up with facts about the study design.
const DATASET_STAT_LABELS = [
  "Subjects", "Sessions", "Probe insertions", "Laboratories", "Brain regions",
  "Cortical regions", "Units", "Trials", "Genotypes", "Months of age",
];
// stats-strip.css lays the strip out as four equal columns.
const DATASET_STAT_COUNT = 4;

// What a dataset page can point a reader at, in the order the panel renders
// them. Every page leads with the paper it was released with.
const DATASET_CITATION_KINDS = ["Paper", "Data release", "Registry entry", "Code"];

// Front matter every dataset page carries. The lead is the page's one-sentence
// banner and the card image is how the dataset appears on the index, so a page
// without either is incomplete rather than merely plain.
//
// The spine's own keys are listed here because the checks below each take a
// list and return early when handed anything else: absence would otherwise
// pass, and the page would publish with no stats strip, no narrative, no
// access panel and no citation block, reporting nothing.
const DATASET_REQUIRED_FIELDS = [
  "lead", "weight", "card_image", "stats", "about", "modality", "access", "citations",
];

// Keys a dataset page can no longer carry. "explore" became an access route;
// "stage" narrowed nothing, every dataset being "analyse".
const RETIRED_DATASET_KEYS = {
  explore: '"explore" is retired; the viewer is an access route',
  stage: '"stage" is retired on dataset pages; remove it',
};

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
    // An entry is allowed no prose of its own where something else carries
    // it: a shared task in data/tasks.yaml renders that task's copy, and a
    // contents grid lists the release rather than describing it.
    const carriesOwnSubstance = entry?.task !== undefined || entry?.contents !== undefined;
    if (!carriesOwnSubstance && `${entry?.description ?? ""}`.trim() === "") {
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
    if (entry?.contents !== undefined) checkContents(entry.contents, label, errors);
  });
}

/**
 * Check what a dataset page tells a reader to cite.
 *
 * Only the paper must carry BibTeX: a registry entry or a Zenodo archive is
 * cited by its own reference line, which the panel renders verbatim.
 *
 * @param {object} data Front matter of one dataset page.
 * @param {string} path File the entries came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkDatasetCitations(data, path, errors) {
  const entries = data?.citations;
  if (!Array.isArray(entries)) return;
  if (entries[0]?.kind !== "Paper") {
    errors.push(`${path}: citation 1 must be the "Paper" the dataset was released with`);
  }
  entries.forEach((entry, index) => {
    const label = `${path}: citation ${index + 1}`;
    if (!DATASET_CITATION_KINDS.includes(entry?.kind)) {
      errors.push(`${label}: kind "${entry?.kind ?? ""}" must be one of ${DATASET_CITATION_KINDS.join(", ")}`);
    }
    if (entry?.kind === "Paper" && `${entry?.entry ?? ""}`.trim() === "") {
      errors.push(`${label}: a "Paper" needs "entry" so the panel can offer BibTeX`);
    }
  });
}

/**
 * Check the four headline figures a dataset page opens with.
 *
 * Values are compared as strings because that is how they are rendered and
 * stored: "1" is rejected whether the file wrote it quoted or bare.
 *
 * @param {object} data Front matter of one dataset page.
 * @param {string} path File the entries came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkDatasetStats(data, path, errors) {
  const entries = data?.stats;
  if (!Array.isArray(entries)) return;
  if (entries.length !== DATASET_STAT_COUNT) {
    errors.push(`${path}: "stats" needs exactly ${DATASET_STAT_COUNT} entries, not ${entries.length}`);
  }
  entries.forEach((entry, index) => {
    const label = `${path}: stats entry ${index + 1}`;
    if (entry?.label !== undefined && !DATASET_STAT_LABELS.includes(entry.label)) {
      errors.push(`${label}: label "${entry.label}" is not in the stat label vocabulary`);
    }
    if (`${entry?.value ?? ""}`.trim() === "1") {
      errors.push(`${label}: a value of "1" is not a headline figure`);
    }
  });
}

/**
 * Check the fixed "about" spine a dataset page renders.
 *
 * The three entries are checked by position rather than by searching for a
 * heading, because an entry under the wrong heading is the common error and
 * reporting it by position says which slot it landed in.
 *
 * @param {object} data Front matter of one dataset page.
 * @param {string} path File the entries came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkDatasetAbout(data, path, errors) {
  const entries = data?.about;
  if (!Array.isArray(entries)) return;
  if (entries.length !== DATASET_ABOUT_HEADINGS.length) {
    errors.push(
      `${path}: "about" needs exactly ${DATASET_ABOUT_HEADINGS.length} entries, not ${entries.length}`,
    );
    return;
  }

  const [project, experiment, contents] = entries;
  DATASET_ABOUT_HEADINGS.forEach((heading, index) => {
    if (entries[index]?.heading !== heading) {
      errors.push(
        `${path}: about entry ${index + 1}: heading "${entries[index]?.heading ?? ""}" must be "${heading}"`,
      );
    }
  });

  if (`${project?.paper_title ?? ""}`.trim() === "" || project?.paper_link === undefined) {
    errors.push(`${path}: about entry 1: "The project" needs "paper_title" and "paper_link"`);
  }
  // Either the entry names a shared paradigm, which brings its own figure, or
  // it describes and illustrates the page's own: the slot is never bare.
  if (experiment?.task === undefined && experiment?.figure === undefined) {
    errors.push(
      `${path}: about entry 2: "The experiment" needs "task", or a "description" with its own "figure"`,
    );
  }
  if (contents?.contents === undefined) {
    errors.push(`${path}: about entry 3: "What's in the dataset" needs "contents"`);
    return;
  }
  checkDatasetContentsGroups(contents.contents, data.modality, path, errors);
}

/**
 * Check that a dataset's contents grid is split by the modalities it declares.
 *
 * The groups carry the vocabulary term, not a display title: the template
 * spells each one through term-spelling.html, so the column header and the
 * filter chip on the index cannot drift apart.
 *
 * @param {object[]} groups The entry's contents list.
 * @param {string[]} modality The page's modality terms, in page order.
 * @param {string} path File the groups came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkDatasetContentsGroups(groups, modality, path, errors) {
  if (!Array.isArray(groups) || !Array.isArray(modality)) return;
  const names = groups.map((group) => group?.name);
  if (names.join("\u0000") !== modality.join("\u0000")) {
    errors.push(
      `${path}: about entry 3: contents groups [${names.join(", ")}] must be ` +
        `the page's modalities [${modality.join(", ")}], in that order`,
    );
  }
}

/**
 * Check the grouped inventory an "about" entry renders below its copy.
 *
 * The groups become the columns of the contents grid and their items become
 * the rows, so both are reported by position: a group that fails its own name
 * check cannot be named in the message about it.
 *
 * @param {object} contents The entry's contents list.
 * @param {string} label Entry and file the contents came from, used in messages.
 * @param {string[]} errors Collected messages, appended to in place.
 */
function checkContents(contents, label, errors) {
  if (!Array.isArray(contents)) {
    errors.push(`${label}: contents must be a list`);
    return;
  }
  contents.forEach((group, groupIndex) => {
    const groupLabel = `${label}: contents group ${groupIndex + 1}`;
    if (typeof group?.name !== "string" || group.name.trim() === "") {
      errors.push(`${groupLabel} is missing "name"`);
    }
    if (!Array.isArray(group?.items) || group.items.length === 0) {
      errors.push(`${groupLabel} needs at least one item`);
      return;
    }
    group.items.forEach((item, itemIndex) => {
      const itemLabel = `${groupLabel} item ${itemIndex + 1}`;
      for (const field of ["name", "description"]) {
        if (typeof item?.[field] !== "string" || item[field].trim() === "") {
          errors.push(`${itemLabel} is missing "${field}"`);
        }
      }
      // The link is captioned by its own text rather than by the item name,
      // because the row names the kind of data and the link names the tool.
      if (item?.link !== undefined && `${item?.link_text ?? ""}`.trim() === "") {
        errors.push(`${itemLabel} sets "link" without "link_text"`);
      }
    });
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
    // Datasets reject "stage" through RETIRED_DATASET_KEYS below; every other
    // section still needs one.
    if (!isDatasetPath(path) && (!Array.isArray(data?.stage) || data.stage.length === 0)) {
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

    if (data?.card_image !== undefined) {
      checkFigure(data.card_image, `${path}: card_image`, errors);
      const fit = data.card_image?.fit;
      if (fit !== undefined && !CARD_IMAGE_FITS.includes(fit)) {
        errors.push(`${path}: card_image fit "${fit}" must be one of ${CARD_IMAGE_FITS.join(", ")}`);
      }
    }

    checkAbout(data, path, errors);
    if (isDatasetPath(path)) {
      for (const field of DATASET_REQUIRED_FIELDS) {
        if (data?.[field] === undefined) {
          errors.push(`${path}: required field "${field}" is missing`);
        }
      }
      checkDatasetAbout(data, path, errors);
      checkDatasetStats(data, path, errors);
      checkDatasetCitations(data, path, errors);
      for (const [key, message] of Object.entries(RETIRED_DATASET_KEYS)) {
        if (data?.[key] !== undefined) errors.push(`${path}: ${message}`);
      }
    }
    checkStats(data, path, errors);

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
