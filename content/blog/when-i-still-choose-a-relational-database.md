Title: When I still choose a relational database
Date: 2025-03-13 10:00
Category: Blog
Slug: when-i-still-choose-a-relational-database
Tags: data-platforms, databases, architecture
Modified: 2026-10-14 14:30

In 2013, I wrote [RDBMS vs. NOSQL?]({filename}/blog/rdbms-vs-nosql.md) because database advice was getting ahead of database requirements.

I still start with a relational database for many product backends. Users, accounts, permissions, orders, and configuration usually have relationships and invariants that fit the model well.

That is a default, not a loyalty programme. A different workload can justify a different store.

<figure class="post-figure">
  <img src="{static}/images/blog/when-i-still-choose-a-relational-database.jpg" alt="Illustration of an ordered data table foundation beside scattered documents" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Keep the source of truth clear when adding specialised stores.</span>
  </figcaption>
</figure>

<!--more-->

## Start with the things that must stay correct

If the product needs several records to change together, transactions can make correctness much easier to reason about. Moving that responsibility into application code is a choice with an ongoing cost.

I also value the ability to evolve queries. Early products change their questions. A relational schema with appropriate indexes often accommodates that more easily than a store built around a narrow access pattern.

Operational familiarity matters. A team that knows how to diagnose, restore, and run a database has an advantage over a team operating its theoretically ideal store for the first time.

None of this excuses ignoring load. Measure the workload and test the recovery path.

## Move specialised work out when it earns its place

The primary database does not need to answer every question.

Search, analytics, high-volume telemetry, and some graph or time-series workloads may benefit from separate systems. Treat those as deliberate read models or specialist stores, with a clear source of truth and a way to rebuild them.

Before moving the transactional core, I want evidence of the limit: write saturation, state size, contention, unacceptable recovery time, or a topology requirement the current system cannot meet.

Read replicas help read capacity. They do not remove every write or consistency constraint. A bigger machine is also a plan with a limit, not an insult to distributed systems.

## The seams become your responsibility

Once data moves between stores, you need change propagation, replay, failure handling, and a definition of acceptable lag.

Avoid casual dual writes. If one write succeeds and the other fails, somebody must know how to detect and repair the difference. Derived systems simplify the primary workload only if their recovery is designed.

The same reasoning applies to service boundaries. Keep capabilities together where shared invariants dominate. Split them where independent operation or deployment pays for the additional coordination.

## Ask before adding a primary store

1. Which queries and invariants does the product need?
2. What data volume and throughput do we expect, with headroom?
3. Where will multi-record correctness be enforced?
4. How will access patterns and schemas change?
5. Who will operate it and restore it after failure?
6. Which measured requirement rules out the simpler option?

NoSQL covers many different systems and trade-offs. It is not a single alternative to SQL, much less a sign that the architecture has become serious.

Use the system that fits the work. Prefer the one your team can explain and recover.
