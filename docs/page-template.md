# Shared page template

All public interior pages use `layouts/partials/page-header.html`. The homepage
retains its landing-page composition. The shared header renders a white title
over the page image, followed by an optional translucent dark-blue introduction
with white text. It never places the title inside the introduction.

## New pages

The default single and list layouts already call the header. Create a Markdown
page with a title, optional `banner_intro`, and body text. No page-specific CSS
or layout is needed. `lead` is supported as a fallback introduction in the
default layouts. Omit both fields if no introduction is needed.

```yaml
---
title: "Page title"
banner_intro: "A short introduction to this page."
backdrop_image: "/images/team/ibl-brain.webp"
---
```

The brain image is the default; `backdrop_image` is an optional image override.
The default archetype includes `banner_intro` and the shared navigation/footer
variants. Page images do not change banner colors or text styles.

Optional `banner_buttons` render centered beneath the introduction on the same
dark-blue background as the map section, with equal space above and below:

```yaml
banner_buttons:
  - label: "Explore projects"
    url: "/projects/"
```

## Specialized layouts

Call the header once, before the page's content:

```go-html-template
{{ partial "page-header.html" (dict "page" . "intro" .Content) }}
```

Arguments: `page` (required Hugo page), `title` (optional override), `intro`
(optional rendered HTML; an explicit empty string hides the banner), and
`intro_id` (optional stable anchor). Without `intro`, the partial renders
`banner_intro` or `lead` as Markdown. Only pass trusted, Hugo-rendered content.

Partners additionally uses `project_title: true` to retain the title hook used
by the category filters. `new-partners/introduction.html` supplies its changing
category copy; the common header owns its banner markup and appearance.

## One styling source

- `assets/css/pages/content.css` owns header layout, title typography, intro
  spacing, background treatment, `.page-controls`, and CTA bars.
- `assets/css/tokens.css` owns `--color-page-intro-*`, `--page-intro-*`,
  `--color-page-controls-bg`, and `--page-buttons-pad-y`. The intro uses the
  dark-blue fill at 82% opacity with white text and blur over the page backdrop.
  Adjust these tokens for site-wide changes.
- `assets/css/components/segmented-control.css` owns pill buttons, their active,
  hover, focus, disabled, and category-dot states. Use `.segmented-control` and
  `.segmented-control__button` for any new view or category switch.

Place view/filter buttons inside `.page-controls` with a
`.shell.page-shell.page-controls__inner` wrapper for the shared dark-blue bar.
Use `aria-pressed` to communicate selection. Keep category-specific colors on
the dots. CTA links use `.button.button--page-cta` within `.section-cta`.
Do not add page-specific copies of these styles.

Both view/filter bars and CTA bars use the same centered, wrapping button
layout and vertical padding. Specialized headers can also pass `buttons`
(a list of `label`/`url` records) to override `banner_buttons`.

Pages retain their own content layouts (maps, cards, accordions, lists).
