---
title: "Alyx"
card_image:
  src: "images/alyx-card.png"
  alt: "The word Alyx set in the slab serif its documentation uses, beside a blue database cylinder with three lines running from it to three small circles."
description: "The database of experiment metadata behind IBL's recordings, which ONE queries to find sessions before any data is downloaded."
weight: 1

modality: []
stage:
  - "collect"

maintainer: "IBL"

links:
  code: "https://github.com/cortex-lab/alyx"

about:
  - heading: "Ask the database, not the file system"
    description: "Because the metadata sits in a real relational database, you can ask for sessions by subject, lab, task protocol, date or brain region and get a list back before fetching a single file. ONE runs exactly these queries on your behalf."
  - heading: "Track the colony"
    description: "Subjects, lines, litters, breeding pairs and genotypes, alongside the daily record of weighings, water restriction, water administrations, surgeries and procedures. Animal management and experiments live in the same database rather than in separate spreadsheets."
  - heading: "Register experiments and their files"
    description: "Sessions record what was done and when; datasets, data repositories and file records say which files resulted and where each one lives. The database stores the location of a file, never the file itself."
  - heading: "Keep the recording geometry"
    description: "Probe models, insertions, trajectory estimates and per-channel brain regions, plus imaging stacks and fields of view. This is what makes a query like \"every recording touching region X\" answerable at all."
---

Alyx is a relational database for experimental neuroscience laboratories. It
holds metadata rather than recordings, on a deliberately practical definition:
metadata is anything you would want to search over. The details of an
experiment and the summary properties of what it produced go into the database;
the spike times and raw voltages stay in files, and the database keeps a
reference to where each file sits.

It began as an electronic lab notebook at UCL's Cortexlab and now runs data
management across all of IBL's labs. Every record is given a globally unique
identifier the moment it is created, so records produced independently in
different labs merge into one database with no risk of a clash. Each table also
carries a free-form JSON field, so a lab can store metadata the schema never
anticipated without a migration.

There are two ways in. The web forms are the admin interface, filled in during
an experiment; the REST API is the programmatic route, and the one ONE uses.
IBL's public instance is readable at
[openalyx.internationalbrainlab.org](https://openalyx.internationalbrainlab.org).
