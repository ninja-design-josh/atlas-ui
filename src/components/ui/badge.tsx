import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple";
export type BadgeSize = "sm" | "md";

/**
 * Props for the Badge component.
 * @see Badge
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  status?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-grey-10 text-grey-70 dark:bg-grey-90 dark:text-grey-40",
  success: "bg-green-5 text-green-100",
  warning: "bg-yellow-10 text-yellow-dark",
  error:   "bg-red-5 text-red-100",
  info:    "bg-blue-5 text-blue-100",
  purple:  "bg-purple-5 text-purple-100",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-grey-50",
  success: "bg-green-100",
  warning: "bg-yellow-100",
  error:   "bg-red-100",
  info:    "bg-blue-100",
  purple:  "bg-purple-100",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2   py-0.5 text-xs",
};

/**
 * Small status or label indicator. Use `variant` to convey semantic meaning.
 *
 * Set `status={true}` to add `role="status"` for live-region announcements
 * (e.g., a count that updates dynamically).
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" dot>3 errors</Badge>
 * <Badge variant="info" status>Loading...</Badge>
 */
export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  status = false,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      role={status ? "status" : undefined}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
