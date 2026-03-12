import { CodeBlock } from "@/components/docs/code-block";

const IMPORT_SNIPPET = `import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Badge }    from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"`;

const STARTER_PROMPT = `You are building UI using Atlas UI — NinjaCat's React component library based on the Bento design system.

Setup:
- Read CLAUDE.md in the repo root for the complete guide
- Framework: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- Import pattern: import { ComponentName } from "@/components/ui/component-name"
- Machine-readable registry at /registry/index.json; full component source at /registry/ui/{name}.json
- Design tokens at /api/tokens.json

Available components: Button, Input, Textarea, Select, Checkbox, Switch, Badge, Avatar, Card

Critical prop conventions (enforced across all components):
- variant (not type/style/mode), color (not scheme/intent), size (not sz/s)
- leftIcon/rightIcon on Button; leadingIcon/trailingIcon on Input and Select
- className is always last and merged via cn()

Token rules:
- Always use semantic tokens: text-text-primary, bg-surface, bg-surface-raised, border-border, etc.
- Never use primitive tokens (text-grey-100, bg-white) for text or backgrounds

Anti-patterns to avoid:
- Never two solid/primary Buttons side by side
- Never <Switch> inside a submit form (use <Checkbox>)
- Never nest Cards more than 1 level deep
- Never omit alt on <Avatar>
- Never use danger color for non-destructive actions`;

export default function GettingStartedPage() {
  return (
    <article className="max-w-3xl">
      {/* Hero */}
      <h1 className="text-4xl font-bold text-text-primary mb-4">Getting started</h1>
      <p className="text-lg text-text-secondary leading-relaxed mb-10">
        Atlas UI is built for AI-assisted prototyping — every component has TypeScript interfaces,
        explicit prop conventions, and machine-readable endpoints. Start here before generating any UI.
      </p>

      {/* Section 1 — Read CLAUDE.md */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">1 — Read CLAUDE.md first</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">CLAUDE.md</code>{" "}
          at the repo root is the canonical AI guide: component inventory, prop naming rules, semantic token
          table, composition patterns, and anti-patterns. It is the single source of truth for working with
          this codebase.
        </p>
        <CodeBlock code="cat CLAUDE.md" language="bash" />
      </section>

      {/* Section 2 — Machine-readable discovery */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">2 — Machine-readable discovery</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          These four endpoints are designed for AI tools to consume before generating any UI. Fetch them
          programmatically or inspect them manually to understand the full token and component surface.
        </p>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-subtle border-b border-border">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Endpoint</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">What it returns</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  endpoint: "atlas.config.json (root)",
                  desc: "Framework manifest, import pattern, Figma key, dark mode strategy",
                },
                {
                  endpoint: "GET /api/tokens.json",
                  desc: "All design tokens: grey, blue, semantic (text/surface/border/icon), radius, shadow, dark overrides",
                },
                {
                  endpoint: "GET /registry/index.json",
                  desc: "Component manifest — name, title, description for all 9 stable components",
                },
                {
                  endpoint: "GET /registry/ui/{name}.json",
                  desc: "Full component source embedded in files[0].content",
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 align-top">
                    <code className="text-xs font-mono text-text-primary">{row.endpoint}</code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3 — Import pattern */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">3 — Import pattern</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          All components live in{" "}
          <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">src/components/ui/</code>.
          Use the{" "}
          <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">@/components/ui/</code>{" "}
          alias — never relative imports.
        </p>
        <CodeBlock code={IMPORT_SNIPPET} language="tsx" />
      </section>

      {/* Section 4 — Prop conventions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">4 — Prop conventions</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          These names are enforced across all components. Never deviate — prop mismatches cause type errors
          and break the component registry.
        </p>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-subtle border-b border-border">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Always use</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Never use</th>
              </tr>
            </thead>
            <tbody>
              {[
                { always: "variant", never: "type, style, mode" },
                { always: "color", never: "colorVariant, scheme, intent" },
                { always: "size", never: "buttonSize, s, sz" },
                { always: "leftIcon / rightIcon", never: "(on Button only)" },
                { always: "leadingIcon / trailingIcon", never: "(on Input, Select)" },
                { always: "className last, merged via cn()", never: 'inline style={}' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-text-primary">{row.always}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-text-secondary">{row.never}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5 — Token usage */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">5 — Token usage</h2>
        <div className="p-4 rounded-md bg-blue-5 border border-blue-20 dark:bg-blue-100/10 dark:border-blue-100/30 mb-4">
          <p className="text-sm font-medium text-text-primary">
            Never use primitive tokens for text or backgrounds — always use semantic tokens.
          </p>
        </div>
        <div className="rounded-md border border-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-subtle border-b border-border">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Use for</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Class</th>
              </tr>
            </thead>
            <tbody>
              {[
                { use: "Body text", cls: "text-text-primary" },
                { use: "Labels, hints", cls: "text-text-secondary" },
                { use: "Error messages", cls: "text-text-error" },
                { use: "Page background", cls: "bg-surface" },
                { use: "Card / raised surface", cls: "bg-surface-raised" },
                { use: "Subtle backgrounds", cls: "bg-surface-subtle" },
                { use: "Default border", cls: "border-border" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-text-secondary">{row.use}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-text-primary">{row.cls}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Dark mode tokens apply automatically — never write dark mode overrides manually for semantic tokens.
        </p>
      </section>

      {/* Section 6 — Anti-patterns */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">6 — Anti-patterns</h2>
        <div className="p-4 rounded-md border-l-4 border-red-100 bg-red-5 dark:bg-red-100/10 space-y-2">
          {[
            "Never use primitive tokens for semantic purposes (use text-text-primary, not text-grey-100)",
            "Never place two solid/primary Buttons side by side",
            "Never use danger color for non-destructive actions",
            "Never use <Switch> inside a submit form — use <Checkbox> instead",
            "Never omit alt on <Avatar> — initials and fallback states depend on it for screen readers",
            "Never nest <Card> more than 1 level deep",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-red-100 text-sm font-bold leading-none">✕</span>
              <p className="text-sm text-text-primary leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7 — Starter prompt */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-3">Starter prompt for AI tools</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Paste this into Claude Code, Cursor, or any AI tool to give it full Atlas context before asking it
          to prototype UI.
        </p>
        <CodeBlock code={STARTER_PROMPT} language="text" />
      </section>

      {/* Page footer */}
      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm text-text-secondary">
        <a href="#" className="hover:text-text-primary transition-colors">Edit this page</a>
        <a href="#" className="hover:text-text-primary transition-colors">Leave feedback</a>
      </div>
    </article>
  );
}
