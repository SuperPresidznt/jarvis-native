/**
 * Zod Validation Schemas
 * Centralized input validation for all database entities
 */

import { z } from 'zod';

// ============================================================================
// Common/Shared Schemas
// ============================================================================

/**
 * ISO date string (YYYY-MM-DD)
 */
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)')
  .optional();

/**
 * ISO datetime string
 */
export const datetimeStringSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO datetime' })
  .optional();

/**
 * Time string (HH:MM or HH:MM:SS)
 */
export const timeStringSchema = z
  .string()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Must be a valid time (HH:MM or HH:MM:SS)')
  .optional();

/**
 * Hex color (#RRGGBB or #RGB)
 */
export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Must be a valid hex color')
  .optional();

/**
 * Recurrence rule schema
 */
export const recurrenceRuleSchema = z
  .object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().int().positive().optional(),
    endDate: z.string().optional(),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    dayOfMonth: z.number().int().min(1).max(31).optional(),
  })
  .optional();

// ============================================================================
// Task Schemas
// ============================================================================

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'blocked', 'completed', 'cancelled']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must be 500 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional(),
  status: taskStatusSchema.optional().default('todo'),
  priority: taskPrioritySchema.optional().default('medium'),
  effort: z.number().int().min(1).max(10).optional(),
  impact: z.number().int().min(1).max(10).optional(),
  dueDate: dateStringSchema,
  projectId: z.string().uuid().optional(),
  tags: z.array(z.string().max(100)).max(20).optional(),
  recurrence: recurrenceRuleSchema,
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completedAt: datetimeStringSchema,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// ============================================================================
// Habit Schemas
// ============================================================================

export const habitCadenceSchema = z.enum(['daily', 'weekly', 'monthly']);

export const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  cadence: habitCadenceSchema.optional().default('daily'),
  targetCount: z.number().int().min(1).max(100).optional().default(1),
  reminderTime: timeStringSchema,
});

export const updateHabitSchema = createHabitSchema.partial().extend({
  currentStreak: z.number().int().min(0).optional(),
  longestStreak: z.number().int().min(0).optional(),
  notificationId: z.string().optional(),
});

export const logHabitCompletionSchema = z.object({
  habitId: z.string().min(1, 'Habit ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'),
  completed: z.boolean(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type LogHabitCompletionInput = z.infer<typeof logHabitCompletionSchema>;

// ============================================================================
// Project Schemas
// ============================================================================

export const projectStatusSchema = z.enum(['active', 'archived', 'completed']);

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional(),
  color: hexColorSchema,
  status: projectStatusSchema.optional().default('active'),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ============================================================================
// Transaction (Finance) Schemas
// ============================================================================

export const transactionTypeSchema = z.enum(['income', 'expense']);

export const createTransactionSchema = z.object({
  type: transactionTypeSchema,
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999999.99, 'Amount is too large'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be 100 characters or less'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .optional()
    .default('USD'),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

// ============================================================================
// Asset Schemas
// ============================================================================

export const createAssetSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  type: z
    .string()
    .min(1, 'Type is required')
    .max(100, 'Type must be 100 characters or less'),
  value: z
    .number()
    .min(0, 'Value cannot be negative')
    .max(999999999999.99, 'Value is too large'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .optional()
    .default('USD'),
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

// ============================================================================
// Liability Schemas
// ============================================================================

export const createLiabilitySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  type: z
    .string()
    .min(1, 'Type is required')
    .max(100, 'Type must be 100 characters or less'),
  amount: z
    .number()
    .min(0, 'Amount cannot be negative')
    .max(999999999999.99, 'Amount is too large'),
  interestRate: z
    .number()
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate cannot exceed 100%')
    .optional(),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .optional()
    .default('USD'),
});

export const updateLiabilitySchema = createLiabilitySchema.partial();

export type CreateLiabilityInput = z.infer<typeof createLiabilitySchema>;
export type UpdateLiabilityInput = z.infer<typeof updateLiabilitySchema>;

// ============================================================================
// Calendar Event Schemas
// ============================================================================

export const createCalendarEventSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(500, 'Title must be 500 characters or less'),
    description: z
      .string()
      .max(5000, 'Description must be 5000 characters or less')
      .optional(),
    startTime: z.string().datetime({ message: 'Start time must be a valid ISO datetime' }),
    endTime: z.string().datetime({ message: 'End time must be a valid ISO datetime' }),
    location: z
      .string()
      .max(500, 'Location must be 500 characters or less')
      .optional(),
    attendees: z.array(z.string().email('Each attendee must be a valid email')).max(100).optional(),
    isAllDay: z.boolean().optional().default(false),
    recurrence: recurrenceRuleSchema,
    reminderMinutes: z
      .number()
      .int()
      .min(0, 'Reminder cannot be negative')
      .max(40320, 'Reminder cannot exceed 4 weeks')
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end >= start;
    },
    {
      message: 'End time must be after or equal to start time',
      path: ['endTime'],
    }
  );

export const updateCalendarEventSchema = createCalendarEventSchema.partial();

export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
export type UpdateCalendarEventInput = z.infer<typeof updateCalendarEventSchema>;

// ============================================================================
// Goal Schemas
// ============================================================================

export const goalStatusSchema = z.enum(['active', 'completed', 'archived']);

export const createGoalSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional(),
  targetDate: dateStringSchema,
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  status: goalStatusSchema.optional(),
});

export const createMilestoneSchema = z.object({
  goalId: z.string().min(1, 'Goal ID is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must be 500 characters or less'),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
