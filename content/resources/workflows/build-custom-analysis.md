---
title: "Build Custom Analysis"
resource_type: workflow
reference: 
citation: 
description: "Use IBL tools and datasets as reusable building blocks for new analyses."
lead: "Use this workflow when you know the resources you need and want to assemble a custom analysis path."
citations: []
difficulty: advanced
audience:
  - computational neuroscientist
  - partner lab
datasets:
  - brainwide-map
  - behaviour-dataset
uses:
  - one
  - brainbox
  - datoviz
methods:
  - behaviour
  - neuropixels
learning:
  - one-quickstart
  - glossary
next_steps:
  - visualise-results
steps:
  - title: "Choose a dataset"
    summary: "Pick the dataset and modalities that match the research question."
    datasets:
      - brainwide-map
      - behaviour-dataset
  - title: "Load data programmatically"
    summary: "Use ONE as the access layer and Brainbox for analysis utilities."
    uses:
      - one
      - brainbox
  - title: "Add custom code"
    summary: "Keep custom analysis separate from reusable IBL access and utility layers."
    learning:
      - glossary
  - title: "Create interpretable outputs"
    summary: "Use visualisation tools where they support the data type."
    uses:
      - datoviz
---

This page should help experienced users compose the ecosystem without losing the recommended starting points.
