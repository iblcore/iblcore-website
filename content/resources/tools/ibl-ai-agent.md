---
title: "IBL-AI-Agent"
description: "An agent-driven workflow that downloads a compressed, ready-to-use subset of IBL's data. Just describe what you want in plain language."
short_description: "A small, ready-to-use data subset, delivered by describing what you need in plain language."
weight: 12

modality: []
stage:
  - "explore"
  - "analyse"

access:
  - "ibl-ai-agent"

maintainer: "IBL"

links:
  docs: "https://github.com/int-brain-lab/ibl-ai-agent/"
---

- **Compressed derivative (via IBL AI Agent)** Run the IBL AI Agent alongside a coding agent (OpenAI Codex or Claude Code) and describe what you want in plain language, and it downloads a pre-built, analysis-ready subset of the data to work with directly.
- **Derived, not raw** Parquet metadata/feature tables plus compressed spike shards (one per probe): spike times to 0.1 ms resolution for high-quality units only, brain locations, and behavioral traces.
- **Small and fast** The whole release stays under 10 GB combined (a fraction of raw or full ONE data), trading raw-data completeness for something you can download and query in minutes.
