---
title: "Widefield"
card_image:
  src: "images/widefield-card.png"
  alt: "A mouse brain seen from above, nose to the left, with the thirty-two cortical regions the widefield sessions image picked out in greens and teals against the pale grey of the rest of the surface."
description: "Widefield calcium imaging of dorsal cortex from mice performing IBL's standardized decision-making task."
lead: "Calcium imaging across the dorsal cortex, recorded while mice make decisions, with 32 regions captured at once in every session."
weight: 5

stats:
  - value: "50"
    label: "Sessions"
  - value: "6"
    label: "Subjects"
  - value: "32"
    label: "Cortical regions"
  - value: "41,376"
    label: "Trials"

about:
  - heading: "The project"
    description: "This project aimed to study how prior expectations are represented across the brain during decision-making. To achieve this, the Zador lab used widefield calcium imaging to record activity from mice performing the standardized IBL task, capturing 32 regions of the dorsal cortex at once in every session, alongside recordings from deeper brain areas made by other IBL labs."
    paper_title: "Brain-wide representations of prior information in mouse decision-making"
    paper_link: "https://doi.org/10.1038/s41586-025-09226-1"
  - heading: "The experiment"
    task: "ibl"
    description: "Widefield calcium imaging recorded activity across the dorsal cortex in mice expressing GCaMP6s in excitatory forebrain neurons (Camk2a-tTA x tetO-GCaMP6s; JAX 007004 and 024742). Two cameras filmed the mouse throughout each session, one capturing the face and one the body."
  - heading: "What's in the dataset"
    contents:
      - name: "widefield"
        items:
          - name: "Spatial and temporal components"
            description: "The imaging data, compressed into spatial maps and their time courses (via SVD). Time courses are provided both with and without hemodynamic correction."
          - name: "Frame times and light source"
            description: "A timestamp for every frame on the session clock, and which light source (blue or violet) each frame was taken under, used to separate neural signal from blood-flow artifacts."
          - name: "Cortical landmarks"
            description: "Bregma and lambda located in the imaging window, used to align each session to the Allen dorsal cortex map."
      - name: "behavior"
        items:
          - name: "Trial events"
            description: "Which side the grating appeared on and at what contrast, the mouse's choice, its response time and the feedback it received."
          - name: "Wheel"
            description: "Wheel position over time, plus detected movements with their start and end times and peak amplitudes."
      - name: "video"
        items:
          - name: "Raw video"
            description: "Recordings from two cameras, one filming the face and one the body, from which all other video measures were computed."
          - name: "Pose estimation"
            description: "Positions of the paws, nose, tongue and pupil from the face camera, and the tail from the body camera, tracked with DeepLabCut."
          - name: "Precomputed measures"
            description: "Lick times and motion energy within defined regions of the frame, computed from the video and released ready to use."

modality:
  - "widefield"
  - "behavior"
  - "video"

citations:
  - kind: "Paper"
    reference: |
      Findling, C., Hubert, F., International Brain Laboratory, et al. (2025)
      'Brain-wide representations of prior information in mouse
      decision-making', *Nature*, 645(8079), pp. 192-200.
    entry: |
      @article{findlingprior2025,
        title   = {Brain-wide representations of prior information in mouse decision-making},
        journal = {Nature},
        volume  = {645},
        number  = {8079},
        pages   = {192--200},
        year    = {2025},
        doi     = {10.1038/s41586-025-09226-1},
        url     = {https://doi.org/10.1038/s41586-025-09226-1},
      }

access:
  - "one"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/loading_widefield_data.html"
---
