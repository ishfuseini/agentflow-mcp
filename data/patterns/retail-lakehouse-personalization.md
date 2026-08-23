---
type: pattern
title: Retail Lakehouse Personalization (Databricks + Snowflake, real-time)
source_url: openspec/changes/enterprise-arch-mcp/design.md
vendor: []
industry: [retail]
data_stack: [databricks, snowflake]
cloud: [aws, azure]
constraints: [real-time personalization]
compliance: []
region: []
data_zones: [bronze, silver, gold]
latency: [real-time]
pattern_id: retail_lakehouse_personalization
architecture_summary: Real-time retail lakehouse — Databricks streaming medallion zones build the feature store that powers sub-second personalization, with Snowflake serving governed gold data for merchandising analytics
recommended_components:
  - "Databricks Delta Live Tables"
  - "Snowflake"
  - "Kafka streaming ingestion"
  - "Feature store (gold zone)"
  - "ML recommendations service"
integration_notes:
  - "Stream clickstream, POS, and inventory events through Kafka into bronze with Delta Live Tables"
  - "Build and version personalization features in gold-zone feature tables (session recency, affinity scores)"
  - "Serve online features to the personalization API with sub-second p99 latency"
  - "Sync governed gold tables to Snowflake for merchandising and category analytics"
confidence_baseline: 0.88
diagram_data:
  components:
    - name: Clickstream & POS events
      type: source
      sublabel: web, app, store
      zone: bronze
    - name: Kafka
      type: streaming
      sublabel: event backbone
      zone: bronze
    - name: Databricks bronze
      type: lakehouse
      sublabel: Delta Live Tables
      zone: bronze
    - name: Databricks silver
      type: lakehouse
      sublabel: sessionized, cleaned
      zone: silver
    - name: Feature store
      type: feature
      sublabel: gold features, online + offline
      zone: gold
    - name: ML recommendations service
      type: ml
      sublabel: real-time scoring
      zone: gold
    - name: Snowflake
      type: warehouse
      sublabel: merchandising analytics
      zone: gold
  connections:
    - from: Clickstream & POS events
      to: Kafka
      label: event streams
      style: solid
    - from: Kafka
      to: Databricks bronze
      label: streaming ingest
      style: solid
    - from: Databricks bronze
      to: Databricks silver
      label: sessionization
      style: solid
    - from: Databricks silver
      to: Feature store
      label: feature build
      style: solid
    - from: Feature store
      to: ML recommendations service
      label: online features
      style: solid
    - from: Databricks silver
      to: Snowflake
      label: gold sync
      style: dashed
  boundaries:
    - label: Cloud region (low latency)
      type: region
---

# Retail Lakehouse Personalization

Unified retail lakehouse where the same governed data estate feeds both real-time
personalization (Databricks streaming + feature store) and batch merchandising
analytics (Snowflake) — one source of truth, two consumption patterns.

## When to use

- Retail or commerce personalization use cases (recommendations, next-best-offer)
- Real-time latency requirement on the serving path
- Databricks + Snowflake both in the stack
- Event-rich sources (clickstream, POS, inventory)

## Architecture walkthrough

**Bronze** — clickstream, POS, and inventory events stream through Kafka into Databricks
Delta Live Tables. Raw events retained for replay; schema evolution handled at ingest.

**Silver** — sessionized, deduplicated, conformed events; product catalog joined;
customer identity resolved across channels.

**Gold (feature store)** — personalization features (session recency, category affinity,
price sensitivity, propensity scores) versioned as feature tables with both offline
(training) and online (serving) representations.

**Serving** — the recommendations API pulls online features at request time and scores
in sub-seconds. Snowflake receives governed gold syncs for merchandising, category
management, and campaign measurement — analysts never touch the hot path.

## Governance & compliance

- Feature lineage from serving model back to source events (training/serving parity)
- PII minimization on the serving path — only derived features, never raw identity
- Governance controls (access, masking) applied at gold sync into Snowflake

## Source grounding

- `data/vendors/gcp/bigquery-docs-streaming-data-into-bigquery.md` — streaming ingestion patterns
- `data/vendors/gcp/genai-product-recommendations.md` — GenAI product recommendations reference
- `data/vendors/aws/solutions-retail-personalization-on-aws.md` — retail personalization reference
- `data/patterns/future-retail-a-business-and-technical-architecture.md` — retail architecture pattern
- `data/vendors/gcp/lakehouse-docs-key-concepts.md` — lakehouse concepts
