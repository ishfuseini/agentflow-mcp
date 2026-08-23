---
type: 'vendor'
title: 'Key concepts'
source_url: 'https://docs.cloud.google.com/lakehouse/docs/key-concepts'
vendor: ['gcp']
industry: []
data_stack: []
cloud: ['gcp']
constraints: []
compliance: []
region: []
data_zones: ['bronze', 'silver', 'gold']
latency: ['batch']
scraped_at: '2026-08-23'
---

[Skip to main content](#main-content)

[/](/)

[Console](//console.cloud.google.com/)

- English
- Deutsch
- Español – América Latina
- Français
- Indonesia
- Italiano
- Português – Brasil
- עברית
- 中文 – 简体
- 中文 – 繁體
- 日本語
- 한국어Sign in

[https://docs.cloud.google.com/lakehouse/docs](https://docs.cloud.google.com/lakehouse/docs)

- [Lakehouse](https://docs.cloud.google.com/lakehouse/docs)

[Start free](//console.cloud.google.com/freetrial)

 As of April 20th, 2026, BigLake is now called Lakehouse for Apache Iceberg. BigLake metastore is now called the Lakehouse runtime catalog. Lakehouse APIs, client libraries, CLI commands, and IAM names remain unchanged and still reference BigLake.

- [Home](https://docs.cloud.google.com/)
- [Documentation](https://docs.cloud.google.com/docs)

- [Data analytics](https://docs.cloud.google.com/docs/data)

- [Lakehouse](https://docs.cloud.google.com/lakehouse/docs)

- [Guides](https://docs.cloud.google.com/lakehouse/docs/introduction)

Send feedback

# Key concepts

This document defines the key terms and concepts for *Lakehouse
for Apache Iceberg*.

This page is not an exhaustive list of features, but instead a general reference
of terms and concepts used throughout Google Cloud's *Lakehouse* documentation.

## Core Concepts

The following concepts form the foundation of Google Cloud's
Lakehouse architecture.

### Data Lakehouse

A data lakehouse brings together the cost savings and flexibility of a data lake
with the data management and performance of a data warehouse. It lets you store
data in open formats on Cloud Storage and use BigQuery features, such as
precise security controls and fast queries.

### Medallion architecture

A common design pattern in a data lakehouse is the medallion architecture, which logically organizes data into progressive layers of structure and quality:

- **Bronze (raw) layer:** Ingests and stores raw data in open formats such as Apache Iceberg on Cloud Storage.
- **Silver (cleansed) layer:** Cleanses, filters, and enriches the raw data into standardized tables.
- **Gold (curated) layer:** Delivers fully curated, aggregated business-level tables. In Google Cloud's Lakehouse, BigQuery is often used to serve the gold layer for high-performance consumption, reporting, and analytics.

### Open Interoperability

Open interoperability is the ability for multiple analytical and transactional
systems—such as BigQuery, Apache Spark, and Apache Flink—to
operate on a single copy of data in open formats such as Apache Iceberg. This
eliminates the need for data duplication and ensures a consistent view of data
across disparate tools.

### Lakehouse runtime catalog

*The Lakehouse runtime catalog* is a centralized, serverless metadata
service that acts as the single source of truth for Google Cloud's
Lakehouse. It lets multiple engines, such as Apache Spark, Apache
Flink, and BigQuery, discover and query the same tables
simultaneously.

## Catalog Types

The Lakehouse runtime catalog offers different types of catalogs
for managing your metadata.

### Apache Iceberg REST catalog endpoint

This is a catalog based on the Apache Iceberg REST catalog endpoint. It provides
interoperability between open source engines and BigQuery, and
supports features such as credential vending and disaster recovery.

#### Catalog storage configurations

When creating an Apache Iceberg REST catalog endpoint, you can choose between
two storage models:

- **Multiple-bucket catalog (recommended):** Lets you name your catalog
independently and configure up to 15 Cloud Storage buckets
(`default_location` and `restricted_locations`). When configuring client query
engines (such as Spark or Trino), set the warehouse
path to
`bl://projects/*PROJECT_ID*/catalogs/*CATALOG_ID*`.
- **Single-bucket catalog:** A legacy configuration where the catalog is
locked to a single Cloud Storage bucket and inherits the bucket's name.
When configuring client query engines, set the warehouse path to
`gs://*CLOUD_STORAGE_BUCKET_NAME*`.

### Custom Apache Iceberg catalog for BigQuery

This is an integration that uses the BigQuery catalog directly as
the backing metadata service for managed Apache Iceberg tables.

### Apache Hive catalog endpoint

This endpoint provides compatibility for open source workloads that depend on the
Apache Hive metastore (HMS) interface, letting you run Apache Hive or
Spark workloads against a fully managed metastore service on
Google Cloud.

## Table types

Google Cloud's Lakehouse supports several table formats,
depending on the engine used to manage the data and the catalog endpoint you
are using.

### Apache Iceberg tables

These are Apache Iceberg tables that you create from open source engines and
store in Cloud Storage. The *Lakehouse runtime catalog* manages these tables through the Apache Iceberg REST catalog endpoint. Open source
engines have read and write access to these tables, while BigQuery
has read-only access. This option is best if you want your ETL workflow to be
managed by open source engines.

### BigQuery tables

These tables are managed with BigQuery.

#### Apache Iceberg tables

These are Apache Iceberg tables that you create from BigQuery and
store in Cloud Storage. BigQuery handles all data layout and
optimization. While these tables can be read by multiple engines,
BigQuery is the only engine that can directly write to them.

#### Native tables

These tables are managed by BigQuery and store data in
BigQuery storage. You can connect these tables to the
Lakehouse runtime catalog.

#### External tables

External tables reside outside of the Lakehouse runtime catalog.
The data and metadata are self-managed in a third-party catalog (such as
Cloud Storage, S3, or Azure Blob Storage). BigQuery can only
read from these tables.

## Table Features

### Table evolution

Google Cloud's Lakehouse supports Apache Iceberg table evolution,
which lets you change a table's schema or partition spec over time without
rewriting the table data or recreating the table.

### Time travel

Time travel lets you query a table's data as it existed at a specific point in
time or snapshot ID. This is useful for auditing, reproducing experiments, or
restoring data after an accidental deletion.

### Metadata caching

Metadata caching is a feature that accelerates query performance for external
tables. It stores a copy of the table's metadata in BigQuery
storage, reducing the need to read metadata files from Cloud Storage during
query execution.

### Google Cloud's Lakehouse table management

Google Cloud's Lakehouse table management simplifies lakehouse
maintenance by automating tasks such as compaction and garbage collection for
managed tables. This ensures optimal query performance and storage efficiency.

## Interoperability Concepts

### Borderless Lakehouse

Borderless Lakehouse extends Google Cloud's
Lakehouse, letting you connect to remote external catalogs (such
as Databricks Unity Catalog, AWS Glue, Snowflake Polaris Catalog, or SAP BDC).
It synchronizes metadata from other cloud providers, letting you query data
with BigQuery or external open source engines through the Apache
Iceberg REST catalog endpoint, without migrating the data.

### Public datasets

Google Cloud's Lakehouse hosts high-quality public datasets
served through the Apache Iceberg REST catalog, providing read-only access for
exploration and testing without managing infrastructure.

### P.C.N.T. naming structure

The P.C.N.T. naming structure is the four-part convention used to uniquely
identify and query tables in the Lakehouse runtime catalog from
BigQuery. It stands for **Project.Catalog.Namespace.Table**:

- **Project**: The Google Cloud project ID.
- **Catalog**: The name of the Lakehouse runtime catalog.
- **Namespace**: The logical grouping for tables (similar to a dataset).
- **Table**: The name of the data table.

## Security Concepts

### Connections

A connection is a BigQuery resource that stores credentials for
accessing external data. In Google Cloud's Lakehouse, connections
delegate access to Cloud Storage by letting the connection's service
account access the storage bucket on your behalf.

### Credential Vending

Credential vending is a security mechanism that helps tighten access control
when using the Lakehouse runtime catalog. When enabled, the
service generates short-lived, scoped-down credentials designed to grant access
only to the specific file paths required for a query.

### Unified governance

Unified governance lets you define and enforce security and data management
policies centrally through integration with [Knowledge Catalog](/dataplex/docs/introduction). When you register tables into the Lakehouse runtime catalog, the system automatically registers corresponding entries into the business metadata catalog (Knowledge Catalog), enabling data lineage, semantic search, and central governance across engines without moving or copying files.

## Query Engine Concepts

Google Cloud's Lakehouse decouples storage from compute, allowing various analytics engines to interact with open tables.

### Managed Service for Apache Spark

Managed Service for Apache Spark (formerly Managed Service for Apache Spark) provides a fully managed runtime for processing open table formats like Apache Iceberg. It supports two primary modes of execution:

- **Serverless batches:** Designed for automated, non-interactive data processing pipelines and ETL workloads. This pay-per-execution model eliminates cluster management, removes resource contention between jobs, and automates infrastructure maintenance.
- **Serverless interactive sessions:** Designed for exploratory data analysis, data engineering, and data science experimentation. Interactive sessions power Apache Spark notebooks under the hood using Spark Connect or remote Spark kernels, providing an auto-scaling environment with no infrastructure setup.

### Service tiers

When executing Apache Spark workloads against the Lakehouse runtime catalog, you can select between different service tiers:

- **Standard tier:** The default execution tier suitable for standard batch processing workloads.
- **Premium tier:** Provides advanced capabilities, including support for serverless interactive notebook sessions and performance-accelerating features such as the Lightning Engine.

### Session templates

Session templates simplify the configuration of serverless interactive sessions. They allow administrators to define and persist common environment settings (such as catalog properties, network configurations, and runtime versions). This promotes consistency and improves developer productivity by minimizing repeated setup. Session templates can be created and managed using the Google Cloud console, `gcloud` CLI, REST API, or Terraform.

## Reliability Concepts

### Cross-region replication

Cross-region replication replicates metadata across multiple regions to ensure
catalog availability during regional outages.

### Failover

Failover is the process of switching between primary and secondary regions
during a regional outage to maintain catalog operations.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-08-20 UTC.
