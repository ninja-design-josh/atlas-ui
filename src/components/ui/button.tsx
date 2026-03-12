"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outlined" | "ghost";
export type ButtonColor = "primary" | "secondary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wide rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none min-w-16";

const sizes: Record<ButtonSize, string> = {
  sm: "h-8  px-3  text-xs",
  md: "h-10 px-4  text-sm",
  lg: "h-11 px-5  text-sm",
};

const variants: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary:
      "bg-blue-100 text-white hover:bg-blue-dark hover:shadow-elevation-2 focus-visible:ring-blue-100 dark:bg-blue-100 dark:hover:bg-blue-dark",
    secondary:
      "bg-grey-10 text-grey-100 hover:bg-grey-20 hover:shadow-elevation-1 focus-visible:ring-grey-30 dark:bg-grey-90 dark:text-grey-10 dark:hover:bg-grey-80",
    danger:
      "bg-red-100 text-white hover:bg-red-100/90 hover:shadow-elevation-2 focus-visible:ring-red-100",
  },
  outlined: {
    primary:
      "border border-blue-100 text-blue-100 bg-transparent hover:bg-blue-5 focus-visible:ring-blue-100 dark:border-blue-50 dark:text-blue-50 dark:hover:bg-blue-100/10",
    secondary:
      "border border-grey-20 text-grey-100 bg-transparent hover:bg-grey-5 focus-visible:ring-grey-30 dark:border-grey-70 dark:text-grey-10 dark:hover:bg-grey-100/30",
    danger:
      "border border-red-100 text-red-100 bg-transparent hover:bg-red-5 focus-visible:ring-red-100",
  },
  ghost: {
    primary:
      "text-blue-100 bg-transparent hover:bg-blue-5 focus-visible:ring-blue-100 dark:text-blue-50 dark:hover:bg-blue-100/10",
    secondary:
      "text-grey-100 bg-transparent hover:bg-grey-5 focus-visible:ring-grey-30 dark:text-grey-10 dark:hover:bg-grey-90",
    danger:
      "text-red-100 bg-transparent hover:bg-red-5 focus-visible:ring-red-100",
  },
};

export function Button({
  variant = "solid",
  color = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant][color], className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon && (
          <span className="h-4 w-4" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}
      {children}
      {!loading && rightIcon && (
        <span className="h-4 w-4" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
