---
title: "Aging"
description: "Neuropixels and behavioral data from mice aged 3 to 20 months performing IBL's standardized decision-making task."
lead: "Neural activity and behavior recorded across the mouse lifespan, from three to twenty months old, to measure how both change with age."
weight: 4

stats:
  - value: "503"
    label: "Probe insertions"
  - value: "149"
    label: "Subjects"
  - value: "16"
    label: "Brain regions"
  - value: "3-20"
    label: "Months of age"

about:
  - heading: "The project"
    description: "This study asked how behavioral and neural variability change as a mouse ages. Mice from 3 to 20 months old were recorded on one standardized task, with age treated as a continuous variable rather than sorting animals into young and old groups. Lifespan recordings from the Churchland lab are combined with brain-wide map sessions in the same age range: 149 mice, 367 sessions and 503 probe insertions across 16 regions of cortex, hippocampus, thalamus, midbrain, basal ganglia and olfactory areas."
    paper_title: "Age-related changes in behavioural and neural variability in a decision-making task"
    paper_link: "https://doi.org/10.1038/s41467-026-74227-1"
  - heading: "The experiment"
    description: "Recordings were made while C57BL/6 mice performed the IBL task, a standardized decision-making task. A head-fixed mouse turns a wheel to report which side a visual stimulus appeared on, at varying contrast, and is rewarded for correct choices. Every session in the release ran the same electrophysiology protocol, so recordings from mice of different ages compare directly."
    figure:
      tone: "light"
      src: "images/ibl-task-schematic.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The IBL task. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Two components sit under one release tag: new lifespan recordings from older mice, and the brain-wide map sessions that fall in the same age range. The release carries 497 sessions. Spike-sorted activity is released here for the lifespan recordings; for the brain-wide map component it comes through that dataset's own release."
    contents:
      - name: "Neural"
        items:
          - name: "Spike-sorted activity"
            description: "Spike times, clusters, mean waveforms and per-unit quality metrics for the 38 lifespan sessions."
          - name: "Raw electrophysiology"
            description: "The AP and LFP bands as recorded by SpikeGLX, with the synchronization channels, for all 497 sessions."
          - name: "Channel locations"
            description: "Electrode sites placed in the Allen atlas for 495 sessions, giving every channel its brain region."
      - name: "Behavior"
        items:
          - name: "Trials"
            description: "Which side the stimulus appeared on and at what contrast, the mouse's choice, its response time and the feedback it received."
          - name: "Wheel"
            description: "Wheel position and timestamps, plus the intervals and peak amplitudes of the movements detected in them."
          - name: "Session metadata"
            description: "Lab, subject and date for each session, and which of the two component projects it belongs to."
      - name: "Video"
        items:
          - name: "Pose estimation"
            description: "Body-part tracking from three cameras with Lightning Pose in 445 sessions, alongside DeepLabCut output in 480."
            link: "/resources/tools/lightning-pose/"
            link_text: "About Lightning Pose"
          - name: "Licks and motion energy"
            description: "Lick times and movement within defined regions of the frame, extracted from the same video."
          - name: "Raw video"
            description: "The left, right and body camera recordings the tracking was computed from, for 483 sessions."

modality:
  - "neuropixels"
  - "behavior"
  - "video"
stage:
  - "analyse"

citation_title: "How to cite"
citation_intro: |
  If you use the Aging dataset in your research, please cite the paper. The
  analysis code and intermediate results are archived separately on Zenodo. If
  you use the brain-wide map component, follow the citation guidance on the
  [Brainwide Map](/resources/data/brainwide-map/) page as well.
citations:
  - kind: "Paper"
    reference: |
      Zang, F., Khanal, A., Forster, S., et al. (2026) 'Age-related changes in
      behavioural and neural variability in a decision-making task', *Nature
      Communications*, 17, 8156.
    entry: |
      @article{zangaging2026,
        title   = {Age-related changes in behavioural and neural variability in a decision-making task},
        journal = {Nature Communications},
        volume  = {17},
        pages   = {8156},
        year    = {2026},
        doi     = {10.1038/s41467-026-74227-1},
        url     = {https://doi.org/10.1038/s41467-026-74227-1},
      }
  - kind: "Analysis code"
    reference: |
      Zang, F. and Rai, P. (2026) *Age-related changes in behavioral and neural
      variability in a decision-making task*. Zenodo.
      [https://doi.org/10.5281/zenodo.20102008](https://doi.org/10.5281/zenodo.20102008).

access:
  - "one"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/2025_data_release_aging_zang.html"
---
