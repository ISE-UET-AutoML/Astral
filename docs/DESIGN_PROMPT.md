# Astral Design Prompt

Use this guide when generating or refactoring UI for the Astral frontend. The goal is consistency with the current product: a practical automated ML platform for project, dataset, training, model, and deployment workflows.

Astral should feel like a focused SaaS operations tool: clear, structured, responsive, and polished without becoming a marketing page. Build usable screens first. Avoid decorative layouts that make repeated work slower.

## Product Feel

Astral is an ML workspace, not a portfolio site. Screens should prioritize scanning, filtering, comparison, and action.

Use this tone:

- Work-focused and calm.
- Dense enough for real workflows.
- Modern, but not flashy.
- Clear hierarchy over visual spectacle.
- Subtle motion and hover states only where they improve feedback.

Avoid:

- Oversized landing-page hero patterns for app screens.
- Decorative cards inside cards.
- One-note dark blue, purple, beige, or brown palettes.
- Gradient blobs, bokeh, or floating orbs.
- Large blocks of text explaining how to use the UI.
- Styling through React `style={{}}`.

## Stack And Ownership

Follow the project structure in `docs/project-structure.md`.

Use:

- React + TypeScript.
- Tailwind utility classes.
- shadcn components from `src/components/ui` for new reusable UI.
- Native browser controls directly when they are simpler and more appropriate, such as a basic `<select>`.
- lucide-react icons for icon buttons and workflow affordances.

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

Use Tailwind classes only. Do not use React inline style objects.

```tsx
// Avoid
<div style={{ color: "var(--text)" }} />

// Prefer
<div className="text-[var(--text)]" />
```

Use Tailwind arbitrary values for existing CSS variables and one-off values:

```tsx
<div className="border-[var(--border)] [background:var(--card-gradient)]" />
<div className="[background:linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)]" />
```

Keep class strings readable. Prefer direct classes over extra abstraction until there is real duplication.

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

Do not place UI cards inside other cards unless it is a modal or a repeated item inside a clear panel.

### Surfaces

Current Astral pages use:

- Light mode canvas: `bg-gray-100`.
- Dark mode canvas: `dark:bg-[#161616]`.
- Light panels: `bg-gray-50/80`, `bg-white`, or `bg-white/95`.
- Dark panels: `dark:bg-white/5`, `dark:bg-white/10`, or `dark:[background:var(--card-gradient)]`.
- Borders: `border-gray-200`, `dark:border-white/10`, or `border-[var(--border)]`.
- Subtle shadows: `shadow-lg`, `shadow-xl` when a surface is elevated.
- Backdrop blur sparingly: `backdrop-blur-sm`, `backdrop-blur-md`, `backdrop-blur-xl`.

Use rounded corners consistently:

- Controls: `rounded-xl`.
- Cards and larger panels: `rounded-2xl` or `rounded-3xl`.
- Icon containers: `rounded-xl`.

### Color

Use restrained neutrals with blue as the primary action accent.

Common choices:

- Primary action: `bg-blue-500 hover:bg-blue-600 text-white`.
- Strong CTA: `bg-blue-600 hover:bg-blue-700 text-white`.
- Focus: `focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30`.
- Success: emerald/green only for completed or online states.
- Warning: amber only for pending states.
- Error: red only for failed or destructive states.

Use gradients only when already established in the local screen, such as:

- `bg-gradient-to-br from-blue-500/20 to-blue-600/10`
- `bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent`

Do not add decorative background gradients, gradient blobs, or large atmospheric glows.

### Typography

Use the existing app typography. The current app uses Poppins-loaded UI text in many screens and utility classes for hierarchy.

Use:

- Page title: `text-3xl font-bold` or `text-2xl font-bold` depending on density.
- Section title: `text-xl lg:text-2xl font-bold`.
- Card title: `text-lg font-bold`.
- Body/help text: `text-sm text-gray-500 dark:text-gray-400`.
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

Use a compact header with title, supporting text, and a primary action aligned to the right on desktop.

```tsx
<div className="mb-5 flex flex-wrap items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
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

Use one panel with search, filters, sort, and reset action. Keep it compact.

```tsx
<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
  <div className="flex flex-wrap items-end gap-3">
    <input className="h-10 min-w-64 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white" />
    <select className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white" />
  </div>
</div>
```

### Repeated Cards

Cards should show the real object state, not generic marketing content:

- Name.
- Description or metadata.
- Status badge.
- Type badge.
- Created date or updated date.
- Counts or progress.
- Compact action buttons.

Use stable dimensions to avoid layout shift:

```tsx
<div className="group flex min-h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:[background:var(--card-gradient)]">
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
