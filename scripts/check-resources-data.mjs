import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parseYaml } from "./events-data-validator.mjs";
import { parseFrontMatter, validateResourcesData } from "./resources-data-validator.mjs";

const RESOURCE_SECTIONS = ["data", "tools", "hardware", "protocols"];

// Section pages describe the section, not a resource, so they carry none of the
// front matter this validates.
const isResourceFile = (name) => name.endsWith(".md") && name !== "_index.md";

async function readSection(relativeDirectory) {
  const directory = path.resolve("content/resources", relativeDirectory);
  const names = await fs.readdir(directory).catch(() => []);
  return Promise.all(
    names.filter(isResourceFile).map(async (name) => {
      const filePath = path.join("content/resources", relativeDirectory, name);
      const source = await fs.readFile(path.resolve(filePath), "utf8");
      return { path: filePath, data: parseFrontMatter(source, filePath, parseYaml) };
    }),
  );
}

const contentRoot = process.argv[2];
if (contentRoot) process.chdir(contentRoot);

const resources = (await Promise.all(RESOURCE_SECTIONS.map(readSection))).flat();
const workflows = await readSection("workflows");
const errors = validateResourcesData(resources, workflows);

if (errors.length > 0) {
  console.error(`Resources data check failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Resources data check passed (${resources.length} resources, ${workflows.length} workflows).`);
