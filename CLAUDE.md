# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint via next lint
```

No test suite exists in this project.

## Architecture

**Atlas UI** is a Next.js 15 App Router component library / prototype environment based on the Bento design system (Figma: `AjwZJsf64tNSbbSSLF234H`).

### Routing & Pages
- `src/app/page.tsx` — Single showcase page; all components are documented here with live previews, code snippets, and props tables. New prototype pages get added as new routes under `src/app/`.
- `src/app/layout.tsx` — Sets up Inter font (CSS var `--font-inter`) and imports `globals.css`.

### Styling System
All design tokens live in `src/app/globals.css` inside a `@theme {}` block (Tailwind CSS v4 syntax). Dark mode is **class-based** (`class="dark"` on `<html>`) — not media query — controlled by a JS toggle in `page.tsx`. Dark semantic overrides are in a `.dark {}` block in the same file.

Token naming conventions:
- Primitives: `grey-0` through `grey-130`, `blue-100`, `red-5`, etc.
- Semantic: `text-primary`, `text-secondary`, `text-error`, `text-link`, `icon-primary`, `icon-secondary`, `surface`, `surface-subtle`, `surface-raised`, `border`, `border-strong`
- Elevation shadows: `shadow-elevation-0/1/2/4/8` (MUI-style)

### Component Patterns
- All UI components live in `src/components/ui/` and import `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
- Components use `"use client"` directive where needed (interactive components).
- Styling is done with inline `cn()` calls combining base, variant, size, and color class maps — no CSS modules or styled-components.
- Components extend native HTML element attribute interfaces (`React.ButtonHTMLAttributes`, etc.) and spread `...props` to the root element.
- Icons come from `lucide-react`.

### Docs Components
`src/components/docs/` contains four helper components used only in `page.tsx`:
- `ComponentSection` — section wrapper with id, heading, description, and "When to use" callout
- `DocSubheading` — overline-style subheading
- `LivePreview` — renders a component preview in a framed container
- `PropsTable` — renders a typed props table from a `PropDef[]` array
- `CodeBlock` — syntax-highlighted code snippet display

### Adding a New Component
1. Create `src/components/ui/[name].tsx` following the existing pattern (typed interface, `cn()` for classes, spread `...props`).
2. Add a `ComponentSection` block in `page.tsx` with import, usage snippet, props table, and live preview.
3. Update `NAV_ITEMS` in `page.tsx` to include the new component in the sidebar.

## Component Inventory

All components live in `src/components/ui/`. Import pattern: `import { ComponentName } from "@/components/ui/component-name"`.

| Component | Import | Key Props |
|-----------|--------|-----------|
| `Button` | `@/components/ui/button` | `variant` (solid/outlined/ghost), `color` (primary/secondary/danger), `size` (sm/md/lg), `loading`, `leftIcon`, `rightIcon` |
| `Input` | `@/components/ui/input` | `label`, `hint`, `error`, `leadingIcon`, `trailingIcon` |
| `Textarea` | `@/components/ui/textarea` | `label`, `hint`, `error`, `rows` |
| `Select` | `@/components/ui/select` | `options` (required), `label`, `placeholder`, `hint`, `error` |
| `Checkbox` | `@/components/ui/checkbox` | `label`, `description`, `checked`, `defaultChecked`, `onChange` |
| `Switch` | `@/components/ui/switch` | `label`, `description`, `checked`, `defaultChecked`, `onChange` |
| `Badge` | `@/components/ui/badge` | `variant` (default/success/warning/error/info/purple), `size` (sm/md), `dot`, `status` (adds `role="status"` for live regions) |
| `Avatar` | `@/components/ui/avatar` | `src`, `initials`, `alt` (always provide), `size` (sm/md/lg/xl) |
| `Card` | `@/components/ui/card` | `padding` (none/sm/md/lg), `border`, `elevation` (0/1/2/4/8) |
| `CardHeader` | `@/components/ui/card` | — |
| `CardTitle` | `@/components/ui/card` | — |
| `CardDescription` | `@/components/ui/card` | — |
| `CardFooter` | `@/components/ui/card` | — |

Full machine-readable spec: `src/registry.json`

## Prop Naming Conventions

These conventions are enforced across ALL components:
- `variant` — visual style (never `type`, `style`, `mode`)
- `color` — semantic color role (never `colorVariant`, `scheme`, `intent`)
- `size` — sizing (never `buttonSize`, `s`, `sz`)
- `disabled` — native HTML attribute, always passed through
- `className` — always last, always merged via `cn()`
- Icon props: `leftIcon` / `rightIcon` for buttons, `leadingIcon` / `trailingIcon` for inputs

## Semantic Tokens

Use semantic tokens in className for any custom styling. Never use primitive tokens for text or backgrounds.

| Token | Light value | Use for |
|-------|-------------|---------|
| `text-text-primary` | grey-100 | Body text, headings |
| `text-text-secondary` | grey-70 | Labels, hints, captions |
| `text-text-error` | red-100 | Error messages |
| `text-text-link` | blue-100 | Anchor text |
| `bg-surface` | white | Page background |
| `bg-surface-subtle` | grey-2 | Section backgrounds |
| `bg-surface-raised` | white | Card backgrounds |
| `border-border` | grey-10 | Default borders |
| `border-border-strong` | grey-30 | Emphasized borders |

## Composition Patterns

### Settings form inside a card
```tsx
<Card padding="md">
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
    <CardDescription>Manage your profile.</CardDescription>
  </CardHeader>
  <div className="space-y-4">
    <Input label="Display name" placeholder="Your name" />
    <Select label="Role" options={ROLE_OPTIONS} />
  </div>
  <CardFooter>
    <Button variant="outlined" color="secondary">Cancel</Button>
    <Button variant="solid" color="primary">Save Changes</Button>
  </CardFooter>
</Card>
```

### Status row with badge and action
```tsx
<div className="flex items-center gap-2">
  <Badge variant="error" dot>3 errors</Badge>
  <Button variant="solid" color="danger" size="sm">Fix All</Button>
</div>
```

### Search bar
```tsx
<div className="flex gap-2">
  <Input leadingIcon={<Search />} placeholder="Search..." />
  <Button variant="solid" color="primary">Search</Button>
</div>
```

## Anti-Patterns to Avoid

- **Never use primitive tokens for semantic purposes** — use `text-text-primary` not `text-grey-100`
- **Never place two `solid/primary` buttons side by side**
- **Never use `danger` color for non-destructive actions**
- **Never use `<Switch>` inside a submit-form** — use `<Checkbox>` instead
- **Never omit `alt` on Avatar** — initials and fallback states depend on it for screen readers
- **Never nest Cards more than 1 level deep**
