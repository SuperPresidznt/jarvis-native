/**
 * Date Utilities Unit Tests
 *
 * IMPROVEMENT: Added comprehensive unit tests for critical utility functions
 */

import {
  formatDueDate,
  getDaysUntil,
  isOverdue,
  formatRelativeDate,
  formatTimeAgo,
  getDateUrgency,
  isSameDay,
  getStartOfDay,
  getEndOfDay,
  addDays,
  subtractDays,
} from '../dateUtils';

describe('dateUtils', () => {
  // Use fixed date for consistent testing
  const NOW = new Date('2025-12-26T12:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('isOverdue', () => {
    it('returns true for past dates with non-completed status', () => {
      const yesterday = new Date(NOW);
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isOverdue(yesterday.toISOString(), 'todo')).toBe(true);
    });

    it('returns false for completed tasks regardless of date', () => {
      const yesterday = new Date(NOW);
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isOverdue(yesterday.toISOString(), 'completed')).toBe(false);
    });

    it('returns false for cancelled tasks', () => {
      const yesterday = new Date(NOW);
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isOverdue(yesterday.toISOString(), 'cancelled')).toBe(false);
    });

    it('returns false for future dates', () => {
      const tomorrow = new Date(NOW);
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isOverdue(tomorrow.toISOString(), 'todo')).toBe(false);
    });

    it('returns false for today', () => {
      expect(isOverdue(NOW.toISOString(), 'todo')).toBe(false);
    });

    it('returns false when no date is provided', () => {
      expect(isOverdue(undefined, 'todo')).toBe(false);
    });
  });

  describe('getDaysUntil', () => {
    it('returns 0 for today', () => {
      expect(getDaysUntil(NOW.toISOString())).toBe(0);
    });

    it('returns positive number for future dates', () => {
      const nextWeek = new Date(NOW);
      nextWeek.setDate(nextWeek.getDate() + 7);
      expect(getDaysUntil(nextWeek.toISOString())).toBe(7);
    });

    it('returns negative number for past dates', () => {
      const lastWeek = new Date(NOW);
      lastWeek.setDate(lastWeek.getDate() - 7);
      expect(getDaysUntil(lastWeek.toISOString())).toBe(-7);
    });

    it('returns null for undefined date', () => {
      expect(getDaysUntil(undefined)).toBeNull();
    });
  });

  describe('getDateUrgency', () => {
    it('returns "overdue" for past dates', () => {
      const yesterday = new Date(NOW);
      yesterday.setDate(yesterday.getDate() - 1);
      expect(getDateUrgency(yesterday.toISOString())).toBe('overdue');
    });

    it('returns "today" for today', () => {
      expect(getDateUrgency(NOW.toISOString())).toBe('today');
    });

    it('returns "tomorrow" for tomorrow', () => {
      const tomorrow = new Date(NOW);
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(getDateUrgency(tomorrow.toISOString())).toBe('tomorrow');
    });

    it('returns "this_week" for dates within 7 days', () => {
      const inFiveDays = new Date(NOW);
      inFiveDays.setDate(inFiveDays.getDate() + 5);
      expect(getDateUrgency(inFiveDays.toISOString())).toBe('this_week');
    });

    it('returns "future" for dates beyond 7 days', () => {
      const nextMonth = new Date(NOW);
      nextMonth.setDate(nextMonth.getDate() + 30);
      expect(getDateUrgency(nextMonth.toISOString())).toBe('future');
    });

    it('returns "none" for undefined date', () => {
      expect(getDateUrgency(undefined)).toBe('none');
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      const date1 = new Date('2025-12-26T08:00:00.000Z');
      const date2 = new Date('2025-12-26T20:00:00.000Z');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date('2025-12-26T12:00:00.000Z');
      const date2 = new Date('2025-12-27T12:00:00.000Z');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getStartOfDay', () => {
    it('returns midnight of the given date', () => {
      const date = new Date('2025-12-26T15:30:45.123Z');
      const startOfDay = getStartOfDay(date);
      expect(startOfDay.getHours()).toBe(0);
      expect(startOfDay.getMinutes()).toBe(0);
      expect(startOfDay.getSeconds()).toBe(0);
      expect(startOfDay.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('returns 23:59:59.999 of the given date', () => {
      const date = new Date('2025-12-26T15:30:45.123Z');
      const endOfDay = getEndOfDay(date);
      expect(endOfDay.getHours()).toBe(23);
      expect(endOfDay.getMinutes()).toBe(59);
      expect(endOfDay.getSeconds()).toBe(59);
      expect(endOfDay.getMilliseconds()).toBe(999);
    });
  });

  describe('addDays', () => {
    it('adds days correctly', () => {
      const date = new Date('2025-12-26T12:00:00.000Z');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(31);
    });

    it('handles month transitions', () => {
      const date = new Date('2025-12-30T12:00:00.000Z');
      const result = addDays(date, 5);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2026);
    });
  });

  describe('subtractDays', () => {
    it('subtracts days correctly', () => {
      const date = new Date('2025-12-26T12:00:00.000Z');
      const result = subtractDays(date, 5);
      expect(result.getDate()).toBe(21);
    });

    it('handles month transitions', () => {
      const date = new Date('2025-01-02T12:00:00.000Z');
      const result = subtractDays(date, 5);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getFullYear()).toBe(2024);
    });
  });

  describe('formatDueDate', () => {
    it('returns "Today" for today', () => {
      const result = formatDueDate(NOW.toISOString());
      expect(result).toBe('Today');
    });

    it('returns "Tomorrow" for tomorrow', () => {
      const tomorrow = new Date(NOW);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = formatDueDate(tomorrow.toISOString());
      expect(result).toBe('Tomorrow');
    });

    it('returns "Yesterday" for yesterday', () => {
      const yesterday = new Date(NOW);
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatDueDate(yesterday.toISOString());
      expect(result).toBe('Yesterday');
    });

    it('returns empty string for undefined date', () => {
      expect(formatDueDate(undefined)).toBe('');
    });
  });

  describe('formatRelativeDate', () => {
    it('returns "Just now" for very recent dates', () => {
      const fiveSecondsAgo = new Date(NOW);
      fiveSecondsAgo.setSeconds(fiveSecondsAgo.getSeconds() - 5);
      expect(formatRelativeDate(fiveSecondsAgo.toISOString())).toBe('Just now');
    });

    it('returns minutes for recent dates', () => {
      const tenMinutesAgo = new Date(NOW);
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
      expect(formatRelativeDate(tenMinutesAgo.toISOString())).toBe('10 minutes ago');
    });

    it('returns hours for same-day dates', () => {
      const threeHoursAgo = new Date(NOW);
      threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
      expect(formatRelativeDate(threeHoursAgo.toISOString())).toBe('3 hours ago');
    });
  });

  describe('formatTimeAgo', () => {
    it('handles seconds', () => {
      const thirtySecondsAgo = new Date(NOW);
      thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
      expect(formatTimeAgo(thirtySecondsAgo.toISOString())).toMatch(/seconds? ago/);
    });

    it('handles minutes', () => {
      const fiveMinutesAgo = new Date(NOW);
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      expect(formatTimeAgo(fiveMinutesAgo.toISOString())).toMatch(/5 minutes? ago/);
    });

    it('handles hours', () => {
      const twoHoursAgo = new Date(NOW);
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      expect(formatTimeAgo(twoHoursAgo.toISOString())).toMatch(/2 hours? ago/);
    });

    it('handles days', () => {
      const threeDaysAgo = new Date(NOW);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      expect(formatTimeAgo(threeDaysAgo.toISOString())).toMatch(/3 days? ago/);
    });
  });
});
