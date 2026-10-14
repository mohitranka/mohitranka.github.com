Title: Near-real-time is a product promise, not a Kafka cluster
Date: 2026-07-16 10:00
Category: Blog
Slug: near-real-time-is-a-product-promise
Tags: data-platforms, distributed-systems, reliability
Modified: 2026-10-14 14:30

Before building a streaming pipeline, I want to know which decision improves when the data arrives sooner.

“Near-real-time” can mean seconds to one team and an updated dashboard before a morning meeting to another. Neither meaning tells you to buy a Kafka cluster.

On LinkedIn's Enterprise Data Platform (EDP), BI consumers already had working batch paths. The useful discussion was about trustworthy data in their actual workflows, and what it would take to migrate them.

<figure class="post-figure">
  <img src="{static}/images/blog/near-real-time-is-a-product-promise.jpg" alt="Abstract illustration of a clock and data streams feeding a product dashboard" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Choose the consumer’s time bound before choosing the pipeline.</span>
  </figcaption>
</figure>

<!--more-->

## Put a bound on usable data

Name the dataset, consumer, and maximum acceptable age at the point of use. Define the normal operating conditions and what happens when the bound is missed.

“Usable” matters. An event arriving at ingestion is not the same as a validated record available in a dashboard. BI extracts and caches can erase the benefit of a fast upstream pipeline.

Measure source-to-consumer delay before choosing the architecture. If an hourly extract dominates it, shaving milliseconds off processing will not deliver the promised experience.

## Check whether faster is worth the cost

A weekly reporting workflow may be well served by a reliable batch delivery. A decision that becomes invalid after minutes needs a different design.

The cost is broader than infrastructure. Streaming introduces ordering, replay, late events, state, and recovery work. You need operators who can explain what consumers see during catch-up, not just while the pipeline is healthy.

Choose the bound first. Then work out the least complicated system that can keep it.

## Migration is part of delivery

For BI teams using Power BI and Tableau, moving to EDP meant taking on migration effort and performance risk. Their existing path still produced data. Resistance was understandable.

EDP engineers helped with migration. Connectors reduced integration work. Performance after cutover became our responsibility. Deprecation milestones gave dual running an end.

Those choices made adoption practical. Faster infrastructure alone would not have done it.

## Define disagreement and failure

During cutover, which source wins if old and new numbers differ? Who can pause a bad publish? How do consumers know the data is late or incomplete?

A migration milestone is not a freshness SLO. Once the consumer is on the new path, measure the continuing time and correctness promise separately.

I would start with high-value datasets, prove the path with named consumers, and expand from there. A platform does not need to stream everything to be useful.

The achievement is a better decision made in time. A busy event log is supporting evidence at best.
