import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const sourcePath = path.resolve("static", "llms.txt");
const builtPath = path.resolve("public", "llms.txt");
const canonicalOrigin = "https://iblcore.org";

function fail(message) {
  console.error(`llms.txt check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(sourcePath)) fail("static/llms.txt is missing.");
if (!fs.existsSync(builtPath)) fail("public/llms.txt is missing; build Hugo first.");

const source = fs.readFileSync(sourcePath, "utf8");
const built = fs.readFileSync(builtPath, "utf8");

if (source !== built) fail("the built file differs from static/llms.txt.");
if (!source.startsWith("# IBL-Core\n")) fail("the file must start with '# IBL-Core'.");
if (!/^> .+/m.test(source)) fail("the file needs a blockquote summary.");

const links = [...source.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)].map(
  (match) => match[1],
);
if (links.length === 0) fail("no HTTPS links were found.");

const duplicates = links.filter((url, index) => links.indexOf(url) !== index);
if (duplicates.length > 0) fail(`duplicate links: ${[...new Set(duplicates)].join(", ")}`);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const link of links) {
  const url = new URL(link);
  if (url.origin !== canonicalOrigin) continue;

  const decodedPath = decodeURIComponent(url.pathname);
  const outputPath = decodedPath.endsWith("/")
    ? path.join("public", decodedPath, "index.html")
    : path.join("public", decodedPath);

  if (!fs.existsSync(outputPath)) {
    fail(`${link} does not map to generated output at ${outputPath}.`);
  }

  if (url.hash) {
    const fragment = decodeURIComponent(url.hash.slice(1));
    const html = fs.readFileSync(outputPath, "utf8");
    const escaped = escapeRegex(fragment);
    const idPattern = new RegExp(`\\bid=(?:"${escaped}"|'${escaped}'|${escaped}(?:\\s|>))`);
    if (!idPattern.test(html)) fail(`${link} points to a missing fragment.`);
  }
}

console.log(`llms.txt check passed (${links.length} links).`);
