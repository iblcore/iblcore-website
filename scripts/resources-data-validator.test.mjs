import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { parseYaml } from "./events-data-validator.mjs";
import { parseFrontMatter, validateResourcesData } from "./resources-data-validator.mjs";

const resource = (path, data) => ({ path, data });

test("a resource missing required front matter is reported by path", () => {
  const errors = validateResourcesData(
    [resource("content/resources/tools/broken.md", { description: "No title.", stage: ["explore"] })],
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
      title: "W", description: "D", stage: ["explore"],
      steps: [{ resource: "/resources/tools/one" }, { title: "No resource" }],
    }),
  ]).join("\n");
  assert.match(errors, /step 1.*"title"/);
  assert.match(errors, /step 2.*"resource"/);
});

test("a step resource that is not a resource file is reported", () => {
  const errors = validateResourcesData(resources, [
    resource("w.md", {
      title: "W", description: "D", stage: ["explore"],
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
        title: "W", description: "D", stage: ["explore"],
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
  ]) {
    assert.match(errors, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(errors, /fine\.md/, "the valid fixture file must report nothing");
});
