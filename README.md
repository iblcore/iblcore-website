# IBL-Core Website

The source code and content for the IBL-Core website at
[iblcore.org](https://iblcore.org/). The site is built with Hugo, vanilla HTML
and CSS, and minimal JavaScript.

## Start here

Choose the guide that matches what you want to do:

- **Update the website:** read
  [How to update the IBL-Core website](docs/editing-guide.md). This is the
  recommended starting point for IBL members and includes an agent-assisted
  workflow that does not require web-development experience.
- **Set up your computer:** follow the optional
  [one-time setup details](docs/setup.md). The agent normally guides this setup
  automatically.
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
open that local page. It is primarily used by agents during the website editing
workflow.

## Repository map

- `content/`: Markdown pages and their metadata
- `content/news/posts/`: page bundles for news, events, and press coverage
- `data/`: structured information such as projects, publications, and team data
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

The site exposes a curated agent-readable index at `/llms.txt`. See
[Agent-readable website content](docs/agent-readable-content.md) for its scope
and validation policy.

Publication records and filter keywords are maintained in
`data/publications.yaml`. The homepage and `/publications/` page render from this
shared source.

News and press entries are maintained as page bundles in `content/news/posts/`
and are published through `/news/`.

For landing-page visual work, use `docs/landing-prototype-mini.webp` as the
temporary reference. Other `docs/landing*.*` files are obsolete unless a task
explicitly says otherwise.

See [AGENTS.md](AGENTS.md) for repository-specific instructions used by coding
agents.
