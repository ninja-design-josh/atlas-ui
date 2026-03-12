"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ComponentStatus = "stable" | "beta" | "draft";

export type NavItem =
  | { type: "section"; label: string }
  | { type: "link"; id: string; label: string; status?: ComponentStatus };

interface DocsLayoutProps {
  navItems: NavItem[];
  children: React.ReactNode;
  onSearchOpen?: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

const statusColors: Record<ComponentStatus, string> = {
  stable: "bg-green-100",
  beta:   "bg-yellow-50",
  draft:  "bg-grey-30",
};

export function DocsLayout({
  navItems,
  children,
  onSearchOpen,
  darkMode,
  onDarkModeToggle,
}: DocsLayoutProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  // Scroll-spy: track which section is in view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("min-h-screen flex flex-col", darkMode && "dark")}>
      {/* Top nav */}
      <header className="sticky top-0 z-40 h-14 flex items-center border-b border-border bg-surface px-6 gap-4">
        <span className="font-bold text-base text-text-primary mr-4">Atlas UI</span>
        <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">NinjaCat Design System</span>
        <div className="flex-1" />
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 h-8 rounded-sm border border-border bg-surface-subtle text-sm text-text-secondary hover:border-border-strong transition-colors"
          aria-label="Search components (Cmd+K)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span>Search</span>
          <kbd className="ml-2 text-[10px] text-text-secondary border border-border rounded px-1">⌘K</kbd>
        </button>
        <button
          onClick={onDarkModeToggle}
          className="w-8 h-8 flex items-center justify-center rounded-sm border border-border hover:bg-surface-subtle transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        }
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-surface py-6 px-4">
          <nav>
            {navItems.map((item, i) => {
              if (item.type === "section") {
                return (
                  <p key={i} className="text-overline text-text-secondary mt-5 mb-1 first:mt-0">
                    {item.label}
                  </p>
                );
              }
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors",
                    activeId === item.id
                      ? "bg-blue-5 text-blue-100 font-medium dark:bg-blue-100/10 dark:text-blue-50"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
                  )}
                >
                  {item.label}
                  {item.status && item.status !== "stable" && (
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusColors[item.status])} aria-label={item.status} />
                  )}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-4xl px-12 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
