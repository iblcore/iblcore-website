# Agent-readable website content

The website provides a curated index at
[https://iblcore.org/llms.txt](https://iblcore.org/llms.txt). It follows the
emerging `llms.txt` convention and directs agents to the most useful canonical
public pages. It is an orientation file, not a crawler permission mechanism or
a replacement for `robots.txt` and the XML sitemap.

The file is intentionally concise and excludes disabled, unfinished, and
secondary pages. Update it when a major public page, navigation destination, or
information-architecture decision changes.

## Validation

`node scripts/check-llms.mjs` runs after Hugo builds the site. It verifies:

- the source file is present in the generated site;
- the basic title and summary structure;
- unique HTTPS links;
- every internal URL maps to generated output; and
- every internal URL fragment exists in its generated page.

`just check` and GitHub Actions run this validation.

## Markdown responses

The current Cloudflare Free plan does not provide Cloudflare's Markdown for
Agents content negotiation feature. Requests with `Accept: text/markdown`
therefore continue to receive the canonical HTML representation.

The site does not generate `.md` alternatives for every page or an
`llms-full.txt` bundle. The current semantic HTML is the authoritative page
representation, while `/llms.txt` supplies a lightweight discovery map. This
avoids a parallel content system and can be reconsidered if a concrete consumer
requires Markdown pages or the hosting plan changes.
