import { spawnSync } from "node:child_process";
import process from "node:process";

const repository = "iblcore/iblcore-website";
let failures = 0;

function run(command, args = []) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
}

function ok(message) {
  console.log(`[ok] ${message}`);
}

function fail(message, help) {
  failures += 1;
  console.log(`[needs attention] ${message}`);
  if (help) console.log(`  ${help}`);
}

function commandCheck(command, args, label, help) {
  const result = run(command, args);
  if (result.status === 0) {
    const version = result.stdout.trim().split("\n")[0];
    ok(`${label}${version ? `: ${version}` : ""}`);
    return result;
  }
  fail(`${label} is unavailable.`, help);
  return null;
}

console.log("Checking this computer for IBL-Core website editing...\n");

const git = commandCheck(
  "git",
  ["--version"],
  "Git",
  "Install Git, then restart the terminal or agent.",
);
const gh = commandCheck(
  "gh",
  ["--version"],
  "GitHub CLI",
  "Install GitHub CLI, then sign in with: gh auth login --web --git-protocol https",
);
const hugo = commandCheck(
  "hugo",
  ["version"],
  "Hugo",
  "Install Hugo Extended 0.164.0 or a compatible version.",
);
commandCheck(
  "just",
  ["--version"],
  "just",
  "Install the just command runner.",
);
commandCheck(
  "node",
  ["--version"],
  "Node.js",
  "Install Node.js 20 or newer.",
);

if (hugo && !`${hugo.stdout}${hugo.stderr}`.toLowerCase().includes("extended")) {
  fail("Hugo is installed, but it is not the Extended edition.", "Install Hugo Extended.");
}

if (gh) {
  const auth = run("gh", ["auth", "status", "--hostname", "github.com"]);
  if (auth.status === 0) {
    const account = run("gh", ["api", "user", "--jq", ".login"]);
    ok(
      account.status === 0
        ? `GitHub authentication: ${account.stdout.trim()}`
        : "GitHub authentication",
    );
  } else {
    fail(
      "GitHub CLI is not signed in.",
      "Run: gh auth login --web --git-protocol https",
    );
  }

  const permission = run("gh", [
    "api",
    `repos/${repository}`,
    "--jq",
    ".permissions.push",
  ]);
  if (permission.status === 0 && permission.stdout.trim() === "true") {
    ok(`GitHub account can contribute to ${repository}`);
  } else {
    fail(
      `GitHub account cannot confirm write access to ${repository}.`,
      "Ask a website administrator to grant repository access, then sign in again if needed.",
    );
  }
}

if (git) {
  const root = run("git", ["rev-parse", "--show-toplevel"]);
  if (root.status === 0) {
    ok("Repository working folder");
  } else {
    fail(
      "The current folder is not a Git repository.",
      `Clone it with: gh repo clone ${repository}`,
    );
  }

  const remote = run("git", ["remote", "get-url", "origin"]);
  if (
    remote.status === 0 &&
    remote.stdout.toLowerCase().includes("iblcore-website")
  ) {
    ok("IBL-Core GitHub remote");
  } else {
    fail("This does not appear to be the IBL-Core website checkout.");
  }

  const authorName = run("git", ["config", "user.name"]);
  const authorEmail = run("git", ["config", "user.email"]);
  if (authorName.status === 0 && authorName.stdout.trim()) {
    ok("Git author name is configured");
  } else {
    fail("Git author name is missing.", 'Run: git config user.name "Your Name"');
  }
  if (authorEmail.status === 0 && authorEmail.stdout.trim()) {
    ok("Git author email is configured");
  } else {
    fail(
      "Git author email is missing.",
      'Run: git config user.email "your-github-email@example.org"',
    );
  }
}

console.log("");
if (failures === 0) {
  console.log("Setup complete. This computer is ready for agent-assisted website edits.");
} else {
  console.log(`${failures} setup item(s) need attention.`);
  process.exitCode = 1;
}
