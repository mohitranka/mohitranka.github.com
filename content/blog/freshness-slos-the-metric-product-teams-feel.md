Title: Freshness SLOs: the metric product teams actually feel
Date: 2024-07-11 10:00
Category: Blog
Slug: freshness-slos-the-metric-product-teams-feel
Tags: data-platforms, reliability, observability
Modified: 2026-10-14 14:30

A pipeline can be green while the dashboard is wrong. Or late. Or showing a different number from the other dashboard everyone also calls official.

At LinkedIn, the Enterprise Data Platform (EDP) was intended to become the governed source for go-to-market data. BI teams could already get data through Hadoop-based pipelines. Moving them onto EDP meant dealing with the entire path to a usable dashboard, including the parts outside our platform.

That is why I care about freshness separately from request latency.

<figure class="post-figure">
  <img src="{static}/images/blog/freshness-slos-the-metric-product-teams-feel.jpg" alt="Illustration of a freshness gauge on an operations dashboard" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Measure data age where the consumer uses it.</span>
  </figcaption>
</figure>

<!--more-->

## A fast query can return old data

Latency measures how long a request takes. Freshness measures how old the data is when someone uses it.

An API can respond in 100 milliseconds with yesterday's data. Its latency SLO is doing fine. The person making a decision may be doing considerably worse.

For a useful freshness target, name the dataset, consumer, acceptable age, and owner. For example: a sales dataset available in a particular BI workflow within an agreed interval. The interval should come from the decision being supported, rather than whichever number looks impressive on the platform dashboard.

Measure the whole path: source delay, ingestion, validation, dataset readiness, BI refresh, and caches. Otherwise a fast ingestion service can conceal a slow extract schedule.

## Freshness needs correctness beside it

Making the wrong number arrive sooner is not an improvement.

During migration, two recent datasets can disagree because they come from different paths. Before tightening the time bound, establish which path is authoritative, who owns critical fields, and how consumers learn about changes.

Check completeness as well as age. A dataset can have a recent timestamp and still be missing the records that matter.

## Start with a promise you can keep

On the EDP migration, the practical commitments included migration support, acceptable query performance, deprecation dates, and a finite period of running both paths. Those commitments changed behaviour. A polished SLO document on its own would not have done that.

I would not describe every migration milestone as an SLO. A measured reliability target and a delivery commitment are different things. Both need owners, but only the former tells you how often an ongoing service promise is being met.

Start with one important consumer journey. Agree on the bound, measure breaches, and decide what changes when you miss it. If repeated misses never affect priorities, the target is decorative.

Product teams experience the number they can use. Measure that, even when the slowest part belongs to someone else.
