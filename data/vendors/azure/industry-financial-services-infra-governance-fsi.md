---
type: 'vendor'
title: 'Infrastructure governance - Microsoft for Financial Services'
source_url: 'https://learn.microsoft.com/en-us/industry/financial-services/infra-governance-fsi'
vendor: ['azure']
industry: ['financial_services']
data_stack: []
cloud: ['azure']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
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

# Infrastructure governance

Summarize this article for me

Highly regulated financial institutions face challenges in ensuring that developers universally follow their cloud adoption policies in their various lines-of-businesses. Further, these policies also need to meet the regulatory and compliance requirements set by their own Chief Information Security Officers (CISOs) and various regulatory bodies overseeing their operations.

By combining Azure Policy with Azure Landing Zones, your organization can achieve a unified governance model that ensures compliance and consistency across your entire Azure environment. Azure Landing Zones provide scalable infrastructure, while Azure Policy enforces the rules and standards, creating a robust and compliant cloud environment.

## Well-Architected Framework

The Azure Well-Architected Framework is a design framework that can improve the quality of a workload by helping it to:

- Be resilient, available, and recoverable.
- Be as secure as you need.
- Deliver a sufficient return on investment.
- Support responsible development and operations.
- Accomplish its purpose within acceptable time frames.

The framework is a recommended starting point for any Azure Infrastructure project.

## Landing zones

An Azure landing zone is a structured environment that simplifies the process of building solutions in the Microsoft cloud. It follows key design principles across areas such as identity and access management, network topology, and security. The architecture is modular and scalable, allowing for consistent application of configurations and controls across subscriptions.

Platform landing zones provide shared services like identity and connectivity, while application landing zones host specific applications. Microsoft offers accelerators to help deploy these landing zones efficiently, ensuring that universal policies are implemented seamlessly. This approach helps organizations manage their cloud environments effectively, meeting operational requirements with ease.

## Azure Policy

Azure Policy helps enforce organizational standards and assess compliance at scale. It provides a compliance dashboard for an aggregated view of the environment's state, with the ability to drill down to specific resources and policies. Azure Policy supports bulk remediation for existing resources and automatic remediation for new ones. It uses JSON-based policy definitions to evaluate resources against business rules, which you can group into policy initiatives for easier management. You can extend an Azure Policy across different cloud providers and local data centers with Azure Arc. It works alongside Azure role-based access control (RBAC) to provide comprehensive control over a resource state and user actions. Azure Policy has many built-in initiatives that your organization can directly use.

## Related information

- [Microsoft Azure Well-Architected Framework pillars](/en-us/azure/well-architected/pillars)  
- [What is an Azure landing zone?](/en-us/azure/cloud-adoption-framework/ready/landing-zone/)  
- [What is Azure Policy?](/en-us/azure/governance/policy/overview)  
- [Microsoft compliance tools](microsoft-compliance-tools)

---

## Feedback

Was this page helpful?

Yes

**No**

Need help with this topic?

Want to try using Ask Learn to clarify or guide you through this topic?

Suggest a fix?

---

- Last updated on 2026-01-23

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
