Title: RDBMS vs. NOSQL?
Date: 2013-06-29 00:16
Category: Blog
Slug: rdbms-vs-nosql
Tags: data-platforms, databases, architecture

<blockquote><p>From our own experience designing and operating a highly available, highly scalable ecommerce platform, we have come to realize that relational databases should only be used when an application really needs the complex query, table join and transaction capabilities of a full-blown relational database. In all other cases, when such relational features are not needed, a NoSQL database service like DynamoDB offers a simpler, more available, more scalable and ultimately a lower cost solution.</p></blockquote>

<pre><code>            — Werner Vogels, CTO Amazon.com on when to use RDBMS
</code></pre>

<figure class="post-figure">
  <img src="{static}/images/blog/rdbms-vs-nosql.jpg" alt="Illustration comparing ordered relational tables with flexible document nodes" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Datastore choice is a tradeoff about access patterns and operations—not a fashion contest.</span>
  </figcaption>
</figure>


<p>I came across this quote in <a href="http://www.allthingsdistributed.com/2013/03/dynamodb-one-year-later.html">an article</a> while researching DynamoDB. I respect Werner a lot, but take his database-selection advice with a pinch of salt — he has a <a href="http://aws.amazon.com/dynamodb/">database</a> to sell.</p>

<!--more-->


<p>Most products never hit the kind of <em>scale</em> that relational databases cannot serve. RDBMSs have been around for decades and still work fine, including at <a href="https://www.facebook.com/MySQLatFacebook">large scale</a>. There are <a href="http://dev.mysql.com/">mature</a> <a href="http://www.postgresql.org/">open source</a> options, well-understood schemas, solid support for filtering and aggregation, big communities, plenty of people who already know the tools, default framework integrations, and a deep ecosystem of operational tooling.</p>

<h2>RDBMS are great for almost everything, unless…</h2>

<p>Relational systems are easy to work with. Monitoring, backup, and ops tooling is strong (and often free). They cover most use cases, help is easy to find, and — best of all — you probably already know them. Unless I have one of the requirements below, I would start with a single-node relational database.</p>

<ul>
<li><h3>Super high availability</h3></li>
</ul>


<p>The database server process is a single point of failure. If it crashes, or if you take it down for planned or unplanned maintenance, the system goes with it.</p>

<p>If you need something close to 100% availability, look at clustered relational setups or distributed databases that trade consistency for availability — Cassandra, for example. Until that requirement is real and written down, stick with the boring option.</p>

<ul>
<li><h3>Flexible schema</h3></li>
</ul>


<p>One of the great strengths of relational databases is the schema itself — modelling, <a href="https://en.wikipedia.org/wiki/Database_normalization">normalization</a>, and related ideas. You can design a solid model without knowing every query pattern up front, and it usually holds up. That said, <a href="http://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model">not all data maps cleanly to tables and joins</a>. Postgres has some help via <a href="http://www.postgresql.org/docs/9.0/static/hstore.html">hstore</a> and <a href="http://www.postgresql.org/docs/current/static/functions-json.html">JSON</a>, but relational engines still prefer fixed schemas that play nicely with normalization. Flexible / EAV-style shapes <a href="http://karwin.blogspot.in/2009/05/eav-fail.html">tend</a> <a href="http://tonyandrews.blogspot.in/2004/10/otlt-and-eav-two-big-design-mistakes.html">to</a> <a href="https://www.simple-talk.com/opinion/opinion-pieces/bad-carma/">go badly</a> in an RDBMS.</p>

<p>If you genuinely need a flexible schema — and it is worth asking twice — look at NoSQL options. Do not pick them just because the schema feels slightly awkward on day one.</p>

<ul>
<li><h3>Horizontal scaling</h3></li>
</ul>


<p>If you expect data and traffic to grow beyond one machine, a single-node relational database will not be enough forever. There is only so much RAM and CPU you can throw at one box. Eventually you hit that wall, and then the choice is either a NoSQL system or a relational cluster.</p>

<h1>Epilogue</h1>

<p>NoSQL is not a panacea, and RDBMSs are still the right default for most applications. Unless you have a clear reason <em>not</em> to use a relational database, stick with one. Prefer the boring system until a real requirement forces something else — and write that requirement down so the next person does not re-open the debate from scratch.</p>
