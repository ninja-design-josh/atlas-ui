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
