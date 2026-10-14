Title: Introducing on-call without burning the team
Date: 2020-11-10 10:00
Category: Blog
Slug: introducing-on-call-without-burnout
Tags: reliability, engineering-leadership, platforms
Modified: 2026-10-14 14:30

Before we introduced a formal rotation at Postman, production issues were handled by whoever noticed and stepped in. Public GitHub reports added another route for problems to reach the team.

That arrangement looked flexible. In practice, ownership was unclear and the same people kept getting interrupted.

We needed predictable incident response without making reliability depend on a few engineers being permanently available.

<figure class="post-figure">
  <img src="{static}/images/blog/introducing-on-call-without-burnout.jpg" alt="Illustration of a calm night operations desk with a pager and schedule board" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Assign operational responsibility and the capacity to carry it.</span>
  </figcaption>
</figure>

<!--more-->

## Assign the work, then make room for it

We used primary and secondary roles.

The primary handled monitoring, incident response, and triage. Feature expectations dropped during that period. The secondary provided backup for major incidents, rather than becoming another primary for every message.

This capacity decision is easy to skip. If an engineer has the same delivery commitments plus operational responsibility, the schedule has not become more efficient. It has become fictional.

Our rotation used two-week windows, with a primary-to-secondary pattern to carry context forward. That cadence was a choice for our team, not a universal recommendation. Team size, incident frequency, and the demands outside working hours should determine the schedule.

## Make the handoff useful

Weekly team time included incidents, resolutions, support themes, adjacent risks, and follow-ups. The outgoing primary explained what the next person needed to know.

Major incidents got retrospectives. Recurring problems got playbooks so the next engineer did not have to rediscover the same recovery steps.

A handoff should transfer unresolved work to an owner. It should not transfer a pile of links and hope.

## Measure the burden as well as the service

The rotation made triage more systematic and spread production knowledge across the team. I would not attribute a precise response-time improvement to the rotation without a comparable baseline and incident mix.

For a new rotation, measure response time, alert volume, repeat incidents, after-hours interruptions, and how the work is distributed. Faster response is useful. Faster response achieved by repeatedly waking the same two people is not a sustainable result.

Noisy alerts need fixing. Repeated incidents need engineering time. Neither becomes acceptable because there is now a name on the rota.

## Protect it after the launch

Avoid consecutive primary stretches where possible. Do not let the secondary become free extra capacity. Give retrospective actions owners and time to complete them.

The manager's job includes defending that capacity when feature deadlines arrive. Otherwise the old volunteer system returns, wearing a new calendar.

On-call made responsibility clearer for us. Keeping it useful required treating operational load as real work, every planning cycle.
