---
type: 'vendor'
title: 'Authentication and authorization'
source_url: 'https://docs.cloud.google.com/architecture/blueprints/security-foundations/authentication-authorization'
vendor: ['gcp']
industry: []
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

# Authentication and authorization

Last reviewed 2025-05-15 UTC

This section introduces how to use [Cloud Identity](/identity/docs/overview) to manage the [identities that your employees use](/architecture/identity/overview-google-authentication#google_identities) to access Google Cloud
services.

## External identity provider as the source of truth

We recommend federating your Cloud Identity account with your existing
identity provider. Federation helps you ensure that your existing account
management processes apply to Google Cloud and other Google services.

If you don't have an existing identity provider, you can create user accounts
directly in Cloud Identity.

**Note:** If you're already using Google Workspace,
Cloud Identity uses the same console, administrative
controls, and user accounts as your Google Workspace account.

The following diagram shows a high-level view of identity federation and single
sign-on (SSO). It uses Microsoft Active Directory, located in the on-premises
environment, as the example identity provider.

![External identity provider federation.](/static/architecture/blueprints/security-foundations/images/example-identity-structure.svg)

This diagram describes the following best practices:

- User identities are managed in an Active Directory domain that is
located in the on-premises environment and federated to
Cloud Identity. Active Directory uses Google Cloud Directory Sync to provision
identities to Cloud Identity.
- Users attempting to sign in to Google services are redirected to the
external identity provider for
[single sign-on with SAML](/architecture/identity/single-sign-on),
using their existing credentials to authenticate. No passwords are
synchronized with Cloud Identity.

The following table provides links to setup guidance for identity providers.

| Identity provider                                             | Guidance                                                                                                                                                                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Active Directory                                              | [Active Directory user account provisioning](/architecture/identity/federating-gcp-with-active-directory-synchronizing-user-accounts)<br>[Active Directory single sign-on](/architecture/identity/federating-gcp-with-active-directory-configuring-single-sign-on) |
| Microsoft Entra ID (formerly Azure AD)                        | [Federating Google Cloud with Microsoft Entra ID](/architecture/identity/federating-gcp-with-azure-active-directory)                                                                                     |
| Other external identity providers (for example, Ping or Okta) | [Integrating Ping Identity Solutions with Google Identity Services](https://www.pingidentity.com/en/resources/content-library/white-papers/3034-integrate-ping-identity-solutions-google-identity-services.html) [Okta user provisioning and single sign-on](/architecture/identity/okta-provisioning-and-single-sign-on) [Best practices for federating Google Cloud with an external identity provider](/architecture/identity/best-practices-for-federating) |

We strongly recommend that you enforce multi-factor authentication at your
identity provider with a phishing-resistant mechanism such as a [Titan Security Key](https://cloud.google.com/security/products/titan-security-key).

The recommended settings for Cloud Identity aren't automated through
the Terraform code in this blueprint. See [administrative controls for Cloud Identity](#administrative-controls-for-cloud-identity) for the recommended security settings that you must configure in addition to
deploying the Terraform code.

## Groups for access control

A *principal* is an identity that can be granted access to a resource.
Principals include [Google Accounts for users](/docs/authentication#user-accounts), Google groups,
Google Workspace accounts, Cloud Identity domains, and service
accounts. Some services also let you grant access to all users who authenticate
with a Google Account, or to all users on the internet. For a principal to
interact with Google Cloud services, you must grant them roles in [Identity and Access Management (IAM)](/iam/docs/overview).

To manage IAM roles at scale, we recommend that you assign users
to groups based on their job functions and access requirements, then grant
IAM roles to those groups. You should add users to groups using
the processes in your existing identity provider for group creation and
membership.

We don't recommend granting IAM roles to individual users because individual
assignments can increase the complexity of managing and auditing roles.

The blueprint configures groups and roles for view-only access to foundation
resources. We recommend that you deploy all resources in the blueprint through
the foundation pipeline, and that you don't grant roles to users to groups to
modify foundation resources outside of the pipeline.

The following table shows the groups that are configured by the blueprint for
viewing foundation resources.

| Name                                    | Description                                                                                                                                                          | Roles                                                                                                                                 | Scope            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `grp-gcp-org-admin@example.com`         | Highly privileged administrators who can grant IAM roles at the organization level. They can access any other role. This privilege is not recommended for daily use. | [Organization Administrator](/iam/docs/roles-permissions/resourcemanager#resourcemanager.organizationAdmin)                           | organization     |
| `grp-gcp-billing-admin@example.com`     | Highly privileged administrators who can modify the Cloud Billing account. This privilege is not recommended for daily use.                                          | [Billing Account Admin](/iam/docs/roles-permissions/billing#billing.admin)                                                            | organization     |
| `grp-gcp-billing-viewer@example.com`    | The team who is responsible for viewing and analyzing the spending across all projects.                                                                              | [Billing Account Viewer](/iam/docs/roles-permissions/billing#billing.viewer)                                                          | organization     |
|                                         |                                                                                                                                                                      | [BigQuery User](/iam/docs/roles-permissions/bigquery#bigquery.user)                                                                   | billing project  |
| `grp-gcp-audit-viewer@example.com`      | The team who is responsible for auditing security-related logs.                                                                                                      | [Logs Viewer](/iam/docs/roles-permissions/logging#logging.viewer) [BigQuery User](/iam/docs/roles-permissions/bigquery#bigquery.user) | logging project  |
| `grp-gcp-security-reviewer@example.com` | The team who is responsible for reviewing cloud security.                                                                                                            | [Security Reviewer](/iam/docs/roles-permissions/iam#iam.securityReviewer)                                                             | organization     |
| `grp-gcp-network-viewer@example.com`    | The team who is responsible for viewing and maintaining network configurations.                                                                                      | [Compute Network Viewer](/iam/docs/roles-permissions/compute#compute.networkViewer)                                                   | organization     |
| `grp-gcp-scc-admin@example.com`         | The team who is responsible for configuring Security Command Center.                                                                                                 | [Security Center Admin Editor](/iam/docs/roles-permissions/securitycenter#securitycenter.adminEditor)                                 | organization     |
| `grp-gcp-secrets-admin@example.com`     | The team who is responsible for managing, storing, and auditing credentials and other secrets that are used by applications.                                         | [Secret Manager Admin](/iam/docs/roles-permissions/secretmanager#secretmanager.admin)                                                 | secrets projects |
| `grp-gcp-kms-admin@example.com`         | The team who is responsible for enforcing encryption key management to meet compliance requirements.                                                                 | [Cloud KMS Viewer](/iam/docs/roles-permissions/cloudkms#cloudkms.viewer)                                                              | kms projects     |

As you build your own workloads on top of the foundation, you create additional
groups and grant IAM roles that are based on the access
requirements for each workload.

We strongly recommend that you avoid [basic roles](/iam/docs/roles-overview#basic) (such as Owner, Editor, or Viewer) and use [predefined roles](/iam/docs/roles-permissions) instead. Basic roles are overly permissive and a potential security risk. Owner
and Editor roles can lead to privilege escalation and lateral movement, and the
Viewer role includes access to read all data. For best practices on IAM
roles, see [Use IAM securely](/iam/docs/using-iam-securely).

## Super admin accounts

Cloud Identity users with the [super admin account](/resource-manager/docs/super-admin-best-practices) bypass the organization's SSO settings and authenticate directly to
Cloud Identity. This exception is by design, so that the super admin can
still access the Cloud Identity console in the event of an SSO
misconfiguration or outage. However, it means you must consider additional
protection for super admin accounts.

To protect your super admin accounts, we recommend that you always enforce
2-step verification with security keys in Cloud Identity. For more
information, see [Security best practices for administrator accounts](https://support.google.com/a/answer/9011373).

## Issues with consumer user accounts

If you didn't use Cloud Identity or Google Workspace before you
onboarded to Google Cloud, it's possible that your organization's
employees are already using [consumer accounts](/architecture/identity/overview-google-authentication#consumer_account) that are associated with their corporate email identities to access other Google
services such as Google Marketing Platform or YouTube. Consumer accounts are accounts that
are fully owned and managed by the individuals who created them. Because those
accounts aren't under your organization's control and might include both
personal and corporate data, you must decide how to consolidate these accounts
with other corporate accounts.

We recommend that you [consolidate existing consumer user accounts](/architecture/landing-zones/decide-how-to-onboard-identities#account-consolidation) as part of onboarding to Google Cloud. If you aren't using
Google Workspace for all your user accounts already, we recommend [blocking access to consumer accounts](https://support.google.com/a/answer/1668854).

## Administrative controls for Cloud Identity

Cloud Identity has various administrative controls that are not
automated by Terraform code in the blueprint. We recommend that you enforce each
of these best practice security controls early in the process of building your
foundation.

| Control                                                                                                                                                           | Description                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Deploy 2-step verification](https://support.google.com/a/answer/9176657)                                                                                         | User accounts might be compromised through phishing, social engineering, password spraying, or various other threats. [2-step verification](https://support.google.com/mail/answer/185839) helps mitigate these threats. We recommend that you enforce 2-step verification for all user accounts in your organization with a phishing-resistant mechanism such as [Titan Security Keys](https://cloud.google.com/security/products/titan-security-key) or other keys that are based on the phishing-resistant FIDO U2F (CTAP1) standards. |
| [Set session length for Google Cloud services](https://support.google.com/a/answer/9368756)                                                                       | [Persistent OAuth tokens on developer workstations](/architecture/bps-for-mitigating-gcloud-oauth-tokens) can be a security risk if exposed. We recommend that you set a reauthentication policy to require authentication every 16 hours using a security key. |
| [Set session length for Google Services](https://support.google.com/a/answer/7576830)                                                                             | *(Google Workspace customers only)* Persistent web sessions across other Google services can be a security risk if exposed. We recommend that you enforce a maximum web session length and align this with session length controls in your SSO provider. |
| [Share data from Cloud Identity with Google Cloud services](https://support.google.com/a/answer/9320190)                                                          | [Admin Activity audit logs from Google Workspace or Cloud Identity](/logging/docs/audit/gsuite-audit-logging) are ordinarily managed and viewed in the Admin Console, separately from your logs in your Google Cloud environment. These logs contain information that is relevant for your Google Cloud environment, such as user login events. We recommend that you share Cloud Identity audit logs to your Google Cloud environment to centrally manage logs from all sources. |
| [Set up post SSO verification](https://support.google.com/a/answer/6002699?sjid=16707112795784526240-NC#sso&zippy=%2Cset-up-post-sso-verification)                | The blueprint assumes that you set up SSO with your external identity provider. We recommend that you enable an additional layer of control based on Google's sign-in risk analysis. After you apply this setting, users might see additional risk-based login challenges at sign-in if Google deems that a user sign-in is suspicious. |
| [Remediate issues with consumer user accounts](#issues-with-consumer-accounts)                                                                                    | Users with a valid email address at your domain but no Google Account can sign up for unmanaged consumer accounts. These accounts might contain corporate data, but are not controlled by your account lifecycle management processes. We recommend that you take steps to ensure that all user accounts are managed accounts. |
| [Disable account recovery for super admin accounts](https://support.google.com/a/answer/9436964)                                                                  | Super admin account self-recovery is off by default for all new customers (existing customers might have this setting on). Turning this setting off helps to mitigate the risk that a compromised phone, compromised email, or social engineering attack could let an attacker gain super admin privileges over your environment. Plan an internal process for a super admin to contact another super admin in your organization if they have lost access to their account, and ensure that all super admins are familiar with the process for [support-assisted recovery](https://support.google.com/a/answer/33561). |
| [Enforce and monitor password requirements for users](https://support.google.com/a/answer/139399)                                                                 | In most cases, user passwords are managed through your external identity provider, but super admin accounts bypass SSO and must use a password to sign in to Cloud Identity. Disable password reuse and monitor password strength for any users who use a password to sign in to Cloud Identity, particularly super admin accounts. |
| [Set organization-wide policies for using groups](https://support.google.com/a/answer/167097#external&zippy=%2Ckeep-your-organizations-groups-completely-private) | By default, external user accounts can be added to groups in Cloud Identity. We recommend that you configure sharing settings so that group owners can't add external members. Note that this restriction doesn't apply to the super admin account or other delegated administrators with Groups admin permissions. Because federation from your identity provider runs with administrator privileges, the group sharing settings don't apply to this group synchronization. We recommend that you review controls in the identity provider and synchronization mechanism to ensure that non-domain members aren't added to groups, or that you apply [group restrictions](https://support.google.com/a/answer/11192679). |

## What's next

- Read about [organization structure](/architecture/blueprints/security-foundations/organization-structure) (next
document in this series).

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-05-15 UTC.
