import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const resourcesRoot = path.join(repoRoot, 'content', 'resources');
const modalitiesFile = path.join(repoRoot, 'data', 'modalities.yaml');

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
  const arrayKeys = new Set([
    'audience',
    'requires',
    'uses',
    'datasets',
    'methods',
    'learning',
    'workflows',
    'next_steps',
    'modalities',
  ]);

  let currentKey = null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') {
      break;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, rawValue] = keyMatch;
      const value = rawValue.trim();

      if (value === '') {
        currentKey = arrayKeys.has(key) ? key : null;
        data[key] = currentKey ? [] : '';
      } else {
        currentKey = null;
        data[key] = stripQuotes(value);
      }
      continue;
    }

    const listItemMatch = line.match(/^\s*-\s*(.*)$/);
    if (listItemMatch && currentKey && Array.isArray(data[currentKey])) {
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

async function loadAllowedModalities() {
  const yaml = await fs.readFile(modalitiesFile, 'utf8');
  const slugs = new Set();

  for (const line of yaml.split(/\r?\n/)) {
    const match = line.match(/^\s*-\s*slug:\s*([A-Za-z0-9_-]+)\s*$/);
    if (match) {
      slugs.add(match[1]);
    }
  }

  return slugs;
}

const allowedModalities = await loadAllowedModalities();
const files = await collectMarkdownFiles(resourcesRoot);
const errors = [];
const canonicalNames = new Map();

for (const file of files) {
  const baseName = path.basename(file);
  if (baseName === '_index.md' || baseName === 'ecosystem.md') {
    continue;
  }

  const markdown = await fs.readFile(file, 'utf8');
  const frontMatter = parseFrontMatter(markdown);
  const relativeFile = path.relative(repoRoot, file);

  if (!frontMatter) {
    continue;
  }

  if (!frontMatter.resource_type) {
    errors.push(`${relativeFile}: missing resource_type`);
    continue;
  }

  if ('modality' in frontMatter) {
    errors.push(`${relativeFile}: use modalities instead of the deprecated modality field`);
  }

  const scope = frontMatter.modality_scope || '';
  const modalities = Array.isArray(frontMatter.modalities) ? frontMatter.modalities : [];

  if (scope && !['specific', 'cross_modal'].includes(scope)) {
    errors.push(`${relativeFile}: invalid modality_scope "${scope}"`);
  }

  for (const modality of modalities) {
    if (!allowedModalities.has(modality)) {
      errors.push(
        `${relativeFile}: invalid modality "${modality}" - allowed values are ${Array.from(allowedModalities).sort().join(', ')}`
      );
    }
  }

  if (scope === 'cross_modal' && modalities.length > 0) {
    errors.push(`${relativeFile}: cross_modal resources should not list specific modalities`);
  }

  if (scope === 'specific' && modalities.length === 0) {
    errors.push(`${relativeFile}: specific resources should list at least one modality`);
  }

  const canonicalName = String(frontMatter.canonical_name || frontMatter.title || '').trim();
  if (!canonicalName) {
    errors.push(`${relativeFile}: missing canonical name`);
  } else {
    const key = canonicalName.toLowerCase();
    if (canonicalNames.has(key)) {
      errors.push(
        `${relativeFile}: duplicate canonical name "${canonicalName}" also used by ${path.relative(repoRoot, canonicalNames.get(key))}`
      );
    } else {
      canonicalNames.set(key, file);
    }
  }
}

if (errors.length > 0) {
  console.error('Resource schema validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${files.length} resource markdown files against ${allowedModalities.size} allowed modalities.`);
