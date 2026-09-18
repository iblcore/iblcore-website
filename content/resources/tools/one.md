---
title: "ONE"
description: "IBL's own Python API for querying and loading its datasets directly, built for deep, IBL-specific analysis."
short_description: "IBL's own Python API, best for deep, IBL-specific analysis with full QC and metadata access."
weight: 10

modality: []
stage:
  - "explore"
  - "analyse"

access:
  - "one"

maintainer: "IBL"

links:
  docs: "https://int-brain-lab.github.io/ONE/"
---

- **ALF format (via ONE)** ONE, IBL's Python client, queries Alyx (the metadata database) for what exists, then pulls only the files you ask for from the public S3 bucket.
- **Fine-grained, native access** ALF stores each attribute as its own small file, so asking for spike times fetches just that file. It carries IBL's full native model (QC labels, histology-aligned brain regions, probe trajectory metadata) with no conversion step.
- **Search before you download** Alyx is a real database, so you can search by subject, lab, task protocol, or brain region before downloading anything, making queries like "every recording touching region X" possible.
