---
title: "Broken workflow"
description: "Steps missing a title, missing a resource, and naming a resource or route that does not exist."
stage:
  - "analyse"
steps:
  - resource: "/resources/tools/fine"
  - title: "No resource at all"
  - title: "Points at nothing"
    resource:
      - "/resources/tools/fine"
      - "/resources/tools/ghost"
  - title: "Compares a route that is not there"
    resource: "/resources/tools/fine"
    routes:
      - "/resources/tools/phantom"
---
