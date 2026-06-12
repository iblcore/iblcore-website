---
title: "Run Behaviour Experiment"
description: "Prepare behavioural tasks and acquisition resources before data analysis."
lead: "Use this workflow when planning or reviewing an IBL-style behavioural experiment."
resource_type: workflow
difficulty: intermediate
audience:
  - experimentalist
  - partner lab
uses:
  - alyx
methods:
  - behaviour
learning:
  - glossary
next_steps:
  - analyse-neuropixels-data
steps:
  - title: "Review the behavioural method"
    summary: "Start with task structure, rig requirements, and metadata expectations."
    methods:
      - behaviour
  - title: "Prepare subject and session records"
    summary: "Use Alyx as the operational source for subjects, sessions, and metadata."
    uses:
      - alyx
  - title: "Connect downstream analysis"
    summary: "Plan how behavioural outputs will connect to electrophysiology or project datasets."
    methods:
      - neuropixels
---

Use this placeholder as the bridge between experimental setup content and downstream resource workflows.
