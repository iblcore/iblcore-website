---
title: "Lightning Pose"
card_image:
  src: "images/lightning-pose-logo.png"
  alt: "The Lightning Pose wordmark beside a purple mouse's head drawn as a mesh of tracked keypoints, with a lightning bolt down the centre."
  fit: "contain"
description: "Semi-supervised 2D and 3D pose estimation, used to track animal movement in video recordings."
weight: 3

modality:
  - "video"
stage:
  - "pre-process"

maintainer: "IBL"

links:
  docs: "https://lightning-pose.readthedocs.io/en/latest/"
  code: "https://github.com/paninski-lab/lightning-pose"

about:
  - heading: "Work in a browser"
    description: "The app covers the whole cycle: labeling frames, creating and training models, running inference, and stepping through the predictions over the footage. It runs on your own machine or on a headless GPU server in the cloud, with the interface in a browser either way."
  - heading: "Train on more than your labels"
    description: "Unsupervised objectives penalize predictions that break physical constraints, and temporal context networks read the frames either side of each one. The model learns from unlabeled video, so a small labeled set goes considerably further than it would with a purely supervised tracker."
  - heading: "Track across several cameras"
    description: "A multi-view transformer fuses features from every camera early in the network, and patch masking teaches it the correspondences between views. On a calibrated rig, triangulation losses hold the predictions geometrically consistent in three dimensions."
  - heading: "See where it is unsure"
    description: "Ensembling with Kalman smoothing stabilizes predictions over time, and variance inflation flags keypoints the cameras disagree about. Uncertainty comes out alongside the coordinates, which is what tells you where to label more frames."
---

Lightning Pose places keypoints on every frame of a video: paws, pupil,
whiskers, or whatever else you choose to label. What separates it from a purely
supervised tracker is that it does not learn from your labeled frames alone. It
also trains on the unlabeled video around them, penalizing predictions that are
physically impossible and using the temporal context either side of a frame to
resolve a body part that is ambiguous or briefly hidden.

For rigs with more than one camera, a transformer architecture fuses the views
rather than tracking each one separately, and calibration lets it enforce
consistency in three dimensions. Where the views disagree, that disagreement is
reported rather than hidden, so predictions arrive with a measure of how far
they can be trusted.

IBL runs Lightning Pose across three cameras on every rig and releases the
resulting keypoints with the raw video they were computed from.
