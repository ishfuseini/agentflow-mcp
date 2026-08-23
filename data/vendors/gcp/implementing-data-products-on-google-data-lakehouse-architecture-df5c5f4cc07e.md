---
type: 'vendor'
title: 'Implementing Data Products on Google Data Lakehouse Architecture'
source_url: 'https://medium.com/google-cloud/implementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e'
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

[Sitemap](/sitemap/sitemap.xml)

[Open in app](https://play.google.com/store/apps/details?id=com.medium.reader&referrer=utm_source%3DmobileNavBar&source=---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[](/?source=---top_nav_layout_nav-----------------------------------------)

Get app

[Write](/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[Search](/search?source=---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![Unknown user](https://miro.medium.com/v2/resize:fill:64:64/1*dmbNkD5D-u45r44go_cf0g.png)

## [Google Cloud - Community](https://medium.com/google-cloud?source=post_page---publication_nav-e52cf94d98af-df5c5f4cc07e---------------------------------------)

·

[Google Cloud - Community](https://medium.com/google-cloud?source=post_page---post_publication_sidebar-e52cf94d98af-df5c5f4cc07e---------------------------------------)

A collection of technical articles and blogs published or curated by Google Cloud Developer Advocates. The views expressed are those of the authors and don't necessarily reflect those of Google.

Data Governance

Data Governance Framework

Lakehouse Architecture

Data Quality Management

Data Product Creation

# **Implementing Data Products on** Google Data Lakehouse Architecture

[Jitendra Yadav](/@jitendrayadav_43136?source=post_page---byline--df5c5f4cc07e---------------------------------------)

[Jitendra Yadav](/@jitendrayadav_43136?source=post_page---byline--df5c5f4cc07e---------------------------------------)

14 min read

·

Sep 21, 2024

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fgoogle-cloud%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---header_actions--df5c5f4cc07e---------------------clap_footer------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fgoogle-cloud%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---header_actions--df5c5f4cc07e---------------------clap_footer------------------)

--

1

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Frepost%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---header_actions--df5c5f4cc07e---------------------repost_header------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Frepost%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---header_actions--df5c5f4cc07e---------------------repost_header------------------)

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=---header_actions--df5c5f4cc07e---------------------bookmark_footer------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=---header_actions--df5c5f4cc07e---------------------bookmark_footer------------------)

[Listen](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2Fplans%3Fdimension%3Dpost_audio_button%26postId%3Ddf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=---header_actions--df5c5f4cc07e---------------------post_audio_button------------------)

Share

> Authors:
>
> [Mihaela Savastre](https://uk.linkedin.com/in/mihaelasavastre), EMEA Data Analytics Solution Lead, Google Cloud
>
> [Jitendra Yadav](http://in.linkedin.com/pub/jitendra-yadav/21/48b/881), Data & AI/ML Specialist, Google Cloud

Organizations today require a robust and scalable data foundation to support their growing data needs. A Lakehouse architecture offers a modern approach, combining the scalability and flexibility of a data lake with the transactional capabilities, performance, and security of a data warehouse.

This approach allows business users to access data with the speed and reliability they need, without relying on disparate tools and technologies. It addresses common challenges such as data silos, inconsistent data quality, and slow access to information.

Furthermore, a Lakehouse architecture provides the technical capabilities for storing, processing, and accessing data at scale, regardless of its structure or format. This supports self-service data access and data sharing, key aspects of a modern data strategy. By utilizing a single storage layer for all data, organizations can leverage different data processing engines based on the specific use case.

Press enter or click to view image in full size
![](<>)

A Data Mesh operating model is the ideal complement to this architecture, unlocking its full potential. Data mesh principles guide how data is managed, accessed, and governed across different domains within an organization. This ensures that data is treated as a valuable asset, fostering collaboration and reducing data silos

A data mesh is an architectural and organizational framework that treats data as a product. Teams that best understand their data and who follow an organization wide set of data governance standards develop data products most effectively. Once the products are deployed, distributed teams can discover and access data that is relevant to their needs more quickly and efficiently.

To achieve a well-functioning data mesh, the high level architectural components and organizational roles must be established first.

Key data mesh principles:

- **Domain-oriented decentralized data ownership & architecture:** Data assets are organized, and data ownership assigned, based on domains, with de-centralized ownership of data across business specific data domains which are centrally managed and monitored. This organisational structure creates an ecosystem producing and consuming data which can scale out as the number of sources of data, the number of use cases, and the diversity of access models to the data, increases.
- **Data as a product:** A logical collection of data resources that enables data users to easily discover, understand and securely use high quality data.

Data products can be expanded to be classified as source-aligned, aggregated and consumer aligned, and templated to record the intent of each data product in a consistent way. Data products can then be discovered, accessed, consumed, managed and monitored against the agreed SLAs.

- **Self-serve data infrastructure as a platform:** Enables the domain teams to *create and consume data products autonomously* using Google Cloud Platform abstractions, hiding the complexity of building, executing and maintaining secure and interoperable data products.
- **Federated computational governance**

A standard set of tools and utilities for domain teams to leverage, along with standardised metadata elements and formats which the product teams will use during the build and management of each data product.

This approach can be visualised like so:

Press enter or click to view image in full size
![](<>)

Converting the simplistic approach above to a more architectural and functional view with aforementioned team personas mapped in order produces the following:

Press enter or click to view image in full size
![](<>)

However, an appropriate data mesh architecture depends heavily on the internal organisation of the teams. As alluded to before, there is no one size fits all solution, and a decision will therefore need to be made by organisations on how centralised and decentralised certain functions should be.

As an example, a fully decentralised architecture is presented here, including both source-oriented and consumer-oriented data products:

Press enter or click to view image in full size
![](<>)

Google Cloud has the necessary services and controls to enable organisation to deliver their required balance between centralisation and decentralisation, but to continue the fully decentralised theme, the following is an example implementation of the above diagram’s approach:

Press enter or click to view image in full size
![](<>)

Regardless of the amount of centralisation, the capabilities from the previous diagram are always required, and are shown here:

Press enter or click to view image in full size
![](<>)

A pure Google Cloud implementation of the above capabilities would look like this:

Press enter or click to view image in full size
![](<>)

Apart from the specialised services for ingesting, storing, processing and sharing data a key component in this architecture is **Dataplex**, which plays the role of the governance backbone enabling distributed data management, policy-as-code data quality, data classification, lifecycle management, metadata collection, data discovery and data interoperability between domains.

## Automation and Self-Service

To be truly effective, the previously described Google Cloud implementation needs to be as automated and self-service as possible, for data platform, data governance, data producer and data consumer teams.

With the aforementioned approach:

A data governance team can self-serve their own reporting needs, exploring access logging, control framework adherence, data lineage, management information etc. by owning their own

A data platform team could describe all of the necessary infrastructure building blocks in Terraform Infrastructure-as-Code templates, with CICD pipelines to deploy and configure all of the Google Cloud services needed to build a data product in an approved way.

A data producer team can then use these components as a factory to generate repeatable data products quickly and consistently, knowing that all security controls, observability, integration with governance etc. is automatically baked into the data product. A data consumer can quickly and easily discover, request access, and start to use data products without being required to interact with a data producer team, aside from perhaps an access approval workflow.

The goal with this approach is that organisations can reduce the amount of conversations and hand-offs between teams and thus reduce the implicit delays that such things incur, while still being able to provide teams with what they need in a well-governed manner.

An example self-service data platform approach can be visualised like so:

Press enter or click to view image in full size
![](<>)

## Common Services — Data Operations and Governance

Dataplex is the backbone of the data mesh implementation described above in Google Cloud.

Dataplex enables automated data discovery, metadata harvesting and enrichment of structured, semi-structured and unstructured data stored in Google Cloud and beyond, all without data movement, with Dataplex Data Catalog.

Dataplex also offers centralised security policies as code, monitoring and auditing for data authorisation, retention and classification to help answer questions such as ‘Who did what when?’.

Dataplex also enables automatic collection of lineage from BigQuery, Dataproc, VertexAI and other data processing services and stores, and the built-in AI-driven intelligence across data classification, data quality, data deduplication and lifecycle management helps to answer the question of ‘Who produced the data, what was the source and what transformations have been applied to the data since its inception?’.

In diagram form this looks like:

Press enter or click to view image in full size
![](<>)

## Common Services — Observability

The ability to understand, visualise and report upon data products is important to allow data product managers to gain valuable insight into the use of their products, for security teams to understand access control and user behaviour, and for business teams to generate management information.

Google Cloud provides capability in all of these areas, building upon the monitoring and auditing in Dataplex. In Dataplex, and across all Google Cloud services, Audit Logging provides information regarding admin activities, system changes, data access and data updates. This is used extensively within tons of Google Cloud customers already, and connects to security tooling across the estate for threat detection and forensic analysis.

As mentioned, Dataplex already provides information regarding auditing for data authorisation, and Dataplex will see greater improvements to its surfacing of logging and monitoring information. However, for Management or Business Information or other business driven processes, Organization business users may prefer the flexibility and ease-of-use of a Looker dashboard.

Dataplex and BigQuery audit logs can be sent to an aggregated sink and a Looker dashboard can be connected to that sink, enabling a data product manager, auditor or access control analyst to quickly see what datasets are being accessed when, and by whom.

Google has some BigQuery Audit Logging Views available on GitHub: <https://github.com/GoogleCloudPlatform/bigquery-utils/tree/master/views/audit>.

An example Looker dashboard could be an access report:

Press enter or click to view image in full size
![](<>)

Looker can also show pre-built reporting blocks for BigQuery performance, concurrency and throughput, and cost.

For example, a Looker dashboard for usage trends, spend trends, chargeback per project and job performance can help a data product manager to understand cost to performance for their consumers:

Press enter or click to view image in full size
![](<>)

Looker can also receive data from other Google services like Analytics Hub or Apigee.

For example, Analytics Hub has usage metrics for shared data, allowing data product managers to track how subscribers are using datasets. And sending Apigee’s analytics to Looker will create visualisations of API usage.

By combining different data sources into Looker dashboards, Organizations could create highly customisable, self-serve reporting on their data product ecosystem that would help to demonstrate data points such as:

- The percentage of automatically generated vs. manually input metadata
- The percentage of data at each level of data confidentiality classification
- Who, what and when data is being accessed
- How is data being accessed
- Which transformations data has been through
- The quality [ accuracy, completeness, consistency and freshness ] of data
- The percentage of adherence to data governance controls
- Cost vs. performance for data

These reports can be in near real-time or on a schedule. For example, an auditor or access control analyst may wish to see who could access a dataset today and also see who has accessed the data in the past month.

## Common Frameworks — Data Governance

Data Governance is key to a successful data project and adoption. It is a broad term concerning security and sensitive data management, but also how to ensure end users understand what data is available in the business and how they could request access to it. For Data Governance, Dataplex is the unified governance layer on top of your data platform on Google Cloud.

A proper data governance model often requires:

- Fostering a collaboration between IT, data and business teams
- Building a framework that enables every stakeholder to address his need with a good level of autonomy, while adhering to the best practices defined by the IT department
- Enabling self-service analytics and fast time-to-insights
- Implementing best practices in terms of security, DevOps/DataOps, compliance and regulations
- Enabling data science teams to quickly build and deliver production-grade models

However setting up a proper data governance model at scale is not trivial. Traditional approaches, consisting of relying on a central data team to handle most of the data life cycle, from data collection, data transformation, data quality and data security, up to the business KPIs definition have failed to scale and deliver the expected outcomes in most organisations, as depicted in the illustration below:

Press enter or click to view image in full size
![](<>)

Most of the challenges mentioned here often come from the level of autonomy given to the business teams and the ownership model for the different steps of the data life cycle.

Returning to the key expectations that organisations have given, some of the challenges can be described as:

- Enabling other directions to be fully autonomous to analyse data and build reports
- Enabling a self-service analytics experience for the business team while keeping a strong governance model
- Be able to have a clear readability of the data lineage
- Be able to properly secure data at large scale
- Deploy AI/ML models in production with technology good practices

Google’s approach to set up a rigorous data governance model is to partner with the bank to help in defining the best architecture and strategy to make organisations data accessible, usable and secure with a good level of collaboration between the different stakeholders.

And this requires something new, as depicted in the diagram below:

Press enter or click to view image in full size
![](<>)

In this model, the aforementioned Data Mesh paradigm is relied upon to empower each business team with ownership of their respective data domains, thus meaning that they are responsible for:

- Defining the business KPIs that are most useful for them
- Ensuring proper data quality for the data assets they rely on to define their KPIs
- Clearly defining the scope and data access policies for the business objects created within their perimeter

The central organisations Google Cloud team, technology platform teams and data platform teams in this model are responsible for core tasks such as:

- Building and maintaining the data pipelines
- Implementing the data access policies
- FinOps
- Defining the best DevOps and DataOps practices

In Google Cloud Dataplex that new data governance model can be implemented like so:

Press enter or click to view image in full size
![](<>)

## Common Frameworks — Data quality

Dataplex comes with an out of the box data quality framework integrated with BigQuery and BigLake for executing data quality rules and with BigQuery to store the outcome of the data quality checks together with the SQL to identify non-compliant data.

Storing the outcome in BigQuery allows the integration with Looker and other reporting tools to build dashboards for data quality monitoring, like so:

Press enter or click to view image in full size
![](<>)

## Common Frameworks — Ingestion Patterns

Through building ingestion frameworks and patterns the data platform team can introduce standardisation across different data product teams on how to ingest data depending on type and speed of data ingested.

In addition, company wide standards for logging and monitoring, collection of telemetry metrics will be part of the framework / patterns which will bring consistency across all data products.

Google Cloud Platform has key services and integrations which can be used in ingestion frameworks and patterns to accelerate data load in BigQuery for both file ingestion and streaming.

There are 2 storage services which are a key differentiator for Google in this area:

- [BigLake](https://cloud.google.com/biglake) — storage engine that unifies data warehouses and lakes, by providing uniform fine-grained access control, performance acceleration across multi-cloud storage and open formats. BigLake is integrated with Dataplex and data in buckets can be automatically registered in BigQuery for analytics without additional load routine. An example of an ingestion pattern in BigQuery of batch data is below.

Press enter or click to view image in full size
![](<>)

- [BigQuery Storage API](https://cloud.google.com/bigquery/docs/write-api#write-api-overviewreaming) — The BigQuery Storage Write API is a unified data-ingestion API for BigQuery. It combines streaming ingestion and batch loading into a single high-performance API. The Storage Write API can be used to stream records into BigQuery in real time or to batch process an arbitrarily large number of records and commit them in a single atomic operation. The write API is integrated with Datastream for applying changes to BigQuery tables in an automated, CICD way.

There are many options for designing ingestion patterns, including Datastream, Pub/Sub and more, and the right approach can be chosen only by looking at concrete use cases and the non-functional requirements that organisations has.

## A Data Product Approach within a Data Mesh

So far this document has described how to build a Data Mesh on Google Cloud, and now the concept of a Data Product itself can be explored.

The architecture of a data product can be conceptualised as:

Press enter or click to view image in full size
![](<>)

**Analytics Hub**

[Analytics Hub](https://cloud.google.com/analytics-hub) is Google’s secure data exchange that can allow organisations to curate a library of internal and external data assets backed by the power of BigQuery.

With Analytics Hub, organisations can act as both a data subscriber and publisher, for internal and external data.

Analytics Hub breaks down data into three classifications; Public, Private, and Organisational.

As a subscriber to external data, either public or private, organisations are able to consume external datasets such as ESG data from Morningstar. Google is expanding the number of curated datasets and is keen to partner with organisations in this area to ensure the right data providers are available.

Organisational data allows for organisations to share large datasets internally without moving the data. For example, organisations could combine datasets into a single dataset and publish it within the organisation to be consumed internally.

As a publisher, either internally or externally, organisations can list the data product manager’s contact details, the category of data, and other documentation to aid in consumption of the dataset — information which is then visible to potential consumers. Dataset egress can also be restricted to prevent copying and export of shared data and / or query results.

Sharing data often makes people consider data sovereignty and legislation like GDPR. To meet such requirements an Analytics Hub data exchange can be created for a specific region and can contain BigQuery objects available only in that region.

The datasets being shared are BigQuery datasets, and listings can be any of the following types of objects:

Authorised Views, Authorised Datasets, BigQuery ML models, External Tables, Materialised Views, Tables, Table Snapshots and Views.

Note that shared datasets maintain support for row-level and column-level security.

## Dataset Discoverability

As with API products, datasets in Analytics Hub first need to be discovered before they can be consumed. This is possible using the Google Cloud Console and API. When searching for datasets, filters can be applied to find the relevant category, data classification or provider.

Potential consumers can peruse the dataset’s documentation, such as licensing, that the publisher has provided and decide if the dataset is suitable for their needs.

In the future, in-built access and approval workflows should provide a more controlled way for subscribers to discover and register for dataset usage.

The exchange metadata can be integrated in Dataplex as product tag and the information regarding the exchange and the link to the exchange can be available as part of the product information.

## Dataset Reporting

Usage metrics in Analytics Hub allow publishers the ability to visualise aggregated usage, jobs that are running against a shared dataset and other consumption details. Sending these data points to Looker could make it simpler to visualise all data related to the data product in a single pane of glass. The idea of bundling analytics is currently on the roadmap, which is always subject to change, but when delivered should provide a more out of the box integration with Looker.

## Looker Semantic Layer

[Looker](https://cloud.google.com/looker) is Google Cloud’s enterprise platform for business intelligence, data applications, and embedded analytics. Looker’s semantic modelling layer enables enterprises to standardise business logic across the organisation.

In the context of data mesh and data product organisation, Looker ML plays an important role as it abstracts the physical location of the data assets in multiple data products and presents a complete view of data managed in different data products for BI. The semantic layer built in LookerML can be accessed for building visualisations from Looker, Tableau, Power BI and other BI tools.

An illustration of a data mesh architecture on GCP with Looker Semantic Layer:

Press enter or click to view image in full size
![](<>)

Using Looker ML, data analysts can create in a governed and secured way additional metrics and KPIs based on the raw data shared through the data products and further use them in creating visualisations in a BI tool: Looker, Tableau or Power BI through the available connectors.

In terms of consumers of the looker semantic layer, Looker Semantic Layer supports 1st party tools like Looker and Google Sheets and 3rd party tools like Tableau and Power BI along with other exciting features on the roadmap regarding JDBC connection, Open API framework and Open SQL Interface.

In conclusion, Google’s Lakehouse architecture empowers organizations to embrace a “data as a product” philosophy. By combining the strengths of data lakes and warehouses, it provides a unified platform for storing, processing, and accessing all data, regardless of its structure or format. This enables efficient data sharing, self-service analytics, and collaboration across different business domains. For more detailed info on Google Data Lakehouse, please refer Google [Lakehouse](https://cloud.google.com/discover/what-is-a-data-lakehouse?e=48754805&hl=en) resources.

Data Governance

Data Governance Framework

Lakehouse Architecture

Data Quality Management

Data Product Creation

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fgoogle-cloud%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---footer_actions--df5c5f4cc07e---------------------clap_footer------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fgoogle-cloud%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---footer_actions--df5c5f4cc07e---------------------clap_footer------------------)

--

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fgoogle-cloud%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---footer_actions--df5c5f4cc07e---------------------clap_footer------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fgoogle-cloud%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---footer_actions--df5c5f4cc07e---------------------clap_footer------------------)

--

1

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Frepost%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---footer_actions--df5c5f4cc07e---------------------repost_footer------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Frepost%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&user=Jitendra+Yadav&userId=a00fbad32834&source=---footer_actions--df5c5f4cc07e---------------------repost_footer------------------)

[/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=---footer_actions--df5c5f4cc07e---------------------bookmark_footer------------------](/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fdf5c5f4cc07e&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fgoogle-cloud%2Fimplementing-data-products-on-google-data-lakehouse-architecture-df5c5f4cc07e&source=---footer_actions--df5c5f4cc07e---------------------bookmark_footer------------------)

[Google Cloud - Community](https://medium.com/google-cloud?source=post_page---post_publication_info--df5c5f4cc07e---------------------------------------)

[Google Cloud - Community](https://medium.com/google-cloud?source=post_page---post_publication_info--df5c5f4cc07e---------------------------------------)

## [Published in Google Cloud - Community](https://medium.com/google-cloud?source=post_page---post_publication_info--df5c5f4cc07e---------------------------------------)

[77K followers](/google-cloud/followers?source=post_page---post_publication_info--df5c5f4cc07e---------------------------------------)

·[Last published 20 hours ago](/google-cloud/summary-where-does-antigravity-look-for-configurations-309f88165e40?source=post_page---post_publication_info--df5c5f4cc07e---------------------------------------)

A collection of technical articles and blogs published or curated by Google Cloud Developer Advocates. The views expressed are those of the authors and don't necessarily reflect those of Google.

[Jitendra Yadav](/@jitendrayadav_43136?source=post_page---post_author_info--df5c5f4cc07e---------------------------------------)

[Jitendra Yadav](/@jitendrayadav_43136?source=post_page---post_author_info--df5c5f4cc07e---------------------------------------)

## [Written by Jitendra Yadav](/@jitendrayadav_43136?source=post_page---post_author_info--df5c5f4cc07e---------------------------------------)

[38 followers](/@jitendrayadav_43136/followers?source=post_page---post_author_info--df5c5f4cc07e---------------------------------------)

·[2 following](/@jitendrayadav_43136/following?source=post_page---post_author_info--df5c5f4cc07e---------------------------------------)

Data Analytics Specialist

[Help](https://help.medium.com/hc/en-us?source=post_page-----df5c5f4cc07e---------------------------------------)

[Status](https://status.medium.com/?source=post_page-----df5c5f4cc07e---------------------------------------)

[About](/about?autoplay=1&source=post_page-----df5c5f4cc07e---------------------------------------)

[Careers](/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----df5c5f4cc07e---------------------------------------)

[Press](mailto:pressinquiries@medium.com)

[Blog](https://blog.medium.com/?source=post_page-----df5c5f4cc07e---------------------------------------)

[Store](https://medium.com/store)

[Privacy](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----df5c5f4cc07e---------------------------------------)

[Rules](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----df5c5f4cc07e---------------------------------------)

[Terms](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----df5c5f4cc07e---------------------------------------)

[Text to speech](https://speechify.com/medium?source=post_page-----df5c5f4cc07e---------------------------------------)
