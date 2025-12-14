/**
 * Export Service
 * Handles exporting financial data to CSV format
 */

import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { Transaction } from '../database/finance';

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
