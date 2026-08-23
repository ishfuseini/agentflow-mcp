---
type: 'vendor'
title: 'Introduction to machine learning on Gemini Enterprise Agent Platform'
source_url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning'
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
- Español – América Latina
- Français
- Indonesia
- Italiano
- Português – Brasil
- עברית
- 中文 – 简体
- 中文 – 繁體
- 日本語
- 한국어Sign in

[https://docs.cloud.google.com/gemini-enterprise-agent-platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform)

- [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform)

[Start free](//console.cloud.google.com/freetrial)

- [Home](https://docs.cloud.google.com/)
- [Documentation](https://docs.cloud.google.com/docs)

- [AI and ML](https://docs.cloud.google.com/docs/ai-ml)

- [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform)

- [Models](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models)

Send feedback

# Introduction to machine learning on Gemini Enterprise Agent Platform

Gemini Enterprise Agent Platform provides a comprehensive suite of tools to help you build,
train, and manage machine learning (ML) models at scale. Whether you are using
AutoML for a fast path to high-quality models or creating custom
models with popular frameworks like TensorFlow and PyTorch, Agent Platform
operationalizes the entire ML lifecycle.

## Data preparation

Before you can train a model, you need to prepare your data. Agent Platform
provides managed datasets to simplify this process.

Managed datasets allow you to provide source data for training models. They are
required for AutoML and optional for custom training. You can
create datasets for different data types, including image and tabular data.

For more information, see [Overview of creating managed datasets on Gemini Enterprise Agent Platform](/gemini-enterprise-agent-platform/machine-learning/datasets/overview).

## Model training

Agent Platform provides a managed training service that helps you operationalize
large-scale model training.

You can run training applications based on any ML framework on Google Cloud
infrastructure. Agent Platform also offers integrated support for popular
frameworks like PyTorch, TensorFlow, scikit-learn, and XGBoost.

Key benefits of serverless training include:

- **Fully managed compute infrastructure**: Train models without provisioning or
managing servers.
- **High performance**: Optimized training jobs that can provide faster
performance.
- **Distributed training**: Support for multi-node distributed training to
reduce time and cost.
- **Hyperparameter optimization**: Automatically discover optimal values for your
model.

For more information, see [serverless training overview](/gemini-enterprise-agent-platform/machine-learning/training/overview).

## Model management

After training your model, you can manage it in the Model Registry.

The Model Registry is a central repository where you can manage the lifecycle of
your ML models. It allows you to track model versions, evaluate model quality,
and deploy models for serving inferences.

For more information, see [Introduction to Model Registry](/gemini-enterprise-agent-platform/machine-learning/model-registry/introduction).

## What's next

- [Create a managed dataset](/gemini-enterprise-agent-platform/machine-learning/datasets/overview).
- [Explore training options](/gemini-enterprise-agent-platform/machine-learning/training/overview).
- [Learn about Model Registry](/gemini-enterprise-agent-platform/machine-learning/model-registry/introduction).

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-08-21 UTC.
