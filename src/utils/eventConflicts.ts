/**
 * Event Conflict Detection Utilities
 * Helper functions for detecting and managing calendar event conflicts
 */

export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * Check if two time ranges overlap
 * @param range1 - First time range
 * @param range2 - Second time range
 * @returns true if ranges overlap, false otherwise
 */
export function hasTimeOverlap(range1: TimeRange, range2: TimeRange): boolean {
  // Two ranges overlap if:
  // range1.start < range2.end AND range2.start < range1.end
  return range1.start < range2.end && range2.start < range1.end;
}

/**
 * Find all conflicting events for a given event
 * @param newEvent - Event to check for conflicts (with optional id for editing)
 * @param existingEvents - Array of existing events to check against
 * @returns Array of conflicting events
 */
export function findConflictingEvents<T extends { id: string; start: Date; end: Date }>(
  newEvent: { start: Date; end: Date; id?: string },
  existingEvents: T[]
): T[] {
  return existingEvents.filter(existing => {
    // Don't compare with itself when editing
    if (newEvent.id && existing.id === newEvent.id) return false;

    return hasTimeOverlap(
      { start: newEvent.start, end: newEvent.end },
      { start: existing.start, end: existing.end }
    );
  });
}

/**
 * Format conflict count for display
 * @param conflicts - Number of conflicts
 * @returns Formatted string (e.g., "1 conflict" or "3 conflicts")
 */
export function formatConflictWarning(conflicts: number): string {
  if (conflicts === 0) return '';
  if (conflicts === 1) return '1 conflict';
  return `${conflicts} conflicts`;
}

/**
 * Calculate overlap duration in minutes between two time ranges
 * @param range1 - First time range
 * @param range2 - Second time range
 * @returns Overlap duration in minutes, or 0 if no overlap
 */
export function calculateOverlapMinutes(range1: TimeRange, range2: TimeRange): number {
  if (!hasTimeOverlap(range1, range2)) return 0;

  const overlapStart = new Date(Math.max(range1.start.getTime(), range2.start.getTime()));
  const overlapEnd = new Date(Math.min(range1.end.getTime(), range2.end.getTime()));

  return Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60));
}

/**
 * Get overlap window for two time ranges
 * @param range1 - First time range
 * @param range2 - Second time range
 * @returns Overlap time range, or null if no overlap
 */
export function getOverlapWindow(range1: TimeRange, range2: TimeRange): TimeRange | null {
  if (!hasTimeOverlap(range1, range2)) return null;

  return {
    start: new Date(Math.max(range1.start.getTime(), range2.start.getTime())),
    end: new Date(Math.min(range1.end.getTime(), range2.end.getTime())),
  };
}
