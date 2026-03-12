# Atlas UI World-Class Foundation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing 9-component Atlas UI library into a world-class, AI-first design system with hardened components, machine-readable AI context files, an MUI-style interactive docs site, and a Figma push pipeline — with Atlas as the single source of truth.

**Architecture:** Code is the source of truth. Four pillars are built in sequence: harden all 9 components (prop conventions → accessibility → TypeScript), then document them (JSDoc → registry.json → CLAUDE.md → llms.txt), then upgrade the docs site (MUI-style layout + live props editor + search), then build the Figma push pipeline (token export + Code Connect). Each pillar builds on the one before it.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, Lucide React, clsx + tailwind-merge. No test suite — verification via `npm run lint`, `npm run build`, and browser inspection.

---

## File Structure

### Modified Files
| File | Change |
|------|--------|
| `src/components/ui/button.tsx` | JSDoc on all exports |
| `src/components/ui/input.tsx` | JSDoc on all exports |
| `src/components/ui/textarea.tsx` | JSDoc on all exports |
| `src/components/ui/select.tsx` | JSDoc on all exports |
| `src/components/ui/checkbox.tsx` | Extend `React.InputHTMLAttributes`, JSDoc |
| `src/components/ui/switch.tsx` | Fix `htmlFor` → `aria-labelledby`, JSDoc |
| `src/components/ui/badge.tsx` | Add optional `status` prop, JSDoc |
| `src/components/ui/avatar.tsx` | Add `aria-label` on container for non-image states, JSDoc |
| `src/components/ui/card.tsx` | JSDoc on all exports |
| `src/components/docs/component-section.tsx` | Add `controlDefs`, `renderPreview`, `dos`, `donts`, `status` props |
| `src/components/docs/live-preview.tsx` | Add "show code" expandable toggle |
| `src/app/page.tsx` | Complete MUI-style rewrite using new layout + updated ComponentSections |
| `src/app/layout.tsx` | Suppress hydration warning for dark mode class |
| `CLAUDE.md` | Major upgrade: full component inventory, prop conventions, composition patterns |
| `package.json` | Add `tsx`, `@figma/code-connect` to devDependencies; add `figma:push` scripts |

### Created Files
| File | Purpose |
|------|---------|
| `src/registry.json` | Machine-readable component spec for AI tools |
| `llms.txt` | AI context file (llms.txt standard) at project root |
| `src/components/docs/props-editor.tsx` | Live props editor component (enum/boolean/string controls) |
| `src/components/docs/search-modal.tsx` | cmd+k global search modal |
| `src/components/docs/docs-layout.tsx` | MUI-style two-column layout (topnav + sidebar + main) |
| `docs/atlas-figma-nodes.md` | Per-component Figma node IDs (sourced before Code Connect work) |
| `scripts/figma-push-tokens.ts` | Reads globals.css tokens, exports to Figma Variables or JSON |
| `src/components/ui/button.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/input.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/textarea.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/select.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/checkbox.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/switch.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/badge.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/avatar.figma.tsx` | Figma Code Connect mapping |
| `src/components/ui/card.figma.tsx` | Figma Code Connect mapping |

---

## Chunk 1: Component Hardening

Prop conventions, accessibility, and TypeScript strictness across all 9 components. Finalize the component surface before writing any documentation.

---

### Task 1: Prop Conventions Audit

Verify that all 9 components already follow the established conventions. Document any deviations and fix them.

**Conventions to enforce:**
- `color` (not `colorVariant`, `scheme`, `intent`)
- `size` (not `buttonSize`, `s`, `sizing`)
- `variant` (not `type`, `style`, `mode`)
- `disabled` — native HTML attribute, always passed via `...props` or explicit prop
- `className` — always last, always merged via `cn()`
- Icon props: `leftIcon` / `rightIcon` / `icon` (single icon)

**Files:** All `src/components/ui/*.tsx`

- [ ] **Step 1: Verify Button conventions**

  Open `src/components/ui/button.tsx`. Confirm:
  - Uses `variant`, `color`, `size` ✓
  - Uses `leftIcon`, `rightIcon` ✓
  - `className` merged via `cn()` ✓
  - `...props` spread to `<button>` ✓

  No changes needed. Note: conventions confirmed.

- [ ] **Step 2: Verify Input conventions**

  Open `src/components/ui/input.tsx`. Confirm:
  - Uses `leadingIcon`, `trailingIcon` (acceptable — these are positional, not generic "icon")
  - `className` merged via `cn()` ✓
  - `...props` spread to `<input>` ✓

  No changes needed.

- [ ] **Step 3: Verify Checkbox conventions**

  Open `src/components/ui/checkbox.tsx`. Note:
  - `CheckboxProps` is a custom interface — does NOT extend `React.InputHTMLAttributes<HTMLInputElement>`
  - This means `name`, `value`, `form`, `required`, and `aria-*` props are unavailable to consumers

  **Fix required** — see Task 3.

- [ ] **Step 4: Verify Switch conventions**

  Open `src/components/ui/switch.tsx`. Note:
  - `SwitchProps` is a custom interface — does NOT extend native HTML attrs
  - `label` element uses `htmlFor={switchId}` pointing to a `<button>` element — incorrect, `htmlFor` only works with labelable form elements

  **Fix required** — see Task 4.

- [ ] **Step 5: Verify Badge, Avatar, Card conventions**

  Confirm Badge, Avatar, Card all extend `React.HTMLAttributes<HTMLElement>` and spread `...props`. ✓ No changes needed.

- [ ] **Step 6: Commit conventions audit notes**

  ```bash
  git add -A
  git commit -m "docs: prop conventions audit — no changes needed except Checkbox and Switch"
  ```

---

### Task 2: Accessibility — Button, Input, Textarea, Select

These four components are already in good shape. Minor gaps only.

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/select.tsx`

- [ ] **Step 1: Audit Button accessibility**

  `button.tsx` already has:
  - `aria-busy={loading}` ✓
  - `disabled={disabled || loading}` ✓
  - `focus-visible:ring-2` ✓

  Add `aria-disabled` for when button is visually disabled without native `disabled` (e.g. in a form that handles its own state). Add to the `<button>` element:

  ```tsx
  // In button.tsx, update the <button> element.
  // IMPORTANT: aria-disabled must come AFTER {...props} so that an explicit
  // aria-disabled passed by the caller is NOT overridden by our computed value.
  <button
    className={cn(base, sizes[size], variants[variant][color], className)}
    disabled={disabled || loading}
    aria-busy={loading}
    {...props}
    aria-disabled={disabled || loading}
  >
  ```

- [ ] **Step 2: Audit Input accessibility**

  `input.tsx` already has `aria-describedby={errorId ?? hintId}` and `aria-invalid={!!error}`. ✓

  No changes needed.

- [ ] **Step 3: Audit Textarea accessibility**

  `textarea.tsx` already has `aria-describedby` and `aria-invalid`. ✓

  No changes needed.

- [ ] **Step 4: Audit Select accessibility**

  `select.tsx` already has `aria-describedby` and `aria-invalid`. ✓

  Native `required` is handled by `...props` spread. No changes needed.

- [ ] **Step 5: Verify lint passes**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint
  ```

  Expected: no errors.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/ui/button.tsx
  git commit -m "a11y: add aria-disabled to Button"
  ```

---

### Task 3: Accessibility — Checkbox (extend native attrs)

`CheckboxProps` must extend `React.InputHTMLAttributes` so consumers can pass `name`, `value`, `required`, `aria-*` etc.

**Files:**
- Modify: `src/components/ui/checkbox.tsx`

- [ ] **Step 1: Update CheckboxProps to extend native input attrs**

  Replace the current `CheckboxProps` interface:

  ```tsx
  // Before:
  export interface CheckboxProps {
    label?: string;
    description?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    id?: string;
    onChange?: (checked: boolean) => void;
    className?: string;
  }

  // After:
  export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
    label?: string;
    description?: string;
    onChange?: (checked: boolean) => void;
  }
  ```

  The `Omit` drops `onChange` (we keep the ergonomic `(checked: boolean) => void` signature) and `size` (HTML's `size` attribute doesn't apply to checkboxes).

- [ ] **Step 2: Update the component destructuring**

  ```tsx
  // Before:
  export function Checkbox({
    label,
    description,
    checked,
    defaultChecked,
    disabled,
    id,
    onChange,
    className,
  }: CheckboxProps) {
    const checkboxId = id ?? React.useId();

  // After:
  export function Checkbox({
    label,
    description,
    checked,
    defaultChecked,
    disabled,
    id,
    onChange,
    className,
    ...props
  }: CheckboxProps) {
    const checkboxId = id ?? React.useId();
  ```

- [ ] **Step 3: Spread ...props onto the native input**

  ```tsx
  // Before:
  <input
    type="checkbox"
    id={checkboxId}
    checked={checked}
    defaultChecked={defaultChecked}
    disabled={disabled}
    onChange={(e) => onChange?.(e.target.checked)}
    className={...}
    aria-describedby={description ? `${checkboxId}-desc` : undefined}
  />

  // After:
  <input
    type="checkbox"
    id={checkboxId}
    checked={checked}
    defaultChecked={defaultChecked}
    disabled={disabled}
    onChange={(e) => onChange?.(e.target.checked)}
    className={...}
    aria-describedby={description ? `${checkboxId}-desc` : undefined}
    {...props}
  />
  ```

- [ ] **Step 4: Verify lint and build pass**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint && npm run build
  ```

  Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/ui/checkbox.tsx
  git commit -m "a11y(checkbox): extend InputHTMLAttributes for native prop passthrough"
  ```

---

### Task 4: Accessibility — Switch (fix htmlFor, add aria-labelledby)

The `<label>` element has `htmlFor` pointing to a `<button>` which is semantically incorrect. Fix by using `aria-labelledby` on the button instead.

**Files:**
- Modify: `src/components/ui/switch.tsx`

- [ ] **Step 1: Add label id and aria-labelledby**

  In `switch.tsx`, update the `<button>` to reference the label by ID, and add an ID to the label:

  ```tsx
  // In the <button> element, add aria-labelledby:
  <button
    id={switchId}
    type="button"
    role="switch"
    aria-checked={isChecked}
    aria-labelledby={label ? `${switchId}-label` : undefined}
    aria-describedby={description ? `${switchId}-desc` : undefined}
    disabled={disabled}
    onClick={handleChange}
    className={...}
  >
  ```

- [ ] **Step 2: Update the label element**

  Change `htmlFor` to a plain `id` (keeping `onClick` for pointer users):

  ```tsx
  // Before:
  <label
    htmlFor={switchId}
    className={...}
    onClick={handleChange}
  >

  // After:
  <label
    id={`${switchId}-label`}
    className={...}
    onClick={handleChange}
  >
  ```

  Note: The `<label>` element without `htmlFor` is still valid HTML and the `onClick` handler keeps click-to-toggle working for pointer users. `aria-labelledby` handles the AT association.

- [ ] **Step 3: Verify lint passes**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint
  ```

  Expected: no errors.

- [ ] **Step 4: Verify in browser**

  Run `npm run dev`. Open `http://localhost:3000`. Find the Switch component section. Tab to the switch — confirm focus ring appears. Press Space — confirm toggle works. Press Enter — confirm toggle works (buttons handle Enter natively).

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/ui/switch.tsx
  git commit -m "a11y(switch): replace htmlFor with aria-labelledby (htmlFor targets button, not form control)"
  ```

---

### Task 5: Accessibility — Badge (status role) and Avatar (aria-label)

**Files:**
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/avatar.tsx`

- [ ] **Step 1: Add optional `status` prop to Badge**

  ```tsx
  // Update BadgeProps:
  export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    status?: boolean;  // adds role="status" for live region announcements
  }

  // Update function signature:
  export function Badge({
    variant = "default",
    size = "md",
    dot = false,
    status = false,
    children,
    className,
    ...props
  }: BadgeProps) {
    return (
      <span
        className={cn(...)}
        role={status ? "status" : undefined}
        {...props}
      >
  ```

- [ ] **Step 2: Add `aria-label` support to Avatar for non-image states**

  When showing initials or the fallback icon (no image), the container div needs an accessible label. The existing `alt` prop should serve as `aria-label` on the container:

  ```tsx
  // Update Avatar component — add aria-label to the container:
  export function Avatar({
    src,
    initials,
    alt = "",
    size = "md",
    className,
    ...props
  }: AvatarProps) {
    const [imgError, setImgError] = React.useState(false);
    const showFallback = !src || imgError;

    return (
      <div
        className={cn(
          "relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full",
          "bg-grey-10 dark:bg-grey-90",
          sizeStyles[size],
          className
        )}
        aria-label={showFallback && alt ? alt : undefined}
        role={showFallback && alt ? "img" : undefined}
        {...props}
      >
  ```

  When `src` is present, the `<img alt={alt}>` handles accessibility. When fallback is shown, the container div becomes the accessible image via `role="img"` + `aria-label`.

- [ ] **Step 3: Verify lint and build pass**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint && npm run build
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/ui/badge.tsx src/components/ui/avatar.tsx
  git commit -m "a11y: Badge status role, Avatar aria-label for fallback states"
  ```

---

### Task 6: TypeScript Strictness — Export All Types

Ensure every component exports its variant/size/color types so consumers and AI tools can import and use them directly.

**Files:** All `src/components/ui/*.tsx`

- [ ] **Step 1: Audit exported types**

  Check each component for missing type exports:

  - `button.tsx`: `ButtonVariant`, `ButtonColor`, `ButtonSize`, `ButtonProps` — all exported ✓
  - `input.tsx`: `InputProps` exported ✓ — no variant/size types needed
  - `textarea.tsx`: `TextareaProps` exported ✓
  - `select.tsx`: `SelectOption`, `SelectProps` exported ✓
  - `checkbox.tsx`: `CheckboxProps` exported ✓ — no variant/size types
  - `switch.tsx`: `SwitchProps` exported ✓
  - `badge.tsx`: `BadgeVariant`, `BadgeSize`, `BadgeProps` — all exported ✓
  - `avatar.tsx`: `AvatarSize`, `AvatarProps` — all exported ✓
  - `card.tsx`: `CardPadding`, `CardElevation`, `CardProps` — all exported ✓

  All types already exported. ✓

- [ ] **Step 2: Verify no `any` types exist**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && grep -r ": any" src/components/ui/
  ```

  Expected: no output. If any found, replace with proper types.

- [ ] **Step 3: Run full build to confirm TypeScript validity**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run build
  ```

  Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit (only if files were changed)**

  Run `git status` first. If no files were modified (audit found nothing to fix), skip this commit — an empty commit serves no purpose.

  If files were changed:
  ```bash
  git add src/components/ui/
  git commit -m "chore: TypeScript strictness — remove any types, confirm all types exported"
  ```

---

## Chunk 2: AI Context Layer

JSDoc on all 9 components, machine-readable registry.json, upgraded CLAUDE.md, and llms.txt. Run after Chunk 1 — documents the finalized component surface.

---

### Task 7: JSDoc — All 9 Components

Add JSDoc comments to every exported component function and props interface. Each JSDoc includes: description, usage guidance, and one `@example`.

**Files:** All `src/components/ui/*.tsx`

- [ ] **Step 1: Add JSDoc to button.tsx**

  Add before `ButtonProps` and before `export function Button`:

  ```tsx
  /**
   * Props for the Button component.
   * @see Button
   */
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }

  /**
   * Primary action trigger for all clickable actions in NinjaCat UI.
   *
   * Use `solid` for the main CTA, `outlined` for secondary actions,
   * `ghost` for low-emphasis tertiary actions.
   *
   * @example
   * // Primary CTA
   * <Button variant="solid" color="primary">Save Changes</Button>
   *
   * // Cancel action
   * <Button variant="outlined" color="secondary">Cancel</Button>
   *
   * // Loading state
   * <Button loading>Saving...</Button>
   */
  export function Button({ ... }: ButtonProps) { ... }
  ```

- [ ] **Step 2: Add JSDoc to input.tsx**

  ```tsx
  /**
   * Text input field with optional label, hint, error, and icon support.
   *
   * Generates unique IDs automatically — do not pass `id` unless you need
   * to reference it externally (e.g., for a custom label).
   *
   * @example
   * <Input label="Email" hint="We'll never share this." placeholder="you@example.com" />
   * <Input label="Username" error="Already taken." defaultValue="josh123" />
   * <Input leadingIcon={<Search />} placeholder="Search..." />
   */
  export function Input({ ... }: InputProps) { ... }
  ```

- [ ] **Step 3: Add JSDoc to textarea.tsx**

  ```tsx
  /**
   * Multi-line text input with optional label, hint, and error state.
   * Vertically resizable by default.
   *
   * @example
   * <Textarea label="Description" hint="Max 500 characters." rows={5} />
   * <Textarea label="Bio" error="Bio cannot be empty." />
   */
  export function Textarea({ ... }: TextareaProps) { ... }
  ```

- [ ] **Step 4: Add JSDoc to select.tsx**

  ```tsx
  /**
   * Native `<select>` styled to match Atlas UI.
   * Pass `options` as `{ value, label, disabled? }[]`.
   *
   * @example
   * <Select
   *   label="Role"
   *   options={[{ value: "admin", label: "Admin" }, { value: "viewer", label: "Viewer" }]}
   *   placeholder="Select a role..."
   * />
   */
  export function Select({ ... }: SelectProps) { ... }
  ```

- [ ] **Step 5: Add JSDoc to checkbox.tsx**

  ```tsx
  /**
   * Controlled or uncontrolled checkbox with label and description support.
   *
   * `onChange` receives the boolean checked value directly (not the native event).
   * Pass native input attrs (name, value, required) — they flow through to the input.
   *
   * @example
   * <Checkbox label="Accept terms" description="Required to continue." />
   * <Checkbox label="Subscribe" checked={value} onChange={setValue} />
   */
  export function Checkbox({ ... }: CheckboxProps) { ... }
  ```

- [ ] **Step 6: Add JSDoc to switch.tsx**

  ```tsx
  /**
   * Toggle switch for boolean settings. Supports controlled and uncontrolled modes.
   *
   * `onChange` receives the boolean checked value directly.
   * Uses `role="switch"` and `aria-checked` for full screen reader support.
   *
   * @example
   * // Uncontrolled
   * <Switch label="Email notifications" description="Receive updates by email." />
   *
   * // Controlled
   * <Switch label="Dark mode" checked={darkMode} onChange={setDarkMode} />
   */
  export function Switch({ ... }: SwitchProps) { ... }
  ```

- [ ] **Step 7: Add JSDoc to badge.tsx**

  ```tsx
  /**
   * Small status or label indicator. Use `variant` to convey semantic meaning.
   *
   * Set `status={true}` to add `role="status"` for live-region announcements
   * (e.g., a count that updates dynamically).
   *
   * @example
   * <Badge variant="success">Active</Badge>
   * <Badge variant="error" dot>3 errors</Badge>
   * <Badge variant="info" status>Loading...</Badge>
   */
  export function Badge({ ... }: BadgeProps) { ... }
  ```

- [ ] **Step 8: Add JSDoc to avatar.tsx**

  ```tsx
  /**
   * User avatar — shows image, initials, or a generic person icon as fallback.
   *
   * Always provide `alt` for accessibility. When no image is shown, `alt`
   * becomes the `aria-label` on the container element.
   *
   * @example
   * <Avatar src="/users/josh.jpg" alt="Josh Brinksman" size="md" />
   * <Avatar initials="JB" alt="Josh Brinksman" size="lg" />
   * <Avatar alt="Unknown user" size="sm" />
   */
  export function Avatar({ ... }: AvatarProps) { ... }
  ```

- [ ] **Step 9: Add JSDoc to card.tsx**

  ```tsx
  /**
   * Surface container for grouping related content. Compose with
   * CardHeader, CardTitle, CardDescription, and CardFooter.
   *
   * @example
   * <Card padding="md" border elevation={1}>
   *   <CardHeader>
   *     <CardTitle>Settings</CardTitle>
   *     <CardDescription>Manage your account preferences.</CardDescription>
   *   </CardHeader>
   *   <CardFooter>
   *     <Button variant="outlined" color="secondary">Cancel</Button>
   *     <Button variant="solid" color="primary">Save</Button>
   *   </CardFooter>
   * </Card>
   */
  export function Card({ ... }: CardProps) { ... }
  ```

  Also add brief JSDoc to `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter`:

  ```tsx
  /** Header region of a Card. Adds bottom margin to separate from content. */
  export function CardHeader({ ... }) { ... }

  /** Primary heading for a Card. Renders as an `<h3>`. */
  export function CardTitle({ ... }) { ... }

  /** Secondary descriptive text below CardTitle. */
  export function CardDescription({ ... }) { ... }

  /** Footer region of a Card. Lays out actions in a row with gap. */
  export function CardFooter({ ... }) { ... }
  ```

- [ ] **Step 10: Verify lint passes**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint
  ```

  Expected: no errors.

- [ ] **Step 11: Commit**

  ```bash
  git add src/components/ui/
  git commit -m "docs: JSDoc on all 9 components and prop interfaces"
  ```

---

### Task 8: Create src/registry.json

Machine-readable JSON describing every component — AI tools consume this to understand the full API surface.

**Files:**
- Create: `src/registry.json`

- [ ] **Step 1: Create registry.json**

  Create `src/registry.json` with the following content (complete all 9 components):

  ```json
  {
    "$schema": "https://atlas-ui.ninjacat.io/registry-schema.json",
    "version": "0.1.0",
    "description": "Atlas UI component registry — NinjaCat's source-of-truth design system",
    "components": [
      {
        "name": "Button",
        "description": "Primary action trigger. Use for all clickable actions.",
        "import": "@/components/ui/button",
        "exports": ["Button", "ButtonProps", "ButtonVariant", "ButtonColor", "ButtonSize"],
        "props": [
          { "name": "variant", "type": "\"solid\" | \"outlined\" | \"ghost\"", "default": "\"solid\"", "description": "Visual weight. solid=primary CTA, outlined=secondary, ghost=tertiary." },
          { "name": "color", "type": "\"primary\" | \"secondary\" | \"danger\"", "default": "\"primary\"", "description": "Semantic color role." },
          { "name": "size", "type": "\"sm\" | \"md\" | \"lg\"", "default": "\"md\"", "description": "Height: sm=32px, md=40px, lg=44px." },
          { "name": "loading", "type": "boolean", "default": "false", "description": "Shows spinner, disables interaction, sets aria-busy." },
          { "name": "leftIcon", "type": "ReactNode", "default": "undefined", "description": "Icon rendered before label text." },
          { "name": "rightIcon", "type": "ReactNode", "default": "undefined", "description": "Icon rendered after label text." },
          { "name": "disabled", "type": "boolean", "default": "false", "description": "Native disabled — removes from tab order." }
        ],
        "doPatterns": [
          "Use solid/primary for the single main CTA on a page or form",
          "Use outlined/secondary for cancel or back actions next to a primary",
          "Use ghost/secondary for tertiary or destructive-confirmation cancel actions",
          "Use size=sm inside table rows or compact layouts"
        ],
        "dontPatterns": [
          "Don't use danger color unless the action permanently destroys data",
          "Don't place two solid/primary buttons side by side",
          "Don't use ghost for primary actions — it reads as inactive"
        ]
      },
      {
        "name": "Input",
        "description": "Text input field for single-line user data entry.",
        "import": "@/components/ui/input",
        "exports": ["Input", "InputProps"],
        "props": [
          { "name": "label", "type": "string", "default": "undefined", "description": "Label text rendered above the input." },
          { "name": "hint", "type": "string", "default": "undefined", "description": "Helper text rendered below when no error is present." },
          { "name": "error", "type": "string", "default": "undefined", "description": "Error message — renders below input, sets aria-invalid, styles red border." },
          { "name": "leadingIcon", "type": "ReactNode", "default": "undefined", "description": "Icon rendered inside the input on the left." },
          { "name": "trailingIcon", "type": "ReactNode", "default": "undefined", "description": "Icon rendered inside the input on the right." },
          { "name": "disabled", "type": "boolean", "default": "false", "description": "Disables the input." },
          { "name": "placeholder", "type": "string", "default": "undefined", "description": "Native placeholder text." }
        ],
        "doPatterns": [
          "Always provide a label — placeholder alone is not accessible",
          "Use error prop instead of rendering your own error message below",
          "Use hint for constraints like character limits or format guidance"
        ],
        "dontPatterns": [
          "Don't show both error and hint at the same time — error replaces hint",
          "Don't use leadingIcon and trailingIcon together without testing at sm screens"
        ]
      },
      {
        "name": "Textarea",
        "description": "Multi-line text input for longer user content.",
        "import": "@/components/ui/textarea",
        "exports": ["Textarea", "TextareaProps"],
        "props": [
          { "name": "label", "type": "string", "default": "undefined", "description": "Label rendered above." },
          { "name": "hint", "type": "string", "default": "undefined", "description": "Helper text below." },
          { "name": "error", "type": "string", "default": "undefined", "description": "Error message — sets aria-invalid." },
          { "name": "rows", "type": "number", "default": "4", "description": "Initial visible row count." },
          { "name": "disabled", "type": "boolean", "default": "false", "description": "Disables the textarea." }
        ],
        "doPatterns": [
          "Use for descriptions, notes, or any content requiring more than one line",
          "Set rows to reflect expected content length"
        ],
        "dontPatterns": [
          "Don't use Textarea for single-line inputs — use Input instead"
        ]
      },
      {
        "name": "Select",
        "description": "Native dropdown for choosing from a fixed list of options.",
        "import": "@/components/ui/select",
        "exports": ["Select", "SelectProps", "SelectOption"],
        "props": [
          { "name": "options", "type": "SelectOption[]", "default": "required", "description": "Array of { value, label, disabled? } objects." },
          { "name": "label", "type": "string", "default": "undefined", "description": "Label rendered above." },
          { "name": "placeholder", "type": "string", "default": "undefined", "description": "Disabled first option shown when no value is selected." },
          { "name": "hint", "type": "string", "default": "undefined", "description": "Helper text below." },
          { "name": "error", "type": "string", "default": "undefined", "description": "Error message — sets aria-invalid." },
          { "name": "disabled", "type": "boolean", "default": "false", "description": "Disables the select." }
        ],
        "doPatterns": [
          "Use when the list of options is fixed and known at build time",
          "Provide a placeholder for optional fields"
        ],
        "dontPatterns": [
          "Don't use for more than ~15 options — consider a searchable dropdown instead",
          "Don't use for boolean yes/no — use a Checkbox or Switch"
        ]
      },
      {
        "name": "Checkbox",
        "description": "Boolean toggle for opt-in/opt-out choices within forms.",
        "import": "@/components/ui/checkbox",
        "exports": ["Checkbox", "CheckboxProps"],
        "props": [
          { "name": "label", "type": "string", "default": "undefined", "description": "Clickable label text next to the checkbox." },
          { "name": "description", "type": "string", "default": "undefined", "description": "Secondary descriptive text below the label." },
          { "name": "checked", "type": "boolean", "default": "undefined", "description": "Controlled checked state." },
          { "name": "defaultChecked", "type": "boolean", "default": "undefined", "description": "Uncontrolled initial checked state." },
          { "name": "disabled", "type": "boolean", "default": "false", "description": "Disables interaction." },
          { "name": "onChange", "type": "(checked: boolean) => void", "default": "undefined", "description": "Called with the new boolean value when changed." },
          { "name": "name", "type": "string", "default": "undefined", "description": "Native name for form submission." }
        ],
        "doPatterns": [
          "Use for opt-in agreements, feature toggles in a list, or multi-select filter groups",
          "Use description for clarifying text below the label"
        ],
        "dontPatterns": [
          "Don't use Checkbox for a single on/off setting — use Switch instead",
          "Don't use Checkbox for mutually exclusive choices — use Select or radio buttons"
        ]
      },
      {
        "name": "Switch",
        "description": "Toggle for a single boolean setting that takes immediate effect.",
        "import": "@/components/ui/switch",
        "exports": ["Switch", "SwitchProps"],
        "props": [
          { "name": "label", "type": "string", "default": "undefined", "description": "Clickable label text next to the switch." },
          { "name": "description", "type": "string", "default": "undefined", "description": "Secondary text below the label." },
          { "name": "checked", "type": "boolean", "default": "undefined", "description": "Controlled checked state." },
          { "name": "defaultChecked", "type": "boolean", "default": "undefined", "description": "Uncontrolled initial state." },
          { "name": "disabled", "type": "boolean", "default": "false", "description": "Disables interaction." },
          { "name": "onChange", "type": "(checked: boolean) => void", "default": "undefined", "description": "Called with new boolean value on toggle." }
        ],
        "doPatterns": [
          "Use for immediate-effect settings like 'Enable notifications' or 'Dark mode'",
          "Use description to explain the consequence of toggling"
        ],
        "dontPatterns": [
          "Don't use Switch inside a form that requires Submit — use Checkbox instead",
          "Don't use Switch for multi-select — use Checkbox group"
        ]
      },
      {
        "name": "Badge",
        "description": "Small inline label for status, category, or count.",
        "import": "@/components/ui/badge",
        "exports": ["Badge", "BadgeProps", "BadgeVariant", "BadgeSize"],
        "props": [
          { "name": "variant", "type": "\"default\" | \"success\" | \"warning\" | \"error\" | \"info\" | \"purple\"", "default": "\"default\"", "description": "Semantic color variant." },
          { "name": "size", "type": "\"sm\" | \"md\"", "default": "\"md\"", "description": "sm=10px text, md=12px text." },
          { "name": "dot", "type": "boolean", "default": "false", "description": "Shows a colored dot before the label." },
          { "name": "status", "type": "boolean", "default": "false", "description": "Adds role='status' for live-region screen reader announcements." }
        ],
        "doPatterns": [
          "Use variant to convey semantic meaning — success=active/complete, error=failed/blocked",
          "Use dot variant for compact status indicators next to names"
        ],
        "dontPatterns": [
          "Don't use Badge for counts that update dynamically without setting status={true}",
          "Don't use more than 2 badges on the same row"
        ]
      },
      {
        "name": "Avatar",
        "description": "Circular user representation — image, initials, or fallback icon.",
        "import": "@/components/ui/avatar",
        "exports": ["Avatar", "AvatarProps", "AvatarSize"],
        "props": [
          { "name": "src", "type": "string", "default": "undefined", "description": "Image URL. Falls back to initials or icon on error." },
          { "name": "initials", "type": "string", "default": "undefined", "description": "1-2 letter initials shown when no image is available." },
          { "name": "alt", "type": "string", "default": "\"\"", "description": "REQUIRED for accessibility — used as aria-label when no image is shown." },
          { "name": "size", "type": "\"sm\" | \"md\" | \"lg\" | \"xl\"", "default": "\"md\"", "description": "sm=24px, md=32px, lg=40px, xl=56px." }
        ],
        "doPatterns": [
          "Always provide alt with the person's name",
          "Provide initials as fallback when image may not load"
        ],
        "dontPatterns": [
          "Don't use Avatar for non-person imagery — use an icon or image instead",
          "Don't omit alt — it breaks screen reader support for initials/fallback states"
        ]
      },
      {
        "name": "Card",
        "description": "Surface container for grouping related content. Compose with CardHeader, CardTitle, CardDescription, CardFooter.",
        "import": "@/components/ui/card",
        "exports": ["Card", "CardHeader", "CardTitle", "CardDescription", "CardFooter", "CardProps", "CardPadding", "CardElevation"],
        "props": [
          { "name": "padding", "type": "\"none\" | \"sm\" | \"md\" | \"lg\"", "default": "\"md\"", "description": "Inner padding. none=0, sm=12px, md=20px, lg=32px." },
          { "name": "border", "type": "boolean", "default": "true", "description": "Shows a subtle border around the card." },
          { "name": "elevation", "type": "0 | 1 | 2 | 4 | 8", "default": "0", "description": "Drop shadow depth. 0=flat, 8=highest." }
        ],
        "composedWith": ["CardHeader", "CardTitle", "CardDescription", "CardFooter"],
        "doPatterns": [
          "Use Card to wrap forms, settings sections, or content panels",
          "Use CardHeader + CardTitle + CardDescription for consistent heading structure",
          "Use CardFooter for action buttons at the bottom"
        ],
        "dontPatterns": [
          "Don't nest Cards more than 1 level deep",
          "Don't use elevation > 2 for inline content — reserve high elevation for modals/popovers"
        ]
      }
    ]
  }
  ```

- [ ] **Step 2: Verify JSON is valid**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && node -e "require('./src/registry.json'); console.log('valid JSON')"
  ```

  Expected: `valid JSON`

- [ ] **Step 3: Commit**

  ```bash
  git add src/registry.json
  git commit -m "feat: add src/registry.json — machine-readable component spec for AI tools"
  ```

---

### Task 9: Upgrade CLAUDE.md

Extend the existing CLAUDE.md with full component inventory, prop conventions, composition patterns, token guide, and anti-patterns.

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add Component Inventory section to CLAUDE.md**

  After the existing `## Architecture` section, add:

  ```markdown
  ## Component Inventory

  All components live in `src/components/ui/`. Import pattern: `import { ComponentName } from "@/components/ui/component-name"`.

  | Component | Import | Key Props |
  |-----------|--------|-----------|
  | `Button` | `@/components/ui/button` | `variant` (solid/outlined/ghost), `color` (primary/secondary/danger), `size` (sm/md/lg), `loading`, `leftIcon`, `rightIcon` |
  | `Input` | `@/components/ui/input` | `label`, `hint`, `error`, `leadingIcon`, `trailingIcon` |
  | `Textarea` | `@/components/ui/textarea` | `label`, `hint`, `error`, `rows` |
  | `Select` | `@/components/ui/select` | `options` (required), `label`, `placeholder`, `hint`, `error` |
  | `Checkbox` | `@/components/ui/checkbox` | `label`, `description`, `checked`, `onChange` |
  | `Switch` | `@/components/ui/switch` | `label`, `description`, `checked`, `onChange` |
  | `Badge` | `@/components/ui/badge` | `variant` (default/success/warning/error/info/purple), `size` (sm/md), `dot`, `status` |
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
  ```

- [ ] **Step 2: Verify CLAUDE.md reads correctly**

  Open the file and confirm all sections are present and correctly formatted.

- [ ] **Step 3: Commit**

  ```bash
  git add CLAUDE.md
  git commit -m "docs: major CLAUDE.md upgrade — component inventory, prop conventions, patterns, tokens"
  ```

---

### Task 10: Create llms.txt

Create an `llms.txt` file in the project root following the [llms.txt standard](https://llmstxt.org/) to make the library discoverable and consumable by AI tools.

**Files:**
- Create: `llms.txt`

- [ ] **Step 1: Create llms.txt**

  Create `/Users/joshbrinksman/Desktop/claude-atlas-ui/llms.txt`:

  ```
  # Atlas UI

  > NinjaCat's source-of-truth component library. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4. Use this library to build consistent NinjaCat product UI.

  Atlas UI implements the NinjaCat Bento design system. All components use the design tokens defined in `src/app/globals.css`. The library is the source of truth — Figma reflects it, not the other way around.

  ## Quick Start

  All components live in `src/components/ui/`. Import with:
  ```tsx
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  // etc.
  ```

  Full machine-readable spec: `src/registry.json`
  Full AI context: `CLAUDE.md`

  ## Components

  - **Button** (`@/components/ui/button`) — action trigger. Props: variant (solid/outlined/ghost), color (primary/secondary/danger), size (sm/md/lg), loading, leftIcon, rightIcon
  - **Input** (`@/components/ui/input`) — text input. Props: label, hint, error, leadingIcon, trailingIcon
  - **Textarea** (`@/components/ui/textarea`) — multi-line input. Props: label, hint, error, rows
  - **Select** (`@/components/ui/select`) — native dropdown. Props: options (required), label, placeholder, hint, error
  - **Checkbox** (`@/components/ui/checkbox`) — boolean toggle for forms. Props: label, description, checked, onChange
  - **Switch** (`@/components/ui/switch`) — immediate-effect toggle. Props: label, description, checked, onChange
  - **Badge** (`@/components/ui/badge`) — status/label indicator. Props: variant (default/success/warning/error/info/purple), size, dot, status
  - **Avatar** (`@/components/ui/avatar`) — user representation. Props: src, initials, alt (always provide), size (sm/md/lg/xl)
  - **Card** (`@/components/ui/card`) — surface container. Props: padding (none/sm/md/lg), border, elevation (0/1/2/4/8). Compose with CardHeader, CardTitle, CardDescription, CardFooter.

  ## Design Tokens

  Defined in `src/app/globals.css` under `@theme {}`. Always use semantic tokens:

  - Text: `text-text-primary`, `text-text-secondary`, `text-text-error`, `text-text-link`
  - Surface: `bg-surface`, `bg-surface-subtle`, `bg-surface-raised`
  - Border: `border-border`, `border-border-strong`
  - Dark mode: class-based (`class="dark"` on `<html>`) — all semantic tokens update automatically

  ## Prop Conventions

  - `variant` — visual style (solid/outlined/ghost)
  - `color` — semantic color role (primary/secondary/danger)
  - `size` — dimensions (sm/md/lg)
  - Icon props: `leftIcon`/`rightIcon` on buttons, `leadingIcon`/`trailingIcon` on inputs
  - `className` — always last, always safe to pass (uses clsx + tailwind-merge)

  ## Do / Don't

  - DO: Use solid/primary for the single main CTA
  - DO: Use outlined/secondary for cancel actions
  - DO: Always provide `alt` on Avatar
  - DON'T: Use two solid/primary buttons side by side
  - DON'T: Use danger color for non-destructive actions
  - DON'T: Use primitive tokens (grey-100) for semantic purposes — use text-text-primary

  ## Files

  - `src/registry.json` — full machine-readable component spec
  - `CLAUDE.md` — extended AI context and patterns
  - `src/app/globals.css` — all design tokens
  - `src/components/ui/` — all component source files
  ```

- [ ] **Step 2: Verify file is at project root**

  ```bash
  ls /Users/joshbrinksman/Desktop/claude-atlas-ui/llms.txt
  ```

  Expected: file exists.

- [ ] **Step 3: Commit**

  ```bash
  git add llms.txt
  git commit -m "feat: add llms.txt — AI context file for Claude Code, Replit, v0"
  ```

---

## Chunk 3: Docs Site Upgrade

MUI-style layout, live props editor, search modal, do/don't patterns, dark mode persistence, and component status badges.

---

### Task 11: Docs Layout — MUI-Style Shell

Extract the page layout into a reusable `DocsLayout` component with: sticky top nav (logo + dark mode toggle + search trigger), fixed left sidebar (component nav with section groupings and status badges), and scrollable main content area.

**Files:**
- Create: `src/components/docs/docs-layout.tsx`
- Modify: `src/app/page.tsx` (use new layout)
- Modify: `src/app/layout.tsx` (suppress hydration warning)

- [ ] **Step 1: Create src/components/docs/docs-layout.tsx**

  ```tsx
  "use client";

  import * as React from "react";
  import { cn } from "@/lib/utils";

  export type ComponentStatus = "stable" | "beta" | "draft";

  export interface NavItem {
    type: "section";
    label: string;
  } | {
    type: "link";
    id: string;
    label: string;
    status?: ComponentStatus;
  }

  interface DocsLayoutProps {
    navItems: NavItem[];
    children: React.ReactNode;
    onSearchOpen?: () => void;
    darkMode: boolean;
    onDarkModeToggle: () => void;
  }

  const statusColors: Record<ComponentStatus, string> = {
    stable: "bg-green-100",
    beta:   "bg-yellow-100",
    draft:  "bg-grey-30",
  };

  export function DocsLayout({
    navItems,
    children,
    onSearchOpen,
    darkMode,
    onDarkModeToggle,
  }: DocsLayoutProps) {
    const [activeId, setActiveId] = React.useState<string>("");

    // Scroll-spy: track which section is in view
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );

      const sections = document.querySelectorAll("section[id]");
      sections.forEach((s) => observer.observe(s));
      return () => observer.disconnect();
    }, []);

    return (
      <div className={cn("min-h-screen flex flex-col", darkMode && "dark")}>
        {/* Top nav */}
        <header className="sticky top-0 z-40 h-14 flex items-center border-b border-border bg-surface px-6 gap-4">
          <span className="font-bold text-base text-text-primary mr-4">Atlas UI</span>
          <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">NinjaCat Design System</span>
          <div className="flex-1" />
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 h-8 rounded-sm border border-border bg-surface-subtle text-sm text-text-secondary hover:border-border-strong transition-colors"
            aria-label="Search components (Cmd+K)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Search</span>
            <kbd className="ml-2 text-[10px] text-text-secondary border border-border rounded px-1">⌘K</kbd>
          </button>
          <button
            onClick={onDarkModeToggle}
            className="w-8 h-8 flex items-center justify-center rounded-sm border border-border hover:bg-surface-subtle transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
          </button>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-surface py-6 px-4">
            <nav>
              {navItems.map((item, i) => {
                if (item.type === "section") {
                  return (
                    <p key={i} className="text-overline text-text-secondary mt-5 mb-1 first:mt-0">
                      {item.label}
                    </p>
                  );
                }
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors",
                      activeId === item.id
                        ? "bg-blue-5 text-blue-100 font-medium dark:bg-blue-100/10 dark:text-blue-50"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
                    )}
                  >
                    {item.label}
                    {item.status && item.status !== "stable" && (
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusColors[item.status])} aria-label={item.status} />
                    )}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-4xl px-12 py-10">
            {children}
          </main>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Update src/app/layout.tsx to suppress hydration warning**

  The dark mode class is set via JS. The `suppressHydrationWarning` on `<html>` prevents React from warning about the mismatch:

  ```tsx
  // In layout.tsx, update the <html> element:
  <html lang="en" suppressHydrationWarning>
  ```

- [ ] **Step 3: Update src/app/page.tsx to use DocsLayout**

  Replace the top-level `<div>` layout in `page.tsx` with `<DocsLayout>`. Move the dark mode state and toggle logic to feed into `DocsLayout`'s props. Also add `localStorage` persistence:

  ```tsx
  // At the top of the Page component:
  const [dark, setDark] = React.useState(false);

  // Load from localStorage on mount:
  React.useEffect(() => {
    const saved = localStorage.getItem("atlas-dark-mode");
    if (saved === "true") setDark(true);
  }, []);

  // Persist on change:
  function toggleDark() {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("atlas-dark-mode", String(next));
      return next;
    });
  }

  // Wrap all content in:
  return (
    <DocsLayout
      navItems={NAV_ITEMS}
      darkMode={dark}
      onDarkModeToggle={toggleDark}
      onSearchOpen={() => setSearchOpen(true)}
    >
      {/* existing section content */}
    </DocsLayout>
  );
  ```

- [ ] **Step 4: Verify in browser**

  ```bash
  npm run dev
  ```

  Open `http://localhost:3000`. Confirm:
  - Top nav is sticky and visible
  - Sidebar is fixed on the left
  - Scrolling the page updates the active sidebar item
  - Dark mode toggle works and persists on page reload

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/docs/docs-layout.tsx src/app/page.tsx src/app/layout.tsx
  git commit -m "feat: MUI-style docs layout — sticky topnav, fixed sidebar, scroll-spy, dark mode persistence"
  ```

---

### Task 12: PropsEditor Component + ComponentSection Update

Build the live props editor and wire it into `ComponentSection`.

**Files:**
- Create: `src/components/docs/props-editor.tsx`
- Modify: `src/components/docs/component-section.tsx`

- [ ] **Step 1: Create src/components/docs/props-editor.tsx**

  ```tsx
  "use client";

  import * as React from "react";
  import { cn } from "@/lib/utils";

  export type ControlDef =
    | { prop: string; type: "enum";    options: string[]; default: string  }
    | { prop: string; type: "boolean";                    default: boolean }
    | { prop: string; type: "string";                     default: string  };

  export type ControlValues = Record<string, string | boolean>;

  interface PropsEditorProps {
    controls: ControlDef[];
    values: ControlValues;
    onChange: (prop: string, value: string | boolean) => void;
  }

  export function PropsEditor({ controls, values, onChange }: PropsEditorProps) {
    return (
      <div className="flex flex-wrap gap-4 p-4 bg-surface-subtle border-t border-border rounded-b-sm">
        {controls.map((ctrl) => (
          <div key={ctrl.prop} className="flex flex-col gap-1 min-w-[120px]">
            <label className="text-[10px] font-medium uppercase tracking-widest text-text-secondary">
              {ctrl.prop}
            </label>
            {ctrl.type === "enum" && (
              <select
                value={values[ctrl.prop] as string}
                onChange={(e) => onChange(ctrl.prop, e.target.value)}
                className="h-7 rounded-sm border border-border bg-surface px-2 text-xs text-text-primary focus:outline-none focus:border-blue-100"
              >
                {ctrl.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {ctrl.type === "boolean" && (
              <input
                type="checkbox"
                checked={values[ctrl.prop] as boolean}
                onChange={(e) => onChange(ctrl.prop, e.target.checked)}
                className="h-4 w-4 rounded border-border accent-blue-100"
              />
            )}
            {ctrl.type === "string" && (
              <input
                type="text"
                value={values[ctrl.prop] as string}
                onChange={(e) => onChange(ctrl.prop, e.target.value)}
                className="h-7 rounded-sm border border-border bg-surface px-2 text-xs text-text-primary focus:outline-none focus:border-blue-100"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  /** Returns an initial values object from a ControlDef array */
  export function initControlValues(controls: ControlDef[]): ControlValues {
    return Object.fromEntries(controls.map((c) => [c.prop, c.default]));
  }
  ```

- [ ] **Step 2: Update ComponentSection to accept controlDefs and renderPreview**

  In `src/components/docs/component-section.tsx`, update the interface and component:

  ```tsx
  "use client";

  import * as React from "react";
  import { cn } from "@/lib/utils";
  import { PropsEditor, type ControlDef, type ControlValues, initControlValues } from "./props-editor";

  export type { ControlDef };

  interface ComponentSectionProps {
    id: string;
    name: string;
    description: string;
    status?: "stable" | "beta" | "draft";
    whenToUse?: string[];
    controlDefs?: ControlDef[];
    renderPreview?: (props: ControlValues) => React.ReactNode;
    dos?: { label: string; preview: React.ReactNode }[];
    donts?: { label: string; preview: React.ReactNode }[];
    children: React.ReactNode;
    className?: string;
  }

  export function ComponentSection({
    id, name, description, status, whenToUse,
    controlDefs, renderPreview,
    dos, donts,
    children, className,
  }: ComponentSectionProps) {
    const [controlValues, setControlValues] = React.useState<ControlValues>(
      () => initControlValues(controlDefs ?? [])
    );

    function handleControlChange(prop: string, value: string | boolean) {
      setControlValues((prev) => ({ ...prev, [prop]: value }));
    }

    return (
      <section
        id={id}
        className={cn("scroll-mt-16 py-10 border-b border-border last:border-0", className)}
      >
        {/* Heading row */}
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-text-primary">{name}</h2>
          {status && status !== "stable" && (
            <span className={cn(
              "text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
              status === "beta"  ? "bg-yellow-10 text-yellow-dark" : "bg-grey-10 text-text-secondary"
            )}>
              {status}
            </span>
          )}
        </div>
        <p className="text-text-secondary mb-6">{description}</p>

        {/* When to use */}
        {whenToUse && whenToUse.length > 0 && (
          <div className="mb-6 p-4 bg-blue-5 dark:bg-blue-100/10 rounded-sm border border-blue-10 dark:border-blue-100/20">
            <p className="text-overline text-blue-100 dark:text-blue-50 mb-2">When to use</p>
            <ul className="space-y-1.5">
              {whenToUse.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-100/40 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live playground */}
        {controlDefs && renderPreview && (
          <div className="mb-8 rounded-sm border border-border overflow-hidden">
            <div className="px-4 py-2 bg-surface-subtle border-b border-border">
              <span className="text-overline text-text-secondary">Playground</span>
            </div>
            <div className="p-8 bg-surface-subtle flex flex-wrap items-center justify-center gap-3 min-h-[120px]">
              {renderPreview(controlValues)}
            </div>
            <PropsEditor
              controls={controlDefs}
              values={controlValues}
              onChange={handleControlChange}
            />
          </div>
        )}

        {/* Do / Don't */}
        {(dos || donts) && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {dos?.map((item, i) => (
              <div key={i} className="rounded-sm border-2 border-green-100 overflow-hidden">
                <div className="px-3 py-1.5 bg-green-5 border-b border-green-100/30">
                  <span className="text-overline text-green-100">Do</span>
                </div>
                <div className="p-4 bg-surface-subtle flex items-center justify-center min-h-[80px]">
                  {item.preview}
                </div>
                <p className="px-3 pb-3 text-xs text-text-secondary">{item.label}</p>
              </div>
            ))}
            {donts?.map((item, i) => (
              <div key={i} className="rounded-sm border-2 border-red-100 overflow-hidden">
                <div className="px-3 py-1.5 bg-red-5 border-b border-red-100/30">
                  <span className="text-overline text-red-100">Don't</span>
                </div>
                <div className="p-4 bg-surface-subtle flex items-center justify-center min-h-[80px]">
                  {item.preview}
                </div>
                <p className="px-3 pb-3 text-xs text-text-secondary">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Existing children (LivePreview + CodeBlock + PropsTable) */}
        <div className="space-y-8">{children}</div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Verify lint and build**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint && npm run build
  ```

  Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/docs/props-editor.tsx src/components/docs/component-section.tsx
  git commit -m "feat: PropsEditor component + ComponentSection playground/do-dont support"
  ```

---

### Task 13: LivePreview — "Show Code" Toggle

Add a collapsible code view beneath the component demo.

**Files:**
- Modify: `src/components/docs/live-preview.tsx`

- [ ] **Step 1: Update LivePreview to accept codeString and show toggle**

  ```tsx
  "use client";

  import * as React from "react";
  import { cn } from "@/lib/utils";

  interface LivePreviewProps {
    label?: string;
    children: React.ReactNode;
    className?: string;
    centered?: boolean;
    noPad?: boolean;
    codeString?: string;  // if provided, shows "Show code" toggle
  }

  export function LivePreview({
    label, children, className, centered = true, noPad = false, codeString,
  }: LivePreviewProps) {
    const [showCode, setShowCode] = React.useState(false);

    return (
      <div className={cn("rounded-sm border border-border overflow-hidden", className)}>
        {label && (
          <div className="px-4 py-2 bg-surface-subtle border-b border-border flex items-center justify-between">
            <span className="text-overline text-text-secondary">{label}</span>
          </div>
        )}
        <div
          className={cn(
            "bg-surface-subtle",
            !noPad && "p-6",
            centered && "flex flex-wrap items-center justify-center gap-3"
          )}
        >
          {children}
        </div>
        {codeString && (
          <>
            <button
              onClick={() => setShowCode((s) => !s)}
              className="w-full px-4 py-2 flex items-center gap-2 text-xs text-text-secondary border-t border-border hover:bg-surface-subtle transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {showCode
                  ? <path d="M18 15l-6-6-6 6"/>
                  : <path d="M6 9l6 6 6-6"/>
                }
              </svg>
              {showCode ? "Hide code" : "Show code"}
            </button>
            {showCode && (
              <div className="border-t border-border">
                <pre className="p-4 bg-grey-120 dark:bg-grey-130 text-grey-10 text-xs overflow-x-auto leading-relaxed">
                  <code>{codeString}</code>
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify lint passes**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/docs/live-preview.tsx
  git commit -m "feat: LivePreview 'show code' expandable toggle"
  ```

---

### Task 14: Global Search Modal (cmd+k)

**Files:**
- Create: `src/components/docs/search-modal.tsx`
- Modify: `src/app/page.tsx` (add state + render SearchModal)

- [ ] **Step 1: Create src/components/docs/search-modal.tsx**

  ```tsx
  "use client";

  import * as React from "react";
  import { cn } from "@/lib/utils";

  interface SearchResult {
    id: string;
    label: string;
    description: string;
    type: "component" | "prop" | "token";
  }

  interface SearchModalProps {
    open: boolean;
    onClose: () => void;
    items: SearchResult[];
  }

  export function SearchModal({ open, onClose, items }: SearchModalProps) {
    const [query, setQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (open) {
        setQuery("");
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    }, [open]);

    // Close on Escape
    React.useEffect(() => {
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
      }
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const results = items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="absolute inset-0 bg-grey-130/40" aria-hidden="true" />
        <div
          className="relative w-full max-w-lg bg-surface rounded-sm border border-border shadow-elevation-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary shrink-0" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, props, tokens..."
              className="flex-1 h-12 bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
            />
            <kbd className="text-[10px] text-text-secondary border border-border rounded px-1">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 && (
              <p className="p-6 text-sm text-text-secondary text-center">No results for "{query}"</p>
            )}
            {results.map((result) => (
              <a
                key={result.id}
                href={`#${result.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-subtle transition-colors border-b border-border last:border-0"
              >
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0",
                  result.type === "component" ? "bg-blue-5 text-blue-100" :
                  result.type === "prop"      ? "bg-purple-5 text-purple-100" :
                                                "bg-grey-10 text-text-secondary"
                )}>
                  {result.type}
                </span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{result.label}</p>
                  <p className="text-xs text-text-secondary">{result.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Add search state and cmd+k listener to page.tsx**

  In `page.tsx`, add:

  ```tsx
  const [searchOpen, setSearchOpen] = React.useState(false);

  // cmd+k handler
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  ```

  Define `SEARCH_ITEMS` array (one entry per component):

  ```tsx
  const SEARCH_ITEMS = [
    { id: "button",   label: "Button",   description: "Action trigger — solid, outlined, ghost variants", type: "component" as const },
    { id: "input",    label: "Input",    description: "Text input with label, hint, error, icon support", type: "component" as const },
    { id: "textarea", label: "Textarea", description: "Multi-line text input",                             type: "component" as const },
    { id: "select",   label: "Select",   description: "Native dropdown for fixed option lists",            type: "component" as const },
    { id: "checkbox", label: "Checkbox", description: "Boolean toggle for form opt-ins",                  type: "component" as const },
    { id: "switch",   label: "Switch",   description: "Immediate-effect boolean toggle",                  type: "component" as const },
    { id: "badge",    label: "Badge",    description: "Status/label indicator with semantic variants",    type: "component" as const },
    { id: "avatar",   label: "Avatar",   description: "User representation — image, initials, icon",     type: "component" as const },
    { id: "card",     label: "Card",     description: "Surface container — compose with CardHeader etc.", type: "component" as const },
  ];
  ```

  Render at the bottom of the JSX (before closing tag):

  ```tsx
  <SearchModal
    open={searchOpen}
    onClose={() => setSearchOpen(false)}
    items={SEARCH_ITEMS}
  />
  ```

  Pass `onSearchOpen={() => {}}` as a no-op placeholder to `DocsLayout` for now — it will be wired to real state in Task 14 when `SearchModal` is added.

- [ ] **Step 3: Verify in browser**

  Press `Cmd+K` — modal opens. Type "button" — Button result appears. Click it — scrolls to Button section, modal closes. Press `Escape` — modal closes.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/docs/search-modal.tsx src/app/page.tsx
  git commit -m "feat: cmd+k global search modal with component search"
  ```

---

### Task 15: Wire Playgrounds Into All 9 ComponentSections

Update every `<ComponentSection>` in `page.tsx` to pass `controlDefs` and `renderPreview` for the live playground.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update Button ComponentSection**

  ```tsx
  // Import the exported types at the top of page.tsx for typed casts:
  // import type { ButtonVariant, ButtonColor, ButtonSize } from "@/components/ui/button";
  // import type { BadgeVariant, BadgeSize } from "@/components/ui/badge";
  // import type { AvatarSize } from "@/components/ui/avatar";
  // import type { CardPadding, CardElevation } from "@/components/ui/card";

  <ComponentSection
    id="button"
    name="Button"
    description="Primary action trigger..."
    status="stable"
    controlDefs={[
      { prop: "variant",  type: "enum",    options: ["solid","outlined","ghost"],     default: "solid" },
      { prop: "color",    type: "enum",    options: ["primary","secondary","danger"],  default: "primary" },
      { prop: "size",     type: "enum",    options: ["sm","md","lg"],                  default: "md" },
      { prop: "loading",  type: "boolean",                                             default: false },
      { prop: "disabled", type: "boolean",                                             default: false },
      { prop: "children", type: "string",                                              default: "Click me" },
    ]}
    renderPreview={(p) => (
      <Button
        variant={p.variant as ButtonVariant}
        color={p.color as ButtonColor}
        size={p.size as ButtonSize}
        loading={p.loading as boolean}
        disabled={p.disabled as boolean}
      >
        {p.children as string}
      </Button>
    )}
    dos={[
      { label: "Use solid/primary for the main CTA", preview: <Button variant="solid" color="primary">Save Changes</Button> },
      { label: "Use outlined/secondary for cancel", preview: <Button variant="outlined" color="secondary">Cancel</Button> },
    ]}
    donts={[
      { label: "Don't use two solid/primary buttons side by side", preview: <div className="flex gap-2"><Button variant="solid" color="primary">Save</Button><Button variant="solid" color="primary">Delete</Button></div> },
      { label: "Don't use danger for non-destructive actions", preview: <Button variant="solid" color="danger">Save Profile</Button> },
    ]}
    whenToUse={[
      "Use for any clickable action that changes state or navigates",
      "Use solid/primary for the single main CTA on a page or form",
      "Use outlined/secondary alongside a primary action (e.g. Cancel next to Save)",
      "Use ghost for low-emphasis or tertiary actions",
    ]}
  >
    {/* existing CodeBlock + PropsTable */}
  </ComponentSection>
  ```

- [ ] **Step 2: Update Input ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "label",       type: "string",  default: "Email address" },
    { prop: "placeholder", type: "string",  default: "you@example.com" },
    { prop: "hint",        type: "string",  default: "We'll never share this." },
    { prop: "error",       type: "string",  default: "" },
    { prop: "disabled",    type: "boolean", default: false },
  ]}
  renderPreview={(p) => (
    <div className="w-64">
      <Input
        label={p.label as string || undefined}
        placeholder={p.placeholder as string}
        hint={(p.hint as string) || undefined}
        error={(p.error as string) || undefined}
        disabled={p.disabled as boolean}
      />
    </div>
  )}
  ```

- [ ] **Step 3: Update Textarea ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "label",       type: "string",  default: "Description" },
    { prop: "placeholder", type: "string",  default: "Write something..." },
    { prop: "hint",        type: "string",  default: "" },
    { prop: "error",       type: "string",  default: "" },
    { prop: "rows",        type: "string",  default: "4" },
    { prop: "disabled",    type: "boolean", default: false },
  ]}
  renderPreview={(p) => (
    <div className="w-64">
      <Textarea
        label={p.label as string || undefined}
        placeholder={p.placeholder as string}
        hint={(p.hint as string) || undefined}
        error={(p.error as string) || undefined}
        rows={Number(p.rows)}
        disabled={p.disabled as boolean}
      />
    </div>
  )}
  ```

- [ ] **Step 4: Update Select ComponentSection**

  ```tsx
  const PLAYGROUND_OPTIONS = [
    { value: "admin",  label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
  ];

  controlDefs={[
    { prop: "label",    type: "string",  default: "Role" },
    { prop: "error",    type: "string",  default: "" },
    { prop: "disabled", type: "boolean", default: false },
  ]}
  renderPreview={(p) => (
    <div className="w-64">
      <Select
        label={p.label as string || undefined}
        options={PLAYGROUND_OPTIONS}
        placeholder="Select a role..."
        error={(p.error as string) || undefined}
        disabled={p.disabled as boolean}
      />
    </div>
  )}
  ```

- [ ] **Step 5: Update Checkbox ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "label",       type: "string",  default: "Accept terms of service" },
    { prop: "description", type: "string",  default: "Required to continue." },
    { prop: "disabled",    type: "boolean", default: false },
  ]}
  renderPreview={(p) => (
    <Checkbox
      label={p.label as string}
      description={(p.description as string) || undefined}
      disabled={p.disabled as boolean}
    />
  )}
  ```

- [ ] **Step 6: Update Switch ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "label",       type: "string",  default: "Email notifications" },
    { prop: "description", type: "string",  default: "Receive updates by email." },
    { prop: "disabled",    type: "boolean", default: false },
  ]}
  renderPreview={(p) => (
    <Switch
      label={p.label as string}
      description={(p.description as string) || undefined}
      disabled={p.disabled as boolean}
    />
  )}
  ```

- [ ] **Step 7: Update Badge ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "variant", type: "enum",    options: ["default","success","warning","error","info","purple"], default: "success" },
    { prop: "size",    type: "enum",    options: ["sm","md"],                                              default: "md" },
    { prop: "dot",     type: "boolean",                                                                    default: false },
    { prop: "label",   type: "string",                                                                     default: "Active" },
  ]}
  renderPreview={(p) => (
    <Badge variant={p.variant as BadgeVariant} size={p.size as BadgeSize} dot={p.dot as boolean}>
      {p.label as string}
    </Badge>
  )}
  ```

- [ ] **Step 8: Update Avatar ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "initials", type: "string", default: "JB" },
    { prop: "size",     type: "enum",   options: ["sm","md","lg","xl"], default: "md" },
    { prop: "alt",      type: "string", default: "Josh Brinksman" },
  ]}
  renderPreview={(p) => (
    <Avatar initials={p.initials as string} size={p.size as AvatarSize} alt={p.alt as string} />
  )}
  ```

- [ ] **Step 9: Update Card ComponentSection**

  ```tsx
  controlDefs={[
    { prop: "padding",   type: "enum",    options: ["none","sm","md","lg"],    default: "md" },
    { prop: "border",    type: "boolean",                                       default: true },
    { prop: "elevation", type: "enum",    options: ["0","1","2","4","8"],       default: "0" },
  ]}
  renderPreview={(p) => (
    <Card padding={p.padding as CardPadding} border={p.border as boolean} elevation={Number(p.elevation) as CardElevation}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Supporting description text.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outlined" color="secondary" size="sm">Cancel</Button>
        <Button variant="solid" color="primary" size="sm">Save</Button>
      </CardFooter>
    </Card>
  )}
  ```

- [ ] **Step 10: Run lint and build**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run lint && npm run build
  ```

  Expected: no errors.

- [ ] **Step 11: Verify all 9 playgrounds in browser**

  Open `http://localhost:3000`. For each component section, confirm the playground renders, controls update the preview in real time.

- [ ] **Step 12: Commit**

  ```bash
  git add src/app/page.tsx
  git commit -m "feat: live playgrounds for all 9 components with do/don't patterns"
  ```

---

## Chunk 4: Figma Push Pipeline

Token export script, Code Connect mappings for all 9 components, and the combined `figma:push` command.

---

### Task 16: Source Figma Component Node IDs (Prerequisite)

Before writing any `.figma.tsx` Code Connect file, you must retrieve the correct Figma node ID for each component in the Bento file (`AjwZJsf64tNSbbSSLF234H`). Using the wrong node ID will silently produce incorrect mappings.

**Files:**
- Create: `docs/atlas-figma-nodes.md`

- [ ] **Step 1: Retrieve node IDs via Figma MCP**

  Use the Figma MCP tool (`get_metadata`) to inspect the Bento file and retrieve the node ID for each of the 9 components:

  ```
  File key: AjwZJsf64tNSbbSSLF234H
  Target: Button, Input, Textarea, Select, Checkbox, Switch, Badge, Avatar, Card
  ```

  For each component, note the exact node ID (format: `XXX-YYY`).

- [ ] **Step 2: Verify node IDs are valid component-level IDs**

  Before writing the file, confirm each retrieved node ID:
  - Is NOT `318-810` (that is the Components section parent — using it will silently fail)
  - Is distinct from all the others (each component has its own node)
  - Resolves to a Figma component frame (not a page or group)

  If the MCP returns `318-810` for any component, navigate deeper into that node's children to find the individual component frame.

- [ ] **Step 3: Create docs/atlas-figma-nodes.md**

  ```markdown
  # Atlas UI — Figma Component Node IDs

  Bento file key: `AjwZJsf64tNSbbSSLF234H`

  | Component | Figma Node ID | Figma URL |
  |-----------|--------------|-----------|
  | Button    | [retrieved]  | https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[id] |
  | Input     | [retrieved]  | ... |
  | Textarea  | [retrieved]  | ... |
  | Select    | [retrieved]  | ... |
  | Checkbox  | [retrieved]  | ... |
  | Switch    | [retrieved]  | ... |
  | Badge     | [retrieved]  | ... |
  | Avatar    | [retrieved]  | ... |
  | Card      | [retrieved]  | ... |

  Last updated: 2026-03-11
  ```

  Fill in all node IDs. No `[retrieved]` placeholders should remain before committing.

- [ ] **Step 4: Commit**

  ```bash
  git add docs/atlas-figma-nodes.md
  git commit -m "docs: Figma component node IDs for Code Connect — prerequisite for figma:push"
  ```

---

### Task 17: Token Export Script

**Files:**
- Modify: `package.json` (add `tsx` dev dep + scripts)
- Create: `scripts/figma-push-tokens.ts`

- [ ] **Step 1: Add tsx to devDependencies**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm install --save-dev tsx
  ```

  Verify it appears in `package.json` devDependencies.

- [ ] **Step 2: Add scripts to package.json**

  In the `"scripts"` block, add:

  ```json
  "figma:export-tokens": "tsx scripts/figma-push-tokens.ts",
  "figma:push-cc": "npx @figma/code-connect publish --token $FIGMA_TOKEN",
  "figma:push": "npm run figma:export-tokens && npm run figma:push-cc"
  ```

- [ ] **Step 3: Create scripts/figma-push-tokens.ts**

  This script reads all `--color-*` tokens from `globals.css` and exports them in Tokens Studio JSON format (compatible with Figma's Tokens Studio plugin for non-Enterprise plans; can be adapted to the Variables REST API for Enterprise):

  ```ts
  import fs from "fs";
  import path from "path";

  const CSS_PATH = path.join(process.cwd(), "src/app/globals.css");
  const OUT_PATH = path.join(process.cwd(), "tokens-export.json");

  const css = fs.readFileSync(CSS_PATH, "utf-8");

  // Extract --color-* tokens from @theme block
  const tokenRegex = /--color-([\w-]+):\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g;
  const tokens: Record<string, Record<string, { value: string; type: string }>> = {
    "Primitives/Grey":    {},
    "Primitives/Blue":    {},
    "Primitives/Green":   {},
    "Primitives/Red":     {},
    "Primitives/Purple":  {},
    "Primitives/Yellow":  {},
    "Primitives/Brand":   {},
    "Semantic/Text":      {},
    "Semantic/Icon":      {},
    "Semantic/Surface":   {},
    "Semantic/Border":    {},
  };

  let match;
  while ((match = tokenRegex.exec(css)) !== null) {
    const [, name, value] = match;
    const token = { value, type: "color" };

    if (name.startsWith("grey-"))          tokens["Primitives/Grey"][name]    = token;
    else if (name.startsWith("blue-"))     tokens["Primitives/Blue"][name]    = token;
    else if (name.startsWith("green-"))    tokens["Primitives/Green"][name]   = token;
    else if (name.startsWith("red-"))      tokens["Primitives/Red"][name]     = token;
    else if (name.startsWith("purple-"))   tokens["Primitives/Purple"][name]  = token;
    else if (name.startsWith("yellow-"))   tokens["Primitives/Yellow"][name]  = token;
    else if (name.startsWith("brand-"))    tokens["Primitives/Brand"][name]   = token;
    else if (name.startsWith("text-"))     tokens["Semantic/Text"][name]      = token;
    else if (name.startsWith("icon-"))     tokens["Semantic/Icon"][name]      = token;
    else if (name.startsWith("surface"))   tokens["Semantic/Surface"][name]   = token;
    else if (name.startsWith("border"))    tokens["Semantic/Border"][name]    = token;
  }

  // Remove empty groups
  const output = Object.fromEntries(
    Object.entries(tokens).filter(([, v]) => Object.keys(v).length > 0)
  );

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`✓ Tokens exported to ${OUT_PATH}`);
  console.log(`  Groups: ${Object.keys(output).join(", ")}`);
  ```

- [ ] **Step 4: Run the export script**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm run figma:export-tokens
  ```

  Expected output:
  ```
  ✓ Tokens exported to .../tokens-export.json
    Groups: Primitives/Grey, Primitives/Blue, Primitives/Green, Primitives/Red, ...
  ```

  Verify `tokens-export.json` exists and is valid JSON.

- [ ] **Step 5: Add tokens-export.json to .gitignore**

  ```bash
  echo "tokens-export.json" >> .gitignore
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add package.json scripts/figma-push-tokens.ts .gitignore
  git commit -m "feat: token export script — generates Tokens Studio JSON from globals.css"
  ```

---

### Task 18: Figma Code Connect — Install and Configure

**Files:**
- Modify: `package.json` (add `@figma/code-connect`)

- [ ] **Step 1: Install @figma/code-connect**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npm install --save-dev @figma/code-connect
  ```

- [ ] **Step 2: Create figma.config.json at project root**

  ```json
  {
    "codeConnect": {
      "include": ["src/components/ui/**/*.figma.tsx"],
      "parser": "react"
    }
  }
  ```

- [ ] **Step 3: Verify install**

  ```bash
  npx @figma/code-connect --version
  ```

  Expected: version string (e.g. `1.x.x`).

- [ ] **Step 4: Commit**

  ```bash
  git add package.json figma.config.json
  git commit -m "chore: install @figma/code-connect and add figma.config.json"
  ```

---

### Task 19: Code Connect Mappings — All 9 Components

Write `.figma.tsx` for each component using the node IDs from `docs/atlas-figma-nodes.md`. Replace `[NODE_ID]` placeholders with actual values.

**Files:** `src/components/ui/*.figma.tsx` (9 files)

- [ ] **Step 1: Create button.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Button } from "./button";

  figma.connect(Button, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[BUTTON_NODE_ID]", {
    props: {
      variant: figma.enum("Variant", { Solid: "solid", Outlined: "outlined", Ghost: "ghost" }),
      color:   figma.enum("Color",   { Primary: "primary", Secondary: "secondary", Danger: "danger" }),
      size:    figma.enum("Size",    { SM: "sm", MD: "md", LG: "lg" }),
      loading: figma.boolean("Loading"),
    },
    example: ({ variant, color, size, loading }) => (
      <Button variant={variant} color={color} size={size} loading={loading}>Label</Button>
    ),
  });
  ```

- [ ] **Step 2: Create input.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Input } from "./input";

  figma.connect(Input, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[INPUT_NODE_ID]", {
    props: {
      label:       figma.string("Label"),
      placeholder: figma.string("Placeholder"),
      error:       figma.string("Error"),
      hint:        figma.string("Hint"),
    },
    example: ({ label, placeholder, error, hint }) => (
      <Input label={label} placeholder={placeholder} error={error || undefined} hint={hint || undefined} />
    ),
  });
  ```

- [ ] **Step 3: Create textarea.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Textarea } from "./textarea";

  figma.connect(Textarea, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[TEXTAREA_NODE_ID]", {
    props: {
      label: figma.string("Label"),
      error: figma.string("Error"),
    },
    example: ({ label, error }) => (
      <Textarea label={label} error={error || undefined} />
    ),
  });
  ```

- [ ] **Step 4: Create select.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Select } from "./select";

  figma.connect(Select, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[SELECT_NODE_ID]", {
    props: {
      label: figma.string("Label"),
      error: figma.string("Error"),
    },
    example: ({ label, error }) => (
      <Select
        label={label}
        options={[{ value: "option1", label: "Option 1" }]}
        error={error || undefined}
      />
    ),
  });
  ```

- [ ] **Step 5: Create checkbox.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Checkbox } from "./checkbox";

  figma.connect(Checkbox, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[CHECKBOX_NODE_ID]", {
    props: {
      label:    figma.string("Label"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ label, disabled }) => (
      <Checkbox label={label} disabled={disabled} />
    ),
  });
  ```

- [ ] **Step 6: Create switch.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Switch } from "./switch";

  figma.connect(Switch, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[SWITCH_NODE_ID]", {
    props: {
      label:    figma.string("Label"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ label, disabled }) => (
      <Switch label={label} disabled={disabled} />
    ),
  });
  ```

- [ ] **Step 7: Create badge.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Badge } from "./badge";

  figma.connect(Badge, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[BADGE_NODE_ID]", {
    props: {
      variant: figma.enum("Variant", {
        Default: "default", Success: "success", Warning: "warning",
        Error: "error", Info: "info", Purple: "purple"
      }),
      size: figma.enum("Size", { SM: "sm", MD: "md" }),
      dot:  figma.boolean("Dot"),
    },
    example: ({ variant, size, dot }) => (
      <Badge variant={variant} size={size} dot={dot}>Label</Badge>
    ),
  });
  ```

- [ ] **Step 8: Create avatar.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Avatar } from "./avatar";

  figma.connect(Avatar, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[AVATAR_NODE_ID]", {
    props: {
      size: figma.enum("Size", { SM: "sm", MD: "md", LG: "lg", XL: "xl" }),
    },
    example: ({ size }) => (
      <Avatar initials="AB" alt="User" size={size} />
    ),
  });
  ```

- [ ] **Step 9: Create card.figma.tsx**

  ```tsx
  import figma from "@figma/code-connect";
  import { Card, CardHeader, CardTitle } from "./card";

  figma.connect(Card, "https://www.figma.com/file/AjwZJsf64tNSbbSSLF234H?node-id=[CARD_NODE_ID]", {
    props: {
      padding:   figma.enum("Padding",   { None: "none", SM: "sm", MD: "md", LG: "lg" }),
      border:    figma.boolean("Border"),
      elevation: figma.enum("Elevation", { "0": 0, "1": 1, "2": 2, "4": 4, "8": 8 }),
    },
    example: ({ padding, border, elevation }) => (
      <Card padding={padding} border={border} elevation={elevation}>
        <CardHeader><CardTitle>Title</CardTitle></CardHeader>
      </Card>
    ),
  });
  ```

- [ ] **Step 10: Verify no placeholder node IDs remain**

  ```bash
  grep -r "\[.*_NODE_ID\]" src/components/ui/*.figma.tsx
  ```

  Expected: no output. If any placeholders remain, go back to `docs/atlas-figma-nodes.md` and source the missing IDs before proceeding.

- [ ] **Step 11: Validate all Code Connect files parse correctly**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npx @figma/code-connect parse
  ```

  Expected: all 9 files parse without errors.

- [ ] **Step 12: Commit**

  ```bash
  git add src/components/ui/*.figma.tsx
  git commit -m "feat: Figma Code Connect mappings for all 9 components"
  ```

---

### Task 20: Publish Code Connect + Final Verification

- [ ] **Step 1: Set FIGMA_TOKEN environment variable**

  Obtain a Figma personal access token (or service account token) from Figma account settings. Set:

  ```bash
  export FIGMA_TOKEN=your_token_here
  ```

- [ ] **Step 2: Dry-run Code Connect publish**

  ```bash
  cd /Users/joshbrinksman/Desktop/claude-atlas-ui && npx @figma/code-connect publish --token $FIGMA_TOKEN --dry-run
  ```

  Expected: lists all 9 components as ready to publish. No errors.

- [ ] **Step 3: Publish Code Connect mappings**

  ```bash
  npx @figma/code-connect publish --token $FIGMA_TOKEN
  ```

  Expected: `✓ Published 9 component(s) to Figma`

- [ ] **Step 4: Verify in Figma**

  Open the Bento file in Figma. Select a Button component instance. Open the Dev panel. Confirm the Atlas UI code snippet appears with the correct import and props.

- [ ] **Step 5: Run the full figma:push command**

  ```bash
  npm run figma:push
  ```

  Expected: token export runs, then Code Connect publishes. Both succeed.

- [ ] **Step 6: Run AI consistency test (Success Criterion)**

  In a fresh Claude Code session with access to this repository, run the following prompt:

  > "Build a NinjaCat settings page with a Card containing a heading, an Input for display name, a Select for timezone, and a footer with an outlined/secondary Cancel button and a solid/primary Save Changes button"

  Verify the generated code:
  - Uses `import { Card, CardHeader, ... } from "@/components/ui/card"` (correct path)
  - Uses `import { Button } from "@/components/ui/button"` (not `@/components/Button` or similar)
  - Uses `variant="outlined"` and `color="secondary"` for Cancel (not `type="outlined"` or similar)
  - Uses `variant="solid"` and `color="primary"` for Save Changes
  - No hallucinated props (e.g., no `colorScheme`, `buttonType`, etc.)

  If the test passes: Phase 1 is complete. If it fails, identify which AI context file needs to be strengthened and update it.

- [ ] **Step 7: Final commit**

  First verify no generated artifacts are accidentally staged:

  ```bash
  git status
  # Confirm tokens-export.json is NOT listed (should be in .gitignore)
  # Confirm no .figma.tsx files contain placeholder [NODE_ID] strings
  ```

  Then commit only intentional files:
  ```bash
  git add CLAUDE.md llms.txt src/ docs/ scripts/ figma.config.json package.json package-lock.json
  git commit -m "feat: complete Atlas UI Phase 1 foundation — AI context, hardened components, MUI docs, Figma pipeline"
  ```

---

## Phase 1 Completion Checklist

- [ ] All 9 components pass accessibility audit (ARIA, keyboard, screen reader labels)
- [ ] All 9 components have JSDoc on every export
- [ ] `src/registry.json` covers all 9 components with props, do/don't patterns
- [ ] `CLAUDE.md` includes component inventory, prop conventions, composition patterns, token guide
- [ ] `llms.txt` is present at project root
- [ ] Docs site has MUI-style layout (sticky topnav, fixed sidebar, scroll-spy)
- [ ] Docs site has live props playground for all 9 components
- [ ] All 9 components have do/don't patterns wired into ComponentSection
- [ ] `cmd+k` search works across all 9 components
- [ ] Dark mode persists to localStorage
- [ ] `npm run figma:export-tokens` produces valid `tokens-export.json`
- [ ] All 9 `.figma.tsx` Code Connect files published to Figma
- [ ] AI consistency test passes (correct props, correct import paths, no hallucinations)
