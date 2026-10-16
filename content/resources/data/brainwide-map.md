---
title: "Brainwide Map"
description: "IBL's flagship dataset: 699 Neuropixels insertions across 241 brain areas during decision-making."
lead: "A whole-brain map of neural activity recorded while mice make decisions, pooled across twelve laboratories running one standardized task."
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
    paper_title: "A brain-wide map of neural activity during complex behaviour"
    paper_link: "https://www.nature.com/articles/s41586-025-09235-0"
    figure:
      tone: "dark"
      video: "images/brainwide-map-insertions.mp4"
      poster: "images/brainwide-map-insertions.jpg"
      alt: "A translucent three-dimensional mouse brain, its regions shaded by color, crossed by the tracks of hundreds of probe insertions."
      caption: "Probe insertions from across the lab network, shown in a common anatomical reference frame."
  - heading: "The experiment"
    description: "Every recording was made during the IBL task, a standardized decision-making task. A head-fixed mouse turns a wheel to report which side a visual stimulus appeared on, at varying contrast, and is rewarded for correct choices. Because every laboratory ran it identically, recordings from different labs compare directly."
    paper_title: "Standardized and reproducible measurement of decision-making in mice"
    paper_link: "https://elifesciences.org/articles/63711"
    figure:
      tone: "light"
      src: "images/ibl-task-schematic.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The IBL task. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Neural activity at single-spike resolution, paired trial by trial with the behavior that produced it and with video of the mouse tracked by Lightning Pose. Processed data is ready to analyze; the raw recordings behind it are released too."
    contents:
      - name: "Neural"
        items:
          - name: "Spike-sorted activity"
            description: "621,733 units across 241 brain regions."
          - name: "Raw electrophysiology"
            description: "The AP band at 30 kHz and the LFP band, for most of the 699 insertions."
          - name: "Channel locations"
            description: "Every recording channel placed in the Allen Mouse Brain Atlas by histology."
      - name: "Behavior"
        items:
          - name: "Trials"
            description: "Which side the stimulus appeared on and at what contrast, the mouse's choice, its response time and the feedback it received."
          - name: "Wheel"
            description: "Continuous wheel position throughout the session, plus the movements detected in it."
          - name: "Passive protocol"
            description: "Task stimuli replayed without reward, receptive-field mapping and spontaneous intervals, where a session recorded them."
      - name: "Video"
        items:
          - name: "Pose estimation"
            description: "Three-camera body-part tracking from IBL's Lightning Pose pipeline. The earlier DeepLabCut output is released alongside it."
            link: "/resources/tools/lightning-pose/"
            link_text: "About Lightning Pose"
          - name: "Licks and motion energy"
            description: "Lick times and movement within defined regions of the frame, extracted from the same video."
          - name: "Raw video"
            description: "The left, right and body camera recordings the tracking was computed from."

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

citation_title: "How to cite"
citation_intro: |
  If you use the Brainwide Map in your research, please cite the paper. The
  dataset is also listed in the AWS Open Data Registry as *IBL Neuropixels
  Brainwide Map on AWS*, managed by the International Brain Laboratory under
  CC BY 4.0; cite the registry entry as well if you reach the data that way.
citations:
  - kind: "Paper"
    reference: |
      International Brain Laboratory, Benson, B., Benson, J., et al. (2025) 'A
      brain-wide map of neural activity during complex behaviour', *Nature*,
      645(8079), pp. 177-191.
    entry: |
      @article{iblbwm2025,
        title   = {A brain-wide map of neural activity during complex behaviour},
        journal = {Nature},
        volume  = {645},
        number  = {8079},
        pages   = {177--191},
        year    = {2025},
        url     = {https://www.nature.com/articles/s41586-025-09235-0},
      }
  - kind: "AWS Open Data Registry"
    reference: |
      IBL Neuropixels Brainwide Map on AWS was accessed on DATE from
      [https://registry.opendata.aws/ibl-brain-wide-map](https://registry.opendata.aws/ibl-brain-wide-map/).

access:
  - "one"
  - "dandi"
  - "ibl-ai-agent"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/data_release_brainwidemap.html"
---
