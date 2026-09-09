---
title: Freebay: product, architecture, and design system in one case
slug: freebay-product-architecture
excerpt: A study of how social commerce, services, integrations, and visual decisions can form one product narrative.
publishedAt: 2026-03-28
category: Case study
tags: [Freebay, Product, Design System, NestJS]
featured: false
hasDemo: false
---
# Freebay is an exercise in coherence

Freebay was conceived as a product in which discovery, relationships, and transactions do not live on disconnected screens. The architecture and design system must tell the same story: reduce friction without hiding necessary complexity.

## Context

Social commerce combines catalog, identity, conversation, and payment. Each part may look like an isolated feature, but the user experiences one journey. A decision at one stage changes expectations at the next.

The case is presented as an architecture and product study, not as proof of commercial scale. The goal is to make boundaries legible and explain which points depend on assumptions that have not yet been validated.

## Objectives

The objectives were to organize a discovery experience, enable interaction between people, and preserve an understandable transaction. It was also necessary to keep different clients aligned with the same domain.

React and Flutter can provide distinct compositions. Even so, both must respect common rules for identity, offers, orders, and payments. This division prevents a visual decision from being confused with a business rule.

## Domain journey

The journey begins when a person finds an offer. They inspect details, interpret availability, and decide whether to start a relationship with the seller or move toward a purchase.

Then the purchase intention must be reevaluated in the correct context. Price, currency, inventory, address, and payment method should not be inferred only from the screen that started the flow.

A conversation can support discovery, but should not be treated as financial authorization. The domain must preserve the difference between a message, an intention, and a confirmed transaction.

This separation also helps us think about events. A new message can be notified without creating an order. An approved payment can update an order without depending on a screen being open at that moment.

## Services and persistence

React and Flutter clients communicate with NestJS services. Authentication, social commerce, and listings have different responsibilities, while PostgreSQL supports relational data.

The identity service protects entry and provides user context. The catalog service organizes offers and their public information. The order service concentrates transactional intent and its lifecycle.

This division should not be read as an obligation to create one service for every table. The boundary is valuable when there is a distinct responsibility, contract, and operational need.

Otherwise, the separation may only distribute complexity.

PostgreSQL suits the relational case because orders, items, users, and payment references have relationships that need to be queried clearly. The choice does not remove the need to model ownership, indexes, and migrations.

Persistence is also not synonymous with universal truth. A listing may use an optimized projection, while a confirmed order requires a transactional source. The contract must say which reading is appropriate for each decision.

## The NestJS and Stripe boundary

Stripe sits at the domain boundary as an explicit integration. The service should not treat an external call as if it were a simple local write. There are credentials, idempotency, webhooks, intermediate states, and partial failures.

The application may create a payment intent, but final confirmation must respect the provider's contract. The webhook must be authenticated according to Stripe's documentation and processed idempotently.

```ts
type PaymentState =
  | 'pending'
  | 'authorized'
  | 'failed'
  | 'cancelled';
```

This type is only a didactic simplification. Real states must reflect the adopted contract and cannot be invented to fill a table.

The service records the external reference and translates relevant events into the domain. It should not spread the Stripe SDK through controllers or components. This way, changing provider details does not contaminate the entire experience.

## Socket.IO and real time

Socket.IO can communicate changes that deserve rapid updates, such as a new message or a status change. The connection, however, does not replace persistence or authorization.

The server must verify identity and the right to participate in a channel. The client must handle reconnection, repeated events, and stale state. A received notification is a signal to reconcile data, not necessarily the complete representation of a resource.

When real time fails, the interface must remain understandable. A later query, reconnection indicator, and manual refresh are alternatives that prevent a transient connection from looking like lost information.

## Design system

A design system is not only a collection of colors. Typography, spacing, states, and repeated components create a vocabulary so that discovery, detail, and conversation feel like parts of the same product.

The system begins with roles, not arbitrary names. An action color must remain distinguishable in a button, link, and focus state. A catalog surface may have a different density from a conversation screen.

Components should expose necessary states: loading, empty, error, focus, and disabled. Hiding these differences inside each screen increases divergence and makes visual review harder.

The design system also helps the domain remain visible. An order state is not only a color. It needs text, structure, and an action consistent with the rule it represents.

## Trade-offs

Separate services can improve ownership, but increase the cost of contracts, observability, and deployment. A broader service may be simpler at first, as long as its internal boundaries remain clear.

React and Flutter allow platform-specific experiences, but duplicate part of the maintenance. The compensation is sharing contracts and domain decisions, not forcing the same component onto different platforms.

Stripe reduces the need to build payment infrastructure. In exchange, it introduces an external dependency, provider policies, and the need to follow documented changes.

Socket.IO improves perceived updating in some flows. In exchange, it requires reconnection, presence, authorization, and a strategy for recovering missed events. It is not a neutral optimization.

## Evaluation

I would evaluate the case by journey continuity, contract clarity, and the ability to fail without losing known state. The flow from offer to payment should indicate who decides each transition.

I would also check whether the design system reduces divergence between screens. A component is not successful merely because it is reused; it must preserve semantics, accessibility, and a limited range of variation.

Operationally, I would observe webhook failures, reconnections, perceived latency, and persistence errors. I do not present numbers because there is no published measurement for this exercise.

## Limitations

The case does not demonstrate production volume, conversion, availability, or response time. These conclusions would require an instrumented environment, representative traffic, and criteria defined before measurement.

The architecture described also does not automatically solve fraud, distributed inventory, moderation, or cancellation policies. These topics need their own decisions and should not be hidden behind the service design.

The choices of Stripe and Socket.IO suit the described scenario, but may not suit another product. Costs, regulatory requirements, and team capabilities would change the decision.

## Conclusion

Freebay's value lies in its chain of decisions. The journey guides the services. Contracts protect the boundaries. Stripe and Socket.IO remain explicit integrations. The design system gives consistent form to the rules.

The case avoids inventing metrics or hiding what is still a hypothesis. Visual polish is useful only when it makes the architecture easier to examine. Product and implementation become more reliable when they can be explained along the same path.

## References

- [NestJS: official documentation](https://docs.nestjs.com/)
- [PostgreSQL: official documentation](https://www.postgresql.org/docs/)
- [Stripe: webhooks](https://docs.stripe.com/webhooks)
- [Stripe: idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Socket.IO: documentation](https://socket.io/docs/v4/)
- [W3C: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
