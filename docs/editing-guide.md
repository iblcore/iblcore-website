# How to update the IBL-Core website

Use this page whenever you want to change text, links, people, projects, images,
or other IBL-Core website content. You do not need web-development experience
or Cloudflare access. Claude Code, Codex, or another configured coding agent
handles the technical workflow for you.

## What you do

Open the `iblcore-website` repository with the agent and describe the change in
ordinary language. A prompt can be as short as:

> Update the About page introduction to "...".

Or:

> Replace the Support page introduction with this: "...".

That is enough. You do not need to ask the agent to create a branch, edit files,
run commands, start the website, commit, or open a pull request.

The first time you use the agent on a computer, it checks the required tools,
your GitHub login, repository access, and commit identity. If anything is
missing, it pauses the edit, explains each step, and guides you through the
one-time setup automatically. When the check passes, it continues your original
request without making you start again.

You do not need to read or perform the setup in advance. If you are curious,
prefer to do it manually, or need to troubleshoot, see
[Set up your computer for website editing](setup.md).

## What the agent does

The agent will:

1. locate the right website content;
2. create a safe working branch;
3. make the requested change;
4. run the website checks;
5. start a private copy of the website on your computer;
6. give you a clickable link and open the affected page in your browser; and
7. ask you to review it.

The local preview does not affect the public website. If the browser does not
open automatically, click the local link in the agent's message.

## Review and revise

Look at the page the agent opened. Check the wording, names, dates, links, and
general appearance. Resize the browser if you want to check a narrow layout.

If something needs changing, simply describe it:

> Make the first paragraph shorter.

The agent updates the same branch, checks it again, and reopens or refreshes the
preview. Repeat this until the result is correct.

When you are satisfied, type only:

> approve

## What happens after approval

The agent will then:

1. review the changed files and exclude unrelated work;
2. run the final website check;
3. commit and push the change;
4. open a pull request with clear review instructions;
5. wait for the automated website preview and checks; and
6. hand the pull request to the website administrators.

The agent will confirm that the request is ready for administrator review. You
do not need to deploy the website or manage Cloudflare.

An administrator reviews and merges the pull request. Only that merge publishes
the change to [iblcore.org](https://iblcore.org/).

## Before your first edit

The agent handles this automatically when you make your first request. The
optional [setup details](setup.md) explain repository access, installing local
tools, signing GitHub in as you, cloning the repository, and checking that the
agent can create pull requests safely.

After that setup, future edits begin with only a description of the change.

## Safety and help

- Never paste passwords, API tokens, private keys, or other credentials into an
  agent prompt.
- If the agent needs essential missing content, it may ask one short question.
- If a command fails, the agent should diagnose it and explain what is needed.
- If you change your mind before typing `approve`, ask the agent to discard the
  change.
- If the public site looks wrong after a merge, contact an administrator and
  link the pull request.

If you prefer to edit files and run commands yourself, use the manual workflow
in [CONTRIBUTING.md](../CONTRIBUTING.md).
