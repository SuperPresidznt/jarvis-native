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

type ViewMode = 'overview' | 'assets' | 'liabilities';

export default function FinanceScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  const [summary, setSummary] = useState<financeDB.FinanceSummary | null>(null);
  const [assets, setAssets] = useState<financeDB.Asset[]>([]);
  const [liabilities, setLiabilities] = useState<financeDB.Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  // Load finance data
  const loadData = useCallback(async () => {
    try {
      const [summaryData, assetsData, liabilitiesData] = await Promise.all([
        financeDB.getFinanceSummary(),
        financeDB.getAssets(),
        financeDB.getLiabilities(),
      ]);
      setSummary(summaryData);
      setAssets(assetsData);
      setLiabilities(liabilitiesData);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'assets', label: 'Assets' },
            { value: 'liabilities', label: 'Debts' },
          ]}
          style={styles.viewSelector}
          theme={{
            colors: {
              secondaryContainer: colors.primary.main,
              onSecondaryContainer: '#FFFFFF',
              onSurface: colors.text.secondary,
            },
          }}
        />
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

            <View style={styles.kpiGrid}>
              <MetricCard
                label="Total Assets"
                value={formatCurrency(summary.totalAssets)}
                variant="success"
              />
              <MetricCard
                label="Total Liabilities"
                value={formatCurrency(summary.totalLiabilities)}
                variant="danger"
              />
              <MetricCard
                label="Savings Rate"
                value={`${Math.round(summary.savingsRate)}%`}
                helper="Monthly savings rate"
                variant="info"
              />
            </View>

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
  viewSelector: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
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
});
