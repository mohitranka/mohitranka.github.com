Title: Near-real-time is a product promise, not a Kafka cluster
Date: 2026-07-16 10:00
Category: Blog
Slug: near-real-time-is-a-product-promise
Tags: data-platforms, distributed-systems, reliability

Near-real-time is one of the most over-claimed and under-specified phrases in data engineering. Teams buy a streaming system, wire a topic to a consumer, and declare victory. The product still lies to users for minutes. Support still escalates. Finance still reconciles offline. The cluster is healthy. The promise is not.

<!--more-->

## What users actually bought

When a product manager says "near-real-time," they rarely mean "events move through a log." They mean something like:

- A member sees an update within a few seconds of a write elsewhere.
- A dashboard does not contradict the system of record for longer than an agreed window.
- Downstream teams can act on data before the business decision expires.

Those are **product promises**. They have users, failure modes, and opportunity cost. Kafka, Flink, Spark Streaming, change-data-capture, and friends are **implementation options**. Confusing the two produces expensive architecture with soft outcomes.

I have spent a large part of my career on platforms that stitch many sources into something other teams can trust. The pattern that fails most often is technical excellence aimed at the wrong contract.

## A useful definition

I use a boring definition:

> Near-real-time means: for a named dataset and a named consumer, the **age of usable data** stays under a **freshness SLO**, under normal load, with a documented degradation path when it does not.

Unpack that:

- **Named dataset**: not "the platform," not "events." *User profile projections*, *billing entitlements*, *feed ranking features*.
- **Named consumer**: product surface, ML training job, risk system, analytics mart. Different consumers tolerate different staleness.
- **Age of usable data**: time from source commit to the moment a consumer can correctly act. Not produce latency. Not consumer lag alone.
- **Freshness SLO**: a number with a percentile and an owner. "Usually fast" is not an SLO.
- **Degradation path**: what the product does when the promise breaks—stale badge, fallback read, delayed feature, page the platform.

If you cannot fill those fields, you do not have a near-real-time product. You have a pipeline hobby.

## Where streaming systems help—and where they don't

Streaming is often the right tool when:

- The source naturally emits changes.
- Multiple consumers need the same ordered history.
- You care about continuous processing more than periodic bulk recompute.
- Catch-up and replay are first-class operational needs.

Streaming is the wrong primary investment when:

- The real delay is source systems that only flush hourly.
- Consumers batch by design (daily models, nightly finance).
- Correctness requires multi-source joins that you have not modeled as timed windows or versioned snapshots.
- You lack lineage, schema discipline, and on-call—so lag will be discovered by users first.

I have seen teams replace a 15-minute batch job with a "real-time" pipeline and keep a 20-minute end-to-end delay because the bottleneck was an upstream approval queue and a downstream cache with a long TTL. The Kafka dashboard was green. The product was unchanged.

## The hidden product decisions

Near-real-time forces choices people prefer to leave implicit:

**1. What is the system of record?**  
If two stores disagree, which one is allowed to win in the UI? If you cannot answer, "real-time sync" becomes "real-time conflict generation."

**2. Is the promise best-effort or contractual?**  
Best-effort freshness is a feature enhancement. Contractual freshness is a reliability problem with paging and executive attention. Do not market the second if you staffed the first.

**3. Who pays for fan-out?**  
Every new consumer multiplies load, schema coupling, and incident surface. Platforms that treat every request as free become unmaintainable.

**4. What does "correct" mean while catching up?**  
After an outage, is a 2-hour backlog replayed in order, sampled, skipped, or rebuilt from snapshots? Product behavior during catch-up is part of the design, not an ops footnote.

## A platform shape that works

The patterns that scale organizationally look less like "one mega topic" and more like:

1. **Ingest with explicit source contracts** — schema, ownership, change policy, known delay characteristics.
2. **A durable log or CDC trail where it earns its keep** — not everywhere by default.
3. **Materialized products per consumer class** — serving stores optimized for access patterns, not one serving layer pretending to be universal.
4. **Freshness and correctness signals next to latency** — lag is necessary, not sufficient.
5. **Replay and rebuild as product features** — if you cannot rebuild, you cannot sleep.

The job of a data platform team is not to own every consumer query. It is to make the path from source truth to trustworthy product views boring, measurable, and hard to misuse.

## Questions I ask before approving "let's go real-time"

- What decision improves if this goes from 30 minutes to 30 seconds?
- Which consumer will notice first if we miss the SLO, and how?
- What is the p95 source delay *before* our system exists?
- Can we rebuild the dataset from scratch in a known time budget?
- Who is on-call for freshness misses—and do they have a runbook that is not "restart the consumer"?
- What is the cost model at 3× and 10× event volume?

If the answers are vague, start with a tighter batch loop, better instrumentation, and a clearer ownership model. You can buy a cluster in an afternoon. You cannot buy a product promise that way.

## Closing

Near-real-time is not a badge for your architecture diagram. It is a **promise about time, truth, and behavior under stress**. Streaming infrastructure can help you keep that promise. It cannot invent the promise for you.

If you are evaluating a "real-time platform" initiative, write the consumer-facing freshness contract first. Then choose the smallest architecture that can keep it—and prove it with metrics the product team actually feels.
