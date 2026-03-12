# Atlas UI → Polaris-Style Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure Atlas UI to match Shopify Polaris React's navigation structure, URL conventions, component page layout, and right-side TOC — covering all Polaris components (with coming-soon placeholders for unimplemented ones).

**Architecture:** Replace the flat sidebar and old `ComponentSection` API with a 3-level nav model (top-section → category → link), Polaris-style URLs (`/components/[category]/[component]`), a React context for the right-side "On this page" TOC, a redesigned component page layout matching Polaris exactly, and a catch-all route for coming-soon pages. All 9 existing component pages are updated to the new API.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4, clsx/tailwind-merge (`cn()`), Lucide React

---

## File Map

### Files Modified
| File | Change |
|---|---|
| `src/components/docs/docs-layout.tsx` | Full rewrite — 3-level nav types, collapsible sidebar, reads TOC from context |
| `src/components/docs/component-section.tsx` | Full rewrite — Polaris page layout (breadcrumb, pill tabs, code, TS props, do/don't, a11y, footer) |
| `src/components/docs/props-table.tsx` | Rewrite — TypeScript interface-style rows |
| `src/app/(docs)/layout.tsx` | Update NavItem type usage + full Polaris nav tree with all components |
| `src/app/(docs)/page.tsx` | Update component card hrefs to new `/components/…` URLs |
| `src/app/(docs)/components/actions/button/page.tsx` | Rewrite to new ComponentSection API |
| `src/app/(docs)/components/layout-and-structure/card/page.tsx` | Rewrite to new API |
| `src/app/(docs)/components/selection-and-input/input/page.tsx` | Rewrite |
| `src/app/(docs)/components/selection-and-input/textarea/page.tsx` | Rewrite |
| `src/app/(docs)/components/selection-and-input/select/page.tsx` | Rewrite |
| `src/app/(docs)/components/selection-and-input/checkbox/page.tsx` | Rewrite |
| `src/app/(docs)/components/selection-and-input/switch/page.tsx` | Rewrite |
| `src/app/(docs)/components/images-and-icons/avatar/page.tsx` | Rewrite |
| `src/app/(docs)/components/feedback-indicators/badge/page.tsx` | Rewrite |

### Files Created
| File | Purpose |
|---|---|
| `src/components/docs/toc-context.tsx` | React context that shares TOC items between ComponentSection (writer) and DocsLayout (reader) |
| `src/components/docs/on-this-page.tsx` | Right-side sticky "On this page" TOC panel |
| `src/components/docs/coming-soon.tsx` | Coming-soon page component for unimplemented routes |
| `src/app/(docs)/[...slug]/page.tsx` | Catch-all route — renders ComingSoon for any unmatched path |

### Files Deleted (after migration)
| File | Reason |
|---|---|
| `src/app/(docs)/button/`, `input/`, `textarea/`, `select/`, `checkbox/`, `switch/`, `badge/`, `avatar/`, `card/` | Moved to new URL structure |
| `src/components/docs/props-editor.tsx` | Dead code — new `ComponentSection` API removes `controlDefs`/`renderPreview` |

---

## Chunk 1: Nav Model, Sidebar, and TOC Infrastructure

### Task 1: Create TOC context

**Files:**
- Create: `src/components/docs/toc-context.tsx`

- [ ] Create `src/components/docs/toc-context.tsx`:

```tsx
"use client";

import * as React from "react";

export type TocItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const TocContext = React.createContext<{
  items: TocItem[];
  setItems: (items: TocItem[]) => void;
}>({ items: [], setItems: () => {} });

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<TocItem[]>([]);
  return (
    <TocContext.Provider value={{ items, setItems }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return React.useContext(TocContext);
}
```

- [ ] Run `npm run build` — should compile cleanly. Fix any errors.

- [ ] Commit:
```bash
git add src/components/docs/toc-context.tsx
git commit -m "feat: add TocContext for sharing On This Page items between page and layout"
```

---

### Task 2: Create OnThisPage sidebar component

**Files:**
- Create: `src/components/docs/on-this-page.tsx`

- [ ] Create `src/components/docs/on-this-page.tsx`:

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useToc, type TocItem } from "./toc-context";

export function OnThisPage() {
  const { items } = useToc();
  if (!items.length) return null;

  return (
    <aside className="w-48 shrink-0 sticky top-14 h-fit hidden xl:block pl-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-grey-50 mb-3">
        On this page
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <div key={item.href}>
            <a
              href={item.href}
              className="block text-sm text-grey-60 hover:text-text-primary transition-colors py-1 no-underline dark:text-grey-50"
            >
              {item.label}
            </a>
            {item.children?.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="block text-sm text-grey-50 hover:text-text-primary transition-colors py-0.5 pl-3 no-underline dark:text-grey-60"
              >
                {child.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] Run `npm run build`. Fix any errors.

- [ ] Commit:
```bash
git add src/components/docs/on-this-page.tsx
git commit -m "feat: add OnThisPage right-side TOC component"
```

---

### Task 3: Rewrite docs-layout.tsx with 3-level nav and TOC slot

**Files:**
- Modify: `src/components/docs/docs-layout.tsx`

The new `NavItem` type hierarchy:

```typescript
export type ComponentStatus = "stable" | "beta" | "draft" | "coming-soon";

export type NavLink = {
  type: "link";
  href: string;
  label: string;
  status?: ComponentStatus;
};

export type NavCategory = {
  type: "category";
  label: string;
  children: NavLink[];
};

export type NavTopSection = {
  type: "top-section";
  label: string;
  href?: string;
  children?: (NavCategory | NavLink)[];
};

export type NavItem = NavTopSection | NavCategory | NavLink;
```

- [ ] Replace the entire `src/components/docs/docs-layout.tsx` with the new implementation:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TocProvider } from "./toc-context";
import { OnThisPage } from "./on-this-page";

// --- Types ---
export type ComponentStatus = "stable" | "beta" | "draft" | "coming-soon";

export type NavLink = {
  type: "link";
  href: string;
  label: string;
  status?: ComponentStatus;
};

export type NavCategory = {
  type: "category";
  label: string;
  children: NavLink[];
};

export type NavTopSection = {
  type: "top-section";
  label: string;
  href?: string;
  children?: (NavCategory | NavLink)[];
};

export type NavItem = NavTopSection | NavCategory | NavLink;

// --- Helpers ---
function isActiveInChildren(
  children: (NavCategory | NavLink)[],
  pathname: string
): boolean {
  for (const child of children) {
    if (child.type === "link" && child.href === pathname) return true;
    if (
      child.type === "category" &&
      child.children.some((l) => l.href === pathname)
    )
      return true;
  }
  return false;
}

// --- Sub-components ---
function SidebarLink({
  item,
  active,
  depth,
}: {
  item: NavLink;
  active: boolean;
  depth: number;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between rounded py-[5px] text-sm transition-colors no-underline",
        depth === 1 ? "pl-4 pr-3" : depth === 2 ? "pl-6 pr-3" : "px-3",
        active
          ? "text-text-primary font-medium border-l-2 border-blue-100 bg-blue-5 dark:bg-blue-100/10 dark:text-blue-50 -ml-px"
          : "text-grey-70 hover:text-text-primary hover:bg-grey-10/60 dark:text-grey-50 dark:hover:text-grey-10"
      )}
    >
      {item.label}
      {item.status === "coming-soon" && (
        <span className="text-[10px] text-grey-40 italic font-normal">
          soon
        </span>
      )}
    </Link>
  );
}

function SidebarCategory({
  item,
  pathname,
}: {
  item: NavCategory;
  pathname: string;
}) {
  return (
    <div className="mt-4 mb-1">
      <p className="px-3 mb-1 text-xs font-semibold text-grey-50 uppercase tracking-wider">
        {item.label}
      </p>
      {item.children.map((child) => (
        <SidebarLink
          key={child.href}
          item={child}
          active={pathname === child.href}
          depth={2}
        />
      ))}
    </div>
  );
}

function SidebarTopSection({
  item,
  pathname,
}: {
  item: NavTopSection;
  pathname: string;
}) {
  const hasChildren = !!item.children?.length;
  const isInsideSection = hasChildren
    ? isActiveInChildren(item.children!, pathname)
    : pathname === item.href;
  const [open, setOpen] = React.useState(isInsideSection);

  if (!hasChildren) {
    return (
      <SidebarLink
        item={{ type: "link", href: item.href!, label: item.label }}
        active={pathname === item.href}
        depth={0}
      />
    );
  }

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-[7px] rounded text-sm transition-colors",
          isInsideSection
            ? "text-text-primary font-medium"
            : "text-grey-70 hover:text-text-primary hover:bg-grey-10/60 dark:text-grey-50"
        )}
      >
        {item.label}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-grey-40 transition-transform duration-150",
            open && "rotate-90"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="ml-1">
          {item.children!.map((child, i) =>
            child.type === "category" ? (
              <SidebarCategory key={i} item={child} pathname={pathname} />
            ) : (
              <SidebarLink
                key={child.href}
                item={child}
                active={pathname === child.href}
                depth={1}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// --- Main layout ---
interface DocsLayoutProps {
  navItems: NavItem[];
  children: React.ReactNode;
  onSearchOpen?: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function DocsLayout({
  navItems,
  children,
  onSearchOpen,
  darkMode,
  onDarkModeToggle,
}: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <TocProvider>
      <div className={cn("min-h-screen flex flex-col", darkMode && "dark")}>
        {/* Top nav */}
        <header
          className="sticky top-0 z-40 h-14 flex items-center border-b border-border bg-surface px-6 gap-4"
          style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}
        >
          <Link
            href="/"
            className="font-bold text-base text-text-primary tracking-tight no-underline hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <span className="text-sm font-bold">Atlas UI</span>
          </Link>
          <div className="flex-1" />
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 h-8 rounded border border-border bg-surface-subtle text-sm text-text-secondary hover:border-border-strong transition-colors"
            aria-label="Search components (Cmd+K)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search</span>
            <kbd className="ml-2 text-[10px] text-text-secondary border border-border rounded px-1">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={onDarkModeToggle}
            className="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-surface-subtle transition-colors"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-surface py-4 px-2">
            <nav>
              {navItems.map((item, i) => {
                if (item.type === "link")
                  return (
                    <SidebarLink
                      key={item.href}
                      item={item}
                      active={pathname === item.href}
                      depth={0}
                    />
                  );
                if (item.type === "category")
                  return (
                    <SidebarCategory key={i} item={item} pathname={pathname} />
                  );
                return (
                  <SidebarTopSection key={i} item={item} pathname={pathname} />
                );
              })}
            </nav>
          </aside>

          {/* Main + right TOC */}
          <div className="flex flex-1 min-w-0">
            <main className="flex-1 min-w-0 max-w-3xl px-10 py-8 bg-surface">
              {children}
            </main>
            <div className="px-6 py-8">
              <OnThisPage />
            </div>
          </div>
        </div>
      </div>
    </TocProvider>
  );
}
```

- [ ] Run `npm run build`. Fix any TypeScript errors — the old `NavItem` type (with `type: "section"`) is used in `layout.tsx`; that's expected and will be fixed in Task 4.

- [ ] Commit:
```bash
git add src/components/docs/docs-layout.tsx
git commit -m "feat: rewrite DocsLayout with 3-level nav, TocProvider, and OnThisPage slot"
```

---

### Task 4: Update layout.tsx with full Polaris nav tree

**Files:**
- Modify: `src/app/(docs)/layout.tsx`

- [ ] Replace `NAV_ITEMS` with the complete 3-level Polaris structure. The existing 9 components are marked `"stable"`, all others `"coming-soon"`:

```typescript
import type { NavItem } from "@/components/docs/docs-layout";

const NAV_ITEMS: NavItem[] = [
  { type: "top-section", label: "Getting started", href: "/getting-started" },
  { type: "top-section", label: "Foundations", href: "/foundations" },
  { type: "top-section", label: "Design", href: "/design" },
  { type: "top-section", label: "Content", href: "/content" },
  { type: "top-section", label: "Patterns", href: "/patterns" },
  {
    type: "top-section",
    label: "Components",
    children: [
      {
        type: "category",
        label: "Actions",
        children: [
          { type: "link", href: "/components/actions/account-connection", label: "Account connection", status: "coming-soon" },
          { type: "link", href: "/components/actions/button",             label: "Button",             status: "stable" },
          { type: "link", href: "/components/actions/button-group",       label: "Button group",       status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Layout and structure",
        children: [
          { type: "link", href: "/components/layout-and-structure/bleed",        label: "Bleed",        status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/block-stack",  label: "Block stack",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/box",          label: "Box",          status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/callout-card", label: "Callout card", status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/card",         label: "Card",         status: "stable" },
          { type: "link", href: "/components/layout-and-structure/divider",      label: "Divider",      status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/empty-state",  label: "Empty state",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/form-layout",  label: "Form layout",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/grid",         label: "Grid",         status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/inline-grid",  label: "Inline grid",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/inline-stack", label: "Inline stack", status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/layout",       label: "Layout",       status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/media-card",   label: "Media card",   status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/page",         label: "Page",         status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Selection and input",
        children: [
          { type: "link", href: "/components/selection-and-input/autocomplete",  label: "Autocomplete",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/checkbox",      label: "Checkbox",      status: "stable" },
          { type: "link", href: "/components/selection-and-input/choice-list",   label: "Choice list",   status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/color-picker",  label: "Color picker",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/combobox",      label: "Combobox",      status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/date-picker",   label: "Date picker",   status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/drop-zone",     label: "Drop zone",     status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/filters",       label: "Filters",       status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/form",          label: "Form",          status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/index-filters", label: "Index filters", status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/inline-error",  label: "Inline error",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/input",         label: "Input",         status: "stable" },
          { type: "link", href: "/components/selection-and-input/radio-button",  label: "Radio button",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/range-slider",  label: "Range slider",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/select",        label: "Select",        status: "stable" },
          { type: "link", href: "/components/selection-and-input/switch",        label: "Switch",        status: "stable" },
          { type: "link", href: "/components/selection-and-input/tag",           label: "Tag",           status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/textarea",      label: "Textarea",      status: "stable" },
        ],
      },
      {
        type: "category",
        label: "Images and icons",
        children: [
          { type: "link", href: "/components/images-and-icons/avatar",          label: "Avatar",          status: "stable" },
          { type: "link", href: "/components/images-and-icons/icon",            label: "Icon",            status: "coming-soon" },
          { type: "link", href: "/components/images-and-icons/keyboard-key",    label: "Keyboard key",    status: "coming-soon" },
          { type: "link", href: "/components/images-and-icons/thumbnail",       label: "Thumbnail",       status: "coming-soon" },
          { type: "link", href: "/components/images-and-icons/video-thumbnail", label: "Video thumbnail", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Feedback indicators",
        children: [
          { type: "link", href: "/components/feedback-indicators/badge",                label: "Badge",                status: "stable" },
          { type: "link", href: "/components/feedback-indicators/banner",               label: "Banner",               status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/exception-list",       label: "Exception list",       status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/progress-bar",         label: "Progress bar",         status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-body-text",   label: "Skeleton body text",   status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-display-text",label: "Skeleton display text",status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-page",        label: "Skeleton page",        status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-tabs",        label: "Skeleton tabs",        status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-thumbnail",   label: "Skeleton thumbnail",   status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/spinner",              label: "Spinner",              status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Typography",
        children: [
          { type: "link", href: "/components/typography/text", label: "Text", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Tables",
        children: [
          { type: "link", href: "/components/tables/data-table",  label: "Data table",  status: "coming-soon" },
          { type: "link", href: "/components/tables/index-table", label: "Index table", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Lists",
        children: [
          { type: "link", href: "/components/lists/action-list",      label: "Action list",      status: "coming-soon" },
          { type: "link", href: "/components/lists/description-list", label: "Description list", status: "coming-soon" },
          { type: "link", href: "/components/lists/list",             label: "List",             status: "coming-soon" },
          { type: "link", href: "/components/lists/listbox",          label: "Listbox",          status: "coming-soon" },
          { type: "link", href: "/components/lists/option-list",      label: "Option list",      status: "coming-soon" },
          { type: "link", href: "/components/lists/resource-item",    label: "Resource item",    status: "coming-soon" },
          { type: "link", href: "/components/lists/resource-list",    label: "Resource list",    status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Navigation",
        children: [
          { type: "link", href: "/components/navigation/footer-help", label: "Footer help", status: "coming-soon" },
          { type: "link", href: "/components/navigation/link",        label: "Link",        status: "coming-soon" },
          { type: "link", href: "/components/navigation/pagination",  label: "Pagination",  status: "coming-soon" },
          { type: "link", href: "/components/navigation/tabs",        label: "Tabs",        status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Overlays",
        children: [
          { type: "link", href: "/components/overlays/popover", label: "Popover", status: "coming-soon" },
          { type: "link", href: "/components/overlays/tooltip", label: "Tooltip", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Utilities",
        children: [
          { type: "link", href: "/components/utilities/app-provider",  label: "App provider",  status: "coming-soon" },
          { type: "link", href: "/components/utilities/collapsible",   label: "Collapsible",   status: "coming-soon" },
          { type: "link", href: "/components/utilities/scrollable",    label: "Scrollable",    status: "coming-soon" },
        ],
      },
    ],
  },
  { type: "top-section", label: "Tokens",         href: "/tokens" },
  { type: "top-section", label: "Icons",          href: "/icons" },
  { type: "top-section", label: "Contributing",   href: "/contributing" },
  { type: "top-section", label: "Tools",          href: "/tools" },
  { type: "top-section", label: "Version guides", href: "/version-guides" },
];
```

- [ ] Update the `SEARCH_ITEMS` array. `SearchModal` constructs hrefs as `` `/${result.id}` ``, so set `id` to the path **without** the leading slash. Example: `id: "components/actions/button"` produces href `/components/actions/button`. Update all 9 entries:
  ```typescript
  { id: "components/actions/button",              label: "Button",   ... },
  { id: "components/layout-and-structure/card",   label: "Card",     ... },
  { id: "components/selection-and-input/input",   label: "Input",    ... },
  { id: "components/selection-and-input/textarea",label: "Textarea", ... },
  { id: "components/selection-and-input/select",  label: "Select",   ... },
  { id: "components/selection-and-input/checkbox",label: "Checkbox", ... },
  { id: "components/selection-and-input/switch",  label: "Switch",   ... },
  { id: "components/images-and-icons/avatar",     label: "Avatar",   ... },
  { id: "components/feedback-indicators/badge",   label: "Badge",    ... },
  ```

- [ ] Run `npm run build`. There will be TypeScript errors from `layout.tsx` because it still uses the old `{ type: "section" }` `NavItem` shape. **Do NOT touch `layout.tsx` to fix these — Task 4 replaces the entire `NAV_ITEMS` array.** If the build is otherwise clean, proceed to Task 4 immediately.

- [ ] Commit:
```bash
git add src/app/\(docs\)/layout.tsx
git commit -m "feat: full Polaris nav tree with all 60+ components mapped to categories"
```

---

## Chunk 2: Routing — Coming Soon & URL Migration

### Task 5: Create coming-soon component and catch-all route

**Files:**
- Create: `src/components/docs/coming-soon.tsx`
- Create: `src/app/(docs)/[...slug]/page.tsx`

- [ ] Create `src/components/docs/coming-soon.tsx`:

```tsx
import * as React from "react";
import Link from "next/link";

interface ComingSoonProps {
  breadcrumb: { label: string; href: string }[];
  name: string;
}

export function ComingSoon({ breadcrumb, name }: ComingSoonProps) {
  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav
        className="flex items-center flex-wrap gap-1 text-sm text-grey-50 mb-6"
        aria-label="breadcrumb"
      >
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && <span className="text-grey-30 mx-0.5">/</span>}
            <Link
              href={crumb.href}
              className="hover:text-text-primary transition-colors no-underline"
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
        <span className="text-grey-30 mx-0.5">/</span>
        <span className="text-text-secondary">{name}</span>
      </nav>

      <h1 className="text-4xl font-bold text-text-primary mb-4">{name}</h1>

      <div className="mt-12 flex flex-col items-start gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-sm text-yellow-900 font-medium">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          Coming soon
        </div>
        <p className="text-text-secondary text-base leading-relaxed">
          This component is on the roadmap and will be added to Atlas UI in a future release.
        </p>
        <Link
          href="/"
          className="text-sm text-text-link hover:underline no-underline"
        >
          ← Back to overview
        </Link>
      </div>
    </div>
  );
}
```

- [ ] Create `src/app/(docs)/[...slug]/page.tsx`:

```tsx
import { ComingSoon } from "@/components/docs/coming-soon";

// "button-group" → "Button group"
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const name = slugToLabel(slug[slug.length - 1]);

  const breadcrumb = [
    { label: "Home", href: "/" },
    ...slug.slice(0, -1).map((s, i) => ({
      label: slugToLabel(s),
      href: "/" + slug.slice(0, i + 1).join("/"),
    })),
  ];

  return <ComingSoon breadcrumb={breadcrumb} name={name} />;
}
```

- [ ] Run `npm run dev`. Visit `/getting-started` — should show "Getting started / Coming soon". Visit `/components/actions/button-group` — should show "Button group / Coming soon".

- [ ] Run `npm run build`. Fix any errors.

- [ ] Commit:
```bash
git add src/components/docs/coming-soon.tsx "src/app/(docs)/[...slug]/page.tsx"
git commit -m "feat: coming-soon component and catch-all route for unimplemented pages"
```

---

### Task 6: Migrate all 9 component pages to new URL structure

**Files:**
- Create: `src/app/(docs)/components/actions/button/page.tsx` (copy content from old `/button/page.tsx`)
- Create: `src/app/(docs)/components/layout-and-structure/card/page.tsx`
- Create: `src/app/(docs)/components/selection-and-input/input/page.tsx`
- Create: `src/app/(docs)/components/selection-and-input/textarea/page.tsx`
- Create: `src/app/(docs)/components/selection-and-input/select/page.tsx`
- Create: `src/app/(docs)/components/selection-and-input/checkbox/page.tsx`
- Create: `src/app/(docs)/components/selection-and-input/switch/page.tsx`
- Create: `src/app/(docs)/components/images-and-icons/avatar/page.tsx`
- Create: `src/app/(docs)/components/feedback-indicators/badge/page.tsx`
- Delete: all 9 old route folders

- [ ] Create all new directories and copy current page content (content will be rewritten in Chunk 4 — this step just moves the files so routing works):

```bash
# Create directories
mkdir -p "src/app/(docs)/components/actions/button"
mkdir -p "src/app/(docs)/components/layout-and-structure/card"
mkdir -p "src/app/(docs)/components/selection-and-input/input"
mkdir -p "src/app/(docs)/components/selection-and-input/textarea"
mkdir -p "src/app/(docs)/components/selection-and-input/select"
mkdir -p "src/app/(docs)/components/selection-and-input/checkbox"
mkdir -p "src/app/(docs)/components/selection-and-input/switch"
mkdir -p "src/app/(docs)/components/images-and-icons/avatar"
mkdir -p "src/app/(docs)/components/feedback-indicators/badge"

# Copy pages
cp "src/app/(docs)/button/page.tsx"   "src/app/(docs)/components/actions/button/page.tsx"
cp "src/app/(docs)/card/page.tsx"     "src/app/(docs)/components/layout-and-structure/card/page.tsx"
cp "src/app/(docs)/input/page.tsx"    "src/app/(docs)/components/selection-and-input/input/page.tsx"
cp "src/app/(docs)/textarea/page.tsx" "src/app/(docs)/components/selection-and-input/textarea/page.tsx"
cp "src/app/(docs)/select/page.tsx"   "src/app/(docs)/components/selection-and-input/select/page.tsx"
cp "src/app/(docs)/checkbox/page.tsx" "src/app/(docs)/components/selection-and-input/checkbox/page.tsx"
cp "src/app/(docs)/switch/page.tsx"   "src/app/(docs)/components/selection-and-input/switch/page.tsx"
cp "src/app/(docs)/avatar/page.tsx"   "src/app/(docs)/components/images-and-icons/avatar/page.tsx"
cp "src/app/(docs)/badge/page.tsx"    "src/app/(docs)/components/feedback-indicators/badge/page.tsx"
```

- [ ] Delete old route folders:
```bash
rm -rf "src/app/(docs)/button" "src/app/(docs)/card" "src/app/(docs)/input" \
  "src/app/(docs)/textarea" "src/app/(docs)/select" "src/app/(docs)/checkbox" \
  "src/app/(docs)/switch" "src/app/(docs)/avatar" "src/app/(docs)/badge"
```

- [ ] Run `npm run dev`. Confirm `/components/actions/button` renders the Button page (old API, will be updated in Chunk 4). Confirm `/button` now shows Coming soon via catch-all.

- [ ] Run `npm run build`. Fix any errors.

- [ ] Commit:
```bash
git add "src/app/(docs)/components"
git rm -r --cached "src/app/(docs)/button" "src/app/(docs)/card" "src/app/(docs)/input" \
  "src/app/(docs)/textarea" "src/app/(docs)/select" "src/app/(docs)/checkbox" \
  "src/app/(docs)/switch" "src/app/(docs)/avatar" "src/app/(docs)/badge" 2>/dev/null || true
git commit -m "feat: migrate component routes to /components/[category]/[name] URL structure"
```

---

## Chunk 3: Component Page Layout Redesign

### Task 7: Redesign PropsTable to TypeScript interface style

**Files:**
- Modify: `src/components/docs/props-table.tsx`

Polaris renders props as a styled TypeScript interface:
```
interface ButtonProps {
  children?  string | string[]
             The content to display inside the button.

  size?      "medium" | "large" | "micro" | "slim"
             Changes the size of the button. Defaults to 'medium'.
  ...
}
```

The existing `PropDef` interface stays the same (no API breakage). We only change the rendering.

- [ ] Replace the render in `props-table.tsx` — drop the `<table>` and render a styled interface block:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropDef {
  name: string;
  type: string;          // e.g. '"solid" | "outlined" | "ghost"'
  default?: string;
  required?: boolean;
  description: string;
  deprecated?: string;   // if provided, show Deprecated badge with this text
}

interface PropsTableProps {
  props: PropDef[];
  componentName?: string;
  className?: string;
}

export function PropsTable({ props, componentName, className }: PropsTableProps) {
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden font-mono text-sm", className)}>
      {/* interface header */}
      {componentName && (
        <div className="px-5 py-3 bg-surface-subtle border-b border-border text-text-secondary">
          {"interface "}
          <span className="text-text-primary font-semibold">{componentName}Props</span>
          {" {"}
        </div>
      )}

      {/* prop rows */}
      <div className="divide-y divide-border">
        {props.map((prop) => (
          <div key={prop.name} className="px-5 py-4">
            {/* prop name + type */}
            <div className="flex items-start gap-3 flex-wrap mb-1.5">
              <span className="text-text-primary font-semibold">
                {prop.name}{!prop.required && "?"}
              </span>
              <span className="flex flex-wrap items-center gap-1 text-text-secondary">
                {prop.type.split("|").map((t, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="text-[#6B46C1] dark:text-purple-50">{t.trim()}</span>
                    {i < arr.length - 1 && (
                      <span className="text-grey-40 mx-0.5">|</span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </div>
            {/* description */}
            <p className="text-xs font-sans text-text-secondary leading-relaxed">
              {prop.description}
              {prop.default && (
                <span className="text-grey-50">
                  {" "}Defaults to{" "}
                  <code className="text-text-primary bg-surface-subtle px-1 rounded">
                    {prop.default}
                  </code>
                  .
                </span>
              )}
            </p>
            {/* deprecated badge */}
            {prop.deprecated && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-900 border border-yellow-200 uppercase tracking-wide">
                  Deprecated
                </span>
                <span className="text-xs font-sans text-text-secondary">
                  {prop.deprecated}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* interface footer */}
      {componentName && (
        <div className="px-5 py-3 bg-surface-subtle border-t border-border text-text-secondary">
          {"}"}
        </div>
      )}
    </div>
  );
}
```

- [ ] Run `npm run build`. Since `PropDef` shape is unchanged, existing pages should compile.

- [ ] Commit:
```bash
git add src/components/docs/props-table.tsx
git commit -m "feat: redesign PropsTable to TypeScript interface style matching Polaris"
```

---

### Task 8: Rewrite ComponentSection to Polaris page layout

**Files:**
- Modify: `src/components/docs/component-section.tsx`

This is the core layout change. The new `ComponentSection`:
- Takes `examples` (pill tabs) instead of `controlDefs`/`renderPreview`
- Auto-generates TOC items and pushes them to `TocContext`
- Shows breadcrumb, H1, description, pill tabs, live preview, code, props, do/don't, accessibility, footer

New `ComponentSectionProps` interface:

```typescript
export type Example = {
  label: string;
  description?: string;
  preview: React.ReactNode;
  code?: string;
};

export interface ComponentSectionProps {
  name: string;
  status?: "stable" | "beta" | "draft";
  description: string;
  breadcrumb?: { label: string; href: string }[];
  examples?: Example[];
  props?: PropDef[];
  dos?: { label: string; preview?: React.ReactNode }[];
  donts?: { label: string; preview?: React.ReactNode }[];
  accessibility?: {
    description?: string;
    labeling?: string;
    keyboardSupport?: string[];
  };
  relatedComponents?: { label: string; href: string }[];
  children?: React.ReactNode; // extra custom sections after standard ones
}
```

- [ ] Replace the entire `src/components/docs/component-section.tsx` with:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PropsTable, type PropDef } from "./props-table";
import { CodeBlock } from "./code-block";
import { useToc, type TocItem } from "./toc-context";

export type Example = {
  label: string;
  description?: string;
  preview: React.ReactNode;
  code?: string;
};

export interface ComponentSectionProps {
  name: string;
  status?: "stable" | "beta" | "draft";
  description: string;
  breadcrumb?: { label: string; href: string }[];
  examples?: Example[];
  props?: PropDef[];
  dos?: { label: string; preview?: React.ReactNode }[];
  donts?: { label: string; preview?: React.ReactNode }[];
  accessibility?: {
    description?: string;
    labeling?: string;
    keyboardSupport?: string[];
  };
  relatedComponents?: { label: string; href: string }[];
  children?: React.ReactNode;
}

export function ComponentSection({
  name,
  status,
  description,
  breadcrumb = [],
  examples = [],
  props = [],
  dos = [],
  donts = [],
  accessibility,
  relatedComponents = [],
  children,
}: ComponentSectionProps) {
  const [activeExample, setActiveExample] = React.useState(0);
  const { setItems } = useToc();

  // Auto-generate TOC from which sections are present.
  // Deps: stable primitive counts/presence flags — avoids stale-closure from object identity churn.
  React.useEffect(() => {
    const items: TocItem[] = [];
    if (examples.length > 0) items.push({ label: "Examples", href: "#examples" });
    if (props.length > 0) items.push({ label: "Props", href: "#props" });
    if (dos.length > 0 || donts.length > 0)
      items.push({ label: "Best practices", href: "#best-practices" });
    if (relatedComponents.length > 0)
      items.push({ label: "Related components", href: "#related-components" });
    if (accessibility) {
      const children: TocItem["children"] = [];
      if (accessibility.labeling)
        children.push({ label: "Labeling", href: "#labeling" });
      if (accessibility.keyboardSupport?.length)
        children.push({ label: "Keyboard support", href: "#keyboard-support" });
      items.push({ label: "Accessibility", href: "#accessibility", children });
    }
    setItems(items);
    return () => setItems([]);
  }, [
    // Primitive presence/count flags — safe to list; objects would cause infinite loops
    examples.length,
    props.length,
    dos.length,
    donts.length,
    relatedComponents.length,
    !!accessibility,
    !!accessibility?.labeling,
    !!accessibility?.keyboardSupport?.length,
    setItems,
  ]);

  return (
    <article className="max-w-3xl">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <nav
          aria-label="breadcrumb"
          className="flex items-center flex-wrap gap-1 text-sm text-grey-50 mb-6"
        >
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <span className="text-grey-30 mx-0.5">/</span>}
              <Link
                href={crumb.href}
                className="hover:text-text-primary transition-colors no-underline"
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
          <span className="text-grey-30 mx-0.5">/</span>
          <span className="text-text-secondary">{name}</span>
        </nav>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-text-primary mb-4">{name}</h1>

      {/* Description */}
      <p className="text-lg text-text-secondary leading-relaxed mb-10">
        {description}
      </p>

      {/* Examples section */}
      {examples.length > 0 && (
        <section id="examples" className="mb-12 scroll-mt-20">
          {/* Pill tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {examples.map((ex, i) => (
              <button
                key={ex.label}
                onClick={() => setActiveExample(i)}
                className={cn(
                  "px-3 py-1.5 rounded border text-sm transition-colors",
                  i === activeExample
                    ? "border-border-strong bg-surface-raised text-text-primary font-medium shadow-elevation-1"
                    : "border-border text-grey-60 hover:text-text-primary hover:border-border-strong bg-surface"
                )}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* Tab description */}
          {examples[activeExample]?.description && (
            <p className="text-sm text-text-secondary mb-3">
              {examples[activeExample].description}
            </p>
          )}

          {/* Preview area */}
          <div className="rounded-t-lg border border-border bg-white dark:bg-grey-5 overflow-hidden">
            <div className="min-h-44 flex items-center justify-center p-10">
              {examples[activeExample]?.preview}
            </div>
          </div>

          {/* Code block */}
          {examples[activeExample]?.code ? (
            <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
              <div className="flex items-center px-4 py-2 bg-surface-subtle border-b border-border gap-3">
                <span className="text-xs font-medium text-text-primary border-b-2 border-text-primary pb-0.5">React</span>
              </div>
              <CodeBlock
                code={examples[activeExample].code!}
                language="tsx"
                className="rounded-none border-0"
              />
            </div>
          ) : (
            <div className="border border-t-0 border-border rounded-b-lg h-1 bg-surface-subtle" />
          )}
        </section>
      )}

      {/* Props */}
      {props.length > 0 && (
        <section id="props" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Props</h2>
          <PropsTable props={props} componentName={name} />
        </section>
      )}

      {/* Best practices */}
      {(dos.length > 0 || donts.length > 0) && (
        <section id="best-practices" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Best practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dos.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-5 border-b border-border">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-100" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-semibold text-green-100">Do</span>
                </div>
                {item.preview && (
                  <div className="flex items-center justify-center p-6 bg-white dark:bg-grey-5">
                    {item.preview}
                  </div>
                )}
                <p className="px-4 py-3 text-sm text-text-secondary bg-surface border-t border-border">
                  {item.label}
                </p>
              </div>
            ))}
            {donts.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-5 border-b border-border">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-100" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-semibold text-red-100">
                    Don&apos;t
                  </span>
                </div>
                {item.preview && (
                  <div className="flex items-center justify-center p-6 bg-white dark:bg-grey-5">
                    {item.preview}
                  </div>
                )}
                <p className="px-4 py-3 text-sm text-text-secondary bg-surface border-t border-border">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related components */}
      {relatedComponents.length > 0 && (
        <section id="related-components" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Related components
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedComponents.map((comp) => (
              <Link
                key={comp.href}
                href={comp.href}
                className="px-3 py-1.5 rounded border border-border text-sm text-text-link hover:border-border-strong hover:bg-surface-subtle transition-colors no-underline"
              >
                {comp.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Accessibility */}
      {accessibility && (
        <section id="accessibility" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Accessibility
          </h2>
          {accessibility.description && (
            <p className="text-text-secondary mb-5">
              {accessibility.description}
            </p>
          )}
          {accessibility.labeling && (
            <div id="labeling" className="mb-5 scroll-mt-20">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Labeling
              </h3>
              <p className="text-text-secondary">{accessibility.labeling}</p>
            </div>
          )}
          {accessibility.keyboardSupport && (
            <div id="keyboard-support" className="scroll-mt-20">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Keyboard support
              </h3>
              <ul className="space-y-1.5">
                {accessibility.keyboardSupport.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-text-secondary text-sm"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-grey-30 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Custom extra sections */}
      {children}

      {/* Page footer */}
      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm text-grey-50">
        <a href="#" className="hover:text-text-primary transition-colors">
          Edit this page
        </a>
        <a href="#" className="hover:text-text-primary transition-colors">
          Leave feedback
        </a>
      </div>
    </article>
  );
}

// Keep DocSubheading for any legacy usage during migration
export function DocSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-widest text-grey-50 mb-3">
      {children}
    </h3>
  );
}
```

- [ ] The 9 component pages still use the old API (`controlDefs`, `renderPreview`, `whenToUse`, `id`). **Do NOT commit yet.** Temporarily add `// @ts-nocheck` at the top of each of the 9 component pages to verify the build passes, but **do not stage or commit these files** — Tasks 9–17 will replace them properly without the suppression.

- [ ] Stage and commit only `component-section.tsx`:
```bash
git add src/components/docs/component-section.tsx
git commit -m "feat: rewrite ComponentSection to Polaris page layout with pill tabs, TOC, a11y, footer"
```
The 9 component pages with `// @ts-nocheck` remain unstaged (working tree only) until their respective tasks replace them.

---

## Chunk 4: Update All 9 Component Pages

**Pattern for all pages — mandatory checklist before writing each rewrite:**

Old imports to **remove** from every component page:
```tsx
// REMOVE all of these:
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { PropsTable, type PropDef } from "@/components/docs/props-table";  // PropsTable now internal
import { CodeBlock } from "@/components/docs/code-block";   // CodeBlock now internal
import type { ButtonVariant, ButtonColor, ButtonSize } from "@/components/ui/button"; // control types gone
import type { ControlDef } from "@/components/docs/component-section"; // gone
```

New imports to **add** to every component page:
```tsx
// ADD these:
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";
// Plus whatever UI component(s) the page demonstrates
```

Props to **remove** from `ComponentSection` call: `id`, `controlDefs`, `renderPreview`, `whenToUse`

Props to **add** to `ComponentSection` call: `breadcrumb`, `examples`, `accessibility`, `relatedComponents`

**Breadcrumb pattern** (same for all pages, adapt category/name):
```tsx
breadcrumb={[
  { label: "Home",            href: "/" },
  { label: "Components",      href: "/components" },
  { label: "<Category name>", href: "/components" },
]}
```

**Each page must be committed WITHOUT `// @ts-nocheck`** — remove the suppression added in Task 8 before staging.

---

**Pattern for all pages:** Each page replaces the old `ComponentSection` usage with the new API:
- `breadcrumb` — path from Home → Components → Category → Name
- `examples` — 4–8 named tabs, each with a `preview` React node and `code` string
- `props` — same `PropDef[]` as before (no changes)
- `dos` / `donts` — same shape (no `preview` is optional now)
- `accessibility` — new section with `labeling` and `keyboardSupport`
- Remove `id`, `controlDefs`, `renderPreview`, `whenToUse`, `children` (old sections)
- Remove `DocSubheading`, `LivePreview` import (no longer needed at page level)

---

### Task 9: Update Button page

**Files:**
- Modify: `src/app/(docs)/components/actions/button/page.tsx`

- [ ] Remove `// @ts-nocheck` from the file.

- [ ] Rewrite the file to use the new API:

```tsx
"use client";

import * as React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "variant",  type: '"solid" | "outlined" | "ghost"',    default: '"solid"',   description: "Visual style of the button." },
  { name: "color",    type: '"primary" | "secondary" | "danger"', default: '"primary"', description: "Semantic color role." },
  { name: "size",     type: '"sm" | "md" | "lg"',                default: '"md"',      description: "Height and padding." },
  { name: "loading",  type: "boolean",                            default: "false",     description: "Shows a spinner and disables the button." },
  { name: "disabled", type: "boolean",                            default: "false",     description: "Disables interaction." },
  { name: "leftIcon", type: "ReactNode",                                                description: "Icon rendered before the label." },
  { name: "rightIcon",type: "ReactNode",                                                description: "Icon rendered after the label." },
  { name: "children", type: "ReactNode",                          required: true,       description: "Button label." },
];

export default function ButtonPage() {
  return (
    <ComponentSection
      name="Button"
      status="stable"
      description="Buttons are used primarily for actions, such as "Add", "Close", "Cancel", or "Save". Use variant and color props to communicate the visual weight and intent of the action."
      breadcrumb={[
        { label: "Home",       href: "/" },
        { label: "Components", href: "/components" },
        { label: "Actions",    href: "/components" },
      ]}
      // NOTE for all pages: the intermediate breadcrumb hrefs (/components, /components/actions)
      // resolve to the coming-soon catch-all, which is the correct behavior.
      examples={[
        {
          label: "Default",
          description: "Use solid/primary for the main CTA. Only one per page or form.",
          preview: <Button variant="solid" color="primary">Add product</Button>,
          code: `<Button variant="solid" color="primary">Add product</Button>`,
        },
        {
          label: "Secondary",
          description: "Use solid/secondary for supporting actions next to a primary.",
          preview: <div className="flex gap-3"><Button variant="solid" color="primary">Save</Button><Button variant="solid" color="secondary">Cancel</Button></div>,
          code: `<Button variant="solid" color="secondary">Cancel</Button>`,
        },
        {
          label: "Outlined",
          description: "Use outlined for secondary emphasis actions.",
          preview: <div className="flex gap-3"><Button variant="outlined" color="primary">View details</Button><Button variant="outlined" color="secondary">Export</Button></div>,
          code: `<Button variant="outlined" color="primary">View details</Button>`,
        },
        {
          label: "Ghost",
          description: "Use ghost for tertiary, low-emphasis actions.",
          preview: <div className="flex gap-3"><Button variant="ghost" color="primary">Learn more</Button><Button variant="ghost" color="secondary">Reset</Button></div>,
          code: `<Button variant="ghost" color="secondary">Reset</Button>`,
        },
        {
          label: "Danger",
          description: "Use color=danger only for destructive, irreversible actions.",
          preview: <div className="flex gap-3"><Button variant="solid" color="danger">Delete</Button><Button variant="outlined" color="danger">Remove</Button></div>,
          code: `<Button variant="solid" color="danger">Delete account</Button>`,
        },
        {
          label: "Sizes",
          description: "Three sizes — sm, md (default), lg.",
          preview: <div className="flex items-center gap-3"><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></div>,
          code: `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`,
        },
        {
          label: "Loading state",
          description: "Shows a spinner and disables interaction while an action is processing.",
          preview: <Button loading>Saving…</Button>,
          code: `<Button loading>Saving…</Button>`,
        },
        {
          label: "With icon",
          description: "Use leftIcon or rightIcon to add a Lucide icon.",
          preview: <div className="flex gap-3"><Button leftIcon={<Plus className="h-4 w-4" />}>Add item</Button><Button variant="outlined" color="primary" rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button></div>,
          code: `<Button leftIcon={<Plus className="h-4 w-4" />}>Add item</Button>\n<Button rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>`,
        },
        {
          label: "Disabled state",
          preview: <div className="flex gap-3"><Button disabled>Disabled</Button><Button variant="outlined" color="primary" disabled>Disabled</Button></div>,
          code: `<Button disabled>Disabled</Button>`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use solid/primary for the single main CTA on a page or form.", preview: <Button variant="solid" color="primary">Save changes</Button> },
        { label: "Pair outlined/primary with solid/primary for cancel actions.", preview: <div className="flex gap-2"><Button variant="outlined" color="primary">Cancel</Button><Button variant="solid" color="primary">Save</Button></div> },
      ]}
      donts={[
        { label: "Don't place two solid/primary buttons side by side.", preview: <div className="flex gap-2"><Button variant="solid" color="primary">Save</Button><Button variant="solid" color="primary">Delete</Button></div> },
        { label: "Don't use danger color for non-destructive actions.", preview: <Button variant="solid" color="danger">Save profile</Button> },
      ]}
      accessibility={{
        description: "Buttons use native <button> elements for built-in keyboard and screen reader support.",
        labeling: "Always provide a descriptive label via children. If the button is icon-only, add an aria-label.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus to or away from the button",
          "Enter or Space — activate the button",
        ],
      }}
      relatedComponents={[
        { label: "Button group", href: "/components/actions/button-group" },
      ]}
    />
  );
}
```

- [ ] Run `npm run dev`. Navigate to `/components/actions/button`. Verify breadcrumb, pill tabs, preview, code, props, do/don't, and right TOC all render correctly.

- [ ] Run `npm run build`. Fix any errors.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/actions/button/page.tsx"
git commit -m "feat: rewrite Button page to Polaris-style layout with examples, props, a11y"
```

---

### Task 10: Update Card page

**Files:**
- Modify: `src/app/(docs)/components/layout-and-structure/card/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite using the new `ComponentSection` API with examples covering: Default card, With header, With footer, Elevation levels (0–8), No padding.

Breadcrumb: `Home / Components / Layout and structure / Card`

Key examples:
- **Default** — `<Card padding="md"><p>Card content</p></Card>`
- **With header** — Card + CardHeader + CardTitle + CardDescription
- **With footer** — Card + CardFooter with two buttons
- **Elevated** — Card with `elevation={2}` and `elevation={4}`
- **Full composition** — Settings form example from CLAUDE.md

Props include: `padding` (`"none" | "sm" | "md" | "lg"`), `border` (boolean), `elevation` (0|1|2|4|8), plus CardHeader/CardTitle/CardDescription/CardFooter sub-components.

- [ ] Run `npm run build`. Fix errors.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/layout-and-structure/card/page.tsx"
git commit -m "feat: rewrite Card page to Polaris-style layout"
```

---

### Task 11: Update Input page

**Files:**
- Modify: `src/app/(docs)/components/selection-and-input/input/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Selection and input / Input`

Key examples: Default, With label and hint, Error state, With leading icon, With trailing icon, Disabled.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/selection-and-input/input/page.tsx"
git commit -m "feat: rewrite Input page to Polaris-style layout"
```

---

### Task 12: Update Textarea page

**Files:**
- Modify: `src/app/(docs)/components/selection-and-input/textarea/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Selection and input / Textarea`

Key examples: Default, With label, Error state, Custom rows, Disabled.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/selection-and-input/textarea/page.tsx"
git commit -m "feat: rewrite Textarea page to Polaris-style layout"
```

---

### Task 13: Update Select page

**Files:**
- Modify: `src/app/(docs)/components/selection-and-input/select/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Selection and input / Select`

Key examples: Default, With placeholder, Error state, Disabled.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/selection-and-input/select/page.tsx"
git commit -m "feat: rewrite Select page to Polaris-style layout"
```

---

### Task 14: Update Checkbox page

**Files:**
- Modify: `src/app/(docs)/components/selection-and-input/checkbox/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Selection and input / Checkbox`

Key examples: Default, With description, Checked state, Disabled, In a form group.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/selection-and-input/checkbox/page.tsx"
git commit -m "feat: rewrite Checkbox page to Polaris-style layout"
```

---

### Task 15: Update Switch page

**Files:**
- Modify: `src/app/(docs)/components/selection-and-input/switch/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Selection and input / Switch`

Key examples: Default, With description, On state, Disabled.

Note in accessibility: Switch is for immediate-effect toggles (e.g., "Enable notifications"), not for form submit inputs — use Checkbox instead.

- [ ] Commit:
```bash
git add "src/app/(docs)/components/selection-and-input/switch/page.tsx"
git commit -m "feat: rewrite Switch page to Polaris-style layout"
```

---

### Task 16: Update Badge page

**Files:**
- Modify: `src/app/(docs)/components/feedback-indicators/badge/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Feedback indicators / Badge`

Key examples: Default, All variants (success/warning/error/info/purple), With dot, Sizes (sm/md), Status (live region).

- [ ] Commit:
```bash
git add "src/app/(docs)/components/feedback-indicators/badge/page.tsx"
git commit -m "feat: rewrite Badge page to Polaris-style layout"
```

---

### Task 17: Update Avatar page

**Files:**
- Modify: `src/app/(docs)/components/images-and-icons/avatar/page.tsx`

- [ ] Remove `// @ts-nocheck`. Rewrite with new API.

Breadcrumb: `Home / Components / Images and icons / Avatar`

Key examples: With image, With initials, Icon fallback, All sizes (sm/md/lg/xl).

- [ ] Commit:
```bash
git add "src/app/(docs)/components/images-and-icons/avatar/page.tsx"
git commit -m "feat: rewrite Avatar page to Polaris-style layout"
```

---

### Task 18: Update homepage component cards

**Files:**
- Modify: `src/app/(docs)/page.tsx`

- [ ] Update all 9 `href` values in the component card grid to the new URLs, and update the breadcrumb/home links if any.

Old → New:
```
/button   → /components/actions/button
/card     → /components/layout-and-structure/card
/input    → /components/selection-and-input/input
/textarea → /components/selection-and-input/textarea
/select   → /components/selection-and-input/select
/checkbox → /components/selection-and-input/checkbox
/switch   → /components/selection-and-input/switch
/avatar   → /components/images-and-icons/avatar
/badge    → /components/feedback-indicators/badge
```

- [ ] Run `npm run build`. Should compile with zero errors.

- [ ] Run `npm run dev`. Do a full manual smoke-test:
  1. `/` — homepage loads, all 9 component cards link to correct URLs
  2. `/components/actions/button` — Polaris layout, breadcrumb, 9 tabs, right TOC
  3. Switch between tabs — preview and code update
  4. `/components/actions/button-group` — shows Coming soon
  5. `/getting-started` — shows Coming soon
  6. Sidebar: "Components" section is collapsible, opens to nested categories, active link highlighted
  7. Dark mode toggle — all sections respond correctly
  8. ⌘K — search modal opens

- [ ] Commit:
```bash
git add "src/app/(docs)/page.tsx"
git commit -m "feat: update homepage component card links to new /components/* URLs"
```

---

### Task 19: Delete dead code

**Files:**
- Delete: `src/components/docs/props-editor.tsx` (dead code — `PropsEditor` is no longer imported anywhere after Tasks 9–17)

- [ ] Confirm no remaining imports of `PropsEditor` or `props-editor`:
```bash
grep -r "props-editor\|PropsEditor" src/
```
Expected: no output.

- [ ] Delete the file:
```bash
rm src/components/docs/props-editor.tsx
```

- [ ] Run `npm run build`. Fix any errors.

- [ ] Commit:
```bash
git rm src/components/docs/props-editor.tsx
git commit -m "chore: remove PropsEditor dead code (replaced by static example tabs)"
```

---

## Final verification

- [ ] Run `npm run build` — zero errors, zero type errors.
- [ ] Run `npm run lint` — zero lint errors.
- [ ] Visit all 9 component pages and verify: breadcrumb renders, pill tabs work, right TOC shows correct sections, props render in TS interface style, do/don't panels are side-by-side, footer links are present.
- [ ] Verify `coming-soon` renders for: `/getting-started`, `/tokens`, `/components/navigation/tabs`, `/components/utilities/collapsible`.
- [ ] Verify dark mode works on all new UI.
- [ ] Commit final cleanup if needed:
```bash
git commit -m "chore: final cleanup after Polaris-style redesign"
```
