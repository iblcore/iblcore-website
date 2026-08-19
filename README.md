# IBL-Core Website

The source code and content for the IBL-Core website at
[iblcore.org](https://iblcore.org/). The site is built with Hugo, vanilla HTML
and CSS, and minimal JavaScript.

## Start here

Choose the guide that matches what you want to do:

- **Update the website:** read
  [How to update the IBL-Core website](docs/editing-guide.md). This is the
  recommended starting point for IBL colleagues and includes an agent-assisted
  workflow that does not require web-development experience.
- **Set up a colleague's computer:** follow the
  [one-time workstation setup](docs/workstation-setup.md).
- **Contribute code or work manually:** read [CONTRIBUTING.md](CONTRIBUTING.md).
- **Maintain publishing and hosting:** read
  [Deployment administration](docs/admin-deployment.md).

Website changes normally use a pull request. GitHub builds a complete temporary
preview for review, and an approved merge automatically publishes the change.
Contributors do not need Cloudflare credentials.

## Developer quick start

Requirements:

- Hugo Extended 0.164.0 or a compatible version
- `just`
- Node.js 20 or newer for the cross-platform preview helper and Playwright
  tooling

Start the development server:

```bash
just serve
```

Open <http://localhost:1313/>. Validate the site with:

```bash
just check
```

Run `just --list` to see the other available maintenance, content, screenshot,
and administrator commands.

`just preview "/page/path/"` starts Hugo, prints a clickable URL, and attempts to
open that local page. It is primarily used by agents during the colleague
editing workflow.

## Repository map

- `content/`: Markdown pages and their metadata
- `data/`: structured information such as projects and team data
- `layouts/`: Hugo templates and reusable partials
- `assets/css/`: tokens, base, component, and page styles
- `assets/js/`: progressive JavaScript
- `archetypes/`: templates for new content entries
- `docs/`: editing, architecture, strategy, and administration guides
- `.github/workflows/`: validation, preview, and production automation
- `Justfile`: common local commands

## Project direction

[docs/sitemap-v1.md](docs/sitemap-v1.md) is the source of truth for navigation,
page scope, content hierarchy, Hugo structure, and migration priorities.
[docs/brainstorming.md](docs/brainstorming.md) provides strategy context.

For landing-page visual work, use `docs/landing-prototype-mini.webp` as the
temporary reference. Other `docs/landing*.*` files are obsolete unless a task
explicitly says otherwise.

See [AGENTS.md](AGENTS.md) for repository-specific instructions used by coding
agents.
