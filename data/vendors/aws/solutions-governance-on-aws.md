---
type: 'vendor'
title: 'Overview'
source_url: 'https://docs.aws.amazon.com/solutions/governance-on-aws/'
vendor: ['aws']
industry: []
data_stack: []
cloud: ['aws']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

# Guidance for Governance on AWS

## Overview

Governance is the ability to implement executive board policies that your AWS Cloud environment must adhere to. This policy includes the rules for your environment, defines risks, and informs alignment of internal policies. A portion of your governance policies is embedded in all the other capabilities across your environment to ensure you adhere to your policy requirements.  

## How it works

These technical details feature an architecture diagram to illustrate how to effectively use this solution. The architecture diagram shows the key components and their interactions, providing an overview of the architecture's structure and functionality step-by-step.

[Download the architecture diagram](https://d1.awsstatic.com/solutions/guidance/architecture-diagrams/governance-on-aws.pdf)

![Architecture diagram](/images/solutions/governance-on-aws/images/governance-on-aws-1.png) Step 1

Establish a relationship with your cloud provider, understanding what services are available in what region, and the different requirements they fulfill.

Step 2

Define your cloud consumption policies and strategy. What services will be available in the cloud? How will your workloads and applications be deployed on the cloud?

Step 3

Build knowledge about the cloud and the different technologies it provides across your organization. Identify key stakeholders that will be involved when you establish the different capabilities of your AWS environment. Build cloud capability and enable your stakeholders across your organization.

Step 4

Identify what compliance frameworks you need to adhere your workloads on the cloud to, and learn about the shared responsibility model. Ensure your data and your workloads provide you with enough information to report your compliance requirements.

Step 5

Use AWS Artifact to collect the AWS security and compliance reports and select online agreements. Reports available in AWS Artifact include service organization control (SOC) reports, payment card industry (PCI) reports, and certifications from accreditation bodies across geographies and compliance verticals that validate the implementation and operating effectiveness of AWS security controls.

## Implementation resources

**Establish the relationship with your cloud services provider**

#### Scenario

Establish the relationship with your cloud services provider

- Confirm cloud strategy, sponsor, and executive owner
- Review the cloud provider Customer Agreement and determine which contracting party applies
- Create / confirm account with your cloud provider
- Conduct risk and compliance assessments for your cloud service provider using available reports
- Review, accept, and manage legal and procurement agreements with your cloud provider

#### Overview

Establish the relationship with your cloud services provider

When starting your cloud journey, you need to establish a commercial relationship with your cloud services provider. You will complete relevant customer agreements and set up preferences for communication and how you will pay for cloud services consumed. For larger organizations, you need to confirm which parts of your organization are responsible for these functions.

When selecting your cloud provider, ensure that you decide on your cloud strategy. A cloud-first strategy allows you to bring new workloads, projects, and experiments to your cloud environment. This frees up the load from your on-premises resources, if you have any. When new workloads are designed for the cloud, this allows you to realize the cloud benefits faster.  

When you select your cloud provider, you can conduct risk and compliance assessments. Each cloud provider has different tools you can use to obtain those reports. [AWS Artifact](/artifact/) is a self-service portal at no cost where you can get AWS compliance reports.

When establishing a relationship with a cloud provider, you can benefit from procurement agreements. Ensure that you review and accept the terms included in these agreements, and if needed, consult with your legal team.

**Define how cloud services are consumed**

#### Scenario

Define how cloud services are consumed

- Select the main region (your home region) for using cloud services from your cloud provider
- Select additional regions where you will not restrict the use of AWS services. Restrict other region usage
- Establish governance and policies on specific region usage when needed
- Confirm billing details and preferences, including payment currency
- Establish an architectural strategy for how your cloud environment will be structured
- Determine account isolation boundaries and document policy on creation of new resource isolation boundaries
- Incorporate usage of cloud services into Application Portfolio Management

#### Overview

Define how cloud services are adopted

Before you start building your cloud environment, you need to define policies on cloud consumption. Having your governance policies well-defined ensures that the foundational environment you build will support your workloads, and will enable you to define processes to follow to deploy, operate, and govern the different workloads across your environment.

As a part of defining how cloud services are consumed, you need to confirm which risk and compliance frameworks apply, and how your environment will meet those requirements on an ongoing basis.

Another key component of managing and governing your cloud environment is the operating model that you put in place. You need to define roles and responsibilities for how you will address the customer components of the Shared Responsibility Model. Many customers decide to set up a Cloud Center of Excellence (CCoE), Cloud Business Office (CBO), or a cloud team which is responsible for developing the approach to implementing cloud technology at scale for your organization.

**Build cloud capability across your organization**

#### Scenario

Build cloud capability across your organization

- Confirm roles for decision-making on usage of cloud services, including maintenance of policies on cloud usage, risk, and compliance
- Determine operating model with roles and responsibilities, including RACI matrix and alignment to the Shared Responsibility Model
- Establish Executive and Board reporting requirements on AWS supplier performance (SLAs) and security posture, such as security alerts from security bulletins page, required AWS Config conformance packs, patch status from SSM, availability SLAs, and overall security score from AWS Security Hub  

#### Overview

Build cloud capability across your organization

As you prepare to offer cloud as a service for your organization, consider identifying an owner who will sponsor the cloud adoption, and they can build a team with the appropriate skill sets to deploy, operate, and govern the environment. As part of your foundation journey, we provide an estimated level of effort and the skill sets needed for building and operating each of the capabilities. To maximize the gains/outputs from your cloud initiatives, the [Cloud Adoption Framework Governance perspective](/whitepapers/latest/overview-aws-cloud-adoption-framework/governance-perspective.html) includes details to help you identify what needs to be done in these areas.

As your cloud environment grows, responsibilities within your cloud environment will grow, and you need to ensure that you identify the appropriate owners to support the different workloads you will be deploying. Designate appropriate stakeholders to be aware of what is being built in your environment, to unblock your cloud team and your developer teams when they need to establish certain capabilities or deploy their workloads to the platform. When the appropriate stakeholders are identified early on, you can make the right decisions for your environment faster. You can use the [primary functional areas](/whitepapers/latest/establishing-your-cloud-foundation-on-aws/working-with-the-capabilities.html) for the Cloud Foundations capabilities to identify stakeholders in your organization.

Once the different stakeholders are identified, we recommend you align them to the [shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/) . This enables you to define a cloud operating model for your environment, where all the different teams involved in creating or enhancing your environment are aware of what needs to be done to move forward. Processes and standards are easier to manage, and they are visible across your organization.

Finally, as your organization grows, different teams will benefit from a training and certification program. This will allow the teams and stakeholders within your organization to stay up to date with the newest technologies, methodologies, and recommendations when managing your environment and the workloads running on it.

When establishing standards for your cloud environment, you need to define a home region where your data will be kept, and whether there are any applicable region restrictions that should be considered. You also need to assign different stakeholders to each of the capabilities that need to be established in your environment, according to your policy. This enables you to establish a standard approve/deny process for new projects and workloads for your cloud environment.

Each team can create an isolated environment for their workloads, to enable them to innovate and experiment. Different policies can match to different use cases in your environment, such as:

- Sandbox usage
- Training time
- How/when to request a new isolated workload environment
- The baseline configuration of your workload environment

As you prepare to establish your environment, the Cloud Foundations capabilities provide a guided path to establish an environment based on AWS best practices and recommendations that enable you to implement each of these capabilities in your environment, adhering to your Governance policies and requirements.

As you get started with your cloud provider, certain standards will allow you to simplify the management of your cloud environment, such as setting up standards and roles that the teams will use to interact with the cloud provider, defining different namespaces and email addresses for each team to use when accessing the environment, and determining the level of internal support within your organization and from the cloud provider.

Other standards that we walk you through within other capabilities will allow you to define and develop mechanisms, such as:

1. How to create, test, and create cloud policies
2. How to define a strategy to source and distribute software and Infrastructure as Code
3. Determine what type of risk you can assign to your workloads, from those that need minimal governance, to those that are high risk, and will need board or CCoE approval to be deployed, updated, or removed

Establishing capabilities and standardizing process across your organization following an operating model you define enables your teams to start realizing the benefit and power of the cloud. It allows your teams to innovate faster and focus on key business differentiators, freeing them for complex and repetitive administrative tasks to manage their environment(s).

**Establish standards for your cloud environment**

#### Scenario

Establish standards for your cloud environment

- Confirm which compliance and risk frameworks apply
- Confirm roles, group email address(es), and team who will interact with the cloud provider from a supplier governance perspective
- Select the appropriate level of support for your organization
- Establish mechanisms to develop and test cloud policies
- Determine sourcing and distribution strategy for how you procure and deploy software and distribute infrastructure as code
- Determine which types of workloads (low, medium, high) inherent risk can be migrated to cloud and required level of governance

#### Overview

Define how cloud services are adopted

Before you start building your cloud environment, you need to define policies on cloud consumption. Having your governance policies well-defined ensures that the foundational environment you build will support your workloads, and enables you to define processes to follow to deploy, operate, and govern the different workloads across your environment.

As a part of defining how cloud services are consumed, you need to confirm which risk and compliance frameworks apply, and how your environment will meet those requirements on an ongoing basis.

Another key component of managing and governing your cloud environment is the operating model that you put in place. You need to define roles and responsibilities for how you will address the customer components of the Shared Responsibility Model. Many customers decide to set up a CCoE, Cloud Business Office (CBO), or a cloud team which is responsible for developing the approach to implementing cloud technology at scale for your organization.

#### AWS Compliance Program

The [AWS Compliance Program](https://aws.amazon.com/compliance/programs/) is used by customers to understand the robust controls in place at AWS that maintain security and compliance in the cloud. IT standards that AWS complies with are broken out by [Certifications and Attestations](https://aws.amazon.com/compliance/programs/#Certifications_.2F_Attestations.3A) , [Laws/Regulations](https://aws.amazon.com/compliance/programs/#Laws_.2F_Regulations.3A) , [Privacy](https://aws.amazon.com/compliance/programs/#Privacy) , and [Alignments/Frameworks](https://aws.amazon.com/compliance/programs/#Alignments_.2F_Frameworks.3A) . You can use this information in the compliance programs as inputs and guides to build your own compliance program for how your organization can use AWS.

**Respond to growth or change**

#### Scenario

Respond to growth or change

- Establish supplier relationship with preferred Partner(s) and/or cloud provider  
Professional Services
- Establish procurement process to make use of marketplaces from cloud services providers if/when required
- Establish a CCoE to coordinate efforts related to cloud adoption
- Transfer ownership of AWS accounts and establish new agreements in the case of a merger, acquisition, or divestiture  

#### Overview

Respond to growth or change

A CCoE or a Cloud team can help to express and manage the cloud strategy you are following based on your governance policies, will assist with coordination across different teams to set up governance, and assist in architecting the cloud environment and new workloads that will be deployed on the cloud. A CCoE or a Central Cloud team will drive the established standards across your organization, helping to drive cloud adoption within your organization. Additionally, the CCoE can perform the function of a training and certification enabler for the teams across your organization.

Thinking about your home region is not always something that is done once at the start of your cloud journey. Situations can arise, such as a merger or acquisition of another company, or an expansion of your company into other geographic regions, that may cause you to revisit the regions where you operate and run cloud workloads. To respond to these kinds of events, there are external vendors, partners, and products that can be used to help unlock your journey. However, processes to procure products through the [AWS Marketplace](https://aws.amazon.com/marketplace) or establishing relationships with preferred Partner(s) or Professional Services allows you to quickly use industry standard and backfill the skill sets you need to deploy and operate your environment. A CCoE can help coordinate these relationships for your organization, and help make the right products available to the necessary teams.

**Industry-specific governance**

#### Scenario

Industry-specific governance

- (FSI) Assign ownership and manage three lines of defense (3LOD) with automation to reduce manual assurance efforts
- (FSI) Establish engagement with regulator(s) in applicable jurisdictions as required for hosting workloads in the cloud
- (HIPAA) Assign ownership and manage relevant compliance standards (for example HIPAA, PCI-DSS, GDPR) with automation to reduce manual efforts

#### Overview

For customers operating in certain industries such as financial services, healthcare, or government, specific governance requirements may apply. As part of setting up governance for your foundational cloud environment, we recommend that you build in this capability from the start to address these specific industry governance requirements. We also recommend that you assign specific roles and responsibilities and work with your cloud services provider to use available guidance, solutions, or Partner support to assist you with meeting your industry-specific governance requirements with automation and optimization. For more information, refer to the [AWS Compliance Center](https://aws.amazon.com/compliance/).

[Read usage guidelines](/solutions/guidance-disclaimers/)
