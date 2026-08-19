# Set up a computer for website editing

This is a one-time setup for an IBL colleague. A website administrator or local
IT colleague can help complete it. After setup, the user only needs to open the
repository with an agent and describe the desired website change.

The agent runs the setup check automatically when an edit begins. If the
computer is not ready, it should explain each missing item and guide the user
through this document before returning to the requested edit.

## 1. Grant GitHub access

A repository administrator must give the colleague write access to
`iblcore/iblcore-website`, either directly or through the appropriate IBL GitHub
team. The colleague should accept any GitHub organization or repository
invitation before continuing.

Each colleague must use their own GitHub account. Do not share an administrator
account, password, token, or SSH key.

## 2. Install an agent and the local tools

Install either Claude Code or Codex and sign in using the colleague's approved
agent account. Then install:

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

On macOS with Homebrew, the local tools can be installed with:

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
by distribution; use the official links above or ask local IT. Hugo must be the
Extended edition.

## 3. Sign GitHub CLI in as the colleague

In a terminal, run:

```bash
gh auth login --web --git-protocol https
```

GitHub CLI opens a browser or displays a one-time code and URL. The colleague
must sign in to their own GitHub account and authorize GitHub CLI. Do not create,
copy, or paste a personal access token for this setup.

Then connect Git to the same secure GitHub CLI credential:

```bash
gh auth setup-git
gh auth status
```

The status output should name the colleague's GitHub account. GitHub CLI stores
the credential in the operating system's credential store when one is
available.

## 4. Clone the website repository

Choose a normal working folder, then run:

```bash
gh repo clone iblcore/iblcore-website
cd iblcore-website
```

Do not place the repository inside a cloud-synchronized folder if that causes
file-locking or permission problems.

## 5. Configure the commit author

From inside the repository, run these commands with the colleague's real name
and an email address associated with their GitHub account:

```bash
git config user.name "Your Name"
git config user.email "your-github-email@example.org"
```

These settings apply only to this repository. A GitHub-provided private
`noreply` address is also acceptable.

## 6. Verify the complete setup

From inside `iblcore-website`, run:

```bash
just setup-check
```

The check verifies the tools, Hugo Extended, GitHub login, repository write
access, checkout, remote, and commit identity. It displays no credential or
token values.

If `just` is the missing tool, the agent can run the checker directly:

```bash
node scripts/check-contributor-setup.mjs
```

Every item should say `[ok]`, followed by:

```text
Setup complete. This computer is ready for agent-assisted website edits.
```

## 7. Open the repository with the agent

Open the `iblcore-website` folder in the chosen agent. Allow the agent to read
and modify files in this repository and to run normal Git, GitHub CLI, Hugo,
Node.js, and `just` commands. Review any permission prompt shown by the agent;
do not grant access to unrelated folders or credentials.

The colleague can now begin with a short request such as:

> Change Gaelle's role to "...".

The workflow continues in
[How to update the IBL-Core website](editing-guide.md).

## Changing GitHub accounts later

If the computer is shared or GitHub CLI is using the wrong account, stop before
editing. Check the active identity with:

```bash
gh auth status
```

Use `gh auth switch` when the correct account is already stored, or sign out and
repeat the browser login. Never let one colleague create commits or PRs using
another person's GitHub identity.
