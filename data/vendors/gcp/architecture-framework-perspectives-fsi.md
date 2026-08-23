---
type: 'vendor'
title: 'Well-Architected Framework: Financial services (FS) perspective'
source_url: 'https://docs.cloud.google.com/architecture/framework/perspectives/fsi'
vendor: ['gcp']
industry: ['financial_services']
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

# Well-Architected Framework: Financial services (FS) perspective

Last reviewed 2025-07-28 UTC

This document in the [Google Cloud Well-Architected Framework](/architecture/framework) describes principles and recommendations to help you to design, build, and
manage financial services (FS) applications in Google Cloud that meet
your operational, security, reliability, cost, and performance goals.

The target audience for this document includes decision makers, architects,
administrators, developers, and operators who design, build, deploy, and
maintain FS workloads in Google Cloud. Examples of FS organizations that
could benefit from this guidance include banks, payment infrastructure players,
insurance providers, and capital market operators.

FS organizations have specific considerations, particularly for architecture
and resilience. These considerations are primarily driven by regulatory, risk,
and performance requirements. This document provides high-level guidance that's
based on design considerations that we've observed across a wide range of FS
customers globally. Whether your workloads are fully in the cloud or
transitioning to hybrid or multi-cloud deployments, the guidance in this
document helps you design workloads on Google Cloud to meet your
regulatory requirements and diverse risk perspectives. The guidance might not
address the unique challenges of every organization. It provides a foundation
that addresses many of the primary regulatory requirements of FS organizations.

A primary challenge in designing cloud workloads involves aligning cloud
deployments with on-premises environments, especially when you aim for
consistent approaches to security, reliability, and resilience. Cloud services
create opportunities to fundamentally rethink your architecture in order to
reduce management overhead, optimize cost, enhance security, and improve
reliability and resilience.

The following pages describe principles and recommendations that are specific to
FS workloads for each pillar of the Well-Architected Framework:

- [FS perspective: Operational excellence](/architecture/framework/perspectives/fsi/operational-excellence)
- [FS perspective: Security](/architecture/framework/perspectives/fsi/security)
- [FS perspective: Reliability](/architecture/framework/perspectives/fsi/reliability)
- [FS perspective: Cost optimization](/architecture/framework/perspectives/fsi/cost-optimization)
- [FS perspective: Performance optimization](/architecture/framework/perspectives/fsi/performance-optimization)

## Contributors

Authors:

- [Gino Pelliccia](https://www.linkedin.com/in/gino-pelliccia-13637025) | Principal Architect
- [Alex Stepney](https://www.linkedin.com/in/alexstepney/) | Lead Principal Architect
- [Phil Bryan](https://www.linkedin.com/in/philbry) | EMEA FSI Lead Principal Architect
- [Stathis Onasoglou](https://www.linkedin.com/in/stathisonasoglou) | EMEA FSI Principal Architect
- [Sam Moss](https://www.linkedin.com/in/samuel-moss-643780105) | EMEA FinOps Professional Services Lead

Other contributors:

- [Daniel Lees](https://www.linkedin.com/in/daniellees) | Cloud Security Architect
- [Danielle Fisla](https://www.linkedin.com/in/danielle-fisla-7132192) | US FS Portfolio Lead, PSO
- [Filipe Gracio, PhD](https://www.linkedin.com/in/filipegracio) | Customer Engineer, AI/ML Specialist
- [Henry Cheng](https://www.linkedin.com/in/tohenryc) | Principal Architect
- [John Bacon](https://www.linkedin.com/in/johnbac/) | Partner Solutions Architect
- [Jose Andrade](https://www.linkedin.com/in/jmandrade) | Customer Engineer, SRE Specialist
- [Kumar Dhanagopal](https://www.linkedin.com/in/kumardhanagopal) | Cross-Product Solution Developer
- [Laura Hyatt](https://www.linkedin.com/in/laura-hyatt) | Customer Engineer, FSI
- [Michael Yang](https://www.linkedin.com/in/chengxiyang) | Industry Solutions AI Consulting Lead, FSI
- [Nicolas Pintaux](https://www.linkedin.com/in/nicolaspintaux) | Customer Engineer, Application Modernization Specialist
- [Omar Saenz](https://www.linkedin.com/in/omarsaenz) | EMEA Partner Engineer, Security
- [Radhika Kanakam](https://www.linkedin.com/in/radhika-kanakam-18ab876) | Program Lead, Google Cloud Well-Architected Framework
- [Steve McGhee](https://www.linkedin.com/in/stevemcghee) | Reliability Advocate
- [Tarun Sharma](https://www.linkedin.com/in/tarun27in) | Principal Architect
- Yuriy Babenko | Customer Engineer, FSI

[Next Operational excellence arrow_forward](/architecture/framework/perspectives/fsi/operational-excellence)

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-07-28 UTC.
