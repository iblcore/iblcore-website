# IBL-Core Website

Hugo site for the new IBL-Core public website.

## Source Of Truth

Use [docs/sitemap-v1.md](docs/sitemap-v1.md) as the canonical reference for:
- navigation
- page scope
- section hierarchy
- Hugo content structure
- migration priorities

Supporting docs:
- [docs/brainstorming.md](docs/brainstorming.md) for strategy context
- [docs/landing-prototype-mini.webp](docs/landing-prototype-mini.webp) as the current temporary landing-page visual reference
- [docs/resources-maintenance.md](docs/resources-maintenance.md) for maintaining Resources pages and graph relationships

If another document conflicts with the sitemap, update the sitemap first or follow the sitemap as-is.

## Current State

Implemented:
- Hugo config in `hugo.yaml`
- Hugo-native structure in `content/`, `layouts/`, `assets/`, and `archetypes/`
- Shared base templates for home, list, and single pages
- Prototype-driven landing page with custom home layout and page-level CSS
- Homepage What We Do and Major Publications sections
- `/about/` redirect to `/about/team/`, with reusable shared header/footer and an optimized team/about hero image workflow via Hugo assets
- Data-driven `/projects/` section powered by `data/projects.yaml` and markdown description files
- Events landing page at `/events/` with four front-matter-driven event cards
- Templates review page at `/templates/` with three reusable mock layout sections for graphic/design review
- Workflow-first `/resources/` section with generated relationship panels and `/resource-graph.json`
- Shared component styling and mobile nav toggle
- Markdown stubs for top-level sections, key About pages, and resource workflow/template pages
- `Justfile` commands for local development and maintenance
- Local screenshot capture workflow for landing-page visual iteration
- Direct-upload Cloudflare Pages deployment to `https://iblcore.org/`

Not implemented yet:
- final design system
- migrated production content
- search, forms, and other richer site features

## Repo Map

- `content/`: markdown content and front matter
- `data/`: structured site data used to generate pages such as `/projects/`
- `layouts/`: Hugo templates and partials
- `assets/css/`: tokens, base styles, components, page-level CSS
- `assets/js/`: minimal progressive JavaScript
- `archetypes/`: templates for new content entries
- `docs/`: sitemap, planning notes, and legacy visual references
- `Justfile`: local workflow commands

## Quick Start

Requirements:
- Hugo extended available as `hugo`
- `just`
- `node` and `npm` if you want local screenshot capture

Start the dev server:

```bash
just serve
```

Then open `http://localhost:1313/`.

## Common Commands

```bash
just build        # build into public/
just serve        # run local dev server
just test-serve   # short-lived server startup check
just check        # fail on Hugo warnings
just validate-resources # fail on unresolved resource graph references
just capture-landing # capture desktop/mobile landing-page screenshots
just clean        # remove generated artifacts
just maintenance  # clean + validate + show git status
just cf-whoami    # verify Cloudflare auth
just pages-build  # build with the production base URL
just pages-deploy # deploy to the default Cloudflare Pages project
just pages-deploy-preview # deploy with the temporary pages.dev base URL
just pages-list   # list Pages projects
just new-news my-update
just new-event spring-school
just new-project collaboration-x
```

## Landing Screenshot Workflow

Install JS dependencies once:

```bash
npm install
npx playwright install chromium
```

Then, with the local Hugo server running, capture the landing page:

```bash
just capture-landing
```

Screenshots are written to `reports/landing/`.

## Editing Rules

- Keep the implementation Hugo-native and reusable.
- Prefer editing markdown content and front matter before creating custom templates.
- For `/projects/`, edit `data/projects.yaml` for structure and item metadata, then edit the referenced markdown files under `content/projects/descriptions/` for long-form copy.
- For `/resources/`, edit resource pages under `content/resources/`. Maintain forward relationships only in front matter; templates calculate reverse links and `/resource-graph.json`.
- See [docs/resources-maintenance.md](docs/resources-maintenance.md) before adding new tools, datasets, workflows, methods, or learning pages.
- Keep CSS modular and straightforward while the landing-page design is being tightened against the current mockup.
- Keep JS minimal and progressive.
- Do not treat the prototype screenshot as a source of truth for IA.
- For landing-page visual work, use `docs/landing-prototype-mini.webp`; the other `docs/landing*.*` files are obsolete unless explicitly requested.

## Resources Quick Guide

When adding a new resource, first decide what it is:

```text
New researcher journey      -> content/resources/workflows/<slug>.md
New dataset                 -> content/resources/datasets/<slug>.md
New software/viewer/service -> content/resources/tools/<slug>.md
New modality/protocol/method -> content/resources/methods/<slug>.md
New tutorial/quickstart     -> content/resources/learning/<slug>.md
```

Then connect it to the workflow where a researcher would actually encounter it. Search existing workflows before creating a new one:

```bash
rg "visualise|recording|neuropixels|viewephys|datoviz" content/resources/workflows
```

Example: if a new visualisation method appears for a recording-to-neural-data workflow:

1. If it is a method or approach, create `content/resources/methods/<visualisation-method>.md`.
2. If it is software, create `content/resources/tools/<visualisation-tool>.md`.
3. If users need instructions, create `content/resources/learning/<visualisation-tutorial>.md`.
4. Amend `content/resources/workflows/visualise-results.md`.
5. Also amend `content/resources/workflows/analyse-neuropixels-data.md` if the method is part of the core recording inspection path.
6. Add only forward links such as `uses`, `methods`, and `learning`; do not add `used_by`.

Run after editing:

```bash
hugo --panicOnWarning --cleanDestinationDir
just validate-resources
```

## Browser Test

1. Run `just serve`
2. Open `http://localhost:1313/`
3. Click through the top navigation
4. Confirm the prototype-driven homepage, support strip, and section pages render
5. Stop the server with `Ctrl+C`

## Cloudflare Pages Deployment

Current Pages project:
- `iblcore`

Deployment workflow:
1. Run `wrangler login` once on this machine
2. Run `just pages-deploy`
3. Verify `https://iblcore.org/`

Notes:
- This setup currently uses direct upload deployment from the local repo
- The production build uses `https://iblcore.org/` as the Hugo base URL
- The Cloudflare Pages project is named `iblcore`; its Cloudflare-assigned fallback URL is still `https://iblcore-website-preview.pages.dev/`
- Use `just pages-deploy-preview` only when deploying against the temporary `pages.dev` fallback URL
- If you later want GitHub-driven preview deployments, create a separate Cloudflare Pages project with Git integration

## Notes

- Generated output lives in `public/` and should not be committed.
- The current site is still provisional, but the homepage is now under active visual refinement against `docs/landing-prototype-mini.webp`.
- The About section IA for the current implementation is: Our Team (`/about/team/`, grouped into staff and PI scientific board with a contact prompt), History (`/about/history/`), FAQ (`/about/faq/`), and Support (`/about/support/`). `/about/` redirects to Our Team.
- The Resources section IA is: Start Here, Workflows, Datasets, Tools, Methods, and Learning. Resource front matter feeds automatic relationship panels and `/resource-graph.json`.
- `/resources/ai-assistant-guide/` provides a compact routing guide for AI assistants and automated clients.
- `/resources/developer-guide/` provides contribution guidance for developers adding Resources pages and graph relationships.
- The top navigation is: About, Resources (`/resources/`), Projects, Publications (`/#publications`), Templates (`/templates/`), Events (`/events/`), News disabled, and Contact (`/#contact`). The footer mirrors that menu and adds Legal Notice.
- See [AGENTS.md](AGENTS.md) for repository-specific instructions used by coding agents.
