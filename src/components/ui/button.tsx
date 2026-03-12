"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outlined" | "ghost";
export type ButtonColor = "primary" | "secondary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Props for the Button component.
 * @see Button
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Base: Inter Medium, 5px radius, no uppercase — matches Bento Button spec
const base =
  "inline-flex items-center justify-center font-medium leading-none rounded-[5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none cursor-pointer select-none whitespace-nowrap";

const sizes: Record<ButtonSize, string> = {
  // Small: 32px height, 12px h-pad, 13px text, 6px icon gap
  sm: "h-8 px-3 text-[13px] gap-1.5",
  // Medium (default): 44px height, 20px h-pad, 14px text, 8px icon gap
  md: "h-11 px-5 text-[14px] gap-2",
  // Large: same shape as md but slightly more padding
  lg: "h-12 px-6 text-[14px] gap-2",
};

// Icon size matches Figma: 18×18px
const iconSize = "h-[18px] w-[18px] shrink-0";

const variants: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    // Primary: blue-100 fill → grey-60 when disabled (Figma "Inactive" state)
    primary:
      "bg-blue-100 text-white hover:bg-blue-dark focus-visible:ring-blue-100 disabled:bg-grey-60 disabled:text-white dark:bg-blue-100 dark:hover:bg-blue-dark",
    // Secondary solid: neutral fill
    secondary:
      "bg-grey-10 text-grey-100 hover:bg-grey-20 focus-visible:ring-grey-30 disabled:bg-grey-10 disabled:text-grey-50 dark:bg-grey-90 dark:text-grey-10 dark:hover:bg-grey-80",
    // Danger solid: red fill
    danger:
      "bg-red-100 text-white hover:bg-red-100/90 focus-visible:ring-red-100 disabled:bg-grey-60 disabled:text-white",
  },
  outlined: {
    // Secondary (outlined primary): blue-100 border → grey-60 border when inactive
    primary:
      "border border-blue-100 text-blue-100 bg-transparent hover:bg-blue-5 focus-visible:ring-blue-100 disabled:border-grey-60 disabled:text-grey-60 dark:border-blue-50 dark:text-blue-50 dark:hover:bg-blue-100/10",
    // Outlined secondary: grey border
    secondary:
      "border border-grey-30 text-grey-100 bg-transparent hover:bg-grey-5 focus-visible:ring-grey-30 disabled:border-grey-20 disabled:text-grey-40 dark:border-grey-70 dark:text-grey-10 dark:hover:bg-grey-100/30",
    // Delete / Danger outlined: red border (matches Figma "Delete w Icon")
    danger:
      "border border-red-100 text-red-100 bg-transparent hover:bg-red-5 focus-visible:ring-red-100 disabled:border-grey-60 disabled:text-grey-60",
  },
  ghost: {
    // Ghost list item: dashed grey border (matches Figma "Ghost / List Item")
    primary:
      "border border-dashed border-grey-30 text-grey-70 bg-transparent hover:bg-grey-5 hover:border-blue-100 hover:text-blue-100 focus-visible:ring-blue-100 disabled:border-grey-20 disabled:text-grey-40",
    secondary:
      "text-grey-70 bg-transparent hover:bg-grey-5 hover:text-text-primary focus-visible:ring-grey-30 disabled:text-grey-40 dark:text-grey-50 dark:hover:bg-grey-90 dark:hover:text-grey-10",
    danger:
      "text-red-100 bg-transparent hover:bg-red-5 focus-visible:ring-red-100 disabled:text-grey-60",
  },
};

/**
 * Primary action trigger for all clickable actions in Atlas UI.
 *
 * Matches the NinjaCat Bento design system: 5px radius, Inter Medium, 44px (md) / 32px (sm).
 * Disabled state uses grey-60 fill/border — not opacity — matching Figma's "Inactive" state.
 *
 * Use `solid` for the main CTA, `outlined` for secondary actions,
 * `ghost` for low-emphasis tertiary / ghost list items.
 *
 * @example
 * // Primary CTA
 * <Button variant="solid" color="primary">Save Changes</Button>
 *
 * // Cancel action
 * <Button variant="outlined" color="primary">Cancel</Button>
 *
 * // Destructive
 * <Button variant="outlined" color="danger" leftIcon={<Trash2 />}>Delete</Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 */
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
      {...props}
      aria-busy={loading}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} aria-hidden="true" />
      ) : (
        leftIcon && (
          <span className={iconSize} aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}
      {children}
      {!loading && rightIcon && (
        <span className={iconSize} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
