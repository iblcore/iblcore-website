import assert from "node:assert/strict";
import test from "node:test";
import { matchesFilters } from "./resource-filter-match.js";

const brainwideMap = {
  modality: ["neuropixels", "behavior", "video"],
  access: ["one", "dandi", "ibl-ai-agent"],
  search: "brainwide map ibl's flagship dataset",
};

const widefield = {
  modality: ["widefield", "behavior"],
  access: ["one"],
  search: "widefield calcium imaging of dorsal cortex",
};

const noFilters = { modality: [], access: [], search: "" };

test("a dataset matches when no filter is active", () => {
  assert.equal(matchesFilters(brainwideMap, noFilters), true);
});

test("one active group narrows to datasets carrying that term", () => {
  const state = { ...noFilters, modality: ["widefield"] };
  assert.equal(matchesFilters(widefield, state), true);
  assert.equal(matchesFilters(brainwideMap, state), false);
});

test("groups intersect: a dataset matching only one group is excluded", () => {
  const state = { ...noFilters, modality: ["widefield"], access: ["dandi"] };
  assert.equal(matchesFilters(widefield, state), false, "matches modality but not access");
  assert.equal(matchesFilters(brainwideMap, state), false, "matches access but not modality");
});

test("terms within a group are alternatives", () => {
  const state = { ...noFilters, modality: ["widefield", "neuropixels"] };
  assert.equal(matchesFilters(brainwideMap, state), true);
  assert.equal(matchesFilters(widefield, state), true);
});

test("search matches description text, case-insensitively", () => {
  assert.equal(matchesFilters(brainwideMap, { ...noFilters, search: "FLAGSHIP" }), true);
  assert.equal(matchesFilters(widefield, { ...noFilters, search: "FLAGSHIP" }), false);
});

test("search and chips both apply", () => {
  const state = { ...noFilters, access: ["one"], search: "calcium" };
  assert.equal(matchesFilters(widefield, state), true);
  assert.equal(matchesFilters(brainwideMap, state), false);
});

test("an impossible combination matches nothing", () => {
  const state = { ...noFilters, modality: ["widefield"], access: ["ibl-ai-agent"] };
  assert.equal([brainwideMap, widefield].filter((c) => matchesFilters(c, state)).length, 0);
});
