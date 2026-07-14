Title: Platforms that survive real traffic
Date: 2026-07-15 10:00
Category: Blog
Slug: platforms-that-survive-real-traffic
Summary: Lessons from building data platforms and distributed backends that still work when traffic, teams, and ambiguity all show up at once.
Tags: platforms, architecture, engineering

Building a platform is easy in a slide deck. Surviving real traffic is harder: partial failures, messy ownership, and product questions that refuse to stay still.

I have spent a large part of my career on systems that sit under other systems — data platforms, identity and SSO, developer tooling, and the kind of backends teams only notice when they break. The pattern that keeps recurring is simple: **clarity beats cleverness when the blast radius is large**.

## Start from the job, not the architecture diagram

The useful question is rarely “Kafka or Kinesis?” or “monolith or microservices?” It is:

1. What decision does this system make possible?
2. Who is on call when it lies?
3. What is the cost of being wrong for five minutes vs five hours?

If you cannot answer those, the diagram is decoration.

At LinkedIn, consolidating diverse data sources into a near-real-time platform was less about a single technology choice and more about making downstream consumers trustworthy. At Booking.com, identity and SSO work was less about protocol purity and more about not stranding real people mid-login. At Postman, the web launch was less about shipping a UI and more about a path that would still make sense as usage grew.

## Prefer boring contracts

Platforms age better when their external contracts are boring:

- Stable schemas with explicit versioning
- Explicit SLOs instead of implied “it feels fast”
- Clear ownership of freshness, correctness, and recovery
- Operability first: metrics, traces, and runbooks before the clever abstraction

Clever internal design is fine. Clever *interfaces* are a tax other teams pay forever.

## Design for partial failure as the default

Real traffic does not fail cleanly. A dependency times out. A region degrades. A consumer double-writes. A backfill races an online path.

Systems that survive tend to:

- Degrade to a known safe mode rather than invent a new failure mode
- Make retries idempotent and observable
- Separate “cannot complete” from “do not know”
- Treat data quality as a first-class product surface, not a weekend chore

## Optimize for multi-team leverage

The point of a platform is leverage. That means your success metric is not “we shipped a service.” It is “another team shipped faster *and* slept better.”

That changes design priorities:

- Self-serve over ticket-driven access
- Guardrails over unrestricted power
- Documentation that answers “what happens if I do the wrong thing?”
- Migration paths that do not require heroic freezes

## A short checklist I still use

When reviewing a platform proposal, I ask:

- What is the unit of correctness?
- What is the unit of failure isolation?
- Who can break this without knowing they did?
- How do we know the data is late vs wrong vs incomplete?
- What is the rollback story for schema *and* traffic?
- Can a new team onboard without a tribal walkthrough?

If the answers are vague, the system will eventually become a museum of special cases.

## Clarity over cleverness

I prefer systems that a strong engineer can reason about under stress. Cleverness is not the enemy — unaccountable cleverness is. Long-term impact usually comes from making the next decision easier for the people who inherit the system, not from impressing the people in the design review.

That is the work I still like most: turning fuzzy product questions into pragmatic, well-instrumented systems that survive real traffic and real people.
