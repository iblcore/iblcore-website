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

Project and affiliate records are maintained in `data/projects.yaml`. The
`/new-partner-projects/` layout uses reusable profile and research-group
partials; the record fields and layout variants are documented in
`docs/project-record-schema.md`. Stable `issue-###` IDs come from the GitHub
issue number in the Project Management export and are reused by List, Map, and
accordion rendering. Partner records also store one or more city coordinates for the
page's List/Map switcher, with Map as the default view. The map clusters Partner and Affiliate records by
geographic proximity (within 175 km), uses IBL blue for Partners and the IBL Core logo pink for Affiliates, and draws connections between cities belonging
to the same collaboration, and uses locally pinned D3,
TopoJSON, and Natural Earth-derived world geometry under `static/vendor/` and
`static/data/`. Map selections open both Partner and Affiliate accordions directly
beneath the map; the standalone Affiliate card grid is shown only in List view.
The Partners and Affiliates heading is grouped with its shared introduction
banner in both List and Map views. The List/Map control sits beside the results,
with the All/Partners/Affiliates filter directly alongside it.
The main banner supplies the active category title and introduction, so List
view does not repeat a separate Affiliate banner above the Affiliate cards.
The centered `IBL internal projects` CTA banner appears only for List + All;
the button opens `/projects/` at the top of the internal-projects page.
The responsive main banner reserves the height of its longest category copy so
All, Partners, and Affiliates switch without a layout jump. Shared content-page copy is included with the reusable
`shared-markdown` shortcode; the Partner overview lives at
`content/projects/descriptions/partners-overview.md`, while the Partners-only
filter copy lives at
`content/projects/descriptions/partner-category-overview.md`.
The Partners and Affiliates filters update either view without changing the
selected List/Map mode. Category selection updates the main page banner title
and copy instead of adding another banner below the map; project choices in Map
view appear only after a city marker is selected.
Marker tooltips list one bullet per location and collaboration in the concise
`City: project title` format. City names are emphasized, while each bullet uses
the global Partner or Affiliate category color and exposes the category to
screen readers.
Affiliate map labels come from each record's concise `map_title`, using only a
lab or collaboration name rather than an individual person's name.
Partner hover labels follow the same convention, with optional location-level
overrides when a multi-city project connects different labs. Map selection
buttons use the lab associated with the selected city; full project titles remain
in the expanded accordions.
Partner and Affiliate colors are defined once as site-wide category tokens in
`assets/css/tokens.css` and referenced by all map treatments.
Keep the complete project title in the card heading, omit redundant
prefixes such as `Project:`, and center lead portraits in the right-hand
research-group column with names, institutions, and cities underneath. Partner
rows omit a separate PI line when the portrait caption already identifies that
person. Expanded Partner cards retain the `Research group` label without
repeating the lab name and institution beneath it. The Affiliate section uses
square lead-portrait tiles rather than repeating a lab heading; co-led
collaborations may show both leads, and an open tile spans the grid for its
summary, links, and team imagery. The title column ends where the expanded
card's research-group divider begins.
Affiliate reference buttons sit centered directly below the PI portrait area
in expanded cards. One-to-one reference sets align to their corresponding PI
portrait columns; a shared reference for a two-person collaboration remains
centered between both portraits.
Portrait and reference columns must use the same centralized Affiliate column
width and gap variables so this alignment remains exact in both List and Map
accordions.
Profile grids derive their columns automatically from the available width,
keeping two-person groups side by side without project-specific CSS.
For the Hantman Lab, Adam Hantman is the lead portrait and Kevin Cross appears
beside the lab image inside the expanded accordion as the IBL Core correspondent.
Expanded cards keep the IBL collaboration copy separate from concise lab
details, sources, and team imagery. Optimized project images are stored under
`static/images/new-partners/`. Accordion typography uses normal title casing
and a compact, consistent type scale across headings, body copy, and metadata.
Affiliate portrait circles match the Partner portrait size, and expanded-card
imagery uses a non-cropping fit so the complete supplied image remains visible.
Multi-lead consortium tiles may use a 2-by-2 portrait arrangement. A single
Partner expanded-card image fills the width of its content column.
Affiliate team imagery uses one shared compact frame width and a non-cropping
4:3 presentation so portrait and landscape source photos remain similarly sized
without removing anyone near an image edge.
When a consortium is better identified by its shared name, the closed tile may
use that name as its main title and move member portraits into the expanded
panel.
Team portraits are assigned to their Partner group in `data/projects.yaml` and
render in a centered grid above separately classified science and lab media.
Consortium summaries and reference links should prefer authoritative funding or
institutional project records when available.
ARC keeps exactly one authoritative reference per consortium member, ordered to
align with the four portrait columns.
Closed accordion rows use compact vertical spacing, and Affiliate portrait
tiles use a tighter five-column grid on wide screens.
One-to-one Affiliate reference sets use the same automatic fixed-width grid as
their PI portraits, keeping each button centered beneath its corresponding image.
Partner rows share a consistent desktop height. Co-PI portraits have added
horizontal separation, and institution-city captions remain on one line until
the responsive layout stacks.
Named team-member portraits inside expanded accordions use the same circular
dimensions and pale-blue ring as lead PI portraits; project and lab images
remain rectangular.

The `/projects/` page uses the single page title `IBL Core projects`,
followed by a concise internal-projects overview banner and the project content.
Its centered `New partner projects` CTA is presented in a matching banner at
the bottom of the page. Its static IBL Core network map can be enabled with the
page-level `show_network_map` parameter; it is currently hidden.

News and press entries are maintained as page bundles in `content/news/posts/`
and are published through `/news/`.

For landing-page visual work, use `docs/landing-prototype-mini.webp` as the
temporary reference. Other `docs/landing*.*` files are obsolete unless a task
explicitly says otherwise.

See [AGENTS.md](AGENTS.md) for repository-specific instructions used by coding
agents.
