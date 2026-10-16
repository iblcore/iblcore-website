# Contributing to the IBL-Core website

For a plain-language, agent-assisted process, start with
[How to update the IBL-Core website](docs/editing-guide.md).

## Publishing lifecycle

Every ordinary change starts on a focused branch from the latest `main` and
gets its own pull request to `main`. Keep using that branch for revisions.

1. Update a clean `main` from the latest `origin/main` and create a focused
   branch. Preserve any unrelated work before switching branches.
2. Make the change and preview it locally.
3. Review the diff and run `just check`.
4. Commit and push the focused branch. For agent-assisted changes, the user
   approves the local preview before the agent commits or pushes.
5. Open a pull request to `main` with **What changed** and **Where to look**
   sections listing exact page paths and concrete review instructions.
6. Verify the automatic build and Cloudflare preview pass, and review the
   affected pages in that preview.
7. An administrator approves and merges the PR when the change is ready to
   publish. Agents do not merge without explicit authorization.
8. GitHub Actions publishes the merged version to
   [iblcore.org](https://iblcore.org/).

Contributors do not need Cloudflare access. Branches and pull requests provide
previews; production changes only when a commit reaches `main`.

## Manual workflow

Install Git, Hugo Extended 0.164.0 or a compatible version, `just`, and Node.js
20 or newer. Install GitHub CLI (`gh`) if you want to open PRs from the terminal.

Begin from a clean working tree and the latest `main`:

```bash
git switch main
git pull --ff-only origin main
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

Stage only the intended files, commit, push the focused branch, and open its
pull request to `main`:

```bash
git add path/to/changed-file
git commit -m "Describe the website change"
git push -u origin HEAD
gh pr create --web --base main
```

Complete the PR's **What changed** and **Where to look** sections. Give exact
page paths and concrete review instructions. Include desktop and mobile
screenshots when they help explain a visual change. Wait for the build and
preview deployment, and inspect the automatic preview before handing the PR
to an administrator for review.

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
