---
title: "IBL BrainWideBench"
description: "A standardized benchmark for models pretrained on brain-wide neural recordings."
draft: false
placeholder_copy: true
layout: "benchmark"
header_variant: "landing"
footer_variant: "non-landing"
body_class: "page-resources-benchmark"
banner_logo: "/images/ibl-brainwidebench-logo.png"
banner_intro: |
  A standardized benchmark for models pretrained on brain-wide neural recordings.
banner_buttons:
  - label: "Project page"
    url: "https://brainbench-org.github.io/ibl-bwb-project"
  - label: "Leaderboard"
    url: "https://bwb.iblcore.org"
  - label: "Documentation"
    url: "https://brainbench-org.github.io/ibl-bwb"
  - label: "Paper"
    url: "https://arxiv.org/abs/2609.22064"
  - label: "How to cite"
    url: "#citation"

intro_title: "What it is"
video: "/videos/ibl-brainwidebench.mp4"
video_description: "Animated overview of IBL BrainWideBench: the dataset, the three task suites, and how to submit."
video_caption: "A 34-second overview of the dataset, the task suites and the submission route."


cta_title: "Submit your model for evaluation"
cta_body: |
  Anyone can take part. Run your model on the held-out sessions, upload the
  predictions to the [leaderboard](https://bwb.iblcore.org), and see how it
  compares. The steps are under [How to use it](#how-to-use-it).

  Models are scored on any or all of three task suites:

suites:
  - label: "TS1"
    title: "Behavior"
    body: "Predict trial-level behavioral outcomes from neural population activity."
    image: "/images/bwb/ts1-behavior.webp"
    alt: "Spike raster passed to a model, which outputs a behavioral trace."
  - label: "TS2"
    title: "Dynamics"
    body: "Reconstruct firing rate trajectories and spike predictions across brain regions."
    image: "/images/bwb/ts2-dynamics.webp"
    alt: "Spike raster with a masked block passed to a model, which reconstructs the masked activity."
  - label: "TS3"
    title: "Anatomy"
    body: "Classify recorded neurons to their brain region from activity alone."
    image: "/images/bwb/ts3-anatomy.webp"
    alt: "Spike raster passed to a model, which assigns each neuron to a brain region shown on a coronal atlas slice."

steps_title: "How to use it"
steps_intro: "The [documentation](https://brainbench-org.github.io/ibl-bwb) covers each stage in full."
steps:
  - title: "Set up"
    body: |
      Clone the [repository](https://github.com/brainbench-org/ibl-bwb), create
      the environment, and download the recordings. The data is public and needs
      no credentials.
  - title: "Pretrain, or start from a checkpoint"
    body: |
      Train one shared model for all three suites, or download a released
      [checkpoint](https://huggingface.co/collections/nerdslab/ibl-bwb) and go
      straight to evaluation.
  - title: "Evaluate and save predictions"
    body: |
      Run the suite you are targeting and save the predictions it produces.
  - title: "Scale up and submit"
    body: |
      Repeat across seeds and evaluation recordings, then upload the prediction
      files to the [leaderboard](https://bwb.iblcore.org). Scoring runs on the
      benchmark's server, so you never handle the evaluation labels.

links_title: "Links"
links:
  - title: "Project page"
    url: "https://brainbench-org.github.io/ibl-bwb-project"
    lead: true
  - title: "Leaderboard"
    description: "Current standings and model submissions."
    url: "https://bwb.iblcore.org"
  - title: "Documentation"
    description: "Setup, data, task suites and submission."
    url: "https://brainbench-org.github.io/ibl-bwb"
  - title: "Code"
    description: "Pretraining, evaluation and scoring code."
    url: "https://github.com/brainbench-org/ibl-bwb"
  - title: "Checkpoints"
    description: "Pretrained models on Hugging Face."
    url: "https://huggingface.co/collections/nerdslab/ibl-bwb"
  - title: "Paper"
    description: "Benchmark design, baselines and findings."
    url: "https://arxiv.org/abs/2609.22064"
  - title: "Training runs"
    description: "Public Weights & Biases logs for the baselines."
    url: "https://wandb.ai/ibl-bwb/projects"

citation_title: "Citation"
citation_intro: |
  If you use IBL BrainWideBench, please cite the benchmark paper and the dataset
  it is built on. The benchmark entry is also in the repository's
  [CITATION.cff](https://github.com/brainbench-org/ibl-bwb/blob/main/CITATION.cff).
citations:
  - kind: "Benchmark paper"
    reference: |
      Andre, A., Mahato, S. P., Arora, V., et al. (2026) *BrainWideBench:
      Benchmarking large-scale pretraining and across-animal transfer in
      multi-region neural recordings*. arXiv:2609.22064.
    entry: |
      @misc{iblbwb2026,
        title         = {BrainWideBench: Benchmarking large-scale pretraining and across-animal transfer in multi-region neural recordings},
        author        = {Alexandre Andre and Shivashriganesh P. Mahato and Vinam Arora and Keshav Balaji and Divyansha Lachi and Nanda H. Krishna and Jingyun Xiao and Yizi Zhang and Ximeng Mao and Wenrui Ma and Han Yu and International Brain Laboratory and Daniel Birman and Niccolo Bonacchi and Gaelle A. Chapuis and Joana A. Catarino and Felicia Davatolhagh and Mayo Faulkner and Laura Freitas-Silva and Fei Hu and Julia M. Huntenburg and Anup Khanal and Ines Laranjeira and Petrina Lau and Guido T. Meijer and Nathaniel J. Miska and Jean-Paul Noel and Alejandro Pan-Vazquez and Georg Raiser and Cyrille Rossant and Karolina Z. Socha and Anne E. Urai and Miles J. Wells and Steven J. West and Olivier Winter and Blake Richards and Guillaume Lajoie and Cole Hurwitz and Mehdi Azabou and Matthew R. Whiteway and Liam Paninski and Eva L. Dyer},
        year          = {2026},
        eprint        = {2609.22064},
        archivePrefix = {arXiv},
        primaryClass  = {cs.LG},
        url           = {https://arxiv.org/abs/2609.22064},
      }
  - kind: "Dataset"
    reference: |
      International Brain Laboratory, Benson, B., Benson, J., et al. (2025) 'A
      brain-wide map of neural activity during complex behaviour', *Nature*,
      645(8079), pp. 177-191.
    entry: |
      @article{iblbwm2025,
        title   = {A brain-wide map of neural activity during complex behaviour},
        author  = {IBL and Benson, Brandon and Benson, Julius and Birman, Daniel and Bonacchi, Niccolo and Carandini, Matteo and Catarino, Joana A and Chapuis, Gaelle A and Churchland, Anne K and Dan, Yang and Dayan, Peter and DeWitt, Eric EJ and Engel, Tatiana A and Fabbri, Michele and Faulkner, Mayo and Fiete, Ila Rani and Findling, Charles and Freitas-Silva, Laura and Gercek, Berk and Harris, Kenneth D and Hausser, Michael and Hofer, Sonja B and Hu, Fei and Hubert, Felix and Huntenburg, Julia M and Khanal, Anup and Krasniak, Christopher and Langdon, Christopher and Lau, Petrina Y P and Mainen, Zachary F and Meijer, Guido T and Miska, Nathaniel J and Mrsic-Flogel, Thomas D and Noel, Jean-Paul and Nylund, Kai and Pan-Vazquez, Alejandro and Pouget, Alexandre and Rossant, Cyrille and Roth, Noam and Schaeffer, Rylan and Schartner, Michael and Shi, Yanliang and Socha, Karolina Z and Steinmetz, Nicholas A and Svoboda, Karel and Urai, Anne E and Wells, Miles J and West, Steven Jon and Whiteway, Matthew R and Winter, Olivier and Witten, Ilana B},
        journal = {Nature},
        volume  = {645},
        number  = {8079},
        pages   = {177--191},
        year    = {2025},
        url     = {https://www.nature.com/articles/s41586-025-09235-0},
      }
---

IBL BrainWideBench is an evaluation suite for models trained on brain-wide
spiking activity. The data comes from the IBL Brain Wide Map, Neuropixels
recordings from 139 mice performing a sensory-guided decision-making task, with
behavior measured at the same time.

Comparing such models has been difficult, because evaluation protocols are
fragmented and most cover only a single task domain. The suite fixes the
protocol so that different approaches can be measured on the same terms,
including on recording sessions held out of the pretraining split.
