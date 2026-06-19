import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, 'content', 'resources');

function stripQuotes(value) {
  if (!value) {
    return value;
  }

  const quoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));

  return quoted ? value.slice(1, -1) : value;
}

function parseFrontMatter(markdown) {
  const lines = markdown.split(/\r?\n/);
  if (lines[0] !== '---') {
    return null;
  }

  const data = {};
  let currentKey = null;
  let currentValueType = null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') {
      break;
    }

    const arrayMatch = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (arrayMatch) {
      currentKey = arrayMatch[1];
      currentValueType = 'array';
      data[currentKey] = [];
      continue;
    }

    const inlineMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (inlineMatch) {
      currentKey = inlineMatch[1];
      currentValueType = 'scalar';
      data[currentKey] = stripQuotes(inlineMatch[2].trim());
      continue;
    }

    const listItemMatch = line.match(/^\s*-\s*(.*)$/);
    if (listItemMatch && currentValueType === 'array' && currentKey) {
      data[currentKey].push(stripQuotes(listItemMatch[1].trim()));
    }
  }

  return data;
}

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await collectMarkdownFiles(contentRoot);
const resources = new Map();
const duplicateIds = [];
const references = [];

for (const file of files) {
  const markdown = await fs.readFile(file, 'utf8');
  const frontMatter = parseFrontMatter(markdown);

  if (!frontMatter || !frontMatter.resource_type) {
    continue;
  }

  const id = frontMatter.resource_id || path.basename(file, '.md');
  if (resources.has(id)) {
    duplicateIds.push({
      id,
      firstFile: resources.get(id),
      duplicateFile: file,
    });
  }
  resources.set(id, file);

  const requires = Array.isArray(frontMatter.requires) ? frontMatter.requires : [];
  for (const requiredId of requires) {
    references.push({
      file,
      id,
      requiredId,
    });
  }
}

if (duplicateIds.length > 0) {
  console.error('Duplicate resource IDs found:');

  for (const dup of duplicateIds) {
    console.error(`- ${dup.id}: ${path.relative(repoRoot, dup.firstFile)} and ${path.relative(repoRoot, dup.duplicateFile)}`);
  }

  process.exit(1);
}

const missing = references.filter((ref) => !resources.has(ref.requiredId));

if (missing.length > 0) {
  console.error('Invalid resource dependencies found:');

  for (const ref of missing) {
    console.error(`- ${path.relative(repoRoot, ref.file)}: ${ref.id} requires missing resource "${ref.requiredId}"`);
  }

  process.exit(1);
}

console.log(`Validated ${references.length} required resource references across ${resources.size} resources.`);
