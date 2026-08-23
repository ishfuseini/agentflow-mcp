---
type: 'vendor'
title: 'Generative AI use case: Generate personalized product recommendations'
source_url: 'https://docs.cloud.google.com/architecture/genai-product-recommendations'
vendor: ['gcp']
industry: ['retail']
data_stack: []
cloud: ['gcp']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[Skip to main content](#main-content)

[/](/)

[Console](//console.cloud.google.com/)

- English
- Deutsch
- Español
- Español – América Latina
- Français
- Indonesia
- Italiano
- Português
- Português – Brasil
- עברית
- 中文 – 简体
- 中文 – 繁體
- 日本語
- 한국어Sign in

[https://docs.cloud.google.com/architecture](https://docs.cloud.google.com/architecture)

- [Documentation](https://docs.cloud.google.com/docs)
- [Cloud Architecture Center](https://docs.cloud.google.com/architecture)

[Start free](//console.cloud.google.com/freetrial)

- [Home](https://docs.cloud.google.com/)
- [Documentation](https://docs.cloud.google.com/docs)

- [Cloud Architecture Center](https://docs.cloud.google.com/architecture)

Send feedback

# Generative AI use case: Generate personalized product recommendations

Last reviewed 2025-12-15 UTC

This document describes a high-level architecture for using AI to generate
personalized product recommendations for a retail application in Google Cloud.

The intended audience for this document includes architects, developers, and
administrators who build and manage generative AI applications in the cloud for
the retail industry. The document assumes that you have a foundational
understanding of [generative AI](/docs/generative-ai/glossary#generative-ai).

## Architecture

The following diagram shows an architecture that uses an AI model to generate
personalized product recommendations based on insights from clickstream metrics.

![Architecture for using AI to generate personalized product recommendations.](/static/architecture/images/genai-product-recommendations-architecture.png) ![Architecture for using AI to generate personalized product recommendations}.](/static/architecture/images/genai-product-recommendations-architecture.png)

The architecture shows the following flows:

- **Ingest and process user data**:
  1. Clickstream data such as page views, clicks, and purchases are
 uploaded to a Dataflow pipeline.
  2. Dataflow processes the data and derives insights such
 as user profiles and preferences. Dataflow then stores the
 data, insights, and vector embeddings in BigQuery.
- **Generate and serve product recommendations**:
  1. A customer visits the company's storefront, which is a
 Cloud Run service in this architecture.
  2. The storefront service sends the visitor's data to a recommender
 service that runs on Cloud Run.
  3. The recommender service performs a vector similarity search in
 BigQuery and retrieves data about the visitor's profile and
 preferences.
  4. The recommender service sends the visitor's profile and preferences
 data to Gemini API, with a prompt to generate product
 recommendations. Gemini generates product recommendations that
 are tailored for the visitor.
  5. The recommender service sends the product recommendations to the
 storefront service, which then displays the recommendations.

To optimize cost and performance, add a cache between the storefront service and
the recommender service. The recommender service checks the cache for visitor
data. If the cache doesn't contain relevant data, the service performs a vector
similarity search in BigQuery. To set up the cache, you can use [Memorystore](https://cloud.google.com/memorystore) or configure a load balancer with [Cloud CDN](/cdn/docs/overview).

## Products used

This example architecture uses the following Google Cloud products:

- [Cloud Run](https://cloud.google.com/run): A serverless compute platform that lets you run
containers directly on top of Google's scalable infrastructure.
- [Gemini Enterprise Agent Platform](/gemini-enterprise-agent-platform/overview): A comprehensive platform that
lets you build, scale, govern, and optimize enterprise‑grade AI agents.
- [BigQuery](https://cloud.google.com/bigquery): An enterprise data warehouse that helps you manage and
analyze your data with built-in features like machine learning, geospatial
analysis, and business intelligence.
- [Dataflow](https://cloud.google.com/dataflow): A service that provides unified stream and batch data processing at scale.

## Deployment

To experiment with generative AI applications in Google Cloud for retail
workloads, use the following code samples:

- [Multimodal retail recommendations](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/use-cases/retail/multimodal_retail_recommendations.ipynb).
- [Generative AI code samples for retail use cases](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/use-cases/retail).

## What's next

- Explore more [generative AI architecture guides](/architecture/ai-ml#generative_ai).
- For an overview of architectural principles and recommendations that are specific to AI
and ML workloads in Google Cloud, see the
[AI and ML perspective](/architecture/framework/perspectives/ai-ml)in the Well-Architected Framework.

- For more reference architectures, diagrams, and best practices, explore the
[Cloud Architecture Center](/architecture).

## Contributors

Author: [Kumar Dhanagopal](https://www.linkedin.com/in/kumardhanagopal) | Cross-Product Solution Developer

Other contributors:

- [Amina Mansour](https://www.linkedin.com/in/aminamansour/) | Head of Cloud Platform Evaluations Team
- [Megan O'Keefe](https://www.linkedin.com/in/askmeegs) | Developer Advocate
- [Samantha He](https://www.linkedin.com/in/samantha-he-05a98173) | Technical Writer
- [Shir Meir Lador](https://www.linkedin.com/in/shirmeirlador) | Developer Relations Engineering Manager

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-12-15 UTC.
