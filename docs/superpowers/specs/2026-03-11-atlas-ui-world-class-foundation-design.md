# Atlas UI — World-Class Foundation Design

**Date:** 2026-03-11
**Status:** Approved
**Author:** Josh Brinksman + Claude

---

## Overview

Atlas UI is NinjaCat's source-of-truth component library, built on Next.js 15, React 19, TypeScript, and Tailwind CSS v4. The goal of this phase is to transform the existing 9-component library into a world-class, AI-first design system that enables Claude Code, Replit, v0, and other AI prototyping tools to generate consistent, pixel-accurate NinjaCat UI from natural language prompts.

### North Star

> Any AI tool that reads this repository should be able to build a NinjaCat product screen — correctly, consistently, and without improvising — using only the components and tokens defined here.

---

## Architecture

Atlas UI is the **single source of truth**. All design decisions originate in code and push outward to consumers:

```
Atlas UI Codebase (Source of Truth)
        │
        ├── AI Context Layer       → Claude Code, Replit, v0
        ├── Hardened Components    → Developers
        ├── Docs Site (Upgraded)   → Designers + PMs
        └── Figma Push Pipeline    → Figma (reflects Atlas)
```

---

## Phase 1: Foundation (current scope)

Lock in all four pillars across the existing 9 components before expanding breadth.

### Pillar 1 — AI Context Layer

The highest-priority pillar. Makes the library maximally consumable by AI tools.

**Deliverables:**

#### `llms.txt` (project root)
A machine-readable plain-text file following the emerging [llms.txt standard](https://llmstxt.org/). Contains:
- What Atlas UI is and who it's for
- The full component inventory with one-line descriptions
- Design token reference (semantic token names and their meaning)
- Import paths for every component
- Usage rules and do/don't patterns
- Link to the live docs site

#### Enhanced `CLAUDE.md`
Upgrade the existing CLAUDE.md to include:
- Complete component inventory with props summary
- Prop naming conventions (e.g., `color` not `colorVariant`, `size` not `buttonSize`)
- Composition patterns (common multi-component layouts)
- Token usage guide (when to use semantic vs. primitive tokens)
- Anti-patterns to avoid

#### `src/registry.json`
A single machine-readable JSON file describing every component in the library:
```json
{
  "components": [
    {
      "name": "Button",
      "description": "Primary action trigger. Use for all clickable actions.",
      "import": "@/components/ui/button",
      "exports": ["Button"],
      "props": [
        { "name": "variant", "type": "\"solid\" | \"outlined\" | \"ghost\"", "default": "\"solid\"", "description": "Visual style" },
        { "name": "color", "type": "\"primary\" | \"secondary\" | \"danger\"", "default": "\"primary\"", "description": "Semantic color role" },
        { "name": "size", "type": "\"sm\" | \"md\" | \"lg\"", "default": "\"md\"" },
        { "name": "loading", "type": "boolean", "default": "false", "description": "Shows spinner, disables interaction" },
        { "name": "leftIcon", "type": "ReactNode", "description": "Icon before label" },
        { "name": "rightIcon", "type": "ReactNode", "description": "Icon after label" }
      ],
      "variants": ["solid/primary", "solid/secondary", "solid/danger", "outlined/primary", "outlined/secondary", "outlined/danger", "ghost/primary", "ghost/secondary", "ghost/danger"],
      "doPatterns": ["Use solid/primary for the main CTA", "Use outlined/secondary for cancel actions"],
      "dontPatterns": ["Don't use danger unless the action is destructive and irreversible", "Don't stack two solid buttons of the same color"]
    }
  ]
}
```

#### JSDoc on all components and props
Every exported component and every prop interface gets JSDoc:
```tsx
/**
 * Primary action trigger for all clickable actions.
 * Use `solid` for primary CTAs, `outlined` for secondary actions,
 * `ghost` for low-emphasis tertiary actions.
 *
 * @example
 * <Button variant="solid" color="primary">Save Changes</Button>
 * <Button variant="outlined" color="secondary" loading>Saving...</Button>
 */
export function Button({ ... }: ButtonProps) { ... }
```

---

### Pillar 2 — Hardened Components

A full audit of all 9 components against four criteria:

#### 2a. Consistent prop naming conventions
Establish and enforce across all components:
- `color` (not `colorVariant`, `scheme`, or `intent`)
- `size` (not `buttonSize`, `s`, or `sizing`)
- `variant` (not `type`, `style`, or `mode`)
- `disabled` (native HTML attribute — always pass through)
- `className` (always last, always merged via `cn()`)
- Icon props: `leftIcon` / `rightIcon` / `icon` (single icon)

#### 2b. Strict TypeScript
- All prop types exported (e.g., `export type ButtonVariant`, `export type ButtonColor`)
- No `any` types
- Generic HTML attribute interfaces extended correctly (`React.ButtonHTMLAttributes<HTMLButtonElement>`)
- `...props` spread to root element on all components

#### 2c. Accessibility (ARIA + keyboard)
Each component gets a full accessibility audit:
- `Button`: `aria-busy` on loading (already done), `aria-disabled` on disabled
- `Input`: `aria-describedby` linking hint/error to input, `aria-invalid` on error
- `Textarea`: same as Input
- `Select`: `aria-describedby`, `aria-invalid`, `aria-required`
- `Checkbox`: proper `htmlFor` / `id` pairing, `aria-describedby` for description
- `Switch`: `role="switch"`, `aria-checked`, keyboard toggle on Space/Enter
- `Badge`: `role="status"` where appropriate
- `Avatar`: `aria-label` for image alt / initials screen reader text
- `Card`: semantic HTML structure (`article` or `section` where appropriate)

#### 2d. Variant coverage audit
Compare every component's implemented variants against the Figma Bento system. Document any gaps. Fill any missing states (hover, focus, active, disabled, error) using existing design tokens.

---

### Pillar 3 — Docs Site Upgrade

Transform `src/app/page.tsx` from a static showcase into an interactive reference tool. Secondary consumers (designers, PMs) should be able to test any component configuration without touching code.

**Visual design direction: MUI-inspired** (`https://mui.com/material-ui/react-button/`)
The docs site should feel as authoritative and polished as MUI's documentation. Key MUI patterns to replicate:
- Two-column layout: fixed left sidebar (component nav) + scrollable main content area
- Component demo boxes: white/surface-raised cards with a live preview centered inside, bordered, with a grey background behind the demo
- "Show code" toggle beneath each demo that expands the code snippet inline
- Tabbed sections per component: Overview / API / Playground tabs (or equivalent)
- Top navigation bar with search, GitHub link, and dark mode toggle
- Clean typographic hierarchy: large component name heading, subtitle description, then demo → then props table
- Prop tables styled as clean bordered tables with columns: Name | Type | Default | Description
- The overall palette uses Atlas tokens (not Material Design's blue) but the *structure and density* matches MUI exactly

**Deliverables:**

#### Live Props Editor
A controls panel rendered below each component's live preview. Users toggle props via UI controls and the preview updates in real time.

**Architecture:** `ComponentSection` gains a `controlDefs: ControlDef[]` prop. The component manages control state internally and passes the resolved prop values into the live preview renderer.

**`ControlDef` type:**
```ts
type ControlDef =
  | { prop: string; type: "enum";    options: string[]; default: string }
  | { prop: string; type: "boolean";                    default: boolean }
  | { prop: string; type: "string";                     default: string  }
```

**Example for Button:**
```tsx
<ComponentSection
  controlDefs={[
    { prop: "variant", type: "enum",    options: ["solid","outlined","ghost"], default: "solid" },
    { prop: "color",   type: "enum",    options: ["primary","secondary","danger"], default: "primary" },
    { prop: "size",    type: "enum",    options: ["sm","md","lg"], default: "md" },
    { prop: "loading", type: "boolean", default: false },
    { prop: "disabled",type: "boolean", default: false },
  ]}
  renderPreview={(props) => <Button {...props}>Label</Button>}
/>
```

Enum props render as `<select>` dropdowns, booleans as checkboxes, strings as `<input type="text">`.

#### Global Search
A `cmd+k` search bar that searches component names, prop names, and usage patterns. Keyboard-navigable, opens to a modal overlay.

#### Do / Don't Patterns
Each `ComponentSection` gains a `dos` and `donts` array. Rendered as side-by-side visual examples: green-bordered "Do" and red-bordered "Don't" previews with captions.

#### Dark Mode Persistence
Current dark mode toggle resets on page reload. Persist preference to `localStorage`.

#### Component Status Badges
Each component in the sidebar nav shows a status indicator:
- `stable` — production ready, fully accessible, Figma-connected
- `beta` — functional but not yet fully audited
- `draft` — work in progress

#### Improved Navigation
- Sticky sidebar with active state tracking (scroll-spy)
- Section grouping: Foundation (tokens, typography), Form Controls, Display, Layout

---

### Pillar 4 — Figma Push Pipeline

Atlas is the source of truth. A scripted pipeline pushes design tokens and Code Connect mappings to Figma on demand.

**Deliverables:**

#### Token Export Script (`scripts/figma-push-tokens.ts`)
Reads design tokens from `globals.css` `@theme {}` block and exports them as Figma Variables.

**Plan tier requirement:** The Figma Variables REST API (`PUT /v1/files/:file_key/variables`) requires a **Figma Enterprise plan**. Before implementing the push step, confirm NinjaCat's Figma plan tier.

- **If Enterprise:** Push tokens directly via the REST API. Run with `npm run figma:push-tokens`.
- **Fallback (non-Enterprise):** Generate a `tokens-export.json` in [Tokens Studio / Style Dictionary format](https://tokens.studio/) that can be manually imported into Figma via the Tokens Studio plugin. The push command becomes `npm run figma:export-tokens`.

**Dev dependency:** Add `tsx` to `devDependencies` to execute the TypeScript script directly (`tsx scripts/figma-push-tokens.ts`).

Output: All primitive and semantic color tokens organized into collections matching Atlas structure (Primitives → Grey, Blue, etc.; Semantics → Text, Icon, Surface, Border).

#### Code Connect Mappings (`src/components/ui/*.figma.tsx`)
Each component gets a `.figma.tsx` file containing its Figma Code Connect definition, linking the Atlas component to its Figma counterpart in the Bento system. When designers inspect a Figma component, they see the exact Atlas import and usage.

**Prerequisite:** Before writing any `.figma.tsx` file, retrieve and document the correct per-component Figma node ID from the Bento file (`AjwZJsf64tNSbbSSLF234H`). The node `318-810` is the Components *section*, not an individual component — using it will cause Code Connect to fail. Each component (Button, Input, Textarea, etc.) has its own node ID that must be sourced from Figma's inspect panel or via the Figma MCP before implementation.

Example (`button.figma.tsx`) — substitute `<BUTTON_NODE_ID>` with the real value:
```tsx
import figma from "@figma/code-connect";
import { Button } from "./button";

figma.connect(Button, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=<BUTTON_NODE_ID>", {
  props: {
    variant: figma.enum("Variant", { Solid: "solid", Outlined: "outlined", Ghost: "ghost" }),
    color: figma.enum("Color", { Primary: "primary", Secondary: "secondary", Danger: "danger" }),
    size: figma.enum("Size", { SM: "sm", MD: "md", LG: "lg" }),
  },
  example: ({ variant, color, size }) => (
    <Button variant={variant} color={color} size={size}>Label</Button>
  ),
});
```

#### `npm run figma:push` (combined command)
Runs token export + Code Connect publish in sequence.

---

## Implementation Order

Finalize component surface first, then document it — to avoid rewriting docs after accessibility or TypeScript changes:

1. **Prop conventions audit** (Pillar 2a) — establish standards before touching anything else
2. **Accessibility audit** (Pillar 2c) — add ARIA props and keyboard behavior before docs are written
3. **TypeScript strictness** (Pillar 2b) — export all types, no any, before documenting the API
4. **JSDoc + registry.json** (Pillar 1) — document the now-finalized component surface
5. **CLAUDE.md + llms.txt** (Pillar 1) — synthesize into AI context files
6. **Docs site upgrade** (Pillar 3) — live props editor, search, do/don't
7. **Figma node ID sourcing** (Pillar 4 prerequisite) — retrieve and document correct per-component Figma node IDs from the Bento file before writing any `.figma.tsx` file
8. **Figma push pipeline** (Pillar 4) — token export + Code Connect

---

## Success Criteria

**Phase 1 is complete when:**
- [ ] **AI consistency test:** Given this prompt to Claude Code — *"Build a NinjaCat settings page with a Card containing a heading, an Input for display name, a Select for timezone, and a footer with an outlined/secondary Cancel button and a solid/primary Save Changes button"* — the generated output uses only documented props, correct import paths (e.g. `@/components/ui/button`), and no hallucinated prop names. Verified by code review against `registry.json`.
- [ ] All 9 components pass an accessibility audit (ARIA attributes, keyboard navigation, screen reader labels)
- [ ] All 9 components have JSDoc, registry entries, and Figma Code Connect mappings
- [ ] The docs site has a live props editor for every component
- [ ] `npm run figma:push` successfully syncs tokens and Code Connect to the Bento Figma file

---

## Out of Scope (Phase 1)

- New components (deferred to Phase 2)
- Built-in AI chat/prompt interface
- Animation/motion system
- Unit or visual regression tests (no test suite in project)
- Theming system (multi-brand)

---

## Tech Stack (unchanged)

- Next.js 15 App Router, React 19, TypeScript strict mode
- Tailwind CSS v4 (`@theme` block in `globals.css`, class-based dark mode)
- Lucide React (icons)
- `cn()` = clsx + tailwind-merge
- Figma file: `AjwZJsf64tNSbbSSLF234H`
