---
title: "IBL BrainWideBench is live: bring your model, join the leaderboard"
date: 2026-10-07T00:00:00Z
description: "A standardized benchmark that evaluates models pretrained on brain-wide neural recordings on the same terms, with a public leaderboard open to any submission."
category: "news"
source: "International Brain Laboratory"
logo: "/images/ibl-brainwidebench-logo.png"
draft: false
---

IBL BrainWideBench is open for models. Released at the end of September 2026, it is a standardized benchmark for models pretrained on brain-wide neural recordings, with three task suites and a public leaderboard that anyone can submit to.

<!--more-->

Until now, comparing these models has been difficult: evaluation protocols are fragmented, and most cover only a single task domain. BrainWideBench fixes the protocol so that different approaches can be measured on the same terms. It's built on the IBL Brain Wide Map: Neuropixels recordings from 139 mice performing a sensory-guided decision-making task, with behavior measured at the same time.

You can evaluate your model on one suite or on all three:

{{< suite-cards >}}

Every model is scored on recording sessions held out of the pretraining split, so they're all tested on the same unseen data. 

As of 7 October, the leaderboard has 53 submissions, including the BrainWideBench team's runs of open-source models such as CEBRA, so you can see how they perform alongside your own model's results.

To take part, download the data and checkpoints, run whichever suites you like, and upload your predictions to the leaderboard. Scoring runs on the benchmark's server, so you never handle the evaluation labels. We'd love to see your model on the board!

Everything you need (data, documentation, code, checkpoints, and the preprint) is on the [IBL BrainWideBench page](/resources/benchmarking/ibl-brainwidebench/).
