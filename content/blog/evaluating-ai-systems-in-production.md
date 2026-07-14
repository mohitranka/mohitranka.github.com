Title: Evaluating AI systems in production
Date: 2026-07-15 11:00
Category: Blog
Slug: evaluating-ai-systems-in-production
Summary: A practical rubric for judging whether an AI system is ready for real users — reliability, evaluation, ownership, and cost — without the demo-day fog.
Tags: ai, reliability, architecture, production

Demos lie. Production does not.

Most AI systems look impressive in a notebook and fragile in a product. The gap is rarely “the model is not smart enough.” It is usually evaluation, ownership, and the boring operational edges around a non-deterministic component.

This is the rubric I use when someone asks whether an AI feature is ready to sit in front of real users.

## 1. What is the product decision?

Start with the decision the system is supposed to improve:

- Summarize this so a human can act faster?
- Classify this so routing happens correctly?
- Generate a draft that a human will edit?
- Answer a question with a citable source?

If you cannot name the decision, you cannot name the failure. “Chat with our docs” is not a decision. “Reduce time-to-first-helpful-answer for support L1 without inventing policy” is.

## 2. What does “correct” mean?

For classical systems, correctness is often binary. For AI systems, you need an evaluation story:

- **Golden sets** for known critical cases
- **Regression sets** for bugs you already fixed
- **Online signals** for user repair, abandon, and escalation
- **Human review loops** for high-stakes outputs

If the only evaluation is “the founders liked the demo,” you do not have a production system. You have a prototype with confidence.

## 3. How does it fail, and how loudly?

I care less about average quality and more about the shape of failure:

- Does it refuse when uncertain, or invent with confidence?
- Can you detect low-quality output before the user does?
- Is there a safe fallback (search, template, human queue)?
- Are latency tails acceptable when the model or tool chain stalls?

Silent failure is worse than slow failure. Users will trust a confident wrong answer longer than they should.

## 4. Can you attribute and audit?

For anything customer-facing or policy-adjacent, ask:

- What context was retrieved?
- Which tools ran?
- Which model and prompt version produced the answer?
- Can you replay the decision later?

Without attribution, you cannot debug, cannot improve, and cannot explain yourself when something goes wrong.

## 5. Who owns the system after launch?

AI features often get built by a temporary squad and abandoned into a team that never agreed to the operational load. Before launch:

- Who is on call?
- Who owns prompt/model changes?
- Who owns evaluation drift?
- Who pays for the traffic spike when the feature works?

If ownership is fuzzy, cost and quality will both drift.

## 6. Is the cost curve acceptable at success?

Success is a load test. The unit economics that look fine at 100 queries/day can look absurd at 100k. Model choice, caching, retrieval breadth, and tool calls all need a cost envelope *assuming the feature is popular*.

Design for success costs, not only for launch-week costs.

## 7. Prefer boring architecture around a non-boring core

I like AI systems that keep the weirdness in one place:

- Deterministic orchestration around a probabilistic model
- Explicit tool interfaces with timeouts and budgets
- Clear separation between retrieval, generation, and policy
- Versioned prompts and models the way you version services

You do not need a novel architecture diagram. You need a system operators can reason about when the output is wrong at 2 a.m.

## A launch gate I actually use

Ship only when you can answer yes to most of these:

1. Product decision is explicit
2. Critical cases are covered by evals
3. Failure modes are visible and have fallbacks
4. Replay/attribution exists for production traffic
5. On-call ownership is named
6. Cost at 10× traffic is still acceptable
7. Users can recover when the system is wrong

Everything else is polish.

AI can be an extraordinary lever. It is still software that has to survive real traffic, real people, and real consequences. Treat it that way and the demos start turning into systems.
