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
  categories for this website ID, on the `iblcore.org` hostname. Requests from
  other hosts, including previews, are rejected before contacting Umami.
- The collection guard requires the production Origin, JSON, and a maximum
  8 KiB body. Identify, performance, replays, and extra event properties are
  unsupported. These checks reduce misuse but are not authentication or rate
  limiting: a determined client can forge a valid public analytics request.
- The shared implementation forwards User-Agent, the trusted Cloudflare client
  IP as X-Forwarded-For (preferring CF-Connecting-IPv6 when present), and Umami's
  session cache header. It does not trust incoming X-Forwarded-For and does not
  forward cookies or authorization. Upstream JSON, including the session cache
  and disabled flag, and error statuses are preserved. Collection responses
  are never cached. Upstream fetches have a five-second timeout and do not
  follow redirects. No request payloads or client addresses are logged by the
  application; Cloudflare and Umami retain their own platform behavior.

The Hugo analytics settings live under `params.umami`. The website ID and
production hostname must agree with the constants in `lib/umami-proxy.mjs`;
`scripts/check-umami-proxy.test.mjs` checks this in `just check` and GitHub CI.
The custom-event asset is published with the `site-actions` basename.

Local Hugo previews omit both tracking scripts. To exercise Functions locally,
build with Hugo, then run `npx wrangler pages dev public`. Local collection is
intentionally rejected by the production-host guard. Unit/browser tests use
mocked upstream requests and do not write events to the real dashboard.

After a preview deploy, check that `/t.js` returns JavaScript and that POSTing to
the preview's `/api/send` returns 404. After publication, check browser Network
requests for a successful production `/api/send` pageview and named clicks,
then verify visitor attribution and event categories in Umami. The proxy's
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
