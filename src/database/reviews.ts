/**
 * Reviews Database Operations
 * CRUD operations for review history with offline-first support
 */

import {
  generateId,
  getCurrentTimestamp,
  executeQuery,
  executeQuerySingle,
  executeWrite,
} from './index';
import type { ReviewData, Review } from '../types';

export type ReviewType = 'weekly' | 'monthly' | 'custom';

interface ReviewRow {
  id: string;
  review_type: ReviewType;
  period_start: string;
  period_end: string;
  data: string;
  insights?: string;
  exported: number;
  created_at: string;
  synced: number;
}

export interface CreateReviewData {
  reviewType: ReviewType;
  periodStart: string;
  periodEnd: string;
  data: ReviewData;
  insights?: string;
}

export interface ReviewFilters {
  reviewType?: ReviewType;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Convert database row to Review object
 */
function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    reviewType: row.review_type,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    data: JSON.parse(row.data),
    insights: row.insights ? JSON.parse(row.insights) : undefined,
    exported: row.exported === 1,
    createdAt: row.created_at,
    synced: row.synced === 1,
  };
}

/**
 * Create a new review
 */
export async function createReview(reviewData: CreateReviewData): Promise<Review> {
  const id = generateId();
  const now = getCurrentTimestamp();

  await executeWrite(
    `INSERT INTO review_history
     (id, review_type, period_start, period_end, data, insights, exported, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      reviewData.reviewType,
      reviewData.periodStart,
      reviewData.periodEnd,
      JSON.stringify(reviewData.data),
      reviewData.insights ? JSON.stringify(reviewData.insights) : null,
      0,
      now,
      0,
    ]
  );

  return {
    id,
    reviewType: reviewData.reviewType,
    periodStart: reviewData.periodStart,
    periodEnd: reviewData.periodEnd,
    data: reviewData.data,
    insights: reviewData.insights ? JSON.parse(reviewData.insights) : undefined,
    exported: false,
    createdAt: now,
    synced: false,
  };
}

/**
 * Get all reviews with optional filters
 */
export async function getReviews(filters?: ReviewFilters): Promise<Review[]> {
  let query = 'SELECT * FROM review_history WHERE 1=1';
  const params: any[] = [];

  if (filters?.reviewType) {
    query += ' AND review_type = ?';
    params.push(filters.reviewType);
  }

  if (filters?.dateFrom) {
    query += ' AND period_start >= ?';
    params.push(filters.dateFrom);
  }

  if (filters?.dateTo) {
    query += ' AND period_end <= ?';
    params.push(filters.dateTo);
  }

  query += ' ORDER BY created_at DESC';

  const rows = await executeQuery<ReviewRow>(query, params);
  return rows.map(rowToReview);
}

/**
 * Get a single review by ID
 */
export async function getReviewById(id: string): Promise<Review | null> {
  const row = await executeQuerySingle<ReviewRow>(
    'SELECT * FROM review_history WHERE id = ?',
    [id]
  );

  return row ? rowToReview(row) : null;
}

/**
 * Update review exported status
 */
export async function markReviewAsExported(id: string): Promise<void> {
  await executeWrite(
    'UPDATE review_history SET exported = 1 WHERE id = ?',
    [id]
  );
}

/**
 * Delete a review
 */
export async function deleteReview(id: string): Promise<void> {
  await executeWrite('DELETE FROM review_history WHERE id = ?', [id]);
}

/**
 * Get the most recent review of a specific type
 */
export async function getLatestReview(reviewType: ReviewType): Promise<Review | null> {
  const row = await executeQuerySingle<ReviewRow>(
    `SELECT * FROM review_history
     WHERE review_type = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [reviewType]
  );

  return row ? rowToReview(row) : null;
}

/**
 * Get reviews count by type
 */
export async function getReviewsCount(reviewType?: ReviewType): Promise<number> {
  let query = 'SELECT COUNT(*) as count FROM review_history';
  const params: any[] = [];

  if (reviewType) {
    query += ' WHERE review_type = ?';
    params.push(reviewType);
  }

  const result = await executeQuerySingle<{ count: number }>(query, params);
  return result?.count || 0;
}

/**
 * Check if a review exists for a specific period
 */
export async function reviewExistsForPeriod(
  periodStart: string,
  periodEnd: string,
  reviewType: ReviewType
): Promise<boolean> {
  const row = await executeQuerySingle<{ count: number }>(
    `SELECT COUNT(*) as count FROM review_history
     WHERE review_type = ?
     AND period_start = ?
     AND period_end = ?`,
    [reviewType, periodStart, periodEnd]
  );

  return (row?.count || 0) > 0;
}

/**
 * Delete old reviews (keep only the last N reviews per type)
 */
export async function cleanupOldReviews(keepCount: number = 20): Promise<number> {
  // Get reviews to delete for each type
  const reviewTypes: ReviewType[] = ['weekly', 'monthly', 'custom'];
  let totalDeleted = 0;

  for (const reviewType of reviewTypes) {
    const reviews = await executeQuery<ReviewRow>(
      `SELECT id FROM review_history
       WHERE review_type = ?
       ORDER BY created_at DESC`,
      [reviewType]
    );

    if (reviews.length > keepCount) {
      const reviewsToDelete = reviews.slice(keepCount);
      for (const review of reviewsToDelete) {
        await deleteReview(review.id);
        totalDeleted++;
      }
    }
  }

  return totalDeleted;
}
