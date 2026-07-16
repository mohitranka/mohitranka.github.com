Title: Freshness SLOs: the metric product teams actually feel
Date: 2024-07-11 10:00
Category: Blog
Slug: freshness-slos-the-metric-product-teams-feel
Tags: data-platforms, reliability, observability

API latency SLOs changed how we run services. GTM data work taught me the sibling idea the hard way: product teams do not experience your job-success chart. They experience a dashboard that is late, wrong, or disagrees with another “official” number. At LinkedIn, BI teams on Power BI and Tableau could already pull data from Hadoop-era batch paths while the Enterprise Data Platform (EDP) was supposed to become the governed center for GTM datasets. Pipelines can be “green” while the business still feels stale or fragmented truth. That feeling is a freshness and trust problem—even when nobody is paging on consumer lag.

<figure class="post-figure">
  <img src="{static}/images/blog/freshness-slos-the-metric-product-teams-feel.jpg" alt="Illustration of a freshness gauge on an operations dashboard" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Product teams feel freshness as trust in the number—not as job-success charts on a platform dashboard.</span>
  </figcaption>
</figure>

<!--more-->

## Latency is not freshness

A fast dashboard query can still serve an extract that is hours old. A successful batch job can still leave sales and marketing acting on last night’s world. Latency asks: how long did this request take?  
Freshness asks: **how old is the truth this decision used?** If you only measure the serving API, you will celebrate the wrong layer.

## Define freshness in the consumer’s language

For EDP-shaped work, a useful definition was: > For a named GTM dataset and a named BI consumer, how old is the data at the moment someone uses it in a dashboard decision—and is it the governed path? That forces specifics: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

- **Dataset** — a sales or GTM entity people recognize.
- **Consumer** — a Power BI or Tableau workflow, not “analytics.”
- **Usable** — on the platform you claim is source of truth, not a leftover pipeline.
- **Age** — including batch boundaries and BI-side refresh behavior, not only platform ingest time.

You can formalize that into an SLO later. First you need a sentence a BI lead and a platform EM would both underline. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

## Promises that change behavior (not charts for their own sake)

On the BI migration, the promises that changed behavior were not abstract percentiles on a poster. They looked like: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

- **Continuity:** legacy Hadoop paths had deprecation dates—staying put was a risk posture, not a neutral default.
- **Funded cutover:** EDP engineers helped migrate; adopters were not asked to donate a quarter of calendar alone.
- **Acceptable query performance after switch** — so “governed” did not mean “slower dashboards.”
- **Finite dual-running** — two truths were a migration window, not a lifestyle.

Call those SLOs if your org has the discipline. Call them **operating promises** if you are still early. Either way, something has to hurt when the promise breaks—attention, prioritization, or the ability to keep the old path alive. I will not pretend every dataset had a polished error budget. What we had was executive visibility, migration milestones, and a definition of done that included turning legacy paths off.

## What to measure along a real path

For a BI consumer, time and trust hide in stages: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

1. Source systems and upstream delay  
2. Platform ingest and validation on EDP  
3. Dataset readiness / governance checks  
4. BI tool refresh or extract behavior  
5. Cache and workbook-level assumptions

Teams often discover the villain is not the fanciest processor. It is an extract schedule, a dual pipeline, or a cutover that never finished. Instrument the path your consumers actually use. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

## Correctness sits beside freshness

Fresh wrong data is worse than slightly stale right data. During migration, dual sources create a special failure mode: two numbers, both “recent,” different owners. Correctness signals that mattered in practice: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

- Is this dataset on the governed path?  
- Are legacy feeds still quietly serving production workbooks?  
- Do critical fields null out or drift after cutover?  
- Can someone name the system of record when a QBR fights itself?

Freshness without governance optimizes for speed of confusion. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

## How we introduced the promise for BI

The sequence that worked was not “roll out SLO framework company-wide”: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

1. Pick the consumer class already on the critical path (BI for GTM).  
2. Make adoption a leadership priority with a continuity narrative.  
3. Staff the migration so the new path is cheaper than it looks.  
4. Put dates on deprecation.  
5. Fix performance issues as platform bugs, not user error.  
6. Only then talk about tightening time bounds dataset by dataset.

If you start with twenty datasets and a perfect taxonomy, you will get a wiki. If you start with one embarrassing consumer journey, you might get a habit. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

## The objection we actually heard

**“We can already get the data.”**  
Yes. That is why platform-only arguments fail. Answer with end-of-life for the old path, labor for the new one, and proof that cutover does not degrade the dashboard. **“Batch is fine.”**  
Sometimes it is. Then write a batch promise (“available by time T for the weekly motion”) and still own correctness and deprecation. Batch without a promise is how shadow pipelines live forever.

## Closing

Product teams feel freshness as trust in the number. Platforms earn that trust when named consumers run on a governed path, old paths can die, and someone is accountable when the age of truth is wrong. Whether you brand it SLO or operating promise matters less than whether the company can point to **dataset + consumer + bound + owner**—and whether missing it changes next week’s work.
