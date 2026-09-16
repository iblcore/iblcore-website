# Contributing to the IBL-Core website

For a plain-language, agent-assisted process, start with
[How to update the IBL-Core website](docs/editing-guide.md).

## Choose a publishing route

Choose before beginning an edit:

- **Shared development:** use `dev` when changes are related, coordinated, or
  intended to be published together. Approved work is collected in the shared
  `dev` to `main` pull request.
- **Direct review:** use a focused branch and a direct pull request to `main`
  for a small, self-contained, or urgent change.

Keep using the selected route for the change. After a direct PR merges, bring
the latest `main` into `dev` before beginning the next shared-development edit.

## Shared-development lifecycle

Most team changes follow the same path:

1. Update `dev` from the latest `origin/dev`.
2. Make the change and preview it locally.
3. Review the diff and run `just check`.
4. Commit and push `dev`.
5. Update the shared `dev` to `main` pull request. Agent-assisted changes are
   pushed after the user approves the local preview.
6. Review the automatic Cloudflare preview and the pages listed under
   **Where to look** in the PR description.
7. An administrator approves and merges the PR when the team is ready to
   publish the collected changes.
8. GitHub Actions publishes the merged version to
   [iblcore.org](https://iblcore.org/).

Contributors do not need Cloudflare access. `dev` and its PR never change the
live website; production changes only when a commit reaches `main`.

## Manual workflows

Install Git, Hugo Extended 0.164.0 or a compatible version, `just`, and Node.js
20 or newer. Install GitHub CLI (`gh`) if you want to open PRs from the terminal.

For shared development:

```bash
git switch dev
git pull --ff-only origin dev
git fetch origin main
git merge origin/main
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

Stage only the intended files, commit, and push the shared development branch:

```bash
git add path/to/changed-file
git commit -m "Describe the website change"
git push origin dev
```

Update the existing `dev` to `main` PR's **What changed** and **Where to look**
sections. Give exact page paths and concrete review instructions. Include
desktop and mobile screenshots when they help explain a visual change.

For unusually large or risky work, create a focused feature branch from `dev`
and merge it into `dev` after review. Do not merge that branch directly into
`main`.

For direct review, begin from the latest `main` instead:

```bash
git switch main
git pull --ff-only origin main
git switch -c edit/short-description
just serve
```

After checking and committing the intended files, push the branch and open its
own PR to `main`:

```bash
git push -u origin HEAD
gh pr create --web --base main
```

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
