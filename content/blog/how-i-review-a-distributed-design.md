Title: How I review a distributed design in 45 minutes
Date: 2021-03-03 10:00
Category: Blog
Slug: how-i-review-a-distributed-design
Tags: distributed-systems, engineering-leadership, architecture

Design reviews expand to fill calendars. They do not have to. With a disciplined pass, you can learn whether a distributed design is roughly safe in 45 minutes—and leave the rest for deeper follow-up.

<!--more-->

This is the checklist I use as an engineering leader reviewing platforms, data paths, and multi-service features. It is not a substitute for formal modeling. It is a filter for **obvious danger and missing ownership**.

## Minute 0–5: What is the user promise?

Before boxes and arrows:

- Who is the user?  
- What do they believe will happen?  
- What is the freshness/consistency expectation in plain language?  
- What is explicitly out of scope?

If the promise is fuzzy, the design is not ready for deep technical debate. Send it back.

## Minute 5–15: Where does truth live?

I want one slide or paragraph on **systems of record**:

- Which store wins for each entity?  
- Are there dual writes? Why?  
- How do replicas and caches get invalidated?  
- What is the rebuild story if a derived store is wrong?

Distributed systems usually fail at truth propagation, not at drawing the second hexagon.

Red flags:

- "Both databases will stay in sync" without a mechanism  
- Caches as accidental systems of record  
- Events as hope rather than contract  

## Minute 15–25: Failure and partiality

Ask, quickly:

- What happens if service B is down for 10 minutes?  
- What happens if the message bus duplicates?  
- What happens if a consumer lags by two hours?  
- What happens if a deploy rolls back mid-migration?  
- What is the blast radius of a bad config?

I am not looking for perfect answers. I am looking for evidence the authors **visited** the failure space.

Green flags: timeouts, idempotency keys, dead-letter plans, explicit degradation modes, feature flags with defaults that fail closed or open intentionally.

## Minute 25–35: Operability

A design that cannot be run will be run poorly.

- Dashboards: the five signals you would open first  
- Alerts: what pages a human at 2am  
- Migrations: expand/contract steps  
- Multi-tenant risks: noisy neighbor, data isolation  
- Cost shape: what grows linearly (or worse) with success  

If on-call would need to SSH and guess, the design is incomplete.

## Minute 35–40: Security and tenancy edges

Short, pointed:

- Authn/z at each hop, not only at the edge  
- PII flows and retention  
- Admin/break-glass paths  
- Whether debug tooling can exfiltrate data  

You are not finishing a security review in five minutes. You are checking that security is not an appendix no one read.

## Minute 40–45: Decision and asks

End with a clear outcome:

- **Approve** with conditions  
- **Approve to prototype** only  
- **Revise** specific sections  
- **Escalate** a company-level tradeoff (multi-region active-active, new datastore class, etc.)

Write the conditions. Verbal approvals evaporate.

## The only diagram I insist on

If time is tight, I would trade three architecture diagrams for one **sequence of a write + a read after failure**. Sequence diagrams reveal lies that box diagrams hide.

## Anti-patterns in reviews

- Debating framework fashion before the data model  
- Endless bikeshedding of names  
- "We will monitor it" without naming metrics  
- Approving to avoid conflict  
- Requiring certainty appropriate for a research paper  

Your job is risk-priced progress, not theatrical rigor.

## Closing

Forty-five minutes is enough to test whether a distributed design has a clear promise, a coherent truth model, visited failure modes, and a runnable operating story. Everything else can be scheduled.

Use the time to find the sharp edges early—while they are still lines on a page, not pages in an incident report.
