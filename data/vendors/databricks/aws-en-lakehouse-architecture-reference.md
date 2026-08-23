---
type: 'vendor'
title: 'Databricks reference architectures (download)'
source_url: 'https://docs.databricks.com/aws/en/lakehouse-architecture/reference'
vendor: ['databricks']
industry: []
data_stack: ['databricks']
cloud: ['aws']
constraints: []
compliance: []
region: []
data_zones: ['bronze', 'silver', 'gold']
latency: ['batch']
scraped_at: '2026-08-23'
---

[Skip to main content](#__docusaurus_skipToContent_fallback)

On this page

Last updated on **Aug 3, 2026**

# Databricks reference architectures (download)

Databricks reference architectures provide architectural guidance covering data sources, ingestion, transformation, querying and processing, serving, analysis, and storage.

Each reference architecture has a downloadable PDF in 11 x 17 (A3) format.

While Databricks is an open platform that integrates with a [large ecosystem of partner tools](/aws/en/integrations/), the reference architectures focus only on AWS services and the Databricks platform. The cloud provider services shown are selected to illustrate the concepts and are not exhaustive.

![Reference architecture for the Databricks platform on AWS.](/aws/en/assets/images/ref-arch-overview-aws-ac9ab19c5534d2f74eea7e38734be4cb.png)

**[Download: Reference architecture for the Databricks platform on AWS](/aws/en/assets/files/reference-architecture-databricks-on-aws-e987d77be185187a910f1698c6756f9d.pdf)**

The AWS reference architecture shows the following AWS-specific services for ingesting, storage, serving, and analysis:

- Amazon Redshift as a source for Lakehouse Federation
- Amazon AppFlow and AWS Glue for batch ingest
- AWS IoT Core, Amazon Kinesis, and AWS DMS for streaming ingest
- Amazon S3 as the object storage for data and AI assets
- Amazon RDS and Amazon DynamoDB as operational databases
- Amazon QuickSight as BI tool
- Amazon Bedrock is used by Model Serving to call external LLMs from leading AI startups and Amazon

## Organization of the reference architectures[​](#organization-of-the-reference-architectures "Direct link to Organization of the reference architectures")

The reference architecture is structured along the swim lanes *Source*, *Ingest*, *Transform*, *Query/Process*, *Serve*, *Analysis*, and *Storage*:

- **Source**

  There are three ways to integrate external data into the Data Intelligence Platform:

  * [ETL](/aws/en/getting-started/etl-quick-start): The platform enables integration with systems that provide semi-structured and unstructured data (such as sensors, IoT devices, media, files, and logs), as well as structured data from relational databases or business applications.
  * [Lakehouse Federation](/aws/en/query-federation/): SQL sources, such as relational databases, can be integrated into Databricks and [Unity Catalog](/aws/en/data-governance/unity-catalog/) without ETL. In this case, the source system data is governed by Unity Catalog, and queries are pushed down to the source system.

  * Catalog Federation: External Hive Metastore catalogs or AWS Glue can also be integrated into Unity Catalog through [catalog federation](/aws/en/query-federation/hms-federation-glue), allowing Unity Catalog to control the tables stored in Hive Metastore or AWS Glue.

- **Ingest**

  Ingest data into Databricks via batch or streaming:

  * [Databricks Lakeflow Connect](/aws/en/ingestion/lakeflow-connect/) offers built-in connectors for ingestion from enterprise applications and databases. The resulting ingestion pipeline is governed by Unity Catalog and is powered by serverless compute and [Pipelines](/aws/en/ldp/).
  * Files delivered to cloud storage can be loaded directly using the Databricks [Auto Loader](/aws/en/ingestion/cloud-object-storage/auto-loader/).
  * For batch ingestion of data from enterprise applications into [Delta Lake](/aws/en/delta/), the [Databricks platform](/aws/en/lakehouse/) relies on [partner ingest tools](/aws/en/partner-connect/ingestion) with specific adapters for these systems of record.
  * Streaming events can be ingested directly from event streaming systems such as Kafka using Databricks [Structured Streaming](/aws/en/structured-streaming/concepts). Streaming sources can be sensors, IoT, or [change data capture](/aws/en/ldp/cdc) processes.

- **Storage**

  * Data is typically stored in the cloud storage system where the ETL pipelines use the [medallion architecture](/aws/en/lakehouse/medallion) to store data in a curated way as [Delta files/tables](/aws/en/delta/) or [Apache Iceberg tables](/aws/en/delta/iceberg-reads).

- **Transform** and **Query / process**

  * The Databricks platform uses its engines [Apache Spark](/aws/en/spark/) and [Photon](/aws/en/compute/photon) for all transformations and queries.

  * [Pipelines](/aws/en/ldp/) is a declarative framework for simplifying and optimizing reliable, maintainable, and testable data processing pipelines.

  * Powered by Apache Spark and Photon, the Databricks Data Intelligence Platform supports both types of workloads: SQL queries via [SQL warehouses](/aws/en/compute/sql-warehouse/), and SQL, Python and Scala workloads via workspace [clusters](/aws/en/compute/).

  * For data science (ML Modeling and [AI](/aws/en/machine-learning/)), the Databricks [AI and Machine Learning platform](/aws/en/machine-learning/) provides specialized ML runtimes for [AutoML](/aws/en/machine-learning/automl/) and for coding ML jobs. All data science and [MLOps workflows](/aws/en/machine-learning/mlops/mlops-workflow) are best supported by [MLflow](/aws/en/mlflow/).

- **Serving**

  * For data warehousing (DWH) and BI use cases, the Databricks platform provides [Databricks SQL](/aws/en/sql/), the data warehouse powered by [SQL warehouses](/aws/en/compute/sql-warehouse/create), and [serverless SQL warehouses](/aws/en/admin/sql/serverless).

  * For machine learning, [Model Serving](/aws/en/machine-learning/model-serving/) is a scalable, real-time, enterprise-grade model serving capability hosted in the Databricks control plane. [Unity AI Gateway](/aws/en/ai-gateway/) is Databricks' solution for governing and monitoring access to supported AI models and their associated model serving endpoints.

  * Operational databases:

    + [Lakebase](/aws/en/oltp/projects/) is an online transaction processing (OLTP) database based on Postgres and fully integrated with the Databricks Data Intelligence Platform. It allows you to create OLTP databases on Databricks and integrate OLTP workloads with Databricks.

    + [External systems](/aws/en/query-federation/), such as operational databases, can be used to store and deliver final data products to user applications.

- **Collaboration**:

  * Business partners get secure access to the data they need through [OpenSharing](/aws/en/opensharing/).

  * Based on OpenSharing, the [Databricks Marketplace](/aws/en/marketplace/) is an open forum for exchanging data products.

  * [Clean Rooms](/aws/en/clean-rooms/) are secure and privacy-protecting environments where multiple users can work together on sensitive enterprise data without direct access to each other's data.

- **Analysis**

  * The final business applications are in this swim lane. Examples include custom clients such as AI applications connected to [Model Serving](/aws/en/machine-learning/model-serving/) for real-time inference or applications that access data pushed from Databricks to an operational database.

  * For BI use cases, analysts typically use [BI tools to access the data warehouse](/aws/en/partner-connect/bi). SQL developers can additionally use the [Databricks SQL Editor](/aws/en/sql/user/sql-editor/) (not shown in the diagram) for queries and dashboarding.

  * The Data Intelligence Platform also offers [dashboards](/aws/en/dashboards/) to build data visualizations and share insights.

- **Integrate**

  * The Databricks platform integrates with standard identity providers for [user management](/aws/en/admin/users-groups/) and [single sign on (SSO)](/aws/en/security/auth/single-sign-on/).

  * External AI services like [OpenAI](/aws/en/machine-learning/foundation-models/external-models-tutorial), [LangGraph](https://github.com/databricks/app-templates/tree/main/agent-langgraph) or [HuggingFace](/aws/en/machine-learning/train-model/huggingface/) can be used directly from within the Databricks Intelligence Platform.

  * External orchestrators can either use the comprehensive [REST API](#) or dedicated connectors to external orchestration tools like [Apache Airflow](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/connections/databricks.html).

  * Unity Catalog is used for all data & AI governance in the Databricks Intelligence Platform and can integrate other databases into its governance through [Lakehouse Federation](/aws/en/query-federation/).

    Additionally, Unity Catalog can be integrated into other enterprise catalogs. Contact the enterprise catalog vendor for details.

## Common capabilities for all workloads[​](#common-capabilities-for-all-workloads "Direct link to Common capabilities for all workloads")

In addition, the Databricks platform comes with management capabilities that support all workloads:

- **Data and AI governance**

  The central data and AI governance system in the Databricks Data Intelligence Platform is [Unity Catalog](/aws/en/data-governance/unity-catalog/). Unity Catalog provides a single place to manage data access policies that apply across all workspaces and supports all assets created or used in Databricks, such as tables, volumes, features ([feature store](/aws/en/machine-learning/feature-store/)), and models ([model registry](/aws/en/machine-learning/manage-model-lifecycle/)). Unity Catalog can also be used to [capture runtime data lineage](/aws/en/data-governance/unity-catalog/data-lineage) across queries run on Databricks.

  [Databricks Data Quality Monitoring](/aws/en/data-governance/unity-catalog/data-quality-monitoring/) allows you to monitor the data quality of all tables in your account. It [detects anomalies](/aws/en/data-governance/unity-catalog/data-quality-monitoring/anomaly-detection/) across all your tables and provides a [full data profile](/aws/en/data-governance/unity-catalog/data-quality-monitoring/data-profiling/) for each table.

  For observability, [system tables](/aws/en/admin/system-tables/) is a Databricks-hosted analytical store of your account's operational data. System tables can be used for historical observability across your account.

- **Data intelligence engine**

  The Databricks Data Intelligence Platform allows your entire organization to use data and AI, combining AI with the unification benefits of Databricks to understand the unique semantics of your data. See [Databricks AI assistive features](/aws/en/databricks-ai/).

  [Genie Code](/aws/en/genie-code/) is available in Databricks notebooks, SQL editor, file editor, and elsewhere as a context-aware AI assistant for users.

- **Automation & Orchestration**

  [Lakeflow Jobs](/aws/en/jobs/) orchestrate data processing, machine learning, and analytics pipelines on the Databricks Data Intelligence Platform. [Lakeflow pipelines](/aws/en/ldp/) allow you to build reliable and maintainable ETL pipelines with declarative syntax. The platform also supports [CI/CD](/aws/en/dev-tools/ci-cd/) and [MLOps](/aws/en/dev-tools/bundles/mlops-stacks)

## High-level use cases for the Data Intelligence Platform on AWS[​](#high-level-use-cases-for-the-data-intelligence-platform-on-aws "Direct link to high-level-use-cases-for-the-data-intelligence-platform-on-aws")

### Built-in ingestion from SaaS apps and databases with Lakeflow Connect[​](#built-in-ingestion-from-saas-apps-and-databases-with-lakeflow-connect "Direct link to built-in-ingestion-from-saas-apps-and-databases-with-lakeflow-connect")

![Ingestion with LFC on Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-lakeflow-56b0ca399d2f5024cc9348ea21dc21b8.png)

**[Download: Lakeflow Connect reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-lakeflow-for-aws-2605b98a9e9823d02e2dd7f62338db9f.pdf)**

Databricks [Lakeflow Connect](/aws/en/ingestion/lakeflow-connect/) offers built-in connectors for ingestion from enterprise applications and databases. The resulting ingestion pipeline is governed by Unity Catalog and is powered by serverless compute and [Lakeflow pipelines](/aws/en/ldp/).

Lakeflow Connect leverages efficient incremental reads and writes to make data ingestion faster, scalable, and more cost-efficient, while your data remains fresh for downstream consumption.

### Batch ingestion and ETL[​](#batch-ingestion-and-etl "Direct link to Batch ingestion and ETL")

![Batch ETL reference architecture on Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-batch-e6006665ff04c22ec9c4a4248da33805.png)

**[Download: Batch ETL reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-batch-for-aws-a0f0a9bf8e71359e768b66827c90f886.pdf)**

Ingestion tools use source-specific adapters to read data from the source and then either store it in the cloud storage from where Auto Loader can read it, or call Databricks directly (for example, with partner ingestion tools integrated into the Databricks platform). To load the data, the Databricks ETL and processing engine runs the queries via [Pipelines](/aws/en/ldp/). Orchestrate single or multitask jobs using [Lakeflow Jobs](/aws/en/jobs/) and govern them using Unity Catalog (access control, audit, lineage, and so on). To provide access to specific golden tables for low-latency operational systems, export the tables to an operational database such as an RDBMS or key-value store at the end of the ETL pipeline.

### Streaming and change data capture (CDC)[​](#streaming-and-change-data-capture-cdc "Direct link to Streaming and change data capture (CDC)")

![Spark structured streaming architecture on Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-streaming-cdc-05188366dc97a320f5318faacfaf0b1c.png)

**[Download: Spark structured streaming architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-streaming-cdc-for-aws-7d43b034bff8328b91dc674f07605768.pdf)**

The Databricks ETL engine [Spark Structured Streaming](/aws/en/structured-streaming/concepts) to read from event queues such as Apache Kafka or AWS Kinesis. The downstream steps follow the approach of the Batch use case above.

Real-time [change data capture](/aws/en/data-engineering/what-is-cdc) (CDC) typically stores the extracted events in an event queue. From there, the use case follows the streaming use case.

If CDC is done in batch, with the extracted records stored in cloud storage first, Databricks Auto Loader can read them, and the use case follows Batch ETL.

### Machine learning and AI (traditional)[​](#machine-learning-and-ai-traditional "Direct link to Machine learning and AI (traditional)")

![Machine learning and AI reference architecture for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-ai-8da92b8e6ce0f7e3f1cb2c0b18b66be2.png)

**[Download: Machine learning and AI reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-ai-for-aws-76b82ef2bb04015c1e158be71cd0676b.pdf)**

For machine learning, the Databricks Data Intelligence Platform provides state-of-the-art [machine and deep learning libraries](/aws/en/machine-learning/databricks-runtime-ml#libraries-included-in-databricks-runtime-ml). It provides capabilities such as [Feature Store](/aws/en/machine-learning/feature-store/) and [Model Registry](/aws/en/machine-learning/manage-model-lifecycle/) (both integrated into Unity Catalog), low-code features with [AutoML](/aws/en/machine-learning/automl/), and MLflow integration into the data science lifecycle.

Unity Catalog governs all data science-related assets (tables, features, and models), and data scientists can use [Lakeflow Jobs](/aws/en/jobs/) to orchestrate their jobs.

For deploying models in a scalable and enterprise-grade way, use the [MLOps](/aws/en/machine-learning/mlops/mlops-workflow) capabilities to publish the models in model serving.

### Agent applications[​](#agent-applications "Direct link to Agent applications")

![AI application reference architecture for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-ai-agent-b4a4b90b6e8f613bf386acb8a6e21c52.png)

**[Download: AI application reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-gen-ai-agent-for-aws-8a361de05ea97d90edadb49da56db423.pdf)**

For deploying models in a scalable and enterprise-grade way, use the MLOps capabilities to publish the models in model serving.

### BI and SQL analytics[​](#bi-and-sql-analytics "Direct link to BI and SQL analytics")

![BI and SQL analytics reference architecture for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-bi-114ee3ddee9652bd81a1f858b753ca0d.png)

**[Download: BI and SQL analytics reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-bi-for-aws-aa183b07d1d79f9cc1e06b942c60a2b3.pdf)**

For BI use cases, business analysts can use [dashboards](/aws/en/dashboards/), the [Databricks SQL editor](/aws/en/sql/user/sql-editor/) or [BI tools](/aws/en/ai-bi/tools) such as Tableau or Amazon QuickSight. In all cases, the engine is Databricks SQL (serverless or non-serverless), and Unity Catalog provides data discovery, exploration, lineage, and access control.

### Business Apps[​](#business-apps "Direct link to Business Apps")

![Business Apps for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-apps-ca7dc3f20457a43b16da0fbfef855f9a.png)

**[Download: Business Apps for Databricks on AWS](/aws/en/assets/files/reference-use-case-apps-for-aws-ad255cbd322ebac552d1c7241b1f31e0.pdf)**

[Databricks Apps](/aws/en/dev-tools/databricks-apps/) enables developers to build and deploy secure data and AI applications directly on the Databricks platform, which eliminates the need for separate infrastructure. Apps are hosted on the Databricks serverless platform and integrate with key platform services. Use [Lakebase](/aws/en/oltp/projects/), if the app needs OLTP data that got synched from Databricks.

### Lakehouse federation[​](#lakehouse-federation "Direct link to Lakehouse federation")

![Lakehouse federation reference architecture for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-lh-federation-61f3ad4b493bfa2a733bd4ad8f875060.png)

**[Download: Lakehouse federation reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-lh-federation-for-aws-68fc07aca04c4c598969947bf6c003aa.pdf)**

[Lakehouse Federation](/aws/en/query-federation/) allows external data SQL databases (such as MySQL, Postgres, or Redshift) to be integrated with Databricks.

All workloads (AI, DWH, and BI) can benefit from this without the need to ETL the data into object storage first. The external source catalog is mapped into the Unity catalog and fine-grained access control can be applied to access via the Databricks platform.

### Catalog federation[​](#catalog-federation "Direct link to Catalog federation")

![Catalog federation reference architecture for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-cat-federation-d40d2234423c48e8f3025c65b96ba429.png)

**[Download: Catalog federation reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-cat-federation-for-aws-1a8c5401842164b245a08b8348edef16.pdf)**

[Catalog federation](/aws/en/query-federation/hms-federation-concepts) allows external Hive Metastores (such as MySQL, Postgres, or Redshift) or Amazon Glue to be integrated with Databricks.

All workloads (AI, DWH, and BI) can benefit from this without the need to ETL the data into object storage first. The external source catalog is added to Unity Catalog where fine-grained access control is applied via the Databricks platform.

### Share Data with 3rd party tools[​](#share-data-with-3rd-party-tools "Direct link to Share Data with 3rd party tools")

![Enterprise data sharing reference architecture for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-3p-sharing-8de9563e6906406c04b83341104fd90f.png)

**[Download: Share data with 3rd-party tools reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-3p-sharing-for-aws-398835fc7c52beac62c9ec563ca6b91d.pdf)**

Enterprise-grade data sharing with 3rd parties is provided by [OpenSharing](/aws/en/opensharing/). It enables direct access to data in the object store secured by Unity Catalog. This capability is also used in the [Databricks Marketplace](/aws/en/marketplace/), an open forum for exchanging data products.

### Consume shared data from Databricks[​](#consume-shared-data-from-databricks "Direct link to Consume shared data from Databricks")

![Consume shared data from Databricks for Databricks on AWS.](/aws/en/assets/images/aws-ref-arch-d2d-sharing-c6f63bc6e5f9e0a005d4e57f619cba31.png)

**[Download: Consume shared data from Databricks reference architecture for Databricks on AWS](/aws/en/assets/files/reference-use-case-d2d-sharing-for-aws-a07005c6e8690e0f4ae84590394f029f.pdf)**

The [OpenSharing Databricks-to-Databricks protocol](/aws/en/opensharing/share-data-databricks) allows users to share data securely with any Databricks user, regardless of account or cloud host, as long as that user has access to a workspace enabled for Unity Catalog.

On this page

- [Organization of the reference architectures](#organization-of-the-reference-architectures)
- [Common capabilities for all workloads](#common-capabilities-for-all-workloads)
- [High-level use cases for the Data Intelligence Platform on AWS](#high-level-use-cases-for-the-data-intelligence-platform-on-aws)
  * [Built-in ingestion from SaaS apps and databases with Lakeflow Connect](#built-in-ingestion-from-saas-apps-and-databases-with-lakeflow-connect)
  * [Batch ingestion and ETL](#batch-ingestion-and-etl)
  * [Streaming and change data capture (CDC)](#streaming-and-change-data-capture-cdc)
  * [Machine learning and AI (traditional)](#machine-learning-and-ai-traditional)
  * [Agent applications](#agent-applications)
  * [BI and SQL analytics](#bi-and-sql-analytics)
  * [Business Apps](#business-apps)
  * [Lakehouse federation](#lakehouse-federation)
  * [Catalog federation](#catalog-federation)
  * [Share Data with 3rd party tools](#share-data-with-3rd-party-tools)
  * [Consume shared data from Databricks](#consume-shared-data-from-databricks)

[Privacy Notice](https://www.databricks.com/legal/privacynotice)·[Terms of Use](https://www.databricks.com/terms-of-use)·[Modern Slavery Statement](https://www.databricks.com/legal/modern-slavery-policy-statement)·[California Privacy](https://www.databricks.com/legal/supplemental-privacy-notice-california-residents)·[Your Privacy Choices ![](https://www.databricks.com/sites/default/files/2022-12/gpcicon_small.png)](<>)

© Databricks 2026. All rights reserved. Apache, Apache Spark, Spark and the Spark logo are trademarks of the [Apache Software Foundation](https://www.apache.org/).
