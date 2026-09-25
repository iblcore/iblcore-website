---
title: "Explore and analyse IBL data"
description: "From choosing a dataset to visualising what you have loaded, using IBL's released datasets."
weight: 1

modality: []
stage:
  - "analyse"

steps:
  - title: "Choose a dataset and access route"
    choice: "dataset"
    resource:
      - "/resources/data/brainwide-map"
      - "/resources/data/reproducible-ephys"
      - "/resources/data/behavior"
      - "/resources/data/widefield"
      - "/resources/data/ephys-autism"
    routes:
      - "/resources/tools/one"
      - "/resources/tools/dandi"
      - "/resources/tools/ibl-ai-agent"
    note: |
      Every dataset lists the routes it is published through and the
      step-by-step guide for each one. Not every dataset is published through
      every route, and the IBL AI Agent requires a paid agentic-coding
      subscription.

  - title: "Find the sessions you need"
    resource: "/resources/tools/alyx"
    note: |
      Alyx is the metadata database behind the recordings. Because it is a real
      database, you can search by subject, lab, task protocol or brain region
      before downloading anything, so a question like "every recording touching
      region X" is answerable up front.

  - title: "Visualise what you load"
    resource:
      - "/resources/tools/datoviz"
      - "/resources/tools/data-explorer"
    note: |
      Datoviz renders large datasets interactively from your own code. To look
      at recordings without writing any, open the IBL Data Explorer.
---
