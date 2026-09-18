import assert from "node:assert/strict";
import test from "node:test";
import { matchesFilters } from "./resource-filter-match.js";

const brainwideMap = {
  type: "data",
  modality: ["neuropixels", "behavior", "video"],
  stage: ["explore", "analyse"],
  access: ["one", "dandi", "ibl-ai-agent"],
  search: "brainwide map ibl's flagship dataset dataset",
};

const noFilters = { type: [], modality: [], stage: [], access: [], search: "" };

test("a card matches when no filter is active", () => {
  assert.equal(matchesFilters(brainwideMap, noFilters), true);
});

const datoviz = {
  type: "tools",
  modality: [],
  stage: ["visualise"],
  access: [],
  search: "datoviz high-performance gpu rendering tool",
};

test("one active group narrows to cards carrying that term", () => {
  const state = { ...noFilters, stage: ["visualise"] };
  assert.equal(matchesFilters(datoviz, state), true);
  assert.equal(matchesFilters(brainwideMap, state), false);
});

test("groups intersect: a card matching only one group is excluded", () => {
  const state = { ...noFilters, stage: ["visualise"], type: ["data"] };
  assert.equal(matchesFilters(datoviz, state), false, "matches stage but not type");
  assert.equal(matchesFilters(brainwideMap, state), false, "matches type but not stage");
});

test("terms within a group are alternatives", () => {
  const state = { ...noFilters, modality: ["widefield", "neuropixels"] };
  assert.equal(matchesFilters(brainwideMap, state), true);
});

test("search matches description text, case-insensitively", () => {
  assert.equal(matchesFilters(brainwideMap, { ...noFilters, search: "FLAGSHIP" }), true);
  assert.equal(matchesFilters(datoviz, { ...noFilters, search: "FLAGSHIP" }), false);
});

test("search and chips both apply", () => {
  const state = { ...noFilters, type: ["tools"], search: "rendering" };
  assert.equal(matchesFilters(datoviz, state), true);
  assert.equal(matchesFilters({ ...datoviz, type: "data" }, state), false);
});

test("an impossible combination matches nothing", () => {
  const state = { ...noFilters, modality: ["widefield"], stage: ["visualise"] };
  assert.equal([brainwideMap, datoviz].filter((c) => matchesFilters(c, state)).length, 0);
});
