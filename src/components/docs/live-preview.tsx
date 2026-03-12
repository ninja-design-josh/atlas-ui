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
    <div className={cn("rounded-sm border border-grey-10 dark:border-grey-90 overflow-hidden", className)}>
      {label && (
        <div className="px-4 py-2 bg-grey-5 dark:bg-grey-120 border-b border-grey-10 dark:border-grey-90 flex items-center justify-between">
          <span className="text-overline text-grey-50">{label}</span>
        </div>
      )}
      <div
        className={cn(
          "bg-grey-2 dark:bg-grey-110",
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
            className="w-full px-4 py-2 flex items-center gap-2 text-xs text-grey-60 dark:text-grey-50 border-t border-grey-10 dark:border-grey-90 hover:bg-grey-5 dark:hover:bg-grey-120 transition-colors"
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
            <div className="border-t border-grey-10 dark:border-grey-90">
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
