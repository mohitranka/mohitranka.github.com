Title: AI features that deserve a data contract
Date: 2020-07-01 10:00
Category: Blog
Slug: ai-features-that-deserve-a-data-contract
Tags: ai, data-platforms, product

AI features fail in public when the model is only half the system. The other half is data: what went in, what it meant, who owned it, and how fresh it was. If that half is informal, you do not have an AI product. You have a demo with an API key.

<!--more-->

## The contract is the product boundary

A data contract for AI is a written agreement between producers and consumers of the signals a model or agent uses:

- Schema and semantics  
- Allowed uses  
- Freshness and completeness expectations  
- Access control and retention  
- Compatibility policy when fields change  
- Owners on both sides  

This is not paperwork theater. It is how you stop silent training-serving skew, prompt context rot, and "the model got dumber" mysteries that are actually upstream breakage.

## Which AI features need contracts (almost all of them)

**Definitely:**

- Retrieval-augmented answers over internal knowledge  
- Personalization or ranking features  
- Agents that take actions (tickets, configs, messages)  
- Anything touching PII, money, or security decisions  
- Evaluation datasets used as ship gates  

**Maybe lighter-weight:**

- Purely creative one-off tools with no enterprise data  
- Offline experiments with throwaway inputs  

If a feature can change a user’s state or cite organizational truth, contract it.

## What goes in a practical contract

Keep it short enough that teams will read it:

1. **Dataset / tool name** and owner  
2. **Fields** with types and meaning (not only JSON shape)  
3. **Grain** (per user, per doc, per event)  
4. **Freshness SLO** and known source delays  
5. **Completeness** expectations (null rates, coverage)  
6. **Authz model** for read and for downstream display  
7. **Change policy** (notice period, versioning)  
8. **Eval impact** — which offline/online tests must pass after changes  

If your "contract" is only a Spark table name in a wiki, you have a pointer, not a contract.

## Why AI makes this more urgent than classic BI

BI can often tolerate a broken dashboard for a morning. AI features turn bad data into **confident wrong actions**:

- Hallucinated citations from stale docs  
- Agents using revoked permissions still present in a cache  
- Training sets that silently dropped a population  
- Feature stores that do not match online availability  

The failure mode is not "number looks off." It is "system did something."

## Evaluation is part of the contract

Do not separate "data quality" from "model quality" as if they are different religions.

Ship gates should include:

- Retrieval hit quality on a golden set  
- Groundedness checks where applicable  
- Permission-aware evals (can the user see this?)  
- Regression sets for known incidents  
- Online monitors for deflection, escalation, or edit distance from accepted answers  

When the contract breaks, evals should fail before Twitter does.

## Organizational pattern that works

- **Producers** own correctness of sources and change communication  
- **Platform** owns enforcement, discovery, lineage, access  
- **AI product team** owns feature behavior and eval suites  
- **Security/legal** own policy constraints that contracts must encode  

Shared Slack channels are not a substitute for ownership.

## A sequence I recommend for new AI features

1. Write the user promise in one sentence.  
2. List every external truth the feature depends on.  
3. Draft contracts for those truths *before* prompt polishing.  
4. Build evals that break when contracts break.  
5. Only then scale traffic.

Teams love to start at step "try models." Steps 1–4 are where senior engineering judgment shows up.

## Closing

AI did not retire data platforms. It made them more visible.

If you want AI features that survive contact with production, give them what every serious data product needs: **explicit contracts, owners, freshness, and tests that care when truth drifts.**

Models will keep changing. Contracts are how your product stays honest while they do.
