# Astral Design Prompt

Use this guide when generating or refactoring UI for the Astral frontend. The goal is consistency with the current product: a practical automated ML platform for project, dataset, training, model, and deployment workflows.

Astral should feel like a modern SaaS product for ML operations: clear, structured, responsive, and polished, with a strong blue-led identity across both light and dark mode. Build usable screens first, but make them feel intentionally designed rather than purely utilitarian.

## Product Feel

Astral is an ML workspace, not a portfolio site. Screens should prioritize scanning, filtering, comparison, and action.

Use this tone:

- Work-focused and calm.
- Modern and polished.
- Dense enough for real workflows, but never cramped.
- Premium product UI rather than plain internal tooling.
- Clear hierarchy, clean spacing, and deliberate visual rhythm.
- Subtle motion and hover states only where they improve feedback.

Avoid:

- Oversized landing-page hero patterns for app screens.
- Decorative cards inside cards.
- Muddy or off-brand palettes that drift away from blue as the primary identity.
- Gradient blobs, bokeh, or floating orbs.
- Large blocks of text explaining how to use the UI.

## Stack And Ownership

Follow the project structure in `docs/project-structure.md`.

Use:

- React + TypeScript.
- Tailwind utility classes as the default styling tool.
- shadcn components from `src/components/ui` for app UI primitives such as buttons, inputs, selects, dialogs, tabs, cards, badges, tooltips, popovers, pagination, progress, and empty states.
- Native browser controls only when there is a concrete reason shadcn is a worse fit, such as file inputs, browser-native date/time controls, or highly constrained legacy integration points.
- lucide-react icons for icon buttons and workflow affordances.
- Custom classes, scoped CSS, CSS variables, and selective inline styling when they materially improve the UI or help express the theme more clearly.

Do not:

- Add new Ant Design usage.
- Add AntD-style APIs such as `Spin`, `Select`, `Modal`, `Button`, `tip`, `spinning`, or `size="large"` to local components.
- Modify `src/components/ui` for feature-specific behavior.
- Create global CSS for feature-specific UI.

If a behavior belongs to one feature, implement it inside that feature:

```txt
src/features/<feature>/components/<ComponentName>.tsx
```

Keep component-private prop types in the component file. Move types only when they are shared.

## Styling Rules

Tailwind is the default, but it is not a hard limit.

You may use:

- Tailwind utility classes for most layout, spacing, typography, and state styling.
- Existing theme variables where they help maintain consistency.
- Custom classes or scoped CSS for more intentional component styling.
- Carefully used inline styles when they solve a real theming or visual problem cleanly.

The goal is not strict adherence to one styling mechanism. The goal is a strong result.

Rules:

- Prefer the styling approach that produces the best UI with the least confusion.
- Keep styles readable and localized to the feature when possible.
- Do not introduce messy one-off styling patterns when a reusable pattern is clearer.
- Do not create feature-specific global CSS unless there is a strong reason.

## Visual Language

### Layout

Use constrained content widths for app pages:

- Main page content: `max-w-7xl mx-auto`.
- Page padding: `px-6 pb-20`, adjusted responsively.
- Header areas should be compact and informative.
- Toolbars should align search, filters, sort, and actions in one scan-friendly row when space allows.
- Use responsive wrapping instead of overflow.

For operational pages, prefer:

- Full-width page backgrounds.
- Bordered panels for tool areas.
- Individual cards only for repeated items such as projects, datasets, models, deployments, and status summaries.
- Tables, grids, filters, tabs, and modals where they match the workflow.
- Balanced whitespace so dense screens still feel modern.

Do not place UI cards inside other cards unless it is a modal or a repeated item inside a clear panel.

### Surfaces

Astral should support both light and dark mode intentionally. Neither theme should feel like an afterthought.

Target feel:

- Light mode should feel crisp, airy, and product-grade, with clean blue accents and clear surface separation.
- Dark mode should feel refined and high-contrast, with deep neutral surfaces and blue highlights that stay vivid without glowing excessively.
- Panels should feel layered through contrast, borders, tint, and spacing rather than relying on heavy shadows.
- Glass, blur, and gradients are allowed when restrained and purposeful.

Use rounded corners consistently:

- Controls: `rounded-xl`.
- Cards and larger panels: `rounded-2xl` or `rounded-3xl`.
- Icon containers: `rounded-xl`.

---

## Color System

Blue is the single identity color for Astral. Every interactive, active, and brand moment should trace back to blue. The palette below defines the full system — primaries, surfaces, semantics, borders, and states — for both light and dark modes.

### Blue Identity Scale

The core brand palette. Use these values consistently across buttons, links, tabs, badges, icons, charts, and highlights.

| Role                                 | Light         | Dark          |
| ------------------------------------ | ------------- | ------------- |
| Subtle background tint               | `blue-50`     | `blue-950/30` |
| Soft highlight / selection fill      | `blue-100`    | `blue-900/40` |
| Muted accent / icon background       | `blue-200`    | `blue-800/50` |
| Icon, inline text link               | `blue-500`    | `blue-400`    |
| Primary action button                | `blue-600`    | `blue-500`    |
| Primary button hover                 | `blue-700`    | `blue-400`    |
| Strong CTA                           | `blue-700`    | `blue-600`    |
| Focus ring                           | `blue-500/30` | `blue-500/40` |
| Active tab underline / border accent | `blue-600`    | `blue-400`    |

**Primary button pattern:**

```tsx
import { Button } from "src/components/ui/button";

<Button className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400">
  New Project
</Button>
```

**Ghost / secondary button pattern:**

```tsx
import { Button } from "src/components/ui/button";

<Button
  variant="outline"
  className="h-10 rounded-xl border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
>
  View Details
</Button>
```

**Text link pattern:**

```tsx
<a className="text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
  Learn more
</a>
```

---

### Surface Hierarchy

Surfaces create depth through contrast, not shadows. Use these layers consistently to separate page, panel, card, and input.

#### Light Mode

| Layer                  | Class                                  | Usage                          |
| ---------------------- | -------------------------------------- | ------------------------------ |
| Page background        | `bg-gray-50` or `bg-white`             | Full page canvas               |
| Raised panel / sidebar | `bg-white border border-gray-200`      | Panels, sidebars, filter areas |
| Card                   | `bg-white border border-gray-200`      | Repeated items                 |
| Sunken / toolbar area  | `bg-gray-50/80 border border-gray-200` | Toolbars, filter bars          |
| Input                  | `bg-white border border-gray-200`      | Text inputs, selects           |
| Hover overlay          | `bg-gray-100`                          | Row and card hover             |
| Active / selected fill | `bg-blue-50 border-blue-200`           | Selected tab, active nav item  |

#### Dark Mode

| Layer                  | Class                                         | Usage                         |
| ---------------------- | --------------------------------------------- | ----------------------------- |
| Page background        | `dark:bg-slate-950`                           | Full page canvas              |
| Raised panel / sidebar | `dark:bg-slate-900 dark:border-white/10`      | Panels, sidebars              |
| Card                   | `dark:bg-slate-900 dark:border-white/8`       | Repeated items                |
| Sunken / toolbar area  | `dark:bg-white/5 dark:border-white/10`        | Toolbars, filter bars         |
| Input                  | `dark:bg-white/10 dark:border-white/20`       | Text inputs, selects          |
| Hover overlay          | `dark:hover:bg-white/8`                       | Row and card hover            |
| Active / selected fill | `dark:bg-blue-900/30 dark:border-blue-700/50` | Selected tab, active nav item |

The dark surface scale uses `slate-950 → slate-900 → slate-800` for progressive depth. Avoid `gray-900` or `zinc-900` as page backgrounds in dark mode — they read warm and break the cool, refined feel.

---

### Border Colors

Borders define structure and separation without adding visual weight.

| Context                     | Light                                         | Dark                      |
| --------------------------- | --------------------------------------------- | ------------------------- |
| Default panel / card border | `border-gray-200`                             | `dark:border-white/10`    |
| Subtle divider              | `border-gray-100`                             | `dark:border-white/6`     |
| Input default               | `border-gray-200`                             | `dark:border-white/20`    |
| Input focused               | `border-blue-400` + `ring-2 ring-blue-500/30` | same                      |
| Active / selected item      | `border-blue-300`                             | `dark:border-blue-600/60` |
| Destructive                 | `border-red-200`                              | `dark:border-red-700/40`  |

---

### Semantic Status Colors

Use semantic colors only for their defined role. Never use them as decorative accents.

#### Success — Emerald

Active, online, completed, healthy states.

```tsx
import { CheckCircle } from "lucide-react";
import { Badge } from "src/components/ui/badge";

<Badge className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
  Active
</Badge>

<CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
```

#### Warning — Amber

Pending, in-progress, needs attention states.

```tsx
import { Clock } from "lucide-react";
import { Badge } from "src/components/ui/badge";

<Badge className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
  Pending
</Badge>

<Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
```

#### Error — Red

Failed, offline, destructive action states.

```tsx
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";

<Badge className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
  Failed
</Badge>

<Button
  variant="destructive"
  className="h-9 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
>
  Delete
</Button>
```

#### Neutral — Slate / Gray

Archived, idle, paused, or inactive states.

```tsx
import { Badge } from "src/components/ui/badge";

<Badge className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400">
  Idle
</Badge>
```

---

### Interactive State Colors

All interactive elements must have distinct default, hover, active, focus, and disabled states.

| State                  | Light                           | Dark                                     |
| ---------------------- | ------------------------------- | ---------------------------------------- |
| Default text           | `text-gray-900`                 | `dark:text-white`                        |
| Muted / secondary text | `text-gray-500`                 | `dark:text-gray-400`                     |
| Placeholder            | `text-gray-400`                 | `dark:text-gray-500`                     |
| Disabled text          | `text-gray-300`                 | `dark:text-gray-600`                     |
| Hover row / item       | `hover:bg-gray-50`              | `dark:hover:bg-white/5`                  |
| Focus ring             | `ring-2 ring-blue-500/30`       | same                                     |
| Selected / active item | `bg-blue-50 text-blue-700`      | `dark:bg-blue-900/30 dark:text-blue-300` |
| Disabled control       | `opacity-50 cursor-not-allowed` | same                                     |

---

### Gradient Usage

Gradients should feel restrained and purposeful — used to suggest depth or add warmth to surfaces, never as decoration.

**Allowed patterns:**

```tsx
// Card top accent bar
<div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-400" />

// Subtle card surface tint (dark mode)
<div className="bg-gradient-to-br from-slate-900 to-slate-900/90 dark:border-white/10" />

// Icon container
<div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2" />

// Horizontal divider shimmer
<div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />

// Page section separator
<div className="h-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />
```

**Do not use:**

- Multi-stop rainbow gradients.
- Gradients that pull in non-blue hues (purple, teal, pink) without product-level intent.
- Gradients as primary card backgrounds in light mode.
- Animated gradient blobs or orbs.

---

### Chart and Data Visualization Colors

Charts and metrics should follow the blue identity as the primary data series color, with a tight supporting palette for multi-series comparisons.

| Series     | Light     | Dark      | Tailwind token              |
| ---------- | --------- | --------- | --------------------------- |
| Primary    | `#3b82f6` | `#60a5fa` | `blue-500 / blue-400`       |
| Secondary  | `#10b981` | `#34d399` | `emerald-500 / emerald-400` |
| Tertiary   | `#f59e0b` | `#fbbf24` | `amber-500 / amber-400`     |
| Quaternary | `#6366f1` | `#818cf8` | `indigo-500 / indigo-400`   |
| Quinary    | `#ec4899` | `#f472b6` | `pink-500 / pink-400`       |

Use the primary blue for single-metric charts, KPI bars, and accuracy plots. Introduce additional series colors only when multiple independent data dimensions are shown simultaneously. Keep unused series colors out of the palette to avoid visual noise.

---

### Color Don'ts

- **No purple as a primary identity color.** Indigo is acceptable only as a chart series color, never as a button or action color.
- **No washed-out gray palettes.** Every surface must have a visible accent structure — blue borders, blue icons, or blue interactive states.
- **No random multicolor accent choices.** All badge, icon, and highlight colors must map to the semantic set above.
- **No neon or high-saturation glows.** Focus rings use `ring-blue-500/30` opacity — never full-saturation outlines.
- **No HSL overrides or arbitrary color values** that fall outside the Tailwind palette and CSS variable system.
- **No dark mode surfaces warmer than `slate-900`.** Never use `gray-900`, `zinc-900`, or `neutral-900` as dark page backgrounds.

---

## Typography

Use the existing app typography, but apply it with more polish and contrast.

Use:

- Page title: `text-3xl font-bold` or `text-2xl font-bold` depending on density.
- Section title: `text-xl lg:text-2xl font-bold`.
- Card title: `text-lg font-bold`.
- Body/help text: `text-sm text-gray-500 dark:text-gray-400`, or an equivalent that preserves good contrast in both themes.
- Labels: `text-sm font-medium`.
- Metadata: `text-xs` or `text-sm`.

Do not use hero-scale typography inside dashboards, panels, cards, sidebars, or forms.

Avoid negative letter spacing. Use `tracking-tight` only where it already matches the local component style.

## Controls

Use familiar controls:

- shadcn `Button` for commands.
- shadcn `Button` with lucide icons for compact repeated actions.
- shadcn `Input` and `Textarea` for search and forms.
- shadcn `Select` for dropdowns.
- shadcn `Tabs` for switching views.
- shadcn `Dialog` for focused create/edit flows.
- shadcn `Badge` for status and task type.
- shadcn `Tooltip` for icon-only or compact controls whose meaning is not obvious.
- shadcn `Popover`, `Command`, or feature-owned wrappers for richer pickers.
- shadcn `Spinner` only as a loading indicator, not a layout placeholder.

Import shadcn primitives from `src/components/ui`. Apply feature-specific layout, color, and sizing at the call site with Tailwind classes; do not edit `src/components/ui` for one feature.

Use native controls only when the browser primitive is required or materially better. If native `<select>` is used, `<option>` children must be plain text. Never pass JSX into an `<option>`.

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

<Select value={taskType} onValueChange={setTaskType}>
  <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
    <SelectValue placeholder="Select task type" />
  </SelectTrigger>
  <SelectContent
    align="start"
    position="popper"
    className="rounded-xl border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950"
  >
    <SelectItem value="IMAGE_CLASSIFICATION">Image classification</SelectItem>
    <SelectItem value="TEXT_CLASSIFICATION">Text classification</SelectItem>
  </SelectContent>
</Select>
```

For icon buttons, use lucide icons:

```tsx
import { Trash } from "lucide-react";
import { Button } from "src/components/ui/button";

<Button
  type="button"
  variant="outline"
  size="icon"
  aria-label="Delete dataset"
  className="rounded-xl border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-white/15 dark:bg-slate-900/75 dark:hover:bg-red-950/30"
>
  <Trash className="size-4" />
</Button>
```

## Common Screen Patterns

### Page Header

Use a compact but polished header with title, supporting text, and a primary action aligned to the right on desktop.

```tsx
import { Button } from "src/components/ui/button";

<div className="mb-5 flex flex-wrap items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Projects
    </h1>
    <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
      Create and manage your AI projects.
    </p>
  </div>
  <Button className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">
    New Project
  </Button>
</div>
```

### Filter Toolbar

Use one panel with search, filters, sort, and reset action. Keep it compact, clean, and visually aligned with the rest of the screen.

```tsx
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
  <div className="flex flex-wrap items-end gap-3">
    <Input className="h-10 min-w-64 flex-1 rounded-xl border-gray-200 bg-white px-4 text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white" />
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="h-10 w-40 rounded-xl border-gray-200 bg-white text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent align="start" position="popper">
        <SelectItem value="latest">Latest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

### Pages with Sidebar Filters

For pages with a sidebar filter panel and main content area, use a two-column layout:

- Header: Compact and left-aligned (not centered).
- Grid: `grid-cols-1 lg:grid-cols-4` or similar ratio, with sidebar on left and content spanning remaining columns.
- Sidebar: Light borders, clean spacing, matching card styling with borders and minimal shadows.
- Content area: Tables, cards, or expanded views that adapt responsively.
- Gap between columns: `gap-6` for breathing room.

```tsx
<div className="max-w-7xl mx-auto">
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Page Title
    </h1>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Supporting description.
    </p>
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
    <div className="lg:col-span-1 flex">{/* Sidebar filters */}</div>
    <div className="lg:col-span-3 flex">{/* Main content */}</div>
  </div>
</div>
```

### Repeated Cards

Cards should show the real object state, not generic marketing content. They should feel modern and product-grade, with strong spacing, clear hierarchy, and blue-led interaction states.

- Name.
- Description or metadata.
- Status badge.
- Type badge.
- Created date or updated date.
- Counts or progress.
- Compact action buttons.

Use stable dimensions to avoid layout shift:

```tsx
import { Card } from "src/components/ui/card";

<Card className="group flex min-h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-gray-200 bg-white p-0 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-700/40">
  ...
</Card>
```

### Loading And Empty States

Loading should be centered in the area being loaded and should not create invalid SVG props.

```tsx
<div className="flex min-h-40 items-center justify-center">
  <Spinner className="size-6" />
</div>
```

If a spinner needs text or an overlay, build the wrapper in the feature component rather than extending `src/components/ui/spinner.tsx`.

Empty states should be short and actionable:

- One title.
- One sentence.
- One primary action when useful.

Do not use large illustrations unless the page is explicitly a landing or onboarding surface.

## Responsive Behavior

Every generated UI must work at desktop and mobile widths.

Rules:

- Use `flex-wrap` for toolbars.
- Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for cards.
- Keep fixed-format elements stable with `min-h`, `aspect-ratio`, or fixed icon button sizes.
- Ensure text does not overflow buttons or cards.
- Avoid viewport-scaled font sizes.
- Avoid overlapping fixed headers, toolbars, and content.

## Accessibility

Use semantic HTML first.

- Buttons must be `<button>`, not clickable `<div>`.
- Inputs and selects need clear labels or nearby visible text.
- Icon-only buttons need `aria-label`.
- Keep focus rings visible.
- Do not rely on color alone for destructive or status states.
- Use meaningful `alt` text for product/task images; use empty alt only for decorative images.

## Code Generation Rules

When generating UI:

1. Read nearby components first and match their patterns.
2. Place files in the owning feature.
3. Use absolute imports from `src`.
4. Use Tailwind classes, not `style={{}}`.
5. Use shadcn components from `src/components/ui` by default; use native controls only with a concrete reason; do not add AntD.
6. Do not modify `src/components/ui` unless the task is explicitly to update the shared design system.
7. Keep prop types local unless reused.
8. Avoid unrelated refactors.
9. Run `npm run build` after code changes.

## Quick Checklist

Before finishing generated UI, check:

- No `style={{}}`.
- No new AntD imports or AntD-style props.
- No JSX inside `<option>`.
- shadcn primitives are used for buttons, inputs, selects, dialogs, tabs, badges, cards, and tooltips unless a native control is explicitly justified.
- No edits to framework-owned `src/components/ui` for feature-specific behavior.
- No decorative gradient blobs/orbs.
- Text fits on mobile and desktop.
- Loading, empty, error, and success states are covered when relevant.
- Build passes.
- No shadow.
- Dark mode uses `slate-950` / `slate-900` surfaces only — not `gray-900` or `zinc-900`.
- All badge, icon, and highlight colors map to the semantic color set.
- Focus rings use `ring-blue-500/30` opacity, not full-saturation outlines.
