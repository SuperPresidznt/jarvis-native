/**
 * Calendar API Service
 * Handles calendar events and syncing
 */

import apiService from './api';

export interface CalendarEvent {
  id: string;
  calendarSyncId: string;
  userId: string;
  externalId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  linkedTaskId?: string;
  linkedHabitId?: string;
  linkedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSync {
  id: string;
  userId: string;
  provider: string;
  calendarId: string;
  syncEnabled: boolean;
  lastSyncAt?: string;
  nextSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
}

export const calendarApi = {
  /**
   * Get all calendar events
   */
  getEvents: (startDate?: string, endDate?: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    const queryString = params.toString();
    return apiService.get<CalendarEvent[]>(`/api/calendar/events${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Create a calendar event
   */
  createEvent: (data: CreateEventData): Promise<CalendarEvent> => {
    return apiService.post<CalendarEvent>('/api/calendar/events', data);
  },

  /**
   * Update a calendar event
   */
  updateEvent: (id: string, data: Partial<CreateEventData>): Promise<CalendarEvent> => {
    return apiService.patch<CalendarEvent>(`/api/calendar/events/${id}`, data);
  },

  /**
   * Delete a calendar event
   */
  deleteEvent: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/calendar/events/${id}`);
  },

  /**
   * Get calendar sync settings
   */
  getSyncSettings: (): Promise<CalendarSync[]> => {
    return apiService.get<CalendarSync[]>('/api/calendar/sync');
  },

  /**
   * Trigger a calendar sync
   */
  triggerSync: (): Promise<{ success: boolean; message: string }> => {
    return apiService.post<{ success: boolean; message: string }>('/api/calendar/sync', {});
  },
};

export default calendarApi;
