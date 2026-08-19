# Deployment administration

The repository uses GitHub Actions and the existing Cloudflare Pages Direct
Upload project, `iblcore`.

## One-time GitHub configuration

Create a Cloudflare API token limited to Pages deployment for the relevant
account. Add these GitHub Actions repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

After both secrets are present, create the repository Actions variable
`CLOUDFLARE_DEPLOY_ENABLED` with the value `true`. Preview and production jobs
remain safely skipped until that variable is enabled. Trigger `Deploy
production` manually once to verify the configuration.

Create a GitHub environment named `production`. It can optionally require an
administrator's approval, although normal production deployment happens only
after a change reaches `main`.

Protect `main` in the repository settings:

- require a pull request before merging;
- require at least one approval;
- require the `Check website / build` status check;
- dismiss stale approvals when new commits are pushed;
- prevent contributors from bypassing these rules.

At the time this workflow was added, the repository did not yet have the two
secrets or branch protection configured. An administrator must complete these
one-time settings before automatic previews and deployments begin.

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

## Recovery

If a production deployment fails, inspect the `Deploy production` workflow run.
Fix-forward through a PR when possible. To redeploy the current `main` commit,
run that workflow manually. Cloudflare also retains earlier deployments that an
administrator can inspect or roll back from the Cloudflare dashboard.

The local `just pages-deploy` command remains available for an administrator as
an emergency fallback. It requires Cloudflare authentication and should not be
part of the normal contributor workflow.
