---
type: 'vendor'
title: 'Introduction to ML in BigQuery'
source_url: 'https://cloud.google.com/bigquery/docs/bigqueryml-intro'
vendor: ['gcp']
industry: []
data_stack: ['bigquery']
cloud: ['gcp']
constraints: []
compliance: []
region: []
data_zones: []
latency: []
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

[https://docs.cloud.google.com/bigquery/docs](https://docs.cloud.google.com/bigquery/docs)

- [BigQuery](https://docs.cloud.google.com/bigquery/docs)

[Start free](//console.cloud.google.com/freetrial)

- [Home](https://docs.cloud.google.com/)
- [Documentation](https://docs.cloud.google.com/docs)

- [Data analytics](https://docs.cloud.google.com/docs/data)

- [BigQuery](https://docs.cloud.google.com/bigquery/docs)

- [Guides](https://docs.cloud.google.com/bigquery/docs/introduction)

Send feedback

# Introduction to ML in BigQuery

**Note:** This feature may not be available when using reservations that are created with
 certain BigQuery editions. For more information about which
 features are enabled in each edition, see [Introduction to BigQuery editions](/bigquery/docs/editions-intro).

BigQuery ML lets you [create and run machine learning (ML) models](/bigquery/docs/e2e-journey) by
using either GoogleSQL queries or the Google Cloud console.
BigQuery ML models are stored
in BigQuery datasets, similar to tables and views.
BigQuery ML also lets you access [Gemini Enterprise Agent Platform models](/bigquery/docs/generative-ai-overview) and [Cloud AI APIs](/bigquery/docs/ai-application-overview) to perform artificial
intelligence (AI) tasks like text generation or machine
translation. Gemini for Google Cloud also provides AI-powered
assistance for BigQuery tasks. To see a list of AI-powered
features in BigQuery, see [Gemini in BigQuery overview](/bigquery/docs/gemini-overview).

Usually, performing ML or AI on large datasets requires extensive programming
and knowledge of ML frameworks. These requirements restrict solution development
to a very small set of people within each company, and they exclude data
analysts who understand the data but have limited ML knowledge and programming
expertise. However, with BigQuery ML, SQL practitioners can use
existing SQL tools and skills to build and evaluate models, and to generate
results from LLMs and Cloud AI APIs.

You can work with BigQuery ML capabilities by using the
following:

- The Google Cloud console user interface, to
[work with models by using a UI](/bigquery/docs/create-machine-learning-model-console).
([Preview](https://cloud.google.com/products#product-launch-stages))
- The Google Cloud console query editor, to work with models by using SQL queries.
- The bq command-line tool
- The BigQuery REST API
- Integrated
[Colab Enterprise notebooks in BigQuery](/bigquery/docs/notebooks-introduction)
- External tools such as a Jupyter notebook or business intelligence platform

## Advantages of BigQuery ML

BigQuery ML offers several advantages over other approaches to
using ML or AI with a cloud-based data warehouse:

- BigQuery ML democratizes the use of ML and AI by empowering data
analysts, the primary data warehouse users, to build and run models using
existing business intelligence tools and spreadsheets. Predictive analytics
can guide business decision-making across the organization.

- You don't need to program an ML or AI solution using Python or Java. You
train models and access AI resources by using SQL—a language that's
familiar to data analysts.

- BigQuery ML increases the speed of model development and
innovation by removing the need to move data from the data warehouse.
Instead, BigQuery ML brings ML to the data, which offers the
following advantages:

  * Reduced complexity because fewer tools are required.
  * Increased speed to production because moving and formatting large amounts
of data for Python-based ML frameworks isn't required to train a model in
BigQuery.

  For more information, watch the video [How to accelerate machine learning development with BigQuery ML](https://www.youtube.com/watch?v=EUPBVv9tp38).

## Recommended knowledge

By using the default settings in the `CREATE MODEL` statements and the
inference functions, you can create and use BigQuery ML models
even without much ML knowledge. However, having basic knowledge about the
ML development lifecycle, such as feature engineering and model training,
helps you optimize both your data and your model to
deliver better results. We recommend using the following resources to develop
familiarity with ML techniques and processes:

- [Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course)
- [Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning)
- [Data Cleaning](https://www.kaggle.com/learn/data-cleaning)
- [Feature Engineering](https://www.kaggle.com/learn/feature-engineering)
- [Intermediate Machine Learning](https://www.kaggle.com/learn/intermediate-machine-learning)

## Work with time series

You can use the TimesFM, `ARIMA_PLUS`, and `ARIMA_PLUS_XREG` models to perform [forecasting](/bigquery/docs/forecasting-overview) and [anomaly detection](/bigquery/docs/anomaly-detection-overview) on time series data.

## Perform contribution analysis

You can create a [contribution analysis](/bigquery/docs/contribution-analysis) model to generate insights about changes to key metrics in your
multi-dimensional data. For example, you can find out what data contributed to
a change in revenue.

## Supported models

A [model](https://developers.google.com/machine-learning/glossary/#model) in
BigQuery ML represents what an ML system has
learned from training data. The following sections describe the types of models
that BigQuery ML supports. For more information about
creating reservation assignments for the different types of models, see [Assign slots to BigQuery ML workloads](/bigquery/docs/reservations-assignments#assign-ml-workload).

### Internally trained models

The following models are built in to BigQuery ML:

- [Contribution analysis](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-contribution-analysis) is for determining the effect of
one or more dimensions on the value for a given metric. For example, seeing the
effect of store location and sales date on store revenue. For more
information, see
[Contribution analysis overview](/bigquery/docs/contribution-analysis).

- [Linear regression](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-glm) is for predicting the value of a numerical metric for new data by using a
model trained on similar remote data. Labels are real-valued, meaning
they cannot be positive infinity or negative infinity or a NaN (Not a Number).

- [Logistic regression](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-glm) is for the classification of two or more possible values such as whether an
input is `low-value`, `medium-value`, or
`high-value`. Labels can have up to 50 unique values.

- [K-means clustering](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-kmeans) is for data segmentation. For example, this model identifies customer
segments. K-means is an unsupervised learning technique, so model training
doesn't require labels or split data for training or evaluation.

- [Matrix factorization](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-matrix-factorization) is for creating product recommendation systems. You can create product
recommendations using historical customer behavior, transactions, and product
ratings, and then use those recommendations for personalized customer
experiences.

- [Principal component analysis (PCA)](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-pca) is the process of computing the principal components and using them to
perform a change of basis on the data. It's commonly used for dimensionality
reduction by projecting each data point onto only the first few principal
components to obtain lower-dimensional data while preserving as much of the
data's variation as possible.

- Time series is for performing time series forecasts and anomaly detection.
The [`ARIMA_PLUS`](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-time-series) and [`ARIMA_PLUS_XREG`](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-multivariate-time-series) time series models offer multiple tuning options, and automatically handle
anomalies, seasonality, and holidays.

  If you don't want to manage your own time series forecasting model, you can
use the [`AI.FORECAST` function](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-forecast) with BigQuery ML's built-in [TimesFM time series model](/bigquery/docs/timesfm-model) ([Preview](https://cloud.google.com/products#product-launch-stages)) to perform forecasting.

You can perform a [dry run](/bigquery/docs/running-queries#dry-run) on the `CREATE MODEL` statements for internally trained models to get an estimate of
how much data they will process if you run them.

### Externally trained models

The following models are external to BigQuery ML and trained in
Agent Platform:

- [Deep neural network (DNN)](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-dnn-models) is for creating TensorFlow-based deep neural networks for
classification and regression models.
- [Wide & Deep](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-wnd-models) is useful for generic large-scale regression and classification problems
with sparse inputs
([categorical features](https://en.wikipedia.org/wiki/Categorical_variable) with a large number of possible feature values), such as recommender
systems, search, and ranking problems.
- [Autoencoder](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-autoencoder) is for creating TensorFlow-based models
with the support of sparse data representations. You can use the models in
BigQuery ML for tasks such as unsupervised anomaly detection
and non-linear dimensionality reduction.
- [Boosted trees](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-boosted-tree) is for creating classification and regression models that are based on
[XGBoost](https://xgboost.readthedocs.io/en/latest/).
- [Random forest](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-random-forest) is for constructing multiple learning method decision trees for
classification, regression, and other tasks at training time.
- [AutoML](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-automl) is a supervised ML service that builds and deploys classification and
regression models on tabular data at high speed and scale.

You can't perform a [dry run](/bigquery/docs/running-queries#dry-run) on the `CREATE MODEL` statements for externally trained models to get an estimate of
how much data they will process if you run them.

### Remote models

You can create [remote models](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-remote-model#endpoint) in BigQuery that use models deployed to [Agent Platform](/gemini-enterprise-agent-platform/overview).
You reference the deployed model by specifying the model's [HTTPS endpoint](/gemini-enterprise-agent-platform/machine-learning/general/deployment#what_happens_when_you_deploy_a_model) in the remote model's `CREATE MODEL` statement.

The `CREATE MODEL` statements for remote models don't process any bytes and
don't incur BigQuery charges.

### Imported models

BigQuery ML lets you import custom models that are trained outside
of BigQuery and then perform prediction within
BigQuery. You can import the following models into
BigQuery from [Cloud Storage](/storage):

- [Open Neural Network Exchange (ONNX)](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-onnx) is an open standard format for representing ML models. Using
ONNX, you can make models that are trained with popular ML frameworks
like PyTorch and scikit-learn available in BigQuery ML.
- [TensorFlow](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-tensorflow) is a free, open source software library
for ML and artificial intelligence. You can use TensorFlow
across a range of tasks, but it has a particular focus on training and
inference of deep neural networks. You can load previously trained
TensorFlow models into BigQuery as
BigQuery ML models and then perform prediction in
BigQuery ML.
- [TensorFlow Lite](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-tflite) is a light version of TensorFlow for deployment on mobile
devices, microcontrollers, and other edge devices. TensorFlow
optimizes existing TensorFlow models for reduced model size and
faster inference.
- [XGBoost](/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create-xgboost) is an optimized distributed gradient boosting library designed to be highly
efficient, flexible, and portable. It implements ML algorithms
under the [gradient boosting](https://en.wikipedia.org/wiki/Gradient_boosting) framework.

The `CREATE MODEL` statements for imported models don't process any bytes and
don't incur BigQuery charges.

In BigQuery ML, you can use a model with data from multiple
BigQuery Datasets for training and for prediction.

### Model selection guide

[![This decision tree maps ML models to actions that you want to accomplish.](/static/bigquery/images/ml-model-cheatsheet.svg)](/static/bigquery/images/ml-model-cheatsheet.pdf) [Download the model selection decision tree.](/static/bigquery/images/ml-model-cheatsheet.pdf)

## BigQuery ML and Agent Platform

BigQuery ML integrates with Agent Platform, which is the
end-to-end platform for AI and ML in Google Cloud. You can register your
BigQuery ML models to Model Registry in
order to deploy these models to endpoints for online prediction. For more
information, see the following:

- To learn more about using your BigQuery ML
models with Agent Platform, see
[Manage BigQuery ML models with Agent Platform](/bigquery/docs/managing-models-vertex).
- If you aren't familiar with Agent Platform and want to learn more
about how it integrates with BigQuery ML, see
[Agent Platform for BigQuery users](/gemini-enterprise-agent-platform/machine-learning/beginner/bqml).
- Watch the video
[How to simplify AI models with Agent Platform and BigQuery ML](https://www.youtube.com/watch?v=AVwwkqLOito).

## BigQuery ML and Colab Enterprise

You can now use Colab Enterprise notebooks to perform ML
workflows in BigQuery. Notebooks let you use SQL, Python,
and other popular libraries and languages to accomplish your ML tasks.
For more information, see [Create notebooks](/bigquery/docs/create-notebooks).

## Supported regions

BigQuery ML is supported in the same regions as
BigQuery. For more information, see [BigQuery ML locations](/bigquery/docs/locations#bqml-loc).

## Pricing

You are charged for the compute resources that you use to train models and to
run queries against models. The type of model that you create affects where the
model is trained and the pricing that applies to that operation. Queries
against models always run in BigQuery and use [BigQuery compute pricing](https://cloud.google.com/bigquery/pricing#analysis_pricing_models).
Because [remote models](#remote_models) make calls to Agent Platform
models, queries against remote models also incur charges from
Agent Platform.

You are charged for the storage used by trained models, using [BigQuery storage pricing](https://cloud.google.com/bigquery/pricing#storage).

For more information, see [BigQuery ML pricing](https://cloud.google.com/bigquery/pricing#bqml).

## Quotas

In addition to [BigQuery ML-specific limits](/bigquery/quotas#bqml-quotas),
queries that use BigQuery ML functions and `CREATE MODEL` statements are subject to the quotas and limits on BigQuery [query jobs](/bigquery/quotas#query_jobs).

## Limitations

- BigQuery ML isn't available in the
[Standard edition](/bigquery/docs/editions-intro).

## What's next

- To get started using BigQuery ML, see
[Create machine learning models in BigQuery ML](/bigquery/docs/create-machine-learning-model).

- To learn more about machine learning and BigQuery ML, see the
following resources:
  * [Smart analytics and data management](https://cloud.google.com/learn/training/data-engineering-and-analytics) training program
  * [Machine learning crash course](https://developers.google.com/machine-learning/crash-course/)
  * [Machine learning glossary](https://developers.google.com/machine-learning/glossary/)

- To learn about MLOps with Model Registry, see
[Manage BigQuery ML models in Agent Platform](/bigquery/docs/managing-models-vertex).

- For more information about supported SQL statements and functions for
different model types, see the following documents:

  * [End-to-end user journeys for generative AI models](/bigquery/docs/e2e-journey-genai)
  * [End-to-end user journeys for time series forecasting models](/bigquery/docs/e2e-journey-forecast)
  * [End-to-end user journeys for ML models](/bigquery/docs/e2e-journey)
  * [End-to-end user journeys for imported models](/bigquery/docs/e2e-journey-import)
  * [Contribution analysis user journey](/bigquery/docs/contribution-analysis#contribution_analysis_user_journey)

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-08-11 UTC.
