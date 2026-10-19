Title: GTM datasets need data contracts
Date: 2024-03-12 10:00
Category: Blog
Slug: gtm-datasets-need-data-contracts
Tags: data-platforms, platforms, product
Modified: 2026-10-14 14:30

When two revenue dashboards disagree, nobody is comforted by the fact that both pipelines succeeded.

The missing agreement is usually fairly basic: what does this number mean, who owns it, and which dataset should we trust?

Working on LinkedIn's Enterprise Data Platform (EDP) made those questions difficult to avoid. The platform was supposed to become the governed path for go-to-market data, while BI teams still had working Hadoop-based feeds. Adding another source did not automatically settle which one was right.

<figure class="post-figure">
  <img src="{static}/images/blog/gtm-datasets-need-data-contracts.jpg" alt="Illustration of two parties exchanging a contract over data folders" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Agree on meaning, ownership, and readiness before widening access.</span>
  </figcaption>
</figure>

<!--more-->

## Agree on meaning before exposing the table

A data contract should explain what consumers are allowed to depend on. It needs more than field names and types.

For an important dataset, I want to know:

- What one row represents, and which keys identify it.
- What critical fields mean, including allowed nulls.
- Who produces it and who uses it in production.
- When it should be ready, and how complete it should be.
- Who can change it, with what notice.
- Which path is authoritative during migration.
- Who responds when the agreement breaks.

This can fit in a short document. Length is not enforcement.

A field that retains its type but changes its meaning can break a dashboard more quietly than a schema change. Contracts need to cover semantics as well as syntax.

## Make the agreement affect delivery

On EDP, connectors, migration support, and deprecation dates mattered because they made the governed path practical for BI consumers. A contract hidden in a wiki would not have moved their workbooks.

Validate the consumer path before cutover. Compare critical values during dual running. Check row counts and null rates, while recognising that those checks will not catch every semantic error. Give someone authority to stop a bad publish.

Producers own the meaning and correctness of their data. The platform provides discovery, access, and checks. BI partners own how the dataset is interpreted in their workflows. Shared responsibility still needs named people at each boundary.

## Match the contract to the consequence

A temporary exploratory extract does not need the same process as a revenue metric used in leadership reviews. It does need an expiry if it is supposed to be temporary.

Start with the decision the dataset supports and the first production consumer. Write their expectations before widening access. End the old path when migration is complete.

Tables are easy to publish. A number that people can agree on takes more work.
