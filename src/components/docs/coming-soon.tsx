import * as React from "react";
import Link from "next/link";

interface ComingSoonProps {
  breadcrumb: { label: string; href: string }[];
  name: string;
}

export function ComingSoon({ breadcrumb, name }: ComingSoonProps) {
  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav
        className="flex items-center flex-wrap gap-1 text-sm text-text-secondary mb-6"
        aria-label="breadcrumb"
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
        <span className="text-text-secondary">{name}</span>
      </nav>

      <h1 className="text-4xl font-bold text-text-primary mb-4">{name}</h1>

      <div className="mt-12 flex flex-col items-start gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-10 border border-yellow-100 text-sm text-yellow-dark font-medium">
          <span className="h-2 w-2 rounded-full bg-yellow-100 animate-pulse" />
          Coming soon
        </div>
        <p className="text-text-secondary text-base leading-relaxed">
          This component is on the roadmap and will be added to Atlas UI in a future release.
        </p>
        <Link
          href="/"
          className="text-sm text-text-link hover:underline no-underline"
        >
          ← Back to overview
        </Link>
      </div>
    </div>
  );
}
