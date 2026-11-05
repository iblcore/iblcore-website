@AGENTS.md

Claude Code must follow the agent-assisted website editing workflow in
`docs/editing-guide.md` for ordinary website-edit requests.

## Lean edits

Apply these to every website-edit request, alongside `docs/editing-guide.md`, to
reduce token use without changing what gets delivered.

- **Batch clarifying questions.** Work out everything ambiguous before asking,
  then ask it all in one round rather than across separate turns.
- **Skip preview for text-only edits.** For pure copy, wording, dates, names, or
  link text with no layout effect, verify with `just check` and by reading the
  changed file; do not start `just preview`. Still end with the approval prompt.
  Use the local preview only for changes that affect layout, structure, or
  appearance.
- **Separate structure from polish.** When a request asks only for structural or
  content changes (new sections, nav items, copy, page reorganization), do only
  that, even if it looks inconsistent with the site. Add no CSS or visual styling
  unless asked; if styling seems needed, say so and let the user request it
  separately.
