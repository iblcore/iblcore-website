---
title: "Reproduce Publication Results"
resource_type: workflow
modality: []
reference: 
citation: 
description: "Find publication-linked datasets, tools, and notebooks."
lead: "Use this workflow when starting from an IBL paper and moving toward reproducible analysis."
citations: []
difficulty: intermediate
audience:
  - researcher
  - reviewer
  - student
datasets:
  - brainwide-map
  - reproducible-ephys
uses:
  - one
  - brainbox
learning:
  - one-quickstart
  - brainwide-map-colab
methods:
  - neuropixels
next_steps:
  - build-custom-analysis
steps:
  - title: "Identify the publication resource"
    summary: "Start from the paper, project page, or dataset landing page."
    datasets:
      - brainwide-map
      - reproducible-ephys
  - title: "Load the referenced data"
    summary: "Use ONE to resolve sessions and associated data objects."
    uses:
      - one
  - title: "Run the linked tutorial"
    summary: "Use publication-specific notebooks or the closest dataset tutorial."
    learning:
      - brainwide-map-colab
  - title: "Extend the analysis"
    summary: "Move into Brainbox or custom code once the reproduction path runs."
    uses:
      - brainbox
---

Add publication-specific links as the Publications section is migrated into structured content.
