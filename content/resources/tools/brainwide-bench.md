---
title: "IBL BrainWideBench"
description: "A standardised benchmark for models pretrained on brain-wide neural recordings."
weight: 5

modality:
  - "neuropixels"
  - "behavior"
stage:
  - "benchmark"

links:
  platform: "https://bwb.iblcore.org"
  docs: "https://brainbench-org.github.io/ibl-bwb"
  code: "https://github.com/brainbench-org/ibl-bwb"
  preprint: "https://arxiv.org/abs/2609.22064"
---

IBL BrainWideBench is an evaluation suite for models trained on brain-wide
spiking activity. The data comes from the IBL Brain Wide Map, Neuropixels
recordings from 139 mice performing a sensory-guided decision-making task, with
behaviour measured at the same time.

Comparing such models has been difficult, because evaluation protocols are
fragmented and most cover only a single task domain. The suite fixes the
protocol so that different approaches can be measured on the same terms,
including on recording sessions held out of the pretraining split.
