---
title: How I am making this portfolio less generic
slug: react-portfolio-identity
excerpt: The focus is not adding effects for their own sake, but building visual identity, hierarchy, and interface decisions that are coherent with the technical narrative.
publishedAt: 2026-03-18
category: Personal product
tags: [Portfolio, React, UX]
featured: false
hasDemo: false
---
# Identity does not come from more components

Technical portfolios often fall into two extremes: a landing page that is too polished and has no substance, or a cold list of projects. I am looking for a third path: visual personality supported by technical context.

## Audience and problem

Visitors do not read a portfolio the way they use a product for months. Recruiters look for quick signals of judgment. Technical people look for implementation evidence. Designers observe composition and care.

The problem is serving these readings without producing a page that shouts at everyone at once. Identity must organize attention before asking for a decision.

That is why I avoid measuring quality only by the number of components. A new section deserves to exist only when it improves the narrative, clarifies a skill, or makes a decision open to examination.

## Requirements

I defined simple requirements for the current cycle:

- understandable visual hierarchy without animation
- comfortable reading on small and large screens
- an explicit relationship between project, decision, and evidence
- reused components when they share behavior
- theme and contrast that do not harm accessibility

These requirements are design criteria, not proven results. Evaluation must confirm whether the interface meets them in real use.

## Tokens

When each section chooses its own colors, radii, and spacing, identity becomes a collection of exceptions. Tokens reduce accidental variation and make a visual change more localized.

```ts
export const UI_CLASSES = {
  surfaceCard: 'ui-surface-card rounded-[1.5rem] border ...',
  gradientPanel: 'ui-gradient-panel rounded-[1.5rem] border ...',
  tagChip: 'ui-tag-chip rounded-full border ...',
} as const;
```

The example is an application vocabulary. It should not hide semantic differences simply to force uniformity. A reading surface may need different contrast and width from a highlight surface.

I also treat typography, spacing, and color as related decisions. The scale must establish levels. Spacing must indicate grouping. Color must reinforce state or priority rather than compete with all the content.

## Editorial composition

Repeated cards are an easy way to organize information, but they can flatten different projects into the same shape. I prefer alternating text, evidence, code, diagrams, and calls to action when each form serves a stage of the story.

A technical article begins with a question. It then shows context, presents a decision, and offers a way to examine it. Visual composition should follow that rhythm instead of turning every passage into a block with the same appearance.

In the blog, side navigation provides orientation without competing with the content. On smaller screens, it must not obstruct reading. The responsive principle is to preserve important relationships, not to keep every column intact.

## Components

A reusable surface makes sense when it reduces repeated decisions about behavior, focus, borders, or spacing. I do not create a component merely because two tags have the same number of lines.

```tsx
const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => (
    <div ref={ref} className={classNames(SURFACE_VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </div>
  ),
);
```

The abstraction remains healthy when its name communicates a decision. `SurfaceCard` says that a surface with variants exists. It does not promise to solve every box in the application.

## Narrative in code

Code is also part of the presentation. A technical reader needs to leave the screen and locate the flow. Names, file boundaries, and contracts are worth more than comments that repeat the implementation.

In a project section, I separate data from visual composition when the domain justifies that distinction. This lets the narrative change without rewriting how the data is represented.

The same applies to demos. An interactive example should not be a detached toy. It must answer the question raised by the text and make clear when it depends on an external API or an assumption.

## Theme and accessibility

Dark theme is not permission to use aggressive contrast. Text, controls, focus, and states must remain distinguishable. Color should not be the only way to communicate an error, success, or selection.

I also treat motion as a user preference. Transitions can guide attention, but content must work when reduced motion is active. The interface should not hide information behind an animation.

Visible focus, keyboard order, and accessible names belong to the same criterion. The final appearance is incomplete if interaction works only with a mouse or with vision unaffected by contrast changes.

## Code block example

Technical snippets also communicate identity:

```css
.code-block-pre {
  border: 1px solid rgba(6, 182, 212, 0.25);
  background: radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.12), transparent 38%), #020617;
}

.code-block-pre .hljs-keyword {
  color: #7dd3fc;
}
```

The block must remain readable, allow selection, and respect horizontal flow. Syntax styling is not enough if the code becomes an image that is difficult to consult.

## How I evaluate it

I evaluate identity through observable questions. Does a visitor understand what I do without searching for a hidden list? Can they distinguish one project from another? Can they find evidence instead of only a claim?

In the interface, I check text width, heading hierarchy, behavior in a smaller viewport, focus, and contrast. In the code, I look for tokens used consistently and components with readable responsibilities.

The desired result is not an invented conversion rate. It is a path that can be observed through manual tests, visual review, and keyboard navigation.

A visual review must also consider content outside the ideal case. Long titles, empty descriptions, different technology names, and error messages test the composition's elasticity.

If the layout works only with short sentences or a predictable number of cards, it has not yet demonstrated identity. It has demonstrated a controlled capture. The system must tolerate variation without losing hierarchy.

I record these checks as simple criteria, not as a promise of complete coverage. The intention is to let a later change repeat the evaluation and reveal when a decision stops working.

This record also reduces dependence on personal taste. Review remains interpretive, but it can discuss hierarchy, legibility, states, and observable behavior instead of only aesthetic preference.

## Limitations

Visual identity does not solve a lack of content. Tokens do not prevent every inconsistency. Reusable components can become rigid when they receive too many variants.

I also do not claim that the current composition is best for every audience. The recruiting criterion is a hypothesis based on the portfolio's purpose. Interviews and observing visitors could reveal other needs.

That hypothesis should be revisited when the audience, content, or professional goal changes. Identity must continue serving reading, not protect old decisions.

## Conclusion

I am making the portfolio less generic by reducing arbitrary choices. The narrative defines what deserves emphasis. The visual system makes those choices repeatable. Components protect behavior without erasing differences.

The goal is not to look complex. It is to make color, typography, code, navigation, and content point to the same idea: technical competence also includes explaining limits, context, and intent.

When these elements agree, the interface stops being a decorative frame and begins participating in the argument made by the work.

That participation is deliberate. Visuals introduce the question, text organizes the answer, and code offers a way to verify the decision without turning the portfolio into complete documentation.

## References

- [W3C: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: Accessible Web Apps and Widgets](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/ARIA)
- [React: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
