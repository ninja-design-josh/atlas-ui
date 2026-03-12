import * as React from "react";
import { cn } from "@/lib/utils";

interface ComponentSectionProps {
  id: string;
  name: string;
  description: string;
  whenToUse?: string[];
  children: React.ReactNode;
  className?: string;
}

export function ComponentSection({
  id,
  name,
  description,
  whenToUse,
  children,
  className,
}: ComponentSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 py-10 border-b border-grey-10 dark:border-grey-90 last:border-0",
        className
      )}
    >
      <h2 className="text-2xl font-bold text-grey-100 dark:text-grey-10 mb-1">{name}</h2>
      <p className="text-grey-70 dark:text-grey-50 mb-5">{description}</p>
      {whenToUse && whenToUse.length > 0 && (
        <div className="mb-6 p-4 bg-blue-5 dark:bg-blue-100/10 rounded-sm border border-blue-10 dark:border-blue-100/20">
          <p className="text-overline text-blue-100 dark:text-blue-50 mb-2">When to use</p>
          <ul className="space-y-1.5">
            {whenToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-grey-70 dark:text-grey-50">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-100/40 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
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
