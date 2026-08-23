---
type: 'vendor'
title: 'How to Use Databricks to Encrypt and Protect PII Data'
source_url: 'https://www.databricks.com/blog/2020/11/20/enforcing-column-level-encryption-and-avoiding-data-duplication-with-pii.html'
vendor: ['databricks']
industry: []
data_stack: ['databricks']
cloud: []
constraints: ['PII']
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[Skip to main content](#main)

[Product](/blog/category/platform/product)

November 20, 2020

# Enforcing Column-level Encryption and Avoiding Data Duplication With PII

Using Fernet encryption libraries, UDFs, and Databricks secrets to unobtrusively secure PII data

by  [Keyuri Shah](/blog/author/keyuri-shah) and  [Fred Kimball](/blog/author/fred-kimball)

This is a guest post by Keyuri Shah, lead software engineer, and Fred Kimball, software engineer, Northwestern Mutual.

Protecting PII (personally identifiable information) is very important as the number of data breaches and records with sensitive information exposed every day are trending upwards. To avoid becoming the next victim and protect users from identity theft and fraud, we need to incorporate multiple layers of data and information security.

As we use the Databricks platform, we need to make sure we are only allowing the right people access to sensitive information. Using a combination of Fernet encryption libraries, user-defined functions (UDFs), and Databricks secrets, Northwestern Mutual has developed a process to encrypt PII information and allow only those with a business need to decrypt it, with no additional steps needed by the data reader.

## The need for protecting PII

Managing any amount of customer data these days almost certainly requires protecting PII. This is a large risk for organizations of all sizes as cases such as the [Capital One data breach](https://www.capitalone.com/digital/facts2019/) resulted in millions of sensitive customer records being stolen due to a simple configuration mistake. While encryption of the storage device and column-masking at the table level are effective security measures, unauthorized internal access to this sensitive data still poses a major threat. Therefore, we need a solution that restricts a normal user with file or table access from retrieving sensitive information within Databricks.

However, we also need those with a business need to read sensitive information to be able to do so. We don’t want there to be a difference in how each type of user reads the table. Both normal and decrypted reads should happen on the same Delta Lake object to simplify query construction for data analysis and report construction.

## Building the process to enforce Column-level Encryption

Given these security requirements, we sought to create a process that would be secure, unobtrusive, and easy to manage. The below diagram provides a high-level overview of the components required for this process

![Process for Databricks Delta Lake to enforce column-level encryption and secure PII data.](https://www.databricks.com/wp-content/uploads/2020/11/blog-enforcing-encryption-1.png)

### Writing protected PII with Fernet

The first step in this process is to protect the data by encrypting it. One possible solution is the Fernet Python library. Fernet uses symmetric encryption, which is built with several standard cryptographic primitives. This library is used within an encryption UDF that will enable us to encrypt any given column in a dataframe. To store the encryption key, we use Databricks Secrets with access controls in place to only allow our data ingestion process to access it. Once the data is written to our Delta Lake tables, PII columns holding values such as social security number, phone number, credit card number, and other identifiers will be impossible for an unauthorized user to read.

### Reading the protected data from a view with custom UDF

Once we have the sensitive data written and protected, we need a way for privileged users to read the sensitive data. The first thing that needs to be done is to create a permanent UDF to add to the Hive instance running on Databricks. In order for a UDF to be permanent, it must be written in Scala. Fortunately, Fernet also has a Scala implementation that we can leverage for our decrypted reads. This UDF also accesses the same secret we used in the encrypted write to perform the decryption, and, in this case, it is added to the Spark configuration of the cluster. This requires us to add cluster access controls for privileged and non-privileged users to control their access to the key. Once the UDF is created, we can use it within our view definitions for privileged users to see the decrypted data.

Currently, we have two view objects for a single dataset, one each for privileged and non-privileged users. The view for non-privileged users does not have the UDF, so they will see PII values as encrypted values. The other view for privileged users does have the UDF, so they can see the decrypted values in plain text for their business needs. Access to these views is also controlled by the table access controls provided by Databricks.

In the near future, we want to leverage a new Databricks feature called [dynamic view functions](https://docs.databricks.com/security/access-control/table-acls/object-privileges.html#dynamic-view-functions). These dynamic view functions will allow us to use only one view and easily return either the encrypted or decrypted values based on the Databricks group they are a member of. This will reduce the amount of objects we are creating in our Delta Lake and simplify our table access control rules.

Either implementation allows the users to do their development or analysis without worrying about whether or not they need to decrypt values read from the view and only allows access to those with a business need.

### Advantages of this method of column-level encryption

In summary, the advantages of using this process are:

- Encryption can be performed using existing Python or Scala libraries
- Sensitive PII data has an additional layer of security when stored in Delta Lake
- The same Delta Lake object is used by users with all levels of access to said object
- Analysts are unobstructed whether or not they are authorized to read PII

For an example of what this may look like, the following notebook may provide some guidance:

- [Notebook Download](https://www.databricks.com/notebooks/enforcing-column-level-encryption.html)

### Additional resources:

**Fernet Libraries**

- [Python](https://cryptography.io/en/latest/fernet/)
- [Scala](https://github.com/l0s/fernet-java8)

**Create Permanent UDF**

- [Create functions](https://docs.databricks.com/spark/latest/spark-sql/language-manual/sql-ref-syntax-ddl-create-function.html)

**Dynamic View Functions**

- [View functions](https://docs.databricks.com/security/access-control/table-acls/object-privileges.html#dynamic-view-functions)

### Get the latest posts in your inbox

Subscribe to our blog and get the latest posts delivered to your inbox.

## Sign up

[View all blogs](/blog)

[databricks logo](https://www.databricks.com/)

Why Databricks

Discover

- [For App Developers](/developers)
- [For Executives](/why-databricks/executives)
- [For Startups](/product/startups)
- [Lakehouse Architecture](/product/data-lakehouse)
- [Databricks AI Research](/research/databricks-ai-research)

Customers

- [Customer Stories](https://www.databricks.com/customers)

Partners

- [Partner Overview](/partners)
- [Partner Program](/partners/partner-program)
- [Find a Partner](/partners/partner-directory)
- [Partner Spotlight](/partners/partner-spotlight)
- [Cloud Providers](/partners/cloud-partners)
- [Partner Solutions](/partners/consulting-and-si/partner-solutions)

Why Databricks

Discover

- [For App Developers](/developers)
- [For Executives](/why-databricks/executives)
- [For Startups](/product/startups)
- [Lakehouse Architecture](/product/data-lakehouse)
- [Databricks AI Research](/research/databricks-ai-research)

Customers

- [Customer Stories](https://www.databricks.com/customers)

Partners

- [Partner Overview](/partners)
- [Partner Program](/partners/partner-program)
- [Find a Partner](/partners/partner-directory)
- [Partner Spotlight](/partners/partner-spotlight)
- [Cloud Providers](/partners/cloud-partners)
- [Partner Solutions](/partners/consulting-and-si/partner-solutions)

Product

Databricks Platform

- [Platform Overview](/product/platform)
- [AI Assistant](/product/genie/one)
- [Application Development](/product/databricks-apps)
- [Artificial Intelligence](/product/artificial-intelligence)
- [Business Intelligence](/product/business-intelligence)
- [Customer Data Platform](/product/customerlake-cdp)
- [Data Engineering](/product/data-engineering)
- [Data Warehousing](/product/databricks-lakehouse)
- [Database](/product/lakebase)
- [Governance](/product/unity-catalog)
- [Neon](https://neon.com/)
- [Security](/product/lakewatch)
- [Sharing](/product/opensharing)

Pricing

- [Pricing Overview](/product/pricing)
- [Pricing Calculator](/product/pricing/product-pricing/instance-types)

[Open Source](/product/open-source)

Integrations and Data

- [Marketplace](/product/marketplace)
- [IDE Integrations](/product/data-science/ide-integrations)
- [Partner Connect](/partnerconnect)

Product

Databricks Platform

- [Platform Overview](/product/platform)
- [AI Assistant](/product/genie/one)
- [Application Development](/product/databricks-apps)
- [Artificial Intelligence](/product/artificial-intelligence)
- [Business Intelligence](/product/business-intelligence)
- [Customer Data Platform](/product/customerlake-cdp)
- [Data Engineering](/product/data-engineering)
- [Data Warehousing](/product/databricks-lakehouse)
- [Database](/product/lakebase)
- [Governance](/product/unity-catalog)
- [Neon](https://neon.com/)
- [Security](/product/lakewatch)
- [Sharing](/product/opensharing)

Pricing

- [Pricing Overview](/product/pricing)
- [Pricing Calculator](/product/pricing/product-pricing/instance-types)

Open Source

Integrations and Data

- [Marketplace](/product/marketplace)
- [IDE Integrations](/product/data-science/ide-integrations)
- [Partner Connect](/partnerconnect)

Solutions

Databricks For Industries

- [Communications](/solutions/industries/telecommunications)
- [Financial Services](/solutions/industries/financial-services)
- [Healthcare and Life Sciences](/solutions/industries/healthcare-and-life-sciences)
- [Manufacturing](/solutions/industries/manufacturing-industry-solutions)
- [Media and Entertainment](/solutions/industries/media-and-entertainment)
- [Public Sector](/solutions/industries/public-sector)
- [Retail](/solutions/industries/retail-industry-solutions)
- [View All](/solutions)

Cross Industry Solutions

- [AI Agents](/solutions/ai-agents)
- [AI Governance](/solutions/industries/ai-governance)
- [Cybersecurity](/solutions/industries/cybersecurity)
- [Marketing](/solutions/industries/marketing)

[Data Migration](/solutions/migration)

[Forward Deployed Engineering](/forward-deployed-engineering)

[Solution Accelerators](/solutions/accelerators)

Solutions

Databricks For Industries

- [Communications](/solutions/industries/telecommunications)
- [Financial Services](/solutions/industries/financial-services)
- [Healthcare and Life Sciences](/solutions/industries/healthcare-and-life-sciences)
- [Manufacturing](/solutions/industries/manufacturing-industry-solutions)
- [Media and Entertainment](/solutions/industries/media-and-entertainment)
- [Public Sector](/solutions/industries/public-sector)
- [Retail](/solutions/industries/retail-industry-solutions)
- [View All](/solutions)

Cross Industry Solutions

- [AI Agents](/solutions/ai-agents)
- [AI Governance](/solutions/industries/ai-governance)
- [Cybersecurity](/solutions/industries/cybersecurity)
- [Marketing](/solutions/industries/marketing)

Data Migration

Forward Deployed Engineering

Solution Accelerators

Resources

[Documentation](https://www.databricks.com/databricks-documentation)

[Customer Support](https://www.databricks.com/support)

[Community](https://community.databricks.com/)

Learning

- [Training](/learn/training/home)
- [Certification](https://www.databricks.com/learn/training/certification)
- [Free Edition](/learn/free-edition)
- [University Alliance](/university)
- [Databricks Academy Login](https://www.databricks.com/learn/training/login)

Events

- [Data + AI Summit](/dataaisummit)
- [Data + AI World Tour](/dataaisummit/worldtour)
- [AI Days](https://www.databricks.com/ai-days)
- [Event Calendar](/events)

Blog and Podcasts

- [Databricks Blog](/blog)
- [AI Blog](/blog/category/databricks-ai)
- [Data Brew Podcast](/discover/data-brew)
- [Champions of Data & AI Podcast](/discover/champions-of-data-and-ai)

Resources

Documentation

Customer Support

Community

Learning

- [Training](/learn/training/home)
- [Certification](https://www.databricks.com/learn/training/certification)
- [Free Edition](/learn/free-edition)
- [University Alliance](/university)
- [Databricks Academy Login](https://www.databricks.com/learn/training/login)

Events

- [Data + AI Summit](/dataaisummit)
- [Data + AI World Tour](/dataaisummit/worldtour)
- [AI Days](https://www.databricks.com/ai-days)
- [Event Calendar](/events)

Blog and Podcasts

- [Databricks Blog](/blog)
- [AI Blog](/blog/category/databricks-ai)
- [Data Brew Podcast](/discover/data-brew)
- [Champions of Data & AI Podcast](/discover/champions-of-data-and-ai)

About

Company

- [Who We Are](/company/about-us)
- [Our Team](/company/leadership-team)
- [Databricks Ventures](/databricks-ventures)
- [Contact Us](/company/contact)

Careers

- [Open Jobs](/company/careers/open-positions)
- [Working at Databricks](/company/careers)

Press

- [Awards and Recognition](/company/awards-and-recognition)
- [Newsroom](/company/newsroom)

[Security and Trust](/trust)

About

Company

- [Who We Are](/company/about-us)
- [Our Team](/company/leadership-team)
- [Databricks Ventures](/databricks-ventures)
- [Contact Us](/company/contact)

Careers

- [Open Jobs](/company/careers/open-positions)
- [Working at Databricks](/company/careers)

Press

- [Awards and Recognition](/company/awards-and-recognition)
- [Newsroom](/company/newsroom)

Security and Trust

[databricks logo](https://www.databricks.com/)

Databricks Inc.  
160 Spear Street, 15th Floor  
San Francisco, CA 94105  
1-866-330-0121

- [](https://www.linkedin.com/company/databricks)
- [](https://www.facebook.com/pages/Databricks/560203607379694)
- [](https://twitter.com/databricks)
- [](https://www.databricks.com/feed)
- [](https://www.glassdoor.com/Overview/Working-at-Databricks-EI_IE954734.11,21.htm)
- [](https://www.youtube.com/@Databricks)

![](<>)

[See Careers](https://www.databricks.com/company/careers)  
[at Databricks](https://www.databricks.com/company/careers)

- [](https://www.linkedin.com/company/databricks)
- [](https://www.facebook.com/pages/Databricks/560203607379694)
- [](https://twitter.com/databricks)
- [](https://www.databricks.com/feed)
- [](https://www.glassdoor.com/Overview/Working-at-Databricks-EI_IE954734.11,21.htm)
- [](https://www.youtube.com/@Databricks)

© Databricks 2026. All rights reserved. Apache, Apache Spark, Spark, the Spark Logo, Apache Iceberg, Iceberg, and the Apache Iceberg logo are trademarks of the [Apache Software Foundation](https://www.apache.org/).

- [Privacy Notice](https://www.databricks.com/legal/privacynotice)
- |[Terms of Use](https://www.databricks.com/legal/terms-of-use)
- |[Modern Slavery Statement](https://www.databricks.com/legal/modern-slavery-policy-statement)
- |[California Privacy](https://www.databricks.com/legal/supplemental-privacy-notice-california-residents)
- |[Your Privacy Choices](#yourprivacychoices)
- ![](https://www.databricks.com/sites/default/files/2022-12/gpcicon_small.png)
