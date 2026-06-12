---
title: "Visualise Results"
description: "Move from analysis outputs to visual inspection and communication."
lead: "Use this workflow when analysis outputs are ready and need to be inspected, shared, or embedded."
resource_type: workflow
difficulty: intermediate
audience:
  - researcher
  - data user
uses:
  - datoviz
  - website-renderer
  - brainbox
datasets:
  - brainwide-map
methods:
  - neuropixels
learning:
  - glossary
next_steps:
  - build-custom-analysis
steps:
  - title: "Prepare analysis outputs"
    summary: "Confirm that the outputs are stable and include enough metadata for interpretation."
    uses:
      - brainbox
  - title: "Choose a visualisation route"
    summary: "Use Datoviz for interactive visualisation or the website renderer for site-ready outputs."
    uses:
      - datoviz
      - website-renderer
  - title: "Connect figures to context"
    summary: "Link visualisations back to the workflow, dataset, and methods that produced them."
    datasets:
      - brainwide-map
    methods:
      - neuropixels
---

Add concrete visualisation examples once the production resource inventory is migrated.
