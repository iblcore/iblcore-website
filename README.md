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

If another document conflicts with the sitemap, update the sitemap first or follow the sitemap as-is.

## Current State

Implemented:
- Hugo config in `hugo.yaml`
- Hugo-native structure in `content/`, `layouts/`, `assets/`, and `archetypes/`
- Shared base templates for home, list, and single pages
- Prototype-driven landing page with custom home layout and page-level CSS
- Custom-designed `/about/` Who We Are page with reusable shared header/footer and an optimized hero image workflow via Hugo assets
- Data-driven `/projects/` section powered by `data/projects.yaml` and markdown description files
- Shared component styling and mobile nav toggle
- Markdown stubs for top-level sections and key About/Resources pages
- `Justfile` commands for local development and maintenance
- Local screenshot capture workflow for landing-page visual iteration

Not implemented yet:
- final design system
- migrated production content
- deployment pipeline
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
just capture-landing # capture desktop/mobile landing-page screenshots
just clean        # remove generated artifacts
just maintenance  # clean + validate + show git status
just cf-whoami    # verify Cloudflare auth
just pages-build  # build with the default Cloudflare Pages URL
just pages-deploy # deploy to the default Cloudflare Pages project
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
- Keep CSS modular and straightforward while the landing-page design is being tightened against the current mockup.
- Keep JS minimal and progressive.
- Do not treat the prototype screenshot as a source of truth for IA.
- For landing-page visual work, use `docs/landing-prototype-mini.webp`; the other `docs/landing*.*` files are obsolete unless explicitly requested.

## Browser Test

1. Run `just serve`
2. Open `http://localhost:1313/`
3. Click through the top navigation
4. Confirm the prototype-driven homepage, support strip, and section pages render
5. Stop the server with `Ctrl+C`

## Temporary Cloudflare Pages Deployment

Current temporary Pages project:
- `iblcore-website-preview`

Deployment workflow:
1. Run `wrangler login` once on this machine
2. Run `just pages-deploy`
3. Share either the stable project URL `https://iblcore-website-preview.pages.dev/` or the deployment-specific URL printed by Wrangler

Notes:
- This setup currently uses direct upload deployment from the local repo
- It is suitable for provisional sharing
- If you later want GitHub-driven preview deployments, create a separate Cloudflare Pages project with Git integration

## Notes

- Generated output lives in `public/` and should not be committed.
- The current site is still provisional, but the homepage is now under active visual refinement against `docs/landing-prototype-mini.webp`.
- The About section IA for the current implementation is: Who We Are (`/about/`), Team (`/about/team/`), FAQ (`/about/faq/`), and Funding (`/about/funding/`).
- See [AGENTS.md](AGENTS.md) for repository-specific instructions used by coding agents.
