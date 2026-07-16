Title: When I still choose a relational database
Date: 2025-03-13 10:00
Category: Blog
Slug: when-i-still-choose-a-relational-database
Tags: data-platforms, databases, architecture

In 2013 I wrote [RDBMS vs. NOSQL?]({filename}/blog/rdbms-vs-nosql.md) as a pushback against fashion. The fashion changed costumes—document stores, wide-column, NewSQL, "Postgres is fine," "everything in the lakehouse"—but the underlying mistake did not: **picking a datastore from a blog post instead of from access patterns and failure modes.**

<figure class="post-figure">
  <img src="{static}/images/blog/when-i-still-choose-a-relational-database.jpg" alt="Illustration of an ordered data table foundation beside scattered documents" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">A relational spine is often the boring default until access patterns and failure modes force a different shape.</span>
  </figcaption>
</figure>

<!--more-->

This is the sequel I would write to myself: when I still choose a relational database in 2026, and when I do not. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

## The default remains boring on purpose

My default for a new product backend is still a managed relational database (usually PostgreSQL) with: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

- Clear schema ownership
- Migrations as code
- Backups and point-in-time recovery you have actually restored
- Connection pooling and boring observability
- A plan for read scale that is not "wishful replicas"

Why? Because most products are **transactional workflows with relationships**: users, accounts, permissions, orders, configurations, audit trails. Relational databases are extraordinarily good at that shape. They also match how humans reason about correctness. If your primary problems are multi-row invariants, ad hoc query flexibility, and operational maturity, starting elsewhere is often self-inflicted difficulty.

## When relational is the right call

I lean relational when several of these are true: **1. Strong invariants matter more than infinite write scale.**  
Money, entitlements, identity bindings, "exactly one active X per Y." If the business invariant is relational, fighting the model is expensive. **2. Query patterns are still evolving.**  
Early products change questions weekly. A well-modeled schema with indexes beats a write-optimized store that makes new questions painful. **3. The team’s operational muscle is SQL-shaped.**  
A perfect paper architecture with zero operators is worse than a known system with runbooks. Skills are part of architecture. **4. Multi-entity transactions simplify the product.**  
Saga forests can be correct. They are also a tax. If a single-node or lightly clustered RDBMS can hold the transactional core, keep the core small and sharp. **5. You need ecosystem gravity.**  
ORMs, migration tools, BI access, hiring, incident folklore—relational ecosystems are deep. That is not marketing; it is time-to-recovery.

## When relational becomes the wrong center

I move work *out* of the primary OLTP database when: **1. Write throughput or state size exceeds honest vertical + read-replica plans.**  
Not vanity metrics—measured saturation, vacuum pain, replica lag that product feels, backup windows that scare you. **2. Access patterns are append-heavy and query-narrow.**  
Event logs, high-volume telemetry, massive multi-tenant time series. Different stores exist for reasons. **3. Fan-out reads need specialized shapes.**  
Search, graph traversal at scale, feature stores, geospatial at high QPS—often better as **derived systems** fed from a transactional core. **4. Availability topology requirements outgrow your relational operator model.**  
Some multi-region active-active stories are possible with modern relational systems; many are still research projects wearing production clothes. Be honest about the topology you can run. **5. Schema flexibility is real, not aesthetic.**  
Truly heterogeneous documents with little shared query structure can be a poor fit. "We might need flexibility later" is not a requirement.

## The architecture that aged best for me

The pattern I trust: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

1. **Transactional system of record** in relational (or something with equal invariant strength).
2. **Explicit integration events** when other systems must react—versioned, owned, documented.
3. **Derived read models** for specialized query paths.
4. **Analytical systems** for heavy aggregation—do not abuse OLTP as a warehouse.
5. **Clear rules for dual writes** — preferably avoid them; if not, make correctness visible.

The relational database is not the universe. It is often the **spine**. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

## A related lesson from platform service boundaries

Not every “monolith vs microservices” fight is a datastore fight—but the same judgment applies. On an EDP self-serve portal, we had a month-long freeze over whether new UI workflows had to live entirely in a monolithic backend or split early for independent iteration. The useful answer was hybrid: keep **core platform capabilities** where integration and invariants dominate; split **fast-changing workflows** where deploy independence pays for the seam cost; put **metadata** in a system designed for lifecycle, not in accidental dual writes. That is the same muscle as choosing a relational spine: **optimize for ownership and correctness at the center, derive or split at the edges, refuse fashion-driven rewrites that stop delivery.**

## What changed since 2013

A few updates to my older self: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

- **Managed Postgres (and peers) are much better.** Failover, backups, and scaling knobs improved. That raises the bar for "we need NoSQL to be reliable."
- **JSON columns done carefully** cover many former document-store arguments—without abandoning transactions.
- **CDC became mainstream.** Turning relational truth into streams is a product pattern, not a science fair.
- **Distributed SQL exists** and can be right—but it is still a specialist choice with specialist costs.
- **Lakehouses ate a chunk of analytics**, which is good: stop pretending your OLTP DB is a lake.

What did *not* change: **NoSQL is not a personality.** It is a set of tradeoffs around consistency, query power, operational complexity, and scale. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

## Decision checklist I actually use

Before approving a non-relational primary store: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

1. Which queries and invariants are first-class in v1?
2. What is the 12-month data size and QPS with ugly margins?
3. What does multi-row correctness look like, and who enforces it?
4. How do we migrate schema or access patterns six months in?
5. Who is on-call, and what have they operated before?
6. Can we explain the choice in one paragraph without vendor slogans?

If step 6 requires a conference talk, the choice may still be right—but it needs more proof. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

## Closing

I still choose a relational database when I want **correctness, evolvable queries, and operational boredom** around the core of a product. I choose other systems when the access pattern or scale curve makes that boredom impossible. The winning move is rarely "pick a side." It is **keep a sharp system of record, derive aggressively, and refuse to let fashion rename your requirements.** If you want the older, more argumentative version of this stance, it is still here: [RDBMS vs. NOSQL?]({filename}/blog/rdbms-vs-nosql.md). The industry moved. The need for judgment did not.
