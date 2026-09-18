---
title: "DANDI & NWB"
description: "Datasets packaged as NWB on the DANDI Archive, with stable, versioned releases."
short_description: "NWB releases on the DANDI Archive, best for a stable, citable release that works with any NWB tool."
weight: 11

modality: []
stage:
  - "explore"
  - "analyse"

access:
  - "dandi"

maintainer: "DANDI Archive"

links:
  docs: "https://docs.dandiarchive.org/"
---

- **NWB format** NWB (Neurodata Without Borders) packages an entire session (spikes, behavior, trials, imaging, metadata) into one self-describing file, readable the same way across labs and tools.
- **Portable, partial access** Built on HDF5, a hierarchical container format: stream just the piece you need (e.g., one unit's spikes) without downloading the whole file.
- **Broad tool ecosystem** Works with pynwb, MatNWB, NWB Explorer, DataJoint, and other general NWB tools, not just IBL's own software.
