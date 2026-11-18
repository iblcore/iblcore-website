---
title: "{{ replace .Name "-" " " | title }}"
description: "One sentence naming the recording modality, the animals and the task, for the card and for search."
lead: "One sentence a reader can stop at: what was recorded, by whom, and what question it was recorded to answer."
weight: 7

# Exactly four figures, each labelled from the vocabulary in
# docs/dataset-page-schema.md. No value of 1. A million or more is abbreviated
# to one decimal place: "4.2M".
stats:
  - value: ""
    label: "Subjects"
  - value: ""
    label: "Sessions"
  - value: ""
    label: "Laboratories"
  - value: ""
    label: "Trials"

# Exactly these three entries, under exactly these headings, in this order.
about:
  - heading: "The project"
    description: "Why the data was collected and what the study found."
    paper_title: ""
    paper_link: ""
  # Either name a paradigm in data/tasks.yaml and add the sentence that says
  # how this dataset deviates from it, or delete `task` and give this entry its
  # own description and figure.
  - heading: "The experiment"
    task: "ibl"
    description: "What was particular to these sessions: the animals, the protocol, the manipulation."
  - heading: "What's in the dataset"
    description: "What a reader gets when they download it, and what state it is in."
    # One group per modality below, same terms, same order. The group name is
    # the vocabulary term; the page spells it for display.
    contents:
      - name: "neuropixels"
        items:
          - name: ""
            description: ""

# The picture is processed to the card thumbnail at build time, so it lives
# under assets/, not static/. Supply it larger than the box and let Hugo
# resample it: 1150px wide or more.
card_image:
  src: "img/resources/.png"
  alt: "What the picture shows, for a reader who cannot see it."

modality:
  - "neuropixels"

# Routes are listed in data/access_routes.yaml order on the page whatever order
# they appear in here. A route with no destination yet still gets a row.
access:
  - "one"

access_guides:
  one: ""

# The first entry is always the Paper, and it always carries BibTeX in `entry`.
# Other kinds: Data release, Registry entry, Code.
# `citation_intro` is optional and holds only what is particular to this
# dataset: the standard "please cite the paper" sentence is generated.
citations:
  - kind: "Paper"
    reference: |
      Author, A., Author, B., et al. (YEAR) 'Title', *Journal*, volume, pages.
    entry: |
      @article{key,
        title   = {},
        journal = {},
        year    = {},
        doi     = {},
      }
---
