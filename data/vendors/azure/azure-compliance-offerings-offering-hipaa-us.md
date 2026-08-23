---
type: 'vendor'
title: 'HIPAA - Azure Compliance'
source_url: 'https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us'
vendor: ['azure']
industry: ['healthcare']
data_stack: []
cloud: ['azure']
constraints: ['HIPAA']
compliance: ['hipaa']
region: ['US']
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

# HIPAA (US)

Summarize this article for me

## HIPAA overview

The Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the regulations issued under HIPAA are a set of US healthcare laws that, among other provisions, establish requirements for the use, disclosure, and safeguarding of protected health information (PHI). The scope of HIPAA was extended in 2009 with the enactment of the Health Information Technology for Economic and Clinical Health (HITECH) Act that was created to stimulate the adoption of electronic health records and supporting information technology.

HIPAA applies to covered entities – doctors’ offices, hospitals, health insurers, and other healthcare companies – that create, receive, maintain, transmit, or access PHI. HIPAA further applies to business associates of covered entities that perform certain functions or activities involving PHI as part of providing services to the covered entity or on behalf of the covered entity. When a covered entity engages the services of a cloud service provider (CSP), such as Microsoft, the CSP becomes a business associate under HIPAA. Moreover, when a business associate subcontracts with a CSP to create, receive, maintain, or transmit PHI, the CSP also becomes a business associate.

Together, HIPAA and HITECH Act rules include:

- The [Privacy Rule](https://www.hhs.gov/hipaa/for-professionals/privacy/index.html), which requires appropriate safeguards to protect the privacy of PHI and imposes restrictions on the use and disclosure of PHI without patient authorization. It also gives patients the rights over their health information, including rights to examine their health records and request corrections.
- The [Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html), which sets the standards for administrative, technical, and physical safeguards to ensure the confidentiality, integrity, and security of electronic PHI.
- The [Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html), which requires covered entities and their business associates to provide notification when a breach of unsecured PHI occurs.

HIPAA regulations require that covered entities and their business associates enter into a contract called a Business Associate Agreement (BAA) to ensure the business associates protect PHI adequately. Among other things, a BAA establishes the permitted and required uses and disclosures of PHI by the business associate, based on the relationship between the parties and the activities and services being performed by the business associate.

## Azure and HIPAA

There is currently no certification program approved by the US Department of Health and Human Services (HHS) through which a CSP acting as a business associate could demonstrate compliance with HIPAA and the HITECH Act. However, HIPAA and HITECH Act requirements have been mapped to other established security frameworks and standards that CSPs typically attest to:

- The National Institute of Standards and Technology (NIST) [SP 800-66](https://csrc.nist.gov/publications/detail/sp/800-66/rev-1/final) *An Introductory Resource Guide for Implementing the HIPAA Security Rule*, which addresses security concepts in the HIPAA Security Rule and explains how they relate to other NIST publications on information security. Specifically, Appendix D – Security Rule Standards and Implementation Specifications Crosswalk provides a catalog of the HIPAA Security Rule standards and implementation specifications, and maps each to relevant security controls detailed in [NIST SP 800-53](https://csrc.nist.gov/Projects/risk-management/sp800-53-controls/release-search#/800-53) *Security and Privacy Controls for Information Systems and Organizations*. NIST SP 800-53 serves as the baseline control set for the US Federal Risk and Authorization Management Program (FedRAMP). Therefore, a FedRAMP assessment and authorization provides strong assurances that HIPAA Security Rule safeguard standards and specifications are addressed adequately. Both Azure and Azure Government maintain a [FedRAMP High](offering-fedramp) Provisional Authorization to Operate (P-ATO) issued by the FedRAMP Joint Authorization Board (JAB).
- The Cloud Security Alliance (CSA) [Cloud Controls Matrix](https://cloudsecurityalliance.org/research/cloud-controls-matrix/) (CCM), which maps HIPAA and HITECH Act requirements to CCM control objectives covering fundamental security principles across CCM domains. Both Azure and Azure Government maintain the [CSA STAR Certification](offering-csa-star-certification) and [CSA STAR Attestation](offering-csa-star-attestation) that are based on the CCM.
- The HHS [HIPAA Security Rule Crosswalk to NIST Cyber Security Framework](https://www.hhs.gov/sites/default/files/nist-csf-to-hipaa-security-rule-crosswalk-02-22-2016-final.pdf), which maps each administrative, physical and technical safeguard standard and implementation specification in the HIPAA Security Rule to a relevant NIST Cybersecurity Framework (CSF) subcategory, and provides relevant control mapping to other standards including ISO/IEC 27001 and NIST SP 800-53. Both Azure and Azure Government align with the [NIST CSF](offering-nist-csf) and are certified under [ISO/IEC 27001](offering-iso-27001).

To support our customers who are subject to HIPAA compliance, Microsoft will enter into BAAs with its covered entity and business associate customers. Azure has enabled the physical, technical, and administrative safeguards required by HIPAA and the HITECH Act inside the in-scope Azure services, and offers a [HIPAA BAA](https://aka.ms/baa) as part of the Microsoft [Product Terms](https://www.microsoft.com/licensing/docs/view/Product-Terms) (formerly Online Services Terms) to all customers who are covered entities or business associates under HIPAA for use of such in-scope Azure services. In the BAA, Microsoft makes contractual assurances about data safeguarding, reporting (including breach notifications), data access in accordance with HIPAA and the HITECH Act, and many other important provisions. Microsoft enables you in your compliance with HIPAA and the HITECH Act, and adheres to the HIPAA Security Rule requirements in its capacity as a business associate.

[Azure Policy regulatory compliance built-in initiative for HIPAA/HITRUST](/en-us/azure/governance/policy/samples/hipaa-hitrust-9-2) maps to HIPAA/HITRUST **compliance domains** and **controls**. Regulatory compliance in Azure Policy provides built-in initiative definitions to view a list of controls and compliance domains based on responsibility – customer, Microsoft, or shared. For Microsoft-responsible controls, we provide extra audit result details based on third-party attestations and our control implementation details to achieve that compliance. Each HIPAA/HITRUST control is associated with one or more Azure Policy definitions. These policies may help you [assess compliance](/en-us/azure/governance/policy/how-to/get-compliance-data) with the control; however, compliance in Azure Policy is only a partial view of your overall compliance status. Azure Policy helps to enforce organizational standards and assess compliance at scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to more granular status.

## Applicability

- Azure
- Azure Government

## Services in scope

For Microsoft cloud services in scope for the HIPAA BAA coverage, see [Cloud services in audit scope](cloud-services-in-audit-scope).

## Office 365 and HIPAA

For more information about Office 365 compliance, see [Office 365 HIPAA documentation](/en-us/compliance/regulatory/offering-hipaa-hitech).

## Guidance documents

- [A practical guide to designing secure health solutions using Microsoft Azure](https://azure.microsoft.com/resources/a-practical-guide-to-designing-secure-health-solutions-using-microsoft-azure/)
- [Azure Policy regulatory compliance built-in initiative for HIPAA/HITRUST](/en-us/azure/governance/policy/samples/hipaa-hitrust-9-2)

## Frequently asked questions

**How can my organization sign a BAA for Microsoft Azure?**  
There is no separate contract to sign to enter into a HIPAA Business Associate Agreement (BAA) with Microsoft because the [HIPAA BAA](https://aka.ms/baa) is available via the Microsoft [Product Terms](https://www.microsoft.com/licensing/docs/view/Product-Terms) (formerly Online Services Terms) by default to all customers who are covered entities or business associates under HIPAA. The Microsoft Product Terms references the Microsoft Products and Services [Data Protection Addendum](https://aka.ms/dpa) (DPA), which states that "execution of customer's volume licensing agreement includes execution of the HIPAA Business Associate Agreement".

As explained in the Microsoft Azure Legal Information [Service Agreement & Terms](https://azure.microsoft.com/support/legal/), the licensing agreements under which customers purchase Azure incorporate the Microsoft Product Terms and the Microsoft Products and Services Data Protection Addendum (DPA).

**I have a healthcare SaaS solution deployed on Azure. Do my customers need to sign a BAA with Microsoft?**  
No. Microsoft HIPAA BAA is applicable to Microsoft Online Services such as Azure and made available by default to Microsoft customers via a licensing agreement execution that includes the Microsoft Product Terms (formerly Online Services Terms) and the Microsoft Products and Services Data Protection Addendum (DPA). If you're a SaaS provider of a healthcare solution deployed on Azure, your customers who are healthcare providers or covered entities under HIPAA can sign a BAA directly with you. They don't need to have a BAA in place with Microsoft to use your SaaS solution. The Microsoft BAA terms incorporated into your licensing agreement with Microsoft wouldn't be applicable to your customers unless they also happen to be Microsoft customers and have separate licensing agreements in place with Microsoft.

**Does having a BAA with Microsoft ensure my organization's compliance with HIPAA?**  
No. By offering a BAA, Microsoft helps support your HIPAA compliance, but using Azure or other Microsoft cloud services doesn't automatically impart compliance onto your cloud solutions. Your organization is responsible for ensuring that you have an adequate compliance program and internal processes in place, and that your particular use of Azure aligns with HIPAA and the HITECH Act. Microsoft doesn't inspect, approve, or monitor your applications deployed on Azure. You're wholly responsible for ensuring your own compliance with all applicable laws and regulations.

**Can Microsoft use my organization's BAA?**  
No. Microsoft can't use a customer's BAA. Because we offer hyper-scale, multi-tenant could services that are standardized for all customers, we must operate our services in a consistent manner. The Microsoft HIPAA BAA reflects closely how we operate our cloud services. To address the needs of the healthcare industry, Microsoft collaborated with a consortium of academic medical centers and other public and private sector entities within healthcare to create a BAA that aligns with our hyper-scale cloud services and meets customer needs.

## Resources

- [Azure compliance documentation](/en-us/azure/compliance/)
- [Azure enables a world of compliance](https://azure.microsoft.com/resources/azure-enables-a-world-of-compliance/)
- [Microsoft 365 compliance offerings](/en-us/compliance/regulatory/offering-home)
- [Compliance on the Microsoft Trust Center](https://www.microsoft.com/trust-center/compliance/compliance-overview)
- Microsoft [Product Terms](https://www.microsoft.com/licensing/docs/view/Product-Terms) (formerly Online Services Terms)
- Microsoft Products and Services [Data Protection Addendum](https://aka.ms/dpa) (DPA)
- [Microsoft HIPAA BAA](https://aka.ms/baa)
- HIPAA Privacy Rule [45 CFR Part 160](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160?toc=1) and [45 CFR Part 164](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164?toc=1)
- [HIPAA Omnibus Final Rule](https://www.govinfo.gov/content/pkg/FR-2013-01-25/pdf/2013-01073.pdf)
- [Microsoft Cloud for healthcare compliance offerings](https://aka.ms/MicrosoftCloudforHealthcareCompliance)
- [Azure for healthcare](https://azure.microsoft.com/industries/healthcare/)
- [Azure high-performance computing for health and life sciences](https://azure.microsoft.com/solutions/high-performance-computing/health-and-life-sciences/)
- [Microsoft Cloud for healthcare](https://www.microsoft.com/industry/health/microsoft-cloud-for-healthcare)

---

- Last updated on 2023-04-06

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
