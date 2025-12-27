/**
 * Validation Utilities
 * Helper functions for validating data with Zod schemas
 */

import { ZodError, ZodSchema } from 'zod';

// Re-export all schemas for convenience
export * from './schemas';

// ============================================================================
// Types
// ============================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: ValidationError;
}

export interface ValidationError {
  message: string;
  details: ValidationErrorDetail[];
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert Zod error to user-friendly format
 */
function formatZodError(error: ZodError): ValidationError {
  const details = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  // Create a summary message
  const message =
    details.length === 1
      ? details[0].message
      : `Validation failed: ${details.map((detail) => detail.message).join('; ')}`;

  return { message, details };
}

/**
 * Validate data against a Zod schema
 * Returns a ValidationResult with either the validated data or error details
 *
 * @example
 * const result = validate(createTaskSchema, { title: 'My Task' });
 * if (result.success) {
 *   console.log('Valid:', result.data);
 * } else {
 *   console.error('Invalid:', result.error.message);
 * }
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (err) {
    if (err instanceof ZodError) {
      return { success: false, error: formatZodError(err) };
    }
    return {
      success: false,
      error: {
        message: 'Unknown validation error',
        details: [],
      },
    };
  }
}

/**
 * Validate data and throw if invalid
 * Use this when you want validation to halt execution on failure
 *
 * @throws {Error} with user-friendly message if validation fails
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = validate(schema, data);
  if (!result.success) {
    throw new Error(result.error?.message || 'Validation failed');
  }
  return result.data as T;
}

/**
 * Validate data and return null if invalid
 * Use this for optional/lenient validation scenarios
 */
export function validateOrNull<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = validate(schema, data);
  return result.success ? (result.data as T) : null;
}

/**
 * Safe parse that returns the original data on failure
 * Useful for migrations or handling legacy data
 */
export function validateWithFallback<T>(schema: ZodSchema<T>, data: T): T {
  const result = validate(schema, data);
  return result.success ? (result.data as T) : data;
}

/**
 * Check if data is valid without parsing
 */
export function isValid<T>(schema: ZodSchema<T>, data: unknown): boolean {
  return validate(schema, data).success;
}

/**
 * Get validation errors without throwing
 */
export function getValidationErrors<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationErrorDetail[] {
  const result = validate(schema, data);
  return result.error?.details || [];
}

// ============================================================================
// Specialized Validators
// ============================================================================

/**
 * Validate an array of items, returning valid items and errors separately
 */
export function validateArray<T>(
  schema: ZodSchema<T>,
  items: unknown[]
): { valid: T[]; errors: Array<{ index: number; error: ValidationError }> } {
  const valid: T[] = [];
  const errors: Array<{ index: number; error: ValidationError }> = [];

  items.forEach((item, index) => {
    const result = validate(schema, item);
    if (result.success) {
      valid.push(result.data as T);
    } else {
      errors.push({ index, error: result.error! });
    }
  });

  return { valid, errors };
}

/**
 * Create a validation wrapper for async database operations
 * Validates input before passing to the operation function
 */
export function withValidation<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  operation: (data: TInput) => Promise<TOutput>
): (data: unknown) => Promise<TOutput> {
  return async (data: unknown) => {
    const validated = validateOrThrow(schema, data);
    return operation(validated);
  };
}
