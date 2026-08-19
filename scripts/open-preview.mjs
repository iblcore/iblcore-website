import { spawn } from "node:child_process";
import process from "node:process";

const requestedPath = process.argv[2] || "/";
const previewPath = requestedPath.startsWith("/")
  ? requestedPath
  : `/${requestedPath}`;
const previewPort = process.env.IBL_PREVIEW_PORT || "1313";
const previewUrl = `http://127.0.0.1:${previewPort}${previewPath}`;
const noOpen = process.env.IBL_PREVIEW_NO_OPEN === "1";

async function pageIsReady() {
  try {
    const response = await fetch(previewUrl);
    return response.ok;
  } catch {
    return false;
  }
}

function openBrowser() {
  if (noOpen) {
    console.log("Browser opening disabled for this preview run.");
    return;
  }

  let command;
  let args;

  if (process.platform === "darwin") {
    command = "open";
    args = [previewUrl];
  } else if (process.platform === "win32") {
    command = "cmd.exe";
    args = ["/d", "/s", "/c", "start", "", previewUrl];
  } else {
    command = "xdg-open";
    args = [previewUrl];
  }

  const browser = spawn(command, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  browser.on("error", () => {
    console.log(`Open ${previewUrl} in a browser.`);
  });
  browser.unref();
}

if (await pageIsReady()) {
  console.log(`Preview: ${previewUrl}`);
  openBrowser();
  console.log("Requested browser opening using the existing Hugo server.");
  process.exit(0);
}

const hugo = spawn(
  "hugo",
  [
    "server",
    "--buildDrafts",
    "--buildFuture",
    "--disableFastRender",
    "--bind",
    "127.0.0.1",
    "--port",
    previewPort,
  ],
  { stdio: "inherit", windowsHide: true },
);

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  if (!hugo.killed) hugo.kill();
  process.exitCode = exitCode;
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
hugo.on("error", (error) => {
  console.error(`Could not start Hugo: ${error.message}`);
  stop(1);
});
hugo.on("exit", (code) => {
  if (!stopping) process.exit(code ?? 1);
});

let ready = false;
for (let attempt = 0; attempt < 60; attempt += 1) {
  if (await pageIsReady()) {
    ready = true;
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
}

if (!ready) {
  console.error(
    `The preview server started, but ${previewUrl} did not become available.`,
  );
  stop(1);
} else {
  console.log(`Preview: ${previewUrl}`);
  openBrowser();
  console.log("Requested browser opening. Press Ctrl+C to stop the preview server.");
}
