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
- shadcn components from `src/components/ui` for new reusable UI.
- Native browser controls directly when they are simpler and more appropriate, such as a basic `<select>`.
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

### Color

Use a modern blue-led palette with clean neutrals and explicit support for light and dark themes.

Common choices:

- Primary action: `bg-blue-500 hover:bg-blue-600 text-white`.
- Strong CTA: `bg-blue-600 hover:bg-blue-700 text-white`.
- Focus: `focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30`.
- Success: emerald/green only for completed or online states.
- Warning: amber only for pending states.
- Error: red only for failed or destructive states.

Blue should carry the product identity across buttons, links, active states, selected tabs, icons, charts, badges, and key highlights.

Use gradients in a controlled modern product way, such as:

- `bg-gradient-to-br from-blue-500/20 to-blue-600/10`
- `bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent`

Avoid:

- Purple-led styling.
- Washed out grays with no accent structure.
- Heavy-handed neon glow effects.
- Random multicolor accents that break the blue identity.

### Typography

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

- Buttons for commands.
- Icon buttons for compact repeated actions.
- Native `<select>` for simple dropdowns.
- shadcn Select only when richer behavior is needed.
- Tabs for switching views.
- Dialogs/modals for focused create/edit flows.
- Inputs for search and forms.
- Badges for status and task type.
- Spinners only as loading indicators, not layout placeholders.

Native `<option>` children must be plain text. Never pass JSX into an `<option>`.

```tsx
<select className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
  <option value="">Select task type</option>
  <option value="IMAGE_CLASSIFICATION">IMAGE CLASSIFICATION</option>
</select>
```

For icon buttons, use lucide icons:

```tsx
<button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/95 transition hover:bg-gray-100 dark:border-white/15 dark:bg-slate-900/75 dark:hover:bg-slate-800/90">
  <Trash className="h-4 w-4 text-red-500" />
</button>
```

## Common Screen Patterns

### Page Header

Use a compact but polished header with title, supporting text, and a primary action aligned to the right on desktop.

```tsx
<div className="mb-5 flex flex-wrap items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Projects
    </h1>
    <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
      Create and manage your AI projects.
    </p>
  </div>
  <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
    New Project
  </button>
</div>
```

### Filter Toolbar

Use one panel with search, filters, sort, and reset action. Keep it compact, clean, and visually aligned with the rest of the screen.

```tsx
<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
  <div className="flex flex-wrap items-end gap-3">
    <input className="h-10 min-w-64 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white" />
    <select className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white" />
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
<div className="group flex min-h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 bg-white transition duration-300 hover:-translate-y-1 dark:[background:var(--card-gradient)]">
  ...
</div>
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
5. Use shadcn components or native controls; do not add AntD.
6. Do not modify `src/components/ui` unless the task is explicitly to update the shared design system.
7. Keep prop types local unless reused.
8. Avoid unrelated refactors.
9. Run `npm run build` after code changes.

## Quick Checklist

Before finishing generated UI, check:

- No `style={{}}`.
- No new AntD imports or AntD-style props.
- No JSX inside `<option>`.
- No edits to framework-owned `src/components/ui` for feature-specific behavior.
- No decorative gradient blobs/orbs.
- Text fits on mobile and desktop.
- Loading, empty, error, and success states are covered when relevant.
- Build passes.
- No shadow
