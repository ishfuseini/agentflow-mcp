/**
 * Shared types for the source pack (markdown files under data/ with YAML frontmatter).
 */

export type EntryType = "vendor" | "industry" | "pattern";

/** Normalized frontmatter for every markdown file in data/. */
export interface SourceFrontmatter {
  type: EntryType;
  title: string;
  source_url: string;
  vendor: string[];
  industry: string[];
  data_stack: string[];
  cloud: string[];
  constraints: string[];
  compliance: string[];
  region: string[];
  data_zones: string[];
  latency: string[];
}

/** Diagram-ready structure on scenario pattern definitions (design.md #9). */
export interface DiagramComponent {
  name: string;
  type: string;
  sublabel: string;
  zone: string;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label: string;
  style: string;
}

export interface DiagramBoundary {
  label: string;
  type: string;
}

export interface DiagramData {
  components: DiagramComponent[];
  connections: DiagramConnection[];
  boundaries: DiagramBoundary[];
}

/** Pattern-definition-only fields (the 4 scenario files authored in task 2.4). */
export interface PatternDefinition {
  pattern_id: string;
  architecture_summary: string;
  recommended_components: string[];
  integration_notes: string[];
  confidence_baseline: number;
  diagram_data?: DiagramData;
}

/** One markdown file from the source pack, frontmatter parsed. */
export interface SourceEntry {
  /** Path relative to repo root, e.g. data/vendors/gcp/bigquery-docs-locations.md */
  relPath: string;
  fm: SourceFrontmatter;
  pattern?: PatternDefinition;
  /** Narrative body below the frontmatter (grounding/citation content). */
  body: string;
}

/** In-memory index over the source pack, keyed for tool lookups (task 2.6). */
export interface SourceIndex {
  entries: SourceEntry[];
  /** lowercased industry code -> entries */
  byIndustry: Map<string, SourceEntry[]>;
  /** lowercased data-stack slug -> entries */
  byDataStack: Map<string, SourceEntry[]>;
  /** lowercased constraint -> entries */
  byConstraints: Map<string, SourceEntry[]>;
  /** lowercased compliance framework -> entries */
  byCompliance: Map<string, SourceEntry[]>;
  /** pattern_id (as written) -> entry, for the 4 scenario definitions */
  byPatternId: Map<string, SourceEntry>;
  byType: Record<EntryType, SourceEntry[]>;
}
