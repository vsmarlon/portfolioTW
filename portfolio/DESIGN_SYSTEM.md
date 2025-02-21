# Design System

Portfolio design system for Marlon Vargas. Reference for consistent styling across components.

---

## Color Palette

### Light Mode (zinc warm off-white)

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Page background | `bg-zinc-200` | `#e4e4e7` | Body, section backgrounds |
| Card background | `bg-zinc-100/80` | `#f4f4f5` at 80% | Cards, panels, containers |
| Interactive bg | `bg-zinc-300` | `#d4d4d8` | Buttons, skill tags, hover states |
| Strong hover | `bg-zinc-400` | `#a1a1aa` | Strong hover on interactive elements |
| Text primary | `text-slate-900` | `#0f172a` | Headings, primary text |
| Text secondary | `text-slate-600` | `#475569` | Body text, descriptions |
| Text muted | `text-slate-400` | `#94a3b8` | Labels, captions, arrow |
| Borders | `border-black/5` | 5% black | Card borders, dividers |

### Dark Mode (slate deep navy)

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Page background | `bg-slate-950` | `#020617` | Body |
| Card background | `bg-slate-900/80` | `#0f172a` at 80% | Cards |
| Alt card bg | `dark:bg-white/5` | white at 5% | Alternate card style |
| Interactive bg | `dark:bg-white/10` | white at 10% | Buttons, tags |
| Text primary | `text-white` | `#ffffff` | Headings |
| Text secondary | `text-slate-400` | `#94a3b8` | Body text |
| Text muted | `text-slate-500` | `#64748b` | Labels |
| Borders | `border-white/10` | 10% white | Card borders |
| Header bg | `dark:bg-slate-900/70` | `#0f172a` at 70% | Fixed header |

### Accent

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Primary cyan | `bg-cyan-500` | `#06b6d4` | CTAs, active states, links |
| Hover cyan | `hover:bg-cyan-400` | `#22d3ee` | Button hover |
| Cyan tint | `bg-cyan-500/10` | cyan at 10% | Badges, tag backgrounds |
| Cyan border | `border-cyan-500/30` | cyan at 30% | Badge borders |
| Gradient | `from-cyan-500 via-blue-500 to-cyan-500` | — | Gradient text, accents |
| Green pulse | `bg-green-500` | `#22c55e` | Availability indicator |
| Blue (education) | `bg-blue-500` | `#3b82f6` | Education timeline items |
| Red (heart) | `text-cyan-500` | — | Footer heart icon |

---

## Typography

| Element | Classes | Size |
|---------|---------|------|
| Hero h1 | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight` | 36px → 72px |
| Section h2 | `text-3xl md:text-5xl font-bold` | 30px → 48px |
| Card h3 | `text-2xl font-semibold` | 24px |
| Card h4 | `text-xl font-bold` | 20px |
| Subtitle | `text-lg sm:text-xl md:text-2xl` | 18px → 24px |
| Body | `text-base` or `text-lg` | 16px / 18px |
| Small | `text-sm` | 14px |
| Badge/Tag | `text-xs` or `text-sm font-medium` | 12px / 14px |
| Uppercase label | `text-sm uppercase tracking-wider font-bold` | 14px |
| Marquee label | `text-sm uppercase tracking-widest font-semibold` | 14px |

### Gradient Text

```html
<span class="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
  Marlon
</span>
```

---

## Spacing

| Context | Classes | Value |
|---------|---------|-------|
| Section padding | `py-24` | 96px vertical |
| Hero section | `pt-20` + `min-h-screen` | 80px top + full viewport |
| Container | `px-4 sm:px-6 lg:px-8` | 16px → 32px horizontal |
| Max width | `max-w-6xl` (about), `max-w-7xl` (projects), `max-w-4xl` (contact) | 1152px / 1280px / 896px |
| Card padding | `p-8` (large), `p-6` (small) | 32px / 24px |
| Button padding | `px-8 py-3.5` | 32px / 14px |
| Grid gap | `gap-6` (projects), `gap-4` (skills), `gap-12` (about columns) | 24px / 16px / 48px |

---

## Component Patterns

### Section Hierarchy

- Use one primary surface per section, then separate inner groups with `border`, `divide-y`, `divide-x`, or simple spacing.
- Avoid repeated card nesting for lists of related items. If multiple children share the same section, prefer row dividers over stacked mini-cards.
- Apply this especially to contact channels, blog sidebar navigation, skills/categories, and "Construindo e aprendendo" content.
- If a section still needs emphasis, reserve heavier treatments like gradients, blur, and shadows for the outer container rather than every child item.

### Cards

```html
<!-- Standard card -->
<div class="bg-zinc-50/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8">

<!-- Hoverable card -->
<div class="bg-zinc-50/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 hover:bg-zinc-100 hover:border-cyan-200 dark:hover:bg-white/10 transition-colors">
```

### Buttons

**Primary (filled):**
```html
<a class="bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
```

**Secondary (outline):**
```html
<a class="border-2 border-slate-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-900/50 hover:bg-zinc-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105">
```

**Ghost (on cards):**
```html
<a class="bg-zinc-200 dark:bg-white/10 border border-black/10 dark:border-white/20 hover:bg-zinc-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105">
```

### Badges

```html
<!-- Availability badge -->
<div class="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-sm font-medium tracking-wide">
  <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
  Disponível para novos projetos
</div>
```

### Tags (skills/tools)

```html
<!-- Skill tag -->
<span class="px-3 py-1.5 text-sm font-medium bg-zinc-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg border border-black/5 dark:border-white/10">

<!-- Tool tag (accent) -->
<span class="px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-full border border-cyan-200 dark:border-cyan-500/30">
```

### Divider-Based Lists

```html
<!-- Vertical list with separators -->
<div class="divide-y divide-black/5 dark:divide-white/10">
  <div class="py-4 first:pt-0 last:pb-0">...</div>
  <div class="py-4 first:pt-0 last:pb-0">...</div>
</div>

<!-- Two-column split inside one section surface -->
<div class="grid gap-6 md:grid-cols-2 md:divide-x md:divide-black/5 dark:md:divide-white/10">
  <div class="md:pr-6">...</div>
  <div class="md:pl-6">...</div>
</div>
```

### Icons

- Keep small UI icons geometrically simple and readable inside `24x24` viewboxes.
- Prefer bold, low-detail silhouettes or clear line icons over intricate SVG constructions.
- When an icon feels noisy in a badge or label, simplify it instead of increasing size or adding decorative wrappers.

### Timeline Dot

```html
<div class="w-4 h-4 rounded-full border-4 border-zinc-100 dark:border-slate-900 bg-blue-500">
<!-- bg-blue-500 for education, bg-cyan-500 for work -->
```

---

## Grid Layouts

| Component | Classes | Columns |
|-----------|---------|---------|
| About | `grid-cols-1 lg:grid-cols-2 gap-12` | 1 → 2 |
| Skills | `grid-cols-2 gap-4` | 2 (always) |
| Projects | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` | 1 → 2 → 3 |
| Contact | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` | 1 → 2 → 3 |
| Footer | `flex-col md:flex-row` | stacked → row |

---

## Animations

| Name | Duration | Usage |
|------|----------|-------|
| `animate-marquee` | 30s linear infinite | Technology carousel scroll |
| `animate-gradient-x` | 15s ease infinite | Gradient text color shift |
| `animate-float` | 6s ease-in-out infinite | Floating elements |
| `animate-pulse-slow` | 4s ease-in-out infinite | Slow pulsing |
| `animate-bounce` | Tailwind default | Scroll-down arrow |
| `animate-pulse` | Tailwind default | Availability dot |
| AOS `fade-up` | 800ms ease-in-out | Section entrance |
| AOS `fade-right` | 800ms ease-in-out | About left column |
| AOS `fade-left` | 800ms ease-in-out | About right column |
| AOS `fade-in` | 800ms ease-in-out | Technology carousel |
| AOS `fade-down` | 800ms ease-in-out | Header |

### AOS Delay Pattern

- No delay: section headings
- `100ms`: first content block
- `200ms`: second content block
- `300ms`: tertiary elements (social links, carousel)

---

## Responsive Breakpoints

| Prefix | Min-width | Primary use |
|--------|-----------|-------------|
| (none) | 0px | Mobile base |
| `sm:` | 640px | Buttons row, subtitle size |
| `md:` | 768px | Desktop nav, grid columns |
| `lg:` | 1024px | 2-column layouts, timeline |
| `xl:` | 1280px | 3-column grids, wider containers |

---

## Dark Mode

Custom variant defined in `index.css`:

```css
@custom-variant dark (&:is(.dark *));
```

Toggled by adding/removing `dark` class on `<html>`. Also uses `data-theme="dark"` attribute for CSS custom properties. System preference detected via `window.matchMedia('(prefers-color-scheme: dark)')`.

---

## Shadow

| Context | Classes |
|---------|---------|
| Primary button | `shadow-[0_0_20px_rgba(6,182,212,0.3)]` hover `shadow-[0_0_30px_rgba(6,182,212,0.5)]` |
| Header | `shadow-lg` |
| Mobile menu | `shadow-lg` |
| Resume button | `shadow-lg shadow-cyan-500/20` |
| Logo icon | `shadow-[0_0_15px_rgba(6,182,212,0.3)]` |

---

## File Structure

```
src/
├── data/              ← Static content arrays
│   ├── navigation.ts
│   ├── hero.ts
│   ├── about.ts
│   ├── projects.ts
│   └── contact.ts
├── utils/             ← Pure utility functions
│   └── semester.ts
├── components/        ← Presentational only (no data logic)
├── contexts/          ← React context providers
├── app.tsx            ← Layout, routing, AOS init
├── main.tsx           ← React DOM entry
└── index.css          ← Global styles, CSS variables, animations
```

Components import data from `data/` and utility functions from `utils/`. Components should contain only JSX and minimal UI state (e.g., `useState` for toggle menus).
