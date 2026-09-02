# Partner and Affiliate project records

Partner and Affiliate records live in `data/projects.yaml`. Both the List and
Map views render these records through the same card, profile, team-person, and
media partials.

## Stable record IDs

Every displayed Partner and Affiliate record must have:

```yaml
id: "issue-145"
issue_number: 145
```

The number is the GitHub issue number in the `Project Management - Projects`
export. The Hugo template validates that IDs are present, match
`issue_number`, and are unique. Map locations, selection buttons, cards, and
accordion IDs use this stable ID rather than the record's position in the YAML
array.

If one website record covers multiple GitHub issues, use the primary issue for
`id` and `issue_number`, and list the others in `related_issue_numbers`.

## People and research-group media

`people` contains the lead PI or project contacts shown in the closed card.
Named teammates and images are entries in `team_media`:

```yaml
team_media:
  - image: "/images/new-partners/partners/person.webp"
    alt: "Person name"
    caption: "Person name"
    person: true
  - image: "/images/new-partners/partners/science.webp"
    alt: "Description of the science image"
    image_fit: "contain"
    full_width: true
    size: "compact"
```

The renderer separates `person: true` entries from ordinary images before it
chooses a layout. Teammates therefore use an automatically centered profile
grid and are never counted as science or lab images. Two teammates remain side
by side whenever the available column width permits it.

Ordinary media accepts generic presentation fields:

- `image_fit: "contain"` prevents cropping.
- `full_width: true` spans the media grid.
- `size: "compact"` limits an image to the compact width.
- `size: "large"` permits a wider consortium or group image.

Use `team_media_layout: "inline"` only when people and ordinary images must
share one row. Do not add project-name selectors to CSS.

## Reference alignment

Affiliate references automatically use the same centered fixed-width grid as
lead portraits when the number of links equals the number of people. This
works for any number of people; there are no one-, two-, or four-person CSS
exceptions.
