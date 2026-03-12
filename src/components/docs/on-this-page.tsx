"use client";

import * as React from "react";
import { useToc } from "./toc-context";

export function OnThisPage() {
  const { items } = useToc();
  if (!items.length) return null;

  return (
    <aside className="w-48 shrink-0 sticky top-14 h-fit hidden xl:block pl-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-grey-50 mb-3">
        On this page
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <div key={item.href}>
            <a
              href={item.href}
              className="block text-sm text-grey-60 hover:text-text-primary transition-colors py-1 no-underline dark:text-grey-50"
            >
              {item.label}
            </a>
            {item.children?.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="block text-sm text-grey-50 hover:text-text-primary transition-colors py-0.5 pl-3 no-underline dark:text-grey-60"
              >
                {child.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
