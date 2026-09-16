import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names:
 * - `clsx` handles conditionals (falsy values are dropped);
 * - `tailwind-merge` resolves conflicting utilities (last one wins).
 *
 * Example: cn("px-2", extra && "px-4")   // -> "px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}