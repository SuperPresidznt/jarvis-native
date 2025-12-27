/**
 * Calendar Repository
 * Wraps database operations for calendar events with a clean interface
 */

import type { IRepository } from './IRepository';
import * as calendarDb from '../database/calendar';
import type {
  CalendarEvent,
  CreateEventData,
  UpdateEventData,
  EventConflict,
} from '../database/calendar';

/**
 * Calendar repository interface
 */
export interface ICalendarRepository
  extends IRepository<CalendarEvent, CreateEventData, UpdateEventData> {
  // Query methods
  getByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]>;
  getByDate(date: string): Promise<CalendarEvent[]>;
  getUpcoming(days?: number): Promise<CalendarEvent[]>;
  search(query: string): Promise<CalendarEvent[]>;

  // Stats
  getTodayCount(): Promise<number>;

  // Conflict detection
  detectConflicts(
    startTime: string,
    endTime: string,
    excludeEventId?: string,
    isAllDay?: boolean
  ): Promise<EventConflict[]>;

  // Utility
  formatTimeRange(startTime: string, endTime: string): string;
}

/**
 * Calendar Repository Implementation
 */
class CalendarRepositoryImpl implements ICalendarRepository {
  async getAll(): Promise<CalendarEvent[]> {
    return calendarDb.getEvents();
  }

  async getById(id: string): Promise<CalendarEvent | null> {
    return calendarDb.getEvent(id);
  }

  async create(data: CreateEventData): Promise<CalendarEvent> {
    return calendarDb.createEvent(data);
  }

  async update(id: string, data: UpdateEventData): Promise<CalendarEvent> {
    return calendarDb.updateEvent(id, data);
  }

  async delete(id: string): Promise<void> {
    return calendarDb.deleteEvent(id);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    return calendarDb.getEventsByDateRange(startDate, endDate);
  }

  async getByDate(date: string): Promise<CalendarEvent[]> {
    return calendarDb.getEventsByDate(date);
  }

  async getUpcoming(days: number = 7): Promise<CalendarEvent[]> {
    return calendarDb.getUpcomingEvents(days);
  }

  async search(query: string): Promise<CalendarEvent[]> {
    return calendarDb.searchEvents(query);
  }

  async getTodayCount(): Promise<number> {
    return calendarDb.getTodayEventsCount();
  }

  async detectConflicts(
    startTime: string,
    endTime: string,
    excludeEventId?: string,
    isAllDay: boolean = false
  ): Promise<EventConflict[]> {
    return calendarDb.detectConflicts(startTime, endTime, excludeEventId, isAllDay);
  }

  formatTimeRange(startTime: string, endTime: string): string {
    return calendarDb.formatEventTimeRange(startTime, endTime);
  }
}

// Singleton instance
export const CalendarRepository: ICalendarRepository = new CalendarRepositoryImpl();

// Re-export types for convenience
export type {
  CalendarEvent,
  CreateEventData,
  UpdateEventData,
  EventConflict,
} from '../database/calendar';
