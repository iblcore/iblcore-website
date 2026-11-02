---
title: "Brainwide Map Explorer"
description: "Browse the Brainwide Map and repeated-site recordings interactively without writing code, from probe locations to the activity on each channel."
weight: 6

modality:
  - "neuropixels"
  - "behavior"
stage:
  - "visualise"

datasets:
  - "/resources/data/brainwide-map"
  - "/resources/data/reproducible-ephys"

maintainer: "IBL"

links:
  platform: "https://viz.internationalbrainlab.org"

about:
  - heading: "Find a recording"
    description: "Search by lab, subject or brain region, or pick an insertion out of the three-dimensional brain. Tabs switch between the whole Brainwide Map and the repeated-site recordings behind Reproducible Ephys."
    figure:
      tone: "light"
      src: "images/brainwide-map-explorer.jpg"
      alt: "The session selector: a three-dimensional mouse brain holding every probe insertion, with one picked out and a table beside it listing that probe's lab, unit count, spike count and trial count."
      caption: "Every insertion in one view; select one to see that probe's recordings."
  - heading: "See the whole session"
    description: "One probe's whole recording at once: spikes against depth, the signals that mark the boundaries between brain regions, where the probe actually sat, and the mouse's choices on the same time axis."
    figure:
      tone: "light"
      src: "images/brainwide-map-explorer-session.jpg"
      alt: "A session overview: a raster of spikes against probe depth across the full recording, panels of unit amplitude, firing rate, AP-band RMS and LFP power, a histology slice crossed by the probe track, and the mouse's reaction times and choices on the same time axis."
      caption: "One session end to end: subject DY_013, recorded in danlab."
  - heading: "Follow a single neuron"
    description: "Open any unit on its own, aligned to stimulus, movement and feedback and split by what the mouse saw, did and received, with the quality metrics that say whether it held up."
    figure:
      tone: "light"
      src: "images/brainwide-map-explorer-cluster.jpg"
      alt: "A single unit's page: rasters and averaged firing rates aligned to stimulus onset, first movement and feedback and split by trial condition, with the spike waveform across channels, an autocorrelogram, an interval histogram and the unit's amplitude over the session."
      caption: "One neuron, broken down by what the mouse saw, did and received."
  - heading: "Step through single trials"
    description: "A trial picker replays the session trial by trial, with video from the rig cameras beside the aligned activity. Any view can be shared as a link that reopens it."
---

The Brainwide Map Explorer puts IBL's Neuropixels recordings in a browser.
Nothing to install and no account to create: pick a recording and its spikes,
behaviour and histology are already plotted, from the whole session down to a
single neuron.
