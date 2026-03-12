"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  id,
  className,
  disabled,
  ...props
}: SelectProps) {
  const selectId = id ?? React.useId();
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-normal text-grey-70 dark:text-grey-40"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          disabled={disabled}
          aria-describedby={errorId ?? hintId}
          aria-invalid={!!error}
          className={cn(
            "h-10 w-full appearance-none rounded-sm border bg-white px-3 pr-9 text-sm text-grey-100 transition-colors",
            "focus:outline-none focus:border-blue-100",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-5",
            "dark:bg-grey-110 dark:text-grey-10 dark:border-grey-80",
            "dark:focus:border-blue-50",
            error
              ? "border-red-100 focus:border-red-100"
              : "border-grey-20",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 h-4 w-4 text-grey-50 dark:text-grey-40"
          aria-hidden="true"
        />
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
