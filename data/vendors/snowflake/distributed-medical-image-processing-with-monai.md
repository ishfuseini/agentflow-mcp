---
type: 'vendor'
title: 'Distributed Medical Image Processing with MONAI on Snowflake'
source_url: 'https://www.snowflake.com/en/developers/guides/distributed-medical-image-processing-with-monai/'
vendor: ['snowflake']
industry: ['healthcare']
data_stack: ['snowflake']
cloud: []
constraints: []
compliance: []
region: []
data_zones: []
latency: []
scraped_at: '2026-08-23'
---

[Skip to content](#responsive-grid-main-content)

Snowflake World Tour hits your city

See how leading teams deploy agents at scale. Find a stop near you.

[Register free](/en/world-tour/)

[Snowflake for Developers](https://www.snowflake.com/content/snowflake-site/global/en/developers)/[Guides](https://www.snowflake.com/content/snowflake-site/global/en/developers/guides)/Distributed Medical Image Processing with MONAI on Snowflake

Certified Solution

## Distributed Medical Image Processing with MONAI on Snowflake

Model Development

Carlos Guzman, Jeevan Rag, Joviane Bellegarde

[Fork Repo](https://github.com/Snowflake-Labs/sfquickstarts/tree/master/site/sfguides/src/distributed-medical-image-processing-with-monai)

## Overview

Medical image registration is a critical task in healthcare AI, enabling the alignment of CT scans taken at different times or breathing phases. This guide demonstrates how to build a production-ready training and inference pipeline using **MONAI** (Medical Open Network for AI) on **Snowflake with GPU acceleration**.

In this Guide, you will build a complete medical image registration system that:

- Downloads and processes lung CT scans from public datasets
- Trains a LocalNet deep learning model using Snowflake ML Jobs on GPU compute pools
- Logs the trained MONAI model natively to Snowflake's Model Registry
- Runs distributed batch inference using the `run_batch()` API

### What You Will Build

- Data ingestion pipeline for NIfTI medical images
- GPU-accelerated training using Snowflake ML Jobs
- Native MONAI model registration with Snowflake Model Registry
- Distributed batch inference pipeline with parallel processing
- Results stored in Snowflake stages for downstream analysis

### What You Will Learn

- How to use Snowflake GPU compute pools for deep learning workloads
- How to integrate MONAI medical imaging framework with Snowflake
- How to leverage Snowflake ML Jobs (`@remote` decorator) for GPU training
- How to log PyTorch/MONAI models natively to Snowflake Model Registry
- How to run distributed batch inference with `run_batch()` API
- How to store and retrieve medical images from Snowflake stages

### Prerequisites

- Familiarity with Python and deep learning concepts
- Familiarity with medical imaging (helpful but not required)
- A Snowflake account with access to GPU compute pools
- Go to the [Snowflake](https://signup.snowflake.com/?utm_source=snowflake-devrel&utm_medium=developer-guides&utm_cta=developer-guides) sign-up page and register for a free account

## Architecture Overview

### Solution Architecture

The MONAI medical image processing solution consists of one setup script and three notebooks:

| File                                                                                                                                                                                 | Description                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [01\_setup.sql](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/01_setup.sql)                                 | Snowflake infrastructure setup (roles, warehouse, compute pool, stages) |
| [02\_ingest\_data.ipynb](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/02_ingest_data.ipynb)                | Download and upload paired lung CT scans to Snowflake stages            |
| [03\_train\_and\_register.ipynb](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/03_train_and_register.ipynb) | Train LocalNet model on GPU, log to Snowflake Model Registry            |
| [04\_batch\_inference.ipynb](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/04_batch_inference.ipynb)        | Run distributed batch inference using `run_batch()` API                 |

### Model Architecture

**LocalNet** predicts a deformation displacement field (DDF) to align moving images to fixed images:

````
```
Moving Image (Inspiration CT) ──┐
                                ├── LocalNet ──► DDF ──► Aligned Image
Fixed Image (Expiration CT) ────┘
```
````

- **Input**: 2 channels (moving + fixed CT scans)
- **Output**: 3 channels (DDF x, y, z displacement components)
- **Loss**: Mutual Information + Bending Energy regularization

### Key Technologies

| Technology                   | Purpose                                               |
| ---------------------------- | ----------------------------------------------------- |
| **MONAI**                    | Medical imaging transforms, networks, and losses      |
| **PyTorch**                  | Deep learning framework                               |
| **Snowflake ML Jobs**        | GPU-accelerated remote training (`@remote` decorator) |
| **Snowflake Model Registry** | Native model logging and versioning                   |
| **Batch Inference API**      | Distributed inference via `run_batch()`               |

## Setup Snowflake Environment

In this step, you'll create all the Snowflake objects needed for the MONAI solution.

### Step 1: Configure Snowflake Connection

Create or update your connection configuration in `~/.snowflake/connections.toml`:

````
```toml
[monai-quickstart]
account = "your_account"
user = "your_user"
authenticator = "externalbrowser"  # or use password/key-pair
```
````

### Step 2: Run the Setup Script

1. In Snowsight, click `Projects`, then `Worksheets` in the left navigation
2. Click `+ Worksheet` to create a new SQL worksheet
3. Copy the contents of [01_setup.sql](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/01_setup.sql) and paste into the worksheet
4. Run the script as ACCOUNTADMIN

The setup script creates:

- **Role**: `MONAI_USER` with appropriate privileges
- **Warehouse**: `MONAI_WH` (XSMALL size)
- **Database**: `MONAI_QUICKSTART_DB` with `ML` schema
- **Stages**: `MEDICAL_IMAGES_STG`, `MODEL_ARTIFACTS_STG`, `BATCH_INPUT_STG`, `BATCH_OUTPUT_STG`
- **GPU Compute Pool**: `MONAI_GPU_POOL` (GPU_NV_S instances)
- **External Access Integrations**: For PyPI and Zenodo access

### Step 3: Verify Setup

After the setup script completes, verify the resources:

````
```sql
SHOW GRANTS TO ROLE MONAI_USER;
SHOW COMPUTE POOLS;
```
````

## Run Data Ingestion Notebook

### Step 1: Open the Notebook

Open [02_ingest_data.ipynb](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/02_ingest_data.ipynb) in your preferred Jupyter environment (VS Code, JupyterLab, or Snowflake Notebooks).

### Step 2: Update Configuration

Update the `CONNECTION_NAME` variable to match your connection:

````
```python
CONNECTION_NAME = "monai-quickstart"  # Your connection name from connections.toml
```
````

### Step 3: Run All Cells

The notebook will:

1. Connect to Snowflake using your configured connection
2. Download the paired lung CT dataset from Zenodo (~279 MB)
3. Upload 80 NIfTI files to Snowflake stages (40 scans + 40 lung masks)

### Expected Output

After successful execution, you should see:

- 20 paired lung CT scan cases uploaded
- Files organized in `scans/` and `lungMasks/` folders
- All files stored with Snowflake Server-Side Encryption

````
```
Files in stage: 80
```
````

### Dataset Details

- **Source**: [Paired Lung CT Dataset](https://zenodo.org/record/3835682)
- **Format**: NIfTI (.nii.gz) 3D volumes
- **Contents**: 20 cases with inspiration/expiration CT pairs and lung masks

## Run Model Training Notebook

### Step 1: Open the Training Notebook

Open [03_train_and_register.ipynb](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/03_train_and_register.ipynb) in your Jupyter environment.

### Step 2: Update Configuration

Verify the configuration matches your setup:

````
```python
CONNECTION_NAME = "monai-quickstart"
COMPUTE_POOL = "MONAI_GPU_POOL"
```
````

### Step 3: Understand the Training Pipeline

The notebook executes these key steps:

1. **Data Preparation**: Split data into 16 training and 4 validation cases
2. **Remote Training Job**: Uses `@remote` decorator to run training on GPU compute pool
3. **Training Loop**: Trains LocalNet with Mutual Information + Bending Energy loss
4. **Model Checkpointing**: Saves best model weights to Snowflake stage
5. **Model Registration**: Logs the trained MONAI model natively to Snowflake Model Registry

### Training Configuration

| Parameter       | Value        | Description                    |
| --------------- | ------------ | ------------------------------ |
| `spatial_size`  | (96, 96, 96) | Volume dimensions after resize |
| `batch_size`    | 2            | Samples per batch              |
| `max_epochs`    | 15           | Training iterations            |
| `learning_rate` | 1e-4         | Optimizer step size            |

### Step 4: Run Training

Execute all cells. The training job will:

1. Submit to the GPU compute pool
2. Train for 15 epochs (~10-15 minutes depending on GPU availability)
3. Report validation Dice scores during training

````
```
Epoch 15/15: loss=X.XXXX, dice=0.8089
Training complete! Best Dice: 0.8089
```
````

### Step 5: Model Registration

The notebook logs the model natively to Snowflake Model Registry:

````
```python
mv = registry.log_model(
    model=model,
    model_name="MONAI_LUNG_CT_REGISTRATION",
    version_name="v1",
    sample_input_data=sample_input,
    pip_requirements=["monai>=1.3.0", "nibabel", "torch>=2.0.0"],
)
```
````

This registers the MONAI LocalNet model with:

- Automatic signature inference from sample input
- pip dependencies for runtime environment
- Native PyTorch model serialization

### Step 6: Verify Model Registration

Check the model signature:

````
```
Function: FORWARD
  Inputs: [('input_feature_0', (96, 96, 96)), ('input_feature_1', (96, 96, 96))]
  Outputs: [('output_feature_0', (96, 96, 96)), ('output_feature_1', (96, 96, 96)), ('output_feature_2', (96, 96, 96))]
```
````

## Run Batch Inference Notebook

### Step 1: Open the Inference Notebook

Open [04_batch_inference.ipynb](https://www.snowflake.com/content/dam/snowflake-site/developers/guides/distributed-medical-image-processing-with-monai/04_batch_inference.ipynb) in your Jupyter environment.

### Step 2: Load Model from Registry

The notebook retrieves the trained model:

````
```python
registry = Registry(session=session, database_name=DATABASE, schema_name=SCHEMA)
mv = registry.get_model("MONAI_LUNG_CT_REGISTRATION").version("v1")
```
````

### Step 3: Prepare Batch Input

The notebook:

1. Downloads test images from the stage
2. Preprocesses each CT pair (normalization, resizing)
3. Creates a DataFrame with 3D volumetric arrays as input features

### Step 4: Run Distributed Batch Inference

Execute batch inference on the GPU compute pool using the `run_batch()` API:

````
```python
job = mv.run_batch(
    compute_pool="MONAI_GPU_POOL",
    X=batch_input_df,
    output_spec=OutputSpec(stage_location=BATCH_OUTPUT_STAGE),
)
job.wait()
```
````

This automatically:

- Distributes inference across GPU nodes
- Processes all cases in parallel
- Writes results to the output stage

### Step 5: Review Results

The notebook displays inference results:

````
```
Batch Inference Results
==================================================
case_001 -> 3_8e91864dace8496d9f32f5c745271cca_000000_000000-0.parquet
case_002 -> 3_8e91864dace8496d9f32f5c745271cca_000001_000000-0.parquet
...
==================================================
Total: 10 cases processed
```
````

Each output contains the deformation displacement field (DDF) with 3 channels (x, y, z displacements).

## Cleanup

To remove all resources created by this guide:

1. In Snowsight, open a SQL worksheet
2. Run the following cleanup commands:

````
```sql
-- Drop compute pool first (requires stopping any running jobs)
ALTER COMPUTE POOL MONAI_GPU_POOL STOP ALL;
DROP COMPUTE POOL IF EXISTS MONAI_GPU_POOL;

-- Drop external access integrations
DROP INTEGRATION IF EXISTS PYPI_EAI;
DROP INTEGRATION IF EXISTS ZENODO_EAI;

-- Drop network rules
DROP NETWORK RULE IF EXISTS MONAI_QUICKSTART_DB.ML.PYPI_RULE;
DROP NETWORK RULE IF EXISTS MONAI_QUICKSTART_DB.ML.ZENODO_RULE;

-- Drop database (includes all schemas, stages, and models)
DROP DATABASE IF EXISTS MONAI_QUICKSTART_DB;

-- Drop warehouse
DROP WAREHOUSE IF EXISTS MONAI_WH;

-- Drop role
DROP ROLE IF EXISTS MONAI_USER;
```
````

## Conclusion and Resources

Congratulations! You have successfully built a medical image registration pipeline using MONAI on Snowflake.

### What You Learned

- How to configure Snowflake GPU compute pools for deep learning workloads
- How to use MONAI for medical image processing tasks
- How to leverage Snowflake ML Jobs for GPU-accelerated training
- How to log PyTorch/MONAI models natively to Snowflake Model Registry
- How to run distributed batch inference with the `run_batch()` API
- How to store and process medical images in Snowflake stages

### Related Resources

**Blog:**

- [Medium: Distributed Medical Image Processing with MONAI](https://medium.com/@carlos.guzman_87814/ff68e1b09544)

**Snowflake Documentation:**

- [Model Registry](https://docs.snowflake.com/en/developer-guide/snowflake-ml/model-registry/overview)
- [ML Jobs](https://docs.snowflake.com/en/developer-guide/snowflake-ml/jobs)
- [Compute Pools](https://docs.snowflake.com/en/developer-guide/snowpark-container-services/compute-pool)

**MONAI Resources:**

- [MONAI Documentation](https://docs.monai.io/)
- [MONAI GitHub](https://github.com/Project-MONAI/MONAI)
- [MONAI Tutorials](https://github.com/Project-MONAI/tutorials)

**Dataset:**

- [Paired CT Lung Dataset](https://zenodo.org/record/3835682)

Updated Mar 5, 2026

This content is provided as is, and is not maintained on an ongoing basis. It may be out of date with current Snowflake instances

##### On this page

[Overview](#overview)

[Architecture Overview](#architecture-overview)

[Setup Snowflake Environment](#setup-snowflake-environment)

[Run Data Ingestion Notebook](#run-data-ingestion-notebook)

[Run Model Training Notebook](#run-model-training-notebook)

[Run Batch Inference Notebook](#run-batch-inference-notebook)

[Cleanup](#cleanup)

[Conclusion and Resources](#conclusion-and-resources)

**Subscribe to our monthly newsletter**

Stay up to date on Snowflake’s latest products, expert insights and resources—right in your inbox!

Product

- [Platform](https://www.snowflake.com/en/product/platform/)
- [Snowflake CoWork](/en/product/snowflake-cowork/)
- [Data Engineering](https://www.snowflake.com/en/product/data-engineering/)
- [Analytics](https://www.snowflake.com/en/product/analytics/)
- [AI](https://www.snowflake.com/en/product/ai/)
- [Applications & Collaboration](https://www.snowflake.com/en/product/applications-and-collaboration/)
- [Pricing](https://www.snowflake.com/en/pricing-options/)

Support

- [Support](https://www.snowflake.com/en/support/)
- [Priority Support](https://www.snowflake.com/en/legal/addenda/priority-support-services-description/)
- [Status](https://status.snowflake.com/)

[Industries](/en/solutions/industries/)

- [Advertising, Media & Entertainment](/en/solutions/industries/advertising-media-entertainment/)
- [Financial Services](/en/solutions/industries/financial-services/)
- [Healthcare & Life Sciences](/en/solutions/industries/healthcare-and-life-sciences/)
- [Manufacturing](/en/solutions/industries/manufacturing/)
- [Public Sector](/en/solutions/industries/public-sector/)
- [Retail & Consumer Goods](/en/solutions/industries/retail-consumer-goods/)
- [Telecom](/en/solutions/industries/telecom/)
- [Technology](https://www.snowflake.com/en/solutions/industries/technology/)

Company

- [About Snowflake](https://www.snowflake.com/en/company/overview/about-snowflake/)
- [Leadership & Board](https://www.snowflake.com/en/company/overview/leadership-and-board/)
- [Careers](https://careers.snowflake.com/us/en)
- [Investor Relations](https://investors.snowflake.com/overview/default.aspx)
- [Trust Center](https://trust.snowflake.com/)
- [Brand Guidelines](https://www.snowflake.com/brand-guidelines/)
- [Contact](https://www.snowflake.com/en/contact/)
- [Newsroom](https://www.snowflake.com/en/news/)
- [Environmental, Social & Governance](https://www.snowflake.com/en/company/overview/esg/)
- [Snowflake Ventures](https://www.snowflake.com/en/company/overview/snowflake-ventures/)
- [End Data Disparity](https://www.snowflake.com/en/company/overview/end-data-disparity/)
- [Snowflake Summit 26](/en/summit/)

Learn

- [Resource Library](https://snowflake.com/en/resources/)
- [Live Demos](/en/webinars/demo/)
- [Fundamentals](https://www.snowflake.com/en/fundamentals/)
- [Training](https://www.snowflake.com/en/resources/learn/training/)
- [Certifications](https://www.snowflake.com/en/resources/learn/certifications/)
- [Snowflake University](https://learn.snowflake.com/en/)
- [Developer Guides](https://www.snowflake.com/en/developers/guides)
- [Documentation](https://docs.snowflake.com/)
- [Data Governance](/en/data-governance/)

[Snowflake logo](/en/)

- © 2026 Snowflake Inc. All Rights Reserved
- [Privacy Policy](https://www.snowflake.com/en/legal/privacy/privacy-policy/)
- [Site Terms](https://snowflake.com/en/legal/snowflake-site-terms/)
- [Communication Preferences](https://info.snowflake.com/Preference-center.html)
- Cookie Settings

- [Do Not Share My Personal Information](https://www.snowflake.com/en/legal/privacy/privacy-policy/#12)
- [Legal](https://www.snowflake.com/en/legal/)

[https://x.com/Snowflake](https://x.com/Snowflake "X (Twitter)")

[https://www.linkedin.com/company/3653845](https://www.linkedin.com/company/3653845 "LinkedIn")

[https://www.facebook.com/snowflakedb/](https://www.facebook.com/snowflakedb/ "Facebook")

[https://www.youtube.com/user/snowflakecomputing](https://www.youtube.com/user/snowflakecomputing "YouTube")
