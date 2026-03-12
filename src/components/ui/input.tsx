"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the Input component.
 * @see Input
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

/**
 * Text input field with optional label, hint, error, and icon support.
 *
 * Generates unique IDs automatically — do not pass `id` unless you need
 * to reference it externally (e.g., for a custom label).
 *
 * @example
 * <Input label="Email" hint="We'll never share this." placeholder="you@example.com" />
 * <Input label="Username" error="Already taken." defaultValue="josh123" />
 * <Input leadingIcon={<Search />} placeholder="Search..." />
 */
export function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  id,
  className,
  disabled,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-normal text-grey-70 dark:text-grey-40"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 flex h-4 w-4 items-center justify-center text-grey-50 dark:text-grey-40">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          disabled={disabled}
          aria-describedby={errorId ?? hintId}
          aria-invalid={!!error}
          className={cn(
            "h-10 w-full rounded-sm border bg-white px-3 text-sm text-grey-100 placeholder:text-grey-40 transition-colors",
            "focus:outline-none focus:border-blue-100",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-5",
            "dark:bg-grey-110 dark:text-grey-10 dark:placeholder:text-grey-60 dark:border-grey-80",
            "dark:focus:border-blue-50",
            error
              ? "border-red-100 focus:border-red-100"
              : "border-grey-20",
            leadingIcon ? "pl-9" : "",
            trailingIcon ? "pr-9" : "",
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="pointer-events-none absolute right-3 flex h-4 w-4 items-center justify-center text-grey-50 dark:text-grey-40">
            {trailingIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-caption text-red-100" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className="text-caption text-grey-70 dark:text-grey-50">
          {hint}
        </p>
      )}
    </div>
  );
}
