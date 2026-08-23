---
type: 'vendor'
title: 'Overview'
source_url: 'https://docs.aws.amazon.com/solutions/retail-and-commerce-media-monetization-on-aws/'
vendor: ['aws']
industry: ['retail', 'media_agency']
data_stack: []
cloud: ['aws']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

# Guidance for Retail and Commerce Media Monetization on AWS

## Overview

This Guidance illustrates how retailers can setup a Media Insights platform that serves as a central hub for the retailer’s commerce and media monetization using their data and analytics. Traditionally, retailers have faced challenges when wanting to fully capitalize on the value of their first-party data and online audience. They often lack the integrated data platforms, advanced analytics including generative AI capabilities, and secure data collaboration mechanisms to optimize their media monetization efforts. The Media Insights platform addresses those challenges, offering retailers a central location to transform their first-party data into a strategic asset. By using this platform, retailers can optimize their media monetization efforts and generate increased revenue through their existing channels.

## How it works

Overview

This architecture diagram provides an overview of how retailers, acting as publishers, can better monetize their online audience with a Retail Media Insights platform.

[Download the architecture diagram](https://d1.awsstatic.com/solutions/guidance/architecture-diagrams/retail-and-commerce-media-monetization-on-aws-guidance.pdf) ![Overview](/images/solutions/retail-and-commerce-media-monetization-on-aws/images/retail-and-commerce-media-monetization-on-aws-1.png) Step 1

The retailer builds a Retail Media Insights platform on AWS that unifies their first-party data and enables advanced analytics capabilities, including artificial intelligence and machine learning (AI/ML), as well as generative AI. This platform allows the retailer to perform audience queries and measurement analysis using natural language interfaces.

Step 2

The retailer enables a data collaboration environment using data clean room technology. This allows advertising agencies and brands to collaborate in a privacy-enhanced manner, gathering insights about audiences and evaluating return on investment prior to campaign initiation (media planning). The advertising agencies support this data collaboration during the media planning phase and in executing campaigns for the brands.

Step 3

In the Ad Platform workflow, the retailer sends ad or bid requests enriched with their first-party data to a server-side platform (SSP) and/or demand-side platform (DSP). The DSPs then bid on behalf of their advertising brand and agency customers.

Step 4

The retailer receives the bid requests and conducts an auction, either through their own ad tech stack using a pre-bid server or through a partner SSP. The winning bid request is then further processed by the SSP/DSP, and the advertisement is ultimately served through the ad servers.

Step 5

The retailer and advertising agencies or brands engage in data collaboration using data clean room technology for post-campaign measurement. This is done in a privacy-enhanced manner, without the parties sharing any underlying sensitive data with one another.

Key components and workflows

This architecture diagram outlines the key components and workflows involved in enabling retailers to monetize their online audience through the Retail Media Insights platform.

[Download the architecture diagram](https://d1.awsstatic.com/solutions/guidance/architecture-diagrams/retail-and-commerce-media-monetization-on-aws-guidance.pdf#page=2) ![Key components and workflows](/images/solutions/retail-and-commerce-media-monetization-on-aws/images/retail-and-commerce-media-monetization-on-aws-2.png) Step 1

The retailer's first-party data platform contains customer profiles, interactions, and transactions, along with product inventory and media inventory.

Step 2

The retailer's Retail Media Insights platform includes modules for data ingestion, audience building, campaign analysis, and data collaboration for media planning and measurement. The platform supports enabling a web-based user interface for agencies and internal users to manage and operate the system.

Step 3

The retailer configures the data collaboration module for media planning. In this collaboration, the first-party data from the advertiser, stored in Amazon Simple Storage Service (Amazon S3), is linked with the retailer's data using AWS Entity Resolution and AWS Clean Rooms, and then onboarded into the Ad Serving Module.

Step 4

The data ingestion and audience building process uses AWS Glue extract, transform, and load (ETL) jobs that consume the output from the AWS Entity Resolution workflow, generating unified consumer profile data tables for campaign audience building. The customer data processing between AWS Entity Resolution and AWS Glue is orchestrated by an AWS Step Functions workflow. Additionally, Amazon SageMaker ML models, trained and hosted on the platform, are employed in the audience building process.

Step 5

The Campaign Analysis Module supports functions such as campaign performance and optimization, creative performance and optimization, programmatic invoicing, and customer-facing reporting. Metrics like impressions and clicks are delivered to Amazon S3 from the Ad Serving Module. This output is then consolidated and queried using Amazon Athena or loaded into Amazon Redshift, and visualized using Amazon QuickSight. Additionally, the platform uses generative AI models hosted on Amazon Bedrock to automate various activities, such as creative and campaign optimization. For example, multimodal large language models (LLMs) are used to extract rich metadata about each creative, which is then analyzed to identify the common attributes of effective creatives. This information is then used to create or transform new creatives for future campaigns. Furthermore, Amazon Q is used to summarize information and provide natural language querying capabilities on the campaign data.

Step 6

The retailer configures the data collaboration module for measurement, linking the first-party data between the advertiser, stored in Amazon S3, and the retailer using AWS Entity Resolution. This linked data is then onboarded to the ad platforms using AWS Clean Rooms, enabling the retailer and the advertiser to easily and securely analyze and collaborate on their collective datasets without sharing or copying each other's underlying data.

Step 7

AWS Lake Formation defines granular access controls on the AWS Glue Data Catalog tables within the data lake. Additionally, AWS Identity and Access Management (IAM) is used to securely manage identities and access to AWS services and resources.

Step 8

The retailer's ad serving infrastructure enriches the ad request with contextual data obtained from the data platform. Using Partner Solutions, the ad request is then sent to the programmatic advertising supply chain through SSP partners or direct integrations with DSPs, facilitated by a pre-bid server.

Step 9

The retailer's ad platform publishes advertisements within their digital display devices and applications, enabling media monetization.

## Well-Architected Pillars

The architecture diagram above is an example of a Solution created with Well-Architected best practices in mind. To be fully Well-Architected, you should follow as many Well-Architected best practices as possible.

**Operational Excellence**

This Guidance uses Amazon Bedrock and SageMaker to enhance machine learning operations (MLOps) and streamline the ML lifecycle. It also uses AWS Clean Rooms and AWS Entity Resolution to protect the privacy of retailers, advertising agencies, and brands. These AWS services provide robust features for managing ML workflows and safeguarding sensitive data throughout the process.

[Read the Operational Excellence whitepaper](/wellarchitected/latest/operational-excellence-pillar/welcome.html)

**Security**

IAM securely manages identities and access to AWS services and resources for both the retailer and the Retail Media Insights platform. It helps ensure the creation of policies with minimum required permissions, limiting unauthorized access to resources. Lake Formation complements this by managing permissions during data sharing and improving data lake setup and security. This is particularly beneficial for the data analytics and business intelligence layer of this Guidance. Together, these services provide a robust security framework, protecting sensitive data and resources.

[Read the Security whitepaper](/wellarchitected/latest/security-pillar/welcome.html)

**Reliability**

Step Functions orchestrates the data flow within the architecture by monitoring AWS Entity Resolution workflows and making API calls to Amazon Bedrock. This visual workflow service helps developers build distributed applications, automate processes, orchestrate microservices, and create data and ML pipelines using AWS services. Step Functions maintains service capacity across multiple Availability Zones, enhancing reliability. It performs API calls using scheduled or event-based triggers, allowing for automatic retries in case of failures and scalable concurrent execution. This capability helps ensure robust and efficient workflow management, even in complex scenarios involving multiple AWS services.

[Read the Reliability whitepaper](/wellarchitected/latest/reliability-pillar/welcome.html)

**Performance Efficiency**

Amazon Bedrock and AWS Entity Resolution are fully managed services that enable businesses to focus on innovation while reducing the complexity of managing underlying resources. Specifically, Amazon Bedrock allows users to invoke LLMs through API calls for near real-time results. AWS Entity Resolution offers flexible record matching using either rule-based or ML models, with on-demand or automatic processing options. These services work in tandem to streamline data processing and analysis tasks. By handling the technical intricacies, they allow retailers to concentrate on their core objectives and use advanced AI and data matching capabilities without the burden of infrastructure management.

[Read the Performance Efficiency whitepaper](/wellarchitected/latest/performance-efficiency-pillar/welcome.html)

**Cost Optimization**

This architecture uses several AWS services to optimize costs and improve efficiency. For example, the Amazon S3 buckets for the campaigns analytics module use Amazon S3 Intelligent-Tiering storage class, which automatically moves data between access tiers based on usage patterns, reducing storage costs. Regular reviews of QuickSight author and reader account activity help identify and remove inactive accounts, potentially decreasing the number of required QuickSight subscriptions. Amazon Q, integrated with AWS Cost Explorer, offers a cost analysis feature that supports natural language processing for cost-related queries. This allows users to obtain cost information through simple, natural language questions rather than relying on traditional computing for cost calculations. By implementing these features, retailers can significantly reduce data storage costs, optimize QuickSight license usage, and streamline cost analysis processes.

[Read the Cost Optimization whitepaper](/wellarchitected/latest/cost-optimization-pillar/welcome.html)

**Sustainability**

The query reuse feature of Athena enhances efficiency and reduces costs when working with large datasets. This feature allows for the reuse of query results, eliminating the need to execute redundant SQL queries within a specified time frame. By caching and reusing results for identical queries, Athena significantly reduces the usage of compute resources. This optimization not only speeds up subsequent queries but also lowers costs associated with repeated data processing. Implementing query reuse is particularly beneficial for scenarios where multiple users or applications frequently run the same queries on large, relatively static datasets. By using this feature, retailers can improve query performance, reduce computational overhead, and optimize their Athena usage costs.

[Read the Sustainability whitepaper](/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html)

[Read usage guidelines](/solutions/guidance-disclaimers/)
