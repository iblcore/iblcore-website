---
title: "Behavior"
card_image:
  src: "images/behavior-card.jpg"
  alt: "A head-fixed mouse facing a screen that shows a striped grating, turning a wheel to move the grating towards the centre, with a drop of water beside it for a correct choice."
description: "Behavioral data from mice learning and performing IBL's standardized visual decision-making task."
lead: "The full training history of 170 mice learning one standardized decision-making task, recorded across 9 laboratories."
weight: 3

stats:
  - value: "170"
    label: "Subjects"
  - value: "6,488"
    label: "Sessions"
  - value: "9"
    label: "Laboratories"
  - value: "4.2M"
    label: "Trials"

about:
  - heading: "The project"
    description: "Can a behavioral experiment give the same results in different laboratories? To find out, IBL standardized every part of a decision-making task for head-fixed mice, including the training protocol, hardware, software and procedures, and ran it in 9 labs. Every session was recorded from each mouse's first day of training, so the dataset captures not only expert performance but how each mouse learned."
    paper_title: "Standardized and reproducible measurement of decision-making in mice"
    paper_link: "https://doi.org/10.7554/eLife.63711"
  - heading: "The experiment"
    task: "ibl"
    description: "Behavior was recorded through the mouse's wheel movements, choices, response times and rewards. Each mouse was followed through every stage of training, from early sessions with high-contrast stimuli, through the full range of contrasts, to the biased blocks."
  - heading: "What's in the dataset"
    contents:
      - name: "behavior"
        items:
          - name: "Contrast and side"
            description: "Which side the grating appeared on and at what contrast, recorded as a separate left and right value per trial."
          - name: "Block prior"
            description: "The probability the stimulus would favor the left, which starts moving in blocks once a mouse has learned the task."
          - name: "Stimulus and go-cue times"
            description: "When the grating appeared and when the go cue sounded, to align anything else to the trial."
          - name: "Choice"
            description: "Which side the mouse reported, trial by trial, including the trials it left unanswered."
          - name: "Response time"
            description: "When the mouse answered, so the time it took from the go cue can be measured."
          - name: "Feedback"
            description: "Whether a trial was rewarded or not, and the moment the feedback arrived."
          - name: "Trial intervals"
            description: "The start and end of every trial, so a session splits into trials without re-deriving them."
          - name: "Lab, subject and date"
            description: "Which laboratory ran each session, on which mouse and on which day."
          - name: "Task protocol"
            description: "The protocol a session ran, which marks how far through training the mouse had reached."

modality:
  - "behavior"

citation_intro: |
  The data is also listed in the AWS Open Data Registry as *IBL Behavioral Data
  on AWS*, managed by the International Brain Laboratory under CC BY 4.0; cite
  the registry entry as well if you reach the data that way.
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
  - kind: "Registry entry"
    reference: |
      IBL Behavioral Data on AWS was accessed on DATE from
      [https://registry.opendata.aws/ibl-behavior](https://registry.opendata.aws/ibl-behavior/).

access:
  - "one"
  - "dandi"

access_guides:
  one: "https://docs.internationalbrainlab.org/notebooks_external/2021_data_release_behavior.html"
  dandi: "https://dandiarchive.org/dandiset/000045"
---
