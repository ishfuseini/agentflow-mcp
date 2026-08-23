---
type: 'vendor'
title: 'Detect and redact personally identifiable information (PII)'
source_url: 'https://docs.snowflake.com/en/user-guide/snowflake-cortex/redact-pii'
vendor: ['snowflake']
industry: []
data_stack: ['snowflake']
cloud: []
constraints: ['PII']
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

For AI agents: documentation index at /llms.txt — fetch to discover all Snowflake documentation pages. Markdown version of this page: /en/en/user-guide/snowflake-cortex/redact-pii.md

# Detect and redact personally identifiable information (PII)[¶](#detect-and-redact-personally-identifiable-information-pii)

Personally identifiable information (PII) includes names, addresses, phone numbers, email addresses, tax identification numbers, and other
data that can be used (alone or with other information) to identify an individual. Most organizations have regulatory and compliance
requirements around handling PII data. [AI_REDACT](/sql-reference/functions/ai_redact) is a fully-managed Cortex AI Function that uses a large language model (LLM) to help you
detect, locate, and redact PII from unstructured text data.

AI_REDACT can help you prepare text for call center coaching, sentiment analysis, insurance and medical analysis,
and machine learning (ML) model training, among other use cases.

Tip

Use AI_PARSE_DOCUMENT or AI_TRANSCRIBE to convert document or speech data into text before applying AI_REDACT.

## AI_REDACT[¶](#ai_redact)

The AI_REDACT function has two modes of operation: `detect` and `redact`. The default is `redact`. Use AI_REDACT in `detect` mode to
identify PII locations then programmatically choose which PII to redact. Use AI_REDACT in `redact` mode to replace PII in the input text with placeholder values.

Important

AI_REDACT performs detection and redaction in a best-effort manner using AI models. Always review the output to ensure compliance
with your organization’s data privacy policies. If AI_REDACT fails to detect or redact any PII in your data, [contact Snowflake Support](/user-guide/contacting-support).

## Regional availability[¶](#regional-availability)

See [Regional availability](/user-guide/snowflake-cortex/aisql-regional-availability#label-cortex-llm-availability).

## Limitations[¶](#limitations)

- AI_REDACT uses AI models and may not find all personally identifiable information. Always review the output
to ensure compliance with your organization’s data privacy policies. If AI_REDACT fails to redact certain PII, contact [Snowflake Support](/user-guide/contacting-support).

- AI_REDACT works best with well-formed English text. Performance may vary with other languages or text with many
spelling, punctuation, or grammatical errors.

- AI_REDACT currently supports only US PII and some UK and Canadian PII, where noted in [Detected PII categories](#label-ai-redact-pii-categories).

- AI_REDACT is currently limited in the number of tokens it can input and output. Input and output together can be up to
4,096 tokens. Output is limited to 1,024 tokens. If the input text is longer, split it into smaller chunks and
redact each chunk separately, perhaps using [SPLIT_TEXT_RECURSIVE_CHARACTER](/sql-reference/functions/split_text_recursive_character-snowflake-cortex).
See [Chunking example](#label-ai-redact-pii-example-chunking) for an example of redacting text that exceeds token limits.

    Note

  A token is the smallest unit of data processed by the AI model. For English text, industry guidelines consider one token to be approximately four characters, or 0.75 words.

## Detected PII categories[¶](#detected-pii-categories)

AI_REDACT supports the detection and redaction of the following categories of PII. The values in the Category column are the strings
that are supported in the optional `categories` argument.
> | Category            | Notes                                                                                                                                                                                                   |
> | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | NAME                | Recognizes full name, first name, middle name, and last name                                                                                                                                            |
> | EMAIL               |                                                                                                                                                                                                         |
> | PHONE\_NUMBER       |                                                                                                                                                                                                         |
> | DATE\_OF\_BIRTH     |                                                                                                                                                                                                         |
> | GENDER              | Recognizes male, female, and nonbinary                                                                                                                                                                  |
> | AGE                 |                                                                                                                                                                                                         |
> | ADDRESS             | Identifies:<br>complete postal address (US, UK, CA)<br>street address (US, UK, CA)<br>postal code (US, UK, CA)<br>city (US, UK, CA)<br>state (US) or province (CA)<br>county, borough, or township (US) |
> | NATIONAL\_ID        | Identifies Social Security numbers (US)                                                                                                                                                                 |
> | PASSPORT            | Identifies passport numbers (US, UK, CA)                                                                                                                                                                |
> | TAX\_IDENTIFIER     | Identifies Individual Taxpayer Numbers (ITNs)                                                                                                                                                           |
> | PAYMENT\_CARD\_DATA | Identifies complete card information, card number, expiration date, and CVV                                                                                                                             |
> | DRIVERS\_LICENSE    | Identifies US, UK, and CA licenses                                                                                                                                                                      |
> | IP\_ADDRESS         |                                                                                                                                                                                                         |
>
> Expand
>
> Show less
>
> See more

Note

AI_REDACT supports partial matches for some PII categories. For example, a first name alone is sufficient to trigger
redaction with the [NAME] placeholder.

## Retain specific PII with detect mode[¶](#retain-specific-pii-with-detect-mode)

By default, AI_REDACT replaces all detected PII with placeholder values. In some cases, you might want to retain certain PII while redacting
the rest. For example, you might want to redact all names in call center transcripts or customer reviews except for known employee names.

Use `detect` mode to build a selective redaction workflow:

1. Call AI_REDACT with the `mode` argument set to `detect` to identify and locate PII in the input text.
2. Compare the detected spans against an allowlist of values you want to keep.
3. Redact only the PII that is not in the allowlist.

When you call AI_REDACT in `detect` mode, the function returns an OBJECT containing a `spans` array. Each element
in the array is an OBJECT with the following fields:

| Field      | Type    | Description                                                                                                                             |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `category` | VARCHAR | The PII category, such as `NAME` or `ADDRESS`. See [Detected PII categories](#label-ai-redact-pii-categories) for supported categories. |
| `start`    | NUMBER  | The start index of the detected PII in the input text.                                                                                  |
| `end`      | NUMBER  | The end index of the detected PII in the input text.                                                                                    |
| `text`     | VARCHAR | The matched PII text from the input.                                                                                                    |

Expand

Show less

See more

For examples of using `detect` mode, see [Detection and selective redaction examples](#label-ai-detect-pii-examples).

## Handle row-level errors in multi-row queries[¶](#handle-row-level-errors-in-multi-row-queries)

Important

If your query fails on every row, the cause might be a known constraint rather than a row-level error.
See [Limitations](#label-ai-redact-pii-limitations) for details on token limits, language support, and other restrictions.

AI_REDACT raises an error if it cannot process the input text. When a query redacts multiple rows, an error causes the entire query to fail.
To allow processing to continue with other rows, you can set the session parameter `AI_SQL_ERROR_HANDLING_USE_FAIL_ON_ERROR` to FALSE.
Errors then return NULL instead of stopping the query.

Copy code

```
ALTER SESSION SET AI_SQL_ERROR_HANDLING_USE_FAIL_ON_ERROR=FALSE;
```

With this parameter set to FALSE, you can also pass TRUE as the final argument to AI_REDACT, which causes the return value to
be an OBJECT that contains separate fields for the redacted text and any error message. One of these fields is NULL
depending on whether the AI_REDACT call processed successfully.

The following example shows how to use error handling when processing multiple rows:

1. Create a table with unredacted text.

  Copy code

```
CREATE OR REPLACE TABLE raw_table AS
  SELECT 'My previous manager, Washington, used to live in Kirkland. His first name was Mike.' AS my_column
  UNION ALL
  SELECT 'My name is William and I live in San Francisco. You can reach me at (415).450.0973';
```

2. Set the session parameter.

  Copy code

```
ALTER SESSION SET AI_SQL_ERROR_HANDLING_USE_FAIL_ON_ERROR=FALSE;
```

3. Create a redaction table with columns for `value` and `error`.

  Copy code

```
CREATE OR REPLACE TABLE redaction_table (
  value VARCHAR,
  error VARCHAR
  );
```

4. Redact PII from `raw_table` and insert the rows into `redaction_table` to store the redacted text and error messages.

  Copy code

```
INSERT INTO redaction_table
SELECT
 result:value::STRING AS value,
 result:error::STRING AS error
  FROM (SELECT AI_REDACT(my_column, TRUE) AS result FROM raw_table);
```

## Cost considerations[¶](#cost-considerations)

AI_REDACT incurs costs based on the number of input and output tokens processed, as with other Cortex AI Functions.
See the [Snowflake Pricing Guide](https://www.snowflake.com/pricing/pricing-guide/) for details.

### Estimate token usage for large datasets[¶](#estimate-token-usage-for-large-datasets)

Before you run AI_REDACT on a large dataset, estimate input tokens on representative rows so you can plan for cost and
token limits. Sample text from your table and call [AI_COUNT_TOKENS](/sql-reference/functions/ai_count_tokens) with `'ai_redact'` as the function name, using the same input text and optional `categories` argument you plan to pass to
AI_REDACT. Compare the result against [AI_REDACT token limits](#label-ai-redact-pii-limitations). If a row exceeds the
limit, split the text into chunks before redacting. See [Chunking example](#label-ai-redact-pii-example-chunking).

AI_COUNT_TOKENS returns an estimate of input tokens only. Output token counts depend on the redacted text and aren’t
included in the estimate.

For examples, see [AI_COUNT_TOKENS examples for AI_REDACT](/sql-reference/functions/ai_count_tokens#label-ai-count-tokens-ai-redact-examples).

## Redaction examples[¶](#redaction-examples)

- [Basic redaction examples](#basic-redaction-examples)
- [End-to-end example](#end-to-end-example)
- [Chunking example](#chunking-example)

### Basic redaction examples[¶](#basic-redaction-examples)

The following example redacts a name and an address from the input text.

Copy code

```
SELECT AI_REDACT(
  input => 'My name is John Smith and I live at twenty third street, San Francisco.'
  );
```

Basic redaction output:

```
My name is [NAME] and I live at [ADDRESS]
```

The following example redacts only names and email addresses from the input text. Note that the text only contains a
first name, which is recognized and redacted as [NAME]. The input text does not contain an email address, so no email
placeholder appears in the output.

Copy code

```
SELECT AI_REDACT(
  input => 'My name is John and I live at twenty third street, San Francisco.',
  categories => ['NAME', 'EMAIL']
  );
```

Selective redaction output:

```
My name is [NAME] and I live at twenty third street, San Francisco.
```

### End-to-end example[¶](#end-to-end-example)

The following example processes rows from one table and inserts the redacted output into another table. You could use a similar approach to
store the redacted data in a column in an existing table. After redaction, the text is passed to the [AI_SENTIMENT](/sql-reference/functions/ai_sentiment) function to extract overall sentiment information.

1. Create a table with unredacted text.

  Copy code

```
CREATE OR REPLACE TABLE raw_table AS
  SELECT 'My previous manager, Washington, used to live in Kirkland. His first name was Mike.' AS my_column
  UNION ALL
  SELECT 'My name is William and I live in San Francisco. You can reach me at (415).450.0973';
```

2. View unredacted data.

  Copy code

```
SELECT * FROM raw_table;
```

3. Create a redaction table.

  Copy code

```
CREATE OR REPLACE TABLE redaction_table (value VARCHAR);
```

4. Redact PII from `raw_table` and insert the rows into `redaction_table`.

  Copy code

```
INSERT INTO redaction_table
  SELECT AI_REDACT(my_column) AS value FROM raw_table;
```

5. View redacted results.

  Copy code

```
SELECT * FROM redaction_table;
```

6. Run the AI_SENTIMENT function on redacted text.

  Copy code

```
SELECT
 value AS redacted_text,
 AI_SENTIMENT(value) AS summary_sentiment
  FROM redaction_table;
```

### Chunking example[¶](#chunking-example)

This example illustrates how to redact PII from long text by splitting the text into smaller chunks, redacting each chunk separately,
and then recombining the redacted chunks into the final output. This approach works around AI_REDACT’s token limits.

1. Create a table with patient data.

  Copy code

```
CREATE OR REPLACE TABLE patients (
  patient_id INT PRIMARY KEY,
  patient_notes TEXT
  );
```

2. Split the text into chunks, apply AI_REDACT to each chunk, and concatenate the redacted chunks.

  Copy code

```
CREATE OR REPLACE TABLE final_temp_table AS
  WITH chunked_data AS (
 SELECT
     patient_id,
     chunk.value AS chunk_text,
     chunk.index AS chunk_index
   FROM
     patients,
     LATERAL FLATTEN(
         input => SNOWFLAKE.CORTEX.SPLIT_TEXT_RECURSIVE_CHARACTER(
             patient_notes,
             'none',
             1000
             )
         ) AS chunk
   WHERE
     patient_notes IS NOT NULL
     AND LENGTH(patient_notes) > 0
 ),
  redacted_chunks AS (
   SELECT
       patient_id,
       chunk_index,
       chunk_text,
       TO_VARIANT(results:value) AS redacted_chunk,
       TO_VARIANT(results:error) AS error_string
     FROM (
       SELECT
           patient_id,
           chunk_index,
           chunk_text,
           AI_REDACT(chunk_text,TRUE) AS results
         FROM
           chunked_data
     )
  ),
  final AS (
   SELECT
       chunk_text AS original,
       IFF(error_string IS NOT NULL, chunk_text, redacted_chunk) AS redacted_text,
       patient_id,
       chunk_index
     FROM
       redacted_chunks
  )
  SELECT * FROM final;
```

3. Query the results.

  Copy code

```
SELECT
 patient_id,
 LISTAGG(redacted_text, '') WITHIN GROUP (ORDER BY chunk_index) AS full_output
  FROM final_temp_table
  GROUP BY patient_id;
```

## Detection and selective redaction examples[¶](#detection-and-selective-redaction-examples)

- [Basic detection example](#basic-detection-example)
- [End-to-end with allowlist example](#end-to-end-with-allowlist-example)

### Basic detection example[¶](#basic-detection-example)

The following example identifies and returns the category, location, and text of each detected PII instance without redacting the input.

Copy code

```
SELECT AI_REDACT(
    input => 'My old manager, Washington, used to live in Washington. His first name was Mike.',
    return_error_details => FALSE,
    mode => 'detect'
    );
```

Basic detection output:

```
{
  "spans": [
    {
      "category": "NAME",
      "end": 26,
      "start": 16,
      "text": "Washington"
    },
    {
      "category": "ADDRESS",
      "end": 54,
      "start": 44,
      "text": "Washington"
    },
    {
      "category": "NAME",
      "end": 79,
      "start": 75,
      "text": "Mike"
    }
  ]
}
```

### End-to-end with allowlist example[¶](#end-to-end-with-allowlist-example)

The following example demonstrates a selective redaction workflow that uses `detect` mode and an allowlist. It loads a list of names to
retain from a staged file, uses AI_REDACT in `detect` mode to identify PII locations, and then passes the results to a Python UDF that
redacts only the PII not in the allowlist.

1. Retain an allowlist of values by loading the list from a stage into a temporary table.

  Copy code

```
CREATE OR REPLACE TEMP TABLE string_list (value STRING);

COPY INTO string_list
  FROM @mystage/allowlist.txt
  FILE_FORMAT = (
 TYPE = 'CSV'
 RECORD_DELIMITER = '\n'
 FIELD_DELIMITER = '\t'   -- any char NOT in file
 TRIM_SPACE = TRUE
 SKIP_HEADER = 0
 );
```

2. View the allowlist table

  Copy code

```
SELECT * FROM string_list;
```

   Allowlist table output:

```
VALUE
Mike
David
```

3. Create a Python UDF that selectively redacts PII based on the allowlist.

  Copy code

```
CREATE OR REPLACE FUNCTION redact_spans_with_allowlist(
  SPAN_DATA VARIANT,
  ALLOWLIST ARRAY,
  ORIGINAL_TEXT STRING
  )
  RETURNS STRING
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.8'
  HANDLER = 'redact_text'
  AS
  $$
  def redact_text(span_data, allowlist, original_text):
   spans = span_data.get('spans', [])
   # Sort descending to maintain index integrity
   sorted_spans = sorted(spans, key=lambda x: x['start'], reverse=True)

   result =original_text

    for span in sorted_spans:
       text_val = span.get('text')
       if text_val in allowlist:
           continue

       start, end = span['start'], span['end']
       label = f"[{span['category']}]"

    # Splice thestring
       result = result[:start] + label + result[end:]

   return result
  $$;
```

4. Test the UDF.

  Copy code

```
SELECT redact_spans_with_allowlist(
  PARSE_JSON('{"spans": [{"category": "NAME", "end": 26, "start": 16, "text": "Washington"}, {"category": "NAME", "end": 79, "start": 75, "text": "Mike"}]}'),
  ARRAY_CONSTRUCT('Washington'), -- This will NOT be redacted
  'Hello, my name is Washington and his is Mike.'
  );
```

5. Run AI_REDACT in `detect` mode.

  Copy code

```
CREATE OR REPLACE TABLE raw (message TEXT);

INSERT INTO raw (message) VALUES
  ('My old manager, Washington, used to live in Washington. His first name was Mike.');

SELECT
 t.message AS message,
 AI_REDACT(input=>t.message, return_error_details=>FALSE, mode=>'detect') AS spans,
 redact_spans_with_allowlist(spans, l.str_list, message) AS result
  FROM raw t
 CROSS JOIN (
   SELECT ARRAY_AGG(value) AS str_list
     FROM string_list
   ) l;
```

End-to-end with allowlist example output:

| MESSAGE                                                                          | SPANS                                                                                                                                                                                                    | RESULT                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| My old manager, Washington, used to live in Washington. His first name was Mike. | Copy code   {   "spans": [     {"category": "NAME",     "end": 26,     "start": 16,     "text": "Washington"     },     {"category": "ADDRESS",     "end": 54,     "start": 44,     "text": "Washington"     },     {"category": "NAME",     "end": 79,     "start": 75,     "text": "Mike"     }   ] } | My old manager, [NAME], used to live in [ADDRESS]. His first name was Mike. |

Expand

Show less

See more

## Legal notices[¶](#legal-notices)

The data classification of inputs and outputs are as set forth in the following table.

| Input data classification | Output data classification | Designation                                                                                                          |
| ------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Usage Data                | Customer Data              | Generally available functions are Covered AI Features. Preview functions are Preview AI Features. [[1]](#footnote-1) |

Expand

Show less

See more

[1] Represents the defined term used in the AI Terms and Acceptable Use Policy.

For additional information, refer to [Snowflake AI and ML](/guides-overview-ai-features).

Was this page helpful?

Yes

No

[Visit Snowflake](https://www.snowflake.com)

[Join the conversation](https://community.snowflake.com/s/)

[Develop with Snowflake](https://developers.snowflake.com)

[Share your feedback](/feedback)

[Read the latest on our blog](https://www.snowflake.com/blog/)

[Get your own certification](https://learn.snowflake.com)

[Privacy Notice](https://www.snowflake.com/privacy-policy/)[Site Terms](https://www.snowflake.com/legal/snowflake-site-terms/)Cookies Settings© 2026 Snowflake, Inc. All Rights Reserved.

On this page

1. [AI_REDACT](#ai_redact)
2. [Regional availability](#regional-availability)
3. [Limitations](#limitations)
4. [Detected PII categories](#detected-pii-categories)
5. [Retain specific PII with detect mode](#retain-specific-pii-with-detect-mode)
6. [Handle row-level errors in multi-row queries](#handle-row-level-errors-in-multi-row-queries)
7. [Cost considerations](#cost-considerations)
8. [Redaction examples](#redaction-examples)
9. [Detection and selective redaction examples](#detection-and-selective-redaction-examples)
10. [Legal notices](#legal-notices)

Related content

1. [AI_REDACT](/sql-reference/functions/ai_redact)
