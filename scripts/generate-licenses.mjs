#!/usr/bin/env node
// Generates src/generated/licenses.json from the actual installed
// dependency tree (production dependencies only — devDependencies like
// typescript/vite never ship in the built app). Run automatically via
// npm's predev/prebuild hooks (see package.json) — never hand-edit the
// output, it's fully derived from node_modules + package.json.
//
// Covers the npm/JS dependency graph only. Rust/Cargo crates in
// src-tauri are a separate toolchain (cargo-about / cargo-license) and
// are NOT covered here — tracked as a separate follow-up.

import { runLicenseCheck } from '@lizenz/checker';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'src/generated/licenses.json');

const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf-8'));

function normalizeRepoUrl(url) {
  if (!url) return null;
  // license-checker-family tools often report git+ssh://, git+https://,
  // or bare git:// URLs — normalize to a plain https URL an "open in
  // browser" action can actually use.
  return url.replace(/^git\+/, '').replace(/^git:\/\//, 'https://').replace(/\.git$/, '');
}

try {
  const modules = await runLicenseCheck({
    start: ROOT,
    production: true,
    excludePrivatePackages: true,
  });

  const entries = Object.entries(modules)
    .map(([key, info]) => {
      const lastAt = key.lastIndexOf('@');
      return { name: key.slice(0, lastAt), version: key.slice(lastAt + 1), info };
    })
    // Exclude this app's own package itself from its own dependency list.
    .filter((entry) => entry.name !== pkg.name)
    .map(({ name, version, info }) => ({
      name,
      version,
      license: info.licenses ?? 'Unknown',
      repository: normalizeRepoUrl(info.repository ?? null),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(entries, null, 2) + '\n');
  console.log(`Generated license manifest: ${entries.length} packages -> ${path.relative(ROOT, OUTPUT_PATH)}`);
} catch (err) {
  console.error('Failed to generate license manifest:', err);
  process.exit(1);
}
