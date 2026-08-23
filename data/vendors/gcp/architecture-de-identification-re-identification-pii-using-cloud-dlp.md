---
type: 'vendor'
title: 'De-identification and re-identification of PII in large-scale datasets using Sensitive Data Protection'
source_url: 'https://docs.cloud.google.com/architecture/de-identification-re-identification-pii-using-cloud-dlp'
vendor: ['gcp']
industry: []
data_stack: []
cloud: ['gcp']
constraints: ['PII']
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

# De-identification and re-identification of PII in large-scale datasets using Sensitive Data Protection

Last reviewed 2024-06-07 UTC

This document discusses how to use Sensitive Data Protection to create
an automated data transformation pipeline to de-identify sensitive data like
personally identifiable information (PII). De-identification techniques like
tokenization (pseudonymization) let you preserve the utility of your data for
joining or analytics while reducing the risk of handling the data by obfuscating
the raw sensitive identifiers. To minimize the risk of handling large volumes of
sensitive data, you can use an automated data transformation pipeline to create
de-identified replicas. [Sensitive Data Protection](/sensitive-data-protection/docs) enables transformations such as redaction, masking, tokenization, bucketing,
and other methods of [de-identification](/sensitive-data-protection/docs/transformations-reference).
When a dataset hasn't been characterized,
Sensitive Data Protection can also inspect the data for sensitive information by using [more than 100 built-in classifiers](/sensitive-data-protection/docs/infotypes-reference).

This document is intended for a technical audience whose responsibilities
include data security, data processing, or data analytics. This guide assumes
that you're familiar with data processing and data privacy, without the need to
be an expert.

## Reference architecture

The following diagram shows a reference architecture for using
Google Cloud products to add a layer of security to sensitive datasets by using
de-identification techniques.

![Architecture of de-identification pipeline, configuration management, and re-identification pipeline.](/static/architecture/images/de-identification-re-identification-pii-using-cloud-dlp-1-architecture.svg)

The architecture consists of the following:

- **Data de-identification streaming pipeline**: De-identifies sensitive
data in text using Dataflow. You can reuse the
pipeline for multiple transformations and use cases.

- **Configuration (Sensitive Data Protection template and key) management**: A managed
de-identification configuration that is accessible by only a small group of
people—for example, security admins—to avoid exposing de-identification
methods and encryption keys.

- **Data validation and re-identification pipeline**: Validates copies of
the de-identified data and uses a Dataflow pipeline to
re-identify data at a large scale.

## Helping to secure sensitive data

One of the key tasks of any enterprise is to help ensure the security of their
users' and employees' data. Google Cloud provides built-in security
measures to facilitate data security, including encryption of stored data and
encryption of data in transit.

### Encryption at rest: Cloud Storage

Maintaining data security is critical for most organizations. Unauthorized
access to even moderately sensitive data can damage the trust, relationships,
and reputation that you have with your customers. Google [encrypts data stored at rest](/docs/security/encryption/default-encryption) by default. By default, any object uploaded to a [Cloud Storage](/storage/docs) bucket is encrypted using a [Google-owned and Google-managed encryption key](/storage/docs/encryption/default-keys).
If your dataset uses a pre-existing encryption method and requires a non-default
option before uploading, there are other encryption options provided by
Cloud Storage. For more information, see [Data encryption options](/storage/docs/encryption).

### Encryption in transit: Dataflow

When your data is in transit, the *at-rest* encryption isn't in place.
In-transit data is protected by secure network protocols referred to as [*encryption in transit*](/docs/security/encryption-in-transit).
By default, Dataflow uses Google-owned and Google-managed encryption keys. The
tutorials associated with this document use an automated pipeline that uses the
default Google-owned and Google-managed encryption keys.

## Sensitive Data Protection data transformations

There are two main types of transformations performed by Sensitive Data Protection:

- [`recordTransformations`](/sensitive-data-protection/docs/deidentify-sensitive-data#record_transformations)
- [`infoTypeTransformations`](/sensitive-data-protection/docs/deidentify-sensitive-data#infotype_transformations)

Both `recordTransformations` and `infoTypeTransformations` methods can
de-identify and encrypt sensitive information in your data. For example, you can
transform the values in the `US_SOCIAL_SECURITY_NUMBER` column to be
unidentifiable or use tokenization to obscure it while keeping referential
integrity.

The `infoTypeTransformations` method lets you inspect for sensitive data
and transform the finding. For example, if you have unstructured or free-text
data, the `infoTypeTransformations` method can help you identify an SSN inside
of a sentence and encrypt the SSN value while leaving the rest of the text
intact. You can also define custom `infoTypes` methods.

The `recordTransformations` method lets you apply a transformation
configuration per field when using structured or tabular data. With the `recordTransformations` method, you can apply the same transformation across
every value in that field such as hashing or tokenizing every value in a column
with `SSN` column as the field or header name.

With the `recordTransformations` method , you can also mix in the `infoTypeTransformations` method that only apply to the values in the specified
fields. For example, you can use an `infoTypeTransformations` method inside of a `recordTransformations` method for the field named `comments` to redact any
findings for `US_SOCIAL_SECURITY_NUMBER` that are found inside the text in the
field.

In increasing order of complexity, the de-identification processes are as
follows:

- **Redaction**: Remove the sensitive content with no replacement of content.
- **Masking**: Replace the sensitive content with fixed characters.
- **Encryption**: Replace sensitive content with encrypted strings, possibly
reversibly.

### Working with delimited data

Often, data consists of records delimited by a selected character, with fixed
types in each column, like a CSV file. For this class of data, you can apply
de-identification transformations (`recordTransformations`) directly, without
inspecting the data. For example, you can expect a column labeled `SSN` to
contain only SSN data. You don't need to inspect the data to know that the `infoType` detector is `US_SOCIAL_SECURITY_NUMBER`. However, free-form
columns labeled `Additional Details` can contain sensitive information, but the `infoType` class is unknown beforehand. For a free-form column, you need to
inspect the `infoTypes` detector (`infoTypeTransformations`) before applying
de-identification transformations. Sensitive Data Protection allows both of these
transformation types to co-exist in a single de-identification template.
Sensitive Data Protection includes [more than 100 built-in `infoTypes` detectors](/sensitive-data-protection/docs/infotypes-reference).
You can also create custom types or modify built-in `infoTypes` detectors to
find sensitive data that is unique to your organization.

### Determining transformation type

Determining when to use the `recordTransformations` or `infoTypeTransformations` method depends on your use case. Because using the `infoTypeTransformations` method requires more resources and is therefore more costly, we recommend using
this method only for situations where the data type is unknown. You can evaluate
the costs of running Sensitive Data Protection using the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator/).

For examples of transformation, this document refers to a dataset that contains
CSV files with fixed columns, as demonstrated in the following table.

| Column name                      | Inspection `infoType` (custom or built-in)                                          | Sensitive Data Protection transformation type |
| -------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| ` Card Number `                  | Not applicable                                                                      | Deterministic encryption (DE)                 |
| ` Card Holder's Name `           | Not applicable                                                                      | Deterministic encryption (DE)                 |
| ` Card PIN `                     | Not applicable                                                                      | Crypto hashing                                |
| ` SSN (Social Security Number) ` | Not applicable                                                                      | Masking                                       |
| ` Age `                          | Not applicable                                                                      | Bucketing                                     |
| ` Job Title `                    | Not applicable                                                                      | Bucketing                                     |
| ` Additional Details `           | Built-in: `IBAN_CODE`, `EMAIL_ADDRESS`, `PHONE_NUMBER `  Custom: ` ONLINE_USER_ID ` | Replacement                                   |

This table lists the column names and describes which type of transformation is
needed for each column. For example, the `Card Number` column contains credit
card numbers that need to be encrypted; however, they don't need to be
inspected, because the data type (`infoType`) is known.

The only column where an inspection transformation is recommended is the `Additional Details` column. This column is free-form and might contain PII,
which, for the purposes of this example, should be detected and de-identified.

The examples in this table present five different de-identification
transformations:

- Two-way tokenization: Replaces the original data with a token that is
deterministic, preserving referential integrity. You can use the token to
join data or use the token in aggregate analysis. You can reverse or
de-tokenize the data using the same key that you used to create the token.
There are two methods for two-way tokenizations:

  * [**Deterministic encryption (DE)**](/sensitive-data-protection/docs/transformations-reference#fpe):
Replaces the original data with a base64-encoded encrypted value and
doesn't preserve the original character set or length.
  * [**Format-preserving encryption with FFX (FPE-FFX)**](/sensitive-data-protection/docs/transformations-reference#fpe):
Replaces the original data with a token generated by using
format-preserving encryption in FFX mode. By design, FPE-FFX preserves
the length and character set of the input text. It lacks authentication
and an initialization vector, which can cause a length expansion in the
output token. Other methods, like DE, provide stronger security
and are recommended for tokenization use cases unless length and
character-set preservation are strict requirements, such as backward
compatibility with legacy data systems.

- One-way tokenization, using [**cryptographic hashing**](/sensitive-data-protection/docs/transformations-reference#crypto-hashing):
Replaces the original value with a hashed value, preserving referential
integrity. However, unlike two-way tokenization, a one-way method isn't
reversible. The hash value is generated by using an SHA-256-based message
authentication code
([HMAC-SHA-256](https://tools.ietf.org/html/rfc4634))
on the input value.

- [**Masking**](/sensitive-data-protection/docs/transformations-reference#masking):
Replaces the original data with a specified character, either partially
or completely.

- [**Bucketing**](/sensitive-data-protection/docs/transformations-reference#bucketing):
Replaces a more identifiable value with a less distinguishing value.

- [**Replacement**](/sensitive-data-protection/docs/transformations-reference#replacement):
Replaces original data with a token or the name of the `infoType` if
detected.

### Method selection

Choosing the best de-identification method can vary based on your use case. For
example, if a legacy app is processing the de-identified records, then format
preservation might be important. If you're dealing with strictly formatted
10-digit numbers, FPE preserves the length (10 digits) and character set
(numeric) of an input for legacy system support.

However, if strict formatting isn't required for legacy compatibility, as is
the case for values in the `Card Holder's Name` column, then DE is the
preferred choice because it has a stronger authentication method. Both FPE and
DE enable the tokens to be reversed or de-tokenized. If you don't need
de-tokenization, then cryptographic hashing provides integrity but the tokens
can't be reversed.

Other methods—like masking, [bucketing](/sensitive-data-protection/docs/concepts-bucketing), [date-shifting](/sensitive-data-protection/docs/concepts-date-shifting),
and replacement—are good for values that don't need to retain full integrity.
For example, bucketing an age value (for example, 27) to an age range (20-30)
can still be analyzed while reducing the uniqueness that might lead to the
identification of an individual.

## Token encryption keys

For cryptographic de-identification transformations, a cryptographic key,
also known as *token encryption key*, is required. The token encryption key
that is used for de-identification encryption is also used to re-identify the
original value. The secure creation and management of token encryption keys are
beyond the scope of this document. However, there are some important principles
to consider that are used later in the associated tutorials:

- Avoid using plaintext keys in the template. Instead, use
Cloud KMS to create a [wrapped key](/sensitive-data-protection/docs/create-wrapped-key).
- Use separate token encryption keys for each data element to reduce the
risk of compromising keys.
- [Rotate](/kms/docs/key-rotation) token encryption keys. Although you can rotate the wrapped key, rotating the
token encryption key breaks the integrity of the tokenization. When the key
is rotated, you need to re-tokenize the entire dataset.

### Sensitive Data Protection templates

For large-scale deployments, use [Sensitive Data Protection templates](/sensitive-data-protection/docs/concepts-templates#advantages_of_templates) to accomplish the following:

- Enable security control with
[Identity and Access Management (IAM)](/sensitive-data-protection/docs/iam-permissions).
- Decouple configuration information, and how you de-identify that
information, from the implementation of your requests.
- Reuse a set of transformations. You can use the de-identify and
re-identify templates over multiple datasets.

## BigQuery

The final component of the reference architecture is viewing and working with
the de-identified data in [BigQuery](/bigquery/docs).
BigQuery is Google's data warehouse tool that includes
serverless infrastructure, BigQuery ML, and the ability to run
Sensitive Data Protection as a native tool. In the example reference architecture,
BigQuery serves as a data warehouse for the de-identified data
and as a backend to an automated re-identification data pipeline that can share
data through [Pub/Sub](/pubsub/docs).

## What's next

- Learn about using Sensitive Data Protection to [inspect storage and databases for sensitive data](/sensitive-data-protection/docs/inspecting-storage).
- Learn about other [pattern recognition solutions](/solutions/smart-analytics/reference-patterns/overview#pattern_recognition).
- For more reference architectures, diagrams, and best practices, explore the
[Cloud Architecture Center](/architecture).

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2024-06-07 UTC.
