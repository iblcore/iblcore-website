---
title: "Brainwide Map"
description: "IBL's flagship dataset: 699 Neuropixels insertions across 241 brain areas during decision-making."
weight: 1

project:
  description: "IBL aims to understand the neural basis of decision-making in the mouse by building a whole-brain activity map from electrophysiological recordings pooled across laboratories. The Brainwide Map is a coordinated effort across 12 laboratories, using Neuropixels probes and a grid system for unbiased sampling, with each recording site replicated in at least two labs. The result: 699 probe insertions from 139 subjects, mapping activity at single-spike resolution across 241 brain regions during a decision-making task."
  project_link: "/projects/#ibl-research-projects"
  paper_title: "A Brain-Wide Map of Neural Activity during Complex Behaviour"
  paper_link: "https://www.nature.com/articles/s41586-025-09235-0"

task:
  description: "The dataset pairs Neuropixels recordings with behavioral data from a standardized decision-making task: on each trial, a head-fixed mouse uses a wheel to indicate the side of a visual stimulus of varying contrast and is rewarded for correct responses. Because every lab runs the same task, recordings from different sites can be directly compared. Alongside the neural recordings, the dataset includes the trial stimuli, the mouse's decisions and response times, and pose data from video and DeepLabCut analysis."
  diagram_placeholder: true
  paper_title: "Standardized and reproducible measurement of decision-making in mice"
  paper_link: "https://elifesciences.org/articles/63711"

explore:
  description: "Explore the Brainwide Map recordings interactively in the IBL Data Explorer, including probe locations across the brain and recorded neural activity."
  link: "https://viz.internationalbrainlab.org"
  link_text: "Open the IBL Data Explorer"

modality:
  - "neuropixels"
  - "behavior"
  - "video"
stage:
  - "explore"
  - "analyse"

access:
  - "one"
  - "dandi"
  - "ibl-ai-agent"

access_guides:
  one: "https://int-brain-lab.github.io/iblenv/notebooks_external/data_release_brainwidemap.html"
---
