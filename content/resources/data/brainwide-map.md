---
title: "Brainwide Map"
description: "IBL's flagship dataset: 699 Neuropixels insertions across 241 brain areas during decision-making."
lead: "A whole-brain map of neural activity recorded while mice make decisions, pooled across twelve laboratories running one standardised task."
weight: 1

stats:
  - value: "699"
    label: "Probe insertions"
  - value: "241"
    label: "Brain regions"
  - value: "139"
    label: "Subjects"
  - value: "12"
    label: "Laboratories"

about:
  - heading: "The project"
    description: "IBL set out to understand how the mouse brain makes decisions by pooling electrophysiology across a lab network rather than collecting it in one place. Twelve laboratories sampled a shared grid of targets, with every recording site repeated in at least two labs."
    link: "/projects/#ibl-research-projects"
    link_label: "Project"
    link_text: "IBL research projects"
    paper_title: "A Brain-Wide Map of Neural Activity during Complex Behaviour"
    paper_link: "https://www.nature.com/articles/s41586-025-09235-0"
    figure:
      tone: "dark"
      video: "images/brainwide-map-insertions.mp4"
      poster: "images/brainwide-map-insertions.jpg"
      alt: "A translucent three-dimensional mouse brain, its regions shaded by colour, crossed by the tracks of hundreds of probe insertions."
      caption: "Probe insertions from across the lab network, shown in a common anatomical reference frame."
  - heading: "The task"
    description: "Every recording was made during the same decision-making task. A head-fixed mouse turns a wheel to report which side a visual stimulus appeared on, at varying contrast, and is rewarded for correct choices. Because the task is identical everywhere, recordings from different labs compare directly."
    paper_title: "Standardized and reproducible measurement of decision-making in mice"
    paper_link: "https://elifesciences.org/articles/63711"
    figure:
      tone: "light"
      src: "images/brainwide-map-task.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The standardised task. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Neuropixels recordings at single-spike resolution across 241 brain regions, paired trial by trial with the behaviour that produced them: the stimuli shown, the mouse's choices and response times, and pose data extracted from video with DeepLabCut."

explore:
  heading: "Explore it in your browser"
  description: "No install, no download, no account. The BWM data explorer opens the whole dataset - 699 insertions, every session - for anyone to look through."
  highlights:
    - "Watch a short video explaining the task"
    - "Search by lab, subject or brain region, or pick an insertion from the 3D brain"
    - "Open any probe to see its units and their activity"
  link: "https://viz.internationalbrainlab.org"
  link_text: "Open the BWM data explorer"
  figure:
    tone: "light"
    src: "images/brainwide-map-explorer.jpg"
    alt: "The Data Explorer's session selector: a three-dimensional mouse brain holding every probe insertion, with one picked out and a table beside it listing that probe's lab, unit count, spike count and trial count."
    caption: "Every insertion in one view; select one to see that probe's recordings."

modality:
  - "neuropixels"
  - "behavior"
  - "video"
stage:
  - "analyse"

access:
  - "one"
  - "dandi"
  - "ibl-ai-agent"

access_guides:
  one: "https://int-brain-lab.github.io/iblenv/notebooks_external/data_release_brainwidemap.html"
---
