set shell := ["bash", "-cu"]
set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

default:
  @just --list

build:
  hugo

serve:
  hugo server --buildDrafts --buildFuture --disableFastRender

# Start Hugo and open an affected page in the default browser.
preview path="/":
  node scripts/open-preview.mjs "{{path}}"

test-serve:
  timeout 8s hugo server --buildDrafts --buildFuture --disableFastRender; code=$?; if [ "$code" -ne 0 ] && [ "$code" -ne 124 ]; then exit "$code"; fi

check:
  hugo --panicOnWarning

capture-landing:
  npm run capture:landing

clean:
  rm -rf public resources
  rm -f .hugo_build.lock

clean-all: clean
  rm -rf .hugo_build_cache

status:
  git status --short

tree:
  find . -maxdepth 3 \
    \( -path './.git' -o -path './public' -o -path './resources' \) -prune -o \
    -print | sort

doctor:
  just check-hugo
  just status

# Verify tools, GitHub identity, permissions, and repository configuration.
setup-check:
  node scripts/check-contributor-setup.mjs

maintenance:
  just clean
  just check
  just status

cf-whoami:
  npx wrangler whoami

pages-build base_url="https://iblcore.org":
  hugo -b {{base_url}}

pages-deploy project="iblcore" branch="main" base_url="https://iblcore.org":
  just pages-build {{base_url}}
  npx wrangler pages deploy public --project-name {{project}} --branch {{branch}} --commit-dirty=true

pages-deploy-preview project="iblcore" branch="main" base_url="https://iblcore-website-preview.pages.dev":
  just pages-deploy {{project}} {{branch}} {{base_url}}

pages-list:
  npx wrangler pages project list

check-hugo:
  command -v hugo
  hugo version

new-news slug:
  hugo new news/posts/{{slug}}.md

new-event slug:
  hugo new events/{{slug}}.md

new-project slug:
  hugo new projects/{{slug}}.md
