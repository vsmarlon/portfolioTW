---
title: Pokédex: when the interface also explains the rules
slug: pokedex-interface-rules
excerpt: Search, filters, details, and battles show how an interface can organize a large dataset without losing clarity.
publishedAt: 2026-10-08
category: Project study
tags: [TypeScript, Tailwind CSS, Vite, UX]
featured: false
hasDemo: false
---
# Large datasets need a visible order

A Pokédex brings together names, types, stats, abilities, height, weight, and artwork. Putting everything on one screen creates volume, but it does not help anyone find or compare information.

This project uses TypeScript, Tailwind CSS, Vite, and PokéAPI to organize the first 151 Pokémon. The application combines a catalog, search, filters, details, and a turn-based battle arena.

The interesting part is the transition between exploring information and taking action.

## Search and filters answer different questions

Search helps when someone already knows a name. A type filter helps when they want to explore a category such as water or fire.

Both controls can operate on the same collection, but they need to communicate their state. A search with no result is different from a filter that hides every item. Clearing the controls should also be simple, especially on a small screen.

A useful order for this page is:

1. Show the size of the current set.
2. Keep search and filter close together.
3. Display cards in a grid that adapts to the width.
4. Explain when no item matches the selection.
5. Preserve the way back after opening details.

This structure reduces navigation effort without depending on animation.

## The card introduces, the details expand

Each card should support quick recognition. Name, artwork, number, and type do that job. Full stats and abilities belong in the detail view.

This division avoids two common problems: cards that become too tall on mobile and repeated information competing for attention. People see enough to choose and open more detail only when needed.

On mobile, the touch area should include the whole card and leave safe space between actions. On desktop, the grid can gain columns while keeping the same hierarchy.

## Battle turns data into a decision

The arena lets someone choose two Pokémon and compare their strength through an automatic battle or turns with selected abilities.

A useful battle screen makes four points clear:

- who is acting;
- which ability was selected;
- how much health remains;
- when the round or battle ended.

These signals matter more than visual effects. Color and movement can reinforce a change, but text and values should explain the result on their own.

TypeScript helps describe the shapes used by these rules. A Pokémon, an ability, and a battle state contain different fields. Clear types reduce mistakes as data moves between the catalog, details, and arena.

## An external API does not control the experience

PokéAPI supplies the data, but the application decides how to load and present it. That includes waiting states, error messages, and request limits.

A screen should not look empty while waiting for a response. It should not keep showing old results as if they belonged to the current filter. Even in a study project, these states show care for the person using it.

## Visual identity without hiding content

The retro style fits the subject, but it should not reduce readability. Headings can carry more personality while paragraphs, filters, and values keep comfortable sizes.

Tailwind CSS helps maintain consistent spacing and responsive behavior. The benefit appears when classes follow a small set of composition rules instead of creating an exception for every card.

## Performance is part of the theme

A Pokédex may need many images and API responses. Loading everything at once increases data use and delays the first visible content. A better strategy begins with what appears on screen.

Images below the visible area can load later. Each image should reserve its space before arriving, preventing the grid from changing position during scrolling. File format and size should also match the actual card dimensions.

Search and filters can operate on data already in the browser. That avoids a new request for every key when the local collection is enough. If an external query is required, a short delay before sending it prevents requests that would be discarded immediately.

The arena also benefits from lightweight rules. A round should calculate only what is needed to update both participants and the battle log. Visual effects must never block buttons or delay information about the result.

## Motion should communicate

Smooth transitions help people follow the opening of details or a turn change. They stop helping when every card moves on its own or when someone must wait for an animation to end.

A short duration of a few hundred milliseconds is usually enough to show continuity. Opacity and transforms work well because the browser can update them with little effort. Animating several large shadows and filters during scrolling costs more and rarely improves understanding.

The project should also respect the system preference for less motion. In that mode, transitions can disappear without removing information. The experience remains complete because state does not depend on an effect.

## Accessibility improves the game rule

An accessible arena needs to work from a keyboard and communicate changes that would normally be noticed through color or animation. Focus should follow a predictable order, and the selected ability button needs a clear name.

When an attack happens, a status area can announce the move, damage, and remaining health. The message does not need to interrupt the entire page. It should arrive at the right time and use a short sentence.

Pokémon types cannot be distinguished by color alone. Text and icons support people with different forms of perception and make the interface easier to understand under bright light or on a low-quality display.

These choices are not a separate layer. They require the application to represent every state precisely, which also reduces errors for mouse and touch users.

## What is worth testing

The most valuable tests focus on rules that can break without producing an obvious code error:

- search that ignores letter case;
- combining text and type filters;
- clearing the controls;
- choosing two valid participants;
- ending a battle when health reaches zero;
- preventing actions after the battle ends;
- returning to the catalog without losing the expected position.

Arena calculations can be tested without rendering the whole page. Keyboard navigation and change announcements need tests through the interface. Separating these levels keeps the suite fast while covering behavior that matters.

## Useful next steps

The project already combines exploration and interaction. The improvements that would add the most value are full keyboard access to the battle, turn announcements for screen readers, and a locally saved team.

Testing the arena rules separately from the interface would also help. A visual change could then never alter a battle result without being noticed.

The code is available on [GitHub](https://github.com/vsmarlon/pokedex).
