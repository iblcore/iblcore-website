---
title: "ONE"
card_image:
  src: "images/one-card.png"
  alt: "Four stacked bars standing for the parts of a session, one picked out in blue and carried away by an arrow, beside the word ONE in the same rounded badge the site uses to mark this access route."
description: "IBL's own Python API for querying and loading its datasets directly, built for deep, IBL-specific analysis."
short_description: "IBL's own Python API, best for deep, IBL-specific analysis with full QC and metadata access."
weight: 10

modality: []
stage:
  - "analyse"

access:
  - "one"

maintainer: "IBL"

links:
  docs: "https://int-brain-lab.github.io/ONE/"
---

ONE is IBL's Python client for its own datasets. It queries Alyx, the metadata
database, for what exists, then downloads only the files you ask for from IBL's
public S3 bucket. Because the search runs in the database before anything is
fetched, a question like "every recording touching region X" is answerable up
front rather than after a long download.

The data arrives in ALF, the format IBL stores it in, where each attribute is
its own small file: asking for spike times fetches the spike times and nothing
else. Nothing is converted on the way through either, so QC labels,
histology-aligned brain regions and probe trajectory metadata reach you exactly
as IBL records them. That fidelity is the reason to choose ONE over a packaged
export when the analysis is deep and IBL-specific.
