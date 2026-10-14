Title: What “led the web launch” taught me about constraints
Date: 2022-07-06 10:00
Category: Blog
Slug: web-launch-constraints
Tags: engineering-leadership, product, developer-tooling
Modified: 2026-10-14 14:30

Putting Postman on the web meant moving a familiar desktop workflow into an environment with different rules.

Users expected collections, environments, and request execution to behave like Postman. Browsers restricted what we could do. Security, infrastructure, product scope, and a conference deadline all affected the design.

As the engineering manager responsible for coordinating delivery, I spent as much time resolving those dependencies as discussing the implementation.

<figure class="post-figure">
  <img src="{static}/images/blog/web-launch-constraints.jpg" alt="Illustration of browser and desktop windows bridged together" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Browser constraints determine where requests can execute.</span>
  </figcaption>
</figure>

<!--more-->

## Familiar behaviour was a requirement

Developers already knew the desktop product. They would compare the web version with that experience, rather than treat missing capabilities as charming evidence of a new product.

We had to decide what to reuse, what to isolate, and which gaps to make explicit. Core workflow parity mattered more than having a clean rewrite.

The existing product carried knowledge about how users worked. Ignoring it would have meant learning the same lessons again, publicly.

## Execution could not stay implicit

The desktop app could make network requests that a browser could not. CORS and access to private networks affected the basic Send workflow.

The product needed distinct execution paths:

- A browser path for requests the browser could make.
- A cloud path for supported requests executed outside the browser.
- A desktop agent to reach local or private-network resources from the web UI.

Those paths had different reachability and security constraints. A cloud agent did not make every private target accessible, and a desktop bridge introduced its own dependency.

The architecture had to make those differences understandable without turning every request into a lesson on browser security.

## Scope and rollout belonged together

We hit the conference launch window by phasing capability. The announcement did not mean every execution path and feature was equally mature.

A launch plan needs a working journey, explicit limits, a rollout sequence, and owners for the work afterwards. The first public version is when real traffic starts teaching you things the demo did not.

Cross-functional coordination was part of that plan. Dedicated capacity, regular unblock discussions, and written scope decisions helped prevent dependencies from drifting between teams.

## Real workspaces reveal different problems

Large collections and histories made performance a product requirement. Efficient state handling, lazy loading, and virtualised lists mattered because developers brought existing work into the browser.

A small demo workspace is a poor benchmark for an established developer tool.

I would repeat the emphasis on explicit non-goals, journey-level instrumentation, partial-failure rehearsals, and capacity after launch. I would avoid betting a public date on a rewrite that was nearly ready.

The main lesson was to name the constraints early. The execution model and phased rollout followed from them. Drawing the web UI was the comparatively easy part.
