---
type: 'vendor'
title: 'A multi-agent approach to audience intelligence'
source_url: 'https://www.databricks.com/blog/multi-agent-approach-audience-intelligence'
vendor: ['databricks']
industry: ['media_agency']
data_stack: ['databricks']
cloud: []
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[Skip to main content](#main)

[Solutions](/blog/category/platform/solutions)

April 6, 2026

# A multi-agent approach to audience intelligence

Building an AI-powered audience generator for agencies and advertisers on Databricks

by  [Bradley Munday](/blog/author/bradley-munday) and  [Tyler Hickey](/blog/author/tyler-hickey)

Summary

- Natural Language Audience Generation: Advertisers can now use agentic AI and Databricks Genie to translate strategic campaign briefs into precise data segments using natural language, removing the need for manual SQL coding.
- Automated Affinity Discovery: The Affinity Agent identifies non-obvious customer behaviors - like luxury travelers over-indexing on cryptocurrency - by running statistically validated lift calculations against massive datasets in seconds.
- Unified AI Orchestration: By using Agent Bricks as a supervisor, organizations bridge the gap between strategic intent and data execution, collapsing traditional weeks-long iteration cycles into a single, seamless conversation.

## Defining the North Star

Every advertising campaign shares the same core objectives: to reach the right audience, create meaningful engagement, and deliver measurable results. Where campaigns begin to differ is in how they pursue those objectives. The divergence starts in the strategy phase, where planners and strategists align on clear goals that, when executed effectively, drive the desired outcomes. At this stage, the business is behind the wheel—drawing on years of experience with its brand, messaging, and past campaign performance to guide decisions. The result is a campaign brief that serves as the North Star for all downstream activities, including audience creation, data science modeling, and activation. This blog explores how the common challenges advertisers face today can be resolved through an AI-powered audience generation solution on Databricks.

## The Gap between Strategy and Execution

It’s during this exchange of campaign briefs between the hands of the business and those of data teams that agencies and advertisers begin to face challenges in aligning the core strategy to execution, Including:

1. **Strategy Dilution**: While briefs are intended to be prescriptive and clear in their definition, translating strategy into “data terms” is a challenge for any analyst. Inevitably, bits and bytes are lost during communication, and it’s critically important to not lose the most important bits.
2. **Incomplete Strategies**: In the reverse flow, insights from data teams don’t always make it back to the business, limiting the ability to act on non-obvious patterns and create competitive advantage. It’s through these data-driven discoveries that agencies and advertisers differentiate themselves, challenging industry conventions and assumptions held by competitors to approach the market in unique ways.
3. **Data Blind Spots**: Both sides operate with constraints—planners rely on a narrow set of signals, while data teams may lean too heavily on familiar attributes. With datasets this large and complex, neither group is ever fully data-informed. Considering most agencies and advertisers possess datasets containing thousands of attributes on millions of existing and potential customers, it’s fair to assume that even the most experienced of data users has their blind spots.

To summarize these challenges, they are each a symptom of a fragmented process where:

- The people closest to the strategy are furthest from the data.
- The people closest to the data lack the full strategic context.
- Regardless of one's access to data, their scope is limited.

## Building the Bridge on Databricks

One can’t ignore the role that technology has played in the hardening of these sub-optimal processes. Technology lacked the ability to accurately translate intent and data platforms themselves offered few tools to synthesize data insights in a meaningful way for the business. The most effective bridge between these two groups was either a data-curious strategist or a data analyst who could articulate an organization's mission, product-market fit, and strategic goals. This also assumes the strategist has access to the database, and the analyst has the ear of the business (a big assumption).

To address the gap between intent and execution that persists today, our AI-powered solution, built on Databricks Data + AI Platform, enables advertisers and agencies to build audiences in natural language, discover previously unknown patterns in their data, and drive more effective campaigns.

![AI audience builder architecture](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-1.png)

*[Figure 1. AI audience builder architecture](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-1.png)*

1. **Data Sources:** First-party data and partner/licensed data are ingested into the platform
2. **Data Curation:** Spark Declarative Pipelines cleanse, transform, and unify raw data into population attributes table in Unity Catalog
3. **Audience Genie Space:** Curated Genie Space on top of Population Table translates natural language requests into audience segments
4. **Affinity Agent:** UC Tools analyze additional audience affinities by computing statistical patterns
5. **Supervisor Agent:** [Agent Bricks](https://www.databricks.com/product/artificial-intelligence/agent-bricks) orchestrates multi-agent system, routing requests to Genie & Affinity sub agents
6. **App:** A Databricks App gives advertisers an intuitive interface to describe audiences, view affinities, and explore insights
7. **Activate & Save:** Audiences are saved as tables in Unity Catalog and activated to downstream execution channels (e.g., DSPs, email platforms, social media, etc.)

At its core, this solution leverages Databricks’ latest advancements in agentic AI – Genie, custom tool-calling agents, and Agent Bricks – to more effectively surface insights to advertisers and enable faster audience segmentation against unified population datasets that span hundreds of millions of consumers and thousands of attributes.

Consider an example to make this tangible, where a campaign planner is preparing a brief for a luxury travel brand promoting exclusive resort packages. The brief calls for "affluent travelers aged 35-54 who frequently book premium experiences." Traditionally, this brief lands on an analyst's desk, who translates it into SQL queries to segment audiences and perform adhoc analyses. While this is a reasonable approach, it inevitably narrows the strategic intent into a handful of familiar attributes.

Instead of needing to manually generate SQL, our solution enables the planner to directly describe that audience directly in natural language. Genie then translates this into a precise query against millions of records in just seconds, complete with the SQL logic behind it for full transparency.

But the real unlock comes next. The system automatically analyzes additional behavior and attributes that define this audience to identify unrealized patterns. These findings and new insights are a gamechanger. Examples for this segment may include:

- Over-indexes as early technology adopters compared to the rest of the population
- Invests in cryptocurrency 2.5x the baseline rate
- Shows a strong affinity for wellness and spa content (e.g., exceptional fitness commitment 5.7x)

![AI audience builder](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-2.png)

*[Figure 2. AI audience builder example](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-2.png)*

And the best part is, these are not assumptions. They are statistically validated lift calculations against the full population. Planners are no longer working from just a brief, but rather working from a brief enriched with discoveries that can reshape creative strategy, media placement, and channel selection.

Further, this solution drives tangible and compounding business impact:

- Campaigns move from idea to activation faster, compressing planning cycles that previously took days or weeks
- Planners can respond to market shifts, pacing issues, or clients requests in real time without waiting on analyst queues
- Embedding strategic intent directly into the audience generation process leads to better targeting and campaign performance

However, making this experience feel seamless requires careful orchestration behind the scenes. In the following sections, we will break down the three core building blocks that power this solution, including how each component works, why it's built the way it is, and the design decisions that ensure this system is production-ready.

## Databricks Genie: Bringing Natural Language to your Data

The first step teams take in any audience workflow is defining the “who” for their campaigns to reach. Genie Spaces allow advertisers to do this in natural language, translating requests like "find affluent travelers aged 35-54 who frequently book premium experiences" into governed SQL queries executed against the population table, without any direct interaction with the data team.

![Genie responding to user query](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-3.png)

*[Figure 3. Genie responding to user query](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-3.png)*

While Genie may reduce the direct interactions between strategy and data teams, the data teams still play a critical role in this workflow by meticulously curating the layer under the hood. A Genie Space is only as good as the context and data it's given, and for audience generation, that means investing in four areas:

1. A strong data model, including pre-joined or de-normalized gold tables and metric views
2. Descriptive column comments on every attribute in the table
3. Example SQL queries that teach Genie the patterns and conventions of the data
4. Text instructions that define business terms and scoring logic the model wouldn't otherwise know

By spending time curating the data layer and metadata, the data team’s expertise is encoded once, continuously improved over time, and scaled across the entire organization. Every executive, planner, and strategist benefits from the same curated logic without filing a ticket or waiting for manual, ad-hoc analyses to be performed.

For example, the Genie in this solution is configured with over 30 curated example queries spanning common audience patterns, from "find consumers with auto purchase intent and credit scores above 750" to "identify luxury travelers in urban areas with high net worth." These examples don't just improve accuracy, they teach Genie how the organization thinks about its data.

![SQL queries](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-4.png)

*[Figure 4. Example SQL queries](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-4.png)*

The result is a system where a planner can describe their target audience for a given campaign brief and receive accurate segment data, audience size, percentage comparisons against the total population, and sample data – all within seconds.

Ultimately, Genie fundamentally changes how marketing teams can build audience segments and execute new campaigns by:

- Democratizing access to data by shifting audience creation from a technical task to a strategic conversation. Any planner can describe the audience they need without knowledge of the underlying table schema or SQL syntax
- Compressing iteration cycles from days to seconds, enabling teams to test more hypotheses and refine targeting in real time rather than waiting on analyst queues
- Capturing institutional knowledge – every curated query, column comment, and text instruction encodes the organization's data expertise into a reusable layer that onboards new team members and standardizes how audiences are built across campaigns
- Strengthening governance by logging the natural language intent and the generated SQL for every audience, creating an audit trail that is readable by both technical and non-technical stakeholders

Together, these benefits transform audience creation from a bottleneck into a competitive advantage.

## Affinity Agent: Discovering Unknown Relationships and Audiences

When building a comprehensive audience builder solution, defining the audience is only half the battle. The real strategic value comes from understanding the “what else” about the audience. In other words, are there unthought-of patterns, behaviors, tendencies, and affinities that might strengthen the overall campaign distribution strategy? This is where the Affinity Agent becomes a differentiator.

Once Genie builds a segment, the Affinity Agent automatically takes that segment and analyzes it against the full population to surface statistically significant patterns. In advertising terms, it answers the question every strategist should be asking but rarely has the time or tools to pursue: "Beyond the criteria I specified, what actually makes this audience unique?"

In this solution, the answer comes in the form of lift. This simple yet powerful metric compares how frequently an attribute appears in a given audience segment versus the general population. A lift of 2.0x means the given audience is twice as likely to exhibit that trait. For a campaign planner, these insights are immediately actionable. Let’s take, for example, the luxury travel audience that over-indexes on wellness content and cryptocurrency investment. These signals directly inform execution and instead of running standard travel ads across broad lifestyle channels, the media team might shift spend towards premium wellness publications, podcast sponsorships in the personal finance space, or programmatic placements on fintech platforms. The creative team, meanwhile, might lead with messaging around experiential wellness retreats rather than generic resort imagery.

Under the hood, the Affinity Agent follows a deliberate design pattern, which equips an LLM with tools that execute statistical analysis for a given audience. The agent reasons which analyses to run, but every number is computed by deterministic tools. These tools are functions which are pre-registered and governed in Unity Catalog.

In practice, a given audience serves as the input data, and the agent leverages Unity Catalog functions to compute lift against the baseline population, and returns only results that meet minimum confidence and support thresholds. The following pseudo code snippet describes how this function operates.

This separation between reasoning and computation is a deliberate and critical choice for advertising. When millions of dollars in media spend depend on audience insights, those insights need to be auditable, reproducible, and grounded in real data. By governing every analytical function through Unity Catalog, the system provides a clear lineage from natural language questions to SQL execution to statistical results. The LLM adds intelligence to the workflow without introducing risk.

## Agent Bricks: Creating Multi-Agent Audience Intelligence

With Genie handling audience creation and the Affinity Agent surfacing hidden patterns, the final piece is assembling an intelligent orchestration layer to ensure these components work together as a single, coherent experience rather than disconnected tools.

Agent Bricks makes this possible in just minutes with a few clicks. The pre-built Supervisor Agent receives every user request, determines which sub-agent is best equipped to handle it, and routes it accordingly. A request like "build me an audience of frequent luxury travelers" goes to Genie. A follow-up like "what else defines this group?" is routed to the Affinity Agent. And when a user asks a complex question like "find high-income outdoor enthusiasts and tell me what makes them unique," the supervisor chains both agents together – Genie builds the segment, then the Affinity Agent analyzes it – and returns a unified response.

![Supervisor agent routing request to appropriate sub-agent](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-5.png)

*[Figure 5. Supervisor agent routing request to appropriate sub-agent](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-5.png)*

For end users of this multi-agent system, the power lies in the fact that they never need to know which agent is doing the work, because the supervisor agent works together with its sub-agents to handle the requests. As a result, the experience is seamless and feels like a single conversation.

Beyond routing, the supervisor is what transforms individual agents into a compounding system. By orchestrating the handoff between Genie and the Affinity Agent, it creates a feedback loop between human intent and data discovery that doesn't exist in traditional workflows. A planner can build an audience, review the affinities that surface, and immediately refine the segment based on what they've learned, all within the same conversation. This collapses what is typically a days-to-weeks cycle of briefs, analyst queues, QA, and iteration into minutes, enabling teams to test more hypotheses and arrive at stronger audiences faster. Over time, every interaction builds a growing library of audience definitions and discovered patterns, which leads to institutional knowledge that compounds with each campaign and scales to every user in the organization.

## The Finished Product

So far, we've explored how Genie translates strategic intent into governed audience segments, how the Affinity agent uncovers patterns that no one thought to look for, and how the Supervisor agent orchestrates the two sub-agents into a seamless workflow. But these capabilities only deliver value if the people who need them most can actually access them without navigating Databricks workspaces, notebooks, or API endpoints. Databricks Apps remove this barrier, providing a native application layer that brings the entire multi-agent system into a single, intuitive interface purpose-built for the end user.

Within this app, advertisers can:

*Build, discover, and iterate on audience segments through natural language.*

![Build audiences through natural language](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-6.png)

*[Figure 6. Build audiences through natural language](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-6.png)*

*Explore details about audiences, including underlying SQL code used to generate, affinity summaries, and recommendations for placement and campaign strategies.*

![AI/BI Dashboards](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-7.gif)

*Dive deeper into audience segments with integrated AI/BI Dashboards embedded directly within the app.*

![Unity Catalog](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-8.gif)

*Save audiences as persisted tables in Unity Catalog for future viewing, management, and auditability, then, export audiences to execution channels for campaign activation.*

![Tables in Unity Catalog](https://www.databricks.com/sites/default/files/inline-images/multi-agent-approach-audience-intelligence-blog-img-9.gif)

## Democratizing the Future of Audience Creation

The gap between strategic intent and data execution has persisted for years – not because organizations lack data, but because their tools weren't built to bridge it. With Databricks' agentic AI capabilities, that bridge now exists, empowering all personas with the tools to discover and build high-quality audiences that differentiate. That audience you didn't know you were looking for is already in your data, you just needed the right system to find and curate it.

To learn more about best practices for building an effective Genie Space, check out this [guide](https://docs.databricks.com/aws/en/genie/best-practices).

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
