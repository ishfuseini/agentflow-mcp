/**
 * Source-pack validation script (task 9.3, P1).
 *
 * Walks every markdown file under data/, checks that each has valid YAML
 * frontmatter with the required fields for its type. Reports any missing or
 * malformed entries. Exits non-zero if any file fails.
 *
 * Usage: node --import tsx scripts/validate-source-pack.ts
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";
import { walk } from "../src/data/loader.js";

const ROOT = resolve(import.meta.dirname, "..");
const DATA_DIR = join(ROOT, "data");

const REQUIRED_BY_TYPE: Record<string, string[]> = {
  pattern: ["type", "title"],
  industry: ["type", "title"],
  vendor: ["type", "title"],
};

// Files that declare a pattern_id must also carry the full demo-pattern definition.
const PATTERN_DEF_FIELDS = ["pattern_id", "architecture_summary", "recommended_components"];

const mdFiles = walk(DATA_DIR).filter((f) => f.endsWith(".md"));
let errors = 0;
let checked = 0;

for (const file of mdFiles) {
  checked++;
  const rel = file.replace(`${DATA_DIR}/`, "");
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) {
    console.log(`FAIL  ${rel} — no YAML frontmatter`);
    errors++;
    continue;
  }
  let fm: Record<string, unknown>;
  try {
    fm = (parse(m[1] ?? "") ?? {}) as Record<string, unknown>;
  } catch (err) {
    console.log(`FAIL  ${rel} — invalid YAML: ${err instanceof Error ? err.message : err}`);
    errors++;
    continue;
  }

  const type = typeof fm.type === "string" ? fm.type : "vendor";
  const required = REQUIRED_BY_TYPE[type] ?? ["type", "title"];
  for (const field of required) {
    if (fm[field] === undefined || fm[field] === null) {
      console.log(`FAIL  ${rel} — missing required field "${field}"`);
      errors++;
    }
  }

  // Curated demo patterns (those with a pattern_id) must carry the full definition.
  if (typeof fm.pattern_id === "string") {
    for (const field of PATTERN_DEF_FIELDS) {
      if (fm[field] === undefined || fm[field] === null) {
        console.log(`FAIL  ${rel} — pattern definition missing "${field}"`);
        errors++;
      }
    }
  }
}

console.log(`\n${checked} files checked, ${errors} errors`);
process.exit(errors ? 1 : 0);
