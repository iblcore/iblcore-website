---
title: "Benchmark a model on brain-wide recordings"
description: "From the recordings the benchmark is built on to a scored submission on the public leaderboard."
weight: 2

modality:
  - "neuropixels"
  - "behavior"
stage:
  - "benchmark"

steps:
  - title: "Know the recordings underneath"
    resource:
      - "/resources/data/brainwide-map"
      - "/resources/tools/data-explorer"
    note: |
      IBL BrainWideBench scores models on the Brainwide Map: Neuropixels
      recordings from mice performing a sensory-guided decision-making task,
      with behavior measured at the same time. The benchmark downloads the
      recordings itself, so nothing needs installing to start here. Open the
      Brainwide Map Explorer in a browser to see what the scores are built on:
      where the probes sat, and the activity on each channel.

  - title: "Run the benchmark"
    resource: "/resources/tools/brainwide-bench"
    note: |
      Clone the repository, create the environment, and download the
      recordings. The data is public and needs no credentials.

      Train one shared model for all three task suites, or download a released
      checkpoint and go straight to evaluation. The suites ask for different
      things from the same model:

      - **Behavior**: predict trial-level behavioral outcomes from neural population activity.
      - **Dynamics**: reconstruct firing rate trajectories and spike predictions across brain regions.
      - **Anatomy**: classify recorded neurons to their brain region from activity alone.

      Run the suite you are targeting, save the predictions it produces, and
      repeat across seeds and evaluation recordings. Upload the prediction
      files to the leaderboard: scoring runs on the benchmark's own server, so
      you never handle the evaluation labels.
---
