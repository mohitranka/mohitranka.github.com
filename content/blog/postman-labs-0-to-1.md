Title: Incubating 0→1 beside a mature product
Date: 2021-06-15 10:00
Category: Blog
Slug: postman-labs-0-to-1
Tags: engineering-leadership, product, developer-tooling
Modified: 2026-10-14 14:30

A mature product gives you users, distribution, and a backlog large enough to bury most experiments.

At Postman, we wanted to explore protocols and workflows beyond the established HTTP client without taking capacity away from the product people already depended on. Postman Labs gave that work a separate place to develop.

The separation mattered. So did having a route back into the main product.

<figure class="post-figure">
  <img src="{static}/images/blog/postman-labs-0-to-1.jpg" alt="Illustration of a small lab greenhouse beside a solid product building" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Give experiments room to develop and a clear graduation path.</span>
  </figcaption>
</figure>

<!--more-->

## Protect exploration without disconnecting it

Labs used a small team familiar with Postman, lighter processes for experiments, and a clear success measure for each initiative.

The charter covered both new protocols and deeper workflows such as testing and automation. It gave the team permission to investigate without making every prototype a core-roadmap commitment.

That permission should include stopping. Otherwise you have created a feature team whose unfinished work is unusually difficult to question.

## Make each phase earn the next

The sequence was feasibility and market validation, then an MVP used internally, then a limited beta.

Each phase answered a different question. Is there a problem worth solving? Can we build a usable solution? Does it remain useful to people outside the team?

A prototype proves that something can be demonstrated. It does not prove demand, supportability, or a reason to graduate it.

Dogfooding helped expose usability and correctness issues before public rollout. Developer-tool teams have a convenient supply of demanding users sitting nearby. It is sensible to use them.

## New protocols change the workflow

WebSockets required persistent connections, bidirectional traffic, and an event history. Treating them as ordinary HTTP requests would have missed the reason developers wanted the capability.

gRPC brought Protobuf contracts, binary serialization, and unary and streaming calls. Users needed to compose requests and inspect what happened without leaving the tool.

Both required changes to the interaction model as well as network support. Their eventual place in Postman's broader product was the useful outcome of incubation.

## Plan the graduation

A successful experiment needs owners for maintenance, reliability, documentation, and support. Core teams should be involved before that transfer becomes urgent.

Reserve exploration capacity, define a success measure, and write the graduation criteria. Review retained use rather than counting launches alone.

Too much process can kill an experiment early. Too little accountability can keep it alive forever. Labs needs room to discover something useful and enough discipline to recognise when it has not.
