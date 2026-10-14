Title: Identity systems fail socially before they fail cryptographically
Date: 2023-03-08 10:00
Category: Blog
Slug: identity-systems-fail-socially
Tags: identity, security, distributed-systems
Modified: 2026-10-14 14:30

An identity system can validate every token correctly and still leave the wrong person with access.

The protocol matters. So do the decisions around it: who counts as the same person, who can grant access, what logout means, and who removes privileges when someone's role changes.

My work on identity infrastructure made me wary of designs that spend all their attention on tokens and leave those workflows implicit.

<figure class="post-figure">
  <img src="{static}/images/blog/identity-systems-fail-socially.jpg" alt="Illustration of keys, badges, and people connected in a trust network" loading="lazy" width="1200" height="675">
  <figcaption>
    <span class="fig-caption">Identity workflows need explicit owners and session semantics.</span>
  </figcaption>
</figure>

<!--more-->

## Start with the person, not the token

Enterprise identities come from HR systems, directories, partner identity providers, and application databases. Those records will not always agree.

Define the subject identifier and who can change it. Account linking, splitting, and recovery need explicit procedures. Otherwise reconciliation scripts gradually become the place where your identity model actually lives.

SSO gives applications a common authentication path. It does not repair an ambiguous account model.

## Temporary access needs an end

Demo accounts, support impersonation, integration users, and emergency access all have legitimate uses. They also create paths around normal controls.

Give exceptions an owner, expiry, and audit trail. Make removal a normal operation. A temporary bypass with no removal mechanism is simply a permanent bypass with optimistic documentation.

Break-glass access should remain usable during an incident. Its use should also be visible and reviewed afterwards.

## Specify what logout and revocation mean

A user may end one application session while an identity-provider session or another application's refresh token remains valid. Whether that is a bug depends on the promised behaviour.

Define that behaviour across applications and devices. Distinguish local logout, global logout, token expiry, and access revocation. Test shared-device and account-recovery scenarios, not just a successful login.

For revocation, include downstream caches and propagation delay. Saying access was removed is incomplete if another service can still honour it for an hour.

## Treat the login path as production infrastructure

Auth changes can prevent users from reaching everything else. Use progressive rollout, synthetic journeys, and rollback procedures that have been exercised.

Assign an operational owner for the end-to-end path. Security policy, identity-provider availability, application sessions, DNS, and recovery email may involve different teams. The incident still needs someone responsible for coordinating the response.

I would review cryptography and organisational workflows together. Neither compensates for the other. Correct token validation is little comfort when the entitlement was granted to the wrong account.
