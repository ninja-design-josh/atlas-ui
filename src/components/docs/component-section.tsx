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
                <span className="text-overline text-red-100">Don&apos;t</span>
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

interface DocSubheadingProps {
  children: React.ReactNode;
}

export function DocSubheading({ children }: DocSubheadingProps) {
  return (
    <h3 className="text-overline text-grey-50 mb-3">{children}</h3>
  );
}
