# IBL-Core Website

This repository contains the new IBL-Core public website work.

Current phase:
- Information architecture and content planning
- Landing page prototype porting (`docs/landing-prototype.png` -> Hugo templates)
- Foundation setup for a Hugo + vanilla HTML/CSS/JS stack

## Core Docs

- Sitemap and IA baseline: [`docs/sitemap-v1.md`](docs/sitemap-v1.md)
- Brainstorm notes: [`docs/brainstorming.md`](docs/brainstorming.md)
- Landing prototype image: [`docs/landing-prototype.png`](docs/landing-prototype.png)

## Agreed v1 Navigation

1. Home
2. About
3. Resources
4. Projects & Partners
5. Publications
6. Join Us
7. News
8. Contact

## Content Rules (v1)

- `About` includes: mission/history, team, governance & policies, FAQ.
- `News` includes events and press.
- `Resources` includes `Data`, `Software`, `Hardware`.
- Tutorials and docs must be placed under one of those three resource categories.
- `Join Us` is careers-first, includes open roles and talent pool, and links collaborators to `Projects & Partners`.
- Funders/support content appears on home/footer only (not top nav).

## Tech Direction

- Static generator: Hugo
- Frontend: modern vanilla HTML/CSS with minimal vanilla JS
- Preferred implementation style: reusable partials/components, no framework lock-in

## Next Implementation Milestones

1. Scaffold Hugo structure (`content/`, `layouts/`, `assets/`, archetypes).
2. Build reusable base templates (base layout, header, footer, generic content page).
3. Port prototype home sections into maintainable components.
4. Create initial markdown stubs for all top-level and key subpages.
5. Migrate old-site content into the new IA.

See [`AGENTS.md`](AGENTS.md) for execution guidance for future Codex runs.
