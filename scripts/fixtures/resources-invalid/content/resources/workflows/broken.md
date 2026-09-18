---
title: "Broken workflow"
description: "Steps missing a title, missing a resource, and naming a resource that does not exist."
stage:
  - "explore"
steps:
  - resource: "/resources/tools/fine"
  - title: "No resource at all"
  - title: "Points at nothing"
    resource:
      - "/resources/tools/fine"
      - "/resources/tools/ghost"
---
