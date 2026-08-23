/**
 * Source pack loader (task 2.6).
 *
 * Reads every markdown file under data/ at startup, parses YAML frontmatter,
 * and builds an in-memory index keyed by industry, data_stack, constraints,
 * compliance, and pattern_id. Tool modules query this index; nothing hits the
 * filesystem after load.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parse } from "yaml";
import type {
  EntryType,
  PatternDefinition,
  SourceEntry,
  SourceFrontmatter,
  SourceIndex,
} from "../types/source.js";

const ROOT = resolve(import.meta.dirname, "../..");
const DATA_DIR = join(ROOT, "data");

/** Normalize a tag for matching: "BigQuery" / " bigquery " -> "bigquery". */
export const norm = (s: string): string => s.trim().toLowerCase();

/** Overlap ratio: fraction of input items found in tags (both normalized). */
export const overlapRatio = (input: string[], tags: string[]): number => {
  if (input.length === 0) return 0;
  const tagSet = new Set(tags.map(norm));
  return input.filter((v) => tagSet.has(norm(v))).length / input.length;
};

export function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function parseFrontmatter(raw: string): {
  fm: Partial<SourceFrontmatter> & Partial<PatternDefinition>;
  body: string;
} {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: raw };
  let parsed: Record<string, unknown> = {};
  try {
    parsed = (parse(m[1] ?? "") ?? {}) as Record<string, unknown>;
  } catch {
    // Malformed YAML — treat as no frontmatter, keep body.
  }
  return { fm: parsed, body: raw.slice(m[0].length) };
}

function toEntry(relPath: string, raw: string): SourceEntry {
  const { fm, body } = parseFrontmatter(raw);
  const type: EntryType =
    fm.type === "pattern" ? "pattern" : fm.type === "industry" ? "industry" : "vendor";

  const entry: SourceEntry = {
    relPath,
    body: body.trim(),
    fm: {
      type,
      title: typeof fm.title === "string" ? fm.title : relPath,
      source_url: typeof fm.source_url === "string" ? fm.source_url : "",
      vendor: asStringArray(fm.vendor),
      industry: asStringArray(fm.industry),
      data_stack: asStringArray(fm.data_stack),
      cloud: asStringArray(fm.cloud),
      constraints: asStringArray(fm.constraints),
      compliance: asStringArray(fm.compliance),
      region: asStringArray(fm.region),
      data_zones: asStringArray(fm.data_zones),
      latency: asStringArray(fm.latency),
    },
  };

  if (typeof fm.pattern_id === "string") {
    entry.pattern = {
      pattern_id: fm.pattern_id,
      architecture_summary:
        typeof fm.architecture_summary === "string" ? fm.architecture_summary : "",
      recommended_components: asStringArray(fm.recommended_components),
      integration_notes: asStringArray(fm.integration_notes),
      confidence_baseline: typeof fm.confidence_baseline === "number" ? fm.confidence_baseline : 0,
      diagram_data: (fm.diagram_data as PatternDefinition["diagram_data"]) ?? undefined,
    };
  }

  return entry;
}

function addTo(map: Map<string, SourceEntry[]>, key: string, entry: SourceEntry): void {
  const k = norm(key);
  const list = map.get(k);
  if (list) list.push(entry);
  else map.set(k, [entry]);
}

let cached: SourceIndex | undefined;

/** Load and index the source pack. Results are cached; call once at startup. */
export function loadSourcePack(): SourceIndex {
  if (cached) return cached;

  const entries = walk(DATA_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => toEntry(relative(ROOT, f), readFileSync(f, "utf8")));

  const index: SourceIndex = {
    entries,
    byIndustry: new Map(),
    byDataStack: new Map(),
    byConstraints: new Map(),
    byCompliance: new Map(),
    byPatternId: new Map(),
    byType: { vendor: [], industry: [], pattern: [] },
  };

  for (const entry of entries) {
    index.byType[entry.fm.type].push(entry);
    for (const t of entry.fm.industry) addTo(index.byIndustry, t, entry);
    for (const t of entry.fm.data_stack) addTo(index.byDataStack, t, entry);
    for (const t of entry.fm.constraints) addTo(index.byConstraints, t, entry);
    for (const t of entry.fm.compliance) addTo(index.byCompliance, t, entry);
    if (entry.pattern) index.byPatternId.set(entry.pattern.pattern_id, entry);
  }

  cached = index;
  return index;
}

/** Test helper: drop the cached index so the next load re-reads disk. */
export function resetSourcePackCache(): void {
  cached = undefined;
}
