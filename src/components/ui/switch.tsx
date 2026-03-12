"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the Switch component.
 * @see Switch
 */
export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * Toggle switch for boolean settings. Supports controlled and uncontrolled modes.
 *
 * `onChange` receives the boolean checked value directly.
 * Uses `role="switch"` and `aria-checked` for full screen reader support.
 *
 * @example
 * // Uncontrolled
 * <Switch label="Email notifications" description="Receive updates by email." />
 *
 * // Controlled
 * <Switch label="Dark mode" checked={darkMode} onChange={setDarkMode} />
 */
export function Switch({
  label,
  description,
  checked,
  defaultChecked,
  disabled,
  id,
  onChange,
  className,
  ...props
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false
  );

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  function handleChange() {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <button
        id={switchId}
        type="button"
        role="switch"
        {...props}
        aria-checked={isChecked}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        aria-describedby={description ? `${switchId}-desc` : undefined}
        disabled={disabled}
        onClick={handleChange}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isChecked
            ? "bg-blue-100"
            : "bg-grey-30 dark:bg-grey-70"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
            isChecked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              id={`${switchId}-label`}
              className={cn(
                "text-sm font-medium text-grey-100 dark:text-grey-10 leading-none cursor-pointer",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={handleChange}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${switchId}-desc`}
              className="text-[11px] text-grey-70 dark:text-grey-50"
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
