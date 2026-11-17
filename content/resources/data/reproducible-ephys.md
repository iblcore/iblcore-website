---
title: "Reproducible Ephys"
description: "A multi-lab Neuropixels dataset testing the reproducibility of electrophysiology recordings."
lead: "Neuropixels recordings from the same brain location, repeated across laboratories while mice make decisions, to test how well electrophysiology results reproduce between labs."
weight: 2

stats:
  - value: "88"
    label: "Sessions"
  - value: "12"
    label: "Laboratories"
  - value: "3"
    label: "Brain regions"
  - value: "138,545"
    label: "Units"

about:
  - heading: "The project"
    description: "If two labs record from the same brain region in the same task, how similar will their results be? To find out, 12 laboratories used identical rigs and protocols to record from mice performing the standardized IBL task, each inserting Neuropixels probes along the same path through cortex, hippocampus and thalamus. With the same experiment repeated across labs, differences between them could be measured directly."
    paper_title: "Reproducibility of in vivo electrophysiological measurements in mice"
    paper_link: "https://doi.org/10.7554/eLife.100840"
  - heading: "The experiment"
    task: "ibl"
    description: "Spiking activity was recorded with Neuropixels probes inserted along a single repeated trajectory, with each laboratory targeting the same brain regions. Three cameras filmed the mouse throughout each session, two capturing the face and one the body."
  - heading: "What's in the dataset"
    contents:
      - name: "neuropixels"
        items:
          - name: "Spike-sorted activity"
            description: "Spike times and depths, cluster assignments, per-unit quality metrics and mean waveforms for every insertion."
          - name: "Raw electrophysiology"
            description: "The AP and LFP bands as recorded by SpikeGLX, with the synchronization channels alongside them."
          - name: "Channel and unit locations"
            description: "Every channel and every cluster placed in the Allen atlas by histology, so the repeated site can be compared lab by lab."
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

citations:
  - kind: "Paper"
    reference: |
      International Brain Laboratory, Banga, K., Benson, J., et al. (2025)
      'Reproducibility of in vivo electrophysiological measurements in mice',
      *eLife*, 13, RP100840.
    entry: |
      @article{iblreproephys2025,
        title   = {Reproducibility of in vivo electrophysiological measurements in mice},
        journal = {eLife},
        volume  = {13},
        pages   = {RP100840},
        year    = {2025},
        doi     = {10.7554/eLife.100840},
        url     = {https://doi.org/10.7554/eLife.100840},
      }

card_image:
  src: "images/reproducible-ephys-card.png"
  alt: "A translucent mouse brain with the repeated-site target regions picked out in teal, green and pink, crossed by a dense bundle of probe tracks."

modality:
  - "neuropixels"
  - "behavior"
  - "video"

access:
  - "explorer"
  - "one"

access_guides:
  explorer: "https://viz.internationalbrainlab.org"
  one: "https://docs.internationalbrainlab.org/notebooks_external/2024_data_release_repro_ephys.html"
---
