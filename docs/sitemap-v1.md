# IBL-Core Website Sitemap v1

Status: Working baseline aligned with `docs/landing-prototype.webp` and current brainstorming decisions. Initial Hugo scaffold implemented on March 9, 2026 with minimal placeholder templates and content stubs.
Intended stack: Hugo static site generator, modern vanilla HTML/CSS, minimal vanilla JS.

## 1. Top-Level Navigation

1. Home (`/`)
2. About (`/about/team/`; `/about/` redirects here)
3. Resources (`/#resources`)
4. Projects (`/projects/`)
5. Publications (`/#publications`)
6. Templates (`/templates/`) - internal review gallery for section layout mockups
7. Events (`/events/`)
8. News (`/news/`, disabled in navigation for now)
9. Contact (`/#contact`)

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

Resources use a workflow-first IA. The navigation tree helps humans browse; resource front matter defines the knowledge graph used to render relationships and machine-readable outputs.

Top-level Resources sections:
- Start Here (`/resources/start-here/`) - goal-based onboarding routes into workflows
- Workflows (`/resources/workflows/`) - researcher journeys that connect datasets, tools, methods, and learning
- Datasets (`/resources/datasets/`) - curated IBL datasets and access paths
- Tools (`/resources/tools/`) - software, services, viewers, and reusable infrastructure
- Methods (`/resources/methods/`) - experimental and analytical methods, rigs, protocols, and modalities
- Learning (`/resources/learning/`) - quickstarts, tutorials, Colabs, courses, FAQs, and glossary material
- Ecosystem Graph (`/resources/ecosystem/`) - Mermaid dependency graph for the core IBL repositories

Starter workflow pages:
- Explore Brainwide Map
- Analyse Neuropixels Data
- Run Behaviour Experiment
- Spike Sorting Workflow
- Anatomical Localisation
- Reproduce Publication Results
- Build Custom Analysis
- Visualise Results

Relationship rules:
- Authors maintain forward relationships only in page front matter.
- Do not maintain reverse relationships such as `used_by` manually.
- Templates compute reverse relationships automatically.
- Stable resource IDs are derived from page filenames unless a page explicitly sets `resource_id`.

Common relationship fields:
- `requires` - hard dependencies
- `uses` - resources used by a workflow or tutorial
- `datasets` - related datasets
- `methods` - related scientific or technical methods
- `learning` - tutorials, quickstarts, Colabs, courses, FAQs, or glossary pages
- `workflows` - related workflows
- `next_steps` - recommended follow-up workflows

Implementation notes:
- Resource templates live under `layouts/resources/` and `layouts/partials/resources/`.
- Resource archetypes cover workflows, tools, datasets, methods, and learning pages.
- The machine-readable graph is generated at `/resource-graph.json` from Hugo content and front matter.

### 2.4 Projects (`/projects/`)

Includes:
- List of projects ongoing
- Apply to become a partner
  - FAQ to become partner - take from https://www.internationalbrainlab.com/ibl-core-apply

### 2.5 Publications (`/publications/`)

Includes:
- Our publication papers
  - Button to link to publication IBL 1.0 https://www.internationalbrainlab.com/publications
- Press

### 2.6 Events

Format:
- 1 page, no subtabs

Includes:
- Upcoming events with dates, locations, information

Implementation note as of June 3, 2026:
- `/events/` is enabled in the top navigation and footer.
- The page uses a reusable section layout with four editable event cards defined in front matter.

### 2.7 Templates (`/templates/`)

Format:
- 1 page, no subtabs

Includes:
- internal design-review templates
- anchor navigation to alternate layout patterns
- reusable section mockups for future content pages

Implementation note as of June 5, 2026:
- `/templates/` is enabled in the top navigation for internal review.
- The page currently contains three template subsections:
  - top text + 2x2 image grid
  - editorial lead + feature/sidebar layout
  - text banner + three-column collection

### 2.8 News (`/news/`)

Includes:
- News updates
- Events
- Press

## 3. Hugo Content Model (Suggested)

### 3.1 Sections

Use one Hugo section per top-level nav item:
- `content/about/`
- `content/resources/`
- `content/projects/`
- `content/templates/`
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
    start-here/
      _index.md
    workflows/
      _index.md
      analyse-neuropixels-data.md
      explore-brainwide-map.md
    datasets/
      _index.md
      brainwide-map.md
    tools/
      _index.md
      one.md
      viewephys.md
    methods/
      _index.md
      neuropixels.md
    learning/
      _index.md
      one-quickstart.md
  resource-graph.md  # renders /resource-graph.json
  projects/
    _index.md
  templates/
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
- `archetypes/workflow.md`
- `archetypes/tool.md`
- `archetypes/dataset.md`
- `archetypes/method.md`
- `archetypes/learning.md`

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

## 8. Editorial and Migration Checklist

From old site -> new site:

Port first:
- Resources (workflow-first Start Here, Workflows, Datasets, Tools, Methods, Learning)
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
- Publication data source (manual markdown vs external bib/JSON import).
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
