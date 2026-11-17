---
title: "Brainwide Map"
description: "IBL's flagship dataset: 699 Neuropixels insertions across 241 brain areas during decision-making."
lead: "A brain-wide map of neural activity recorded while mice make decisions, collected by twelve laboratories running one standardized task."
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
    description: "The Brain-wide Map project aimed to study decision-making across the entire mouse brain. To achieve this, twelve laboratories followed shared protocols to record neural activity from 139 mice performing a single, standardized task. The resulting dataset covers 241 regions across 699 Neuropixels insertions and is openly available with standardized processing, ready for exploring how neural activity relates to perception, expectation, and action."
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
    task: "ibl"
    description: "Spiking activity was recorded with Neuropixels probes inserted at a grid of target locations, with each target sampled by multiple laboratories. Three cameras filmed the mouse's face and body throughout each session."
    paper_title: "Standardized and reproducible measurement of decision-making in mice"
    paper_link: "https://elifesciences.org/articles/63711"
  - heading: "What's in the dataset"
    contents:
      - name: "neuropixels"
        items:
          - name: "Spike-sorted activity"
            description: "621,733 units across 241 brain regions."
          - name: "Raw electrophysiology"
            description: "The AP band at 30 kHz and the LFP band."
          - name: "Channel locations"
            description: "Every recording channel placed in the Allen Mouse Brain Atlas by histology."
      - name: "behavior"
        items:
          - name: "Trial events"
            description: "Which side the stimulus appeared on and at what contrast, the mouse's choice, its response time and the feedback it received, trial by trial."
          - name: "Wheel"
            description: "Continuous wheel position throughout the session, plus the movements detected in it."
      - name: "video"
        items:
          - name: "Raw video"
            description: "Recordings from three cameras, two filming the face and one the body, from which all other video measures were computed."
          - name: "Pose estimation"
            description: "Paws, nose, tongue, pupil and tail tracked across the cameras by Lightning Pose, with the earlier DeepLabCut output alongside."
          - name: "Precomputed measures"
            description: "Pupil diameter, lick times and motion energy within defined regions of the frame, all computed from the video and released ready to use."

card_image:
  src: "images/brainwide-map-card.png"
  alt: "The same translucent mouse brain shown twice, from the side and from above, both shaded pale green and yellow by region and crossed by the tracks of every probe insertion in the dataset."

modality:
  - "neuropixels"
  - "behavior"
  - "video"

citation_intro: |
  The dataset is also listed in the AWS Open Data Registry as *IBL Neuropixels
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
  - kind: "Registry entry"
    reference: |
      IBL Neuropixels Brainwide Map on AWS was accessed on DATE from
      [https://registry.opendata.aws/ibl-brain-wide-map](https://registry.opendata.aws/ibl-brain-wide-map/).

access:
  - "explorer"
  - "one"
  - "dandi"
  - "ibl-ai-agent"

access_guides:
  explorer: "https://viz.internationalbrainlab.org"
  one: "https://docs.internationalbrainlab.org/notebooks_external/data_release_brainwidemap.html"
  dandi: "https://dandiarchive.org/dandiset/000409"
  ibl-ai-agent: "https://github.com/int-brain-lab/ibl-ai-agent/"
---
