---
title: "Behavior"
description: "Behavioral data from mice learning and performing IBL's standardized visual decision-making task."
lead: "The full training history of 198 mice on one standardized decision-making task, pooled across the lab network to test whether mouse behavior reproduces between laboratories."
weight: 3

stats:
  - value: "198"
    label: "Subjects"
  - value: "9"
    label: "Laboratories"
  - value: "7"
    label: "Institutions"
  - value: "5M"
    label: "Decisions recorded"

about:
  - heading: "The project"
    description: "A result only travels between laboratories if the measurement behind it does. IBL standardized a decision-making task for head-fixed mice - the training protocol, the hardware, the software and the procedures - and ran it across the lab network to find out how far mouse behavior reproduces. Learning speed varied from mouse to mouse and from lab to lab, but once training was complete the behavior did not differ significantly between laboratories: mice everywhere relied on visual evidence, on past successes and failures, and on the prior probability of the stimulus in the same way."
    paper_title: "Standardized and reproducible measurement of decision-making in mice"
    paper_link: "https://doi.org/10.7554/eLife.63711"
  - heading: "The experiment"
    description: "Every session runs the IBL task, a standardized decision-making task. A head-fixed mouse turns a wheel to report which side a visual stimulus appeared on, at varying contrast, and is rewarded for correct choices. Once a mouse is trained, the stimulus stops appearing on each side equally often and comes in blocks that favor one side, so the mouse can combine what it sees with what it has learned to expect."
    figure:
      tone: "light"
      src: "images/ibl-task-schematic.jpg"
      alt: "Two panels of the decision-making task. In each, a head-fixed mouse faces a screen showing a striped stimulus and turns a wheel to move it: turning it to the correct side earns a drop of water, turning it to the wrong side ends the trial without reward."
      caption: "The IBL task. Figure 1b from International Brain Laboratory et al. (2021), eLife 10:e63711, CC BY 4.0."
  - heading: "What's in the dataset"
    description: "Trial-by-trial behavior for every session a mouse ran, from its first day on the task through to expert performance. Each trial is one decision - which side the mouse reported the stimulus on - and the 140 mice reported in the 2021 paper alone account for five million of them. The release covers 198 mice, up to 23 March 2020."
    contents:
      - name: "Stimulus"
        items:
          - name: "Contrast and side"
            description: "Which side the grating appeared on and at what contrast, recorded as a separate left and right value per trial."
          - name: "Block prior"
            description: "The probability the stimulus would favor the left, which starts moving in blocks once a mouse has learned the task."
          - name: "Stimulus and go-cue times"
            description: "When the grating appeared and when the go cue sounded, to align anything else to the trial."
      - name: "Response"
        items:
          - name: "Choice"
            description: "Which side the mouse reported, trial by trial, including the trials it left unanswered."
          - name: "Response time"
            description: "When the mouse answered, so the time it took from the go cue can be measured."
          - name: "Feedback"
            description: "Whether a trial was rewarded or not, and the moment the feedback arrived."
      - name: "Session"
        items:
          - name: "Trial intervals"
            description: "The start and end of every trial, so a session splits into trials without re-deriving them."
          - name: "Lab, subject and date"
            description: "Which laboratory ran each session, on which mouse and on which day."
          - name: "Task protocol"
            description: "The protocol a session ran, which marks how far through training the mouse had reached."
  - heading: "Built on this data"
    description: "Ashwood and colleagues fitted a hidden Markov model to these training histories and found that mice do not hold one strategy throughout: they alternate between an engaged state and several biased ones, each lasting tens to hundreds of trials."
    paper_title: "Mice alternate between discrete strategies during perceptual decision-making"
    paper_link: "https://doi.org/10.1038/s41593-021-01007-z"

modality:
  - "behavior"
stage:
  - "analyse"

citation_title: "How to cite"
citation_intro: |
  If you use the Behavior dataset in your research, please cite the paper. The
  data is also listed in the AWS Open Data Registry as *IBL Behavioral Data on
  AWS*, managed by the International Brain Laboratory under CC BY 4.0; cite the
  registry entry as well if you reach the data that way.
citations:
  - kind: "Paper"
    reference: |
      International Brain Laboratory, Aguillon-Rodriguez, V., Angelaki, D., et
      al. (2021) 'Standardized and reproducible measurement of decision-making
      in mice', *eLife*, 10, e63711.
    entry: |
      @article{iblbehavior2021,
        title   = {Standardized and reproducible measurement of decision-making in mice},
        journal = {eLife},
        volume  = {10},
        pages   = {e63711},
        year    = {2021},
        doi     = {10.7554/eLife.63711},
        url     = {https://doi.org/10.7554/eLife.63711},
      }
  - kind: "AWS Open Data Registry"
    reference: |
      IBL Behavioral Data on AWS was accessed on DATE from
      [https://registry.opendata.aws/ibl-behavior](https://registry.opendata.aws/ibl-behavior/).

access:
  - "one"
  - "dandi"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/2021_data_release_behavior.html"
---
