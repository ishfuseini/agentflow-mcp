---
type: 'vendor'
title: 'Financial Services Industry Lens - AWS Well-Architected Framework - Financial Services Industry Lens'
source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/financial-services-industry-lens/financial-services-industry-lens.html'
vendor: ['aws']
industry: ['financial_services']
data_stack: []
cloud: ['aws']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[View a markdown version of this page](financial-services-industry-lens.md)

Financial Services Industry Lens - AWS Well-Architected Framework - Financial Services Industry Lens

[](/pdfs/wellarchitected/latest/financial-services-industry-lens/wellarchitected-financial-services-industry-lens.pdf#financial-services-industry-lens "Open PDF")

[Documentation](/index.html)[AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)[AWS Well-Architected Framework](financial-services-industry-lens.html)

[Introduction](#introduction)[Lens availability](#lens-availability)

# Financial Services Industry Lens - AWS Well-Architected Framework

Publication date: **January 27, 2026** ([Document revisions](./document-revisions.html))

This document describes the Financial Services Industry Lens for the AWS Well-Architected
 Framework. The document describes general design principles, as well as specific best practices
 and guidance for the six pillars of the Well-Architected Framework.

## Introduction

The financial services industry includes financial services firms, independent software
 vendors (ISVs), market utilities, and infrastructures that supply essential services to
 countries around the world. The industry consists of organizations that provide the main
 mechanisms for:

- Paying for goods and services

- Financial markets and asset trading

- Serving as intermediates between savers and borrowers (channeling savings into
 investment)

- Insuring against and dispersing risk

The [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) helps you understand the pros and cons of decisions you make while
 building systems on AWS. By using the Framework, you learn architectural best practices for
 designing and operating reliable, secure, efficient, cost-effective, and sustainable systems
 in the cloud. The Framework provides a way for you to consistently measure your architectures
 against best practices and identify areas for improvement. We believe that having well
 architected systems greatly increases your security, reliability, and the likelihood of
 business success.

In this lens, we focus the Well-Architected Framework on how to design, deploy, and
 architect financial services industry (FSI) workloads that promote the resiliency, security,
 cost savings, and operational performance in line with risk and control objectives that you
 define, including those that help you align with the regulatory and compliance requirements of
 supervisory authorities.

All customers should begin with the best practices and questions outlined in the [AWS Well-Architected Framework whitepaper](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html). This document provides additional best
 practices that are focused on the technical architectures and workloads that are associated
 with financial services institutions.

The Financial Services Industry Lens identifies best practices for security, data privacy,
 and resiliency that are intended to address the requirements of financial institutions based
 on our experience working with financial institutions worldwide. It provides guidance on
 guardrails for technology teams to implement and confidently use AWS to build and deploy
 applications. This Lens describes the process of building transparency and auditability into
 your AWS environment. It also offers suggestions for controls to help you expedite adoption
 of new services into your environment while managing the cost of your IT services.

This document is intended for those in technology leadership roles, such as chief
 technology officers (CTOs), architectural leadership, developers, engineers, and operations
 team members, as well as individuals in the risk, compliance, and audit functions.

## Lens availability

The Financial Services Industry Lens is available as an AWS-official lens in the [Lens Catalog](https://docs.aws.amazon.com/wellarchitected/latest/userguide/lens-catalog.html) of the [AWS Well-Architected Tool](https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html).

To get started, follow the steps in [Adding a lens to a workload](https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses-add.html) and select the **Financial Services Industry Lens**.

[Document Conventions](/general/latest/gr/docconventions.html)

Design principles

Did this page help you? - Yes

Thanks for letting us know we're doing a good job!

If you've got a moment, please tell us what we did right so we can do more of it.

Did this page help you? - No

Thanks for letting us know this page needs work. We're sorry we let you down.

If you've got a moment, please tell us how we can make the documentation better.
