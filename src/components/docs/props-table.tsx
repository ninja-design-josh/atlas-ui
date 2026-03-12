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
