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

  React.useEffect(() => {
    const items: TocItem[] = [];
    if (examples.length > 0) items.push({ label: "Examples", href: "#examples" });
    if (props.length > 0) items.push({ label: "Props", href: "#props" });
    if (dos.length > 0 || donts.length > 0)
      items.push({ label: "Best practices", href: "#best-practices" });
    if (relatedComponents.length > 0)
      items.push({ label: "Related components", href: "#related-components" });
    if (accessibility) {
      const tocChildren: TocItem["children"] = [];
      if (accessibility.labeling)
        tocChildren.push({ label: "Labeling", href: "#labeling" });
      if (accessibility.keyboardSupport?.length)
        tocChildren.push({ label: "Keyboard support", href: "#keyboard-support" });
      items.push({ label: "Accessibility", href: "#accessibility", children: tocChildren });
    }
    setItems(items);
    return () => setItems([]);
  }, [
    examples.length,
    props.length,
    dos.length,
    donts.length,
    relatedComponents.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    !!accessibility,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    !!accessibility?.labeling,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    !!accessibility?.keyboardSupport?.length,
    setItems,
  ]);

  return (
    <article className="max-w-3xl">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <nav
          aria-label="breadcrumb"
          className="flex items-center flex-wrap gap-1 text-sm text-text-secondary mb-6"
        >
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <span className="text-text-secondary mx-0.5">/</span>}
              <Link
                href={crumb.href}
                className="hover:text-text-primary transition-colors no-underline"
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
          <span className="text-text-secondary mx-0.5">/</span>
          <span className="text-text-primary">{name}</span>
        </nav>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-text-primary mb-4">{name}</h1>

      {/* Status badge */}
      {status && status !== "stable" && (
        <span
          className={cn(
            "inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-4",
            status === "beta"
              ? "bg-yellow-10 text-yellow-dark"
              : "bg-grey-10 text-text-secondary"
          )}
        >
          {status}
        </span>
      )}

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
      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm text-text-secondary">
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
    <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary mb-3">
      {children}
    </h3>
  );
}
