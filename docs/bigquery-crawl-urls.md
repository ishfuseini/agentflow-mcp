# BigQuery crawl list (task 2.2 source pack)

Drop the resulting `.md` files into `data/vendors/gcp/` using the suggested filenames.
Your crawler's structured frontmatter is fine — my generator force-overwrites tags on
rerun (its tags are authoritative), so exact tags in your output don't matter.

## ✅ Already landed (6 files, tagged & verified — no action)

| File | URL |
|---|---|
| `bigquery-docs-introduction.md` | https://cloud.google.com/bigquery/docs/introduction |
| `bigquery-docs-locations.md` | https://cloud.google.com/bigquery/docs/locations |
| `bigquery-docs-analytics-hub-introduction.md` | https://cloud.google.com/bigquery/docs/analytics-hub-introduction |
| `bigquery-docs-bigqueryml-intro.md` | https://cloud.google.com/bigquery/docs/bigqueryml-intro |
| `bigquery-docs-column-level-security-intro.md` | https://cloud.google.com/bigquery/docs/column-level-security-intro |
| `bigquery-docs-streaming-data-into-bigquery.md` | https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery |

## Re-crawl needed (URLs verified 200 today — old ones 404'd)

| URL | Suggested filename | Why |
|---|---|---|
| https://cloud.google.com/blog/products/data-analytics/bigquery-explained-overview | `bigquery-explained-overview.md` | BigQuery architecture overview (old `topics/developers-practitioners/...` path is dead) |
| https://cloud.google.com/blog/products/marketing-analytics-bigquery | `marketing-analytics-bigquery.md` | Marketing/audience measurement on BigQuery — media agency scenario |
| https://cloud.google.com/blog/topics/developers-practitioners/data-residency-requirements-google-cloud | `data-residency-requirements-google-cloud.md` | EU data residency constraint grounding (replaces 404'd `architecture/data-residency-and-sovereignty`) |
| https://cloud.google.com/security/compliance/data-residency | `security-compliance-data-residency.md` | GCP data residency compliance overview (same 404 replacement) |

## Dead URLs (do not crawl)

- ~~https://cloud.google.com/architecture/data-residency-and-sovereignty~~ → 404
- ~~https://cloud.google.com/blog/topics/developers-practitioners/bigquery-explained-overview~~ → moved to `products/data-analytics/` path above
- ~~https://cloud.google.com/blog/products/data-analytics/marketing-analytics-bigquery~~ → moved to `products/` path above
- ~~https://cloud.google.com/architecture/marketing-analytics~~ → 404; already covered on disk by `solutions-marketing-analytics.md`
- ~~https://cloud.google.com/bigquery/docs/storage_intro~~ → 404; storage covered by `bigquery-explained-storage` blog post if ever needed (200: https://cloud.google.com/blog/topics/developers-practitioners/bigquery-explained-storage)
