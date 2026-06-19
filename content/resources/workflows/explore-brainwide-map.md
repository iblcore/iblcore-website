---
title: "Explore Brainwide Map"
resource_type: workflow
modality: []
reference: 
citation: 
description: "A first path for discovering Brainwide Map data and tutorials."
lead: "Use this workflow when you want to understand what the Brainwide Map contains and how to begin exploring it."
citations: []
difficulty: beginner
audience:
  - new IBL user
  - researcher
datasets:
  - brainwide-map
uses:
  - one
  - brainbox
learning:
  - brainwide-map-colab
  - one-quickstart
methods:
  - neuropixels
next_steps:
  - analyse-neuropixels-data
  - visualise-results
steps:
  - title: "Confirm the research question"
    summary: "Identify the behaviour, brain area, or recording type you want to inspect."
    datasets:
      - brainwide-map
  - title: "Open the access route"
    summary: "Use ONE to discover available sessions and associated data objects."
    uses:
      - one
    learning:
      - one-quickstart
  - title: "Run the introductory notebook"
    summary: "Use the Brainwide Map Colab to inspect the dataset structure and example analyses."
    learning:
      - brainwide-map-colab
  - title: "Move into analysis"
    summary: "Use Brainbox or workflow-specific notebooks for deeper inspection."
    uses:
      - brainbox
---

This template page should become the primary entry point for researchers who know they want Brainwide Map but do not yet know which tool or tutorial to use first.
