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
            description: "Spike times and depths, cluster assignments, mean waveforms and per-unit quality metrics, ready to analyze without touching the raw recordings."
          - name: "Raw electrophysiology"
            description: "The AP band at 30 kHz and the LFP band as recorded, for re-sorting the spikes or working with the continuous signal."
          - name: "Channel locations"
            description: "Every recording channel placed in the Allen Mouse Brain Atlas by histology, which is what gives each unit its brain region."
      - name: "behavior"
        items:
          - name: "Trial events"
            description: "Which side the stimulus appeared on and at what contrast, the mouse's choice, its response time and the feedback it received, trial by trial."
          - name: "Wheel"
            description: "Wheel position over time, plus detected movements with their start and end times and peak amplitudes."
      - name: "video"
        items:
          - name: "Raw video"
            description: "Recordings from three cameras, two filming the face and one the body, from which all other video measures were computed."
          - name: "Pose estimation"
            description: "Positions of the paws, nose, tongue and pupil from the face cameras, and the tail from the body camera, tracked with Lightning Pose, with the earlier DeepLabCut output alongside."
          - name: "Precomputed measures"
            description: "Pupil diameter, lick times and motion energy within defined regions of the frame, computed from the video and released ready to use."

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
