import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'index.html');
const scriptPath = resolve(root, 'script.js');
const html = readFileSync(htmlPath, 'utf8');
const script = readFileSync(scriptPath, 'utf8');
const errors = [];

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);
for (const id of ids) {
  if (ids.indexOf(id) !== ids.lastIndexOf(id)) errors.push(`Duplicate HTML id: ${id}`);
}

const projectBlock = script.split('const projects = {')[1]?.split('\n};')[0] || '';
const projectKeys = new Set([...projectBlock.matchAll(/^  ([a-z]+): \{$/gm)].map((match) => match[1]));
const buttonKeys = new Set([...html.matchAll(/\bdata-project="([^"]+)"/g)].map((match) => match[1]));
for (const key of buttonKeys) {
  if (!projectKeys.has(key)) errors.push(`Case study button has no project details: ${key}`);
}
for (const key of projectKeys) {
  if (!buttonKeys.has(key)) errors.push(`Project details have no case study button: ${key}`);
}

function checkReference(reference, source) {
  if (reference.startsWith('#')) {
    const fragment = reference.slice(1);
    if (fragment.startsWith('project-')) {
      if (!projectKeys.has(fragment.slice(8))) errors.push(`Unknown project link: ${reference}`);
    } else if (!idSet.has(fragment)) errors.push(`Unknown section link: ${reference}`);
    return;
  }
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;

  let pathname;
  try {
    pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  } catch {
    errors.push(`Invalid URL encoding in ${reference}`);
    return;
  }
  if (!pathname) return;
  const file = resolve(dirname(source), pathname);
  const insideRoot = file === root || (!isAbsolute(relative(root, file)) && !relative(root, file).startsWith(`..${sep}`));
  if (!insideRoot || !existsSync(file) || !statSync(file).isFile()) {
    errors.push(`Missing local file from ${relative(root, source)}: ${reference}`);
  }
}

for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  checkReference(match[1], htmlPath);
}

for (const stylesheet of ['style.css', 'css/all.css']) {
  const cssPath = resolve(root, stylesheet);
  const css = readFileSync(cssPath, 'utf8');
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)) {
    checkReference((match[1] ?? match[2] ?? match[3]).trim(), cssPath);
  }
}

if (errors.length) {
  for (const error of new Set(errors)) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Site check passed: ${projectKeys.size} case studies and local references resolve.`);
}
