# Contributing to the IBL-Core website

For a plain-language, agent-assisted process, start with
[How to update the IBL-Core website](docs/editing-guide.md).

## Publishing lifecycle

Most changes follow the same path:

1. Create a focused branch from the latest `main`.
2. Make the change and preview it locally.
3. Review the diff and run `just check`.
4. Commit and push the branch.
5. Open a pull request (PR). Agent-assisted changes are marked ready for review
   after the user approves the local preview.
6. Review the automatic Cloudflare preview and the pages listed under
   **Where to look** in the PR description.
7. An administrator approves and merges the PR.
8. GitHub Actions publishes the merged version to
   [iblcore.org](https://iblcore.org/).

Contributors do not need Cloudflare access. A branch or PR never changes the
live website; production changes only when a commit reaches `main`.

## Manual workflow

Install Git, Hugo Extended 0.164.0 or a compatible version, `just`, and Node.js
20 or newer. Install GitHub CLI (`gh`) if you want to open PRs from the terminal.

```bash
git switch main
git pull --ff-only
git switch -c edit/short-description
just serve
```

Open <http://localhost:1313/> and make the change. Hugo refreshes the page after
saved edits. When finished, stop the server with `Ctrl+C`, then validate and
review:

```bash
just check
git diff
git status --short
```

Stage only the intended files, commit, push, and open a draft PR:

```bash
git add path/to/changed-file
git commit -m "Describe the website change"
git push -u origin HEAD
gh pr create --draft --web
```

Complete **What changed** and **Where to look** in the PR template. Give exact
page paths and concrete review instructions. Include desktop and mobile
screenshots when they help explain a visual change.

## Implementation conventions

- Treat `docs/sitemap-v1.md` as the source of truth for information
  architecture and page scope.
- Prefer Markdown and existing structured data for content changes.
- Keep templates reusable, CSS modular, and JavaScript minimal.
- Preserve responsive behavior from the beginning.
- Do not commit generated `public/` or `resources/` output.
- Preserve unrelated changes in the working tree.

Repository administrators should read
[Deployment administration](docs/admin-deployment.md) before changing GitHub or
Cloudflare configuration.
