export type ChangeType = "added" | "changed" | "fixed" | "removed" | "deprecated";

export type Change = {
  type: ChangeType;
  description: string;
};

export type Release = {
  version: string;
  date: string; // ISO 8601
  summary: string;
  changes: Change[];
};

export const RELEASES: Release[] = [
  {
    version: "0.5.0",
    date: "2026-03-12",
    summary: "Getting Started page and release notes infrastructure.",
    changes: [
      { type: "added", description: "Getting Started page (/getting-started) — AI tool guide with machine-readable endpoint table, import patterns, prop conventions, token usage, anti-patterns, and a copyable starter prompt." },
      { type: "added", description: "Release Notes page (/release-notes) — changelog tracking all Atlas UI updates." },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-03-11",
    summary: "Color and Typography token pages.",
    changes: [
      { type: "added", description: "Color token page (/tokens/color) — full primitive palette swatches and semantic token table with light/dark values." },
      { type: "added", description: "Typography token page (/tokens/typography) — type scale, font weight, and line-height reference." },
      { type: "changed", description: "Updated Bento design tokens throughout globals.css." },
      { type: "fixed", description: "Unique breadcrumb keys across component pages." },
      { type: "fixed", description: "Coming-soon items now hidden from the sidebar." },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-03-10",
    summary: "Full Polaris-style component docs with examples, props tables, and accessibility notes.",
    changes: [
      { type: "changed", description: "Rewrote all 9 component pages (Button, Input, Textarea, Select, Checkbox, Switch, Badge, Avatar, Card) to Polaris-style layout with tabbed examples, props table, best practices, and accessibility section." },
      { type: "added", description: "ComponentSection — reusable page wrapper with breadcrumb, status badge, pill tabs, live preview, code view, props table, and TOC registration." },
      { type: "changed", description: "Migrated component routes to /components/[category]/[name] URL structure." },
      { type: "fixed", description: "Corrected Button page Actions breadcrumb href." },
      { type: "fixed", description: "Semantic token usage and stable keys in ComponentSection." },
      { type: "removed", description: "LivePreview and PropsEditor dead code replaced by ComponentSection." },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-03-08",
    summary: "Docs infrastructure — sidebar layout, search, dark mode, and machine-readable registry.",
    changes: [
      { type: "added", description: "MUI-style docs layout — sticky top nav, fixed sidebar, scroll-spy TOC, dark mode persistence via localStorage." },
      { type: "added", description: "Search modal (Cmd+K) with component index." },
      { type: "added", description: "Machine-readable registry: /registry/index.json, /registry/ui/{name}.json, /registry/colors.json, /registry/styles/default.json." },
      { type: "added", description: "/api/tokens.json — structured design token API endpoint." },
      { type: "added", description: "atlas.config.json — AI tool manifest at the project root." },
      { type: "added", description: "Coming-soon component and catch-all route for unimplemented pages." },
      { type: "added", description: "llms.txt — AI context file for Claude Code, Replit, v0, and other AI tools." },
      { type: "added", description: "src/registry.json — machine-readable component spec." },
      { type: "fixed", description: "Yellow token values; semantic text tokens; dark mode on html element." },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-03-01",
    summary: "Initial release — 9 baseline components with design tokens and JSDoc.",
    changes: [
      { type: "added", description: "9 UI components: Button, Input, Textarea, Select, Checkbox, Switch, Badge, Avatar, Card." },
      { type: "added", description: "Bento design tokens — grey scale, blue, green, red, purple, yellow, brand colors, semantic tokens, elevation shadows." },
      { type: "added", description: "JSDoc on all 9 components and prop interfaces." },
      { type: "added", description: "Accessibility: aria-disabled on Button, aria-labelledby on Switch, status role on Badge, aria-label fallback on Avatar." },
      { type: "added", description: "TypeScript strict mode throughout." },
    ],
  },
];

export const CHANGE_TYPE_LABEL: Record<ChangeType, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
  deprecated: "Deprecated",
};

export const CHANGE_TYPE_COLORS: Record<ChangeType, string> = {
  added:      "bg-green-5  text-green-100  border-green-100/30",
  changed:    "bg-blue-5   text-blue-100   border-blue-100/30",
  fixed:      "bg-yellow-5 text-yellow-dark border-yellow-100/30",
  removed:    "bg-red-5    text-red-100    border-red-100/30",
  deprecated: "bg-grey-5   text-text-secondary border-border",
};
