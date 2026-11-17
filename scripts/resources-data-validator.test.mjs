import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { parseYaml } from "./events-data-validator.mjs";
import { parseFrontMatter, validateResourcesData } from "./resources-data-validator.mjs";

const resource = (path, data) => ({ path, data });

test("a resource missing required front matter is reported by path", () => {
  const errors = validateResourcesData(
    [resource("content/resources/tools/broken.md", { description: "No title.", stage: ["analyse"] })],
    [],
  ).join("\n");
  assert.match(errors, /tools\/broken\.md/);
  assert.match(errors, /"title"/);
});

const valid = { title: "Datoviz", description: "Rendering.", modality: [], stage: ["visualise"] };

const datasetPath = "content/resources/data/brainwide-map.md";

// A dataset page that satisfies the whole spine, so each test below can break
// exactly one rule and leave the rest reporting nothing.
const validDataset = {
  title: "Brainwide Map",
  description: "IBL's flagship dataset.",
  lead: "A whole-brain map of neural activity.",
  weight: 1,
  card_image: { src: "images/brainwide-map-card.png", alt: "A translucent mouse brain." },
  modality: ["neuropixels", "behavior"],
  access: ["one"],
  stats: [
    { value: "699", label: "Probe insertions" },
    { value: "241", label: "Brain regions" },
    { value: "139", label: "Subjects" },
    { value: "12", label: "Laboratories" },
  ],
  about: [
    {
      heading: "The project",
      description: "Twelve laboratories sampled a shared grid of targets.",
      paper_title: "A brain-wide map of neural activity",
      paper_link: "https://www.nature.com/articles/s41586-025-09235-0",
    },
    { heading: "The experiment", task: "ibl" },
    {
      heading: "What's in the dataset",
      description: "Neural activity paired trial by trial with behavior.",
      contents: [
        { name: "neuropixels", items: [{ name: "Spike-sorted activity", description: "621,733 units." }] },
        { name: "behavior", items: [{ name: "Trials", description: "Choices." }] },
      ],
    },
  ],
  citations: [{ kind: "Paper", reference: "IBL et al. (2025).", entry: "@article{iblbwm2025,}" }],
};

test("a resource needs at least one stage", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, stage: [] })],
    [],
  ).join("\n");
  assert.match(errors, /at least one "stage"/);
});

test("terms outside the vocabulary are reported with the term", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, stage: ["analysis"], modality: ["ephys"] })],
    [],
  ).join("\n");
  assert.match(errors, /stage "analysis"/);
  assert.match(errors, /modality "ephys"/);
});

test("a valid resource reports nothing", () => {
  assert.deepEqual(validateResourcesData([resource("a.md", valid)], []), []);
});

test("an access_guides key not in access is reported", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, access: ["one"], access_guides: { dandi: "https://x.test/" } })],
    [],
  ).join("\n");
  assert.match(errors, /access_guides key "dandi"/);
});

test("a card image without alt text is reported", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, card_image: { src: "images/a.jpg" } })],
    [],
  ).join("\n");
  assert.match(errors, /card_image/);
  assert.match(errors, /"alt"/);
});

test("a card image needs a source", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, card_image: { alt: "A mouse brain." } })],
    [],
  ).join("\n");
  assert.match(errors, /card_image needs exactly one of "src" or "video"/);
});

test("a card image fit outside the vocabulary is reported", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, card_image: { src: "a.png", alt: "A logo.", fit: "fill" } })],
    [],
  ).join("\n");
  assert.match(errors, /card_image fit "fill"/);
});

test("status must be released or coming-soon", () => {
  const errors = validateResourcesData([resource("a.md", { ...valid, status: "draft" })], []).join("\n");
  assert.match(errors, /status "draft"/);
});

test("links keys are known and their values absolute", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, links: { website: "https://x.test/", docs: "/relative/" } })],
    [],
  ).join("\n");
  assert.match(errors, /links key "website"/);
  assert.match(errors, /links\.docs .*absolute/);
});

const resources = [
  resource("content/resources/tools/one.md", valid),
  resource(datasetPath, validDataset),
];

test("a workflow step needs a title and a resource", () => {
  const errors = validateResourcesData(resources, [
    resource("w.md", {
      title: "W", description: "D", stage: ["analyse"],
      steps: [{ resource: "/resources/tools/one" }, { title: "No resource" }],
    }),
  ]).join("\n");
  assert.match(errors, /step 1.*"title"/);
  assert.match(errors, /step 2.*"resource"/);
});

test("a step resource that is not a resource file is reported", () => {
  const errors = validateResourcesData(resources, [
    resource("w.md", {
      title: "W", description: "D", stage: ["analyse"],
      steps: [{ title: "S", resource: ["/resources/tools/one", "/resources/tools/ghost"] }],
    }),
  ]).join("\n");
  assert.match(errors, /"\/resources\/tools\/ghost"/);
  assert.doesNotMatch(errors, /tools\/one"/);
});

test("a valid workflow reports nothing", () => {
  assert.deepEqual(
    validateResourcesData(resources, [
      resource("w.md", {
        title: "W", description: "D", stage: ["analyse"],
        steps: [{ title: "S", resource: "/resources/data/brainwide-map" }],
      }),
    ]),
    [],
  );
});

test("the invalid fixture tree reports every supported category", async () => {
  const root = new URL("./fixtures/resources-invalid/content/resources/", import.meta.url);
  const read = async (section) => {
    const directory = new URL(`${section}/`, root);
    const names = await fs.readdir(directory);
    return Promise.all(
      names.map(async (name) => ({
        path: `content/resources/${section}/${name}`,
        data: parseFrontMatter(await fs.readFile(new URL(name, directory), "utf8"), name, parseYaml),
      })),
    );
  };

  const errors = validateResourcesData(await read("tools"), await read("workflows")).join("\n");
  for (const expected of [
    'required field "title" is missing',
    'modality "ephys" is not in the modality vocabulary',
    'stage "analysis" is not in the stage vocabulary',
    'access "globus" is not in the access vocabulary',
    'every resource needs at least one "stage"',
    'access_guides key "dandi"',
    'status "draft"',
    'links key "website"',
    "links.docs must be an absolute URL",
    'step 1 is missing "title"',
    'step 2 is missing "resource"',
    '"/resources/tools/ghost", which is not a resource file',
    'step 4: routes refers to "/resources/tools/phantom"',
    '"project" is retired; move its copy into "about"',
    'about entry 2 is missing "description"',
    "about entry 1: paper_link must be an absolute URL",
    'stats entry 2 is missing "label"',
    'figure: required field "alt" is missing',
  ]) {
    assert.match(errors, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(errors, /fine\.md/, "the valid fixture file must report nothing");
});

test("a resource restricted to datasets that do not exist is reported", () => {
  const errors = validateResourcesData(
    [
      resource(datasetPath, validDataset),
      resource("content/resources/tools/explorer.md", {
        ...valid,
        datasets: ["/resources/data/brainwide-map", "/resources/data/ghost"],
      }),
    ],
    [],
  ).join("\n");
  assert.match(errors, /"\/resources\/data\/ghost", which is not a resource file/);
  assert.doesNotMatch(errors, /brainwide-map/, "the dataset that does exist must not be reported");
});

const workflowWith = (steps) => ({
  path: "content/resources/workflows/w.md",
  data: { title: "W", description: "D", steps },
});
const step = (extra) => ({ title: "S", resource: "/resources/data/brainwide-map", ...extra });
const dataset = [resource(datasetPath, validDataset)];

test("a step can mark itself the workflow's dataset chooser", () => {
  assert.deepEqual(
    validateResourcesData(dataset, [workflowWith([step({ choice: "dataset" }), step({})])]),
    [],
  );
});

test("a choice the fork does not know how to make is reported", () => {
  const errors = validateResourcesData(dataset, [workflowWith([step({ choice: "modality" })])]).join("\n");
  assert.match(errors, /choice "modality" must be one of dataset/);
});

test("a second chooser in one workflow is reported", () => {
  const errors = validateResourcesData(
    dataset,
    [workflowWith([step({ choice: "dataset" }), step({ choice: "dataset" })])],
  ).join("\n");
  assert.match(errors, /step 2: a workflow can only have one "choice" step/);
});

test("a step may compare the access routes its datasets are published through", () => {
  assert.deepEqual(
    validateResourcesData(
      [...dataset, resource("content/resources/tools/one.md", { ...valid, stage: ["analyse"] })],
      [workflowWith([step({ choice: "dataset", routes: ["/resources/tools/one"] })])],
    ),
    [],
  );
});

test("a step route that is not a resource file is reported", () => {
  const errors = validateResourcesData(
    dataset,
    [workflowWith([step({ routes: ["/resources/tools/ghost"] })])],
  ).join("\n");
  assert.match(errors, /step 1: routes refers to "\/resources\/tools\/ghost", which is not a resource file/);
});

test("the retired project and task keys are reported with their replacement", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, project: { description: "x" }, task: { description: "y" } })],
    [],
  ).join("\n");
  assert.match(errors, /"project" is retired; move its copy into "about"/);
  assert.match(errors, /"task" is retired; move its copy into "about"/);
});

test("an about entry without a description is reported by position", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Fine." }, { heading: "No copy" }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 2 is missing "description"/);
});

test("an about entry's paper_link must be absolute", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", paper_link: "/papers/one/" }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1: paper_link must be an absolute URL/);
});

test("a resource carrying valid about entries reports nothing", () => {
  const about = [
    { heading: "The project", description: "Copy.", link: "/projects/", link_label: "Project", link_text: "IBL research projects" },
    { description: "More copy.", paper_title: "A paper", paper_link: "https://x.test/p" },
  ];
  assert.deepEqual(validateResourcesData([resource("a.md", { ...valid, about })], []), []);
});

test("a stats entry needs both a value and a label", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, stats: [{ value: "699", label: "Insertions" }, { value: "241" }] })],
    [],
  ).join("\n");
  assert.match(errors, /stats entry 2 is missing "label"/);
});

test("a resource carrying valid stats reports nothing", () => {
  const stats = [{ value: "699", label: "Probe insertions" }, { value: "12", label: "Laboratories" }];
  assert.deepEqual(validateResourcesData([resource("a.md", { ...valid, stats })], []), []);
});

test("a figure without alt text is reported", () => {
  const about = [{ description: "Copy.", figure: { src: "images/task.webp" } }];
  const errors = validateResourcesData([resource("a.md", { ...valid, about })], []).join("\n");
  assert.match(errors, /about entry 1: figure: required field "alt" is missing/);
});

test("a figure cannot be both a still and a clip", () => {
  const figure = { src: "images/task.webp", video: "images/task.mp4", poster: "p.jpg", alt: "The task" };
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", figure }] })],
    [],
  ).join("\n");
  assert.match(errors, /needs exactly one of "src" or "video"/);
});

test("a resource carrying a valid figure reports nothing", () => {
  const figure = { src: "images/task.webp", alt: "The task", caption: "One trial." };
  assert.deepEqual(
    validateResourcesData([resource("a.md", { ...valid, about: [{ description: "C.", figure }] })], []),
    [],
  );
});

test("an about entry's link needs a label to caption it", () => {
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", link: "/projects/" }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1 sets "link" without "link_label"/);
});

test("an about entry's video figure needs a poster", () => {
  const about = [{ description: "Copy.", figure: { video: "images/map.mp4", alt: "A brain" } }];
  const errors = validateResourcesData([resource("a.md", { ...valid, about })], []).join("\n");
  assert.match(errors, /about entry 1: figure sets "video" without "poster"/);
});

test("a figure tone outside the vocabulary is reported", () => {
  const figure = { src: "images/task.jpg", alt: "The task", tone: "transparent" };
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", figure }] })],
    [],
  ).join("\n");
  assert.match(errors, /figure tone "transparent" must be one of light, dark/);
});



test("a contents group needs a name to head its column", () => {
  const contents = [{ items: [{ name: "Trials", description: "Choices." }] }];
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", contents }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1: contents group 1 is missing "name"/);
});

test("a contents group needs at least one item", () => {
  const contents = [{ name: "Neural", items: [] }];
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", contents }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1: contents group 1 needs at least one item/);
});

test("a contents item is reported by its position in its group", () => {
  const contents = [
    { name: "Neural", items: [{ name: "Spikes", description: "Units." }, { name: "Raw" }] },
  ];
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", contents }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1: contents group 1 item 2 is missing "description"/);
});

// The item name is the scannable part of the row, so a missing one leaves a
// description with nothing to label it.
test("a contents item without a name is reported", () => {
  const contents = [{ name: "Video", items: [{ description: "Tracking." }] }];
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", contents }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1: contents group 1 item 1 is missing "name"/);
});

test("a contents item's link needs the text that captions it", () => {
  const contents = [
    { name: "Video", items: [{ name: "Pose", description: "Tracking.", link: "/resources/tools/x/" }] },
  ];
  const errors = validateResourcesData(
    [resource("a.md", { ...valid, about: [{ description: "Copy.", contents }] })],
    [],
  ).join("\n");
  assert.match(errors, /about entry 1: contents group 1 item 1 sets "link" without "link_text"/);
});

test("a resource carrying valid contents reports nothing", () => {
  const contents = [
    { name: "Neural", items: [{ name: "Spikes", description: "621,733 units." }] },
    {
      name: "Video",
      items: [
        { name: "Pose", description: "Tracking.", link: "/resources/tools/lightning-pose/", link_text: "Lightning Pose" },
      ],
    },
  ];
  assert.deepEqual(
    validateResourcesData([resource("a.md", { ...valid, about: [{ description: "C.", contents }] })], []),
    [],
  );
});

// --- Dataset page spine (specs/dataset-page-structure.md) -------------------

test("a dataset page carrying stage is reported", () => {
  const errors = validateResourcesData(
    [resource(datasetPath, { ...validDataset, stage: ["analyse"] })],
    [],
  ).join("\n");
  assert.match(errors, /"stage" is retired on dataset pages/);
});

test("a dataset page is not asked for a stage", () => {
  assert.deepEqual(validateResourcesData([resource(datasetPath, validDataset)], []), []);
});

test("a dataset page with a fourth about entry is reported", () => {
  const about = [...validDataset.about, { heading: "Built on this data", description: "Copy." }];
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /"about" needs exactly 3 entries, not 4/);
});

test("a dataset about entry under the wrong heading is reported by position", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 1 ? { ...entry, heading: "The task" } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /about entry 2: heading "The task" must be "The experiment"/);
});

test("a dataset project entry without its paper is reported", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 0 ? { heading: entry.heading, description: entry.description } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /about entry 1: "The project" needs "paper_title" and "paper_link"/);
});

test("a dataset experiment entry needs either a task or its own figure", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 1 ? { heading: entry.heading, description: "Its own experiment." } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /about entry 2: "The experiment" needs "task", or a "description" with its own "figure"/);
});

test("a dataset contents entry without contents is reported", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 2 ? { heading: entry.heading, description: entry.description } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /about entry 3: "What's in the dataset" needs "contents"/);
});

test("contents groups that are not the page's modalities are reported", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 2 ? { ...entry, contents: [{ name: "Neural", items: [{ name: "N", description: "D." }] }] } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /contents groups \[Neural\] must be the page's modalities \[neuropixels, behavior\]/);
});

test("contents groups in a different order from modality are reported", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 2
      ? {
          ...entry,
          contents: [...entry.contents].reverse(),
        }
      : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, about })], []).join("\n");
  assert.match(errors, /contents groups \[behavior, neuropixels\] must be the page's modalities/);
});

test("a dataset stats strip that is not four entries is reported", () => {
  const stats = validDataset.stats.slice(0, 3);
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, stats })], []).join("\n");
  assert.match(errors, /"stats" needs exactly 4 entries, not 3/);
});

test("a stat label outside the vocabulary is reported with the label", () => {
  const stats = validDataset.stats.map((entry, index) =>
    index === 3 ? { value: "7", label: "Institutions" } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, stats })], []).join("\n");
  assert.match(errors, /stats entry 4: label "Institutions" is not in the stat label vocabulary/);
});

// A headline figure of one is not a measurement of the dataset, it is a fact
// about its design: "1 Repeated site", "1 Laboratory".
test("a stat whose value is one is reported", () => {
  const stats = validDataset.stats.map((entry, index) =>
    index === 1 ? { value: "1", label: "Laboratories" } : entry,
  );
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, stats })], []).join("\n");
  assert.match(errors, /stats entry 2: a value of "1" is not a headline figure/);
});

test("a citation kind outside the vocabulary is reported with the kind", () => {
  const citations = [...validDataset.citations, { kind: "AWS Open Data Registry", reference: "R" }];
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, citations })], []).join("\n");
  assert.match(errors, /citation 2: kind "AWS Open Data Registry" must be one of Paper, Data release, Registry entry, Code/);
});

test("a dataset whose first citation is not the paper is reported", () => {
  const citations = [{ kind: "Code", reference: "Zenodo." }, ...validDataset.citations];
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, citations })], []).join("\n");
  assert.match(errors, /citation 1 must be the "Paper"/);
});

test("a paper citation without its BibTeX entry is reported", () => {
  const citations = [{ kind: "Paper", reference: "IBL et al. (2025)." }];
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, citations })], []).join("\n");
  assert.match(errors, /citation 1: a "Paper" needs "entry"/);
});

test("a dataset page still carrying an explore block is reported", () => {
  const explore = { heading: "Explore it", description: "Copy." };
  const errors = validateResourcesData([resource(datasetPath, { ...validDataset, explore })], []).join("\n");
  assert.match(errors, /"explore" is retired; the viewer is an access route/);
});

test("a dataset page missing its lead, weight or card image is reported", () => {
  const { lead, weight, card_image, ...rest } = validDataset;
  const errors = validateResourcesData([resource(datasetPath, rest)], []).join("\n");
  assert.match(errors, /required field "lead" is missing/);
  assert.match(errors, /required field "weight" is missing/);
  assert.match(errors, /required field "card_image" is missing/);
});

test("explorer is an access route a dataset can be published through", () => {
  const data = { ...validDataset, access: ["explorer", "one"], access_guides: { explorer: "https://viz.internationalbrainlab.org" } };
  assert.deepEqual(validateResourcesData([resource(datasetPath, data)], []), []);
});

// The contents grid is the entry's substance: "What's in the dataset" lists
// what the release holds rather than describing it in prose.
test("an about entry carrying contents needs no description", () => {
  const about = validDataset.about.map((entry, index) =>
    index === 2 ? { heading: entry.heading, contents: entry.contents } : entry,
  );
  assert.deepEqual(validateResourcesData([resource(datasetPath, { ...validDataset, about })], []), []);
});
