# Project Structure Guide

This frontend uses a feature-sliced `src` layout. Keep code near the domain that owns it, and keep cross-domain building blocks in shared folders.

## Top-Level Layout

```txt
src/
  app/                  # App shell, route config, app-only pages
  api/                  # Shared HTTP client only
  assets/               # Images, icons, gifs, static CSS assets
  components/
    ui/                 # shadcn components only; treat as framework-owned
    shared/             # reusable app components, not domain-owned
  constants/            # cross-feature constants
  features/             # domain-owned pages, components, hooks, APIs
  layouts/              # route shells and navigation layouts
  lib/                  # small framework/library helpers
  shared/               # shared hooks and non-visual shared code
  store/                # global stores
  styles/               # global styles
  theme/                # theme provider and theme helpers
  utils/                # cross-feature utility functions
```

## Styling Rules

Do not add new global style rules for feature or component UI. Keep styling local to the component with Tailwind utility classes so changes do not leak across unrelated pages.

Use global CSS only for app-wide primitives such as resets, theme variables, font setup, and third-party library overrides that cannot be scoped safely.

Do not use React inline style objects:

```tsx
// Avoid
<div style={{ color: "var(--text)" }} />
```

Use Tailwind utility classes, including arbitrary values when CSS variables or custom values are needed:

```tsx
// Prefer
<div className="text-[var(--text)]" />
<div className="border-[var(--border)] [background:var(--card-gradient)]" />
```

Keep complex one-off visual rules in `className` using Tailwind arbitrary properties instead of `style={{}}`:

```tsx
<div className="[background:linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)]" />
```

## UI Components

Use shadcn components from `src/components/ui` for new UI. Treat `src/components/ui` as framework-owned: do not modify generated/shadcn primitives to fix feature-specific behavior. Fix the caller or create a feature-owned wrapper near the feature instead.

Do not introduce new Ant Design usage or AntD-style APIs such as `Spin`, `Select`, `Modal`, or `Button` props into new code. Existing compatibility wrappers should only be used to keep old call sites working while migrating toward shadcn and native browser primitives.

If a feature needs a simple browser control, use the native element directly in the feature component:

```tsx
<select className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm">
  <option value="">Select type</option>
</select>
```

Do not pass JSX into native `<option>` elements. Options must contain plain text.

## Feature Layout

Each feature owns the files that change with that feature.

```txt
src/features/<feature>/
  api/                  # API functions for this feature
  components/           # UI pieces used by this feature
  hooks/                # React hooks owned by this feature
  pages/                # route-level pages for this feature
  data/                 # local mock/static data, when needed
  constants.ts          # feature-only constants, when needed
  types.ts              # feature-only TypeScript types, when needed
```

Use this rule: if a file needs business knowledge from one domain, put it in that feature. If it is reused by several unrelated features, put it in `src/components/shared`, `src/shared`, `src/utils`, or `src/constants`.

## Type Placement

Keep component-private props and helper types in the component file:

```tsx
type StatusCardProps = {
  label: string;
  value: ReactNode;
};
```

Move types only when they are genuinely shared:

```txt
src/features/<feature>/types.ts
src/features/<feature>/types/<domain>.ts
src/features/<feature>/components/types.ts
```

Use this rule:

- Private to one component: keep it in that component file.
- Shared within one feature: use `src/features/<feature>/types.ts` or `src/features/<feature>/types/`.
- Shared by feature components only: `src/features/<feature>/components/types.ts` is acceptable.
- Shared across unrelated features: use `src/types`, `src/shared`, or another cross-feature location.

## Current Features

```txt
features/admin
features/auth
features/buckets
features/datasets
features/demo
features/deploy
features/gen-apps
features/labels
features/landing
features/models
features/profile
features/project-build
features/projects
features/settings
features/testing
```

## What Goes Where

Add a new page:

```txt
src/features/<feature>/pages/<PageName>/index.tsx
```

Then register it from `src/app/routes`.

Add a feature component:

```txt
src/features/<feature>/components/<ComponentName>.tsx
```

Add a feature hook:

```txt
src/features/<feature>/hooks/useSomething.ts
```

Add feature API calls:

```txt
src/features/<feature>/api/<feature>.api.ts
```

Keep the shared Axios instance in:

```txt
src/api/axios.tsx
```

Do not move shadcn files out of:

```txt
src/components/ui/
```

Do not edit `src/components/ui` to solve feature-specific lint, styling, or behavior issues. Prefer updating the current feature code. If repeated feature-specific behavior is needed, create a wrapper in the owning feature, for example:

```txt
src/features/projects/components/ProjectTaskSelect.tsx
```

## Import Rules

Prefer absolute imports from `src`:

```ts
import DefaultLayout from "src/layouts/DefaultLayout";
import { Button } from "src/components/ui/button";
import { getProjects } from "src/features/projects/api/project";
```

Inside the same folder, short relative imports are fine:

```ts
import ProjectCard from "./card";
```

Avoid importing from another feature's internal page/component unless it is genuinely shared. If two features need the same UI or logic, move that code into a shared location first.
