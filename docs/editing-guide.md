# How to update the IBL-Core website

This guide is for IBL colleagues who need to change text, links, people,
projects, images, or other website content. You do not need web-development
experience or Cloudflare access. A coding agent such as Claude Code or Codex can
guide you through the technical steps.

## The short version

1. Open the website repository with your agent.
2. Describe the change in ordinary language.
3. Review the updated page locally and ask for any corrections.
4. Ask the agent to explain the changed files.
5. Approve the change and ask the agent to open a draft pull request (PR).
6. Open the temporary website link posted on the PR.
7. Ask an administrator to review and merge it.

Nothing becomes public until the PR is approved and merged. After merging,
GitHub publishes the update to [iblcore.org](https://iblcore.org/) automatically.

## Before your first edit

Ask a website administrator to confirm that:

- you have access to the `iblcore/iblcore-website` repository on GitHub;
- Git and a supported coding agent are installed;
- the repository has been cloned onto your computer; and
- the agent is opened in the repository folder.

The repository folder is named `iblcore-website`. You should not need to install
or configure Cloudflare.

## Ask the agent to make a change

Describe the outcome, the affected page, and the source material. Be explicit
about anything that must remain unchanged.

For example:

> Update the text on the Support page using the text below. Keep the current
> layout and styling. Create a branch for the work. Show me the updated page
> locally and explain the changes before committing anything.

Or:

> Correct Gaelle's role on the Team page to "...". Do not change any other team
> member. Preview the result locally and wait for my approval before committing.

You can paste final wording, provide a link as source material, or attach an
image that belongs on the site. Tell the agent not to guess when names, dates,
links, or wording are uncertain.

## Review the local preview

The agent should start the local website and give you a URL such as:

```text
http://localhost:1313/about/team/
```

Open that URL in your browser. This is a private copy running on your computer;
it does not affect the public website.

Check:

- the wording, spelling, names, dates, and links;
- the page on both a wide and narrow browser window;
- nearby content that might have moved or changed unexpectedly; and
- any other page the agent says is affected by a shared component.

Ask for revisions in ordinary language. For example:

> The wording is correct, but the new paragraph is too long. Split it into two
> short paragraphs without changing its meaning, then refresh the preview.

Repeat until you are satisfied.

## Review what will be committed

Before approving publication, ask:

> Show me the diff and explain it in plain language. Confirm that no unrelated
> files changed and run the website checks. Do not commit yet.

The agent should describe which files changed, why each change was necessary,
and whether the automated check passed. If anything looks unrelated, ask the
agent to stop and explain it.

## Open the pull request

When the local result and diff are correct, say:

> I approve the change. Commit only these files, push the branch, and open a
> draft pull request. In the PR, explain what changed and list the exact pages
> reviewers should inspect under "Where to look". Include desktop and mobile
> screenshots if they help review this visual change. Return the PR URL.

The agent should return a GitHub PR link. Opening a PR does not publish the
change.

## Review the temporary website

Two automated jobs run on the PR:

- **build** checks that the Hugo website can be generated successfully;
- **deploy** creates a temporary Cloudflare copy of the complete website.

After the deploy job finishes, a bot adds a **Website preview** comment to the
PR. Open its preview link, then visit every path listed under **Where to look**.
The preview updates automatically when more changes are pushed to the branch.

The link is more useful than screenshots because you can navigate and resize the
real site. Screenshots are optional supporting evidence for visual changes.

If the preview is wrong, describe the problem to the agent, ask it to update the
same branch, and review the refreshed preview. Do not open a second PR.

## Request review and publication

When the preview is correct:

1. Mark the draft PR **Ready for review**, or ask the agent to do it.
2. Ask a website administrator to review it.
3. Respond to any requested changes using the same branch and PR.
4. Wait for the build check and one approval.
5. An administrator merges the PR.

Merging triggers the production deployment. The update normally appears on
[iblcore.org](https://iblcore.org/) within a few minutes.

## Make an edit without an agent

If you are comfortable editing files directly, follow the manual workflow in
[CONTRIBUTING.md](../CONTRIBUTING.md). The review and publication stages are the
same whether an agent or a person edits the files.

## Safety and troubleshooting

- Never paste passwords, API tokens, private keys, or other credentials into an
  agent prompt, website file, commit, or PR.
- Do not give a contributor Cloudflare credentials. GitHub handles previews and
  production publishing.
- If a command fails, give the full error to the agent and ask it to diagnose
  the problem before retrying.
- If the public site looks wrong after a merge, contact an administrator and
  link the PR. Cloudflare retains earlier deployments for recovery.
- If you are unsure whether a change is appropriate, leave the PR as a draft.
  Draft PRs are safe and can be closed without publishing anything.

## A reusable prompt

Copy and adapt this prompt for most website edits:

> Make the following change to the IBL-Core website: [describe the change and
> paste the approved content]. Create a focused branch and preserve unrelated
> files. Follow AGENTS.md and the repository documentation. Preview every
> affected page locally and give me the URLs. Wait while I review and request
> revisions. Before committing, explain the diff in plain language and run the
> website checks. After I explicitly approve, commit, push, and open a draft PR.
> Complete "What changed" and "Where to look" with concrete review instructions,
> and return the PR URL. Do not merge the PR.
