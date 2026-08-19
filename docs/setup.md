# Set up your computer for website editing

This is a one-time setup for the computer you will use to edit the IBL-Core
website. You normally do not need to follow these steps yourself: open the
`iblcore-website` repository with the agent and describe the change you want.
The agent checks your setup automatically and guides you through anything that
is missing before continuing your edit.

Use this page if you are curious about the process, prefer to set things up
manually, or need to troubleshoot a failed setup check.

## 1. Confirm your GitHub access

Open the `iblcore/iblcore-website` repository on GitHub while signed in to your
own account. If you cannot access it with write permission, ask a website
administrator to add your account directly or through the appropriate IBL
GitHub team. Accept any organization or repository invitation you receive.

Always use your own GitHub account. Do not share an administrator account,
password, token, or SSH key.

## 2. Install an agent and the local tools

Install either Claude Code or Codex and sign in using your approved agent
account. Then install:

- Git
- [GitHub CLI](https://cli.github.com/)
- Hugo Extended 0.164.0 or a compatible version
- Node.js 20 or newer
- `just`

Useful official installation references:

- [Claude Code setup](https://code.claude.com/docs/en/setup)
- [Codex documentation](https://learn.chatgpt.com/docs)
- [GitHub CLI](https://github.com/cli/cli#installation)
- [Hugo installation](https://gohugo.io/installation/)
- [`just` installation](https://just.systems/man/en/installation.html)
- [Node.js downloads](https://nodejs.org/en/download)

On macOS with Homebrew:

```bash
brew install git gh hugo just node
```

On Windows with Winget, use PowerShell:

```powershell
winget install --id Git.Git --exact
winget install --id GitHub.cli --exact
winget install --id Hugo.Hugo.Extended --exact
winget install --id Casey.Just --exact
winget install --id OpenJS.NodeJS.LTS --exact
```

Restart the terminal and agent after installing tools. Linux installation varies
by distribution; use the official links above or contact local IT. Hugo must be
the Extended edition.

## 3. Sign in to GitHub

In a terminal, run:

```bash
gh auth login --web --git-protocol https
```

GitHub CLI opens a browser or displays a one-time code and URL. Sign in to your
own GitHub account and authorize GitHub CLI. Do not create, copy, or paste a
personal access token for this setup.

Connect Git to the same secure GitHub CLI credential and check the active
account:

```bash
gh auth setup-git
gh auth status
```

The status output should show your GitHub account. GitHub CLI stores the
credential in the operating system's credential store when one is available.

## 4. Clone the website repository

Choose a normal working folder, then run:

```bash
gh repo clone iblcore/iblcore-website
cd iblcore-website
```

Avoid a cloud-synchronized folder if it causes file-locking or permission
problems.

## 5. Configure your commit identity

From inside the repository, use your real name and an email address associated
with your GitHub account:

```bash
git config user.name "Your Name"
git config user.email "your-github-email@example.org"
```

These settings apply only to this repository. A GitHub-provided private
`noreply` address is also acceptable.

## 6. Verify your setup

From inside `iblcore-website`, run:

```bash
just setup-check
```

The check verifies the tools, Hugo Extended, your GitHub login, repository write
access, checkout, remote, and commit identity. It displays no credential or
token values.

If `just` is the missing tool, run the checker directly:

```bash
node scripts/check-contributor-setup.mjs
```

Every item should say `[ok]`, followed by:

```text
Setup complete. This computer is ready for agent-assisted website edits.
```

## 7. Start editing

Open the `iblcore-website` folder in the agent. Allow it to read and modify files
in this repository and to run normal Git, GitHub CLI, Hugo, Node.js, and `just`
commands. Review permission prompts; do not grant access to unrelated folders or
credentials.

You can now begin with a short request such as:

> Update the About page introduction to "...".

See [How to update the IBL-Core website](editing-guide.md) for the rest of the
workflow.

## Changing GitHub accounts later

If GitHub CLI is using the wrong account, stop before editing and run:

```bash
gh auth status
```

Use `gh auth switch` when your account is already stored, or sign out and repeat
the browser login. Never create commits or pull requests using someone else's
GitHub identity.
