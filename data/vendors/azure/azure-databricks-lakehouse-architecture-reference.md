---
type: 'vendor'
title: 'Databricks reference architectures (download) - Azure Databricks'
source_url: 'https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/reference'
vendor: ['azure']
industry: []
data_stack: ['databricks']
cloud: ['azure']
constraints: []
compliance: []
region: []
data_zones: ['bronze', 'silver', 'gold']
latency: ['batch']
scraped_at: '2026-08-23'
---

[Skip to main content](#main)

 Table of contents

Exit editor mode

Reading mode

Table of contents

Add

--- Copy Markdown

Print

# Databricks reference architectures (download)

Summarize this article for me

Databricks reference architectures provide architectural guidance covering data sources, ingestion, transformation, querying and processing, serving, analysis, and storage.

Each reference architecture has a downloadable PDF in 11 x 17 (A3) format.

While Databricks is an open platform that integrates with a [large ecosystem of partner tools](../integrations/), the reference architectures focus only on Azure services and the Databricks platform. The cloud provider services shown are selected to illustrate the concepts and are not exhaustive.

![Reference architecture for the Azure Databricks platform.](../_static/images/lakehouse-architecture/ref-arch-overview-azure.png)

**[Download: Reference architecture for the Azure Databricks platform](../_extras/documents/reference-architecture-databricks-on-azure.pdf)**

The Azure reference architecture shows the following Azure-specific services for ingesting, storage, serving, and analysis:

- Azure Synapse and SQL Server as source systems for Lakehouse Federation
- Azure IoT Hub and Azure Event Hubs for streaming ingest
- Azure Data Factory for batch ingest
- Azure Data Lake Storage Gen 2 (ADLS) as the object storage for data and AI assets
- Azure SQL DB and Azure Cosmos DB as operational databases
- Azure Purview as the enterprise catalog to which UC exports schema and lineage information
- Power BI as the BI tool
- Azure OpenAI can be used by Model Serving as an external LLM

## Organization of the reference architectures

The reference architecture is structured along the swim lanes *Source*, *Ingest*, *Transform*, *Query/Process*, *Serve*, *Analysis*, and *Storage*:

- **Source**

  There are three ways to integrate external data into the Data Intelligence Platform:

  * [ETL](../getting-started/etl-quick-start): The platform enables integration with systems that provide semi-structured and unstructured data (such as sensors, IoT devices, media, files, and logs), as well as structured data from relational databases or business applications.
  * [Lakehouse Federation](../query-federation/): SQL sources, such as relational databases, can be integrated into Databricks and [Unity Catalog](../data-governance/unity-catalog/) without ETL. In this case, the source system data is governed by Unity Catalog, and queries are pushed down to the source system.

  * Catalog Federation: Hive Metastore catalogs can also be integrated into Unity Catalog through [catalog federation](../query-federation/hms-federation-concepts), allowing Unity Catalog to control the tables stored in Hive Metastore.

- **Ingest**

  Ingest data into Databricks via batch or streaming:

  * [Databricks Lakeflow Connect](../ingestion/lakeflow-connect/) offers built-in connectors for ingestion from enterprise applications and databases. The resulting ingestion pipeline is governed by Unity Catalog and is powered by serverless compute and [Pipelines](../ldp/).
  * Files delivered to cloud storage can be loaded directly using the Databricks [Auto Loader](../ingestion/cloud-object-storage/auto-loader/).
  * For batch ingestion of data from enterprise applications into [Delta Lake](../delta/), the [Databricks platform](../lakehouse/) relies on [partner ingest tools](../partner-connect/ingestion) with specific adapters for these systems of record.
  * Streaming events can be ingested directly from event streaming systems such as Kafka using Databricks [Structured Streaming](../structured-streaming/concepts). Streaming sources can be sensors, IoT, or [change data capture](../ldp/cdc) processes.

- **Storage**

  * Data is typically stored in the cloud storage system where the ETL pipelines use the [medallion architecture](../lakehouse/medallion) to store data in a curated way as [Delta files/tables](../delta/) or [Apache Iceberg tables](../delta/iceberg-reads).

- **Transform** and **Query / process**

  * The Databricks platform uses its engines [Apache Spark](../spark/) and [Photon](../compute/photon) for all transformations and queries.

  * [Pipelines](../ldp/) is a declarative framework for simplifying and optimizing reliable, maintainable, and testable data processing pipelines.

  * Powered by Apache Spark and Photon, the Databricks Data Intelligence Platform supports both types of workloads: SQL queries via [SQL warehouses](../compute/sql-warehouse/), and SQL, Python and Scala workloads via workspace [clusters](../compute/).

  * For data science (ML Modeling and [AI](../machine-learning/)), the Databricks [AI and Machine Learning platform](../machine-learning/) provides specialized ML runtimes for [AutoML](../machine-learning/automl/) and for coding ML jobs. All data science and [MLOps workflows](../machine-learning/mlops/mlops-workflow) are best supported by [MLflow](../mlflow/).

- **Serving**

  * For data warehousing (DWH) and BI use cases, the Databricks platform provides [Databricks SQL](../sql/), the data warehouse powered by [SQL warehouses](../compute/sql-warehouse/create), and [serverless SQL warehouses](../admin/sql/serverless).

  * For machine learning, [Model Serving](../machine-learning/model-serving/) is a scalable, real-time, enterprise-grade model serving capability hosted in the Databricks control plane. [Unity AI Gateway](../ai-gateway/) is Databricks' solution for governing and monitoring access to supported AI models and their associated model serving endpoints.

  * Operational databases:

    + [Lakebase](../oltp/instances/) is an online transaction processing (OLTP) database based on Postgres and fully integrated with the Databricks Data Intelligence Platform. It allows you to create OLTP databases on Databricks and integrate OLTP workloads with Databricks.

    + [External systems](../query-federation/), such as operational databases, can be used to store and deliver final data products to user applications.

- **Collaboration**:

  * Business partners get secure access to the data they need through [OpenSharing](../opensharing/).

  * Based on OpenSharing, the [Databricks Marketplace](../marketplace/) is an open forum for exchanging data products.

  * [Clean Rooms](../clean-rooms/) are secure and privacy-protecting environments where multiple users can work together on sensitive enterprise data without direct access to each other's data.

- **Analysis**

  * The final business applications are in this swim lane. Examples include custom clients such as AI applications connected to [Model Serving](../machine-learning/model-serving/) for real-time inference or applications that access data pushed from Databricks to an operational database.

  * For BI use cases, analysts typically use [BI tools to access the data warehouse](../partner-connect/bi). SQL developers can additionally use the [Databricks SQL Editor](../sql/user/sql-editor/) (not shown in the diagram) for queries and dashboarding.

  * The Data Intelligence Platform also offers [dashboards](../dashboards/) to build data visualizations and share insights.

- **Integrate**

  * The Databricks platform integrates with standard identity providers for [user management](../admin/users-groups/) and [single sign on (SSO)](../security/auth/#sso).

  * External AI services like [OpenAI](../machine-learning/foundation-models/external-models-tutorial), [LangGraph](https://github.com/databricks/app-templates/tree/main/agent-langgraph) or [HuggingFace](../machine-learning/train-model/huggingface/) can be used directly from within the Databricks Intelligence Platform.

  * External orchestrators can either use the comprehensive [REST API](#) or dedicated connectors to external orchestration tools like [Apache Airflow](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/connections/databricks.html).

  * Unity Catalog is used for all data & AI governance in the Databricks Intelligence Platform and can integrate other databases into its governance through [Lakehouse Federation](../query-federation/).

    Additionally, Unity Catalog can be integrated into other enterprise catalogs, e.g. [Purview](/en-us/purview/register-scan-azure-databricks-unity-catalog). Contact the enterprise catalog vendor for details.

## Common capabilities for all workloads

In addition, the Databricks platform comes with management capabilities that support all workloads:

- **Data and AI governance**

  The central data and AI governance system in the Databricks Data Intelligence Platform is [Unity Catalog](../data-governance/unity-catalog/). Unity Catalog provides a single place to manage data access policies that apply across all workspaces and supports all assets created or used in Databricks, such as tables, volumes, features ([feature store](../machine-learning/feature-store/)), and models ([model registry](../machine-learning/manage-model-lifecycle/)). Unity Catalog can also be used to [capture runtime data lineage](../data-governance/unity-catalog/data-lineage) across queries run on Databricks.

  [Databricks Data Quality Monitoring](../data-governance/unity-catalog/data-quality-monitoring/) allows you to monitor the data quality of all tables in your account. It [detects anomalies](../data-governance/unity-catalog/data-quality-monitoring/anomaly-detection/) across all your tables and provides a [full data profile](../data-governance/unity-catalog/data-quality-monitoring/data-profiling/) for each table.

  For observability, [system tables](../admin/system-tables/) is a Databricks-hosted analytical store of your account's operational data. System tables can be used for historical observability across your account.

- **Data intelligence engine**

  The Databricks Data Intelligence Platform allows your entire organization to use data and AI, combining AI with the unification benefits of Databricks to understand the unique semantics of your data. See [Databricks AI assistive features](../databricks-ai/).

  [Genie Code](../genie-code/) is available in Databricks notebooks, SQL editor, file editor, and elsewhere as a context-aware AI assistant for users.

- **Automation & Orchestration**

  [Lakeflow Jobs](../jobs/) orchestrate data processing, machine learning, and analytics pipelines on the Databricks Data Intelligence Platform. [Lakeflow pipelines](../ldp/) allow you to build reliable and maintainable ETL pipelines with declarative syntax. The platform also supports [CI/CD](../dev-tools/ci-cd/) and [MLOps](../dev-tools/bundles/mlops-stacks)

## High-level use cases for the Data Intelligence Platform on Azure

### Built-in ingestion from SaaS apps and databases with Lakeflow Connect

![Ingestion with LFC on Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-lakeflow.png)

**[Download: Lakeflow Connect reference architecture for Azure Databricks.](../_extras/documents/reference-use-case-lakeflow-for-azure.pdf)**

Databricks [Lakeflow Connect](../ingestion/lakeflow-connect/) offers built-in connectors for ingestion from enterprise applications and databases. The resulting ingestion pipeline is governed by Unity Catalog and is powered by serverless compute and [Lakeflow pipelines](../ldp/).

Lakeflow Connect leverages efficient incremental reads and writes to make data ingestion faster, scalable, and more cost-efficient, while your data remains fresh for downstream consumption.

### Batch ingestion and ETL

![Reference architecture for batch ETL on Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-batch.png)

**[Download: Batch ETL reference architecture for Azure Databricks](../_extras/documents/reference-use-case-batch-for-azure.pdf)**

Ingestion tools use source-specific adapters to read data from the source and then either store it in the cloud storage from where Auto Loader can read it, or call Databricks directly (for example, with partner ingestion tools integrated into the Databricks platform). To load the data, the Databricks ETL and processing engine runs the queries via [Pipelines](../ldp/). Orchestrate single or multitask jobs using [Lakeflow Jobs](../jobs/) and govern them using Unity Catalog (access control, audit, lineage, and so on). To provide access to specific golden tables for low-latency operational systems, export the tables to an operational database such as an RDBMS or key-value store at the end of the ETL pipeline.

### Streaming and change data capture (CDC)

![Spark structured streaming architecture on Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-streaming-cdc.png)

**[Download: Spark structured streaming architecture for Azure Databricks](../_extras/documents/reference-use-case-streaming-cdc-for-azure.pdf)**

The Databricks ETL engine uses [Spark Structured Streaming](../structured-streaming/concepts) to read from event queues such as Apache Kafka or Azure Event Hub. The downstream steps follow the approach of the Batch use case above.

Real-time [change data capture](../data-engineering/what-is-cdc) (CDC) typically stores the extracted events in an event queue. From there, the use case follows the streaming use case.

If CDC is done in batch, with the extracted records stored in cloud storage first, Databricks Auto Loader can read them, and the use case follows Batch ETL.

### Machine learning and AI (traditional)

![Machine learning and AI reference architecture for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-ai.png)

**[Download: Machine learning and AI reference architecture for Azure Databricks](../_extras/documents/reference-use-case-ai-for-azure.pdf)**

For machine learning, the Databricks Data Intelligence Platform provides state-of-the-art [machine and deep learning libraries](../machine-learning/databricks-runtime-ml#libraries-included-in-databricks-runtime-ml). It provides capabilities such as [Feature Store](../machine-learning/feature-store/) and [Model Registry](../machine-learning/manage-model-lifecycle/) (both integrated into Unity Catalog), low-code features with [AutoML](../machine-learning/automl/), and MLflow integration into the data science lifecycle.

Unity Catalog governs all data science-related assets (tables, features, and models), and data scientists can use [Lakeflow Jobs](../jobs/) to orchestrate their jobs.

For deploying models in a scalable and enterprise-grade way, use the [MLOps](../machine-learning/mlops/mlops-workflow) capabilities to publish the models in model serving.

### Agent applications

![AI application reference architecture for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-ai-agent.png)

**[Download: AI application reference architecture for Azure Databricks](../_extras/documents/reference-use-case-gen-ai-agent-for-azure.pdf)**

For deploying models in a scalable and enterprise-grade way, use the MLOps capabilities to publish the models in model serving.

### BI and SQL analytics

![BI and SQL analytics reference architecture for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-bi.png)

**[Download: BI and SQL analytics reference architecture for Azure Databricks](../_extras/documents/reference-use-case-bi-for-azure.pdf)**

For BI use cases, business analysts can use [dashboards](../dashboards/), the [Databricks SQL editor](../sql/user/sql-editor/) or [BI tools](../ai-bi/tools) such as Tableau or Power BI. In all cases, the engine is Databricks SQL (serverless or non-serverless), and Unity Catalog provides data discovery, exploration, and access control.

### Business Apps

![Business Apps for Databricks for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-apps.png)

**[Download: Business Apps for Databricks for Azure Databricks](../_extras/documents/reference-use-case-apps-for-azure.pdf)**

[Databricks Apps](../dev-tools/databricks-apps/) enables developers to build and deploy secure data and AI applications directly on the Databricks platform, which eliminates the need for separate infrastructure. Apps are hosted on the Databricks serverless platform and integrate with key platform services. Use [Lakebase](../oltp/instances/) if the app needs OLTP data that was synced from Databricks.

### Lakehouse federation

![Lakehouse federation reference architecture for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-lh-federation.png)

**[Download: Lakehouse federation reference architecture for Azure Databricks](../_extras/documents/reference-use-case-lh-federation-for-azure.pdf)**

[Lakehouse Federation](../query-federation/) allows external data SQL databases (such as MySQL, Postgres, SQL Server, or Azure Synapse) to be integrated with Databricks.

All workloads (AI, DWH, and BI) can benefit from this without the need to ETL the data into object storage first. The external source catalog is mapped into the Unity catalog and fine-grained access control can be applied to access via the Databricks platform.

### Catalog federation

![Catalog federation reference architecture for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-cat-federation.png)

**[Download: Catalog federation reference architecture for Azure Databricks](../_extras/documents/reference-use-case-cat-federation-for-azure.pdf)**

[Catalog federation](../query-federation/hms-federation-concepts) allows external Hive Metastores (such as MySQL, Postgres, SQL Server, or Azure Synapse) to be integrated with Databricks.

All workloads (AI, DWH, and BI) can benefit from this without the need to ETL the data into object storage first. The external source catalog is added to Unity Catalog where fine-grained access control is applied via the Databricks platform.

### Share Data with 3rd party tools

![Enterprise data sharing reference architecture for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-3p-sharing.png)

**[Download: Share data with 3rd-party tools reference architecture for Azure Databricks](../_extras/documents/reference-use-case-3p-sharing-for-azure.pdf)**

Enterprise-grade data sharing with 3rd parties is provided by [OpenSharing](../opensharing/). It enables direct access to data in the object store secured by Unity Catalog. This capability is also used in the [Databricks Marketplace](../marketplace/), an open forum for exchanging data products.

### Consume shared data from Databricks

![Consume shared data from Databricks for Azure Databricks.](../_static/images/lakehouse-architecture/azure-ref-arch-d2d-sharing.png)

**[Download: Consume shared data from Databricks reference architecture for Azure Databricks](../_extras/documents/reference-use-case-d2d-sharing-for-azure.pdf)**

The [OpenSharing Databricks-to-Databricks protocol](../opensharing/share-data-databricks) allows users to share data securely with any Databricks user, regardless of account or cloud host, as long as that user has access to a workspace enabled for Unity Catalog.

---

## Feedback

Was this page helpful?

Yes

**No**

Need help with this topic?

Want to try using Ask Learn to clarify or guide you through this topic?

Suggest a fix?

---

- Last updated on 2026-08-03

 Was this page helpful?

Need help with this topic?

Want to try using Ask Learn to clarify or guide you through this topic?

Suggest a fix?

[en-us](# "")

Theme

- Light

- Dark

- High contrast

- [AI Disclaimer](https://learn.microsoft.com/en-us/principles-for-ai-generated-content "")
- [Previous Versions](https://learn.microsoft.com/en-us/previous-versions/ "")
- [Blog](https://techcommunity.microsoft.com/t5/microsoft-learn-blog/bg-p/MicrosoftLearnBlog "")
- [Contribute](https://learn.microsoft.com/en-us/contribute "")
- [Privacy](https://go.microsoft.com/fwlink/?LinkId=521839 "")
- [Consumer Health Privacy](https://go.microsoft.com/fwlink/?linkid=2259814 "")
- [Terms of Use](https://learn.microsoft.com/en-us/legal/termsofuse "")
- [Trademarks](https://www.microsoft.com/legal/intellectualproperty/Trademarks/ "")
- © Microsoft 2026
