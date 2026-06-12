# Resources Maintenance Guide

This guide explains how to maintain the workflow-first Resources section and its dependency graph.

Use this when adding or editing resource pages under `content/resources/`.

## Purpose

The Resources section is both:

1. A human navigation system for researchers.
2. A machine-readable knowledge graph for search, recommendations, and AI assistants.

The page tree is for browsing. The front matter is the source of truth for relationships.

## Content Structure

Resources live in these folders:

```text
content/resources/
  ai-assistant-guide.md
  start-here/
  workflows/
  datasets/
  tools/
  methods/
  learning/
```

Use the folder that best describes what the page is:

- `workflows`: goal-based research journeys.
- `datasets`: datasets and access paths.
- `tools`: software, viewers, services, models, renderers, and infrastructure.
- `methods`: modalities, protocols, rigs, and scientific or technical methods.
- `learning`: tutorials, quickstarts, Colabs, courses, FAQs, and glossary pages.
- `start-here`: goal-based onboarding entries that point users into workflows.
- `ai-assistant-guide.md`: low-key guide for AI assistants and automated clients.

## Resource IDs

Relationships reference resource IDs.

By default, the ID is the filename without `.md`.

Examples:

```text
content/resources/tools/viewephys.md
```

has the resource ID:

```text
viewephys
```

Only set `resource_id` manually if a filename must change while preserving an existing graph ID.

## Relationship Rule

Maintain only forward relationships.

Do not manually add reverse relationships such as `used_by`.

For example, this is correct:

```yaml
---
title: "Analyse Neuropixels Data"
resource_type: workflow
uses:
  - one
  - viewephys
datasets:
  - brainwide-map
---
```

The site automatically calculates that `ViewEphys` and `Brainwide Map` are used by `Analyse Neuropixels Data`.

Do not also add this to `viewephys.md`:

```yaml
used_by:
  - analyse-neuropixels-data
```

That would create duplicate maintenance and drift.

## Relationship Fields

Use this controlled vocabulary:

| Field | Meaning |
| --- | --- |
| `requires` | Hard dependency. The page cannot be used without this resource. |
| `uses` | Resource actively used by a workflow, method, or tutorial. |
| `datasets` | Datasets involved or referenced. |
| `methods` | Scientific or technical methods involved. |
| `learning` | Tutorials, quickstarts, Colabs, courses, FAQs, or glossary pages. |
| `workflows` | Related workflows. |
| `next_steps` | Recommended follow-up workflows. |

Prefer these fields over inventing new names such as `related_tools`, `related_tutorials`, or `used_by`.

## Resource Types

Every resource page should include:

```yaml
resource_type: workflow
```

Allowed values:

```text
workflow
dataset
tool
method
learning
```

## Choosing What To Edit

Do not start by asking "where should this page appear in navigation?" Start by asking what the resource is and where a researcher encounters it.

Use this decision table:

| Situation | Create or edit |
| --- | --- |
| A new end-to-end researcher journey | `content/resources/workflows/<slug>.md` |
| A new dataset or data release | `content/resources/datasets/<slug>.md` |
| A new software package, viewer, service, model, or renderer | `content/resources/tools/<slug>.md` |
| A new modality, protocol, rig, analysis method, or visualisation method | `content/resources/methods/<slug>.md` |
| A new tutorial, quickstart, Colab, course, FAQ, or glossary page | `content/resources/learning/<slug>.md` |
| A new resource changes how users complete an existing task | edit the relevant workflow in `content/resources/workflows/` |

Search the workflow folder before creating a new workflow:

```bash
rg "visualise|recording|neuropixels|viewephys|datoviz" content/resources/workflows
```

Use the current workflow names as anchors:

```text
analyse-neuropixels-data.md      # find, download, inspect, analyse, and visualise Neuropixels data
visualise-results.md             # move analysis outputs into visual inspection or web-ready outputs
workflow-spike-sorting.md        # process raw Neuropixels recordings and inspect sorted outputs
anatomical-localisation.md       # connect recordings to histology and anatomy
run-behaviour-experiment.md      # experimental setup and behavioural session context
build-custom-analysis.md         # custom analysis built from IBL resources
```

## Example: New Visualisation Method For Recording Data

Scenario: a new visualisation method appears for a workflow that goes from doing a recording to viewing neural data.

The developer should make these decisions:

1. Is it a scientific or analytical method?
   - Create `content/resources/methods/<visualisation-method>.md`.
2. Is it a software tool or viewer?
   - Create `content/resources/tools/<visualisation-tool>.md`.
3. Does it need step-by-step onboarding?
   - Create `content/resources/learning/<visualisation-tutorial>.md`.
4. Where does the researcher encounter it?
   - Edit `content/resources/workflows/visualise-results.md` if it is part of visualising analysis outputs.
   - Edit `content/resources/workflows/analyse-neuropixels-data.md` if it is part of the core inspect-recordings path.
   - Edit `content/resources/workflows/workflow-spike-sorting.md` if it is used to inspect spike sorting outputs.

For example, if the new resource is a software viewer called `NeuroViz`, create:

```text
content/resources/tools/neuroviz.md
```

with front matter like:

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

If users need a tutorial, create:

```text
content/resources/learning/neuroviz-tutorial.md
```

with front matter like:

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

Then amend the relevant workflow.

For `content/resources/workflows/visualise-results.md`, add the tool to `uses`:

```yaml
uses:
  - datoviz
  - website-renderer
  - brainbox
  - neuroviz
```

And add it to the step where it belongs:

```yaml
steps:
  - title: "Choose a visualisation route"
    summary: "Use the appropriate visualisation tool for the data type and output."
    uses:
      - datoviz
      - website-renderer
      - neuroviz
```

If the tool is also part of inspecting recordings before analysis, amend `content/resources/workflows/analyse-neuropixels-data.md`:

```yaml
steps:
  - title: "Inspect recordings"
    summary: "Open electrophysiology traces and quality-control views before analysis."
    uses:
      - viewephys
      - neuroviz
    learning:
      - viewephys-tutorial
      - neuroviz-tutorial
```

Do not edit `neuroviz.md` to add `used_by`. The relationship panel and `/resource-graph.json` will calculate that automatically from the workflow edits.

## Adding A New Tool

When a new developer adds a tool, they should usually create more than just a tool page.

At minimum, create:

1. A tool page under `content/resources/tools/`.
2. At least one relationship to an existing workflow, method, dataset, or learning page.
3. A learning page if the tool needs onboarding.
4. A workflow update if the tool is part of a researcher journey.

Example: adding a new tool called `Example Viewer`.

### 1. Create The Tool Page

Create:

```text
content/resources/tools/example-viewer.md
```

Use:

```yaml
---
title: "Example Viewer"
description: "Viewer for inspecting example dataset outputs."
lead: "Use Example Viewer to inspect processed outputs before downstream analysis."
resource_type: tool
requires:
  - one
datasets:
  - brainwide-map
methods:
  - neuropixels
learning:
  - example-viewer-tutorial
---
```

Then add concise page content:

```markdown
Add installation, access requirements, expected inputs, and common inspection tasks here.
```

### 2. Create A Learning Page If Needed

If the tool is not obvious to first-time users, create:

```text
content/resources/learning/example-viewer-tutorial.md
```

Use:

```yaml
---
title: "Example Viewer Tutorial"
description: "Tutorial for inspecting outputs with Example Viewer."
lead: "Use this tutorial when a workflow asks you to inspect processed outputs."
resource_type: learning
learning_type: tutorial
uses:
  - example-viewer
methods:
  - neuropixels
---
```

### 3. Connect It To A Workflow

If the tool is part of a user journey, edit the relevant workflow.

Example:

```text
content/resources/workflows/analyse-neuropixels-data.md
```

Add the tool to `uses`:

```yaml
uses:
  - one
  - alyx
  - viewephys
  - example-viewer
  - brainbox
```

If it belongs to a specific step, add it there too:

```yaml
steps:
  - title: "Inspect recordings"
    summary: "Open electrophysiology traces and quality-control views before analysis."
    uses:
      - viewephys
      - example-viewer
    learning:
      - viewephys-tutorial
      - example-viewer-tutorial
```

### 4. Check Reverse Links

Do not edit the new tool page to say which workflows use it.

After the workflow points to `example-viewer`, the tool page will automatically show:

```text
Used By
Analyse Neuropixels Data
```

## Adding A New Workflow

Create a workflow when the site needs to explain a researcher journey, not just document a single resource.

Create:

```text
content/resources/workflows/my-new-workflow.md
```

Use:

```yaml
---
title: "My New Workflow"
description: ""
lead: ""
resource_type: workflow
difficulty: intermediate
audience:
  - researcher
datasets:
  - brainwide-map
uses:
  - one
  - brainbox
methods:
  - neuropixels
learning:
  - one-quickstart
next_steps:
  - visualise-results
steps:
  - title: "Find sessions"
    summary: "Search for sessions that match the research question."
    uses:
      - one
    datasets:
      - brainwide-map
  - title: "Run analysis"
    summary: "Use reusable analysis utilities on selected sessions."
    uses:
      - brainbox
---
```

Workflow pages should answer:

- What is the goal?
- Who is this for?
- What does the user need?
- What should the user do first?
- Which resources are involved?
- What should the user do next?

## Adding A Dataset

Create:

```text
content/resources/datasets/my-dataset.md
```

Use:

```yaml
---
title: "My Dataset"
description: ""
lead: ""
resource_type: dataset
difficulty: intermediate
modality:
  - Neuropixels
requires:
  - one
methods:
  - neuropixels
learning:
  - one-quickstart
---
```

Dataset pages should include:

- what the dataset contains
- access requirements
- expected prerequisites
- citation or publication guidance
- workflows that use the dataset, generated automatically through reverse links

## Adding A Method

Create:

```text
content/resources/methods/my-method.md
```

Use:

```yaml
---
title: "My Method"
description: ""
lead: ""
resource_type: method
uses:
  - relevant-tool
datasets:
  - relevant-dataset
learning:
  - relevant-tutorial
---
```

Use method pages for modalities, rigs, protocols, and scientific or technical procedures.

## Adding Learning Material

Create:

```text
content/resources/learning/my-tutorial.md
```

Use:

```yaml
---
title: "My Tutorial"
description: ""
lead: ""
resource_type: learning
learning_type: tutorial
uses:
  - relevant-tool
datasets:
  - relevant-dataset
methods:
  - relevant-method
workflows:
  - relevant-workflow
---
```

Common `learning_type` values:

```text
guide
quickstart
tutorial
colab
course
faq
glossary
```

## Maintaining The AI Assistant Guide

The AI Assistant Guide lives at:

```text
content/resources/ai-assistant-guide.md
```

It renders at:

```text
/resources/ai-assistant-guide/
```

Use it to help AI assistants answer common practical questions by routing users to canonical Resources pages.

It should contain:

- canonical machine-readable sources, especially `/resource-graph.json`
- common user intents, such as downloading data or exploring Brainwide Map
- the preferred workflow, tool, dataset, and learning pages for each intent
- assistant rules, such as "use workflow pages first"
- maintenance notes for when the guide should be updated

Update the guide when:

- a new primary workflow is added
- the recommended path for downloading data changes
- a new flagship dataset is added
- a new tool becomes the preferred entry point for a common task
- resource graph relationships change in a way that affects the listed user intents

Keep the guide short. It should route assistants to canonical pages, not duplicate full documentation.

## Generated Relationship Panels

Resource pages automatically render relationship panels with sections such as:

- Requires
- Uses
- Datasets
- Methods
- Learning
- Related Workflows
- Next Recommended Steps
- Used By

These are rendered by:

```text
layouts/partials/resources/relationship-panel.html
```

## Generated Graph

The machine-readable graph is generated at:

```text
/resource-graph.json
```

The source content page is:

```text
content/resource-graph.md
```

The rendering template is:

```text
layouts/_default/resource-graph.html
```

The generated graph includes:

- resource ID
- title
- type
- URL
- direct relationships
- workflow steps
- automatically computed `used_by`

## Validation

Before finishing a Resources edit, run:

```bash
hugo --panicOnWarning --cleanDestinationDir
just validate-resources
```

If `just` is unavailable, run the validation command directly:

```bash
if rg -q '<span class=("[^"]*"|[^>]*)is-missing' public/resources; then rg '<span class=("[^"]*"|[^>]*)is-missing' public/resources; exit 1; fi
```

This catches relationship IDs that point to pages that do not exist.

## Maintenance Checklist

Before opening a pull request or handing off a Resources change:

- The new page is in the correct `content/resources/` folder.
- `resource_type` is set.
- Relationship fields use existing resource IDs.
- No manual `used_by` field was added.
- A workflow was updated if the new resource belongs to a researcher journey.
- A tutorial or quickstart was added if the resource needs onboarding.
- `hugo --panicOnWarning --cleanDestinationDir` passes.
- `just validate-resources` or the equivalent `rg` command passes.
- `/resource-graph.json` includes the new resource.

## Common Mistakes

Avoid these:

- Adding a tool page with no workflow, method, dataset, or learning relationships.
- Creating both sides of a relationship manually.
- Inventing new relationship field names.
- Renaming a file without updating references to its resource ID.
- Putting a researcher journey under `tools` instead of `workflows`.
- Putting protocol or modality material under `datasets` instead of `methods`.
