---
title: "Ephys Autism"
description: "Neuropixels electrophysiology data from autism model mice performing IBL's standardized decision-making task."
lead: "Neuropixels recordings and complete training histories from three genetic mouse models of autism and their wildtype controls, all running one standardized decision-making task."
weight: 6

stats:
  - value: "364"
    label: "Probe insertions"
  - value: "62"
    label: "Recorded subjects"
  - value: "4"
    label: "Genotypes"
  - value: "129,313"
    label: "Units"

about:
  - heading: "The project"
    description: "Autism has many genetic causes, and whether they converge on anything shared at the level of computation or circuit activity is not obvious from the genetics alone. This study ran three different genetic models alongside wildtype controls on one standardized decision-making task, recorded from each with Neuropixels, and looked for an anomaly common to all three rather than particular to any one. The recordings were made in the Angelaki lab."
    paper_title: "A common computational and neural anomaly across mouse models of autism"
    paper_link: "https://doi.org/10.1038/s41593-025-01965-8"
  - heading: "The experiment"
    description: "Recordings were made while mice performed the IBL task, a standardized decision-making task. A head-fixed mouse turns a wheel to report which side a visual grating appeared on, at varying contrast, and is rewarded for correct choices. Four groups ran it: wildtype animals, and three autism models - B6.129P2-Fmr1tm1Cgr/J (JAX 003025), B6.129(Cg)-Cntnap2tm2Pele/J (JAX 028635) and B6.129-Shank3tm2Gfng/J (JAX 017688). Because every group ran the same task, their behavior and their recordings compare directly."
    figure:
      tone: "light"
      src: "images/ibl-task-schematic.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The IBL task. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Recordings from 364 probe insertions, with the behavior that produced them and the full training history of every animal: 4,388 sessions in all, from habituation through training to the biased task. The release page lists how the subjects and recordings divide between the four groups."
    contents:
      - name: "Neural"
        items:
          - name: "Spike-sorted activity"
            description: "Spike times and depths, cluster assignments, mean waveforms and per-unit quality metrics across 193 recording sessions."
          - name: "Raw electrophysiology"
            description: "The AP and LFP bands as recorded by SpikeGLX, with the synchronization channels alongside them."
          - name: "Channel locations"
            description: "Electrode sites placed in the Allen atlas, giving every channel and every cluster its brain region."
      - name: "Behavior"
        items:
          - name: "Trials"
            description: "Which side the grating appeared on and at what contrast, the mouse's choice, its response time and the feedback it received, across 4,384 sessions."
          - name: "Wheel"
            description: "Wheel position and timestamps, plus the intervals and peak amplitudes of the movements detected in them."
          - name: "Training history"
            description: "Every session each animal ran, from habituation through training to the biased task, with the protocol each one used."
      - name: "Video"
        items:
          - name: "Pose estimation"
            description: "DeepLabCut tracking of the left, right and body cameras in 165 sessions, with pupil features from the two side cameras."
          - name: "Licks and motion energy"
            description: "Movement within defined regions of the frame in 149 sessions, and lick times in 82."
          - name: "Raw video"
            description: "The camera recordings the tracking was computed from, for 169 sessions."

modality:
  - "neuropixels"
  - "behavior"
  - "video"
stage:
  - "analyse"

citation_title: "How to cite"
citation_intro: |
  If you use the Ephys Autism dataset in your research, please cite the paper,
  and cite the data release itself as well when you reach the data through ONE.
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
