---
title: "Aging"
card_image:
  src: "images/aging-card.png"
  alt: "The same head-fixed mouse drawn five times in a row, its coat fading from dark slate to pale along the line, above a scale marked from three months to twenty months."
description: "Neuropixels and behavioral data from mice aged 3 to 20 months performing IBL's standardized decision-making task."
lead: "Neuropixels recordings and behavior from mice aged three to twenty months, recorded while they make decisions, to measure how the brain and behavior change with age."
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
    description: "This study asked how behavioral and neural variability change as a mouse ages. Mice from 3 to 20 months old were recorded on one standardized task. Lifespan recordings from the Churchland lab are combined with brain-wide map sessions in the same age range, giving 149 mice, 367 sessions and 503 probe insertions across 16 regions spanning cortex, hippocampus, thalamus, midbrain, basal ganglia and olfactory areas."
    paper_title: "Age-related changes in behavioural and neural variability in a decision-making task"
    paper_link: "https://doi.org/10.1038/s41467-026-74227-1"
  - heading: "The experiment"
    task: "ibl"
    description: "Spiking activity was recorded with Neuropixels probes in C57BL/6 mice, using the same electrophysiology protocol across all sessions. Three cameras filmed the mouse throughout each session, two capturing the face and one the body."
  - heading: "What's in the dataset"
    contents:
      - name: "neuropixels"
        items:
          - name: "Spike-sorted activity"
            description: "Spike times, clusters, mean waveforms and per-unit quality metrics for the lifespan recordings."
          - name: "Raw electrophysiology"
            description: "The AP and LFP bands as recorded by SpikeGLX, with the synchronization channels."
          - name: "Channel locations"
            description: "Electrode sites placed in the Allen atlas, giving every channel its brain region."
      - name: "behavior"
        items:
          - name: "Trial events"
            description: "Which side the stimulus appeared on and at what contrast, the mouse's choice, its response time and the feedback it received."
          - name: "Wheel"
            description: "Wheel position and timestamps, plus the intervals and peak amplitudes of the movements detected in them."
      - name: "video"
        items:
          - name: "Raw video"
            description: "Recordings from three cameras, two filming the face and one the body, from which all other video measures were computed."
          - name: "Pose estimation"
            description: "Paws, nose, tongue, pupil and tail tracked across the cameras by Lightning Pose, with the earlier DeepLabCut output alongside."
          - name: "Precomputed measures"
            description: "Pupil diameter, lick times and motion energy within defined regions of the frame, all computed from the video and released ready to use."

modality:
  - "neuropixels"
  - "behavior"
  - "video"

citation_intro: |
  The analysis code and intermediate results are archived separately on Zenodo. If
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
  - kind: "Code"
    reference: |
      Zang, F. and Rai, P. (2026) *Age-related changes in behavioral and neural
      variability in a decision-making task*. Zenodo.
      [https://doi.org/10.5281/zenodo.20102008](https://doi.org/10.5281/zenodo.20102008).

access:
  - "one"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/2025_data_release_aging_zang.html"
---
