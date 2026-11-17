# Dataset page schema

Every page under `content/resources/data/` renders the same six sections, in
the same order, with the same headings. No page may omit, rename, reorder or
add one. `scripts/resources-data-validator.mjs` enforces what follows, and
`archetypes/dataset.md` scaffolds it; `just check` fails on a page that breaks
it.

The spine exists because six dataset pages that each chose their own headings
read as six unrelated pages. A reader who has learned one dataset page should
already know where to look on the next.

## The spine

| # | Section | Comes from |
|---|---|---|
| 1 | Page header, `<Title> Dataset` | `title` |
| 2 | Intro | `lead` |
| 3 | Stats strip, four figures | `stats` |
| 4 | About the dataset, three entries | `about` |
| 5 | Access the data | `access`, `access_guides` |
| 6 | How to cite | `citations`, optional `citation_intro` |

## Required front matter

`title`, `description`, `lead`, `weight`, `card_image` (with a non-empty
`alt`), `modality`, `stats`, `about`, `access`, `citations`.

`stage` is not carried by dataset pages. Every dataset is `analyse` and nothing
else is possible, so the chip would narrow nothing; the other resource sections
still require one.

## About the dataset

Exactly three entries, under exactly these headings, in this order.

1. **The project** — why the data was collected and what was found. Requires
   `paper_title` and `paper_link`. `figure` and `link`/`link_label`/`link_text`
   are optional.
2. **The experiment** — the paradigm the sessions ran. Either set `task` to a
   key in `data/tasks.yaml`, in which case that paradigm's description and
   figure render first and the entry's own `description` follows as the
   deviation from it; or omit `task` and give the entry its own `description`
   and `figure`. Either way the entry carries a figure.
3. **What's in the dataset** — what a reader gets on download. Requires
   `contents`. `figure` optional.

Figures alternate sides down the section, so an entry that gains or loses one
moves the figures below it.

## Contents groups

The contents grid describes the data the release contains, grouped by modality
where there is more than one.

The groups of the contents grid are the page's modalities: the list of group
`name` values must equal `modality` exactly, same terms, same order. A group
name is the vocabulary term (`neuropixels`, `widefield`, `behavior`, `video`),
not a display title — `layouts/partials/resources/term-spelling.html` spells it
for the column header, so the header and the filter chip on the index cannot
drift apart.

A dataset with one modality has one group. Its rows reflow across the same
columns a three-group page uses rather than running down one tall column.

A row says what the release contains. It does not state what is absent, and it
does not count how many sessions carry a given data type.

## Stats

Exactly four entries. `stats-strip.css` lays the strip out as four equal
columns, so four is the shape, not a guideline.

`label` must be one of: Subjects, Sessions, Probe insertions, Laboratories,
Brain regions, Cortical regions, Units, Trials, Genotypes, Months of age.

No entry may have a `value` of `1`. A headline figure of one is a fact about
the study design, not a measurement of the dataset.

A value below one million renders exactly, with thousands separators
(`138,545`). A value of one million or more is abbreviated to one decimal place
with an `M` suffix (`4.2M`).

The figures describe **released data**, not a paper's analysed subset: a reader
checks them by downloading the release. Take them from the release tag in ONE,
not from the paper, which reports what was recorded before QC exclusion.
"Units" means all spike-sorted clusters, noise and multi-unit included.

## Access the data

`access` lists the routes the dataset is published through; `access_guides`
gives each one its destination. Both are keyed by the entries in
`data/access_routes.yaml`: `explorer`, `one`, `dandi`, `ibl-ai-agent`.

Routes render in that file's `order`, whatever order a page lists them in. A
route with no destination yet still gets a row marked "Coming soon": that the
route exists is worth saying before the guide is written.

The index legend is generated from the same file, so a new route appears in
both places at once.

## How to cite

The opening sentence — "If you use the *X* dataset in your research, please
cite the paper." — is generated from the page title. Do not write it into
`citation_intro`, which carries only what is particular to this dataset, such
as a registry entry to cite alongside the paper. Most pages need none.

`kind` must be one of **Paper**, **Data release**, **Registry entry**, **Code**,
and they render in that order. The first entry is always the Paper, and a Paper
always carries `entry` (BibTeX). The other kinds may carry `entry` but need not.

## Adding a dataset page

```sh
hugo new content resources/data/<slug>.md --kind dataset
just check
just preview "/resources/data/<slug>/"
```

A dataset using a paradigm other than the IBL task either adds its paradigm to
`data/tasks.yaml`, if other datasets will share it, or describes it on the page
with its own figure.
