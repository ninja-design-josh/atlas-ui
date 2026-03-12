"use client";

import * as React from "react";
import { useToc } from "@/components/docs/toc-context";

// ── Helpers ──────────────────────────────────────────────────────────

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}

// ── Primitive palette data ────────────────────────────────────────────

const PALETTES: { name: string; prefix: string; steps: { name: string; hex: string }[] }[] = [
  {
    name: "Grey",
    prefix: "grey",
    steps: [
      { name: "0",   hex: "#FFFFFF" },
      { name: "2",   hex: "#F9FAFB" },
      { name: "5",   hex: "#F2F4F7" },
      { name: "10",  hex: "#E7EAEF" },
      { name: "20",  hex: "#D5DAE1" },
      { name: "30",  hex: "#BDC2CC" },
      { name: "40",  hex: "#A8AEBA" },
      { name: "50",  hex: "#939AA7" },
      { name: "60",  hex: "#7E8694" },
      { name: "70",  hex: "#697280" },
      { name: "80",  hex: "#545D6B" },
      { name: "90",  hex: "#424A58" },
      { name: "100", hex: "#2D3540" },
      { name: "110", hex: "#202832" },
      { name: "120", hex: "#151C25" },
      { name: "130", hex: "#000000" },
    ],
  },
  {
    name: "Blue",
    prefix: "blue",
    steps: [
      { name: "5",    hex: "#E5EDFF" },
      { name: "10",   hex: "#CCDBFC" },
      { name: "20",   hex: "#99B5FA" },
      { name: "50",   hex: "#6691FA" },
      { name: "100",  hex: "#1E66F0" },
      { name: "dark", hex: "#1855CD" },
    ],
  },
  {
    name: "Green",
    prefix: "green",
    steps: [
      { name: "5",   hex: "#F4FAF4" },
      { name: "50",  hex: "#8BCA8E" },
      { name: "100", hex: "#239B2A" },
    ],
  },
  {
    name: "Red",
    prefix: "red",
    steps: [
      { name: "5",   hex: "#F8EDF1" },
      { name: "50",  hex: "#F27DA8" },
      { name: "100", hex: "#EB0057" },
    ],
  },
  {
    name: "Purple",
    prefix: "purple",
    steps: [
      { name: "5",    hex: "#F3EEF9" },
      { name: "50",   hex: "#BA8CF9" },
      { name: "100",  hex: "#7C1EFA" },
      { name: "dark", hex: "#450082" },
    ],
  },
  {
    name: "Yellow",
    prefix: "yellow",
    steps: [
      { name: "5",    hex: "#FFFBF5" },
      { name: "10",   hex: "#FEF6E9" },
      { name: "50",   hex: "#FAD08C" },
      { name: "100",  hex: "#F5A523" },
      { name: "dark", hex: "#D27412" },
    ],
  },
  {
    name: "Brand",
    prefix: "brand",
    steps: [
      { name: "lime",   hex: "#96FD1A" },
      { name: "aqua",   hex: "#00EEF8" },
      { name: "navy",   hex: "#140F4C" },
      { name: "indigo", hex: "#36368F" },
      { name: "mauve",  hex: "#986CC1" },
      { name: "teal",   hex: "#179494" },
    ],
  },
];

// ── Semantic token data ───────────────────────────────────────────────

type SemanticRow = {
  token: string;
  cssVar: string;
  lightHex: string;
  lightLabel: string;
  darkHex: string;
  darkLabel: string;
};

const SEMANTIC_GROUPS: { id: string; label: string; rows: SemanticRow[] }[] = [
  {
    id: "text",
    label: "Text",
    rows: [
      { token: "text-primary",   cssVar: "--color-text-primary",   lightHex: "#2D3540", lightLabel: "grey-100", darkHex: "#E7EAEF", darkLabel: "grey-10"   },
      { token: "text-secondary", cssVar: "--color-text-secondary", lightHex: "#697280", lightLabel: "grey-70",  darkHex: "#A8AEBA", darkLabel: "grey-40"   },
      { token: "text-error",     cssVar: "--color-text-error",     lightHex: "#EB0057", lightLabel: "red-100",  darkHex: "#EB0057", darkLabel: "red-100"   },
      { token: "text-link",      cssVar: "--color-text-link",      lightHex: "#1E66F0", lightLabel: "blue-100", darkHex: "#1E66F0", darkLabel: "blue-100"  },
      { token: "text-white",     cssVar: "--color-text-white",     lightHex: "#FFFFFF", lightLabel: "grey-0",   darkHex: "#FFFFFF", darkLabel: "grey-0"    },
    ],
  },
  {
    id: "icon",
    label: "Icon",
    rows: [
      { token: "icon-primary",   cssVar: "--color-icon-primary",   lightHex: "#545D6B", lightLabel: "grey-80",    darkHex: "#D5DAE1", darkLabel: "grey-20"   },
      { token: "icon-secondary", cssVar: "--color-icon-secondary", lightHex: "#697280", lightLabel: "grey-70",    darkHex: "#A8AEBA", darkLabel: "grey-40"   },
      { token: "icon-red",       cssVar: "--color-icon-red",       lightHex: "#EB0057", lightLabel: "red-100",    darkHex: "#EB0057", darkLabel: "red-100"   },
      { token: "icon-green",     cssVar: "--color-icon-green",     lightHex: "#239B2A", lightLabel: "green-100",  darkHex: "#239B2A", darkLabel: "green-100" },
      { token: "icon-blue",      cssVar: "--color-icon-blue",      lightHex: "#1E66F0", lightLabel: "blue-100",   darkHex: "#1E66F0", darkLabel: "blue-100"  },
      { token: "icon-yellow",    cssVar: "--color-icon-yellow",    lightHex: "#D27412", lightLabel: "yellow-dark", darkHex: "#D27412", darkLabel: "yellow-dark" },
    ],
  },
  {
    id: "surface",
    label: "Surface",
    rows: [
      { token: "surface",        cssVar: "--color-surface",        lightHex: "#FFFFFF", lightLabel: "grey-0",   darkHex: "#202832", darkLabel: "grey-110"  },
      { token: "surface-subtle", cssVar: "--color-surface-subtle", lightHex: "#F9FAFB", lightLabel: "grey-2",   darkHex: "#151C25", darkLabel: "grey-120"  },
      { token: "surface-raised", cssVar: "--color-surface-raised", lightHex: "#FFFFFF", lightLabel: "grey-0",   darkHex: "#2D3540", darkLabel: "grey-100"  },
    ],
  },
  {
    id: "border",
    label: "Border",
    rows: [
      { token: "border",        cssVar: "--color-border",        lightHex: "#E7EAEF", lightLabel: "grey-10", darkHex: "#424A58", darkLabel: "grey-90" },
      { token: "border-strong", cssVar: "--color-border-strong", lightHex: "#BDC2CC", lightLabel: "grey-30", darkHex: "#545D6B", darkLabel: "grey-80" },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────

function SwatchStrip({ name, prefix, steps }: { name: string; prefix: string; steps: { name: string; hex: string }[] }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">{name}</p>
      <div className="rounded-lg overflow-hidden border border-border">
        {/* Color chips row */}
        <div className="flex">
          {steps.map((step) => (
            <div
              key={step.name}
              className="flex-1 h-14 flex items-end justify-start p-1.5"
              style={{ backgroundColor: step.hex }}
            >
              <span
                className="text-[9px] font-semibold leading-none"
                style={{ color: isLight(step.hex) ? "#424A58" : "#D5DAE1" }}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
        {/* Hex values row */}
        <div className="flex border-t border-border bg-surface">
          {steps.map((step) => (
            <div key={step.name} className="flex-1 px-1 py-2 border-r border-border last:border-r-0">
              <p className="text-[9px] text-text-secondary font-mono leading-none break-all">{step.hex}</p>
              <p className="text-[9px] text-text-secondary font-mono leading-none mt-0.5 opacity-60">{prefix}-{step.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorDot({ hex, size = "md" }: { hex: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <span
      className={`${dim} rounded-full border border-black/10 inline-block flex-shrink-0`}
      style={{ backgroundColor: hex }}
    />
  );
}

function SemanticTable({ rows }: { rows: SemanticRow[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden mb-6">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1.4fr_1fr_1fr] gap-0 bg-surface-subtle border-b border-border">
        {["Token", "CSS variable", "Light", "Dark"].map((h) => (
          <div key={h} className="px-3 py-2">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{h}</span>
          </div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.token}
          className={`grid grid-cols-[1fr_1.4fr_1fr_1fr] gap-0 border-b border-border last:border-b-0 ${i % 2 === 1 ? "bg-surface-subtle/50" : "bg-surface"}`}
        >
          {/* Token */}
          <div className="px-3 py-2.5 flex items-center">
            <code className="text-xs font-mono text-text-primary">{row.token}</code>
          </div>
          {/* CSS var */}
          <div className="px-3 py-2.5 flex items-center">
            <code className="text-[11px] font-mono text-text-secondary">{row.cssVar}</code>
          </div>
          {/* Light */}
          <div className="px-3 py-2.5 flex items-center gap-2">
            <ColorDot hex={row.lightHex} />
            <div>
              <p className="text-xs font-mono text-text-primary">{row.lightHex}</p>
              <p className="text-[10px] text-text-secondary">{row.lightLabel}</p>
            </div>
          </div>
          {/* Dark */}
          <div className="px-3 py-2.5 flex items-center gap-2">
            <ColorDot hex={row.darkHex} />
            <div>
              <p className="text-xs font-mono text-text-primary">{row.darkHex}</p>
              <p className="text-[10px] text-text-secondary">{row.darkLabel}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function ColorTokensPage() {
  const { setItems } = useToc();

  React.useEffect(() => {
    setItems([
      {
        label: "Primitive tokens",
        href: "#primitives",
        children: PALETTES.map((p) => ({ label: p.name, href: `#${p.prefix}` })),
      },
      {
        label: "Semantic tokens",
        href: "#semantic",
        children: SEMANTIC_GROUPS.map((g) => ({ label: g.label, href: `#semantic-${g.id}` })),
      },
    ]);
    return () => setItems([]);
  }, [setItems]);

  return (
    <article className="max-w-3xl">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-text-secondary mb-6">
        <span className="hover:text-text-primary transition-colors cursor-default">Tokens</span>
        <span className="mx-0.5">/</span>
        <span className="text-text-primary">Color</span>
      </nav>

      <h1 className="text-4xl font-bold text-text-primary mb-4">Color</h1>
      <p className="text-lg text-text-secondary leading-relaxed mb-10">
        Bento&apos;s color system is built on primitive palettes (raw values) and semantic tokens (purpose-mapped
        aliases). Always use semantic tokens in component code — never reference primitives directly.
      </p>

      {/* ── Primitive tokens ──────────────────────────────────── */}
      <section id="primitives" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold text-text-primary mb-1">Primitive tokens</h2>
        <p className="text-sm text-text-secondary mb-6">
          Raw named values. Reference these only when defining new semantic tokens in{" "}
          <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">globals.css</code>.
        </p>

        {PALETTES.map((palette) => (
          <div key={palette.prefix} id={palette.prefix} className="scroll-mt-20">
            <SwatchStrip name={palette.name} prefix={palette.prefix} steps={palette.steps} />
          </div>
        ))}
      </section>

      {/* ── Semantic tokens ───────────────────────────────────── */}
      <section id="semantic" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold text-text-primary mb-1">Semantic tokens</h2>
        <p className="text-sm text-text-secondary mb-8">
          Purpose-mapped aliases over primitives. These adapt between light and dark mode automatically.
          Use Tailwind utilities like{" "}
          <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">text-text-primary</code>{" "}
          or{" "}
          <code className="text-xs font-mono bg-surface-subtle border border-border rounded px-1 py-0.5">bg-surface</code>{" "}
          — never the hex values directly.
        </p>

        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.id} id={`semantic-${group.id}`} className="mb-10 scroll-mt-20">
            <h3 className="text-base font-semibold text-text-primary mb-3">{group.label}</h3>
            <SemanticTable rows={group.rows} />
          </div>
        ))}
      </section>

      {/* Page footer */}
      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm text-text-secondary">
        <a href="#" className="hover:text-text-primary transition-colors">Edit this page</a>
        <a href="#" className="hover:text-text-primary transition-colors">Leave feedback</a>
      </div>
    </article>
  );
}
