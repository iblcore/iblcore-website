---
title: "Track movement in your own video"
description: "From installing Lightning Pose to keypoints on every frame of your own recordings."
weight: 3

modality:
  - "video"
stage:
  - "pre-process"

steps:
  - title: "Track your video with Lightning Pose"
    resource: "/resources/tools/lightning-pose"
    note: |
      Lightning Pose places keypoints on every frame of a video. Unlike a
      purely supervised tracker it also learns from your unlabeled frames, so a
      small labeled set goes further and the tracking holds up when a body part
      is hidden. The whole thing runs in a browser app, and the
      [documentation](https://lightning-pose.readthedocs.io/en/latest/) walks
      through each stage:

      - **Install it** on Linux or WSL2 with an NVIDIA GPU, or skip the install
        and use the Lightning AI cloud environment.
      - **Start a project**, naming the keypoints you want tracked and your
        camera views.
      - **Label a first set of frames**, covering the postures and lighting you
        care about rather than as many as possible.
      - **Train a model**, then **run inference** on the video you want tracked
        and step through the predictions in the Viewer.

      Treat the first model as a draft: label more frames wherever it fails,
      and retrain.

  - title: "Compare against IBL's own tracking"
    resource:
      - "/resources/data/brainwide-map"
      - "/resources/data/aging"
    note: |
      Optional, and useful if you want to see what this pipeline produces at
      scale. IBL runs Lightning Pose across three cameras on every rig and
      releases the keypoints with the raw video they came from, so you can see
      the output format and how the tracking holds up over a full session.
---
