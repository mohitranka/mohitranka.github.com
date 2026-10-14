Title: RDBMS vs. NOSQL?
Date: 2013-06-29 00:16
Category: Blog
Slug: rdbms-vs-nosql
Tags: data-platforms, databases, architecture
Modified: 2026-10-14 14:30

I came across Werner Vogels' [article on DynamoDB](http://www.allthingsdistributed.com/2013/03/dynamodb-one-year-later.html) while researching the database. His argument was that applications without a need for joins, complex queries, or transactions could be better served by a NoSQL store.

I respect Werner. I would still take that advice with a pinch of salt. Amazon also has a database to sell.

<figure class="post-figure">
  <img src="{static}/images/blog/rdbms-vs-nosql.jpg" alt="Illustration comparing ordered relational tables with flexible document nodes" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Choose a datastore for the workload and the team operating it.</span>
  </figcaption>
</figure>

<!--more-->

Most applications never reach the scale at which a relational database becomes their main problem. They do need a schema, queries, backups, monitoring, and people who know how to operate the system. Relational databases have a fairly good head start on all of those.

My starting point is a relational database unless a requirement makes that a poor fit. These are the requirements I would examine.

## Availability beyond one server

A single database process is a point of failure. A crash or maintenance event can make the application unavailable.

If the availability target cannot tolerate that, evaluate replication, failover, or a distributed setup. That may be relational or non-relational. Choosing NoSQL does not by itself establish an availability guarantee.

Be explicit about the consistency you need during failures. “Always available” is not a useful requirement until you explain what answers the application is allowed to return.

## Data that does not fit the model

Schemas help you express relationships and constraints. They also allow queries you did not anticipate on day one.

Some data does not fit that model neatly. Highly varied documents can justify a different store. Relational systems can accommodate some of this with features such as PostgreSQL's hstore and JSON support, but that does not mean every shape becomes pleasant to query.

Ask whether schema flexibility is a real need or simply a wish to avoid deciding what the data means. A database without a fixed schema does not remove that question from the application.

## Growth beyond one machine

There is a limit to how much CPU, memory, and storage you can put on one server. If the expected workload exceeds it, you need a scaling plan.

That could involve partitioning, a relational cluster, or a non-relational store designed around the access pattern. Each choice adds operational and correctness work. Compare that cost with the workload you actually expect.

Most of the time, I would start with the system the team knows and can recover. Change it when a concrete requirement earns the extra complexity.

NoSQL is useful. So are relational databases. Neither needs you to join a side.
