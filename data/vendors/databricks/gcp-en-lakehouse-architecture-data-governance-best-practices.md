---
type: 'vendor'
title: 'Best practices for data and AI governance'
source_url: 'https://docs.databricks.com/gcp/en/lakehouse-architecture/data-governance/best-practices'
vendor: ['databricks']
industry: []
data_stack: ['databricks']
cloud: ['gcp']
constraints: []
compliance: []
region: []
data_zones: ['bronze', 'silver', 'gold']
latency: ['batch']
scraped_at: '2026-08-23'
---

[Skip to main content](#__docusaurus_skipToContent_fallback)

On this page

Last updated on **Jul 16, 2026**

# Best practices for data and AI governance

These best practices help you centrally govern data and AI assets on Databricks, organized by the architectural principles in the following sections.

## 1. Unify data and AI management[​](#1-unify-data-and-ai-management "Direct link to 1. Unify data and AI management")

### Establish a data and AI governance process[​](#establish-a-data-and-ai-governance-process "Direct link to Establish a data and AI governance process")

Data and AI governance is the management of the availability, usability, integrity, and security of an organization's data and AI assets. By strengthening data and AI governance, organizations can ensure the quality of the assets that are critical for accurate analytics and decision-making, help to identify new opportunities, improve customer satisfaction, and ultimately increase revenue. It helps organizations comply with data and AI privacy regulations and improve security measures, reducing the risk of data breaches and penalties. Effective data and AI governance also eliminates redundancies and streamlines data management, resulting in cost savings and increased operational efficiency.

### Design Unity Catalog for your organization[​](#design-unity-catalog-for-your-organization "Direct link to design-unity-catalog-for-your-organization")

Design your metastore, catalog, and schema structure to align with your organization's governance model and data architecture.

**Choose a governance model**

- In the **centralized governance model**, your governance administrators are owners of the metastore and can take ownership of any object and grant and revoke permissions. Best for organizations with strong central IT control and strict compliance requirements.
- In a **distributed (federated) governance model**, the catalog or a set of catalogs is the data domain. The owner of that catalog can create and own all assets and manage governance within that domain. The owners of any given domain can operate independently of the owners of other domains. Best for large organizations with autonomous business units.
- In a **hybrid governance model**, combine centralized governance for sensitive data with federated governance for operational data. Best for most enterprise organizations.

**Design metastore architecture**: Deploy one metastore per cloud region for optimal performance. Assign workspaces to metastores based on regional data residency requirements. Plan for multicloud deployments by creating separate metastores for each cloud provider.

**Design catalog structure**: Choose a catalog pattern that reflects your data organization:

- **Domain-based catalogs (recommended)**: One catalog per business domain (for example, `sales`, `marketing`, `finance`).
- **Environment-based catalogs**: Separate catalogs for dev, staging, and production
- **Data lifecycle-based catalogs**: Catalogs for raw, curated, and analytics data

**Design schema structure**: Use schemas to organize data products within catalogs. For medallion architecture, create schemas for bronze, silver, and gold layers within each catalog (for example, `sales.bronze_transactions`, `sales.silver_transactions`, `sales.gold_metrics`).

For detailed Unity Catalog design guidance and implementation procedures, see [Phase 3: Design Unity Catalog architecture](/gcp/en/lakehouse-architecture/deployment-guide/unity-catalog).

The data and AI governance solution [Unity Catalog](/gcp/en/data-governance/unity-catalog/) is integrated into the Databricks Data Intelligence Platform. It supports all governance models and helps to seamlessly manage structured and unstructured data, ML models, notebooks, dashboards, and files on any cloud or platform. The [Unity Catalog best practices](/gcp/en/data-governance/unity-catalog/best-practices) help to implement data and AI governance.

### Manage metadata for all data and AI assets in one place[​](#manage-metadata-for-all-data-and-ai-assets-in-one-place "Direct link to Manage metadata for all data and AI assets in one place")

The benefits of managing metadata for all assets in one place are similar to the benefits of maintaining a single source of truth for all your data. These include reduced data redundancy, increased data integrity, and the elimination of misunderstandings due to different definitions or taxonomies. It's also easier to implement global policies, standards, and rules with a single source.

As a best practice, run Databricks in a single account with a [Unity Catalog](/gcp/en/data-governance/unity-catalog/). The Unity Catalog can manage data and volumes (arbitrary files), as well as AI assets such as features and AI models. The top-level container of objects in the Unity Catalog is a [metastore](/gcp/en/data-governance/unity-catalog/best-practices). It stores data assets (such as tables and views) and the permissions that govern access to them. Use a single metastore per cloud region and do not access metastores across regions to avoid latency issues.

The metastore provides a three-level namespace to structure data, volumes and AI assets:

- [Catalog](/gcp/en/catalogs/)
- [Schema](/gcp/en/schemas/)
- [Table](/gcp/en/tables/)/[view](/gcp/en/views/).

Databricks recommends using [catalogs to provide segregation across your organization's information architecture](/gcp/en/data-governance/unity-catalog/best-practices#catalog). Often this means that catalogs can correspond to software development environment scope, team, or business unit.

### Track data and AI lineage to drive visibility of the data[​](#track-data-and-ai-lineage-to-drive-visibility-of-the-data "Direct link to Track data and AI lineage to drive visibility of the data")

Data lineage is a powerful tool that helps data leaders gain greater visibility and understanding of the data in their organizations. Data lineage describes the transformation and refinement of data from source to insight. It includes the capture of all relevant metadata and events associated with the data throughout its lifecycle, including the source of the data set, what other data sets were used to create it, who created it and when, what transformations were performed, what other data sets use it, and many other events and attributes.

In addition, when you train a model on a table in Unity Catalog, you can [track the model's lineage](/gcp/en/machine-learning/manage-model-lifecycle/#model-lineage) to the upstream dataset(s) on which it was trained and evaluated.

Lineage can be used for many data-related use cases:

- **Compliance and audit readiness**: Data lineage helps organizations trace the source of tables and fields. This is important for meeting the requirements of many compliance regulations, such as General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), Health Insurance Portability and Accountability Act (HIPAA), Basel Committee on Banking Supervision (BCBS) 239, and Sarbanes-Oxley Act (SOX).
- **Impact analysis/change management**: Data undergoes multiple transformations from the source to the final business-ready table. Understanding the potential impact of data changes on downstream users becomes important from a risk management perspective. This impact can be easily determined using the data lineage captured by the Unity Catalog.
- **Data quality assurance**: Understanding where a data set came from and what transformations have been applied provides much better context for data scientists and analysts, enabling them to gain better and more accurate insights.
- **Debugging and diagnostics**: In the event of an unexpected result, data lineage helps data teams perform root cause analysis by tracing the error back to its source. This dramatically reduces troubleshooting time.

Unity Catalog captures runtime [data lineage](/gcp/en/data-governance/unity-catalog/data-lineage) across queries running on Databricks and also [model lineage](/gcp/en/machine-learning/manage-model-lifecycle/#model-lineage). Lineage is supported for all languages and is captured down to the column level. Lineage data includes notebooks, jobs, and dashboards related to the query. Lineage can be visualized in near real-time in the [Catalog Explorer](/gcp/en/catalog-explorer/).

### Add consistent descriptions to your metadata[​](#add-consistent-descriptions-to-your-metadata "Direct link to Add consistent descriptions to your metadata")

Descriptions provide essential context for data. They help users understand the purpose and content of data tables and columns. This clarity allows them to more easily discover, identify, and filter the data they need, which is critical for effective data analysis and decision making. Descriptions can include data sensitivity and compliance information. This helps organizations meet legal and regulatory requirements for data privacy and security. Descriptions should also include information about the source, accuracy, and relevance of data. This helps ensure data integrity and promotes better collaboration across teams.

Two main features in Unity Catalog support describing tables and columns. The Unity Catalog allows to

- **[add comments](/gcp/en/comments/)** to tables and columns in the form of comments.

  You can also add an [AI-generated comment](/gcp/en/comments/ai-comments) for any table or table column managed by Unity Catalog to speed up the process. However, AI models are not always accurate and comments must be reviewed before saving. Databricks strongly recommends human review of AI-generated comments to check for inaccuracies.

- **[add tags](/gcp/en/database-objects/tags)** to any securable in Unity Catalog. Tags are attributes with keys and optional values that you can apply to different securable objects in Unity Catalog. Tagging is useful for organizing and categorizing different securable objects within a metastore. Using tags also makes it easier to search and discover your data assets.

### Allow easy data discovery for data consumers[​](#allow-easy-data-discovery-for-data-consumers "Direct link to Allow easy data discovery for data consumers")

Easy data discovery enables data scientists, data analysts, and data engineers to quickly discover and reference relevant data and accelerate time to value.

Databricks [Catalog Explorer](/gcp/en/catalog-explorer/) provides a user interface for exploring and managing data, schemas (databases), tables, and permissions, data owners, external locations, and credentials. In addition, you can use the Insights tab in Catalog Explorer to [view the most frequent recent queries](/gcp/en/discover/table-insights) and users of any table registered in Unity Catalog.

### Govern AI assets together with data[​](#govern-ai-assets-together-with-data "Direct link to Govern AI assets together with data")

The relationship between data governance and artificial intelligence (AI) has become critical to success. How organizations manage, secure, and use data directly impacts the outcomes and considerations of AI implementations: you can't have AI without quality data, and you can't have quality data without data governance.

Governing data and AI together improves AI performance by ensuring seamless access to high-quality, up-to-date data, leading to improved accuracy and better decision-making. Breaking down silos increases efficiency by enabling better collaboration and streamlining workflows, resulting in increased productivity and reduced costs.

Improved data security is another benefit, as a unified governance approach establishes consistent data handling practices, reducing vulnerabilities and improving an organization's ability to protect sensitive information. Compliance with data privacy regulations is easier to maintain when data and AI governance are integrated, as data handling and AI processes are aligned with regulatory requirements.

Overall, a unified governance approach fosters trust among stakeholders and ensures transparency in AI decision-making processes by establishing clear policies and procedures for both data and AI.

In the Databricks Data Intelligence Platform, the Unity Catalog is the central component for governing both data and AI assets:

- [Feature in Unity Catalog](/gcp/en/machine-learning/feature-store/uc/feature-tables-uc)

  In Unity Catalog enabled workspaces, data scientists can create feature tables in Unity Catalog. These feature tables are [Delta tables](/gcp/en/delta/) or [Lakeflow pipelines](/gcp/en/ldp/) managed by Unity Catalog.

- [Models in Unity Catalog](/gcp/en/machine-learning/manage-model-lifecycle/)

  Models in Unity Catalog extends the benefits of Unity Catalog to ML models, including centralized access control, auditing, lineage, and model discovery across workspaces. Key features of models in Unity Catalog include governance for models, chronological model lineage, model versioning, and model deployment via aliases.

## 2. Unify data and AI security[​](#2-unify-data-and-ai-security "Direct link to 2. Unify data and AI security")

### Centralize access control for all data and AI assets[​](#centralize-access-control-for-all-data-and-ai-assets "Direct link to Centralize access control for all data and AI assets")

Centralizing access control for all data assets is important because it simplifies the security and governance of your data and AI assets by providing a central place to administer and audit access to these assets. This approach helps in managing data and AI object access more efficiently, ensuring that operational requirements around segregation of duty are enforced, which is crucial for regulatory compliance and risk avoidance.

The Databricks Data Intelligence Platform provides data access control methods that describe which groups or individuals can access which data. These are policy statements that can be extremely granular and specific, down to the definition of each record that each individual has access to. Or they can be very expressive and broad, such as all financial users can see all financial data.

The Unity Catalog centralizes access controls for all [supported securable objects](/gcp/en/data-governance/unity-catalog/access-control/privileges-reference#securable-objects) such as tables, files, models, and many more. Every securable object in Unity Catalog has an owner. The owner of an object has all privileges on the object, as well as the ability to grant privileges on the securable object to other principals. Unity Catalog allows you to [manage privileges](/gcp/en/data-governance/unity-catalog/manage-privileges/) and to configure access control by using SQL DDL statements.

The Unity Catalog uses [row filters and column masks](/gcp/en/data-governance/unity-catalog/filters-and-masks/) for fine-grained access control. Row filters allow you to apply a filter to a table so that subsequent queries return only rows for which the filter predicate evaluates to true. Column masks allow you apply a masking function to a table column. The masking function gets evaluated at query runtime, substituting each reference to the target column with the results of the masking function.

For further information see [Security, compliance & privacy - Manage identity and access using least privilege](/gcp/en/lakehouse-architecture/security-compliance-and-privacy/best-practices#1-manage-identity-and-access-using-least-privilege).

### Configure audit logging[​](#configure-audit-logging "Direct link to Configure audit logging")

Audit logging is important because it provides a detailed account of system activities (user actions, changes to settings, and so on) that could affect the integrity of the system. While standard system logs are designed to help developers troubleshoot problems, audit logs provide a historical record of activity for compliance and other business policy enforcement purposes. Maintaining robust audit logs can help identify and ensure preparedness in the face of threats, breaches, fraud, and other system issues.

Databricks provides access to [audit logs](/gcp/en/admin/account-settings/audit-logs) of activities performed by Databricks users, allowing your organization to monitor detailed Databricks usage patterns. There are two types of logs, Workspace-level audit logs with workspace-level events and account-level audit logs with account-level events.

You can also [enable verbose audit logs](/gcp/en/admin/account-settings/verbose-logs) are additional audit logs recorded whenever a query or command is run in your workspace.

### Audit data platform events[​](#audit-data-platform-events "Direct link to Audit data platform events")

Audit logging is important because it provides a detailed account of system activities. The Data Intelligence Platform has audit logs for the metadata access (hence data access) and for data sharing:

- Unity Catalog [captures an audit log](/gcp/en/admin/account-settings/audit-logs) of actions performed against the metastore. This enables admins to access fine-grained details about who accessed a given dataset and what actions they performed.
- For secure sharing with OpenSharing, Databricks provides [audit logs to monitor OpenSharing events](/gcp/en/opensharing/audit-logs), including:
  * When someone creates, modifies, updates, or deletes a share or a recipient.
  * When a recipient accesses an activation link and downloads the credential.
  * When a recipient accesses shares or data in shared tables.
  * When a recipient's credential is rotated or expires.

## 3. Establish data quality standards[​](#3-establish-data-quality-standards "Direct link to 3. Establish data quality standards")

The Databricks Data Intelligence Platform provides robust data quality management with built-in quality controls, testing, monitoring, and enforcement to ensure accurate and useful data is available for downstream BI, analytics, and machine learning workloads.

Implementation details can be seen in [Reliability - Manage data quality](/gcp/en/lakehouse-architecture/reliability/best-practices#2-manage-data-quality).

### Define clear data quality standards[​](#define-clear-data-quality-standards "Direct link to Define clear data quality standards")

Defining clear and actionable data quality standards is crucial, because it helps ensure that data used for analysis, reporting, and decision-making is reliable and trustworthy. Documenting these standards helps ensure that they are upheld. Data quality standards should be based on the specific needs of the business and should address dimensions of data quality such as accuracy, completeness, consistency, timeliness, and reliability:

- Accuracy: Ensure data accurately reflects real-world values.
- Completeness: All necessary data should be captured and no critical data should be missing.
- Consistency: Data across all systems should be consistent and not contradict other data.
- Timeliness: Data should be updated and available in a timely manner.
- Reliability: Data should be sourced and processed in a way that ensures its dependability.

### Use data quality tools for profiling, cleansing, validating, and monitoring data[​](#use-data-quality-tools-for-profiling-cleansing-validating-and-monitoring-data "Direct link to Use data quality tools for profiling, cleansing, validating, and monitoring data")

Leverage data quality tools for profiling, cleansing, validating, and monitoring data. These tools help in automating the processes of detecting and correcting data quality issues, which is vital for scaling data quality initiatives across large datasets typical in data lakes

When using [Lakeflow pipelines](/gcp/en/ldp/), use [expectations](/gcp/en/ldp/expectations) to define data quality constraints on the contents of a dataset. Expectations allow you to guarantee data arriving in tables meets data quality requirements and to provide insights into data quality for each pipeline update.

### Implement and enforce standardized data formats and definitions[​](#implement-and-enforce-standardized-data-formats-and-definitions "Direct link to Implement and enforce standardized data formats and definitions")

Standardized data formats and definitions help achieve a consistent representation of data across all systems to facilitate data integration and analysis, reduce costs, and improve decision making by enhancing communication and collaboration across teams and departments. It also helps provide a structure for creating and maintaining data quality.

Develop and enforce a standard data dictionary that includes definitions, formats, and acceptable values for all data elements used across the organization.

Use consistent naming conventions, date formats, and measurement units across all databases and applications to prevent discrepancies and confusion.

On this page

- [1. Unify data and AI management](#1-unify-data-and-ai-management)
  * [Establish a data and AI governance process](#establish-a-data-and-ai-governance-process)
  * [Design Unity Catalog for your organization](#design-unity-catalog-for-your-organization)
  * [Manage metadata for all data and AI assets in one place](#manage-metadata-for-all-data-and-ai-assets-in-one-place)
  * [Track data and AI lineage to drive visibility of the data](#track-data-and-ai-lineage-to-drive-visibility-of-the-data)
  * [Add consistent descriptions to your metadata](#add-consistent-descriptions-to-your-metadata)
  * [Allow easy data discovery for data consumers](#allow-easy-data-discovery-for-data-consumers)
  * [Govern AI assets together with data](#govern-ai-assets-together-with-data)
- [2. Unify data and AI security](#2-unify-data-and-ai-security)
  * [Centralize access control for all data and AI assets](#centralize-access-control-for-all-data-and-ai-assets)
  * [Configure audit logging](#configure-audit-logging)
  * [Audit data platform events](#audit-data-platform-events)
- [3. Establish data quality standards](#3-establish-data-quality-standards)
  * [Define clear data quality standards](#define-clear-data-quality-standards)
  * [Use data quality tools for profiling, cleansing, validating, and monitoring data](#use-data-quality-tools-for-profiling-cleansing-validating-and-monitoring-data)
  * [Implement and enforce standardized data formats and definitions](#implement-and-enforce-standardized-data-formats-and-definitions)

[Privacy Notice](https://www.databricks.com/legal/privacynotice)·[Terms of Use](https://www.databricks.com/terms-of-use)·[Modern Slavery Statement](https://www.databricks.com/legal/modern-slavery-policy-statement)·[California Privacy](https://www.databricks.com/legal/supplemental-privacy-notice-california-residents)·[Your Privacy Choices ![](https://www.databricks.com/sites/default/files/2022-12/gpcicon_small.png)](<>)

© Databricks 2026. All rights reserved. Apache, Apache Spark, Spark and the Spark logo are trademarks of the [Apache Software Foundation](https://www.apache.org/).
