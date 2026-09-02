# IBL-Core Website Sitemap v1

Status: Working baseline aligned with `docs/landing-prototype.webp` and current brainstorming decisions. Initial Hugo scaffold implemented on March 9, 2026 with minimal placeholder templates and content stubs.
Intended stack: Hugo static site generator, modern vanilla HTML/CSS, minimal vanilla JS.

## 1. Top-Level Navigation

1. Home (`/`)
2. About (`/about/team/`; `/about/` redirects here)
3. Resources (`/#resources`)
4. Projects (`/projects/`)
5. Publications (`/publications/`)
6. Events (`/events/`, disabled in navigation for now)
7. News (`/news/`)
8. Contact (`/#contact`)

## 2. Information Architecture (Detailed)

### 2.1 Home (`/`)

Sections:
- Hero (prototype-like, mostly informational)
- Mission text block
- What We Do block (expertise, modalities, tools)
- Major Publications preview
- Funders/Support strip (home + footer only)
- Footer navigation

Notes:
- Keep close to current prototype for now.
- No persistent top-right CTA in header for v1.

### 2.2 About (`/about/team/`)

Includes:
- Our Team (`/about/team/`) - staff, PI scientific board, and contact prompt
- History (`/about/history/`)
- FAQ (`/about/faq/`) - general explanation of IBL Core
- Support (`/about/support/`) - includes funding

Notes:
- `/about/` redirects to `/about/team/`; there is no separate About overview page.
- The About dropdown children are Our Team, History, FAQ, and Support.

### 2.3 Resources (`/resources/`)

- Data
  - Brainwide map — within it, access + colab tutorials
  - Other flagship datasets
  - Personal project datasets
- Modalities
  - Neuropixels
    - Chronic Neuropixels
    - Spike sorting
    - Surgical Protocols
    - IBL ephys rig
  - Mesoscope
  - Fiberphotometry
  - Widefield
  - Behavior
    - IBL behaviour rig
  - Video
- Analysis
  - Brainbox
  - Model of Zoe
- Visualisation
  - Datoviz
  - Website renderer

### 2.4 Projects (`/projects/`)

Includes:
- IBL Research Projects as the single page heading, followed by a concise overview banner explaining the mix of original projects reaching completion, shared-dataset analysis, and open tool/infrastructure development, then a static IBL Core network map and the project content
- A centered `New partner projects` CTA banner at the bottom of the page, styled like the `/new-partner-projects/` page
- New partner projects (`/new-partner-projects/`)
  - Map view is the default; the hero-positioned List/Map control switches between an interactive world view and the complete project list
  - Map view uses a concise Partner and Affiliate Projects introduction; the New Partner Projects heading and introduction appear only in List view
  - Map markers group cities within a 175 km radius and show the number of local records, using global category tokens for IBL blue Partners and IBL Core logo-pink Affiliates, with connection lines for collaborations spanning multiple geographic clusters
  - Hovering or focusing a marker previews its records; selecting it presents titles and PI portraits before opening the relevant accordion
  - Partner and Affiliate selections both expand directly below the map; the standalone Affiliate section remains part of List view only
  - In List view, the Affiliate heading and Affiliate Programme introduction share one banner
  - Both List and Map presentations end with a centered `IBL internal projects` CTA banner
  - Hover-only question-mark popovers in the legend reuse the canonical Partner introduction and Affiliate programme copy rather than duplicating it
  - Partner and Affiliate legend labels switch to List view and navigate to the corresponding section banner
  - Marker tooltips use one bullet per location and collaboration in `City: project title` format, emphasizing the city and using category-colored bullets with screen-reader labels
  - Partner and Affiliate hover entries use concise lab or collaboration names; multi-city records may define a different lab label per location
  - Map selection buttons use the concise lab or collaboration name associated with the selected city, while expanded Partner accordions retain the full project title
  - Partner-project accordions keep the IBL collaboration description primary
  - Lead investigators or project contacts appear in the closed accordion row
  - Expanded rows may add team imagery and a short, clearly separated research-group profile with reference links
  - Affiliate programme introduction and profile accordions with contact imagery, group summaries, team imagery, and reference links
- Apply to become a partner
  - FAQ to become partner - take from https://www.internationalbrainlab.com/ibl-core-apply

### 2.5 Publications (`/publications/`)

Includes:
- Our publication papers, maintained in `data/publications.yaml`
  - Fixed keywords: `major`, `science`, and `technique`
  - Date-first display with category controls that retain newest-first ordering
  - Accordion rows show title and journal/date; expanded details render authors, DOI, summary, and optional article/code/data links from the same data file
  - Button to link to publication IBL 1.0 https://www.internationalbrainlab.com/publications
- Press

### 2.6 Events

Format:
- 1 page, no subtabs

Includes:
- Upcoming events with dates, locations, information

### 2.7 News (`/news/`)

Includes:
- News updates
- Events
- Press, maintained as page bundles in `content/news/posts/` with structured source and external-link metadata

## 3. Hugo Content Model (Suggested)

### 3.1 Sections

Use one Hugo section per top-level nav item:
- `content/about/`
- `content/resources/`
- `content/projects/`
- `content/publications/`
- `content/events/`
- `content/news/`

Home:
- `content/_index.md`

Standalone pages nested under About:
- Our Team
- History
- FAQ
- Support

### 3.2 Example File Tree

```text
content/
  _index.md
  about/
    _index.md  # redirect to team.md
    team.md
    history.md
    faq.md
    support.md
  resources/
    _index.md
    data.md
    modalities.md
    analysis.md
    visualisation.md
  projects/
    _index.md
  publications/
    _index.md
  events/
    _index.md
  news/
    _index.md
    posts/
      2026-03-example-update.md
```

### 3.3 Archetypes (Minimal set)

Add archetypes for repeatable content:
- `archetypes/news.md`
- `archetypes/project.md` (if project entries become individual pages later)
- `archetypes/publication.md` (if publications become structured entries)

## 4. Template Strategy (Design + Reuse)

Build a small set of reusable Hugo layouts:

1. `layouts/_default/baseof.html`
2. `layouts/partials/header.html`
3. `layouts/partials/footer.html`
4. `layouts/index.html` (home, prototype-driven)
5. `layouts/_default/single.html` (generic content page)
6. `layouts/_default/list.html` (section landing/list)

Generic content page should provide:
- Standard hero/title block
- Optional intro/lead text
- Main rich content body
- Optional side navigation for subsections

Implementation status on March 9, 2026:
- Base layout, header, footer, home layout, list layout, and single layout have been scaffolded.
- Styling is intentionally provisional and should be replaced with the actual design system later.
- The current homepage includes explicit placeholders for the future prototype-driven hero and supporting blocks.

## 5. CSS/JS Architecture (Vanilla-first)

CSS approach:
- `assets/css/tokens.css` (color, spacing, typography variables)
- `assets/css/base.css` (reset + global element styles)
- `assets/css/components.css` (cards, nav, buttons, grids)
- `assets/css/pages/home.css` (home/prototype-specific)
- `assets/css/pages/content.css` (generic content pages)

JS approach (minimal):
- `assets/js/main.js` only for interactions that CSS cannot cover:
  - mobile nav toggle
  - optional small carousel/slider for news if needed

Avoid JS frameworks unless a hard requirement appears.

## 6. Porting Plan: PNG -> HTML/CSS

Goal:
- Translate `docs/landing-prototype.webp` into maintainable components, not pixel-locked one-off code.

Method:
1. Identify visual blocks in prototype:
   - header/nav, hero, intro, resource cards, news cards, funders strip, footer.
2. Implement each block as a partial/component.
3. Match spacing/typography/colors at section level first.
4. Refine details in a second pass (icons, gradients, card radii, hover states).
5. Keep responsive behavior explicit (desktop + mobile breakpoints early).

## 7. LLM/Codex-Heavy Workflow

To maximize LLM-assisted execution:

1. Define component contracts in markdown:
   - expected HTML structure
   - modifier classes
   - responsive behavior
2. Generate first-pass HTML/CSS per component with Codex.
3. Run quick visual QA and tighten only mismatches.
4. Keep prompts scoped per component, not entire site at once.
5. Reuse a "generic content page" template so most interior pages are content-only edits.

Recommended order:
1. Home shell + base styles
2. Header/footer partials
3. Resource/news cards
4. Generic content template
5. Section pages populated from markdown

Implementation note as of June 1, 2026:
- `/about/` redirects to `/about/team/`; the custom "Who We Are" overview page has been removed from the live IA.

Implementation note as of August 21, 2026:
- `/publications/` is the canonical Publications navigation destination.
- Publication records, dates, and the fixed keyword list are maintained in `data/publications.yaml`; the homepage renders records tagged `major` from the same source.

## 8. Editorial and Migration Checklist

From old site -> new site:

Port first:
- Resources (data, modalities, analysis, visualisation)
- Projects
- Publications and impact references
- Team and core about content

Then reframe:
- Old IBL-Core section content redistributed into About/Projects/Join Us.
- Press into News.

Validation checks:
- Every nav item has a landing page.
- No orphan page without nav/footer path.
- Contact paths work (form + direct channels).
- News taxonomy supports both events and press tags.

## 9. Open Decisions for v2

- Whether to split Projects into individual entries later.
- Analytics method for tool usage feedback (form/poll design).

## 10. Execution Next Steps (Practical)

1. Scaffold Hugo baseline:
   - `hugo.yaml`
   - `content/` sections from this sitemap
   - `layouts/_default/` and `layouts/partials/`
   - `assets/css/` and `assets/js/`
2. Implement global skeleton:
   - `baseof.html`
   - shared `header.html` and `footer.html`
   - generic `single.html` and `list.html`
3. Port home prototype incrementally:
   - hero + intro
   - highlight resources
   - news cards
   - funders strip
4. Create markdown stubs for all agreed pages/subpages.
5. Migrate old-site content into the new page buckets.
6. Verify responsive behavior and fix accessibility basics (headings, contrast, alt text, focus states).
7. Track pending IA/design changes under this doc as `v2` notes.
