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
  resource("content/resources/data/brainwide-map.md", valid),
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
      resource("content/resources/data/brainwide-map.md", { ...valid, stage: ["analyse"] }),
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
const dataset = [resource("content/resources/data/brainwide-map.md", { ...valid, stage: ["analyse"] })];

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

test("an explore figure is validated like an about figure", () => {
  const explore = { description: "Copy.", figure: { src: "images/viz.jpg" } };
  const errors = validateResourcesData([resource("a.md", { ...valid, explore })], []).join("\n");
  assert.match(errors, /explore: figure: required field "alt" is missing/);
});

test("explore highlights must be a list of strings", () => {
  const explore = { description: "Copy.", highlights: ["Fine", 7] };
  const errors = validateResourcesData([resource("a.md", { ...valid, explore })], []).join("\n");
  assert.match(errors, /explore: highlight 2 must be a string/);
});
