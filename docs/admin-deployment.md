# Deployment administration

The repository uses GitHub Actions and the existing Cloudflare Pages Direct
Upload project, `iblcore`.

## Current configuration

GitHub Actions has a Cloudflare API token limited to Pages deployment. The
repository contains these Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The repository variable `CLOUDFLARE_DEPLOY_ENABLED` is `true`. Preview and
production deployments remain safely skipped if an administrator disables or
deletes this variable.

The production workflow uses the GitHub environment named `production`. Normal
production deployment happens only after a commit reaches `main`.

The repository is configured with the active `Protect main` ruleset. It requires
one approval, resolved review conversations, and a successful `build` check for
normal changes. It also blocks deletion and force pushes. The ruleset grants
explicit always-allow bypasses to the `rossant` and `GaelleChapuis`
accounts so either administrator can merge or push directly to `main` when
necessary.

The repository's Actions workflow permissions must allow the preview workflow
to comment on pull requests. The workflow itself requests only the permissions
needed by each job.

## Workflows

- `check.yml` builds every PR and every push to `main`, treats Hugo warnings as
  errors, and retains the built site for seven days.
- `preview.yml` deploys branches from this repository as Cloudflare preview
  deployments and maintains one PR comment containing the preview URL. It does
  not run privileged deployment steps for pull requests from forks.
- `deploy.yml` builds and deploys `main` to production. It can also be started
  manually from the Actions tab for recovery or redeployment.

The Hugo version is pinned in all workflows. Update all three workflow values
together after testing a Hugo upgrade locally.

## Preview review notes

Automation knows the preview URL but cannot reliably infer which pages matter:
a single change to CSS or a shared template may affect many URLs. The PR author
therefore lists the relevant paths and review instructions in **Where to look**.
Screenshots complement the live preview; they do not replace it.

For the contributor-facing process, see
[How to update the IBL-Core website](editing-guide.md).

## Umami proxy

Two Pages Functions deploy with the existing `wrangler pages deploy public`
commands. No additional Worker, DNS record, secret, or account binding is
required. Wrangler compiles the root `functions/` directory automatically.
`wrangler.jsonc` pins the runtime compatibility date to one supported by the
repository's installed Wrangler runtime.
`static/_routes.json` is copied into `public/` by Hugo and limits Function
invocations to `/t.js`, `/api/send`, and its trailing-slash variant; ordinary
pages and static assets do not invoke a Function.

- `functions/t.js/index.js` serves the current Umami Cloud script without rewriting it.
  Successful JavaScript responses are cached at the edge for one hour and in
  browsers for five minutes. Query strings share one cache entry. Failed or
  unexpected responses are not cached.
- `functions/api/send.js` forwards only pageviews and the documented click
  events, with their registered properties, for approved origin/website-ID
  pairs in `lib/umami-sites.mjs`.
  The endpoint itself runs only on `https://iblcore.org`; requests addressed to
  other hosts, including proxy previews, are rejected before contacting Umami.
- The collection guard requires an approved HTTPS Origin, matching website ID,
  hostname and page URL, JSON, and a maximum
  8 KiB body. Identify, performance, and replays are unsupported. Event
  properties are accepted only for keys registered for that event name, as
  non-empty strings of at most 200 characters; empty `data` objects from
  Umami's native event attributes are accepted. Umami Cloud bills each stored
  property as an additional event, so register as few keys as possible. These checks reduce misuse but are not authentication or rate
  limiting: a determined client can forge a valid public analytics request.
- Registered origins can use CORS preflights for POST with Content-Type and
  Umami's website, hostname, and session-cache headers. Collection responses
  allow only the requesting registered origin, include `Vary: Origin`, and do
  not allow credentials. Preflights never reach Umami. Error responses retain
  CORS for approved sites so their browsers can read them. The public tracker
  script permits cross-origin loading; its cache does not vary by caller.
- The shared implementation forwards User-Agent, the trusted Cloudflare client
  IP as X-Forwarded-For (preferring CF-Connecting-IPv6 when present), and Umami's
  session cache header. It does not trust incoming X-Forwarded-For and does not
  forward cookies or authorization. Upstream JSON, including the session cache
  and disabled flag, and error statuses are preserved. Collection responses
  are never cached. Upstream fetches have a five-second timeout and do not
  follow redirects. No request payloads or client addresses are logged by the
  application; Cloudflare and Umami retain their own platform behavior.

The Hugo analytics settings live under `params.umami`. This website's ID and
production hostname must agree with its entry in `lib/umami-sites.mjs`;
`scripts/check-umami-proxy.test.mjs` checks this in `just check` and GitHub CI.
The custom-event asset is published with the `site-actions` basename.

### Add another website

The proxy is shared infrastructure, but registration is explicit. In
`lib/umami-sites.mjs`, add an entry with the site's exact HTTPS origin (no
trailing slash or path), its own Umami website ID, and its allowed custom events
as a map from event name to allowed property keys, for example
`events: { "Resource open": ["Target"] }`. Use `events: {}` for pageviews only. Each additional hostname, such as a
`www` variant, needs its own entry; it may share the same Umami website ID.
Keep development and preview origins out of the list. Run the checks and
redeploy this existing Pages project through the normal approved PR workflow.
No separate proxy, DNS record, or Cloudflare binding is needed for the new site.

Install this snippet on the new website, substituting its website ID and
production hostname. If its Content Security Policy restricts external hosts,
allow `https://iblcore.org` in both `script-src` and `connect-src`.

```html
<script defer
  src="https://iblcore.org/t.js"
  data-host-url="https://iblcore.org"
  data-website-id="NEW-WEBSITE-ID"
  data-domains="NEW-PRODUCTION-HOSTNAME"></script>
```

For a registered event name, use `data-umami-event="Resource open"` on a
button/link or call `window.umami.track("Resource open")`. Attach only registered
properties, such as `window.umami.track("Resource open", { Target: "Dataset" })`;
other properties are rejected. HTML lowercases attribute names, so register
lowercase keys when using `data-umami-event-*` property attributes. IBL-Core's custom click handler is specific to this website; the
shared script does not install those handlers on other websites.

Requests from other websites are third-party requests to `iblcore.org`.
Sharing removes the need for a proxy on every site, but provides less protection
against generic third-party blocking than proxying on each site's own hostname.
Consumption is shared on the proxy's Cloudflare account; Umami usage follows
the website IDs and their owning accounts/plans. Script delivery needs no
Umami API key. Confirm each new site's data in its own Umami dashboard.

Automated tests inject a simulated second site without adding it to the
production list. They cover preflights, site-specific event names, origin/ID/URL
mismatches, session headers, errors, and preview rejection. A real second-site
deployment remains unverified until that site exists.

Local Hugo previews omit both tracking scripts. To exercise Functions locally,
build with Hugo, then run `npx wrangler pages dev public`. Local collection is
intentionally rejected by the production-host guard. Unit/browser tests use
mocked upstream requests and do not write events to the real dashboard.

After a preview deploy, check that `/t.js` returns JavaScript and that POSTing to
the preview's `/api/send` returns 404. After publication, check browser Network
requests for a successful production `/api/send` pageview and named clicks,
then verify visitor attribution, event names, and event properties in Umami. The proxy's
header forwarding follows Umami's documented proxy example; correct Cloud
attribution still needs confirmation against the live dashboard.

First-party proxying reduces domain-based blocking but does not guarantee
collection with every blocker, disabled JavaScript, or `umami.disabled` in
localStorage. Functions use the Cloudflare Workers request allowance, separately
from Umami usage; review both dashboards if traffic grows. The restrictive
invocation routes keep website rendering independent of analytics failures.

To roll back to direct collection, set `scriptURL` to
`https://cloud.umami.is/script.js` and remove `hostURL` from `hugo.yaml`, retaining
the domain allowlist. Update the configuration assertions in the proxy test.
The Functions may remain unused until removed in a later change. To disable all
browser tracking instead, set `enabled: false`; to disable clicks alone, set
`customEvents: false`.

References: [Umami proxy guidance](https://docs.umami.is/docs/bypass-ad-blockers),
[Pages routing](https://developers.cloudflare.com/pages/functions/routing/), and
[Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/).

## Recovery

If a production deployment fails, inspect the `Deploy production` workflow run.
Fix-forward through a PR when possible. To redeploy the current `main` commit,
run that workflow manually. Cloudflare also retains earlier deployments that an
administrator can inspect or roll back from the Cloudflare dashboard.

The local `just pages-deploy` command remains available for an administrator as
an emergency fallback. It requires Cloudflare authentication and should not be
part of the normal contributor workflow.
