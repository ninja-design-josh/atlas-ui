import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

/**
 * Props for the Avatar component.
 * @see Avatar
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  alt?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-14 w-14 text-base",
};

/**
 * User avatar — shows image, initials, or a generic person icon as fallback.
 *
 * Always provide `alt` for accessibility. When no image is shown, `alt`
 * becomes the `aria-label` on the container element.
 *
 * @example
 * <Avatar src="/users/josh.jpg" alt="Josh Brinksman" size="md" />
 * <Avatar initials="JB" alt="Josh Brinksman" size="lg" />
 * <Avatar alt="Unknown user" size="sm" />
 */
export function Avatar({
  src,
  initials,
  alt = "",
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;

  return (
    <div
      className={cn(
        "relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-grey-10 dark:bg-grey-90",
        sizeStyles[size],
        className
      )}
      aria-label={showFallback && alt ? alt : undefined}
      role={showFallback && alt ? "img" : undefined}
      {...props}
    >
      {!showFallback && (
        <Image
          src={src!}
          alt={alt}
          fill
          onError={() => setImgError(true)}
          className="object-cover"
        />
      )}
      {showFallback && initials && (
        <span className="font-semibold text-grey-70 dark:text-grey-40 leading-none uppercase">
          {initials.slice(0, 2)}
        </span>
      )}
      {showFallback && !initials && (
        <svg
          className="h-3/4 w-3/4 text-grey-40"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}
    </div>
  );
}
