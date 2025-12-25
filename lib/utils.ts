import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random 5-character URL code
 * Format: lowercase letters and numbers only (a-z, 0-9)
 */
export function generateUrlCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

/**
 * Generate a lure URL from ID and URL code
 * Format: /lures/123-a3k9x
 */
export function generateLureUrl(id: number, urlCode: string): string {
  return `/lures/${id}-${urlCode}`;
}

/**
 * Parse a lure URL slug to extract ID and code
 * Expected format: "123-a3k9x"
 */
export function parseLureUrl(slug: string): { id: number; code: string } | null {
  const match = slug.match(/^(\d+)-([a-z0-9]{5})$/);
  if (!match) return null;

  return {
    id: parseInt(match[1], 10),
    code: match[2],
  };
}

/**
 * Generate a hook URL from ID and URL code
 * Format: /hooks/456-k7m2p
 */
export function generateHookUrl(id: number, urlCode: string): string {
  return `/hooks/${id}-${urlCode}`;
}

/**
 * Parse a hook URL slug to extract ID and code
 * Expected format: "456-k7m2p"
 */
export function parseHookUrl(slug: string): { id: number; code: string } | null {
  const match = slug.match(/^(\d+)-([a-z0-9]{5})$/);
  if (!match) return null;

  return {
    id: parseInt(match[1], 10),
    code: match[2],
  };
}
