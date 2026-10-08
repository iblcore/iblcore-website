---
title: "Reproducible Ephys"
description: "A multi-lab Neuropixels dataset testing the reproducibility of electrophysiology recordings."
lead: "Twelve laboratories aimed Neuropixels probes at the same spot in the mouse brain, to find out how far electrophysiology results travel between labs."
weight: 2

stats:
  - value: "91"
    label: "Recording sessions"
  - value: "12"
    label: "Laboratories"
  - value: "1"
    label: "Repeated site"
  - value: "3"
    label: "Brain regions"

about:
  - heading: "The project"
    description: "Two labs recording from the same brain area often reach different conclusions, and until this study nobody had measured how far apart they land. Twelve laboratories ran one shared task on one shared apparatus and repeatedly targeted the same location, so the spread between them could be quantified rather than assumed."
    paper_title: "Reproducibility of in vivo electrophysiological measurements in mice"
    paper_link: "https://doi.org/10.7554/eLife.100840"
  - heading: "The task"
    description: "Recordings were made while mice performed the same standardised decision-making task used across IBL: a head-fixed mouse turns a wheel to report which side a visual stimulus appeared on, and is rewarded for correct choices. Holding the task fixed is what leaves probe placement and analysis as the variables under test."
    figure:
      tone: "light"
      src: "images/ibl-task-schematic.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The standardised task, shared with every IBL dataset. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Processed and raw data from 91 recording sessions at the repeated site, which spans posterior parietal cortex, hippocampus and thalamus, arranged in the standard IBL collections. Metadata for a further 19 sessions is included for the histology targeting analysis; those recordings did not pass quality control, so their data is not released."

explore:
  heading: "Explore it in your browser"
  description: "The repeated-site recordings are in the IBL Data Explorer alongside the Brainwide Map. Switch the session selector to Repeated sites to narrow it to this dataset."
  highlights:
    - "Compare the same target location across twelve laboratories"
    - "Open any session to see where its probe actually landed"
    - "Step through a probe's units and their activity"
  link: "https://viz.internationalbrainlab.org"
  link_text: "Open the IBL data explorer"

citation_title: "How to cite"
citation_intro: |
  If you use Reproducible Ephys in your research, please cite the paper.
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

modality:
  - "neuropixels"
  - "behavior"
stage:
  - "analyse"

access:
  - "one"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/2024_data_release_repro_ephys.html"
---
