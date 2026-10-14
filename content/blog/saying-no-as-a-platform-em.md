Title: Saying no as a platform EM without becoming the villain
Date: 2023-11-08 10:00
Category: Blog
Slug: saying-no-as-a-platform-em
Tags: engineering-leadership, platforms, management
Modified: 2026-10-14 14:30

A platform team can say yes to every request and still disappoint everyone. The work gets queued, exceptions accumulate, and the same engineers become responsible for more than they can operate.

As a platform EM, I found the useful part of saying no was making the alternative concrete: what we could support, what it would cost, and who could change the priority.

Two situations from LinkedIn's Enterprise Data Platform (EDP) illustrate that.

<figure class="post-figure">
  <img src="{static}/images/blog/saying-no-as-a-platform-em.jpg" alt="Illustration of a fork in the road with one path closed and an alternate route open" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Make capacity, trade-offs, and alternatives visible.</span>
  </figcaption>
</figure>

<!--more-->

## No to an unfunded migration

BI teams using Power BI and Tableau already had Hadoop-based data paths. Asking them to adopt EDP because it was strategic did not give them time to migrate or reduce the risk to their dashboards.

The useful decision was to fund the transition. EDP engineers helped with connectors, migration, and performance. Leadership made deprecation a priority, with dates for ending the old paths.

That was more expensive than issuing a mandate. It also addressed the actual objection.

A platform cannot become the source of truth while treating the work of moving consumers onto it as somebody else's problem.

## No to an indefinite architecture argument

On the self-serve portal, disagreement over monoliths and microservices held up execution for about a month. There were credible technical concerns on both sides, but no effective path to a decision.

We wrote evaluation criteria, time-boxed proofs of the alternatives, and brought in a neutral senior engineer. I also worked with the engineers on ownership and how they challenged each other.

The decision was hybrid: keep tightly integrated capabilities close to EDP, separate workflows where independent iteration helped, and centralise metadata with DataHub.

The point was not to find a compromise halfway between two preferences. It was to evaluate different needs separately and get the project moving again.

## Put a price on exceptions

Temporary branches and dual pipelines may be necessary. Give each an owner, expiry, support cost, and removal condition.

An exception without those things is a permanent commitment nobody has budgeted for.

When declining new work, show the existing commitments and what would move if the request became a priority. Give partners an escalation path. “The team is busy” explains very little; a visible trade-off gives them something to decide.

A yes with no capacity is not kinder than a no. It just delays the disagreement until there is less time to resolve it.
