"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TocProvider } from "./toc-context";
import { OnThisPage } from "./on-this-page";

// --- Types ---
export type ComponentStatus = "stable" | "beta" | "draft" | "coming-soon";

export type NavLink = {
  type: "link";
  href: string;
  label: string;
  status?: ComponentStatus;
};

export type NavCategory = {
  type: "category";
  label: string;
  children: NavLink[];
};

export type NavTopSection = {
  type: "top-section";
  label: string;
  href?: string;
  children?: (NavCategory | NavLink)[];
};

export type NavItem = NavTopSection | NavCategory | NavLink;

// --- Helpers ---
function isActiveInChildren(
  children: (NavCategory | NavLink)[],
  pathname: string
): boolean {
  for (const child of children) {
    if (child.type === "link" && child.href === pathname) return true;
    if (
      child.type === "category" &&
      child.children.some((l) => l.href === pathname)
    )
      return true;
  }
  return false;
}

// --- Sub-components ---
function SidebarLink({
  item,
  active,
  depth,
}: {
  item: NavLink;
  active: boolean;
  depth: number;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between rounded py-[5px] text-sm transition-colors no-underline",
        depth === 1 ? "pl-4 pr-3" : depth === 2 ? "pl-6 pr-3" : "px-3",
        active
          ? "text-text-primary font-medium border-l-2 border-blue-100 bg-blue-5 dark:bg-blue-100/10 dark:text-blue-50 -ml-px"
          : "text-grey-70 hover:text-text-primary hover:bg-grey-10/60 dark:text-grey-50 dark:hover:text-grey-10"
      )}
    >
      {item.label}
      {item.status === "coming-soon" && (
        <span className="text-[10px] text-grey-40 italic font-normal">
          soon
        </span>
      )}
    </Link>
  );
}

function SidebarCategory({
  item,
  pathname,
}: {
  item: NavCategory;
  pathname: string;
}) {
  return (
    <div className="mt-4 mb-1">
      <p className="px-3 mb-1 text-xs font-semibold text-grey-50 uppercase tracking-wider">
        {item.label}
      </p>
      {item.children.filter((child) => child.status !== "coming-soon").map((child) => (
        <SidebarLink
          key={child.href}
          item={child}
          active={pathname === child.href}
          depth={2}
        />
      ))}
    </div>
  );
}

function SidebarTopSection({
  item,
  pathname,
}: {
  item: NavTopSection;
  pathname: string;
}) {
  const hasChildren = !!item.children?.length;
  const isInsideSection = hasChildren
    ? isActiveInChildren(item.children!, pathname)
    : pathname === item.href;
  const [open, setOpen] = React.useState(isInsideSection);

  if (!hasChildren) {
    return (
      <SidebarLink
        item={{ type: "link", href: item.href!, label: item.label }}
        active={pathname === item.href}
        depth={0}
      />
    );
  }

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-[7px] rounded text-sm transition-colors",
          isInsideSection
            ? "text-text-primary font-medium"
            : "text-grey-70 hover:text-text-primary hover:bg-grey-10/60 dark:text-grey-50"
        )}
      >
        {item.label}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-grey-40 transition-transform duration-150",
            open && "rotate-90"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="ml-1">
          {item.children!.map((child) =>
            child.type === "category" ? (
              <SidebarCategory key={child.label} item={child} pathname={pathname} />
            ) : (
              <SidebarLink
                key={child.href}
                item={child}
                active={pathname === child.href}
                depth={1}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// --- Main layout ---
interface DocsLayoutProps {
  navItems: NavItem[];
  children: React.ReactNode;
  onSearchOpen?: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function DocsLayout({
  navItems,
  children,
  onSearchOpen,
  darkMode,
  onDarkModeToggle,
}: DocsLayoutProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <TocProvider>
      <div className="min-h-screen flex flex-col">
        {/* Top nav */}
        <header
          className="sticky top-0 z-40 h-14 flex items-center border-b border-border bg-surface px-6 gap-4"
          style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}
        >
          <Link
            href="/"
            className="font-bold text-base text-text-primary tracking-tight no-underline hover:opacity-80 transition-opacity"
          >
            Atlas UI
          </Link>
          <div className="flex-1" />
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 h-8 rounded border border-border bg-surface-subtle text-sm text-text-secondary hover:border-border-strong transition-colors"
            aria-label="Search components (Cmd+K)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search</span>
            <kbd className="ml-2 text-[10px] text-text-secondary border border-border rounded px-1">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={onDarkModeToggle}
            className="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-surface-subtle transition-colors"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-surface py-4 px-2">
            <nav>
              {navItems.map((item, i) => {
                if (item.type === "link") {
                  if (item.status === "coming-soon") return null;
                  return (
                    <SidebarLink
                      key={item.href}
                      item={item}
                      active={pathname === item.href}
                      depth={0}
                    />
                  );
                }
                if (item.type === "category") {
                  const visible = item.children.filter((c) => c.status !== "coming-soon");
                  if (!visible.length) return null;
                  return (
                    <SidebarCategory key={i} item={{ ...item, children: visible }} pathname={pathname} />
                  );
                }
                // top-section: hide leaf sections with no href that are coming-soon stubs;
                // for sections with children, hide if all children (and their grandchildren) are coming-soon
                if (!item.children) {
                  if (!item.href) return null;
                  return (
                    <SidebarTopSection key={i} item={item} pathname={pathname} />
                  );
                }
                const visibleChildren = item.children
                  .map((child) => {
                    if (child.type === "link") return child.status !== "coming-soon" ? child : null;
                    const visLinks = child.children.filter((l) => l.status !== "coming-soon");
                    return visLinks.length ? { ...child, children: visLinks } : null;
                  })
                  .filter(Boolean) as typeof item.children;
                if (!visibleChildren.length) return null;
                return (
                  <SidebarTopSection key={i} item={{ ...item, children: visibleChildren }} pathname={pathname} />
                );
              })}
            </nav>
          </aside>

          {/* Main + right TOC */}
          <div className="flex flex-1 min-w-0">
            <main className="flex-1 min-w-0 max-w-3xl px-10 py-8 bg-surface">
              {children}
            </main>
            <div className="px-6 py-8">
              <OnThisPage />
            </div>
          </div>
        </div>
      </div>
    </TocProvider>
  );
}
