---
type: 'vendor'
title: 'How SSO works with Databricks and your Identity Provider: A walkthrough'
source_url: 'https://community.databricks.com/t5/technical-blog/how-sso-works-with-databricks-and-your-identity-provider-a/ba-p/41021'
vendor: ['databricks']
industry: []
data_stack: ['databricks', 'saml-sso']
cloud: []
constraints: ['SAML SSO']
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[registration-reminder-modal](#)

 Learning & Certification

-
  *
    +  [Certifications](/t5/certifications/ct-p/databricks-certifications)
-
  *
    +  [Learning Paths](/t5/learning-paths/ct-p/databricks-learning-paths)
-
  *
    +  [Databricks Product Tours](/t5/databricks-product-tours/ct-p/Databricks-Product-Tours)
-
  *
    +  [Get Started Guides](/t5/get-started-guides/tkb-p/Get-Started-Guides)
 Discussions

-
  *
    +  [Databricks Platform Discussions](/t5/databricks-platform-discussions/ct-p/databricks-platform-discussion)
    +  [Administration & Architecture](/t5/administration-architecture/bd-p/administration-and-architecture)
    +  [Data Engineering](/t5/data-engineering/bd-p/data-engineering)
    +  [Data Governance](/t5/data-governance/bd-p/data-governance)
    +  [Generative AI](/t5/generative-ai/bd-p/GenAI-Insight-Hub)
    +  [Machine Learning](/t5/machine-learning/bd-p/machine-learning)
    +  [Warehousing & Analytics](/t5/warehousing-analytics/bd-p/warehousing-and-analytics)
-
  *
    +  [Community Discussions](/t5/community-discussions/ct-p/databricks-learning-discussion)
    +  [Certifications](/t5/certifications/bd-p/databricks-certification-discussion)
    +  [Training offerings](/t5/training-offerings/bd-p/databricks-training-discussion)
    +  [Get Started Discussions](/t5/get-started-discussions/bd-p/get-started-with-databricks-discussion)
    +  [Databricks Free Edition Help](/t5/databricks-free-edition-help/bd-p/Databricks-Express-Setup)
 Resources

-
  *
    +  [Get Started Resources](/t5/get-started-resources/ct-p/GetStartedResources)
-
  *
    +  [Announcements](/t5/announcements/bd-p/Announcements)
-
  *
    +  [Community Articles](/t5/community-articles/bd-p/Knowledge-Sharing-Hub)
-
  *
    +  [Databricks TV](/t5/databricks-tv/bg-p/DatabricksTV)
-
  *
    +  [Learning Events](/t5/learning-events/eb-p/databricks-community-events)
-
  *
    +  [MVP Articles](/t5/mvp-articles/bd-p/MVP-ARTICLES)
-
  *
    +  [Product Platform Updates](/t5/product-platform-updates/bg-p/Product-Platform-Updates)
-
  *
    +  [Support FAQs](/t5/support-faqs/tkb-p/Support-FAQs)
-
  *
    +  [Technical Blog](/t5/technical-blog/bg-p/technical-blog)
-
  *
    +  [Community Events](/t5/community-events/eb-p/bevy-user-groups)
-
  *
    +  [BrickTalks TV](/t5/bricktalks-tv/bg-p/BricktalkTV)
-
  *
    +  [Lakebase Hub](/t5/lakebase-hub/ct-p/LakebasePostgres)
    +  [Lakebase Articles](/t5/lakebase-articles/bd-p/LakebaseArticles)
    +  [Lakebase Blogs](/t5/lakebase-blogs/bg-p/LakebaseBlogs)
    +  [Lakebase Discussions](/t5/lakebase-discussions/bd-p/LakebaseDiscussions)
 Groups

-
  *
    +  [Databricks Academy Learners](/t5/databricks-academy-learners/gh-p/databricks-academy-learners-user-group)
    +  [Databricks Academy Learners](/t5/databricks-academy-learners/bd-p/databricks-academy-learners-user-groupforum-board) Forum
-
  *
    +  [Regional and Interest Groups](/t5/regional-and-interest-groups/ct-p/databricks-community-regional-groups)
-
  *
    +  [Private Groups](/t5/private-groups/ct-p/private_groups)
 Community Cove

-
  *
    +  [Databricks Community Champions](/t5/databricks-community-champions/bg-p/databricks-community-news-members)
-
  *
    +  [Khoros Community Forums Support (Not for Databricks Product Questions)](/t5/khoros-community-forums-support/bd-p/Community-Technical-Support)
-
  *
    +  [Databricks Community Code of Conduct](/t5/databricks-community-code-of/ct-p/Code-of-conduct)
-
  *
    +  [DAIS 2026](/t5/dais-2026/bd-p/DAIS2026)
 Genie Hub

 [Register to join the community](/plugins/common/feature/samlss/doauth/post?referer=https%3A%2F%2Fcommunity.databricks.com%2Ft5%2Ftechnical-blog%2Fhow-sso-works-with-databricks-and-your-identity-provider-a%2Fba-p%2F41021)

# [Databricks Community](/)

![featured-thumbnail](https://d032007s.searchunify.com/resources/Asset-Library/613a96b41d6c3403091612708684b83c/databricks-search-icon.svg)

[Turn on suggestions](https://community.databricks.com/t5/blogs/v2/blogarticlepage.enableautocomplete:enableautocomplete?t:ac=blog-id/technical-blog/article-id/33&t:cp=action/contributions/searchactions) [#](#)

Auto-suggest helps you quickly narrow down your search results by suggesting possible matches as you type.

Showing results for

Search instead for [](#)

Did you mean: [](#)

[Help](/t5/help/faqpage)[Login/**Register**](/plugins/common/feature/samlss/doauth/post?referer=https%3A%2F%2Fcommunity.databricks.com%2Ft5%2Ftechnical-blog%2Fhow-sso-works-with-databricks-and-your-identity-provider-a%2Fba-p%2F41021)

Technical Blog

Explore in-depth articles, tutorials, and insights on data analytics and machine learning in the Databricks Technical Blog. Stay updated on industry trends, best practices, and advanced techniques.

[Turn on suggestions](https://community.databricks.com/t5/blogs/v2/blogarticlepage.enableautocomplete:enableautocomplete?t:ac=blog-id/technical-blog/article-id/33&t:cp=action/contributions/searchactions) [#](#)

Auto-suggest helps you quickly narrow down your search results by suggesting possible matches as you type.

Showing results for

Search instead for [](#)

Did you mean: [](#)

- [Databricks Community](/)
-
- [Technical Blog](/t5/technical-blog/bg-p/technical-blog)
-
- How SSO works with Databricks and your Identity Pr...

## [How SSO works with Databricks and your Identity Provider: A walkthrough](/t5/technical-blog/how-sso-works-with-databricks-and-your-identity-provider-a/ba-p/41021)

![HariSelvarajan](/t5/image/serverpage/image-id/3238i51B0929C4414B065/image-dimensions/150x150/image-coordinates/136%2C0%2C789%2C653/constrain-image/false?v=v2 "HariSelvarajan")

![Databricks Employee](/html/@C9E887927C152E954980D5EFB4CDECC4/assets/favicon.ico "Databricks Employee") [HariSelvarajan](https://community.databricks.com/t5/user/viewprofilepage/user-id/82859)

Databricks Employee

[Options](# "Show option menu")

- [Subscribe to RSS Feed](/tmcxu86974/rss/message?board.id=technical-blog&message.id=33)
-
- Mark as New
- Mark as Read
-
- Bookmark
- Subscribe
-
- [Printer Friendly Page](/t5/blogs/blogarticleprintpage/blog-id/technical-blog/article-id/33)
- [Report Inappropriate Content](/t5/notifications/notifymoderatorpage/message-uid/41021)

‎09-06-2023 07:26 AM

## What is Single Sign-On (SSO)?

The rise of Software as a Service (Saas) has proliferated the adoption of specialized software in todays modern world. This resulted in enterprises adopting many Saas services to meet their business needs . Using these services also requires an enterprise putting a lot of trust on these services. Enterprises want to be able to control authentication to various Saas applications using their own preferred Identity Management Platform.

Single sign-on (SSO) is an authentication method that enables users to securely authenticate with multiple applications, using just one set of credentials. Instead of individual applications managing user identity and passwords in their respective Identity Provider (IDP) takes the responsibility of managing user credentials in one place and integrating with individual applications to centrally authenticate users and provide a single sign-on experience. Besides managing passwords centrally, SSO also helps in leveraging the security capabilities provided by the IDP namely:

- Multifactor Authentication (MFA)
- Risk based access control (invoke additional identification based on user behavior)
- Conditional access policy (ex: location based access)

59% of users use similar passwords on multiple apps and on avg 68% of users switch between 10 applications, hence having SSO enabled on your application greatly improves security and user productivity.

There are various industry standard protocols developed which help implement SSO:

- OIDC - OpenID Connect
- SAML - Security Assertion Markup Language
- WS-Fed - Web Services Federation
- LDAP - Lightweight Directory Access Protocol

The remainder of this blog speaks about how OIDC works and how it is implemented in Databricks with various IDPs.

## Introduction to OIDC

OpenID Connect (OIDC) is an authentication protocol that works on top of the OAuth 2.0 framework. OAuth 2.0 is designed only for authorization, for granting access to data and features from one application to another. [OpenID Connect](https://openid.net/connect/) (OIDC) is a thin layer that sits on top of OAuth 2.0 that adds profile information about the user who is logged on. It provides the application or service with the relevant information about the user.

The purpose of OIDC is for users to provide one set of credentials and access multiple sites. Each time users sign onto an application or service using OIDC, they are redirected to their Authorization Server (or Identity Provider), where they authenticate and are then redirected back to the application or service. It delegates user authentication to the identity provider that hosts the user account and authorizes third-party applications to access the users account.

## Components in the OIDC protocol

Below is the list of the various components and the role they play in the OIDC protocol:

|    | **Component**                             | **Role**                                                                                                                                                                                                 |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | Resource Owner                            | It is the user who owns the identity which is stored in the Identity Provider. Ex: a user who has his personal details stored in google. (Remember signing to websites using google email, the client access your info from google for which the user is the resource owner) |
| 2  | Client                                    | The application which wants to connect to the Identity provider and access users profile information for authentication. Ex: Databricks account console wants to access user info from Azure AD          |
| 3  | Authorization Server or Identity Provider | The system that has information of the resource owner. The Client connects to the identity provider to access the user information. Ex: Okta, Azure AD, Google Identity                                  |
| 5  | Redirect URL                              | Once the identity provider authenticates the user (resource owner), it redirects the user back to this URL. This URL is provided by the client to the IDP.                                               |
| 6  | Scope                                     | The permissions which the client wants on behalf of the user are grouped into scopes. For authentication, the client requests a “profile” scope which contains the user profile info (name, id, email etc) stored in the identity provider. There are other types of scopes used for authorization purpose to control the level of access to the resource(OAuth) |
| 7  | Client ID and Secret                      | This is the ID and secret used by the client to register and identity itself with the identity provider. The identity provider validates using the ID and secret that the client is indeed what it claims to be before sharing the user info. |
| 9  | Authorization Code                        | A temporary code which is sent back from the identity provider to the user browser. The browser sends this information to the client which then shares it with the identity provider to get the access token and ID token. |
| 10 | Access Token                              | The token used by the client which is used to communicate with the Resource Server. This is like a badge or key card that gives the Client permission to request data or perform actions with the Resource Server on your behalf. |
| 11 | ID Token (JWT)                            | An ID Token contains the information of the user which can be used as proof of the user authentication. ID token is encoded as a JSON Web Token, or JWT and makes sure it comes from the issuer and not tampered with by anyone. The data inside the ID Token are called claims. |
| 12 | Issuer URL                                | Identity provider OpenID configuration document. This gives information of the various endpoint available from the IDP which the client uses to implement the OIDC protocol                              |

## OIDC flow

Now that we understand the various terminologies, lets understand how an OIDC authentication flow works.

### Establishing Trust

Before the client can use the identity provider to access user information, there needs to be a trust relationship established between the client and the identity provider. The identity provider does not share user information to any application without knowing it first. The client registers itself first with the identity provider, and the identity provider shares a client ID and secret to the client. The client ID and secret are used to identify the client and the secret is information shared securely between the client and the identity provider. Everytime the client requests for a users information, it shares its client ID and secret to identify itself to the identity provider.

### Grant Types

There are different ways a client can choose to interact with the identity provider, these are referred as grant types. Choice of grant types depends on the interaction between client,user and the IDP, medium used to authenticate (browser or other smart devices like tv) and if the authentication is between User to Machine(U2M) or Machine to Machine(M2M)

- #### Implicit flow

This is used by applications that have no “back-end” logic on the web server, like a Javascript app. All communication between client and the identity provider can be accessed from the browser based tool.

- #### Authentication flow

This is used by apps that have a back-end that can communicate with the IDP away from prying eyes. Here the browser only receives the authorization code and actual access token and ID token requests are made between the client backend and the identity provider and not exposed to the browser. This is more secure than Implicit flow.

- #### Client credential grant

This is the simplest grant type and is used for server to server communication. Not involving the user, this is for the client to access resources under its direct control rather than of users. Ex. application calling other APIs to access data.

- #### Device flow

This type is designed for browserless devices that are input constrained and unable to capture user credentials securely. This flow outsources the user authentication to an external device.

Ex: Apple tv apps which need your phone to authenticate using a code.

### Steps involved

Let us understand the steps involved when a user (Resource owner) accesses an application (Client) that has enabled SSO using an Identity Provider.

1. The user accesses the Client application.
2. The Client redirects the user to the Identity provider. The client sends its client id (to identify itself to the IDP), redirect URL, response type and scope information.
3. The Identity Provider authenticates the user. The IDP can choose different ways to authenticate the user: MFA, Yubikey, passwords etc.
4. The identity provider redirects the user back to the client using the redirect URL and includes the authorization code.
5. The users browser shares the authorization code to the client application. The authorization code does not contain user information or any other access information, just the authorization code used by the client in the next steps.
6. The Client shares the authorization code to the identity provider directly and sends its client ID and secret to authenticate itself to the identity provider. This route does not involve the user or their browser session.
7. The identity provider validates the authorization code and issues the access token and ID token back to the client.
8. The Client retrieves the ID token and uses that to establish the identity of the user.

## How Databricks supports OIDC SSO at Account Level

Databricks supports SSO set up at an account console level as well as at individual workspace level. With the introduction of [UnifiedLogin](https://docs.databricks.com/en/administration-guide/account-settings-e2/single-sign-on/index.html#unified-**bleep**-1), customers need to set up SSO only at account console level and SSO is then enabled on all workspaces which are set up with identity federation. Account console supports both OIDC and SAML based SSO. Databricks recommends using OIDC for SSO.

In the context of OIDC, Databricks account console acts as the client which wants to set up SSO using an identity provider and authenticate users using that. The first step in enabling SSO on the account console is to set up the trust relationship between the account console client app and the identity provider.

### Establishing Trust Relationship

The first step is to create a client application in the chosen identity provider. When completed you get the following 3 properties.

- Client ID: This is the unique identifier of the application in the identity provider
- Client secret: This is the secret password generated. The account console uses client ID and secret to identify itself with the identity provider
- OpenId issuer URL: The URL at which your identity-providers OpenID Configuration Document can be found. That OpenID Configuration Document must be found in {issuer-url}/.well-known/openid-configuration. This URL contains the following:
* authorization_endpoint: The URL where end-users authenticate. This is used by the account console to redirect users to the right place.
* claims_supported: An array containing the claims supported
* issuer: The identifier of the OIDC provider
* jwks_uri: Where the provider exposes public keys that can be used to validate tokens. When the IdP sends back the tokens to the account console (client), it signs the content with its own private key. The client validates the signature using the public key available from the jwks_uri and confirms the token came from the right identity provider.
* token_endpoint: The URL that apps can use to fetch tokens. The account console uses this endpoint to fetch the ID and access token from the identity provider
- The redirect URL is also given while creating the application. This can be obtained from the account console under Settings-> Single Sign-On->OIDC Connect. The IDP sends the users browser back to this URL after authentication successfully. This URL is used by the application to retrieve the authorization code

Once the above information is captured, this can then be registered in the account console under Settings-> Single Sign-On->OIDC Connect as shown below.

![HariSelvarajan_0-1693329917498.png](/t5/image/serverpage/image-id/3313iE9D3C212083F9A9D/image-size/large?v=v2&amp;px=999 "HariSelvarajan_0-1693329917498.png")

On click of the ‘Enable SSO’ option, the trust relationship is established between the databricks account console and the identity provider. The account console understands how to redirect users to the idp, retrieve authorization code, request for ID token and validate the signature. The identity provider understands how to identify the account console client.

### SSO flow

The diagram below illustrates the steps followed when a user authenticates to the account console using OIDC SSO.

![HariSelvarajan_1-1693329917664.png](/t5/image/serverpage/image-id/3314iEB1D63C20FEDEB20/image-size/large?v=v2&amp;px=999 "HariSelvarajan_1-1693329917664.png")

## Reference to OIDC in account console with IDPs

The table below covers all the options available to enable OIDC SSO on the account console on the 3 cloud platforms.

| **Cloud** | **Identity Provider**                              | **Remarks**                                                                                                                                                                                              | **Reference**                                                                                                               |
| --------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Azure     | Azure AD                                           | SSO is prebuilt in Azure Databricks with Azure AD and no additional steps are required from customers. If customers have non AD as their Identity provider, they can use  identity federation service (SAML and WS-Fed compatible) like Okta or Ping on top of AAD for “external” identity management but azure databricks uses Azure AD for access and ID token | [Azure Identity Federation](https://learn.microsoft.com/en-us/azure/active-directory/external-identities/direct-federation) |
| GCP       | GSuite or Google Cloud Identity Account            | Databricks account console users authenticate with their Google Cloud Identity account. Like in Azure Databricks, customers can configure their Google Cloud Identity account to federate with an external SAML 2.0 Identity Provider (IDP) like Azure AD, Okta, Ping, and other IDPs. However, Databricks only interacts directly with the Google Identity Platform APIs. | [SSO](https://docs.gcp.databricks.com/administration-guide/users-groups/single-sign-on/index.html)                          |
| AWS       | Azure AD                                           | Use Azure AD as the identity provider to authentication in AWS Databricks account console                                                                                                                | [SSO Azure AD](https://docs.databricks.com/en/administration-guide/account-settings-e2/single-sign-on/azure-ad.html)        |
|           | Okta                                               | Use Okta as the identity provider to authentication in AWS Databricks account console                                                                                                                    | [SSO Okta](https://docs.databricks.com/en/administration-guide/account-settings-e2/single-sign-on/okta.html)                |
|           | OneLogin                                           | Use OneLogin as the identity provider to authentication in AWS Databricks account console                                                                                                                | [SSO OneLogin](https://docs.databricks.com/en/administration-guide/account-settings-e2/single-sign-on/one-**bleep**.html)   |
|           | Others (Google cloud identity, Ping, KeyCloak etc) | Any identity provider which supports OIDC or SAML can be integrated to databricks on aws.                                                                                                                | [SSO IDP](https://docs.databricks.com/en/administration-guide/account-settings-e2/single-sign-on/index.html#account-oidc)   |

## Conclusion

This blog explains the basics of OIDC protocol for authentication and how it is used to enable Single Sign-On on a Databricks account console on various cloud platforms. SSO using the Identity provider gives customers the option to choose their own identity provider and various tools it provides to securely authenticate their users and meet their enterprise requirements.

The next series of the article talks about how SSO can be enabled using the SAML protocol.

[3 Kudos](/t5/kudos/messagepage/board-id/technical-blog/message-id/33/tab/all-users "Click here to see who gave kudos to this post.")

[https://community.databricks.com/t5/blogs/v2/blogarticlepage.kudosbuttonv2.kudoentity:kudoentity/kudosable-gid/41021?t:ac=blog-id/technical-blog/article-id/33&t:cp=kudos/contributions/tapletcontributionspage](https://community.databricks.com/t5/blogs/v2/blogarticlepage.kudosbuttonv2.kudoentity:kudoentity/kudosable-gid/41021?t:ac=blog-id/technical-blog/article-id/33&t:cp=kudos/contributions/tapletcontributionspage "Click here to give kudos to this post.")

[LinkedInLinkedIn](https://www.linkedin.com/shareArticle?mini=true&url=https://community.databricks.com/t5/technical-blog/how-sso-works-with-databricks-and-your-identity-provider-a/ba-p/41021&title=How%20SSO%20works%20with%20Databricks%20and%20your%20Identity%20Provider:%20A%20walkthrough) [twitterX (Twitter)](https://twitter.com/share?text=How%20SSO%20works%20with%20Databricks%20and%20your%20Identity%20Provider:%20A%20walkthrough&url=https://community.databricks.com/t5/technical-blog/how-sso-works-with-databricks-and-your-identity-provider-a/ba-p/41021)

![copyURLs](https://community.databricks.com/html/@7F95E661D0C3160BC74E9C3FC99C5AB6/assets/db-copy-url-icon.png)Copy URL

You must be a registered user to add a comment. If you've already registered, sign in. Otherwise, register and sign in.

- [Comment](/plugins/common/feature/samlss/doauth/post?redirectreason=permissiondenied&referer=https%3A%2F%2Fcommunity.databricks.com%2Ft5%2Ftechnical-blog%2Fhow-sso-works-with-databricks-and-your-identity-provider-a%2Fba-p%2F41021%23comment-on-this)

Contributors

[![HariSelvarajan](/t5/image/serverpage/image-id/3238i51B0929C4414B065/image-dimensions/40x40/image-coordinates/192%2C69%2C695%2C572?v=v2 "HariSelvarajan")](/t5/user/viewprofilepage/user-id/82859)

[HariSelvarajan](https://community.databricks.com/t5/user/viewprofilepage/user-id/82859)

Popular Articles

[![](/t5/image/serverpage/image-id/11673i4EBB25964A8B4FDE/image-size/large?v=v2&amp;px=999)](/t5/technical-blog/metadata-driven-etl-framework-in-databricks-part-1/ba-p/92666 "View article")

### [Metadata-Driven ETL Framework in Databricks (Part-1)](/t5/technical-blog/metadata-driven-etl-framework-in-databricks-part-1/ba-p/92666)

[![theme-lib.general.user-avatar](https://community.databricks.com/t5/image/serverpage/avatar-name/robojapan/avatar-theme/candy/avatar-collection/robots/avatar-display-size/profile/version/2?xdesc=1.0)](/t5/user/viewprofilepage/user-id/77488 "View profile") **by [Rjt_de](/t5/user/viewprofilepage/user-id/77488 "View profile")** • *Databricks Employee*

- **285668** Views
- **33** comments
- **56** kudos

10-21-2024

[![](/t5/image/serverpage/image-id/3524iB19CEB216CA81A5D/image-size/large?v=v2&amp;px=999)](/t5/technical-blog/top-10-query-performance-tuning-tips-for-databricks-serverless/ba-p/43218 "View article")

### [Top 10 query performance tuning tips for Databricks Serverless SQL](/t5/technical-blog/top-10-query-performance-tuning-tips-for-databricks-serverless/ba-p/43218)

[![theme-lib.general.user-avatar](https://community.databricks.com/t5/image/serverpage/image-id/3818i1D02CDF121270C92/image-dimensions/150x150/image-coordinates/38%2C145%2C2315%2C2421?v=v2)](/t5/user/viewprofilepage/user-id/69839 "View profile") **by [kamalendubiswas](/t5/user/viewprofilepage/user-id/69839 "View profile")** • *Databricks Employee*

- **151580** Views
- **8** comments
- **34** kudos

09-06-2023

[![](/t5/image/serverpage/image-id/12387i2968FC8181EE0551/image-size/large?v=v2&amp;px=999)](/t5/technical-blog/best-practices-for-safe-data-experimentation-with-databricks/ba-p/94421 "View article")

### [Best practices for safe data experimentation with Databricks](/t5/technical-blog/best-practices-for-safe-data-experimentation-with-databricks/ba-p/94421)

[![theme-lib.general.user-avatar](https://community.databricks.com/t5/image/serverpage/image-id/12392i15B33F81D44C3510/image-dimensions/150x150/image-coordinates/0%2C873%2C2656%2C3529?v=v2)](/t5/user/viewprofilepage/user-id/119437 "View profile") **by [Mahavir_Teraiya](/t5/user/viewprofilepage/user-id/119437 "View profile")** • *Databricks Employee*

- **21170** Views
- **5** comments
- **26** kudos

10-30-2024

Related Content

- [DABs Migration Guide: Terraform to the Direct Deployment Engine](/t5/technical-blog/dabs-migration-guide-terraform-to-the-direct-deployment-engine/ba-p/165694) in [Technical Blog](/t5/technical-blog/bg-p/technical-blog) Tuesday
- [Databricks Community Contest | Genie-Powered App Challenge](/t5/learning-events/databricks-community-contest-genie-powered-app-challenge/ev-p/165825) in [Learning Events](/t5/learning-events/eb-p/databricks-community-events) Monday
- [How to Block Databricks Genie Usage When a Budget Limit Is Reached](/t5/mvp-articles/how-to-block-databricks-genie-usage-when-a-budget-limit-is/td-p/165811) in [MVP Articles](/t5/mvp-articles/bd-p/MVP-ARTICLES) Monday
- [Building a Production LangGraph Agent on Databricks - NorthStar Brand Copilot](/t5/technical-blog/building-a-production-langgraph-agent-on-databricks-northstar/ba-p/162634) in [Technical Blog](/t5/technical-blog/bg-p/technical-blog) 2 weeks ago
- [Announcement | Take Insights Anywhere with Genie One on Mobile](/t5/announcements/announcement-take-insights-anywhere-with-genie-one-on-mobile/td-p/165021) in [Announcements](/t5/announcements/bd-p/Announcements) 2 weeks ago

### [Product](https://www.databricks.com/product/data-lakehouse) Expand View Collapse View

- [Platform Overview](https://www.databricks.com/product/data-lakehouse)
- [Pricing](https://www.databricks.com/product/pricing)
- [Open Source Tech](https://www.databricks.com/product/open-source)
- [Try Databricks](https://signup.databricks.com/?dbx_source=community)
- [Demo](https://www.databricks.com/discover/demos)

### [Learn & Support](https://www.databricks.com/learn) Expand View Collapse View

- [Documentation](https://www.databricks.com/documentation)
- [Glossary](https://www.databricks.com/glossary)
- [Training & Certification](custom-community-footer-learn-link.url.03)
- [Help Center](https://help.databricks.com/s/?_ga=2.124124106.1154286943.1683098247-939218814.1683098247)
- [Legal](https://www.databricks.com/legal)
- [Online Community](https://community.databricks.com/s/?_gl=1%2Aij54yx%2A_ga%2AMTUyNTY2NzkyNC4xNjQ2OTQ1Mzgx%2A_ga_PQSEQ3RZQC%2AMTY0NzU1MDczNS4yNC4xLjE2NDc1NTM3NDYuMA..&_ga=2.152958713.1154286943.1683098247-939218814.1683098247)

### [Solutions](https://www.databricks.com/solutions) Expand View Collapse View

- [By Industries](https://www.databricks.com/solutions)
- [Professional Services](https://www.databricks.com/professional-services)

### [Company](https://www.databricks.com/company/about-us) Expand View Collapse View  Company

- [About Us](https://www.databricks.com/company/about-us)
- [Careers at Databricks](https://www.databricks.com/company/careers)
- [Diversity and Inclusion](https://www.databricks.com/company/diversity)
- [Company Blog](https://www.databricks.com/blog/category/company)
- [Contact Us](https://www.databricks.com/company/contact)

![Simple Administration](https://community.databricks.com/html/@B66476B913BD366E75ED2650E953BEBD/assets/footer-simple-administration.png) [See Careers at Databricks](https://www.databricks.com//company/careers)

![Databricks](https://community.databricks.com/html/@5C7649432B15763F852172923613688E/assets/footer-databricks-logo.png)

- [![Linkedin](https://community.databricks.com/html/@6C9E7FE5A7202A35EFA54C7BA3A97D24/assets/footer-linkedin.svg)](<> "Linkedin")
- [![Facebook](https://community.databricks.com/html/@95AD293084B1FF78A321CFBFBAC2A317/assets/footer-facebook.svg)](<> "Facebook")
- [![Twitter](https://community.databricks.com/html/@16C5D0CEEA016BB410F14EBD7BD2D95D/assets/footer-twitter.svg)](<> "Twitter")
- [![Feed](https://community.databricks.com/html/@D84DB11E94625C7984D5879890371C53/assets/footer-feed.svg)](<> "Feed")
- [![Glassdoor](https://community.databricks.com/html/@73685F23DFA6DDF22FB90372DB0C9012/assets/footer-glassdoor.svg)](<> "Glassdoor")
- [![Youtube](https://community.databricks.com/html/@A568E91795F4D04794BFB69EC78C14AC/assets/footer-youtube.svg)](<> "Youtube")

Databricks Inc.  
160 Spear Street, 13th Floor  
San Francisco, CA 94105  
1-866-330-0121

© Databricks 2026. All rights reserved. Apache, Apache Spark, Spark and the Spark logo are trademarks of the Apache Software Foundation.

- [Privacy Notice](https://www.databricks.com/legal/privacynotice)
- |[Terms of Use](https://www.databricks.com/terms-of-use)
- |[Your Privacy Choices](<>)
- |[Your California Privacy Rights](https://www.databricks.com/legal/privacynotice#dbadditionalinformation)
- ![Global Privacy Control Icon](https://community.databricks.com/html/@32A199B1A85F4EA42C0D56327D8B34B4/assets/footer-gpcicon_small.png)

[](#)
