---
title: "Analyse Neuropixels Data"
resource_type: workflow
modality: []
reference: 
citation: 
description: "Find, inspect, analyse, and visualise Neuropixels recordings."
lead: "Use this workflow to move from session discovery to analysis-ready Neuropixels data."
citations: []
difficulty: intermediate
audience:
  - electrophysiologist
  - computational neuroscientist
  - data user
datasets:
  - brainwide-map
  - reproducible-ephys
uses:
  - one
  - alyx
  - viewephys
  - brainbox
methods:
  - neuropixels
  - histology
learning:
  - one-quickstart
  - viewephys-tutorial
next_steps:
  - workflow-spike-sorting
  - anatomical-localisation
  - visualise-results
steps:
  - title: "Find sessions"
    summary: "Search for sessions that match project, subject, probe, and task criteria."
    uses:
      - one
      - alyx
    datasets:
      - brainwide-map
      - reproducible-ephys
  - title: "Download or stream data"
    summary: "Use ONE to access the required ALF objects for the selected sessions."
    uses:
      - one
    learning:
      - one-quickstart
  - title: "Inspect recordings"
    summary: "Open electrophysiology traces and quality-control views before analysis."
    uses:
      - viewephys
    learning:
      - viewephys-tutorial
  - title: "Run analysis"
    summary: "Use Brainbox and project notebooks to build analyses on top of curated data."
    uses:
      - brainbox
  - title: "Visualise results"
    summary: "Move into dedicated visualisation tools when the analysis output is ready."
    uses:
      - datoviz
---

This page is the first complete resource workflow template. Keep the workflow goal-oriented and move tool-specific details into the linked tool or learning pages.
