export default function OverviewPage() {
  return (
    <section className="pb-10">
      <h1 className="text-3xl font-bold text-grey-100 dark:text-grey-10 mb-3">Atlas UI</h1>
      <p className="text-grey-70 dark:text-grey-50 mb-8 leading-relaxed max-w-2xl">
        A React component library built on the Bento design system with MUI-inspired interaction patterns.
        Designed for AI-assisted development — every component has explicit TypeScript interfaces,
        copy-paste ready snippets, and composition guidance.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Stack",          value: "Next.js 15 · React 19 · TypeScript" },
          { label: "Styling",        value: "Tailwind CSS v4 · Inter font" },
          { label: "Import pattern", value: "@/components/ui/[name]" },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-md bg-grey-2 border border-border">
            <p className="text-overline text-grey-50 mb-1">{item.label}</p>
            <p className="text-sm text-grey-100 dark:text-grey-10 font-mono">{item.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-grey-100 dark:text-grey-10 mb-4">Components</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { href: "/components/actions/button",                name: "Button",   desc: "Solid, outlined, ghost · 3 color roles · loading state" },
          { href: "/components/selection-and-input/input",    name: "Input",    desc: "Label, hint, error, leading/trailing icons" },
          { href: "/components/selection-and-input/textarea", name: "Textarea", desc: "Multi-line · same API as Input" },
          { href: "/components/selection-and-input/select",   name: "Select",   desc: "Native dropdown · label, hint, error" },
          { href: "/components/selection-and-input/checkbox", name: "Checkbox", desc: "Controlled + uncontrolled · label + description" },
          { href: "/components/selection-and-input/switch",   name: "Switch",   desc: "Immediate-effect toggle · role=switch" },
          { href: "/components/feedback-indicators/badge",    name: "Badge",    desc: "6 semantic variants · dot indicator · 2 sizes" },
          { href: "/components/images-and-icons/avatar",      name: "Avatar",   desc: "Image → initials → icon fallback · 4 sizes" },
          { href: "/components/layout-and-structure/card",    name: "Card",     desc: "Surface container · elevation 0–8 · subcomponents" },
        ].map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="group block p-4 rounded-md border border-border bg-surface hover:border-blue-100 hover:shadow-elevation-1 transition-all no-underline"
          >
            <p className="text-sm font-semibold text-text-primary group-hover:text-blue-100 transition-colors mb-1">{c.name}</p>
            <p className="text-xs text-text-secondary leading-relaxed">{c.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
