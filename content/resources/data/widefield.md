---
title: "Widefield"
description: "Widefield calcium imaging of dorsal cortex from mice performing IBL's standardized decision-making task."
lead: "Cortex-wide calcium imaging recorded while mice used prior expectations to guide their decisions, released alongside IBL's prior paper."
weight: 5

stats:
  - value: "50"
    label: "Imaging sessions"
  - value: "6"
    label: "Subjects"
  - value: "32"
    label: "Cortical regions"
  - value: "1"
    label: "Laboratory"

about:
  - heading: "The project"
    description: "IBL's prior paper asked where in the brain an animal's expectation of where the stimulus will appear is represented. It drew on two recording modalities: Neuropixels electrophysiology, which samples a few sites per session at single-spike resolution, and this cortex-wide calcium imaging, which captures 32 cortical regions at once. The expectation turned out to be encoded across a wide span of the brain, from early sensory areas upwards, and the behavioral and decoding results agreed across both modalities. The widefield recordings were made in the Zador lab at Cold Spring Harbor."
    paper_title: "Brain-wide representations of prior information in mouse decision-making"
    paper_link: "https://doi.org/10.1038/s41586-025-09226-1"
  - heading: "The experiment"
    description: "Recordings were made while mice performed the IBL task, a standardized decision-making task. A head-fixed mouse turns a wheel to report which side a visual grating appeared on, at varying contrast, and is rewarded for correct choices. In these sessions the grating did not appear on each side equally often: it came in blocks favoring one side, so a mouse could combine what it saw with what it had learned to expect, and that expectation is what the paper set out to find in the brain. The mice were a Camk2a-tTA (JAX 007004) by tetO-GCaMP6s (JAX 024742) cross, which expresses GCaMP6s in excitatory forebrain neurons, imaged across the dorsal cortex."
    figure:
      tone: "light"
      src: "images/ibl-task-schematic.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The IBL task. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Cortex-wide imaging for 50 sessions from 6 mice, with the behavior recorded alongside it. The imaging arrives as the spatial and temporal components of an SVD, which the wfield package rebuilds into the full frame stack, together with the landmarks that register it to the Allen dorsal cortex."
    contents:
      - name: "Imaging"
        items:
          - name: "Spatial and temporal components"
            description: "The SVD of the frame stack: spatial components, with the hemodynamically corrected temporal components and the uncorrected ones beside them."
          - name: "Frame times and light source"
            description: "A timestamp for every frame on the session clock, with the illumination it was taken under and that light source's properties."
          - name: "Cortical landmarks"
            description: "Bregma and lambda located in the imaging window, to warp the stack onto the Allen dorsal cortex."
      - name: "Behavior"
        items:
          - name: "Trials"
            description: "Which side the grating appeared on and at what contrast, the mouse's choice, its response time and the feedback it received."
          - name: "Wheel"
            description: "Wheel position and timestamps, plus the intervals and peak amplitudes of the movements detected in them."
          - name: "Session clock"
            description: "The synchronization pulses that place the imaging frames, the video and the behavior on one clock."
      - name: "Video"
        items:
          - name: "Pose estimation"
            description: "DeepLabCut tracking of the body and left cameras, in 32 sessions."
          - name: "Licks and motion energy"
            description: "Movement within defined regions of the frame in 32 sessions, and lick times in 15."
          - name: "Raw video"
            description: "Body camera recordings for 48 sessions and left camera recordings for 47."

modality:
  - "widefield"
  - "behavior"
  - "video"
stage:
  - "analyse"

citation_title: "How to cite"
citation_intro: |
  If you use the widefield data in your research, please cite the paper it was
  released with.
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
