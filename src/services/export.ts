/**
 * Export Service
 * Handles exporting data to CSV and JSON formats
 */

import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { Transaction } from '../database/finance';
import { getTasks } from '../database/tasks';
import { getHabits } from '../database/habits';
import { getEvents } from '../database/calendar';
import { getTransactions, getAssets, getLiabilities } from '../database/finance';
import { executeQuery } from '../database';

export type DateRangeFilter =
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'lastYear'
  | 'allTime'
  | 'custom';

export interface ExportFilters {
  dateRange: DateRangeFilter;
  customStartDate?: string;
  customEndDate?: string;
}

/**
 * Escape CSV field value
 * Handles commas, quotes, and newlines
 */
function escapeCSVField(value: string | number | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }

  const stringValue = String(value);

  // If the value contains comma, quote, or newline, wrap it in quotes
  // and escape any internal quotes by doubling them
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Format amount to 2 decimal places
 */
function formatAmount(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return dateString;
  }
}

/**
 * Get date range based on filter
 */
export function getDateRange(filter: DateRangeFilter): { startDate: string; endDate: string } | null {
  const now = new Date();

  switch (filter) {
    case 'thisMonth': {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
      return { startDate, endDate };
    }

    case 'lastMonth': {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      return { startDate, endDate };
    }

    case 'thisYear': {
      const startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      return { startDate, endDate };
    }

    case 'lastYear': {
      const startDate = new Date(now.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
      return { startDate, endDate };
    }

    case 'allTime':
      return null;

    default:
      return null;
  }
}

/**
 * Filter transactions by date range
 */
export function filterTransactionsByDate(
  transactions: Transaction[],
  filters: ExportFilters
): Transaction[] {
  if (filters.dateRange === 'custom') {
    if (!filters.customStartDate || !filters.customEndDate) {
      return transactions;
    }
    return transactions.filter(
      (t) => t.date >= filters.customStartDate! && t.date <= filters.customEndDate!
    );
  }

  const dateRange = getDateRange(filters.dateRange);
  if (!dateRange) {
    return transactions;
  }

  return transactions.filter(
    (t) => t.date >= dateRange.startDate && t.date <= dateRange.endDate
  );
}

/**
 * Generate CSV content from transactions
 */
export function generateCSV(transactions: Transaction[]): string {
  // CSV Headers
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
  const csvLines: string[] = [headers.join(',')];

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  // Add data rows
  sortedTransactions.forEach((transaction) => {
    const row = [
      escapeCSVField(formatDate(transaction.date)),
      escapeCSVField(transaction.description || ''),
      escapeCSVField(transaction.category),
      escapeCSVField(formatAmount(transaction.amount)),
      escapeCSVField(transaction.type === 'income' ? 'Income' : 'Expense'),
    ];
    csvLines.push(row.join(','));
  });

  return csvLines.join('\n');
}

/**
 * Generate filename for export
 */
function generateFilename(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  return `jarvis_transactions_${dateStr}.csv`;
}

/**
 * Export transactions to CSV and share
 */
export async function exportTransactionsToCSV(
  transactions: Transaction[],
  filters: ExportFilters
): Promise<{ success: boolean; message: string }> {
  try {
    // Filter transactions
    const filteredTransactions = filterTransactionsByDate(transactions, filters);

    if (filteredTransactions.length === 0) {
      return {
        success: false,
        message: 'No transactions to export for the selected date range',
      };
    }

    // Generate CSV content
    const csvContent = generateCSV(filteredTransactions);

    // Generate filename
    const filename = generateFilename();

    // Write to temporary file in cache directory
    const file = new File(Paths.cache, filename);
    await file.write(csvContent);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        message: 'Sharing is not available on this device',
      };
    }

    // Share the file
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Transactions',
      UTI: 'public.comma-separated-values-text',
    });

    // Clean up the file after sharing (optional - cache directory is auto-cleaned)
    // We'll keep it for now in case user wants to share again

    return {
      success: true,
      message: `Successfully exported ${filteredTransactions.length} transaction${
        filteredTransactions.length === 1 ? '' : 's'
      }`,
    };
  } catch (error) {
    console.error('[Export] Error exporting transactions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to export transactions',
    };
  }
}

/**
 * Get display label for date range filter
 */
export function getDateRangeLabel(filter: DateRangeFilter): string {
  switch (filter) {
    case 'thisMonth':
      return 'This Month';
    case 'lastMonth':
      return 'Last Month';
    case 'thisYear':
      return 'This Year';
    case 'lastYear':
      return 'Last Year';
    case 'allTime':
      return 'All Time';
    case 'custom':
      return 'Custom Range';
    default:
      return 'Unknown';
  }
}

/**
 * Get all habit logs (no date filter)
 */
async function getAllHabitLogs() {
  const sql = 'SELECT * FROM habit_logs ORDER BY date DESC';
  const rows = await executeQuery(sql, []);
  return rows.map((row: unknown) => {
    const r = row as Record<string, unknown>;
    return {
      id: r.id as string,
      habitId: r.habit_id as string,
      date: r.date as string,
      completed: Boolean(r.completed),
      notes: r.notes as string | undefined,
      createdAt: r.created_at as string,
    };
  });
}

/**
 * Export all data as JSON backup
 */
export async function exportAllDataAsJSON(): Promise<{ success: boolean; message: string }> {
  try {
    // Gather all data from database
    const [tasks, habits, habitLogs, events, transactions, assets, liabilities] = await Promise.all([
      getTasks(),
      getHabits(),
      getAllHabitLogs(),
      getEvents(),
      getTransactions(),
      getAssets(),
      getLiabilities(),
    ]);

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        tasks,
        habits,
        habitLogs,
        events,
        transactions,
        assets,
        liabilities,
      },
      stats: {
        tasks: tasks.length,
        habits: habits.length,
        habitLogs: habitLogs.length,
        events: events.length,
        transactions: transactions.length,
        assets: assets.length,
        liabilities: liabilities.length,
      },
    };

    // Generate filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `jarvis_backup_${dateStr}.json`;

    // Write to file
    const file = new File(Paths.cache, filename);
    await file.write(JSON.stringify(exportData, null, 2));

    // Share the file
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        message: 'Sharing is not available on this device',
      };
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export All Data',
      UTI: 'public.json',
    });

    const totalRecords = Object.values(exportData.stats).reduce((sum, val) => sum + val, 0);

    return {
      success: true,
      message: `Successfully exported ${totalRecords} records`,
    };
  } catch (error) {
    console.error('[Export] Error exporting all data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to export data',
    };
  }
}
