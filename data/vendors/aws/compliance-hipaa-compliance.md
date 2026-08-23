---
type: 'vendor'
title: 'HIPAA Compliance'
source_url: 'https://aws.amazon.com/compliance/hipaa-compliance/'
vendor: ['aws']
industry: ['healthcare']
data_stack: []
cloud: ['aws']
constraints: ['HIPAA']
compliance: ['hipaa']
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[Skip to main content](#aws-page-content-main)

AWS Cloud Security

- [Security Services](/products/security/)
- Use Cases

- Compliance

- Data Protection

- [Blog](/security/blog/)
- More

# Health Insurance Portability and Accountability Act

(HIPAA)

## Overview

The Health Insurance Portability and Accountability Act of 1996 (HIPAA) is a federal law that includes provisions designed to protect the privacy and security of PHI. Since its inception HIPAA has been modified several times, including rules changes relevant to Privacy (2003), Security (2005), Enforcement (2006), and Breach Notification (2009).

HIPAA is applicable to “covered entities” (Health plans, Healthcare clearinghouses, and healthcare providers who transmit health information electronically) and their business associates.

Among other provisions, HIPAA includes two main sets of rules: the Privacy Rule and the Security Rule. The HIPAA Privacy Rule requires covered entities and their business associates to protect the privacy of PHI on any medium. The HIPAA Security Rule requires that covered entities and their business associates protect the confidentiality, integrity and availability of PHI that is created, transmitted, received or maintained with administrative, physical and technical controls.

A growing number of healthcare providers, payers, and IT professionals are using AWS's utility-based cloud services to process, store, and transmit protected health information (PHI).

AWS enables covered entities and their business associates subject to the U.S. Health Insurance Portability and Accountability Act of 1996 (HIPAA) to use the secure AWS environment to process, maintain, and store protected health information.

For information on HIPAA eligible services see the HIPAA Eligible Services Reference.

![Missing alt text value](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/product-categories/security-identity-compliance/compliance/approved/images/944a9c08-2081-4121-a26c-5ba15ae7038b.06140699edb3fc56413834abb20c4b94543bfd8c.png)

## AWS Healthcare and Life Sciences Customers

![Missing alt text value](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/product-categories/security-identity-compliance/compliance/approved/images/hipaa-logos.a90c0a07a2a1c5ed050bed28db122eefd299f21b.jpg)

- [FAQs 7](#faqs--tf3apt)

## FAQs

[Open all](#)

### What are HIPAA & HITECH?

The Health Insurance Portability and Accountability Act of 1996 (HIPAA) is legislation that is designed to make it easier for US workers to retain health insurance coverage when they change or lose their jobs. The legislation also seeks to encourage electronic health records to improve the efficiency and quality of the US healthcare system through improved information sharing.

Along with increasing the use of electronic medical records, HIPAA includes provisions to protect the security and privacy of protected health information (PHI). PHI includes a very wide set of personally identifiable health and health-related data, including insurance and billing information, diagnosis data, clinical care data, and lab results such as images and test results. The HIPAA rules apply to covered entities, which include hospitals, medical services providers, employer sponsored health plans, research facilities, and insurance companies that deal directly with patients and patient data. The HIPAA requirement to protect PHI also extends to business associates.

[Health Information Technology for Economic and Clinical Health Ac](http://www.hhs.gov/ocr/privacy/hipaa/administrative/enforcementrule/hitechenforcementifr.html)t (HITECH) expanded the HIPAA rules in 2009. HIPAA and HITECH together establish a set of federal standards intended to protect the security and privacy of PHI. These provisions are included in what are known as the "Administrative Simplification" rules. HIPAA and HITECH impose requirements related to the use and disclosure of PHI, appropriate safeguards to protect PHI, individual rights, and administrative responsibilities.

For more information about how HIPAA and HITECH protect health information, see the [Health Information Privacy](https://www.hhs.gov/hipaa/index.html) webpage from the US Department of Health and Human Services.

### What is HITRUST?

[The Health Information Trust Alliance](https://hitrustalliance.net/hitrust-csf/) (HITRUST) Common Security Framework (CSF) in their own words, "is a certifiable framework that provides organizations with a comprehensive, flexible and efficient approach to regulatory compliance and risk management. Developed in collaboration with healthcare and information security professionals, the HITRUST CSF rationalizes healthcare-relevant regulations and standards into a single overarching security framework."

The HITRUST CSF serves to unify security controls from federal law (such as HIPAA and HITECH), state law (such as Massachusetts’s [*Standards for the Protection of Personal Information of Residents of the Commonwealth)*](http://www.mass.gov/ago/doing-business-in-massachusetts/privacy-and-data-security/standards-for-the-protection-of-personal.html), and non-governmental frameworks (such as the PCI Security Standards Council) into a single framework that is tailored for healthcare needs.

AWS provides a reliable, scalable, and inexpensive computing platform that can support healthcare customers' applications in a manner consistent with HIPAA, HITECH, and HITRUST CSF.

### What is a Business Associate Addendum?

Under the HIPAA regulations, cloud service providers (CSPs) such as AWS are considered *business associates*. The Business Associate Addendum (BAA) is an AWS contract that is required under HIPAA rules to ensure that AWS appropriately safeguards protected health information (PHI). The BAA also serves to clarify and limit, as appropriate, the permissible uses and disclosures of PHI by AWS, based on the relationship between AWS and our customers, and the activities or services being performed by AWS.

### Will AWS sign a Business Associate Addendum as described in the HIPAA rules and regulations?

Yes. AWS has a standard Business Associate Addendum (BAA) we present to customers for signature. It takes into account the unique services AWS provides and accommodates the [AWS Shared Responsibility Model](/compliance/shared-responsibility-model/).

To review, accept, and manage the status of the BAA for your account, sign in to [AWS Artifact in the AWS Management Console](/artifact/). If you don’t have access to your account, request a free IAM account from your administrator and ask for access to [Artifact IAM policies](http://docs.aws.amazon.com/artifact/latest/ug/getting-started.html#create-iam-policy).

| ![](https://d1.awsstatic.com/compliance/featured/hipaa-yt_step-by-step.20ef09a21aeb730809e2979c6f3ec34860580944.jpg)**Step-by-step:** Learn how to use AWS Artifact to accept agreements for multiple accounts in your org. (2:07) | ![](https://d1.awsstatic.com/compliance/featured/hipaa-yt_use-artifact.9d948f0efcb4961723286dd2b008fccf1116b074.jpg)See how to use AWS Artifact to accept an agreement for your account. (1:39) |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### Is AWS HIPAA certified?

There is no HIPAA certification for a cloud service provider (CSP) such as AWS. In order to meet the HIPAA requirements applicable to our operating model, AWS aligns our HIPAA risk management program with FedRAMP and NIST 800-53, which are higher security standards that map to the HIPAA Security Rule. NIST supports this alignment and has issued SP 800-66 An Introductory Resource Guide for Implementing the HIPAA Security Rule, which documents how NIST 800-53 aligns to the HIPAA Security Rule.

### What services can I use in my AWS account if I have a Business Associate Addendum with AWS?

Customers may use any AWS service in an account designated as a HIPAA account, but they should only process, store, and transmit protected health information (PHI) in the HIPAA-eligible services defined in the Business Associate Addendum (BAA). For the latest list of HIPAA-eligible AWS services, see the [HIPAA Eligible Services Reference](/compliance/hipaa-eligible-services-reference/) webpage.

AWS follows a standards-based risk management program to ensure that the HIPAA-eligible services specifically support the security, control, and administrative processes required under HIPAA. Using these services to store and process PHI allows our customers and AWS to address the HIPAA requirements applicable to our utility-based operating model. AWS prioritizes and adds new eligible services based on customer demand.

For more information about our business associate program, or to request new eligible services, please [contact us](/compliance/contact/).

### I am an AWS SaaS partner with a BAA and I sell my SaaS solutions to healthcare providers or other covered entities. Do those covered entities also need to sign a BAA with AWS?

No. This is a very common scenario and many HIPAA solution partners run their Software as a Service (SaaS) offerings in AWS. You as the AWS SaaS partner sign a Business Associate Addendum (BAA) with AWS. Then each healthcare provider or covered entity signs a BAA only with you, the AWS SaaS partner. If the covered entity using your SaaS solutions is also a direct customer of AWS for HIPAA-related systems, then the covered entity may need one BAA with you and another BAA with AWS.

## HIPAA Resources

[HIPAA Eligible Services Learn more](/compliance/hipaa-eligible-services-reference/)

[Healthcare Providers and Insurers in the Cloud Learn more](/health/providers-and-insurers/build-hipaa-applications/)

[AWS Security Assurance Services Learn more](/professional-services/security-assurance-services/)

[Guidance on HIPAA and Cloud Computing Learn more](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)

[Create an AWS account](https://signin.aws.amazon.com/signup?request_type=register)

## Learn

- [What Is AWS?](/what-is-aws/?nc1=f_cc)
- [What Is Cloud Computing?](/what-is-cloud-computing/?nc1=f_cc)
- [What Is Agentic AI?](/what-is/agentic-ai/?nc1=f_cc)
- [Cloud Computing Concepts Hub](/what-is/?nc1=f_cc)
- [AWS Cloud Security](/security/?nc1=f_cc)
- [What's New](/new/?nc1=f_cc)
- [Blogs](/blogs/?nc1=f_cc)
- [Press Releases](https://press.aboutamazon.com/aws)

## Resources

- [Getting Started](/getting-started/?nc1=f_cc)
- [Training](/training/?nc1=f_cc)
- [AWS Trust Center](/trust-center/?nc1=f_cc)
- [AWS Solutions Library](/solutions/?nc1=f_cc)
- [Architecture Center](/architecture/?nc1=f_cc)
- [Product and Technical FAQs](/faqs/?nc1=f_dr)
- [Analyst Reports](/resources/analyst-reports/?nc1=f_cc)
- [AWS Partners](/partners/work-with-partners/?nc1=f_dr)

## Developers

- [Builder Center](https://builder.aws.com/?nc1=f_dr)
- [SDKs & Tools](https://builder.aws.com/build/tools?nc1=f_dr)
- [.NET on AWS](https://builder.aws.com/content/2zSx6gTiseJULEcqQFXqm3pzJoW/aws-tools-and-resources-net?nc1=f_dr)
- [Python on AWS](https://builder.aws.com/content/2zYQkMbmrsxHPtT89s3teyKJh79/aws-tools-and-resources-python?nc1=f_dr)
- [Java on AWS](https://builder.aws.com/content/2zZDrpGNFIOPAOT9PXifxnumRUC/aws-tools-and-resources-java?nc1=f_dr)
- [PHP on AWS](https://builder.aws.com/content/2zYR2daUzavSaUwnAI9X92Q1tfd/aws-tools-and-resources-php?nc1=f_dr)
- [JavaScript on AWS](https://builder.aws.com/content/2zYRIN2NxZTNLhwP9ZyaiJBEWrI/aws-tools-and-resources-javascript?nc1=f_dr)

## Help

- [Contact Us](/contact-us/?nc1=f_m)
- [File a Support Ticket](https://console.aws.amazon.com/support/home/?nc1=f_dr)
- [AWS re:Post](https://repost.aws/?nc1=f_dr)
- [Knowledge Center](https://repost.aws/knowledge-center?nc1=f_dr)
- [AWS Support Overview](/premiumsupport/?nc1=f_dr)
- [AWS Accessibility](/accessibility/?nc1=f_cc)
- [Legal](/legal/?nc1=f_cc)
- [Event Code of Conduct](/codeofconduct/?nc1=f_cc)
- [Event Terms & Conditions](/events/terms/?nc1=f_cc)

English

Back to top

Amazon is an equal opportunity employer and does not discriminate on the basis of protected veteran status, disability or other legally protected status. Veterans, military spouses, and people with disabilities are encouraged to apply.

[https://x.com/awscloud](https://x.com/awscloud) [https://www.facebook.com/amazonwebservices](https://www.facebook.com/amazonwebservices) [https://www.linkedin.com/company/amazon-web-services/](https://www.linkedin.com/company/amazon-web-services/) [https://www.instagram.com/amazonwebservices/](https://www.instagram.com/amazonwebservices/) [https://www.twitch.tv/aws](https://www.twitch.tv/aws) [https://www.youtube.com/user/AmazonWebServices/Cloud/](https://www.youtube.com/user/AmazonWebServices/Cloud/) [/podcasts/?nc1=f_cc](/podcasts/?nc1=f_cc) [/preferences/email/manage?nc1=f_icon](/preferences/email/manage?nc1=f_icon)

- [Privacy](/privacy/?nc1=f_pr)
- [Site terms](/terms/?nc1=f_pr)
- [Your Privacy Choices](#)
- [Cookie Preferences](#)

© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.
