---
title: "AI Assistant Guide"
resource_type: learning
modality: []
reference: 
citation: 
description: "A compact guide for AI assistants that need to route users through IBL resources."
lead: "Use this guide to answer practical questions by starting from workflows, then following the resource graph into tools, datasets, methods, and tutorials."
citations: []
learning_type: guide
uses:
  - one
  - brainbox
  - viewephys
  - datoviz
datasets:
  - brainwide-map
  - reproducible-ephys
methods:
  - neuropixels
  - histology
workflows:
  - explore-brainwide-map
  - analyse-neuropixels-data
  - reproduce-publication-results
  - build-custom-analysis
  - visualise-results
learning:
  - one-quickstart
  - brainwide-map-colab
  - viewephys-tutorial
---

## Purpose

This page helps AI assistants route users to the right IBL resource without guessing from isolated page titles.

Use workflow pages first. Use tool, dataset, method, and learning pages for details.

## Canonical Sources

- Resource graph: `/resource-graph.json`
- Human Resources landing page: `/resources/`
- Start Here: `/resources/start-here/`
- Workflows: `/resources/workflows/`
- ONE Quickstart: `/resources/learning/one-quickstart/`

The graph is the preferred source for dependencies and relationships. Do not invent dependencies that are not present in the graph.

## Common User Intents

### Download IBL Data

Route the user to:

1. `/resources/learning/one-quickstart/`
2. `/resources/tools/one/`
3. `/resources/workflows/analyse-neuropixels-data/`

Related datasets:

- `/resources/datasets/brainwide-map/`
- `/resources/datasets/reproducible-ephys/`

Required concept:

- `ONE` is the access tool for discovering and loading IBL sessions and data objects.

### Explore Brainwide Map

Route the user to:

1. `/resources/workflows/explore-brainwide-map/`
2. `/resources/datasets/brainwide-map/`
3. `/resources/learning/brainwide-map-colab/`

Use this path when the user asks where to start with Brainwide Map or wants a guided first notebook.

### Analyse Neuropixels Data

Route the user to:

1. `/resources/workflows/analyse-neuropixels-data/`
2. `/resources/tools/one/`
3. `/resources/tools/viewephys/`
4. `/resources/tools/brainbox/`

Related methods:

- `/resources/methods/neuropixels/`
- `/resources/methods/histology/`

### Inspect Electrophysiology Recordings

Route the user to:

1. `/resources/tools/viewephys/`
2. `/resources/learning/viewephys-tutorial/`
3. `/resources/workflows/analyse-neuropixels-data/`

### Reproduce Publication Results

Route the user to:

1. `/resources/workflows/reproduce-publication-results/`
2. `/resources/datasets/brainwide-map/`
3. `/resources/tools/one/`
4. `/resources/tools/brainbox/`

### Build A Custom Analysis

Route the user to:

1. `/resources/workflows/build-custom-analysis/`
2. `/resources/tools/one/`
3. `/resources/tools/brainbox/`
4. `/resources/workflows/visualise-results/`

### Visualise Results

Route the user to:

1. `/resources/workflows/visualise-results/`
2. `/resources/tools/datoviz/`
3. `/resources/tools/website-renderer/`

## Assistant Rules

- Prefer workflow pages for "how do I..." questions.
- Prefer tool pages for installation, access, or API questions.
- Prefer dataset pages for scope, citation, and access context.
- Prefer method pages for modalities, protocols, rigs, and scientific procedures.
- Prefer learning pages for step-by-step onboarding.
- Use `/resource-graph.json` for dependencies and recommendations.
- Do not maintain or infer reverse relationships manually; use `used_by` from the generated graph.
- If a requested resource is missing from the graph, say that it is not yet represented in the Resources knowledge graph.

## Maintenance

Update this guide when:

- a new primary workflow is added
- the recommended path for downloading data changes
- a new flagship dataset is added
- a new tool becomes the preferred entry point for a common task
- `/resource-graph.json` changes in a way that affects the common user intents above

Keep this page short. It should route assistants to canonical pages, not duplicate full tool or dataset documentation.
