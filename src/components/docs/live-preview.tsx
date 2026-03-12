import * as React from "react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  noPad?: boolean;
}

export function LivePreview({
  label,
  children,
  className,
  centered = true,
  noPad = false,
}: LivePreviewProps) {
  return (
    <div className={cn("rounded-sm border border-grey-10 dark:border-grey-90 overflow-hidden", className)}>
      {label && (
        <div className="px-4 py-2 bg-grey-5 dark:bg-grey-120 border-b border-grey-10 dark:border-grey-90">
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
    </div>
  );
}
