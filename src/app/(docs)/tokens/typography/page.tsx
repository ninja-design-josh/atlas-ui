"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useToc } from "@/components/docs/toc-context";

// ── Type style data ───────────────────────────────────────────────────

type TypeStyle = {
  className?: string;     // CSS utility class (empty for h1–h4 which use base styles)
  tag?: "h1" | "h2" | "h3" | "h4";
  label: string;
  specimen: string;
  size: string;
  weight: string;
  lineHeight: string;
  tracking?: string;
  transform?: string;
  note?: string;
};

const GROUPS: { id: string; label: string; styles: TypeStyle[] }[] = [
  {
    id: "headings",
    label: "Headings",
    styles: [
      { tag: "h1", label: "H1", specimen: "The quick brown fox", size: "34px", weight: "700 Bold",    lineHeight: "40px", tracking: "+0.5px" },
      { tag: "h2", label: "H2", specimen: "The quick brown fox", size: "24px", weight: "700 Bold",    lineHeight: "30px", tracking: "+0.3px" },
      { tag: "h3", label: "H3", specimen: "The quick brown fox jumps", size: "18px", weight: "700 Bold",    lineHeight: "24px", tracking: "+0.3px" },
      { tag: "h4", label: "H4", specimen: "SECTION HEADER",      size: "14px", weight: "700 Bold",    lineHeight: "24px", tracking: "+0.5px", transform: "uppercase" },
    ],
  },
  {
    id: "button",
    label: "Button",
    styles: [
      { className: "text-btn-primary",   label: "Button / Primary",   specimen: "Save changes",    size: "14px", weight: "500 Medium", lineHeight: "100%" },
      { className: "text-btn-secondary", label: "Button / Secondary", specimen: "Cancel",           size: "14px", weight: "500 Medium", lineHeight: "100%" },
      { className: "text-btn-sm",        label: "Button / Small",     specimen: "Delete",           size: "13px", weight: "500 Medium", lineHeight: "100%" },
      { className: "text-btn-link",      label: "Button / Link",      specimen: "Learn more →",     size: "13px", weight: "400 Regular", lineHeight: "18px" },
    ],
  },
  {
    id: "form",
    label: "Form",
    styles: [
      { className: "text-form-default",      label: "Form / Default",       specimen: "Enter your email address", size: "14px", weight: "400 Regular",  lineHeight: "18px" },
      { className: "text-form-label",        label: "Form / Label",         specimen: "Email address",            size: "13px", weight: "600 SemiBold", lineHeight: "16px" },
      { className: "text-form-sublabel",     label: "Form / Sub-label",     specimen: "We\u2019ll never share your email.", size: "12px", weight: "400 Regular",  lineHeight: "16px" },
      { className: "text-form-sublabel-bold",label: "Form / Sub-label Bold",specimen: "Required field",           size: "12px", weight: "600 SemiBold", lineHeight: "16px" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    styles: [
      { className: "text-nav-primary",   label: "Nav / Primary",   specimen: "Components",    size: "14px", weight: "600 SemiBold", lineHeight: "18px", tracking: "+0.2px" },
      { className: "text-nav-secondary", label: "Nav / Secondary", specimen: "Button",        size: "13px", weight: "600 SemiBold", lineHeight: "100%" },
    ],
  },
  {
    id: "paragraph",
    label: "Paragraph",
    styles: [
      { className: "text-para",      label: "Paragraph / Regular", specimen: "Atlas UI is a React component library built on the Bento design system.", size: "13px", weight: "400 Regular", lineHeight: "18px" },
      { className: "text-para-bold", label: "Paragraph / Bold",    specimen: "Atlas UI is a React component library built on the Bento design system.", size: "13px", weight: "700 Bold",    lineHeight: "18px" },
    ],
  },
  {
    id: "table",
    label: "Table",
    styles: [
      { className: "text-table-primary",      label: "Table / Primary",       specimen: "John Smith",      size: "13px", weight: "400 Regular", lineHeight: "18px" },
      { className: "text-table-primary-bold", label: "Table / Primary Bold",  specimen: "John Smith",      size: "13px", weight: "500 Medium",  lineHeight: "18px" },
      { className: "text-table-secondary",    label: "Table / Secondary",     specimen: "john@example.com", size: "12px", weight: "400 Regular", lineHeight: "18px" },
      { className: "text-table-header",       label: "Table / Header",        specimen: "Name",            size: "13px", weight: "700 Bold",    lineHeight: "16px" },
      { className: "text-table-footer",       label: "Table / Footer",        specimen: "Subtotal",        size: "14px", weight: "400 Regular", lineHeight: "18px" },
      { className: "text-table-footer-bold",  label: "Table / Footer Bold",   specimen: "Total",           size: "14px", weight: "700 Bold",    lineHeight: "18px" },
      { className: "text-table-subhead",      label: "Table / Subhead",       specimen: "GROUP A",         size: "13px", weight: "700 Bold",    lineHeight: "16px", transform: "uppercase" },
    ],
  },
  {
    id: "tooltip",
    label: "Tooltip",
    styles: [
      { className: "text-tooltip-heading", label: "Tooltip / Heading", specimen: "More information", size: "12px", weight: "700 Bold",    lineHeight: "18px" },
      { className: "text-tooltip-text",    label: "Tooltip / Text",    specimen: "This action cannot be undone.", size: "12px", weight: "400 Regular", lineHeight: "18px" },
    ],
  },
  {
    id: "avatar",
    label: "Avatar & User Control",
    styles: [
      { className: "text-avatar-initials", label: "Avatar / Initials",           specimen: "JB",           size: "11px", weight: "700 Bold",    lineHeight: "18px" },
      { className: "text-account-name",    label: "User Control / Account Name", specimen: "Acme Corp",    size: "13px", weight: "500 Medium",  lineHeight: "18px" },
      { className: "text-user-name",       label: "User Control / User Name",    specimen: "Josh Brinksman", size: "14px", weight: "600 SemiBold", lineHeight: "18px" },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────

function TypeRow({ style }: { style: TypeStyle }) {
  const Tag = style.tag ?? "p";
  const specimenClass = style.className;

  const specs = [
    style.size,
    style.weight,
    `${style.lineHeight} lh`,
    style.tracking && `${style.tracking} tracking`,
    style.transform === "uppercase" && "uppercase",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="grid grid-cols-[10rem_1fr] gap-6 py-4 border-b border-border last:border-b-0 items-start">
      {/* Metadata */}
      <div className="shrink-0 pt-0.5">
        {style.className ? (
          <code className="text-xs font-mono text-text-primary bg-surface-subtle border border-border rounded px-1.5 py-0.5">
            .{style.className}
          </code>
        ) : (
          <code className="text-xs font-mono text-text-primary bg-surface-subtle border border-border rounded px-1.5 py-0.5">
            {`<${style.tag}>`}
          </code>
        )}
        <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">{specs}</p>
      </div>

      {/* Live specimen */}
      <div className="overflow-hidden">
        <Tag
          className={cn(
            "text-text-primary",
            specimenClass,
            style.transform === "uppercase" && !style.className && "uppercase"
          )}
        >
          {style.specimen}
        </Tag>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function TypographyTokensPage() {
  const { setItems } = useToc();

  React.useEffect(() => {
    setItems([
      {
        label: "Type scale",
        href: "#type-scale",
        children: GROUPS.map((g) => ({ label: g.label, href: `#${g.id}` })),
      },
      { label: "Usage", href: "#usage" },
    ]);
    return () => setItems([]);
  }, [setItems]);

  return (
    <article className="max-w-3xl">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-text-secondary mb-6">
        <span className="hover:text-text-primary transition-colors cursor-default">Tokens</span>
        <span className="mx-0.5">/</span>
        <span className="text-text-primary">Typography</span>
      </nav>

      <h1 className="text-4xl font-bold text-text-primary mb-4">Typography</h1>
      <p className="text-lg text-text-secondary leading-relaxed mb-10">
        Bento&apos;s type system is built on Inter across a consistent scale of weights, sizes, and leading.
        Heading styles are applied via base HTML element styles. All other styles are available as
        Tailwind utility classes (e.g.{" "}
        <code className="text-sm font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">
          text-form-label
        </code>
        ).
      </p>

      {/* Font info callout */}
      <div className="rounded-lg border border-border bg-surface-subtle px-4 py-3 mb-10 flex items-start gap-3">
        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-100 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-text-primary">Inter — all weights, all styles</p>
          <p className="text-sm text-text-secondary mt-0.5">
            Loaded via{" "}
            <code className="text-xs font-mono bg-surface border border-border rounded px-1">next/font/google</code>.
            CSS variable:{" "}
            <code className="text-xs font-mono bg-surface border border-border rounded px-1">var(--font-inter)</code>.
            Applied to <code className="text-xs font-mono bg-surface border border-border rounded px-1">--font-sans</code>.
          </p>
        </div>
      </div>

      {/* ── Type scale ──────────────────────────────────────────── */}
      <section id="type-scale" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold text-text-primary mb-8">Type scale</h2>

        {GROUPS.map((group) => (
          <div key={group.id} id={group.id} className="mb-10 scroll-mt-20">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-0 pb-2 border-b border-border">
              {group.label}
            </h3>
            <div>
              {group.styles.map((style) => (
                <TypeRow key={style.label} style={style} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Usage ─────────────────────────────────────────────── */}
      <section id="usage" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Usage</h2>
        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary font-semibold">Heading elements</strong> —{" "}
            <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">h1</code>
            {" "}through{" "}
            <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">h4</code>{" "}
            are styled globally via <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">@layer base</code>{" "}
            in <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">globals.css</code>.
            Use the native elements — no class required.
          </p>
          <p>
            <strong className="text-text-primary font-semibold">All other styles</strong> — Use the{" "}
            <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">text-*</code>{" "}
            utility classes from the table above. They set <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">font-size</code>,{" "}
            <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">font-weight</code>,{" "}
            and <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">line-height</code>{" "}
            together so they always stay in sync with the Figma source.
          </p>
          <p>
            <strong className="text-text-primary font-semibold">Color is separate</strong> — Typography
            utilities only control size, weight, and leading. Always pair them with a semantic color token
            like <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">text-text-primary</code>{" "}
            or <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1">text-text-secondary</code>.
          </p>
        </div>
      </section>

      {/* Page footer */}
      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm text-text-secondary">
        <a href="#" className="hover:text-text-primary transition-colors">Edit this page</a>
        <a href="#" className="hover:text-text-primary transition-colors">Leave feedback</a>
      </div>
    </article>
  );
}
