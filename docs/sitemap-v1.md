# IBL-Core Website Sitemap v1

Status: Working baseline aligned with `docs/landing-prototype.png` and current brainstorming decisions.  
Intended stack: Hugo static site generator, modern vanilla HTML/CSS, minimal vanilla JS.

## 1) Top-Level Navigation

1. Home (`/`)
2. About (`/about/`)
3. Resources (`/resources/`)
4. Projects & Partners (`/projects-partners/`)
5. Publications (`/publications/`)
6. Join Us (`/join-us/`)
7. News (`/news/`)
8. Contact (`/contact/`)

## 2) Information Architecture (Detailed)

### 2.1 Home (`/`)
Purpose:
- Communicate IBL-Core identity and mission quickly.
- Drive users to key sections without forcing a CTA-heavy layout.

Sections:
- Hero (prototype-like, mostly informational)
- Intro text block
- Highlight Resources cards (Data, Software, Hardware)
- News & Updates preview
- Funders/Support strip (home + footer only)
- Footer navigation

Notes:
- Keep close to current prototype for now.
- No persistent top-right CTA in header for v1.

### 2.2 About (`/about/`)
Purpose:
- Trust and orientation for new visitors.

Subpages:
- `Mission & History` (`/about/mission-history/`)
- `Team` (`/about/team/`)
- `Governance & Policies` (`/about/governance-policies/`)
- `FAQ` (`/about/faq/`)

Content scope:
- Explain transition from IBL 1.0 to IBL-Core.
- Team roles and expertise.
- Combined governance and policy information.
- Practical FAQ for partners, users, and applicants.

### 2.3 Resources (`/resources/`)
Purpose:
- Central index for all practical assets.

Index behavior:
- Intro + 3 clear entry cards.
- Fast path for technical users.

Subpages:
- `Data` (`/resources/data/`)
- `Software` (`/resources/software/`)
- `Hardware` (`/resources/hardware/`)

Rule:
- Tutorials/docs are merged into one of these three categories.
- No separate top-level tutorials/docs section.

### 2.4 Projects & Partners (`/projects-partners/`)
Purpose:
- Show collaboration model, portfolio, and partner credibility.

Single combined page:
- Current and past projects
- Partner labs/institutions
- Outcomes and highlights
- Clear partner-oriented guidance:
  - If someone wants to work with IBL-Core, route them here first.

### 2.5 Publications (`/publications/`)
Purpose:
- Evidence and impact hub.

Includes:
- Papers
- Software citations
- Data citations
- Impact metrics (usage/reuse indicators where available)

### 2.6 Join Us (`/join-us/`)
Purpose:
- Careers-first entry point.

Includes:
- Open roles
- Talent pool / speculative applications
- Working at IBL-Core info
- Explicit redirect for collaborators:
  - "Want to become a partner? Visit Projects & Partners."

### 2.7 News (`/news/`)
Purpose:
- Time-based updates and public-facing activity.

Includes:
- News updates
- Events
- Press

### 2.8 Contact (`/contact/`)
Purpose:
- Provide both structured and direct contact paths.

Includes:
- Contact form
- Direct email
- GitHub
- Slack/Discord
- Social links

## 3) Hugo Content Model (Suggested)

## 3.1 Sections

Use one Hugo section per top-level nav item:
- `content/about/`
- `content/resources/`
- `content/projects-partners/`
- `content/publications/`
- `content/join-us/`
- `content/news/`
- `content/contact/`

Home:
- `content/_index.md`

## 3.2 Example File Tree

```text
content/
  _index.md
  about/
    _index.md
    mission-history.md
    team.md
    governance-policies.md
    faq.md
  resources/
    _index.md
    data.md
    software.md
    hardware.md
  projects-partners/
    _index.md
  publications/
    _index.md
  join-us/
    _index.md
    open-roles.md
    talent-pool.md
  news/
    _index.md
    posts/
      2026-03-example-update.md
  contact/
    _index.md
```

## 3.3 Archetypes (Minimal set)

Add archetypes for repeatable content:
- `archetypes/news.md`
- `archetypes/project.md` (if project entries become individual pages later)
- `archetypes/publication.md` (if publications become structured entries)

## 4) Template Strategy (Design + Reuse)

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

## 5) CSS/JS Architecture (Vanilla-first)

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

## 6) Porting Plan: PNG -> HTML/CSS

Goal:
- Translate `docs/landing-prototype.png` into maintainable components, not pixel-locked one-off code.

Method:
1. Identify visual blocks in prototype:
   - header/nav, hero, intro, resource cards, news cards, funders strip, footer.
2. Implement each block as a partial/component.
3. Match spacing/typography/colors at section level first.
4. Refine details in a second pass (icons, gradients, card radii, hover states).
5. Keep responsive behavior explicit (desktop + mobile breakpoints early).

## 7) LLM/Codex-Heavy Workflow

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

## 8) Editorial and Migration Checklist

From old site -> new site:

Port first:
- Resources (data/tools/protocols -> data/software/hardware mapping)
- Projects
- Publications and impact references
- Team and core about content

Then reframe:
- Old IBL-Core section content redistributed into About/Projects & Partners/Join Us.
- Press into News.

Validation checks:
- Every nav item has a landing page.
- No orphan page without nav/footer path.
- Contact paths work (form + direct channels).
- News taxonomy supports both events and press tags.

## 9) Open Decisions for v2

- Whether to split Projects & Partners into entries later (still one combined page in nav).
- Publication data source (manual markdown vs external bib/JSON import).
- Analytics method for tool usage feedback (form/poll design).

## 10) Execution Next Steps (Practical)

1. Scaffold Hugo baseline:
   - `hugo.toml`
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
