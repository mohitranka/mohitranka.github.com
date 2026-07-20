Title: GTM datasets need data contracts
Date: 2020-07-01 10:00
Category: Blog
Slug: gtm-datasets-need-data-contracts
Tags: data-platforms, platforms, product

When a go-to-market dashboard is wrong, nobody says “the warehouse is eventually consistent.” They say the number is wrong — and they stop trusting the platform. On LinkedIn’s Enterprise Data Platform (EDP) work, the failure mode was rarely a missing chart type. It was **informal truth**: datasets without clear producers, consumers, freshness expectations, or a path that BI could rely on when Hadoop-era pipelines still “worked.” That is a data-contract problem, whether or not you use the word contract.

<figure class="post-figure">
  <img src="{static}/images/blog/gtm-datasets-need-data-contracts.jpg" alt="Illustration of two parties exchanging a contract over data folders" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">GTM datasets become trustworthy when producers and consumers share explicit contracts—not informal folklore.</span>
  </figcaption>
</figure>

<!--more-->

## The contract is the product boundary

A data contract is a written agreement between people who produce a dataset and people who depend on it:

- What the dataset means (grain, keys, critical fields)
- Who owns changes
- How fresh and complete it must be for its main consumers
- Who may use it, and for what
- What happens when the shape changes
- Which path is the system of record when two feeds disagree

Without that, you have tables and jobs — not a product interface. EDP’s strategic job was to become the governed center for GTM data. BI teams on Power BI and Tableau did not move because a platform existed; they moved when the **interface of getting trustworthy data** became clearer, cheaper, and eventually mandatory as legacy paths aged out.

## Which GTM datasets need contracts (almost all that matter)

**Definitely:**

- Pipeline and revenue metrics that show up in leadership reviews  
- Account, lead, and opportunity-shaped datasets used across tools  
- Any feed BI materializes into workbooks that drive weekly motions  
- Datasets used for access decisions, eligibility, or customer-facing ops  
- Shared “golden” entities multiple teams join in different ways

**Lighter-weight is fine for:**

- Truly exploratory sandboxes with no production consumers  
- One-off extracts with an explicit expiry

If a number can start an argument in a QBR, it deserves a contract.

## What we needed in practice (not a 40-page template)

Keep contracts short enough that producers and BI partners will actually read them:

1. **Dataset name** and owning team  
2. **Grain** (what one row means)  
3. **Critical fields** and allowed null behavior  
4. **Primary consumers** (e.g. Power BI / Tableau paths, sales analytics)  
5. **Freshness / readiness expectation** — even if it starts as “available on EDP before legacy deprecation,” not a perfect percentile  
6. **Change policy** — notice, versioning, who approves breaking changes  
7. **System of record** during dual-run periods  
8. **Support path** — where breakages go (not a random Slack thread)

On EDP, connectors, migration staffing, and deprecation dates were how contracts became real. A wiki table alone does not change incentives.

## Why platform adoption without contracts fails

BI’s rational objection was: “We can already get the data.” Informal sources always feel free until:

- Two dashboards disagree  
- A legacy pipeline is turned off  
- A field changes meaning and nobody tells the workbook owner  
- Query performance after cutover becomes “the platform’s problem” with no owner

Contracts force those conversations **before** the incident. They also make deprecation fair: you cannot retire a path nobody documented as non-authoritative.

## Evaluation is part of the contract

Do not separate “data quality” from “dashboard quality.” Ship and migration gates should include:

- Consumer path checks (does the BI workflow still resolve?)  
- Row-count / null-rate sanity on critical fields  
- Explicit dual-run comparisons while both paths live  
- A named human who can freeze a bad publish

When the contract breaks, something visible should fail before the QBR does.

## Organizational pattern that worked

- **Producers** own correctness and change communication  
- **Platform (EDP)** owns enforcement, discovery, access patterns, and migration leverage  
- **BI / analytics partners** own consumer semantics and workbook impact  
- **Leadership** owns deprecation as continuity policy, not a style preference

Shared Slack channels are not a substitute for ownership. Funded migration and executive sponsorship were how EDP contracts left the slide deck.

## A sequence I recommend for new GTM datasets

1. Write the decision the dataset supports in one sentence.  
2. Name the first production consumer (often a BI path).  
3. Draft the contract *before* scaling access.  
4. Put the dataset on the governed platform path.  
5. Dual-run only with an end date.  
6. Turn off the informal path.

Teams love to start at “expose the table.” Steps 1–3 are where trust is designed.

## Closing

EDP did not earn “source of truth” status by existing. It earned it when GTM consumers — especially BI — could depend on **named datasets with owners, expectations, and an end to competing pipelines**. Call that a data contract, a product interface, or an operating promise. Just do not ship GTM data as folklore and hope governance appears later.
