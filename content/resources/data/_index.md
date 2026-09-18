---
title: "Datasets"
description: "Datasets and access paths."
lead: "Browse the datasets IBL-Core has released, and see what's coming next."
layout: "dataset-grid"

cascade:
  layout: "dataset-detail"

data_format_intro: "You can access IBL's released datasets through ONE, DANDI & NWB, or the IBL AI Agent — not every dataset is available through every route. Open a dataset's own page for step-by-step guides to the routes available for it."

data_format_rule_of_thumb_intro: "When more than one route is available, here's how to choose:"

data_format_rule_of_thumb:
  - "Deep IBL-specific analysis, full QC/metadata access, or following IBL's own published analysis code? Use ONE."
  - "A cross-lab, tool-agnostic pipeline, or a stable, citable release? Use DANDI & NWB."
  - "Want to describe what you need in plain language and explore it interactively, without setting up ONE or DANDI yourself? Use the IBL AI Agent (requires a paid agentic-coding subscription)."

data_formats:
  - key: "one"
    name: "ONE"
    description: "IBL's own Python API for querying and loading its datasets directly, built for deep, IBL-specific analysis."
    short_description: "IBL's own Python API, best for deep, IBL-specific analysis with full QC and metadata access."
    details:
      - label: "ALF format (via ONE)"
        text: "ONE, IBL's Python client, queries Alyx (the metadata database) for what exists, then pulls only the files you ask for from the public S3 bucket."
      - label: "Fine-grained, native access"
        text: "ALF stores each attribute as its own small file, so asking for spike times fetches just that file. It carries IBL's full native model (QC labels, histology-aligned brain regions, probe trajectory metadata) with no conversion step."
      - label: "Search before you download"
        text: "Alyx is a real database, so you can search by subject, lab, task protocol, or brain region before downloading anything, making queries like \"every recording touching region X\" possible."
    docs_link: "https://int-brain-lab.github.io/ONE/"
  - key: "dandi"
    name: "DANDI & NWB"
    description: "Datasets packaged as NWB on the DANDI Archive, with stable, versioned releases."
    short_description: "NWB releases on the DANDI Archive, best for a stable, citable release that works with any NWB tool."
    details:
      - label: "NWB format"
        text: "NWB (Neurodata Without Borders) packages an entire session (spikes, behavior, trials, imaging, metadata) into one self-describing file, readable the same way across labs and tools."
      - label: "Portable, partial access"
        text: "Built on HDF5, a hierarchical container format: stream just the piece you need (e.g., one unit's spikes) without downloading the whole file."
      - label: "Broad tool ecosystem"
        text: "Works with pynwb, MatNWB, NWB Explorer, DataJoint, and other general NWB tools, not just IBL's own software."
    docs_link: "https://docs.dandiarchive.org/"
  - key: "ibl-ai-agent"
    name: "IBL-AI-Agent"
    description: "An agent-driven workflow that downloads a compressed, ready-to-use subset of IBL's data. Just describe what you want in plain language."
    short_description: "A small, ready-to-use data subset, delivered by describing what you need in plain language."
    details:
      - label: "Compressed derivative (via IBL AI Agent)"
        text: "Run the IBL AI Agent alongside a coding agent (OpenAI Codex or Claude Code) and describe what you want in plain language, and it downloads a pre-built, analysis-ready subset of the data to work with directly."
      - label: "Derived, not raw"
        text: "Parquet metadata/feature tables plus compressed spike shards (one per probe): spike times to 0.1 ms resolution for high-quality units only, brain locations, and behavioral traces."
      - label: "Small and fast"
        text: "The whole release stays under 10 GB combined (a fraction of raw or full ONE data), trading raw-data completeness for something you can download and query in minutes."
    docs_link: "https://github.com/int-brain-lab/ibl-ai-agent/"
---
