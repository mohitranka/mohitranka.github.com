Title: Incubating 0→1 beside a mature product
Date: 2021-06-15 10:00
Category: Blog
Slug: postman-labs-0-to-1
Tags: engineering-leadership, product, developer-tooling

When I was at Postman, the core product was already the default API client for a huge HTTP/HTTPS world—on the order of tens of millions of developers on desktop. That success created a sharp problem: **how do you explore what comes after HTTP without slowing the product everyone already depends on?** Postman Labs was our answer: a small unit with a charter to incubate 0→1 work—new protocols and paradigms—without turning every experiment into a core-roadmap hostage situation.

<!--more-->

## The challenge: the market moved past “REST in a GUI”

Developers were increasingly living with: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

- **WebSockets** for persistent, bidirectional sessions  
- **gRPC** for efficient, schema-driven service APIs  
- **GraphQL** and other non-CRUD shapes of interface

Internally we had ideas. What we lacked was a structured way to **validate, build, and kill or graduate** them while the core team stayed focused on the desktop product’s quality and scale. Putting every bet into the main feature factory would have meant either: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

- starving core reliability and UX, or  
- shipping “innovation” at the speed of a mature backlog.

Labs existed to refuse that false choice. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

## Structure for speed (and containment)

We did not invent another feature team with the same process tax as core. Labs was intentionally different: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

1. **Smaller team** drawn from engineers who already knew Postman’s product DNA.  
2. **Less process theater** — lean experiments instead of full SDLC cosplay for every spike.  
3. **One North Star metric per initiative** — a single definition of success so debates stayed grounded.  
4. **Explicit separation** from core delivery so a failed experiment did not become a multi-quarter core commitment by accident.

Charter in two axes: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

- **Breadth** — protocols and shapes beyond HTTP.  
- **Depth** — personas and workflows (testing, automation, CI-shaped use) that the HTTP client alone did not own.

Independence was not isolation from users. It was isolation from the wrong kind of backlog pressure. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams. I treat this as an operating constraint rather than a slogan: if you cannot explain how it shows up in ownership, metrics, and day-to-day decisions, it will not survive the next roadmap fight.

## A three-phase model that de-risked 0→1

Every Labs initiative had to earn the next phase: ### Phase 1 — Feasibility and market validation
Customer conversations, lightweight proofs, honest “who hurts without this?” If the answer was only “it would be cool,” it did not proceed. ### Phase 2 — MVP and dogfooding
Internal builds used by Postman’s own engineers. Usability and correctness issues showed up before a public audience. ### Phase 3 — Limited beta and public validation
Constrained rollout, measure adoption and engagement, then decide: graduate into the main product, iterate, or stop. That sequence sounds obvious. The discipline is stopping between phases. Core roadmaps often skip phase 1 and call a half-built feature a launch.

## WebSockets: persistent sessions are not “requests with extra steps”

WebSockets were an early Labs bet because real-time systems (chat, feeds, IoT-style control planes, live tooling) do not fit the request/response mental model Postman had optimized for. **Hard parts:** That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

- Long-lived bidirectional connections instead of discrete calls  
- Auth flows that must hold for a session, not only a single hit  
- UX for streams of events over time, not one response panel

**What we built toward:** a first-class WebSocket client experience—connect, send/receive, inspect event history, support practical auth patterns. **Outcome:** WebSockets did not stay a lab toy; support graduated into Postman’s broader API development surface. That graduation path was the point of Labs. That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

## gRPC: schemas and streams in a product trained on text HTTP

gRPC was growing fast in backend-heavy environments. Postman’s muscle memory was text-centric HTTP. gRPC forced different questions: That detail matters in practice because the surrounding system, incentives, and failure modes usually determine whether the idea survives contact with production and with other teams.

- How do users work with **Protobuf** contracts inside the product?  
- How do unary and streaming calls show up in a composer UX?  
- How do serialization mistakes become debuggable instead of opaque binary pain?

**Execution themes:** schema-aware composition, streaming-aware request/response handling, and making “what did I just send?” inspectable for developers who live in Postman daily. **Outcome:** gRPC testing/debugging became a real product capability in the same family as REST workflows—not a separate science project users had to leave Postman for.

## What scaled beyond the first bets

When early graduates worked, Labs stopped being only a temporary squad. The incubation pattern—validate, dogfood, beta, graduate—became a reusable company muscle. Later product bets (including automation-shaped work such as Flows-class ideas) could reuse the same organizational shape: **explore beside core, then merge what earns users.** Eventually Labs-shaped work attracted clearer funding and leadership attention. That is the healthy end state: not a permanent rebel base, but a proven path for 0→1 inside a company that also has to protect a mature product.

## What I would repeat as an EM

1. **Separate exploration capacity from core SLA capacity** — or core always wins and innovation becomes slideware.  
2. **One success metric per bet** — multi-metric dashboards hide kill decisions.  
3. **Dogfood before marketing** — especially for developer tools; your engineers are harsh, useful users.  
4. **Graduation criteria in writing** — “done in Labs” must mean something operationally.  
5. **Protect the team from identity crisis** — Labs is not “the people who do side quests”; it is a product strategy role.

## What I would avoid

- Innovation theater with no kill switch  
- Hiding Labs work so core is surprised at graduation  
- Measuring success only by launches, not by retained use  
- Staffing Labs only with people core “can spare” forever

## Closing

Incubating 0→1 beside a mature product is a leadership design problem: process, incentives, and graduation rules—not only prototype velocity. Postman Labs worked when it had a **narrow charter**, **phased validation**, and a path for WebSockets, gRPC, and similar bets to become real product surfaces without forcing the entire company to pretend it was still a startup with nothing to lose. If your core product is already loved, that is not a reason to stop exploring. It is a reason to explore **on purpose**.
