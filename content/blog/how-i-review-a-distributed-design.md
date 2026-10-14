Title: How I review a distributed design in 45 minutes
Date: 2021-03-03 10:00
Category: Blog
Slug: how-i-review-a-distributed-design
Tags: distributed-systems, engineering-leadership, architecture
Modified: 2026-10-14 14:30

A design review can end with everyone understanding the diagram and nobody knowing what to do next.

On an EDP self-serve portal, disagreement over monoliths and microservices held up delivery for about a month. Both approaches had reasonable arguments. The discussion also undermined ownership, and the project stopped moving.

A short review will not finish a distributed design. It can expose the assumptions and decisions that need more work. This is the structure I use when I have about forty-five minutes.

<figure class="post-figure">
  <img src="{static}/images/blog/how-i-review-a-distributed-design.jpg" alt="Illustration of an architecture whiteboard with boxes, arrows, and coffee cups" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">A short review should expose the decisions that need more work.</span>
  </figcaption>
</figure>

<!--more-->

## First, establish the promise

Spend the first five minutes on the user journey, scope, and non-goals.

For the portal, the job was dataset registration, access, governance, and metadata management. It was not an opportunity to rebuild the entire platform. That distinction removed quite a lot of architecture from the conversation.

Ask someone to walk through one real action. A sequence through the system tells me more than another diagram of service boxes.

## Find the state that must be correct

For the next ten minutes, identify the system of record and the invariants.

Which operation must be atomic? What can be delayed? Where does metadata live? If two services disagree, which one wins, and how does the other recover?

For the portal, core capabilities depended closely on the existing EDP backend. Other workflows needed more independent iteration. Metadata lifecycle belonged in a shared catalog; we used DataHub.

Those were different needs. There was no reason they all had to get the same deployment model.

## Walk through failure

Use another ten minutes for timeouts, retries, partial writes, replay, and dependency failure. Identify how the user sees a partial success and how an operator repairs it.

Also check ownership. Who can decide? Who runs the service? Who owns a failed interaction between teams? A technically sound design can still sit untouched if those answers are missing.

## Decide what needs evidence

We used written criteria covering scalability, maintainability, delivery speed, and ownership. Both approaches got time-boxed proofs, with a neutral senior engineer helping evaluate them.

A proof should test the disputed assumption. It should not become a smaller implementation of each person's preferred architecture.

In parallel, I worked with the engineers on how disagreement was being handled. Restoring ownership was necessary for the technical decision to stick.

## Leave with a decision and its limits

The result was a hybrid: keep tightly integrated core capabilities close to EDP, allow separate services where independent iteration justified them, and centralise metadata.

Write down the decision, owner, conditions, and what would cause a review. Reserve the final minutes for that record.

Forty-five minutes is a triage window, not an approval guarantee. If a critical invariant or recovery path remains unclear, the useful outcome is a named investigation. Approving a design just to finish the meeting is an expensive way to save five minutes.
