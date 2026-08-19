# Editing and publishing the IBL-Core website

Website changes follow the same safe path whether you edit files yourself or ask
an agent such as Claude Code or Codex to help:

1. Create a branch for the change.
2. Edit and preview the website locally.
3. Review the diff, commit, and push the branch.
4. Open a pull request (PR).
5. Review the automatic website preview and screenshots.
6. An administrator approves and merges the PR; the live site then deploys
   automatically.

Production Cloudflare credentials are not needed on contributor computers.

## First-time setup

Install Git, Hugo Extended 0.164.0 or a compatible version, and `just`. Install
GitHub CLI (`gh`) if you want to create PRs from the terminal. Clone this
repository, then check your tools:

```bash
just doctor
gh auth login
```

Node.js and `npm install` are only required for automated local screenshots.

## Make a change manually

Start from the latest website and create a clearly named branch:

```bash
git switch main
git pull --ff-only
git switch -c edit/short-description
just serve
```

Open <http://localhost:1313/>. Hugo refreshes the browser after saved changes.
Edit Markdown in `content/`, structured information in `data/`, and only edit
templates or styles when the change requires it.

Before publishing, stop the server with `Ctrl+C`, then review and validate:

```bash
git diff
just check
git status --short
```

Commit, push, and create a PR:

```bash
git add path/to/the/files-you-changed
git commit -m "Describe the website change"
git push -u origin HEAD
gh pr create --draft --web
```

In the PR, explain the change and complete **Where to look** with affected page
paths and review instructions. Add desktop and mobile screenshots for visual
changes. Automation adds a comment linking to a temporary version of the entire
website. The preview is updated after every push to the branch.

When the checks pass and the preview looks right, mark the PR ready for review.
Merging into `main` deploys the change to <https://iblcore.org/>.

## Work with an agent

Give the agent the desired outcome and enough source material to avoid guessing.
For example:

> Update the support page with the attached text. Keep its current design. Show
> me the local page and explain the diff. Do not commit until I approve it. Once
> approved, commit, push, and open a draft PR. In the PR, link reviewers to the
> affected page and include desktop and mobile screenshots.

The agent should follow `AGENTS.md` and this document. Ask it to:

- create a branch rather than edit `main`;
- preserve unrelated local changes;
- run `just check`;
- serve the site locally and tell you the page URL;
- summarize the diff in plain language before committing;
- identify the exact pages reviewers should inspect;
- add screenshots when the result is visual;
- open a draft PR and return both the PR and preview links.

You remain responsible for approving the wording and visual result. An agent
should not merge its own PR unless an administrator explicitly requests it.

## Review a pull request

1. Read **What changed** and **Where to look** in the PR description.
2. Open the preview link posted by the deployment bot.
3. Visit each listed path and check desktop and mobile widths.
4. Compare screenshots when provided.
5. Review the Files changed tab, or ask an agent to explain the diff.
6. Approve and merge only after the required checks pass.

See `docs/admin-deployment.md` for repository and Cloudflare configuration.
