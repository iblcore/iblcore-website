import assert from "node:assert/strict";
import test from "node:test";
import { datasetHasModality, stepCardApplies } from "./workflow-fork-match.js";

const brainwideMap = {
  path: "/resources/data/brainwide-map",
  chooser: true,
  access: ["one", "dandi", "ibl-ai-agent"],
  datasets: [],
  modality: ["neuropixels", "behavior", "video"],
};
const widefield = {
  path: "/resources/data/widefield",
  chooser: true,
  access: ["one"],
  datasets: [],
  modality: ["widefield"],
};

test("with nothing chosen every card applies", () => {
  assert.equal(stepCardApplies(brainwideMap, null), true);
  assert.equal(stepCardApplies(widefield, null), true);
});

test("choosing a dataset collapses the chooser step to that dataset", () => {
  assert.equal(stepCardApplies(brainwideMap, brainwideMap), true);
  assert.equal(stepCardApplies(widefield, brainwideMap), false);
});

const one = { path: "/resources/tools/one", chooser: false, access: ["one"], datasets: [] };
const dandi = { path: "/resources/tools/dandi", chooser: false, access: ["dandi"], datasets: [] };
const explorer = {
  path: "/resources/tools/data-explorer",
  chooser: false,
  access: [],
  datasets: ["/resources/data/brainwide-map"],
};
const datoviz = { path: "/resources/tools/datoviz", chooser: false, access: [], datasets: [] };

test("an access route applies only to datasets published through it", () => {
  assert.equal(stepCardApplies(dandi, brainwideMap), true);
  assert.equal(stepCardApplies(dandi, widefield), false, "Widefield is ONE only");
  assert.equal(stepCardApplies(one, widefield), true);
});

test("a resource naming its datasets applies to those alone", () => {
  assert.equal(stepCardApplies(explorer, brainwideMap), true);
  assert.equal(stepCardApplies(explorer, widefield), false);
});

test("a resource claiming neither applies to every dataset", () => {
  assert.equal(stepCardApplies(datoviz, brainwideMap), true);
  assert.equal(stepCardApplies(datoviz, widefield), true);
});

test("no modality chosen leaves every dataset in the list", () => {
  assert.equal(datasetHasModality(brainwideMap, ""), true);
  assert.equal(datasetHasModality(widefield, ""), true);
});

test("a modality keeps only the datasets recorded with it", () => {
  assert.equal(datasetHasModality(brainwideMap, "video"), true);
  assert.equal(datasetHasModality(widefield, "video"), false);
  assert.equal(datasetHasModality(widefield, "widefield"), true);
});
