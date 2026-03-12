"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  label: string;
  description: string;
  type: "component" | "prop" | "token";
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  items: SearchResult[];
}

export function SearchModal({ open, onClose, items }: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  // Close on Escape — only when modal is open
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="absolute inset-0 bg-grey-130/40" aria-hidden="true" />
      <div
        className="relative w-full max-w-lg bg-surface rounded-sm border border-border shadow-elevation-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary shrink-0" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, props, tokens..."
            className="flex-1 h-12 bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          <kbd className="text-[10px] text-text-secondary border border-border rounded px-1">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && (
            <p className="p-6 text-sm text-text-secondary text-center">No results for &quot;{query}&quot;</p>
          )}
          {results.map((result) => (
            <a
              key={result.id}
              href={`#${result.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-subtle transition-colors border-b border-border last:border-0"
            >
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0",
                result.type === "component" ? "bg-blue-5 text-blue-100" :
                result.type === "prop"      ? "bg-purple-5 text-purple-100" :
                                              "bg-grey-10 text-text-secondary"
              )}>
                {result.type}
              </span>
              <div>
                <p className="text-sm font-medium text-text-primary">{result.label}</p>
                <p className="text-xs text-text-secondary">{result.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
