import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parseYaml, validateEventsData } from "./events-data-validator.mjs";

const readYaml = async (relativePath) => {
  const label = relativePath;
  const source = await fs.readFile(path.resolve(relativePath), "utf8");
  return parseYaml(source, label);
};

const eventsDocument = await readYaml("data/events.yaml");
const projectsDocument = await readYaml("data/projects.yaml");
const errors = [...eventsDocument.errors, ...projectsDocument.errors];
if (errors.length === 0) errors.push(...validateEventsData(eventsDocument.value, projectsDocument.value));

if (errors.length > 0) {
  console.error(`Events data check failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Events data check passed (${eventsDocument.value.events.length} events).`);
