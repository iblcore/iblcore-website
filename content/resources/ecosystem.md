---
title: "Ecosystem Graph"
description: "Mermaid graph of the IBL software ecosystem and repository dependencies."
lead: "Use this page to see how the main IBL repositories depend on one another and where runtime requirements sit in the stack."
layout: ecosystem
---

This graph is generated from `data/ecosystem.yaml`.

Arrows point from a dependency to the repository that depends on it.
Dashed arrows indicate runtime requirements.

Maintenance rule:

- Use `depends_on` for code or import dependencies.
- Use `runtime_requires` when a repo needs another project or service at execution time.
- Use `source_requires` when a repo is launched or developed from source inside a separate environment.
- Use `supports` for umbrella environments that cover multiple repositories.
- Update `data/ecosystem.yaml`, then rebuild the site so this page and the generated HTML stay in sync.
