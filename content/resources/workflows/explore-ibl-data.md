---
title: "Explore and analyse IBL data"
description: "From choosing an access route to visualising what you have loaded, using IBL's released datasets."
weight: 1

modality: []
stage:
  - "explore"
  - "analyse"

steps:
  - title: "Choose an access route"
    resource:
      - "/resources/tools/one"
      - "/resources/tools/dandi"
      - "/resources/tools/ibl-ai-agent"
    note: |
      Every released dataset is available through at least one of these routes,
      and not every dataset is available through all of them. When more than one
      route is available, here's how to choose:

      - Deep IBL-specific analysis, full QC/metadata access, or following IBL's own published analysis code? Use ONE.
      - A cross-lab, tool-agnostic pipeline, or a stable, citable release? Use DANDI & NWB.
      - Want to describe what you need in plain language and explore it interactively, without setting up ONE or DANDI yourself? Use the IBL AI Agent (requires a paid agentic-coding subscription).

  - title: "Choose a dataset"
    resource:
      - "/resources/data/brainwide-map"
      - "/resources/data/reproducible-ephys"
      - "/resources/data/behavior"
      - "/resources/data/widefield"
      - "/resources/data/ephys-autism"
    note: |
      Open a dataset's own page to see which routes it is available through and
      to find the step-by-step guide for each one.

  - title: "Find the sessions you need"
    resource: "/resources/tools/alyx"
    note: |
      Alyx is the metadata database behind the recordings. Because it is a real
      database, you can search by subject, lab, task protocol or brain region
      before downloading anything, so a question like "every recording touching
      region X" is answerable up front.

  - title: "Visualise what you load"
    resource: "/resources/tools/datoviz"
    note: |
      Datoviz renders large datasets interactively from your own code. To look
      at the Brainwide Map without writing any, open the
      [IBL Data Explorer](https://viz.internationalbrainlab.org).
---
