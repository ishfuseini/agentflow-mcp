---
type: 'vendor'
title: 'Get Started with Identity Architecture Design - Azure Architecture Center'
source_url: 'https://learn.microsoft.com/en-us/azure/architecture/identity/identity-get-started'
vendor: ['azure']
industry: []
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

[Edit](https://github.com/microsoftdocs/architecture-center/blob/main/docs/identity/identity-get-started.md)

--- Copy Markdown

Print

# Get started with identity architecture design

Summarize this article for me

Identity and access management (IAM) is a foundational element of cloud architecture. In on-premises systems, internal networks establish security boundaries. In cloud environments, perimeter networks and firewalls alone aren't sufficient for managing access to apps and data. Instead, public cloud systems rely on identity solutions for boundary security.

An identity solution controls access to an organization's apps and data. Users, devices, and applications have identities. IAM components support the authentication and authorization of these identities. Authentication controls who or what uses an account. Authorization controls what a user can do in applications.

## Azure services for identity

Azure provides a range of services for identity:

- [Microsoft Entra ID](/en-us/entra/fundamentals/whats-new) is the core cloud-based identity and access management service that provides authentication, policy enforcement, and protection for users, devices, apps, and resources.

- [Microsoft Entra Domain Services](/en-us/entra/identity/domain-services/overview) is for managed domain services.

- [Microsoft Entra External ID](/en-us/entra/external-id/external-identities-overview) is for customer and partner identity scenarios.

- [Microsoft Entra Private Access](/en-us/entra/global-secure-access/overview-what-is-global-secure-access#microsoft-entra-private-access) is for secure private network access.

- [Microsoft Entra Internet Access](/en-us/entra/global-secure-access/overview-what-is-global-secure-access#microsoft-entra-internet-access) is for secure internet access.

## Architecture

[![Diagram of a hybrid cloud identity architecture that uses Microsoft Entra ID.](media/identity-architecture.svg)](media/identity-architecture.svg#lightbox)

[The image contains two key sections: an on-premises network and an Azure virtual network. The on-premises network section includes a domain controller, Microsoft Entra Connect Sync, and an on-premises client. An arrow points from the domain controller to Microsoft Entra Connect Sync. An arrow labeled sync points from Microsoft Entra Connect Sync to the Microsoft Entra tenant. An arrow labeled requests from on-premises users points from the on-premises client to the Microsoft Entra tenant. An arrow labeled requests from external users points to the Microsoft Entra tenant. An arrow points from Microsoft Entra tenant to a load balancer. Three arrows point from the load balancer to three separate virtual machines (VMs) in the Azure virtual network section. A dotted line labeled DDoS Protection encloses the Azure virtual network section. This section includes the web tier, the business tier, the data tier, and the management subnet. All three tiers include a network security group, a load balancer, and three VMs. The management subnet includes Azure Bastion.](media/identity-architecture.svg#lightbox)

[media/identity-architecture.svg#lightbox](media/identity-architecture.svg#lightbox)

*Download a [Visio file](https://arch-center.azureedge.net/identity-architectures.vsdx) of this architecture.*

The previous diagram demonstrates a typical basic or baseline identity implementation. For real-world solutions that you can build in Azure, see [Identity architectures](#identity-architectures).

## Explore identity guides, architectures, and solution ideas

The articles in this section include guides and fully developed architectures that you can deploy in Azure and expand to production-grade solutions. Solution ideas demonstrate implementation patterns and possibilities to consider as you plan your identity proof-of-concept (POC) development. These articles can help you decide how to use identity technologies in Azure.

### Identity guides

**Technology choices.** The following articles help you evaluate and select the best identity technologies for your workload requirements:

- [Compare self-managed Active Directory Domain Services, Microsoft Entra ID, and managed Microsoft Entra Domain Services](/en-us/entra/identity/domain-services/compare-identity-solutions): Compare three services that provide access to a central identity to determine the best fit for your scenario.

- [Choose the right authentication method for your Microsoft Entra hybrid identity solution](/en-us/entra/identity/hybrid/connect/choose-ad-authn): Evaluate authentication options, including password hash synchronization, pass-through authentication, and federation.

#### Multitenant identity

- [Architectural considerations for identity in a multitenant solution](/en-us/azure/architecture/guide/multitenant/considerations/identity): Understand identity requirements for multitenant solutions, including authentication, authorization, and tenant isolation.

- [Architectural approaches for identity in multitenant solutions](/en-us/azure/architecture/guide/multitenant/approaches/identity): Explore implementation approaches for identity in multitenant solutions, including Microsoft Entra ID and External ID.

### Identity architectures

The following production-ready architectures demonstrate end-to-end identity solutions that you can deploy and customize.

#### Hybrid identity

- [Integrate on-premises Active Directory domains with Microsoft Entra ID](/en-us/entra/identity/hybrid/cloud-sync/plan-cloud-sync-topologies): Best practices for integrating on-premises Active Directory domains with Microsoft Entra ID to provide cloud-based identity authentication.

- [Create an AD DS resource forest in Azure](/en-us/entra/identity/domain-services/overview): Create a separate Active Directory domain in Azure that's trusted by domains in your on-premises Active Directory forest.

- [Deploy AD DS in an Azure virtual network](/en-us/azure/architecture/reference-architectures/identity/adds-extend-domain): Extend an on-premises Active Directory domain to Azure to provide distributed authentication services.

- [Extend on-premises AD FS to Azure](/en-us/entra/identity/hybrid/connect/migrate-from-federation-to-cloud-authentication): Extend your on-premises network to Azure and use Active Directory Federation Services (AD FS) for federated authentication and authorization.

#### Cross-cloud identity

- [Microsoft Entra identity management and access management for AWS](/en-us/azure/architecture/reference-architectures/aws/aws-azure-ad-security): Deploy Microsoft Entra identity and access solutions for AWS to provide centralized identity management and strong single sign-on authentication.

### Identity solution ideas

The following identity solution ideas demonstrate implementation patterns and possibilities to explore:

- [Build the first layer of defense by using Azure security services](/en-us/azure/architecture/solution-ideas/articles/azure-security-build-first-layer-defense): Use Azure security services, including identity services like role-based access control (RBAC), MFA, and Conditional Access, to build a foundational security layer for your infrastructure.

- [Multilayered protection for Azure virtual machine access](/en-us/azure/architecture/solution-ideas/articles/multilayered-protection-azure-vm): Implement identity-based just-in-time access to Azure VMs by using Microsoft Entra ID, Conditional Access, and Privileged Identity Management.

## Organizational readiness

Organizations at the beginning of the cloud adoption process can use the [Cloud Adoption Framework for Azure](/en-us/azure/cloud-adoption-framework/) to access proven guidance that accelerates cloud adoption.

- [Identity and access management design area](/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/identity-access): Evaluate options for your identity and access foundation, including authentication, authorization, separation of duties, and hybrid identity synchronization with Microsoft Entra ID.

- [Azure billing offers and Microsoft Entra tenants](/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-ad-tenant): Understand how billing offers associate with Microsoft Entra tenants and how subscriptions relate to tenant structures.

- [Resource organization](/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org): Establish consistent patterns for naming, tagging, subscription design, and management group hierarchy to organize identity and other resources deployed to the cloud.

To help ensure the quality of your identity solution on Azure, follow the guidance in the [Azure Well-Architected Framework](/en-us/azure/well-architected/). The Well-Architected Framework provides prescriptive guidance for organizations that seek architectural excellence and describes how to design, provision, and monitor cost-optimized Azure solutions. For identity-specific guidance, see [Architecture strategies for identity and access management](/en-us/azure/well-architected/security/identity-access), which covers authentication, authorization, conditional access, and identity lifecycle management across all five Well-Architected Framework pillars.

## Best practices

Follow these best practices to improve the security, reliability, performance, and operational quality of your identity workloads on Azure.

- [Integrate on-premises Active Directory domains with Microsoft Entra ID](/en-us/entra/identity/hybrid/cloud-sync/plan-cloud-sync-topologies): Best practices for integrating on-premises Active Directory domains with Microsoft Entra ID, including guidance for remote user access, self-service capabilities, and hybrid environments without VPN or Azure ExpressRoute connectivity.

- [Five steps to securing your identity infrastructure](/en-us/azure/security/fundamentals/steps-secure-identity): A checklist for strengthening your organization's identity security posture with Microsoft Entra ID. It covers credential hardening, attack surface reduction, threat response automation, auditing, and self-service enablement.

- [Microsoft Entra security operations guide](/en-us/entra/architecture/security-operations-introduction): Guidance for monitoring and detecting security threats to your Microsoft Entra ID environment. It covers baselines, accounts, applications, devices, and infrastructure.

- [Configure Microsoft Entra for increased security](/en-us/entra/fundamentals/configure-security): Comprehensive security configuration checklist for Microsoft Entra ID. It's organized by Zero Trust themes, including identity protection, tenant isolation, network protection, and threat detection.

- [Microsoft Entra deployment plans](/en-us/entra/architecture/deployment-plans): Deployment plans for key Microsoft Entra features, including multifactor authentication, Conditional Access, user provisioning, seamless SSO, and self-service password reset.

- [Understand the stages of migrating application authentication from AD FS to Microsoft Entra ID](/en-us/entra/identity/enterprise-apps/migrate-adfs-apps-stages): Guidance on planning and implementing a phased migration of application authentication from AD FS to Microsoft Entra ID.

- [Plan application migration to Microsoft Entra ID](/en-us/entra/identity/enterprise-apps/migrate-adfs-apps-phases-overview): Overview of the four-phase migration process for moving application authentication from AD FS to Microsoft Entra ID, including project planning and stakeholder communication.

- [Resources for migrating applications to Microsoft Entra ID](/en-us/entra/identity/enterprise-apps/migration-resources): Collection of resources, including migration playbooks, readiness scripts, and deployment plans, to help migrate application access and authentication to Microsoft Entra ID.

## Stay current with identity

Azure identity services evolve to address modern data challenges. Stay informed about the latest [updates and features](https://azure.microsoft.com/updates/).

To stay current with key identity services, see the following articles:

- [Microsoft Entra releases and announcements](/en-us/entra/fundamentals/whats-new): Stay current with recent developments across the Microsoft Entra product family, including new features, plan-for-change announcements, and deprecations.

- [Azure updates](https://azure.microsoft.com/updates/?query=identity): A roadmap showing new key features, updates, and announcements for Azure identity services.

## Other resources

The following resources can help you discover more about Azure identity services.

### Microsoft Entra ID in educational environments

These resources provide guidance for designing and deploying Microsoft Entra ID in educational institutions. They cover tenant architecture, identity governance, and credential management for students and faculty.

- [Introduction to Microsoft Entra tenants](/en-us/microsoft-365/education/guide/1-reference/introduction-microsoft-entra-id): Learn about Microsoft Entra tenants in educational environments, including tenant creation, identity security boundaries, directory objects, and administration.

- [Design a multitenant architecture for large institutions](/en-us/microsoft-365/education/guide/1-reference/design-multi-tenant-architecture): Design principles and guidance for educational organizations that have more than 1 million users and need a multitenant Microsoft Entra architecture.

- [Design tenant configuration](/en-us/microsoft-365/education/guide/1-reference/design-tenant-configurations): Configure security and access policies across Microsoft Entra tenants, including external identities, Conditional Access, device management, and self-service options.

- [Design authentication and credential strategies](/en-us/microsoft-365/education/guide/1-reference/design-credential-authentication-strategies): Authentication methods and credential management for educational organizations, including passwordless authentication, SSPR, and MFA for students and faculty.

- [Design an account strategy](/en-us/microsoft-365/education/guide/1-reference/design-account-strategy): Plan cloud-only and hybrid account creation strategies for large educational institutions, including provisioning with Microsoft Entra Connect and School Data Sync.

- [Design identity governance](/en-us/microsoft-365/education/guide/1-reference/design-identity-governance): Identity lifecycle management, entitlement management, access reviews, and Privileged Identity Management for educational organizations.

- [Microsoft Education Solution Guide](/en-us/microsoft-365/education/guide/0-start/a-start): Deployment guidance for Microsoft 365 Education. It covers tenant setup, identity, applications, security, and device management across A1, A3, and A5 license tiers.

## Amazon Web Services (AWS) or Google Cloud professionals

To help you get started quickly, the following articles compare Azure identity options to other cloud services and provide migration guidance:

### Service comparison

- [Compare AWS and Azure identity management solutions](/en-us/azure/architecture/aws-professional/security-identity): A comprehensive comparison of AWS and Azure identity services, including core identity, authentication and access control, identity governance, privileged access management, hybrid identity, and application authentication.

- [Microsoft Entra identity management and access management for AWS](/en-us/azure/architecture/reference-architectures/aws/aws-azure-ad-security): Detailed guidance for deploying Microsoft Entra identity and access solutions for AWS, including SSO integration, role mapping, Conditional Access, and Privileged Identity Management.

- [Google Cloud to Azure services comparison—Security and identity](/en-us/azure/architecture/gcp-professional/services#security-and-identity): A comparison of Google Cloud and Azure security and identity services, including authentication, authorization, encryption, and threat detection.

### Migration guidance

If you're migrating from another cloud platform, see the following articles:

- [Migrate security services from AWS to Azure](/en-us/azure/migration/migrate-security-from-aws): Guidance for migrating AWS security services to Azure, including SIEM migration to Microsoft Sentinel and customer identity migration to Microsoft Entra External ID.

- [Plan your workload migration from AWS to Azure](/en-us/azure/migration/migrate-workload-from-aws-plan): Includes guidance on planning identity management during migration, including mapping AWS IAM roles to Microsoft Entra ID roles, managed identities, and service principals.

---

## Feedback

Was this page helpful?

Yes

**No**

Need help with this topic?

Want to try using Ask Learn to clarify or guide you through this topic?

Suggest a fix?

---

- Last updated on 2026-07-01

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
