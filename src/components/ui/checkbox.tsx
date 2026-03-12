"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  description?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled,
  id,
  onChange,
  className,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center mt-0.5">
        <input
          id={checkboxId}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer h-5 w-5 appearance-none rounded border border-grey-30 bg-white transition-colors
            checked:bg-blue-100 checked:border-blue-100
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-1
            disabled:cursor-not-allowed disabled:opacity-50
            dark:bg-grey-110 dark:border-grey-70
            dark:checked:bg-blue-100 dark:checked:border-blue-100
            cursor-pointer"
          aria-describedby={description ? `${checkboxId}-desc` : undefined}
          {...props}
          type="checkbox"
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 stroke-[3]"
          aria-hidden="true"
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium text-grey-100 dark:text-grey-10 leading-none cursor-pointer",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${checkboxId}-desc`}
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
