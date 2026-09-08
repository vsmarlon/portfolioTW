# Portfolio Design Direction

Living design guidance for the portfolio. The primary audience is recruiters and hiring managers. The portfolio should make one identity immediately clear:

> **Desenvolvedor Full Stack**

This means presenting React and TypeScript together with NestJS, PostgreSQL, Oracle, and backend architecture—not positioning the work as frontend-only.

## Migration status

This document records the resolved direction for the redesign, with the main page as the priority. The current implementation already contains useful foundations: PT-BR content, a dark/light theme, bordered section surfaces, shared `useScrollReveal` behavior, semantic focus styles, route-based sections, and a resizable desktop blog sidebar.

`DESIGN_SYSTEM.md` is stale where it prescribes gradients, pulse indicators, AOS, heavy hover treatment, and frontend-only positioning. Do not delete or rewrite it yet. This document supersedes it **only after implementation has been reconciled** with the guidance below.

## Principles

- Lead with hiring relevance: identity, engineering scope, evidence, and contact path.
- Keep the visual language editorial and technical: ivory light canvas, warm graphite dark canvas, firm structural borders, restrained magenta accents, and dense but orderly content.
- Preserve seamless scroll-reveal/fade and clean bordered separation between sections.
- Use one strong surface per section. Prefer whitespace, borders, and tonal separation over many nested cards.
- Every visible card animates once on entry; cards themselves have no hover motion. Hover/focus color response lives only on real links, buttons, and the active Freebay flow. Freebay emphasis is static (accent baseline), without glow, 3D, or motion that hides content.
- Make technical depth legible without turning the portfolio into a dashboard.
- Treat the blog as an established product area: retain its behavior and finely tuned resizable sidebar mostly intact; tables, code, and links share the editorial token system.

## Tokens

Use semantic roles in components and CSS variables rather than accumulating raw colors or one-off hex values.

| Role | Direction | Use |
|---|---|---|
| `canvas` | Ivory `#faf6ef` light · graphite `#131110` dark | Page background and breathing room |
| `surface` | `#fffdf8` light · `#1c1917` dark | One primary section surface |
| `surface-muted` | Stone tonal steps | Secondary regions, code accents, inactive states |
| `text-primary` | Stone-900 light · Stone-100 dark | Headings and essential content |
| `text-secondary` | Stone-700 light · Stone-300 dark | Descriptions and supporting copy |
| `text-muted` | Stone-600 light · Stone-400 dark | Metadata, labels, dates |
| `border-strong` | 2–3px stone borders | Section and component structure |
| `border-soft` | 1–2px stone borders | Dividers and internal grouping |
| `accent` | Magenta `#a1006b` light · `#ec7cc3` dark | Links, active navigation, key metrics, focus, Freebay signal |
| `accent-contrast` | Ivory on magenta · deep plum on light magenta | Text on accent controls |
| `status-negative` | Restrained red | Errors only |

Magenta is a signal, never a full-surface wash. Light mode is a first-class readable theme, not a recolored dark mode. Raw cyan/blue fills are out.

## Typography

- Body uses `Inter`/system sans for readability; display uses `Space Grotesk`; `IBM Plex Mono` remains for eyebrows, metadata, code, tags, and technical labels.
- Use weight, size, casing, and spacing to establish hierarchy; avoid gradient text as the default emphasis mechanism.
- Headings are expressive and editorial. Supporting copy stays readable, with comfortable line height and a constrained measure.
- Metadata, labels, dates, and technology names may use uppercase mono and tracking, but never at the expense of legibility.
- Natural PT-BR examples include `Desenvolvedor Full Stack`, `Ver projetos`, `Experiência & Educação`, `Sistemas de Engenharia`, and `Entrar em contato`.

## Spacing and layout

- The hero may use `min-h-dvh` (or the current full-viewport equivalent) to establish the opening composition.
- Every other section must be content-driven. Do not use fixed heights that clip content or create overflow traps.
- Use a consistent centered container with responsive horizontal padding. Let content determine vertical rhythm.
- Sections are separated by whitespace and thin borders; avoid stacking a card inside another card without a clear structural reason.
- The main page order should support the hiring narrative: identity and proof first, then full-stack scope and engineering systems, flagship work, supporting projects, and contact.
- Never introduce horizontal overflow as a layout technique. Long labels, code, and project content must wrap or scroll within their own bounded region.

## Breakpoints

Use the existing Tailwind breakpoints deliberately:

| Range | Guidance |
|---|---|
| Base / `<640px` | Single-column reading flow, mobile top-bar trigger, no desktop rail, compact controls, wrapped actions |
| `sm` / `640px+` | Increase text measure and spacing; allow simple action rows where they fit |
| `md` / `768px+` | Recompose content into intentional two-column groups; do not assume this is wide desktop |
| `lg` / `1024px+` | Enable desktop navigation rail/drawer and larger editorial compositions |
| `xl` / `1280px+` | Give dense project and technical content more room; optional labels may appear beside rails |

Responsive behavior must explicitly hide or recompose desktop-only rails on smaller widths. A layout is not responsive merely because its columns wrap: check clipping, focus order, long PT-BR labels, code blocks, and project media at every range.

## Borders and surfaces

- Structural borders are firm and intentional: 3px outside section frames, 2px cards and channels, 1–2px internal dividers.
- A section should generally have one strong parent surface. Contact channels, skills, projects, and writing rows are bordered rows/cards with clear separation.
- Keep the blog sidebar as an integrated bordered region. Its current desktop width is user-resizable from 260px to 460px, defaults to 320px, persists locally, and supports ArrowLeft/ArrowRight keyboard resizing.
- Interactive states recolor borders/text to magenta without lifting, shifting, or shadows. Avoid 3D tilt, glow, pulse, and animated gradients.

## Motion

- `useScrollReveal` uses a shared `IntersectionObserver`, adds `revealed`, and unobserves after entry. CSS owns the transition. Attach it to every card/row, not only section wrappers, with small stagger delays.
- Route and anchor scrolls run a custom 420ms ease-in-out animation that yields to wheel/touch input, with an instant fallback under `prefers-reduced-motion`. The drawer trigger sits in the header flow on desktop (title adjacent, theme action last on the right) and overlays as fixed chrome on mobile.
- Freebay flagship keeps a static accent baseline plus flow-driven diagram highlighting (`is-active`/`is-dim` nodes and edges) on the purple architecture frame. Arrows carry a continuous dash flow plus a sequential brightness pulse per edge. The diagram is exempt from the Firefox performance heuristic; only a genuine `prefers-reduced-motion` setting stills it. No animation `useEffect` anywhere. Header enters with `slideDown`.
- Reading surfaces share one shell: `ReadingShell` owns the resizable sidebar row used by `/blog` and `/projects/freebay`. Sidebar groups are native `details` accordions (no JS); article subsections come from `extractHeadings` with matching heading ids, so `SectionTimeline` follows any long reading.
- Cross-page navigation speaks one language: `BackLink` for every return link, the same bordered shell for reading pages, and the 404 inside the editorial token system. Info rows use a uniform `border-2` frame with single dividers, never mixed widths.
- Prefer CSS transitions for hover/focus/active feedback and CSS animation only for a clear communication purpose.
- Do not add visual-animation `useEffect` logic. Follow React’s “You Might Not Need an Effect” guidance: derive values during render, handle interaction in event handlers, use CSS for presentation, and reserve Effects for genuine external synchronization.
- Always respect `prefers-reduced-motion`; reveal content without motion and avoid decorative animation. The Freebay flow explorer stays fully usable as text.

## Responsive navigation

- On desktop, replace the top navigation with an enhanced side drawer/rail. It should overlay the page rather than squeeze or resize the content underneath.
- The rail should expose the same primary destinations and active-section state, with the technical/editorial visual language of the page.
- On mobile, retain a trigger in the top bar. The trigger must close the drawer cleanly after navigation, including navigation to a home-page hash and to the blog.
- The drawer must not create horizontal overflow or trap focus behind an open overlay.
- The current home section navigation and blog progress/sidebar behavior are implementation references, not permission to preserve desktop-only placement when the new rail is introduced.

## Accessibility

- Use a semantic `<button>` for the drawer trigger, with a useful accessible name plus `aria-expanded`, `aria-controls`, and an appropriate current/active indication for navigation.
- Preserve a predictable Tab order: trigger, drawer contents when open, then page content as appropriate. Escape closes an open drawer and returns focus to the trigger.
- Keep visible `:focus-visible` treatment. Cyan focus rings are acceptable when contrast remains clear against the active surface.
- Navigation labels and links must remain understandable without color, animation, hover, or icons.
- Keep meaningful image alt text, semantic headings, landmark regions, and keyboard access to the blog resizer. The current resizer’s separator semantics and min/max/now values are the baseline to preserve.
- `Ctrl+K` is optional and **TBD**. Add it only if it is justified by a real navigation/search need, and provide a discoverable, accessible alternative.

## Core components

### Hero

The hero is the first recruiter-facing statement. Replace frontend-only language such as `Desenvolvedor front-end...` with the resolved full-stack identity and concrete scope. Keep primary actions obvious and PT-BR copy natural. Remove the phrase/badge **`Disponível para novos projetos`** entirely; do not replace it with another availability promise unless decided later.

### Engineering Systems

Replace the animated `Terminal` section with **Engineering Systems** (`Sistemas de Engenharia`). It should explain architecture and backend thinking—React/TypeScript clients, NestJS services, PostgreSQL/Oracle persistence, boundaries, and integration patterns—using dense, readable content. Retain a small static terminal/code accent as a visual cue, not as a timer-driven experience or the section’s primary interaction.

### Projects

Freebay becomes the flagship project. Give it a deep `/projects/freebay` case study covering the problem, role, architecture, key decisions, implementation evidence, and outcome. Retain Freebay’s separate branding; it should be recognizable as its own product rather than absorbed into the portfolio identity. Existing project cards can remain supporting proof, but the flagship hierarchy must be unmistakable.

### Blog

Keep `/blog` and `/blog/:slug`, Markdown-authored posts, the featured/listing split, mobile article navigation, and the resizable desktop sidebar behavior mostly intact. Favor cleanup and alignment over a visual rewrite. The blog’s existing interactive demo/data-grid behavior is content evidence and should not be replaced by decorative UI.

### Section and utility primitives

Prefer the existing `SurfaceCard`, `TagChip`, `Icon`, `useScrollReveal`, theme context, and data-driven navigation patterns where they still fit. New primitives need a repeated, real use case; do not add abstraction for a single section.

## Content hierarchy

1. **Identity:** `Desenvolvedor Full Stack`.
2. **Scope:** React/TypeScript, NestJS, PostgreSQL, Oracle, and backend architecture.
3. **Evidence:** Engineering Systems, Freebay flagship case study, and selected projects.
4. **Working style:** clear architecture, useful interfaces, and explainable technical decisions.
5. **Action:** project details, resume/GitHub where relevant, and contact.

Avoid presenting “frontend” as the user’s complete identity. It may describe a specific project or strength, but not the hero promise.

## Anti-patterns

- Frontend-only headline or positioning.
- Reusing `Disponível para novos projetos` as a badge, status, or near-equivalent.
- A desktop top nav that remains the primary desktop navigation after the rail is implemented.
- A drawer that pushes/squeezes page content instead of overlaying it.
- Fixed-height non-hero sections, clipped content, or page-level horizontal scrolling.
- Card-inside-card abundance, decorative dashboards, or a gradient for every emphasis.
- 3D hover, aggressive scale, glowing buttons, grain, pulse indicators, animated gradients, or timer-driven decoration as default styling.
- Visual animation driven by Effects when render derivation, event handlers, or CSS is sufficient.
- Rewriting the blog sidebar or behavior without a concrete bug, accessibility need, or cleanup target.
- Treating the Safari scroll issue as solved by assumption. The current hypothesis is that custom route restoration may fight iPhone swipe-back; it must be investigated and tested separately before becoming a rule.

## Unresolved decisions

- **Light-mode final palette:** resolved to editorial ivory/graphite + magenta (see Tokens). Tune only for measured contrast issues.
- **Drawer geometry:** exact width, rail/drawer breakpoint behavior, and whether it opens persistently or on demand are TBD within the overlay requirement.
- **Freebay case-study content:** final screenshots, metrics, architecture detail, and outcome claims are TBD until verified.
- **Engineering Systems copy and diagram depth:** the section purpose is resolved; final information density and exact static code sample are TBD.
- **`Ctrl+K`:** TBD; include only if a concrete, accessible use case survives implementation review.
- **Safari route restoration:** behavior and regression coverage are TBD. Validate the iPhone swipe-back interaction independently; do not encode the current hypothesis as final behavior.
- **Exact spacing scale and border widths after reconciliation:** TBD. Keep the existing rhythm as a baseline, then normalize only where the redesign demonstrates a need.
