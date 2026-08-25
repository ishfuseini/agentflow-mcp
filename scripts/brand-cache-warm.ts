/**
 * Pre-populate the local brand cache for demo domains (task 6.6).
 *
 * Usage: node --import tsx scripts/brand-cache-warm.ts [domain ...]
 * Defaults to the four demo-scenario domains. Fresh cache entries are skipped,
 * so re-running is cheap and only new/expired domains hit the APIs.
 */
try {
  process.loadEnvFile();
} catch {}

const { lookupBrandContext } = await import("../src/tools/brandContextLookup.js");

const domains = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["havas.com", "unitedhealthgroup.com", "walmart.com", "jpmorgan.com"];

let ok = 0;
for (const domain of domains) {
  try {
    const out = await lookupBrandContext({ domain });
    if (out.available) {
      ok++;
      console.log(
        `OK    ${domain} — name="${out.company_name}" hint=${out.industry_hint} conf=${out.confidence} cached=${out.cached}`,
      );
    } else {
      console.log(`MISS  ${domain} — ${out.message}`);
    }
  } catch (err) {
    console.log(`ERROR ${domain} — ${err instanceof Error ? err.message : err}`);
  }
}

console.log(`\n${ok}/${domains.length} domains cached and available`);
process.exit(ok === domains.length ? 0 : 1);
