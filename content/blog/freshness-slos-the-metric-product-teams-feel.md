Title: Freshness SLOs: the metric product teams actually feel
Date: 2024-07-11 10:00
Category: Blog
Slug: freshness-slos-the-metric-product-teams-feel
Tags: data-platforms, reliability, observability

API latency SLOs changed how we run services. Data platforms still underuse the equivalent idea: **freshness**.

Product teams do not experience your consumer lag chart. They experience a feed that is wrong, a permission that has not propagated, a metric that disagrees with the transaction they just made. That gap is a freshness problem—even when every job is "green."

<!--more-->

## Latency is not freshness

Latency asks: how long did this request take?  
Freshness asks: **how old is the truth this request used?**

A p99 of 40ms on a read API can still serve hour-old data. From the platform’s perspective, the service is healthy. From the user’s perspective, the product is broken.

If you only SLO the serving path, you will optimize the wrong layer.

## Define freshness in product language

A workable freshness definition:

> For dataset *D* and consumer *C*, freshness is the age of data at the moment *C* uses it for a user-visible decision.

Make it measurable:

- **Event-time freshness**: now − max source event timestamp successfully applied.
- **Processing freshness**: now − max watermark / commit the consumer has incorporated.
- **Business freshness**: time until a specific user action is visible in a specific surface.

Pick one primary definition per contract. Ambiguous freshness metrics become dashboards nobody trusts.

## SLOs that change behavior

A freshness SLO should look like any serious SLO:

- **Target**: e.g. 99% of minutes where data age < 2 minutes
- **Window**: 28 days or a similar rolling window
- **Scope**: dataset + consumer, not "all pipelines"
- **Owner**: a team that can fix the path end-to-end or escalate with authority
- **Consequence**: page, ticket priority, feature freeze rules—something real

Without consequence, it is a chart. With consequence, it becomes engineering.

## What to measure along the path

End-to-end freshness decomposes. Instrument the stages:

1. Source commit / emit delay  
2. Ingest and validation  
3. Transform / join / enrichment  
4. Materialization to serving store  
5. Cache TTLs and client refresh behavior  

Teams often discover the villain is not the stream processor. It is a cache set to 15 minutes "for performance," or a source that batches for its own convenience. Freshness SLOs force those tradeoffs into the open.

## Error budgets for data

Apply the SRE idea carefully:

- **Burn when freshness misses**—not only when the pipeline crashes.
- **Distinguish complete outage from slow degradation.** A pipeline that runs late every day is a product bug with a schedule.
- **Do not spend the entire budget on new consumers.** Each consumer is a promise; promises need capacity.

A useful policy: if freshness error budget is exhausted, **new feature extractions from that dataset pause** until reliability work lands. That is how platforms stop being infinite free utilities.

## Correctness sits beside freshness

Fresh data that is wrong is worse than slightly stale data that is right. Pair freshness with lightweight correctness signals:

- Row count anomalies vs source  
- Null rate spikes on critical fields  
- Reconciliation samples against system of record  
- Schema violation rates  

Freshness without validation optimizes for speed of falsehood.

## How I introduce freshness SLOs in practice

1. **Choose one user-visible journey** that already causes support pain.  
2. **Map the data path** on a whiteboard until everyone agrees where time goes.  
3. **Ship the metric** before the ambitious redesign.  
4. **Set a conservative SLO** you can keep, then tighten.  
5. **Attach an owner and a runbook** — including "what the product shows while degraded."

Do not start with twenty datasets. Start with the one that embarrasses you in executive meetings.

## Common objections

**"Our sources are slow; we cannot SLO this."**  
Then SLO what you control, and publish source delay as a dependency. Silent impossibility helps no one.

**"Batch is fine."**  
Great—write a batch freshness SLO ("available by 06:00 UTC in 99% of days"). Batch still needs promises.

**"This will create too much paging."**  
Good. That pain means either the system is unreliable or the SLO is dishonest. Both are worth learning quickly.

## Closing

Product teams feel freshness even if they never say the word. Platforms that only track job success and API latency will be surprised by escalations forever.

Put a number on the age of truth. Own it. Budget it. Design product behavior for the misses.

That is how data platforms earn trust—not by moving more bytes, but by making time and correctness legible.
