---
name: partner-lab-members
description: Add or edit lab-member portraits and captions on the IBL-Core partner pages, using names only for member captions.
---

# Partner lab members

Lab-member portrait captions on partner pages display only the person's name.
Do not append academic status, degrees, job titles, or roles, even when the
user supplies those details as background. For example, a PhD student named
Axel Bisi has the caption `Axel Bisi`.

Member portraits are stored in the relevant lab's `team_media` list in
`data/projects.yaml`, with `person: true`. Use the person's name for `alt` and
`caption`, and preserve the requested order within the lab.

Partner images live under `static/images/new-partners/partners/`. Follow the
existing lowercase, hyphenated filenames, such as `axel-bisi.webp`.

This caption rule concerns people within a lab; it does not change lead PI
affiliations or lab descriptions. When correcting one member, keep other
records outside the requested edit unchanged.
