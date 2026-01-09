/**
 * Parse duration input string to seconds
 * Supports formats:
 * - "mm:ss" (e.g., "5:30" = 330 seconds)
 * - "m" (e.g., "5" = 300 seconds, treated as minutes)
 * - Returns null if input is empty or invalid
 */
export function parseDuration(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check for mm:ss format
  const colonMatch = trimmed.match(/^(\d+):(\d{1,2})$/);
  if (colonMatch) {
    const minutes = parseInt(colonMatch[1], 10);
    const seconds = parseInt(colonMatch[2], 10);
    if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) return null;
    return minutes * 60 + seconds;
  }

  // Check for plain number (treat as minutes)
  const numberMatch = trimmed.match(/^\d+$/);
  if (numberMatch) {
    const minutes = parseInt(trimmed, 10);
    if (isNaN(minutes)) return null;
    return minutes * 60;
  }

  return null;
}

/**
 * Format seconds to mm:ss string
 * Returns empty string if seconds is null or invalid
 */
export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return '';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
