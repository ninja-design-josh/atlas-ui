"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  label,
  hint,
  error,
  id,
  rows = 4,
  className,
  disabled,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-normal text-grey-70 dark:text-grey-40"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-describedby={errorId ?? hintId}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-sm border px-3 py-2 text-sm text-grey-100 placeholder:text-grey-40 bg-white",
          "transition-colors resize-y",
          "focus:outline-none focus:border-blue-100",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-5",
          "dark:bg-grey-110 dark:text-grey-10 dark:placeholder:text-grey-60 dark:border-grey-80",
          "dark:focus:border-blue-50",
          error
            ? "border-red-100 focus:border-red-100"
            : "border-grey-20",
          className
        )}
        {...props}
      />
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
