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
normal changes. It also blocks deletion and force pushes. The `rossant` account
has an explicit always-allow bypass so the administrator can push directly to
`main` when necessary.

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

## Recovery

If a production deployment fails, inspect the `Deploy production` workflow run.
Fix-forward through a PR when possible. To redeploy the current `main` commit,
run that workflow manually. Cloudflare also retains earlier deployments that an
administrator can inspect or roll back from the Cloudflare dashboard.

The local `just pages-deploy` command remains available for an administrator as
an emergency fallback. It requires Cloudflare authentication and should not be
part of the normal contributor workflow.
