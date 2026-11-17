---
title: "Ephys Autism"
card_image:
  src: "images/ephys-autism-card.png"
  alt: "The same head-fixed mouse drawn four times in four colours and labelled Wildtype, Fmr1, Cntnap2 and Shank3: the control group and the three genetic models the recordings compare."
description: "Neuropixels electrophysiology data from autism model mice performing IBL's standardized decision-making task."
lead: "Neuropixels recordings and complete training histories from three genetic mouse models of autism and wild-type controls, all performing one standardized decision-making task."
weight: 6

stats:
  - value: "364"
    label: "Probe insertions"
  - value: "62"
    label: "Subjects"
  - value: "4"
    label: "Genotypes"
  - value: "129,313"
    label: "Units"

about:
  - heading: "The project"
    description: "Many different genes are linked to autism. Do they lead to shared changes in how the brain processes information, or does each work differently? To study this, the Angelaki lab trained three genetic mouse models of autism and wild-type controls on the standardized IBL task, recording their behavior throughout learning and their neural activity with Neuropixels."
    paper_title: "A common computational and neural anomaly across mouse models of autism"
    paper_link: "https://doi.org/10.1038/s41593-025-01965-8"
  - heading: "The experiment"
    task: "ibl"
    description: "Spiking activity was recorded with Neuropixels probes in wild-type mice and three autism models: Fmr1 (B6.129P2-Fmr1tm1Cgr/J; JAX 003025), Cntnap2 (B6.129(Cg)-Cntnap2tm2Pele/J; JAX 028635) and Shank3B (B6.129-Shank3tm2Gfng/J; JAX 017688). Three cameras filmed the mouse throughout each session, two capturing the face and one the body."
  - heading: "What's in the dataset"
    contents:
      - name: "neuropixels"
        items:
          - name: "Spike-sorted activity"
            description: "Spike times and depths, cluster assignments, mean waveforms and per-unit quality metrics."
          - name: "Raw electrophysiology"
            description: "The AP and LFP bands as recorded by SpikeGLX, with the synchronization channels alongside them."
          - name: "Channel locations"
            description: "Electrode sites placed in the Allen atlas, giving every channel and every cluster its brain region."
      - name: "behavior"
        items:
          - name: "Trial events"
            description: "Which side the grating appeared on and at what contrast, the mouse's choice, its response time and the feedback it received."
          - name: "Wheel"
            description: "Wheel position and timestamps, plus the intervals and peak amplitudes of the movements detected in them."
          - name: "Training history"
            description: "Every session each animal ran, from habituation through training to the biased task, with the protocol each one used."
      - name: "video"
        items:
          - name: "Raw video"
            description: "Recordings from three cameras, two filming the face and one the body, from which all other video measures were computed."
          - name: "Pose estimation"
            description: "Paws, nose, tongue, pupil and tail tracked across the cameras by DeepLabCut."
          - name: "Precomputed measures"
            description: "Pupil diameter from the face cameras, lick times and motion energy within defined regions of the frame, all computed from the video and released ready to use."

modality:
  - "neuropixels"
  - "behavior"
  - "video"

citation_intro: |
  Cite the data release itself as well when you reach the data through ONE.
citations:
  - kind: "Paper"
    reference: |
      Noel, J.-P., Balzani, E., Acerbi, L., et al. (2025) 'A common
      computational and neural anomaly across mouse models of autism', *Nature
      Neuroscience*, 28(7), pp. 1519-1532.
    entry: |
      @article{noelautism2025,
        title   = {A common computational and neural anomaly across mouse models of autism},
        journal = {Nature Neuroscience},
        volume  = {28},
        number  = {7},
        pages   = {1519--1532},
        year    = {2025},
        doi     = {10.1038/s41593-025-01965-8},
        url     = {https://doi.org/10.1038/s41593-025-01965-8},
      }
  - kind: "Data release"
    reference: |
      International Brain Laboratory and Noel, J.-P. (2025) *Data release -
      J-P. Noel, Autism*. figshare.
      [https://doi.org/10.6084/m9.figshare.30024880](https://doi.org/10.6084/m9.figshare.30024880).

access:
  - "one"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/2025_data_release_autism_noel.html"
---
