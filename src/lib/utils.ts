/**
 * A utility function for combining class names
 * This replaces the functionality of clsx and tailwind-merge
 */
export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(' ');
}
