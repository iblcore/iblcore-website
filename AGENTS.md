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
- If creating templates:
  - Ensure Hugo layouts/partials are reusable and documented.
- If adding style system:
  - Keep tokens centralized and class naming consistent.

## Practical Defaults

- Use ASCII unless existing files require Unicode.
- Prefer small, reviewable commits/patches.
- Run lightweight checks/build commands when available before finishing.
