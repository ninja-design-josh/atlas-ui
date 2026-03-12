"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "tsx", className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("rounded-sm overflow-hidden border border-grey-10 dark:border-grey-90", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-grey-5 dark:bg-grey-120 border-b border-grey-10 dark:border-grey-90">
        <span className="text-overline text-grey-50">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-grey-50 hover:text-grey-100 dark:hover:text-grey-10 transition-colors px-2 py-0.5 rounded-sm hover:bg-grey-10 dark:hover:bg-grey-90"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 bg-grey-2 dark:bg-grey-120 text-sm font-mono leading-relaxed text-grey-100 dark:text-grey-10">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
