---
type: 'vendor'
title: 'Overview'
source_url: 'https://docs.aws.amazon.com/solutions/retail-personalization-on-aws/'
vendor: ['aws']
industry: ['retail']
data_stack: []
cloud: ['aws']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

# Guidance for Retail Personalization on AWS

## Overview

This Guidance helps you offer personalized experiences and interactions to shoppers through machine learning (ML) services, so you can increase revenue and sales. The Guidance provides a fully automated, end-to-end architecture that ingests data and trains ML models. Additionally, this architecture provides APIs for adding near real time personalized product recommendations to digital commerce mobile applications and portals.  

## How it works

This architecture augments different e-commerce backends by integrating Amazon Personalize as a product recommendation engine.

[Download the architecture diagram](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/solutions/approved/documents/architecture-diagrams/retail-personalization-on-aws.pdf)

![Architecture diagram](/images/solutions/retail-personalization-on-aws/images/retail-personalization-on-aws-1.png) Step 1

Retrieve product metadata through endpoints and pull training datasets from your data source. This architecture is designed to be compatible with any e-commerce backend.

Step 2

Amazon Athena Federated Query provides a mechanism to fetch data from different sources, such as relational and non-relational databases, object stores, and custom data sources. It then stores the results in Amazon Simple Storage Service (Amazon S3).

Step 3

Amazon S3 stores datasets used to train Amazon Personalize models in addition to partial datasets for updating new stock keeping units (SKUs) and user metadata.

Step 4

Amazon Personalize delivers near real time and batch product recommendations based on customer interactions and behaviors.

Step 5

AWS AppSync provides clients with GraphQL endpoints to store user interactions and get product recommendations combined with metadata from Amazon DynamoDB.

Step 6

Amazon Elastic Container Service (Amazon ECS) on AWS Fargate runs microservices used to apply business logic for A/B testing and to create new campaigns.

Step 7

DynamoDB acts as a caching layer between the e-commerce backend and the recommendation microservice, providing a scalable way to fetch product metadata.

Step 8

Amazon EventBridge responds to changes in Amazon Personalize campaigns and filters, resolves, and triggers events that activate workflow operations and notifications.

Step 9

AWS Step Functions orchestrates workflows for model retraining, job imports, and updates to the DynamoDB table and machine learning operations (MLOps).

Step 10

The Amazon Pinpoint campaign sends scheduled messages with recommendations through email and text.

Step 11

Amazon CloudWatch, AWS Key Management Service (AWS KMS), and AWS Identity and Access Management (IAM) secure the workload and provide governance.

## Well-Architected Pillars

The architecture diagram above is an example of a Solution created with Well-Architected best practices in mind. To be fully Well-Architected, you should follow as many Well-Architected best practices as possible.

**Operational Excellence**

This Guidance is designed to be fully scalable and automated. The serverless architecture does not require human intervention to run MLOps and an ML lifecycle. You can enable CloudWatch logging and metrics on supported services to monitor usage and failures.

[Read the Operational Excellence whitepaper](/wellarchitected/latest/operational-excellence-pillar/welcome.html)

**Security**

This architecture uses IAM policy best practices, such as least privilege access to resources. For example, when using the DynamoDB resolver, this architecture employs IAM roles that provide the most restrictive view to resources, such as your DynamoDB tables.

[Read the Security whitepaper](/wellarchitected/latest/security-pillar/welcome.html)

**Reliability**

This architecture uses serverless and managed services such as Amazon S3, Step Functions, and DynamoDB. These services automatically recover from failures, scale to increase workload availability, and provision resources based on demand.

[Read the Reliability whitepaper](/wellarchitected/latest/reliability-pillar/welcome.html)

**Performance Efficiency**

This architecture scales to meet performance requirements for high capacity events, such as Prime Day or Black Friday. When Amazon Personalize returns recommended SKUs during these events, the e-commerce application needs to obtain the right metadata. DynamoDB and Amazon DynamoDB Accelerator (DAX) retrieve metadata from recommended SKUs and returns responses within microseconds.

[Read the Performance Efficiency whitepaper](/wellarchitected/latest/performance-efficiency-pillar/welcome.html)

**Cost Optimization**

With serverless and managed services in this architecture, you pay only for the computing resources required to run your workloads. Additionally, Lambda, AWS AppSync, and Step Functions remove the operational burden of managing both operating systems and instances to run code.

[Read the Cost Optimization whitepaper](/wellarchitected/latest/cost-optimization-pillar/welcome.html)

**Sustainability**

This architecture reduces the amount of resources consumed by using serverless services that automatically scale based on demand.

[Read the Sustainability whitepaper](/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html)

[Read usage guidelines](/solutions/guidance-disclaimers/)
