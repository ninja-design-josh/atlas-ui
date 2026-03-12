import * as React from "react";
import { cn } from "@/lib/utils";

export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardElevation = 0 | 1 | 2 | 4 | 8;

/**
 * Props for the Card component.
 * @see Card
 */
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

/**
 * Surface container for grouping related content. Compose with
 * CardHeader, CardTitle, CardDescription, and CardFooter.
 *
 * @example
 * <Card padding="md" border elevation={1}>
 *   <CardHeader>
 *     <CardTitle>Settings</CardTitle>
 *     <CardDescription>Manage your account preferences.</CardDescription>
 *   </CardHeader>
 *   <CardFooter>
 *     <Button variant="outlined" color="secondary">Cancel</Button>
 *     <Button variant="solid" color="primary">Save</Button>
 *   </CardFooter>
 * </Card>
 */
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
        "rounded-sm bg-surface-raised",
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

/** Props for the CardHeader component. */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
/** Props for the CardTitle component. */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
/** Props for the CardDescription component. */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
/** Props for the CardFooter component. */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Header region of a Card. Adds bottom margin to separate from content. */
export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

/** Primary heading for a Card. Renders as an `<h3>`. */
export function CardTitle({
  children,
  className,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn("text-base font-semibold text-grey-100 dark:text-grey-10", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/** Secondary descriptive text below CardTitle. */
export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-grey-70 dark:text-grey-50 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/** Footer region of a Card. Lays out actions in a row with gap. */
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn("mt-4 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
