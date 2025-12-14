/**
 * Finance Charts Data Utilities
 * Data aggregation and transformation for finance visualizations
 */

import * as financeDB from '../../database/finance';
import * as budgetsDB from '../../database/budgets';

export interface DailySpendingData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

export interface CategoryBreakdownData {
  labels: string[];
  data: number[];
  colors: string[];
}

export interface MonthlyComparisonData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
  }>;
  legend: string[];
}

/**
 * Get daily spending data for line chart
 * @param days Number of days to include (default 30)
 */
export async function getDailySpendingData(days: number = 30): Promise<DailySpendingData> {
  const transactions = await financeDB.getTransactions();

  // Filter to expenses only and within date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const expenses = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return t.type === 'expense' && tDate >= startDate && tDate <= endDate;
  });

  // Group by date
  const dailyTotals = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyTotals.set(dateStr, 0);
  }

  // Sum expenses by date
  expenses.forEach((expense) => {
    const dateStr = expense.date;
    const current = dailyTotals.get(dateStr) || 0;
    dailyTotals.set(dateStr, current + expense.amount);
  });

  // Convert to chart format
  const sortedDates = Array.from(dailyTotals.keys()).sort();
  const labels = sortedDates.map((date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const data = sortedDates.map((date) => (dailyTotals.get(date) || 0) / 100); // Convert to dollars

  return {
    labels,
    datasets: [{ data }],
  };
}

/**
 * Get category breakdown for pie chart
 * @param month Optional month (defaults to current month)
 */
export async function getCategoryBreakdownData(month?: string): Promise<CategoryBreakdownData | null> {
  const transactions = await financeDB.getTransactions();

  // Determine date range
  const now = new Date();
  const startDate = month
    ? new Date(month + '-01')
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = month
    ? new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  // Filter expenses in month
  const expenses = transactions.filter(
    (t) => t.type === 'expense' && t.date >= startStr && t.date <= endStr
  );

  if (expenses.length === 0) {
    return null;
  }

  // Group by category
  const categoryTotals = new Map<string, number>();
  expenses.forEach((expense) => {
    const current = categoryTotals.get(expense.category) || 0;
    categoryTotals.set(expense.category, current + expense.amount);
  });

  // Sort by amount and take top 6
  const sorted = Array.from(categoryTotals.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  // Chart colors
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
  ];

  return {
    labels: sorted.map(([category]) => category),
    data: sorted.map(([, amount]) => amount / 100), // Convert to dollars
    colors,
  };
}

/**
 * Get monthly income vs expenses comparison for bar chart
 * @param months Number of months to include (default 6)
 */
export async function getMonthlyComparisonData(months: number = 6): Promise<MonthlyComparisonData> {
  const transactions = await financeDB.getTransactions();

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);

  // Initialize monthly totals
  const monthlyData = new Map<string, { income: number; expenses: number }>();
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData.set(monthKey, { income: 0, expenses: 0 });
  }

  // Sum transactions by month
  transactions.forEach((t) => {
    const tDate = new Date(t.date);
    if (tDate >= startDate && tDate <= endDate) {
      const monthKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
      const current = monthlyData.get(monthKey);
      if (current) {
        if (t.type === 'income') {
          current.income += t.amount;
        } else if (t.type === 'expense') {
          current.expenses += t.amount;
        }
      }
    }
  });

  // Convert to chart format
  const sortedMonths = Array.from(monthlyData.keys()).sort();
  const labels = sortedMonths.map((monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  });

  const incomeData = sortedMonths.map((month) => (monthlyData.get(month)?.income || 0) / 100);
  const expensesData = sortedMonths.map((month) => (monthlyData.get(month)?.expenses || 0) / 100);

  return {
    labels,
    datasets: [
      {
        data: incomeData,
        color: () => '#10B981', // green for income
      },
      {
        data: expensesData,
        color: () => '#EF4444', // red for expenses
      },
    ],
    legend: ['Income', 'Expenses'],
  };
}

/**
 * Get budget progress data for progress circles
 */
export async function getBudgetProgressData(): Promise<budgetsDB.BudgetWithSpending[]> {
  return await budgetsDB.getActiveBudgets();
}

export default {
  getDailySpendingData,
  getCategoryBreakdownData,
  getMonthlyComparisonData,
  getBudgetProgressData,
};
