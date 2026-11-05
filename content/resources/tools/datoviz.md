---
title: "Datoviz"
card_image:
  src: "images/datoviz-logo.png"
  alt: "The Datoviz wordmark, flanked above and below by bands of small coloured squares running through the spectrum."
  fit: "contain"
description: "High-performance GPU rendering for scientific data visualization, built for interactive exploration of large datasets."
weight: 4

modality: []
stage:
  - "visualise"

maintainer: "IBL"

links:
  docs: "https://datoviz.org/"
  code: "https://github.com/datoviz/datoviz"

about:
  - heading: "Draw the whole dataset"
    description: "Points, pixels, markers and splats for scattered data; segments, paths and vectors for lines; images, text and labels for annotation; meshes, spheres and volumes in three dimensions. A point cloud of millions of points is a normal case rather than the limit."
  - heading: "Move around in it"
    description: "Pan and zoom for flat data, arcball, turntable and fly controllers for volumes, and panels that can be linked so several views move together. Axes, colorbars, legends, scale bars and guide lines come as part of the scene."
  - heading: "Drive it from Python"
    description: "NumPy arrays are passed straight to the renderer with no copy into an intermediate format. There is a C API for C and C++, raw ctypes access, and guidance for working in IPython or embedding a view inside a Qt application."
  - heading: "Keep it live, or save it out"
    description: "Data in a visual can be updated in place, with timers and animation tracks for sequences, so the same code drives a live display or a replay. Rendering offscreen produces screenshots and video without opening a window."
---

Datoviz is a rendering engine for scientific data, written in C with direct
Python and NumPy bindings. It draws through Vulkan, talking to the graphics
card rather than through the drawing stack a conventional plotting library
sits on, which is what lets it keep millions of points responsive to panning,
zooming and rotation in real time.

It is desktop-first and runs on Linux, macOS and Windows, rendering into its
own window with a built-in GUI alongside the data. The scene is retained
rather than redrawn from scratch, so a figure can be built once out of panels
and visuals and then updated as data arrives.

Datoviz is developed at IBL for the interactive exploration of large
electrophysiology recordings, but nothing in it is specific to neuroscience:
it is a general engine for data that is too big to plot comfortably any other
way.
