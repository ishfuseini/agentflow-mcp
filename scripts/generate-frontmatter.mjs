/**
 * Task 2.1 — Generate structured YAML frontmatter for all markdown files in data/.
 *
 * Metadata resolution order:
 *   - vendor files: og:url/og:title from existing scraper frontmatter, normalized
 *     against data/architecture-catalog.json (crawler export)
 *   - pattern/industry files: sourced from the companion repo of
 *     "Solution Architecture Patterns for Enterprise"
 *     (github.com/chanakaudaya/solution-architecture-patterns)
 *
 * Matching fields (industry, data_stack, cloud, constraints, compliance, region,
 * data_zones, latency) are derived deterministically from filename/title keywords
 * plus curated overrides for demo-critical files. Rerunnable: existing frontmatter
 * blocks are replaced, bodies are preserved byte-for-byte.
 *
 * Usage: node scripts/generate-frontmatter.mjs [--dry-run]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const DRY_RUN = process.argv.includes("--dry-run");
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DATA_DIR = join(ROOT, "data");

const BOOK_REPO = "https://github.com/chanakaudaya/solution-architecture-patterns";
const BOOK_CREDIT =
  '"Solution Architecture Patterns for Enterprise" (https://www.amazon.com/dp/1484289471)';

// ---------------------------------------------------------------------------
// Curated overrides for demo-critical files (tasks 2.3, 2.5 + compliance tags)
// ---------------------------------------------------------------------------
const OVERRIDES = {
  // Task 2.3 — SAML SSO docs
  "data/vendors/snowflake/enterprise-sso-architecture-snowflake-entraid.md": {
    data_stack: ["saml-sso", "snowflake"],
    constraints: ["SAML SSO"],
  },
  "data/vendors/snowflake/user-guide-admin-security-fed-auth-overview.md": {
    data_stack: ["saml-sso", "snowflake"],
    constraints: ["SAML SSO"],
  },
  "data/vendors/databricks/community.databricks.com-t5-technical-blog-how-sso-works-with-databricks-and-your-identity-provider-a-ba-p-41021.md":
    { data_stack: ["saml-sso", "databricks"], constraints: ["SAML SSO"] },
  // Task 2.5 — access management / tenant isolation docs
  "data/patterns/Centralized-Identity-Access-Management-Pattern.md": {
    constraints: ["cross-client governance"],
  },
  "data/patterns/Microservices-Security-Pattern-Policy-Based.md": {
    constraints: ["cross-client governance"],
  },
  "data/patterns/Microservices-Governance-And-API-Management.md": {
    constraints: ["cross-client governance"],
  },
  "data/vendors/gcp/data-isolation-tenant-architecture-google-cloud-platform-gcp.md": {
    constraints: ["cross-client governance", "tenant isolation"],
  },
  // Data residency docs cover both regions
  "data/vendors/gcp/terms-data-residency.md": {
    constraints: ["EU data residency", "US data residency"],
    region: ["EU", "US"],
  },
  // Task 2.2 — BigQuery docs (tags per docs/bigquery-crawl-urls.md; classify()
  // already infers data_stack [bigquery] + cloud [gcp] from filename/vendor dir)
  "data/vendors/gcp/bigquery-docs-introduction.md": {
    latency: ["batch"],
  },
  "data/vendors/gcp/bigquery-docs-locations.md": {
    constraints: ["EU data residency", "US data residency"],
    region: ["EU", "US"],
  },
  "data/vendors/gcp/bigquery-docs-analytics-hub-introduction.md": {
    industry: ["media_agency"],
    constraints: ["cross-client governance"],
  },
  "data/vendors/gcp/bigquery-docs-column-level-security-intro.md": {
    constraints: ["PII"],
  },
  "data/vendors/gcp/bigquery-docs-streaming-data-into-bigquery.md": {
    industry: ["retail"],
  },
  "data/vendors/aws/prescriptive-guidance-latest-strategy-aws-semicon-workloads-meeting-data-residency-requirements.html.md":
    { constraints: ["data residency"], region: ["EU", "US"] },
};

// Explicit source_url overrides for files whose og:url is missing/relative and
// whose filename slug does not cleanly match a catalog URL tail (verified by hand
// against data/architecture-catalog.json)
const URL_OVERRIDES = {
  "data/vendors/aws/comprehend-latest-dg-how-pii.html.md":
    "https://docs.aws.amazon.com/comprehend/latest/dg/how-pii.html",
  "data/vendors/aws/prescriptive-guidance-latest-strategy-aws-semicon-workloads-meeting-data-residency-requirements.html.md":
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-aws-semicon-workloads/meeting-data-residency-requirements.html",
  "data/vendors/aws/solutions-governance-on-aws.md":
    "https://docs.aws.amazon.com/solutions/governance-on-aws/",
  "data/vendors/aws/solutions-retail-and-commerce-media-monetization-on-aws.md":
    "https://docs.aws.amazon.com/solutions/retail-and-commerce-media-monetization-on-aws/",
  "data/vendors/aws/solutions-retail-personalization-on-aws.md":
    "https://docs.aws.amazon.com/solutions/retail-personalization-on-aws/",
  "data/vendors/aws/wellarchitected-latest-financial-services-industry-lens-financial-services-industry-lens.html.md":
    "https://docs.aws.amazon.com/wellarchitected/latest/financial-services-industry-lens/financial-services-industry-lens.html",
  "data/vendors/aws/wellarchitected-latest-healthcare-industry-lens-healthcare-analytics-reference-architecture.html.md":
    "https://docs.aws.amazon.com/wellarchitected/latest/healthcare-industry-lens/healthcare-analytics-reference-architecture.html",
  "data/vendors/snowflake/snowflake-cortex-redact-pii.md":
    "https://docs.snowflake.com/en/user-guide/snowflake-cortex/redact-pii",
  "data/vendors/snowflake/user-guide-admin-security-fed-auth-overview.md":
    "https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview",
};

// Industry codes for the industry-specific book-repo files
const INDUSTRY_DIR_MAP = {
  "Automotive-Industry-Information-Technology-Reference-Architecture.md": "automotive",
  "Digital-Health-Platform-Open-Source-Architecture.md": "healthcare",
  "Effective-ground-transportation-architecture-pattern.md": "transportation",
  "Energy-Information-Technology-Reference-Architecture.md": "energy",
  "Higher-Education-Information-Technology-Architecture.md": "higher_education",
  "Hospitality-Platform-Reference-Architecture-WSO2.md": "hospitality",
  "Telecommunication-reference-architecture-pattern.md": "telecom",
  "future-retail-a-business-and-technical-architecture.md": "retail",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const cleanTitle = (raw) =>
  (raw || "")
    .replace(/&nbsp;/g, " ")
    .split("|")[0]
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const prettify = (filename) =>
  filename
    .replace(/\.html?\.md$|\.md$/, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Normalize a URL for catalog joining: strip snowflake CDN prefix, trailing slash
const normalizeUrl = (u) =>
  (u || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .replace(/^www\.snowflake\.com\/content\/snowflake-site\/global/, "www.snowflake.com");

const lastSegment = (u) => {
  const m = (u || "").match(/\/([^/]+)\/?$/);
  return m ? m[1].replace(/\.html?$/, "") : null;
};

const slugifyFile = (f) =>
  basename(f)
    .replace(/\.html?\.md$|\.md$/, "")
    .toLowerCase();

const uniq = (arr) => [...new Set(arr.filter(Boolean))];

const has = (haystack, ...needles) => needles.some((n) => haystack.includes(n.toLowerCase()));

// ---------------------------------------------------------------------------
// Load crawler catalog and build lookup indexes
// ---------------------------------------------------------------------------
const catalog = JSON.parse(readFileSync(join(DATA_DIR, "architecture-catalog.json"), "utf8"));
const catalogByNormUrl = new Map();
const catalogByTail = new Map(); // last URL segment -> entry (for slug containment joins)
for (const entry of catalog) {
  if (!entry.source_url) continue;
  const n = normalizeUrl(entry.source_url);
  catalogByNormUrl.set(n, entry);
  const tail = lastSegment(n);
  if (tail && !catalogByTail.has(tail)) catalogByTail.set(tail, entry);
}

// ---------------------------------------------------------------------------
// Classification rules (keyword-based, deterministic)
// ---------------------------------------------------------------------------
function classify(relPath, title) {
  const text = `${relPath} ${title}`.toLowerCase();
  const out = {
    industry: [],
    data_stack: [],
    cloud: [],
    constraints: [],
    compliance: [],
    region: [],
    data_zones: [],
    latency: [],
  };

  // vendor dir context
  const dir = relPath.split("/")[1];
  if (dir === "vendors") {
    const vendor = relPath.split("/")[2];
    if (vendor === "snowflake") out.data_stack.push("snowflake");
    if (vendor === "databricks") out.data_stack.push("databricks");
    // clouds, not platforms — infer actual cloud for platform vendors from filename hints
    if (["aws", "azure", "gcp"].includes(vendor)) {
      out.cloud.push(vendor);
    } else if (has(text, "aws-en", "on-aws")) {
      out.cloud.push("aws");
    } else if (has(text, "gcp-en", "google-cloud")) {
      out.cloud.push("gcp");
    } else if (has(text, "entraid", "azure-ad")) {
      out.cloud.push("azure");
    }
    if (has(text, "bigquery")) out.data_stack.push("bigquery");
    // cross-vendor stack hints (e.g., azure docs about databricks)
    if (vendor !== "snowflake" && has(text, "snowflake")) out.data_stack.push("snowflake");
    if (vendor !== "databricks" && has(text, "databricks")) out.data_stack.push("databricks");
  }

  // industry
  const healthcareMatched = has(
    text,
    "healthcare",
    "patient",
    "clinical",
    "medical",
    "life-sciences",
    "hipaa",
    "health data",
    "digital-health",
  );
  if (healthcareMatched) {
    out.industry.push("healthcare");
  } else if (
    has(text, "retail", "commerce", "personalization", "product-recommendations", "monetization")
  ) {
    // "personalization"/"recommendations" only imply retail outside healthcare contexts
    out.industry.push("retail");
  }
  if (has(text, "financial", "banking", "fsi", "insurance"))
    out.industry.push("financial_services");
  if (
    has(
      text,
      "marketing",
      "audience",
      "advertising",
      "media",
      "agentic-audience",
      "customer-journey",
    )
  )
    out.industry.push("media_agency");
  if (has(text, "automotive")) out.industry.push("automotive");
  if (has(text, "telecom")) out.industry.push("telecom");
  if (has(text, "energy")) out.industry.push("energy");
  if (has(text, "education")) out.industry.push("higher_education");
  if (has(text, "hospitality")) out.industry.push("hospitality");
  if (has(text, "transportation")) out.industry.push("transportation");

  // constraints / compliance / region
  if (has(text, "hipaa")) {
    out.constraints.push("HIPAA");
    out.compliance.push("hipaa");
  }
  if (has(text, "pii")) out.constraints.push("PII");
  if (has(text, "phi")) out.constraints.push("PHI");
  if (has(text, "sso", "fed-auth", "entraid", "federated")) out.constraints.push("SAML SSO");
  if (has(text, "tenant", "multitenant", "data-isolation"))
    out.constraints.push("tenant isolation");
  if (has(text, "residency")) {
    if (!has(text, "data-residency")) out.constraints.push("data residency");
    if (has(text, "eu")) out.constraints.push("EU data residency");
    if (has(text, "us") && !has(text, "industry-lens")) out.constraints.push("US data residency");
  }
  if (has(text, "audit")) out.constraints.push("audit logs");
  if (has(text, "us") && (out.compliance.includes("hipaa") || has(text, "healthcare")))
    out.region.push("US");
  if (has(text, "eu") && has(text, "residency")) out.region.push("EU");

  // data stack extras (pattern files)
  if (has(text, "kafka")) out.data_stack.push("kafka");
  if (has(text, "kubernetes")) out.data_stack.push("kubernetes");
  if (has(text, "istio")) out.data_stack.push("istio");
  if (has(text, "nats")) out.data_stack.push("nats");
  if (has(text, "graphql")) out.data_stack.push("graphql");
  if (has(text, "unity-catalog")) out.data_stack.push("unity-catalog");

  // cloud extras
  if (has(text, "multi-cloud")) out.cloud.push("aws", "azure", "gcp");

  // data zones
  if (has(text, "lakehouse", "medallion")) out.data_zones.push("bronze", "silver", "gold");

  // latency
  if (has(text, "event-driven", "kafka", "nats", "streaming", "change-data-capture", "real-time"))
    out.latency.push("real-time");
  else if (has(text, "analytics", "lakehouse", "reporting", "measurement", "batch"))
    out.latency.push("batch");

  return out;
}

// ---------------------------------------------------------------------------
// Metadata resolution per file
// ---------------------------------------------------------------------------
function resolve(relPath, body) {
  const fmMatch = body.match(/^---\n([\s\S]*?)\n---\n?/);
  const rawFm = fmMatch ? fmMatch[1] : "";
  let restBody = fmMatch ? body.slice(fmMatch[0].length) : body;
  // The crawler can emit a structured block followed by a raw scraper meta-*
  // block; strip consecutive leading blocks that are majority meta-* lines so
  // they don't leak into the body.
  for (;;) {
    const m = restBody.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) break;
    const lines = m[1].split("\n").filter((l) => l.trim());
    const metaLines = lines.filter((l) => /^meta-/.test(l));
    if (lines.length === 0 || metaLines.length / lines.length < 0.5) break;
    restBody = restBody.slice(m[0].length);
  }

  const ogField = (key) => {
    const escKey = key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const m = rawFm.match(new RegExp(`^${escKey}:\\s*(.+)$`, "m"));
    if (!m) return null;
    let v = m[1].trim();
    // strip up to two quote layers: normal YAML quoting, plus corruption from earlier
    // reruns that re-escaped already-quoted values
    for (let i = 0; i < 2; i++) {
      if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) {
        v = v.slice(1, -1).replace(/''/g, "'");
      }
    }
    return v || null;
  };

  const dir = relPath.split("/")[1];
  const type = dir === "industry" ? "industry" : dir === "vendors" ? "vendor" : "pattern";
  const isBookRepo = dir === "industry" || dir === "patterns";

  // title
  let title = cleanTitle(ogField("meta-og:title") || ogField("title"));

  // source_url (prefer any already-written structured source_url so the script is idempotent)
  let sourceUrl = ogField("source_url") || ogField("meta-og:url");
  if (sourceUrl?.startsWith("/")) {
    // relative og:url — prefix host by vendor dir
    const hosts = {
      gcp: "https://cloud.google.com",
      aws: "https://docs.aws.amazon.com",
      azure: "https://learn.microsoft.com",
      snowflake: "https://www.snowflake.com",
      databricks: "https://docs.databricks.com",
    };
    const vendor = relPath.split("/")[2];
    sourceUrl = (hosts[vendor] || "") + sourceUrl;
  }
  // prefer catalog URL when it matches (cleaner canonical form)
  let catalogEntry = null;
  if (sourceUrl) catalogEntry = catalogByNormUrl.get(normalizeUrl(sourceUrl));
  if (!catalogEntry && sourceUrl) {
    // tail-segment join on the URL's last segment vs the file slug
    const tail = lastSegment(sourceUrl);
    const cand = tail ? catalogByTail.get(tail) : null;
    if (cand && slugifyFile(relPath).endsWith(tail)) catalogEntry = cand;
  }
  if (!catalogEntry) {
    // last resort: match file slug against URL tails (e.g. "hipaa-compliance.md" -> "hipaa-compliance")
    const cand = catalogByTail.get(slugifyFile(relPath));
    if (cand) catalogEntry = cand;
  }
  if (catalogEntry?.source_url) sourceUrl = catalogEntry.source_url;
  if (URL_OVERRIDES[relPath]) sourceUrl = URL_OVERRIDES[relPath];

  if (isBookRepo) {
    const ghDir = dir === "industry" ? "industry-specific" : "vendor-neutral";
    sourceUrl = `${BOOK_REPO}/blob/master/${ghDir}/${basename(relPath)}`;
  }

  // fallback title
  if (!title) {
    const heading = restBody.match(/^#\s+(.+)$/m) || restBody.match(/^##\s+(.+)$/m);
    title = heading ? heading[1].trim() : prettify(basename(relPath));
  }
  if (isBookRepo) {
    // book-repo bodies open with generic headings ("Introduction", "Table of Contents") —
    // the filename is the reliable title
    title = prettify(basename(relPath));
  }

  // vendor
  let vendor = [];
  if (dir === "vendors") vendor = [relPath.split("/")[2]];
  else if (has(relPath.toLowerCase(), "wso2", "ballerina")) vendor = ["wso2"];

  // classify + merge overrides
  const classified = classify(relPath, title);
  const override = OVERRIDES[relPath] || {};
  const fm = {
    type,
    title,
    source_url: sourceUrl || "",
    vendor: vendor.length ? vendor : [],
    industry: uniq([...classified.industry, ...(override.industry || [])]),
    data_stack: uniq([...classified.data_stack, ...(override.data_stack || [])]),
    cloud: uniq(classified.cloud),
    constraints: uniq([...classified.constraints, ...(override.constraints || [])]),
    compliance: uniq([...classified.compliance, ...(override.compliance || [])]),
    region: uniq([...classified.region, ...(override.region || [])]),
    data_zones: uniq([...classified.data_zones, ...(override.data_zones || [])]),
    latency: uniq([...classified.latency, ...(override.latency || [])]),
  };

  if (dir === "industry" && INDUSTRY_DIR_MAP[basename(relPath)]) {
    fm.industry = [INDUSTRY_DIR_MAP[basename(relPath)]];
  }

  const extras = {};
  if (isBookRepo) extras.credit = BOOK_CREDIT;
  if (catalogEntry?.scraped_at) extras.scraped_at = catalogEntry.scraped_at.slice(0, 10);

  return { fm: { ...fm, ...extras }, restBody };
}

// ---------------------------------------------------------------------------
// YAML emission (single-quoted scalars, flow-style arrays)
// ---------------------------------------------------------------------------
const scalar = (s) => `'${String(s).replace(/'/g, "''")}'`;
const emitField = (key, value) => {
  if (Array.isArray(value)) return `${key}: [${value.map(scalar).join(", ")}]`;
  if (value === null || value === undefined) return `${key}: []`;
  return `${key}: ${scalar(value)}`;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
// Hand-authored scenario pattern definitions (task 2.4) — different frontmatter
// schema (pattern_id, diagram_data, ...) that this generator must never touch.
const PATTERN_DEF_FILES = new Set([
  "data/patterns/media-agency-audience-measurement.md",
  "data/patterns/healthcare-patient-insights.md",
  "data/patterns/retail-lakehouse-personalization.md",
  "data/patterns/fsi-governance-copilot.md",
]);

const files = walk(DATA_DIR).filter(
  (f) => f.endsWith(".md") && !PATTERN_DEF_FILES.has(relative(ROOT, f)),
);
let updated = 0;
const problems = [];

for (const file of files) {
  const relPath = relative(ROOT, file);
  const body = readFileSync(file, "utf8");
  const { fm, restBody } = resolve(relPath, body);

  const lines = ["---"];
  for (const [key, value] of Object.entries(fm)) lines.push(emitField(key, value));
  lines.push("---", "");

  if (!fm.title || !fm.source_url) {
    problems.push(`${relPath}: title=${fm.title} url=${fm.source_url}`);
  }

  if (!DRY_RUN) {
    writeFileSync(file, `${lines.join("\n")}\n${restBody.replace(/^\n+/, "")}`);
  }
  updated++;
}

console.log(
  `${DRY_RUN ? "[dry-run] " : ""}Processed ${updated}/${files.length} files` +
    ` (skipped ${PATTERN_DEF_FILES.size} pattern definitions)`,
);
if (problems.length) {
  console.log("\nFiles with missing title or source_url:");
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log("All files have title + source_url.");
}
