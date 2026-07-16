Title: Cost regressions are production incidents
Date: 2021-11-03 10:00
Category: Blog
Slug: cost-regressions-are-production-incidents
Tags: reliability, data-platforms, engineering-leadership

We page for latency, errors, and saturation. We shrug at a 30% cost jump that arrives with the same deploy. That asymmetry is irrational. **Money is a production signal.**

<!--more-->

In data platforms and backend systems, cost regressions are often the first visible sign of:

- A fan-out bug  
- A broken partition filter  
- An accidental full scan  
- A retry storm  
- A "temporary" backfill that never ended  
- A feature flag defaulted wrong  

If your reliability culture ignores cost, you will learn about these from finance—late, bluntly, and without a stack trace.

## Why cost belongs next to SLOs

SRE taught us that user-visible symptoms deserve automated response. Cost is user-visible at company scale: it constrains hiring, pricing, and how much platform you can afford to run.

Treat cost as a service level indicator where it matters:

- Per pipeline or service unit cost  
- Per tenant cost for multi-tenant platforms  
- Storage growth rate vs plan  
- Warehouse/scan bytes  
- Egress that should not exist  

You do not need perfect unit economics on day one. You need **anomaly detection tied to ownership**.

## What a cost incident looks like

Define it like any other incident class:

- **Symptom**: spend or projected spend exceeds threshold vs baseline  
- **Severity**: based on burn rate and blast radius, not embarrassment  
- **Commander**: service owner, not "whoever understands the cloud bill"  
- **Mitigations**: disable flag, rate-limit, stop backfill, roll back, tighten retention  
- **Follow-up**: prevent silent recurrence with tests, budgets, or gates  

The first time you declare a SEV for cost, it will feel awkward. The third time, it will feel obvious.

## Architecture choices that prevent cost pages

**1. Make expensive paths explicit.**  
Large scans, cross-region copies, and fan-out APIs should be hard to do by accident.

**2. Budget in the design review.**  
"What does this cost at 10×?" is not a finance question. It is a scalability question.

**3. Separate exploratory from production compute.**  
If analysts and production share unconstrained capacity, production will pay for curiosity.

**4. Retention is a feature.**  
Default forever is an incident scheduled on a calendar.

**5. Backfills require tickets and kill switches.**  
History rewrites should not be a casual cron.

## Cultural resistance (and answers)

**"Engineers should not think about money."**  
Engineers already think about CPU and memory. Cost is those resources with an invoice.

**"Cloud bills are too lagged to page on."**  
Then instrument leading indicators: scan bytes, task hours, partition pruning rates, queue depth for heavy jobs. Page on the lead, reconcile on the lag.

**"This will slow delivery."**  
Unbounded cost slows delivery harder—with hiring freezes and emergency migrations.

## A minimal operating model

1. Tag resources by service/team/dataset.  
2. Publish weekly cost by owner.  
3. Alert on sudden deltas and on forecast breach.  
4. Include cost in incident taxonomy.  
5. Review top regressions in the same forum as reliability.

Platform EMs should be able to name their top three cost risks the way they name their top three reliability risks.

## Closing

A system that is correct, fast, and quietly unaffordable is not healthy. It is pre-incident.

Put cost on the same operational shelf as latency and errors. Your future self—and your finance partner—will treat that as basic professionalism, not thrift theater.
