# AGENTS.md

Project instructions for future Codex runs in this repository.

## Project Goal

Build the new IBL-Core website as a Hugo static site, using modern vanilla HTML/CSS and minimal vanilla JS.  
Primary short-term goal: implement the site from `docs/sitemap-v1.md` using reusable templates/components.

## Source of Truth

1. `docs/sitemap-v1.md` (single source of truth for IA, page scope, and implementation direction)
2. `docs/brainstorming.md` (strategy context)
3. `docs/landing-prototype-mini.webp` (current temporary landing-page visual reference)

When in conflict, follow the sitemap decisions unless the user explicitly revises them.

For landing-page visual work, treat the other `docs/landing*.*` files as obsolete unless the user explicitly asks to use them.

## IA Rule

Do not restate or reinterpret the sitemap in this file. Use `docs/sitemap-v1.md` directly for:
- top navigation
- page and section names
- content scope
- content hierarchy
- Hugo content structure decisions

## Implementation Constraints

- Use Hugo-native structure (`content/`, `layouts/`, `assets/`, `archetypes/`).
- Prefer reusable partials over one-off page markup.
- Keep JS minimal and progressive; avoid framework dependencies unless requested.
- Keep CSS modular: tokens/base/components/page-level styles.
- Preserve responsive behavior on desktop and mobile from the beginning.

## Design and Porting Workflow

When implementing from the sitemap:
1. Break the page into sections (header, hero, intro, resources, news, funders, footer).
2. Implement semantic HTML first.
3. Implement layout and spacing.
4. Apply colors, gradients, and visual polish.
5. Add minimal interactions only where needed.

Avoid pixel-perfect overfitting that makes templates hard to maintain.

## Content and Migration Workflow

- Follow the migration priorities and section mapping defined in `docs/sitemap-v1.md`.
- Keep copy concise and scannable.
- Keep partner and career paths clear and separate in messaging.

## Expected Deliverables Per Coding Session

- If changing IA/content structure:
  - Update `docs/sitemap-v1.md`.
  - Reflect key changes in `README.md`.
  - Update `static/llms.txt` when public canonical pages or navigation
    destinations change.
- If creating templates:
  - Ensure Hugo layouts/partials are reusable and documented.
- If adding style system:
  - Keep tokens centralized and class naming consistent.

## Practical Defaults

- Use ASCII unless existing files require Unicode.
- Prefer small, reviewable commits/patches.
- Run lightweight checks/build commands when available before finishing.

## Contributor Publishing Workflow

- Follow `docs/editing-guide.md` for agent-assisted website edits and
  `CONTRIBUTING.md` for the shared publishing lifecycle and manual workflow.
- Treat a short ordinary-language request such as "change this text" as enough
  to start the complete agent-assisted workflow. Do not require the user
  to mention Git, branches, Hugo, previews, diffs, commits, or pull requests.
- Unless the user explicitly asks for a manual workflow, the agent owns the
  technical process below.

### Computer setup requests

- If a user asks to set up a computer for website editing, follow
  `docs/setup.md` and run `node scripts/check-contributor-setup.mjs`.
- Guide the user through missing items one at a time. Prefer browser-based
  `gh auth login --web --git-protocol https`; never ask the user to paste a
  GitHub token into chat or an agent prompt.
- Verify that `gh auth status` identifies the user's own account and that
  the setup checker confirms repository write access before declaring setup
  complete.
- Do not begin a website edit until the checker passes, unless the user
  explicitly chooses to continue with a known limitation.

### Before approval

1. Run `node scripts/check-contributor-setup.mjs` before starting the edit. If it
   passes, continue without asking the user about setup. If it fails, tell them
   this computer needs a one-time setup, switch to the computer setup
   workflow above, and guide them through each missing item. Resume the original
   edit automatically after the check passes.
2. Inspect the repository and locate the affected content. Ask a question only
   when essential content or intent cannot be inferred safely.
3. Preserve unrelated work. From a clean, current `main`, create a focused
   branch automatically. Never make the user manage branches or commands.
4. Implement only the requested change and run `just check`.
5. Start the local preview with `just preview "/affected/path/"`. This command
   prints a clickable local URL, attempts to open it in the default browser, and
   keeps Hugo running. If the browser does not open, the printed URL is the
   fallback.
6. Give the user the clickable local URL again, say what to inspect, and
   mention that they can click it if the browser did not open. Do not make them
   request a diff or the next workflow step. End with: "Type `approve` if this
   looks right, or tell me what you would like changed."
7. If the user requests changes, update the same branch, rerun the check,
   and reopen or refresh the preview. Repeat until they approve.

Do not commit, push, or create a pull request before the user approves the
local result. Their message `approve` is explicit authorization for the
post-approval steps below.

### After approval

1. Stop the local preview server when practical. Review the complete diff,
   exclude unrelated files, and run `just check` again.
2. Commit only the approved change, push the branch, and open a pull request
   ready for review (not a draft).
3. Complete **What changed** and **Where to look** with exact page paths and
   concrete review instructions. Include screenshots when they materially help
   an administrator review a visual change; do not ask the user to create
   or upload them.
4. Wait for the pull-request build and preview deployment. Verify that both pass
   and that the automatic preview comment exists. Repair failures that are
   within the scope of the requested change.
5. Do not merge the pull request. End with a simple handoff such as: "Thank you
   - your change is ready. An administrator will now review and publish it."
   The PR URL may be included for reference, but do not give the user more
   tasks unless something genuinely blocks administrator review.
