import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { parseYaml, validateEventsData } from "./events-data-validator.mjs";

const fixture = parseYaml(
  await fs.readFile(new URL("./fixtures/events-invalid.yaml", import.meta.url), "utf8"),
  "fixture",
).value;
const projects = { sections: [{ id: "affiliates", items: [{ id: "issue-210" }] }] };

test("invalid Events fixture reports every supported validation category", () => {
  const errors = validateEventsData(fixture, projects).join("\n");
  for (const expected of [
    "required field \"name\" is missing",
    "duplicate id",
    "end_date cannot be earlier than start_date",
    "physical events require latitude",
    "unknown affiliate ID \"issue-999\"",
  ]) {
    assert.match(errors, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
