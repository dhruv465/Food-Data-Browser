"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component - Displays a small badge with various styles
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Badge style variant (default, secondary, destructive, outline)
 * @param {React.ReactNode} props.children - Badge content
 * @returns {JSX.Element} - Badge component
 */
const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
        variant === "default" && "border-transparent bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
        variant === "secondary" && "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        variant === "destructive" && "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
        variant === "outline" && "text-zinc-950 dark:text-zinc-50",
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };