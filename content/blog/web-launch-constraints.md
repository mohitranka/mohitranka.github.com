Title: What “led the web launch” taught me about constraints
Date: 2022-07-06 10:00
Category: Blog
Slug: web-launch-constraints
Tags: engineering-leadership, product, developer-tooling

"Led the web launch" fits on a resume line. The useful part is not the launch date. It is the constraint set that made the work hard—and the discipline of shipping inside it.

<!--more-->

At Postman I was part of taking a product people already loved in one form and making it real on the web. The details of any one company fade. The constraint patterns transfer.

## Constraint 1: You are not inventing trust—you are borrowing it

When a product already has users, a new surface is judged against memory. Performance, reliability, and mental model mismatches feel like regressions even when they are "v1 web" realities.

That changes engineering priorities:

- Parity on core workflows beats novel architecture theater  
- Predictable latency beats exotic efficiency  
- Clear "not yet on web" boundaries beat silent missing features  

Trust is a constraint. You can spend it once.

## Constraint 2: The existing system is a stakeholder

Greenfield essays assume you choose the stack. Real launches inherit APIs, auth models, billing, feature flags, and organizational scars.

Leading a launch means negotiating with the present:

- What must be reused for correctness  
- What may be isolated to move faster  
- What must be fixed at the root because the new surface will amplify the bug  

Treating legacy as an enemy wastes time. Treating it as a stakeholder produces interfaces.

## Constraint 3: Launch is a reliability event, not a marketing timestamp

Marketing picks a day. Users pick the hour they migrate critical work. Those are not the same.

Engineering leadership for a launch is mostly:

- Load assumptions written down and tested  
- Rollback and partial exposure plans  
- On-call staffing that is not "whoever is excited"  
- Dashboards that answer user pain, not only host health  

If you cannot describe how you will be wrong safely, you are not ready to be public.

## Constraint 4: Cross-team coordination is the critical path

Web launches fail more often on handoffs than on code:

- Design vs eng vs product scope drift  
- Security review arriving late  
- Support documentation not matching UI  
- Data/analytics not instrumented for the new surface  

As an EM, my calendar was the project plan. Unblocking decisions early beat heroic coding late.

A practical habit: maintain a single **decision log** for scope cuts. Ambiguity multiplies under deadline pressure.

## Constraint 5: Scope cuts are a product skill

Everyone loves the full vision. The launch needs a spine:

- What must work for the first serious cohort  
- What can be ugly but correct  
- What is explicitly later  

The hard part is not cutting. It is cutting **without demoralizing the team** or surprising the company. Transparent criteria help: user impact, risk, dependency weight, reversibility.

## Constraint 6: Developer products punish sloppy feedback loops

If your users are technical, they notice:

- Slow first load  
- Awkward auth  
- Inconsistent shortcuts  
- Error messages that lie  

They also write about it publicly. That is a feature of the market. Quality bars for developer tooling are emotional as well as functional.

## What I would repeat

1. **Write the non-goals** as carefully as the goals.  
2. **Instrument journeys**, not only services.  
3. **Rehearse failure** (partial outage, auth issues, dependency brownout).  
4. **Staff the week after launch** like it is part of the launch.  
5. **Protect engineers from thrash** by batching stakeholder input.

## What I would avoid

- Betting the launch on an unfinished platform rewrite  
- Hidden scope in "polish"  
- Success metrics that only marketing can love  
- Hero culture that makes the second week impossible  

## Closing

Leading a web launch taught me that big shipping moments are constraint problems: trust, legacy, reliability, coordination, and scope. Code is how you express the answers—not the answers themselves.

If you are heading into a similar moment, spend more time making constraints explicit. Teams move faster when the walls are visible.
