# AGENTS.md

Project instructions for future Codex runs in this repository.

## Project Goal

Build the new IBL-Core website as a Hugo static site, using modern vanilla HTML/CSS and minimal vanilla JS.  
Primary short-term goal: translate `docs/landing-prototype.png` into reusable templates/components and align with `docs/sitemap-v1.md`.

## Source of Truth

1. `docs/sitemap-v1.md` (IA, page scope, implementation direction)
2. `docs/brainstorming.md` (strategy context)
3. `docs/landing-prototype.png` (visual baseline for landing page)

When in conflict, follow the sitemap decisions unless the user explicitly revises them.

## Locked IA Decisions (v1)

- Top nav:
  1. Home
  2. About
  3. Resources
  4. Projects & Partners
  5. Publications
  6. Join Us
  7. News
  8. Contact
- `About` contains Team + FAQ + Governance & Policies.
- `News` contains Events + Press.
- `Resources` contains Data/Software/Hardware only.
- Tutorials/docs must be attached to Data, Software, or Hardware.
- `Projects & Partners` remains one combined section/page.
- `Join Us` is careers-first, with partner redirect to Projects & Partners.
- Funders/support appears on home/footer only.
- No persistent global CTA in header for now.

## Implementation Constraints

- Use Hugo-native structure (`content/`, `layouts/`, `assets/`, `archetypes/`).
- Prefer reusable partials over one-off page markup.
- Keep JS minimal and progressive; avoid framework dependencies unless requested.
- Keep CSS modular: tokens/base/components/page-level styles.
- Preserve responsive behavior on desktop and mobile from the beginning.

## Design and Porting Workflow

When porting the PNG prototype:
1. Break the page into sections (header, hero, intro, resources, news, funders, footer).
2. Implement semantic HTML first.
3. Implement layout and spacing.
4. Apply colors, gradients, and visual polish.
5. Add minimal interactions only where needed.

Avoid pixel-perfect overfitting that makes templates hard to maintain.

## Content and Migration Workflow

- Prioritize migration in this order:
  1. Resources
  2. Projects & Partners
  3. Publications
  4. About
  5. Join Us
  6. News
  7. Contact
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

