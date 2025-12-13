/**
 * Finance Screen
 * Professional financial dashboard with assets, liabilities, and net worth tracking
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { IconButton, SegmentedButtons } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as financeDB from '../../database/finance';
import { AppButton, AppChip, EmptyState, LoadingState, AppCard } from '../../components/ui';
import { MetricCard } from '../../components/MetricCard';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme';

type ViewMode = 'overview' | 'assets' | 'liabilities' | 'transactions';
type TimeFilter = 'month' | 'lastMonth' | 'all';

export default function FinanceScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [refreshing, setRefreshing] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  const [summary, setSummary] = useState<financeDB.FinanceSummary | null>(null);
  const [assets, setAssets] = useState<financeDB.Asset[]>([]);
  const [liabilities, setLiabilities] = useState<financeDB.Liability[]>([]);
  const [transactions, setTransactions] = useState<financeDB.Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<financeDB.Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  // Load finance data
  const loadData = useCallback(async () => {
    try {
      const [summaryData, assetsData, liabilitiesData, transactionsData] = await Promise.all([
        financeDB.getFinanceSummary(),
        financeDB.getAssets(),
        financeDB.getLiabilities(),
        financeDB.getTransactions(),
      ]);
      setSummary(summaryData);
      setAssets(assetsData);
      setLiabilities(liabilitiesData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('[Finance] Error loading data:', error);
      Alert.alert('Error', 'Failed to load finance data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter transactions based on time filter
  useEffect(() => {
    const now = new Date();
    let startDate: string;
    let endDate: string;

    if (timeFilter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (timeFilter === 'lastMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    } else {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );
    setFilteredTransactions(filtered);
  }, [transactions, timeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculatePreviousMonth = () => {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .split('T')[0];
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      .toISOString()
      .split('T')[0];

    const lastMonthTransactions = transactions.filter(
      (t) => t.date >= lastMonthStart && t.date <= lastMonthEnd
    );

    const income = lastMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = lastMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, net: income - expenses };
  };

  const getCategoryBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });

    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (value == null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading && !summary) {
    return <LoadingState fullScreen message="Loading finances..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Finance</Text>
          <Text style={styles.subtitle}>Track your wealth</Text>
        </View>
      </View>

      {/* View Selector */}
      <View style={styles.viewSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.viewSelectorScroll}
        >
          {(['overview', 'transactions', 'assets', 'liabilities'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewMode(mode)}
              style={[
                styles.viewTab,
                viewMode === mode && styles.viewTabActive,
              ]}
            >
              <Text
                style={[
                  styles.viewTabText,
                  viewMode === mode && styles.viewTabTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'overview' && summary && (
          <>
            {/* Summary KPIs */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NET WORTH</Text>
              <View style={styles.netWorthCard}>
                <Text
                  style={[
                    styles.netWorthValue,
                    { color: (summary.netWorth || 0) >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {formatCurrency(summary.netWorth)}
                </Text>
                <Text style={styles.netWorthLabel}>
                  Assets: {formatCurrency(summary.totalAssets)} | Debts:{' '}
                  {formatCurrency(summary.totalLiabilities)}
                </Text>
              </View>
            </View>

            {/* Current Month Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>THIS MONTH</Text>
              <View style={styles.kpiGrid}>
                <MetricCard
                  label="Income"
                  value={formatCurrency(summary.monthlyIncome)}
                  variant="success"
                />
                <MetricCard
                  label="Expenses"
                  value={formatCurrency(summary.monthlyExpenses)}
                  variant="danger"
                />
                <MetricCard
                  label="Net Savings"
                  value={formatCurrency(summary.monthlyIncome - summary.monthlyExpenses)}
                  helper={`${Math.round(summary.savingsRate)}% rate`}
                  variant="info"
                />
              </View>
            </View>

            {/* Month Comparison */}
            {(() => {
              const prevMonth = calculatePreviousMonth();
              const incomeChange = summary.monthlyIncome - prevMonth.income;
              const expensesChange = summary.monthlyExpenses - prevMonth.expenses;
              const netChange = (summary.monthlyIncome - summary.monthlyExpenses) - prevMonth.net;

              return (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>VS LAST MONTH</Text>
                  <View style={styles.comparisonGrid}>
                    <View style={styles.comparisonCard}>
                      <Text style={styles.comparisonLabel}>Income</Text>
                      <Text
                        style={[
                          styles.comparisonValue,
                          { color: incomeChange >= 0 ? colors.success : colors.error },
                        ]}
                      >
                        {incomeChange >= 0 ? '+' : ''}
                        {formatCurrency(incomeChange)}
                      </Text>
                    </View>
                    <View style={styles.comparisonCard}>
                      <Text style={styles.comparisonLabel}>Expenses</Text>
                      <Text
                        style={[
                          styles.comparisonValue,
                          { color: expensesChange <= 0 ? colors.success : colors.error },
                        ]}
                      >
                        {expensesChange >= 0 ? '+' : ''}
                        {formatCurrency(expensesChange)}
                      </Text>
                    </View>
                    <View style={styles.comparisonCard}>
                      <Text style={styles.comparisonLabel}>Net</Text>
                      <Text
                        style={[
                          styles.comparisonValue,
                          { color: netChange >= 0 ? colors.success : colors.error },
                        ]}
                      >
                        {netChange >= 0 ? '+' : ''}
                        {formatCurrency(netChange)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            {/* Category Breakdown */}
            {(() => {
              const categories = getCategoryBreakdown();
              return categories.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>TOP SPENDING CATEGORIES</Text>
                  <View style={styles.categoryList}>
                    {categories.map(([category, amount]) => (
                      <View key={category} style={styles.categoryRow}>
                        <Text style={styles.categoryName}>{category}</Text>
                        <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null;
            })()}

            {/* Recent Assets */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>RECENT ASSETS</Text>
                <TouchableOpacity onPress={() => setViewMode('assets')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {assets.slice(0, 3).map((asset) => (
                <FinanceItemCard
                  key={asset.id}
                  name={asset.name}
                  value={formatCurrency(asset.value)}
                  category={asset.type}
                  type="asset"
                />
              ))}
              {assets.length === 0 && (
                <Text style={styles.emptyText}>No assets tracked yet</Text>
              )}
            </View>

            {/* Recent Liabilities */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>RECENT LIABILITIES</Text>
                <TouchableOpacity onPress={() => setViewMode('liabilities')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {liabilities.slice(0, 3).map((liability) => (
                <FinanceItemCard
                  key={liability.id}
                  name={liability.name}
                  value={formatCurrency(liability.amount)}
                  category={liability.interestRate ? `${liability.type} - ${liability.interestRate}% APR` : liability.type}
                  type="liability"
                />
              ))}
              {liabilities.length === 0 && (
                <Text style={styles.emptyText}>No liabilities tracked yet</Text>
              )}
            </View>
          </>
        )}

        {viewMode === 'assets' && (
          <>
            <AppButton
              title="Add Asset"
              onPress={() => setShowAssetModal(true)}
              fullWidth
              style={styles.addButton}
            />
            {assets.length === 0 ? (
              <EmptyState
                icon="💰"
                title="No assets yet"
                description="Track your assets to monitor your financial health"
                actionLabel="Add Asset"
                onAction={() => setShowAssetModal(true)}
              />
            ) : (
              <View style={styles.itemsList}>
                {assets.map((asset) => (
                  <FinanceItemCard
                    key={asset.id}
                    name={asset.name}
                    value={formatCurrency(asset.value)}
                    category={asset.type}
                    type="asset"
                  />
                ))}
              </View>
            )}
          </>
        )}

        {viewMode === 'liabilities' && (
          <>
            <AppButton
              title="Add Liability"
              onPress={() => setShowLiabilityModal(true)}
              fullWidth
              style={styles.addButton}
            />
            {liabilities.length === 0 ? (
              <EmptyState
                icon="📊"
                title="No liabilities yet"
                description="Track debts and liabilities for complete financial picture"
                actionLabel="Add Liability"
                onAction={() => setShowLiabilityModal(true)}
              />
            ) : (
              <View style={styles.itemsList}>
                {liabilities.map((liability) => (
                  <FinanceItemCard
                    key={liability.id}
                    name={liability.name}
                    value={formatCurrency(liability.amount)}
                    category={liability.interestRate ? `${liability.type} - ${liability.interestRate}% APR` : liability.type}
                    type="liability"
                  />
                ))}
              </View>
            )}
          </>
        )}

        {viewMode === 'transactions' && (
          <>
            {/* Time Filter */}
            <View style={styles.filterRow}>
              {(['month', 'lastMonth', 'all'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setTimeFilter(filter)}
                  style={[
                    styles.filterChip,
                    timeFilter === filter && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      timeFilter === filter && styles.filterChipTextActive,
                    ]}
                  >
                    {filter === 'month'
                      ? 'This Month'
                      : filter === 'lastMonth'
                      ? 'Last Month'
                      : 'All Time'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Transactions Summary */}
            {(() => {
              const income = filteredTransactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
              const expenses = filteredTransactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <View style={styles.transactionSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Income:</Text>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                      {formatCurrency(income)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Expenses:</Text>
                    <Text style={[styles.summaryValue, { color: colors.error }]}>
                      {formatCurrency(expenses)}
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                    <Text style={styles.summaryLabelTotal}>Net:</Text>
                    <Text
                      style={[
                        styles.summaryValueTotal,
                        { color: income - expenses >= 0 ? colors.success : colors.error },
                      ]}
                    >
                      {formatCurrency(income - expenses)}
                    </Text>
                  </View>
                </View>
              );
            })()}

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
              <EmptyState
                icon="💳"
                title="No transactions"
                description="Start tracking your income and expenses"
                actionLabel="Add Transaction"
                onAction={() => {}}
              />
            ) : (
              <View style={styles.transactionList}>
                {filteredTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionContent}>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionCategory}>
                          {transaction.category}
                        </Text>
                        {transaction.description && (
                          <Text style={styles.transactionDescription}>
                            {transaction.description}
                          </Text>
                        )}
                        <Text style={styles.transactionDate}>
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          {
                            color:
                              transaction.type === 'income'
                                ? colors.success
                                : colors.error,
                          },
                        ]}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* TODO: Add modals for creating assets and liabilities */}
    </View>
  );
}

// Finance Item Card Component
interface FinanceItemCardProps {
  name: string;
  value: string;
  category?: string;
  type: 'asset' | 'liability';
}

const FinanceItemCard: React.FC<FinanceItemCardProps> = ({
  name,
  value,
  category,
  type,
}) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{name}</Text>
          {category && <Text style={styles.itemCategory}>{category}</Text>}
        </View>
        <Text
          style={[
            styles.itemValue,
            { color: type === 'asset' ? colors.success : colors.error },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  viewSelectorContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  viewSelectorScroll: {
    gap: spacing.sm,
  },
  viewTab: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  viewTabActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  viewTabText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  viewTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.widest,
  },
  viewAllText: {
    fontSize: typography.size.sm,
    color: colors.primary.main,
    fontWeight: typography.weight.medium,
  },
  netWorthCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  netWorthValue: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  netWorthLabel: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  kpiGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  addButton: {
    marginBottom: spacing.lg,
  },
  itemsList: {
    gap: spacing.md,
  },
  itemCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
    marginBottom: spacing.xs,
  },
  itemCategory: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  itemValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  emptyText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  // Comparison styles
  comparisonGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  comparisonLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  comparisonValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  // Category styles
  categoryList: {
    gap: spacing.sm,
  },
  categoryRow: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  categoryName: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
  },
  categoryAmount: {
    fontSize: typography.size.base,
    color: colors.error,
    fontWeight: typography.weight.semibold,
  },
  // Filter styles
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterChipText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  // Transaction styles
  transactionSummary: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryRowTotal: {
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  summaryLabel: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  summaryValue: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  summaryLabelTotal: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },
  summaryValueTotal: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  transactionList: {
    gap: spacing.sm,
  },
  transactionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  transactionInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  transactionCategory: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionDescription: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  transactionAmount: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});
