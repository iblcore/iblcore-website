---
title: "Anatomical Localisation"
resource_type: workflow
reference: 
citation: 
description: "Connect recordings to anatomical locations and histology workflows."
lead: "Use this workflow when you need to align recordings with brain anatomy."
citations: []
difficulty: advanced
audience:
  - electrophysiologist
  - anatomical data user
uses:
  - histology-alignment-gui
  - brainbox
methods:
  - histology
  - neuropixels
learning:
  - histology-alignment-tutorial
next_steps:
  - visualise-results
steps:
  - title: "Collect required metadata"
    summary: "Confirm probe, track, and histology records before alignment."
    methods:
      - histology
  - title: "Perform alignment"
    summary: "Use the histology alignment GUI for anatomical registration."
    uses:
      - histology-alignment-gui
    learning:
      - histology-alignment-tutorial
  - title: "Use locations in analysis"
    summary: "Connect aligned locations to downstream analysis and visualisation."
    uses:
      - brainbox
      - datoviz
---

This workflow should stay focused on user decisions and required resources, not protocol-level detail.
