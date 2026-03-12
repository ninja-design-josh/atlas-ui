import * as React from "react";
import { cn } from "@/lib/utils";

export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardElevation = 0 | 1 | 2 | 4 | 8;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  border?: boolean;
  elevation?: CardElevation;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-8",
};

const elevationStyles: Record<CardElevation, string> = {
  0: "",
  1: "shadow-elevation-1",
  2: "shadow-elevation-2",
  4: "shadow-elevation-4",
  8: "shadow-elevation-8",
};

export function Card({
  padding = "md",
  border = true,
  elevation = 0,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-sm bg-white dark:bg-grey-110",
        border && "border border-grey-10 dark:border-grey-90",
        paddingStyles[padding],
        elevationStyles[elevation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-grey-100 dark:text-grey-10", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-grey-70 dark:text-grey-50 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
