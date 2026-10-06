---
title: "IBL BrainWideBench is live: bring your model, join the leaderboard"
date: 2026-10-06T00:00:00Z
description: "A standardized benchmark that evaluates models pretrained on brain-wide neural recordings on the same terms, with a public leaderboard open to any submission."
category: "news"
source: "International Brain Laboratory"
logo: "/images/ibl-brainwidebench-logo.png"
draft: false
---

IBL BrainWideBench is open for models. Released at the end of September 2026, it is a standardized benchmark for models pretrained on brain-wide neural recordings, with three task suites and a public leaderboard that anyone can submit to.

<!--more-->

Comparing such models has been difficult, because evaluation protocols are fragmented and most cover only a single task domain. BrainWideBench fixes the protocol so that different approaches can be measured on the same terms. It is built on the IBL Brain Wide Map: Neuropixels recordings from 139 mice performing a sensory-guided decision-making task, with behavior measured at the same time.

Models can be evaluated on one suite or on all three:

{{< suite-cards >}}

Scores are computed on recording sessions held out of the pretraining split, so every model is tested on the same unseen data. The leaderboard has 51 submissions so far, including baselines from open-source models like CEBRA.

To take part, download the data and checkpoints, run the suites you want, and upload your predictions to the leaderboard (sign-in required). Scoring runs on the benchmark's server, so you never handle the evaluation labels. We'd love to see your model on the board.

The data, documentation, code, checkpoints, and preprint are on the
[IBL BrainWideBench page](/resources/benchmarking/ibl-brainwidebench/).
