---
type: 'vendor'
title: 'Identify and extract Personally Identifiable Information (PII) from text - Foundry Tools'
source_url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/personally-identifiable-information/how-to/redact-text-pii'
vendor: ['azure']
industry: []
data_stack: []
cloud: ['azure']
constraints: ['PII']
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

[Edit](https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/ai-services/language-service/personally-identifiable-information/how-to/redact-text-pii.md)

--- Copy Markdown

Print

# Detect and redact Personally Identifiable Information in text

Summarize this article for me

Azure Language in Foundry Tools is a cloud-based service that applies Natural Language Processing (NLP) features to text-based data. The PII feature can evaluate unstructured text, extract, and redact sensitive information (PII) and health information (PHI) in text across several [predefined categories](../concepts/entity-categories).

- [**Stable 2026-05-01: Generally Available (GA)**](/en-us/rest/api/language/analyze-text/analyze-text/analyze-text?view=rest-language-analyze-text-2025-11-01&preserve-view=true&tabs=HTTP)

- [**Preview: 2026-05-15-preview**](/en-us/rest/api/language/analyze-text/analyze-text/analyze-text?view=rest-language-analyze-text-2025-11-15-preview&preserve-view=true&tabs=HTTP).

    Important

  **Text PII API** (2026-05-15-preview) is licensed to you as part of your Azure subscription and is subject to terms applicable to "Previews" in the [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/welcome/welcomepage) and the [Microsoft Products and Services Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA), as well as the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms).

## Development options

To use PII detection, you submit text for analysis and handle the API output in your application. Analysis is performed as-is, with no customization to the model used on your data. There are two ways to use PII detection:

| Development option                                                                                            | Description                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Microsoft Foundry (new)**](https://ai.azure.com/) portal                                                   | Foundry (new) is a cloud-based AI platform that provides streamlined access to Foundry models, agents, and tools through Foundry projects.                                                               |
| [**Foundry (classic)**](https://ai.azure.com/) portal                                                         | Foundry (classic) is a cloud-based platform that supports hub-based projects and other resource types. When you sign up, you can use your own data to detect personally identifiable information within text examples. |
| [**REST API or Client library (Azure SDK)**](/en-us/rest/api/language/analyze-text/analyze-text/analyze-text) | Integrate PII detection into your applications using the REST API, or the client library available in various languages.                                                                                 |

## Specify the PII detection model

By default, this feature uses the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../../concepts/model-lifecycle).

## Input languages

When you submit input text to be processed, you can specify which of [the supported languages](../language-support) they're written in. If you don't specify a language, extraction defaults to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support).

## New configuration parameters (2025-11-15-preview)

Important

- Azure Language public preview releases provide early access to features that are in active development.
- Features, approaches, and processes may change, before General Availability (GA), based on user feedback.
- Preview features are subject to the terms applicable to **Previews** as described in the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) and the [Microsoft Products and Services Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/microsoft-products-and-services-data-protection-addendum-dpa).

### Redaction policies

Starting with version `2025-11-15-preview` and onward, you can specify the `redactionPolicies` parameter to define which redaction policies are applied when processing text. You can include more than one policy in a single request, with one policy specified as the `defaultRedactionPolicy` and further added policy overrides for specified entities.

The policy field accepts four policy types:

- [`SyntheticReplacement `](#syntheticreplacement-policy-type)
- [`CharacterMask` (default)](#charactermask-policy-type)
- [`NoMask`](#nomask-policy-type)
- [`EntityMask`](#entitymask-policy-type)

For more information, *see* [REST API PII task parameters](/en-us/rest/api/language/analyze-text/analyze-text/analyze-text?view=rest-language-analyze-text-2025-11-15-preview&preserve-view=true&tabs=HTTP#piitaskparameters).

##### syntheticReplacement policy type

Important

The Azure Language in Foundry Tools Text Personally Identifiable Information (PII) detection **anonymization feature** (synthetic replacement) is currently available in `preview` and licensed to you as part of your Azure subscription. Your use of this feature is subject to the terms applicable to **Previews** as described in the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) and the [Microsoft Products and Services Data Protection Addendum (DPA)](https://www.microsoft.com/licensing/docs/view/microsoft-products-and-services-data-protection-addendum-dpa).

The **syntheticReplacement** policy type replaces a detected PII entity with a replacement value. For instance, an input like "John Doe received a call from 424-878-9193." can be transformed into "Sam Johnson received a call from 401-255-6901." These substitutes are randomly selected from a predefined set of alternative values.

```bash
POST {Endpoint}/language/:analyze-text?api-version=2025-11-15-preview

      {
     "kind": "PiiEntityRecognition",
     "parameters": {
       "modelVersion": "latest",
       "redactionPolicies": [
         {
           "policyKind": "syntheticReplacement",
           "entityTypes": [
                    "Person",
                    "PhoneNumber"
           ]
         }
       ]
     }
   }
```

##### characterMask policy type

The **characterMask** policy type** enables you to mask **redactedText** using a specified character (for example, "***") while preserving the length and offset of the original text. For instance, "****** received a call from ************"
> Additionally, there's also an optional field named `redactionCharacter` that allows you to specify the character used for redaction when applying the `characterMask` policy.

***Sample request***

```bash
POST {Endpoint}/language/:analyze-text?api-version=2025-11-15-preview
        {
    "kind": "PiiEntityRecognition",
    "parameters": {
    "modelVersion": "latest",
        "redactionPolicies": [
          {
            "policyKind": "characterMask",
            "redactionCharacter": "-"
          }
        ]
      }
  }
```

##### noMask policy type

**noMask** policy type** enables you to return the response without including the `redactedText` field. For example, "John Doe received a call from 424-878-919."

***Sample request***

```bash
 POST {Endpoint}/language/:analyze-text?api-version=2025-11-15-preview

   {
  "kind": "PiiEntityRecognition",
  "parameters": {
    "modelVersion": "latest",
    "redactionPolicies": [
      {
        "policyKind": "noMask"
      }
    ]
  }
}
```

##### entityMask policy type

The **entityMask** policy type** enables you to mask the detected PII entity text its corresponding entity type. For example, "[PERSON_1] received a call from [PHONENUMBER_1]."

```bash
POST {Endpoint}/language/:analyze-text?api-version=2025-11-15-preview

   {
  "kind": "PiiEntityRecognition",
  "parameters": {
    "modelVersion": "latest",
    "redactionPolicies": [
      {
        "policyKind": "entityMask"
      }
    ]
  }
}
```

To learn more, *see* [Transparency Note for Personally Identifiable Information (PII)](/en-us/azure/ai-foundry/responsible-ai/language-service/transparency-note-personally-identifiable-information).

### ConfidenceScoreThreshold

The PII feature currently redacts all detected entities, regardless of their confidence scores. Thus, entities with low confidence scores are also removed, even if retaining them is preferred. To enhance flexibility, you can configure a confidence threshold that determines the minimum confidence score an entity must have to remain in the output.

***Sample request***

```bash
POST {Endpoint}/language/:analyze-text?api-version=2025-11-15-preview

     {
       "kind":"PiiEntityRecognition",
       "parameters":{
          "modelVersion":"latest",
          "confidenceScoreThreshold":{
             "default":0.9,
             "overrides":[
                {
                   "value":0.8,
                   "entity":"USSocialSecurityNumber"
                },
                {
                   "value":0.6,
                   "entity":"Person",
                   "language":"en"
                }
             ]
          }
       }
    }
```

To learn more, *see* [REST API reference: ConfidenceScoreThreshold](/en-us/rest/api/language/analyze-text/analyze-text/analyze-text?view=rest-language-analyze-text-2025-11-15-preview&preserve-view=true&tabs=HTTP#confidencescorethreshold)

### DisableEntityValidation

When you use the PII service, it validates multiple entity types to ensure data integrity and minimize false positives. However, this strict validation can sometimes slow down workflows where validation isn't necessary. To give you more flexibility, we're introducing a parameter that lets you disable entity validation if you choose. By default, this parameter is set to false, which means strict entity validation remains in place. If you want to bypass entity validation for your requests, you can set the parameter to true.

***Sample request***

```bash
POST {Endpoint}/language/:analyze-text?api-version=2025-11-15-preview

    {
       "kind":"PiiEntityRecognition",
       "parameters":{
          "modelVersion":"latest",
          "disableEntityValidation":"true | false"
       },
       "analysisInput":{
          "documents":[
             {
                "id":"id01",
                "text":"blah"
             }
          ]
       }
    }
```

To learn more, *see* [REST API reference: PiiTaskParameters](/en-us/rest/api/language/analyze-text/analyze-text/analyze-text?view=rest-language-analyze-text-2025-11-15-preview&preserve-view=true&tabs=HTTP#piitaskparameters)

## Select which entities to be returned

The API attempts to detect the [defined entity categories](../concepts/entity-categories) for a given input text language. If you want to specify which entities are detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your input text language. The following example would detect only `Person`. You can specify one or more [entity types](../concepts/entity-categories) to be returned.

Tip

If you don't include `default` when specifying entity categories, The API only returns the entity categories you specify.

**Input:**

Note

In this example, it returns only the **person** entity type:

`https://<your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01`

```bash
{
  "kind": "PiiEntityRecognition",
  "parameters": {
    "modelVersion": "latest",
    "piiCategories": [
      "Person"
    ],
    "redactionPolicies": {
      "policyKind": "characterMask",
      "redactionCharacter": "*"
       # MaskWithCharacter|MaskWithEntityType|DoNotRedact
    }
  },
  "analysisInput": {
    "documents": [
      {
        "id": "1",
        "language": "en",
        "text": "We went to Contoso foodplace located at downtown Seattle last week for a dinner party, and we adore the spot! They provide marvelous food and they have a great menu. The chief cook happens to be the owner (I think his name is John Doe) and he is super nice, coming out of the kitchen and greeted us all. We enjoyed very much dining in the place! The pasta I ordered was tender and juicy, and the place was impeccably clean. You can even pre-order from their online menu at www.contosofoodplace.com, call 112-555-0176 or send email to order@contosofoodplace.com! The only complaint I have is the food didn't come fast enough. Overall I highly recommend it!"
      }
    ]
  }
}
```

**Output:**

```bash
{
    "kind": "PiiEntityRecognitionResults",
    "results": {
        "documents": [
            {
                "redactedText": "We went to Contoso foodplace located at downtown Seattle last week for a dinner party, and we adore the spot! They provide marvelous food and they have a great menu. The chief cook happens to be the owner (I think his name is ********) and he is super nice, coming out of the kitchen and greeted us all. We enjoyed very much dining in the place! The pasta I ordered was tender and juicy, and the place was impeccably clean. You can even pre-order from their online menu at www.contosofoodplace.com, call 112-555-0176 or send email to order@contosofoodplace.com! The only complaint I have is the food didn't come fast enough. Overall I highly recommend it!",
                "id": "1",
                "entities": [
                    {
                        "text": "John Doe",
                        "category": "Person",
                        "offset": 226,
                        "length": 8,
                        "confidenceScore": 0.98
                    }
                ],
                "warnings": []
            }
        ],
        "errors": [],
        "modelVersion": "2021-01-15"
    }
}
```

## Adapting PII to your domain

To accommodate and adapt to a customer's custom vocabulary used to identify entities (also known as the "context"), the `entitySynonyms` feature allows customers to define their own synonyms for specific entity types.

This feature is designed to identify entities within contexts that may be unfamiliar to the model, especially terms specific to the customer's input. By doing so, it ensures that the customer's unique terminology is accurately recognized and properly linked during the detection process.

The `valueExclusionPolicy` option allows customers to adapt the PII service for scenarios where customers prefer certain terms not to be detected and redacted even if those terms fall into a PII category they're interested in detected. For example, a police department might want personal identifiers redacted in most cases except for terms like "police officer," "suspect," and "witness."

Customers can now adapt the PII service's detecting by specifying their own regex using a regex recognition configuration file. See our [container how-to guides](use-containers) for a tutorial on how to install and run Personally Identifiable Information (PII) Detection containers.

A more detailed tutorial can be found in the "[Adapting PII to your domain](adapt-to-domain-pii)" how-to guide.

## Submitting data

Analysis is performed upon receipt of the request. Using the PII detection feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

When [using this feature asynchronously](../../concepts/use-asynchronously), the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## Getting PII results

When you get results from PII detection, you can stream the results to an application or save the output to a file on the local system. The API response includes [recognized entities](../concepts/entity-categories), including their categories and subcategories, and confidence scores. The text string with the PII entities redacted is also returned.

## Service and data limits

For information on the size and number of requests you can send per minute and second, see the [service limits](../../concepts/data-limits) article.

## Next steps

[Personally Identifiable Information (PII) overview](../overview)

---

## Feedback

Was this page helpful?

Yes

**No**

Need help with this topic?

Want to try using Ask Learn to clarify or guide you through this topic?

Suggest a fix?

---

- Last updated on 2026-06-02

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
