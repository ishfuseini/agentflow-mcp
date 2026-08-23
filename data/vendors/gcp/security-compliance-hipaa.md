---
type: 'vendor'
title: 'HIPAA Compliance on Google Cloud'
source_url: 'https://cloud.google.com/security/compliance/hipaa'
vendor: ['gcp']
industry: ['healthcare']
data_stack: []
cloud: ['gcp']
constraints: ['HIPAA']
compliance: ['hipaa']
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[Skip to main content](#main-content)

[![Google Cloud](https://www.gstatic.com/devrel-devsite/prod/v8c5e9c8e09d4f0c961905721a95aa2027138cb55ec6e1fa60fd7aaa3726ca05f/cloud/images/cloud-logo.svg)](/)

[Docs](https://cloud.google.com/docs) [Support](https://cloud.google.com/support-hub)

- English
- Deutsch
- Español – América Latina
- Français
- Português – Brasil
- 中文 – 简体
- 日本語
- 한국어
[Console](//console.cloud.google.com/) Sign in

- [GCP Security](https://cloud.google.com/security)

[Contact Us](https://cloud.google.com/contact) [Start free](//console.cloud.google.com/freetrial)

- [Home](https://cloud.google.com/)
- [GCP Security](https://cloud.google.com/security)

# HIPAA Compliance on Google Cloud

*This guide covers HIPAA compliance on Google Cloud. [HIPAA compliance for Google Workspace](https://support.google.com/a/answer/3407054) is covered separately.*

### Disclaimer

This guide is for informational purposes only. Google does not intend the information or recommendations in this guide to constitute legal advice. Each customer is responsible for independently evaluating its own particular use of the services as appropriate to support its legal compliance obligations.

### Intended Audience

For customers who are subject to the requirements of HIPAA. This guide is intended for security officers, compliance officers, IT administrators, and other employees who are responsible for HIPAA implementation and compliance on Google Cloud. After reading this guide, you will understand how Google is able to support HIPAA compliance as well as understand how to configure Google Cloud Projects to help meet your responsibilities under HIPAA.

### Definitions

Any capitalized terms used but not otherwise defined in this document have the same meaning as in [HIPAA](https://www.hhs.gov/hipaa/for-professionals/index.html). Furthermore, for the purposes of this document, Protected Health Information (PHI) means the PHI Google receives from a Covered Entity.

### Overview

**It is important to note that there is no certification recognized by the US HHS for HIPAA compliance and that complying with HIPAA is a shared responsibility between the customer and Google.** Specifically, HIPAA demands compliance with the [Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html), the [Privacy Rule](https://www.hhs.gov/hipaa/for-professionals/privacy/index.html), and the [Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html). Google Cloud supports HIPAA compliance (within the scope of a Business Associate Agreement) but ultimately customers are responsible for evaluating their own HIPAA compliance.

Google will enter into Business Associate Agreements with customers as necessary under HIPAA. Specific details on our approach to security and data protection including details on organizational and technical controls regarding how Google protects your data, can be found in the [Google Security Whitepaper](/security/whitepaper) and [Google Infrastructure Security Design Overview](/security/security-design).

### Customer Responsibilities

One of the key responsibilities for a customer is to determine whether or not they are a Covered Entity (or a Business Associate of a Covered Entity) and, if so, whether they require a Business Associate Agreement with Google for the purposes of their interactions.

While Google provides a secure and compliant infrastructure for the storage and processing of PHI, the customer is responsible for ensuring that the environment and applications that they build on top of Google Cloud are properly configured and secured according to HIPAA requirements. [Shared Fate on Google Cloud](https://cloud.google.com/security/shared-responsibility-shared-fate)

Essential best practices:

- Execute a Google Cloud BAA. You can follow the instructions in the [Privacy compliance and records for Google Cloud](https://support.google.com/cloud/answer/6329727) to review and accept the BAA.
- [Disable](https://docs.cloud.google.com/service-usage/docs/enable-disable#disabling) or otherwise ensure that you do not use Google Cloud Products that are not explicitly covered by the BAA (see [Covered Products](#covered-products)) when working with PHI.
- Do not use Pre-GA offerings (products or services offered under the Google Cloud Pre-General Availability Program or other pre-GA offerings as defined in Google's [Service Specific Terms](https://cloud.google.com/terms/service-terms)) in connection with PHI, unless expressly noted otherwise in a notice or other terms of the offering.

Recommended technical best practices:

- Use [IAM best practices](/iam/docs/using-iam-securely) when configuring who has access to your project. In particular, because service accounts can be used to access resources, ensure access to those service accounts and service account keys is tightly controlled.
- Determine whether your organization has encryption requirements beyond what is required by the HIPAA security rule. All customer content is encrypted at rest on Google Cloud, see our [encryption white paper](/security/encryption/default-encryption) for further details and any exceptions.
- If you use Cloud Storage, consider enabling [Object Versioning](/storage/docs/object-versioning). This preserves historical archives and allows you to recover objects in the event of accidental deletion.
- Configure audit log [export](/logging/docs/export/configure_export_v2) destinations. We strongly encourage exporting audit logs to Cloud Storage for long term archival as well as to BigQuery for any analytical, monitoring, and/or forensic needs. Be sure to configure access control for those destinations appropriate to your organization.
- Configure [access control](/logging/docs/access-control) for the logs appropriate to your organization. Admin Activity audit logs can be accessed by users with the Logs Viewer role and Data Access audit logs can be accessed by users with the Private Logs Viewer role.
- Regularly review audit logs to ensure security and compliance with requirements. As noted above, BigQuery is an excellent platform for large scale log analysis. You may also consider leveraging [SIEM platforms](https://cloud.google.com/discover/what-is-siem) to demonstrate compliance through log analysis.
- When creating or configuring indexes in Cloud Datastore, encrypt any PHI, security credentials, or other sensitive data, before using it as the entity key, indexed property key, or indexed property value for the index. See the [Cloud Datastore documentation](/datastore/docs/concepts/indexes) for information on creating and/or configuring indexes.
- When creating or updating [Conversational Agents](/dialogflow/docs) agents, be sure to avoid including PHI or security credentials anywhere in your agent definition, including Intents, Training Phrases and Entities.
- When creating or updating resources, be sure to avoid including PHI or security credentials when specifying a resource’s metadata as that information may be captured in the logs. Audit logs never include the data contents of a resource or the results of a query in the logs, but resource metadata may be captured.
- Use [Identity Platform practices](/security/compliance/hipaa/identity-platform) when using Identity Platform for your project.
- When using Cloud Build services for continuous integration or development, avoid including or storing PHI within build config files, source control files, or other build artifacts.
- If you are using Looker (Google Cloud core), individuals designated by Customer to administer the instances or resources should review the security configurations for third-party applications and integrations as well as any corresponding security and privacy documentation provided by the third-party application.
- If you are using Looker (Google Cloud core) to structure queries, avoid including or storing PHI in the business logic used to configure such queries. See the Documentation for information on structuring queries.
- If you use Cloud CDN, ensure that you do not request caching of PHI. See the [Cloud CDN documentation](/cdn/docs/caching#preventing-caching) for information on how to prevent caching.
- If you are using Cloud Speech-to-Text, and you have entered into a BAA with Google covering any PHI obligations under HIPAA, then you should not opt into the [data logging](https://cloud.google.com/speech-to-text/docs/data-logging) program.
- If you are using Google Cloud VMware Engine, it is your responsibility to retain the application level access logs for an appropriate period as needed to meet the HIPAA requirements.
- When configuring Sensitive Data Protection jobs, ensure that any output data is written to storage targets that are configured as part of your secure environment.
- Review and follow guidance provided by [Secret Manager Best Practices](/secret-manager/docs/best-practices) when storing secrets in Secret Manager.
- Artifact Registry encrypts data in repositories using either Google default encryption or [customer-managed encryption keys](/artifact-registry/docs/cmek) (CMEK). Metadata, such as artifact names, is encrypted with Google default encryption. This metadata could appear in logs and is visible to any user with permissions in the Artifact Registry Reader role or Viewer role. Follow guidance in [Securing artifacts](/artifact-registry/docs/docker/container-best-practices) to help prevent unauthorized access to PHI.
- Container Registry encrypts data in the storage buckets of your registries using either Google default encryption or [CMEK](/container-registry/docs/using-encryption-keys). Follow [best practices for containers](/container-registry/docs/container-best-practices) to help prevent unauthorized access to PHI.
- If you are using [Filestore](/filestore), use [IP based access control](/filestore/docs/access-control#ip-based_access_control) to restrict which Compute Engine VMs and GKE Clusters can access the Filestore instance. Consider using [backups](/filestore/docs/backup-restore) to allow data recovery in the case of accidental data deletion.
- If you use Cloud Monitoring, do not store PHI in metadata in Google Cloud, including metric labels, VM labels, GKE resource annotations, or dashboard titles/content; anyone authorized through IAM to view your monitoring console or use the Cloud Monitoring API could see this data. Do not place PHI in Alerting configurations (e.g., display name or documentation) which could be sent to alert recipients.
- When using Google Cloud Fraud Defense, avoid including PHI in URIs or actions.
- If you are using API Gateway, headers should not have any PHI or PII information.
- For Database Migration Service, use Private IP connectivity methods, in order to avoid needing to expose a database containing PHI to the Internet.
- If you are using Knowledge Catalog, values of the `google.cloud.datacatalog.lineage.v1.Process.attributes` and `google.cloud.datacatalog.lineage.v1.Run.attributes` fields should not have any PHI or PII.
- When using Agent Search on Gemini Enterprise Agent Platform, use regional APIs and resource locations for PHI.
- When using [Application Integration](https://cloud.google.com/application-integration/docs/overview) and [Integration Connectors](https://cloud.google.com/integration-connectors/docs/overview), don't include any PII, PHI, or other sensitive information in the Integration Parameter, Connection Name or Connection Configuration, because this information can get logged. Configure [access control](https://cloud.google.com/logging/docs/access-control) for logs if the requested payload contains sensitive data. Some file-based connectors and webhook-based events that are offered by Integration Connectors store the data transiently. Customers are given the control of encrypting this data with a key of their choice using CMEK.
- When deploying [Google Distributed Cloud Connected](https://cloud.google.com/distributed-cloud/docs), customers bear the responsibility for certain security aspects, particularly physical security. To ensure the security of your GDC deployment, you must understand the security responsibilities outlined on the [Security Best Practices](https://cloud.google.com/distributed-cloud/edge/1.6.1/docs/security#physical) page.

### Covered Products

The [Google Cloud BAA](https://cloud.google.com/terms/hipaa-baa) covers Google Cloud's entire infrastructure (all regions, all zones, all network paths, all points of presence), and the following products:

- Access Approval
- Access Context Manager
- Access Transparency
- Agent Search on Gemini Enterprise Agent Platform
- AI Platform Training and Prediction
- AlloyDB for PostgreSQL
- API Gateway
- Apigee
- App Engine
- Application Integration
- Artifact Analysis
- Artifact Registry
- Assured Workloads
- AutoML Natural Language
- AutoML Tables
- AutoML Translation
- AutoML Video
- AutoML Vision
- Backup and DR Service
- Backup for GKE
- Bare Metal Solution
- Batch
- BigQuery
- BigQuery Data Transfer Service
- BigQuery Omni
- Bigtable
- Binary Authorization
- Certificate Authority Service
- Certificate Manager
- Cloud Asset Inventory
- Cloud Build
- Cloud CDN
- Cloud Data Fusion
- Cloud Deploy
- Cloud Deployment Manager
- Cloud DNS
- Cloud Endpoints
- Cloud Healthcare API
- Cloud HSM (Hardware Security Module)
- Cloud Identity
- Cloud IDS
- Cloud Interconnect
- Cloud KMS
- Cloud Life Sciences
- Cloud Load Balancing
- Cloud Logging
- Cloud Monitoring
- Cloud NAT
- Cloud Natural Language API
- Cloud Profiler
- Cloud Router
- Cloud Run
- Cloud Run functions
- Cloud Scheduler
- Cloud Shell
- Cloud Source Repositories
- Cloud SQL
- Cloud Storage
- Cloud Tasks
- Cloud Trace
- Cloud Translation
- Cloud Vision
- Cloud VPN
- Cluster Director
- Colab Enterprise
- Compute Engine
- Connect
- Contact Center AI Agent Assist
- Contact Center AI Platform
- Container Registry
- Conversational Agents
- Customer Experience Agent Studio
- CX Insights
- Cyber Insurance Hub
- Data Catalog
- Data Studio*
- Database Migration Service
- Dataflow
- Dataform
- Datastore
- Datastream
- Document AI
- Document AI Warehouse
- Eventarc
- Filestore
- Firestore
- Gemini Code Assist
- Gemini Enterprise
- Gemini Enterprise Agent Platform
- Gemini Enterprise for Customer Experience (GECX)
- Gemini in BigQuery
- Gemini in Colab Enterprise
- Gemini Notebook Enterprise
- Generative AI on Gemini Enterprise Agent Platform
- GKE Enterprise Config Management
- GKE Hub
- Google Cloud Armor
- Google Cloud console
- Google Cloud Fraud Defense
- Google Cloud Identity-Aware Proxy
- Google Cloud Managed Lustre
- Google Cloud Managed Service for Apache Kafka
- Google Cloud NetApp Volumes
- Google Cloud VMware Engine (GCVE)
- Google Distributed Cloud connected
- Google Kubernetes Engine
- Healthcare Data Engine
- Looker (Google Cloud core)
- Identity & Access Management (IAM)
- Identity Platform
- Infrastructure Manager
- Integration Connectors
- Key Access Justifications (KAJ)
- Knative serving
- Knowledge Catalog
- Managed Service for Apache Airflow
- Managed Service for Apache Spark
- Managed Service for Microsoft Active Directory (AD)
- Memorystore
- Model Armor
- Network Connectivity Center
- Network Service Tiers
- Persistent Disk
- Pub/Sub
- Resource Manager API
- Secret Manager
- Secure Source Manager
- Security Command Center
- Sensitive Data Protection
- Service Directory
- Service Mesh
- Spanner
- Speech-to-Text
- Storage Transfer Service
- Text-to-Speech
- Traffic Director
- Transfer Appliance
- Video Intelligence API
- Virtual Private Cloud
- VPC Service Controls
- Web Security Scanner
- Vertex AI Workbench instances
- Workflows

* Provided that Customer has opted to have Data Studio governed under their Google Cloud Agreement.

This list is updated as new products become available to the HIPAA program.

### Unique Features

Google Cloud's security practices allow us to have a HIPAA BAA covering Google Cloud's entire infrastructure, not a set aside portion of our cloud. As a result, you are not restricted to a specific region which has scalability, operational and architectural benefits. You can also benefit from multi-regional service redundancy as well as the ability to use [Preemptible VMs](/preemptible-vms) to reduce costs.

The security and compliance measures that allow us to support HIPAA compliance are deeply ingrained in our infrastructure, security design, and products. As such, we can offer HIPAA regulated customers the same products at the **same pricing** that is available to all customers, including sustained use discounts. Other public clouds charge more money for their HIPAA cloud, we do not.

### Conclusion

Google Cloud is the cloud infrastructure where customers can securely store, analyze and gain insights from health information, without having to worry about the underlying infrastructure.

### Additional Resources

- [Google Security Whitepaper](/security/whitepaper)
- [Google Infrastructure Security Design Overview](/security/security-design)
- [HIPAA Government Website](https://www.hhs.gov/hipaa/)
- [HHS Guidance on HIPAA compliance and Cloud Computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/cloud-computing/index.html)

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-08-11 UTC.
