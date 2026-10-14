Title: The platform team’s real job is interfaces
Date: 2025-11-13 10:00
Category: Blog
Slug: platform-teams-real-job-is-interfaces
Tags: engineering-leadership, platforms, developer-tooling
Modified: 2026-10-14 14:30

A platform can be strategically important and still be irrelevant to the team asked to adopt it.

At LinkedIn, the Enterprise Data Platform (EDP) was intended to be the governed path for go-to-market datasets. BI teams using Power BI and Tableau already had Hadoop-based pipelines. Those pipelines worked well enough for their current needs.

From their perspective, migration was more work with a chance of making dashboards slower. We had to solve that problem before our platform strategy could mean anything.

<figure class="post-figure">
  <img src="{static}/images/blog/platform-teams-real-job-is-interfaces.jpg" alt="Abstract illustration of connecting building blocks and interface ports between teams" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Adoption includes migration, performance, and support.</span>
  </figcaption>
</figure>

<!--more-->

## The API was only part of the interface

The practical interface included getting a dataset into a BI workflow, understanding its meaning, obtaining access, migrating an existing workbook, and finding help when something failed.

Storage and processing choices mattered internally. Consumers needed a predictable way to finish their work.

This is where platform teams can misread adoption. A team declining a migration may be responding sensibly to its delivery commitments. Asking it to absorb your platform's cost does not make the cost disappear.

## Fund the transition

We worked with leadership to make adoption a priority and legacy deprecation an explicit continuity concern.

Then EDP engineers took on migration work: connectors, pairing, tooling, and query performance. Office hours gave partners a regular place to resolve blockers.

The sponsorship and the capacity were both necessary. A mandate without support would have transferred the problem to BI. Support without prioritisation would have left it competing indefinitely with their existing roadmap.

## Finish the migration

Our definition of done included moving the scoped GTM paths onto EDP and decommissioning redundant pipelines. The concentrated BI effort took roughly a quarter.

Dual running was useful while validating the new path. Leaving both sources alive indefinitely would have preserved the ambiguity we were trying to remove.

Deprecation needs dates, owners, and exit criteria. Extensions sometimes make sense. Each one should have a reason and a revised plan, rather than becoming a quiet default.

## Own the experience after adoption

If a dashboard becomes slower after cutover, the platform team cannot declare success because the connector works. Adoption is a promise about the workflow, including support and performance.

I would judge a platform by whether consumers can succeed on it, whether their costs are visible, and whether the old paths can actually end.

Infrastructure provides the capability. The interface determines whether anyone can use it.
