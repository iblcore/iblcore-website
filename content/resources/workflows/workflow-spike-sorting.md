---
title: "Spike Sorting Workflow"
resource_type: workflow
reference: 
citation: 
description: "Overview of how raw Neuropixels recordings move through spike sorting and inspection."
lead: "Use this workflow to understand where spike sorting fits in the IBL electrophysiology pipeline."
citations: []
difficulty: advanced
audience:
  - electrophysiologist
  - data engineer
uses:
  - spike-sorting-pipeline
  - viewephys
  - brainbox
methods:
  - neuropixels
learning:
  - spike-sorting-tutorial
next_steps:
  - anatomical-localisation
  - visualise-results
steps:
  - title: "Prepare recordings"
    summary: "Confirm that raw recordings and metadata are available and correctly registered."
    methods:
      - neuropixels
  - title: "Run the pipeline"
    summary: "Use the IBL spike sorting pipeline for standard processing."
    uses:
      - spike-sorting-pipeline
  - title: "Inspect outputs"
    summary: "Review sorted units and recording quality before downstream analysis."
    uses:
      - viewephys
  - title: "Connect to analysis"
    summary: "Use sorted outputs in Brainbox or project-specific analysis notebooks."
    uses:
      - brainbox
---

This page is the user journey. It explains when spike sorting belongs in the broader electrophysiology workflow, which resources are involved, and what you should do after the outputs are ready.

Keep implementation details in the linked tool and tutorial pages so this workflow remains an overview.
