---
title: "Developer Guide"
description: "How developers should add, connect, and validate Resources pages."
lead: "Use this guide when contributing new workflows, tools, datasets, methods, tutorials, or dependency relationships to the Resources section."
resource_type: learning
learning_type: guide
workflows:
  - analyse-neuropixels-data
  - visualise-results
  - workflow-spike-sorting
  - build-custom-analysis
learning:
  - ai-assistant-guide
  - glossary
---

## Purpose

The Resources section is a workflow-first knowledge graph. It should help researchers answer practical questions such as:

- How do I download IBL data?
- How do I inspect Neuropixels recordings?
- How do I visualise neural data?
- Which tools and tutorials belong to this workflow?

Every Resources edit should preserve two things:

1. A clear human route through the website.
2. A clean machine-readable graph at `/resource-graph.json`.

## Where To Put A New Page

Choose the folder from the kind of thing you are adding:

```text
New researcher journey       -> content/resources/workflows/<slug>.md
New dataset                  -> content/resources/datasets/<slug>.md
New software/viewer/service  -> content/resources/tools/<slug>.md
New modality/protocol/method -> content/resources/methods/<slug>.md
New tutorial/quickstart      -> content/resources/learning/<slug>.md
```

Use lowercase slugs with hyphens. The filename becomes the resource ID used in front matter relationships.

Example:

```text
content/resources/tools/neuroviz.md
```

creates the resource ID:

```text
neuroviz
```

## How To Choose The Workflow To Amend

Start from the researcher task, not from the resource category.

Search existing workflows before creating a new one:

```bash
rg "recording|visualise|neuropixels|spike|analysis" content/resources/workflows
```

Use these current workflows as anchors:

```text
analyse-neuropixels-data.md  -> find, download, inspect, analyse, and visualise Neuropixels data
visualise-results.md         -> inspect, share, or publish analysis outputs
workflow-spike-sorting.md    -> process and inspect spike sorting outputs
anatomical-localisation.md   -> connect recordings to anatomy and histology
build-custom-analysis.md     -> assemble tools and datasets for custom work
```

If a new resource changes how a user completes a task, amend the workflow where that task happens.

## Example: New Visualisation Method

Scenario: a new visualisation method appears for researchers who record neural data and then inspect or visualise the result.

Decide what the resource is:

- If it is a software viewer, create `content/resources/tools/<slug>.md`.
- If it is a scientific or analytical approach, create `content/resources/methods/<slug>.md`.
- If users need instructions, create `content/resources/learning/<slug>-tutorial.md`.

Then amend the workflow:

- Edit `content/resources/workflows/visualise-results.md` if it visualises analysis outputs.
- Edit `content/resources/workflows/analyse-neuropixels-data.md` if it is part of the recording inspection path.
- Edit `content/resources/workflows/workflow-spike-sorting.md` if it inspects spike sorting outputs.

## Example Tool Page

```yaml
---
title: "NeuroViz"
description: "Viewer for inspecting processed neural data."
lead: "Use NeuroViz to inspect neural activity after analysis or spike sorting."
resource_type: tool
requires:
  - one
uses:
  - brainbox
methods:
  - neuropixels
learning:
  - neuroviz-tutorial
---
```

## Example Tutorial Page

```yaml
---
title: "NeuroViz Tutorial"
description: "Tutorial for visualising processed neural data with NeuroViz."
lead: "Use this tutorial when a workflow asks you to inspect processed neural data."
resource_type: learning
learning_type: tutorial
uses:
  - neuroviz
methods:
  - neuropixels
workflows:
  - visualise-results
---
```

## Example Workflow Edit

In `content/resources/workflows/visualise-results.md`, add the tool to `uses`:

```yaml
uses:
  - datoviz
  - website-renderer
  - brainbox
  - neuroviz
```

Then add it to the relevant workflow step:

```yaml
steps:
  - title: "Choose a visualisation route"
    summary: "Use the appropriate visualisation tool for the data type and output."
    uses:
      - datoviz
      - website-renderer
      - neuroviz
```

Do not manually add `used_by` anywhere. Reverse links are generated automatically.

## Relationship Fields

Use only the shared relationship fields:

```text
requires    hard dependency
uses        resource actively used by this page
datasets    datasets involved
methods     scientific or technical methods involved
learning    tutorials, quickstarts, Colabs, courses, FAQs, glossary pages
workflows   related workflows
next_steps  recommended follow-up workflows
```

Do not invent new relationship names unless the schema is deliberately updated.

## Validation

Before handing off a Resources change, run:

```bash
hugo --panicOnWarning --cleanDestinationDir
just validate-resources
```

If `just` is not available:

```bash
if rg -q '<span class=("[^"]*"|[^>]*)is-missing' public/resources; then rg '<span class=("[^"]*"|[^>]*)is-missing' public/resources; exit 1; fi
```

Then check that `/resource-graph.json` contains the new resource.

## Contribution Checklist

- The page is in the correct `content/resources/` folder.
- The page has `resource_type`.
- Relationship fields use existing resource IDs.
- The relevant workflow was amended.
- A tutorial or quickstart was added if the resource needs onboarding.
- No manual `used_by` field was added.
- The Hugo build passes.
- Resource validation passes.
- The page appears in `/resource-graph.json`.
