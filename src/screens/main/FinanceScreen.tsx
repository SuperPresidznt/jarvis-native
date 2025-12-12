/**
 * Finance Screen
 * Financial tracking with KPIs, assets, liabilities, and cashflow
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../../services/finance.api';
import { MetricCard } from '../../components/MetricCard';

type ViewMode = 'overview' | 'assets' | 'liabilities' | 'cashflow';

export default function FinanceScreen() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const { data: summary, isLoading } = useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: financeApi.getSummary,
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['finance', 'assets'],
    queryFn: financeApi.getAssets,
    enabled: viewMode === 'assets' || viewMode === 'overview',
  });

  const { data: liabilities = [] } = useQuery({
    queryKey: ['finance', 'liabilities'],
    queryFn: financeApi.getLiabilities,
    enabled: viewMode === 'liabilities' || viewMode === 'overview',
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['finance', 'summary'] }),
      queryClient.invalidateQueries({ queryKey: ['finance', 'assets'] }),
      queryClient.invalidateQueries({ queryKey: ['finance', 'liabilities'] }),
    ]);
    setRefreshing(false);
  };

  const formatCurrency = (cents: number | undefined | null) => {
    if (cents == null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (isLoading && !summary) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Finance
        </Text>
      </View>

      <SegmentedButtons
        value={viewMode}
        onValueChange={(value) => setViewMode(value as ViewMode)}
        buttons={[
          { value: 'overview', label: 'Overview' },
          { value: 'assets', label: 'Assets' },
          { value: 'liabilities', label: 'Debts' },
        ]}
        style={styles.viewSelector}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {viewMode === 'overview' && summary && (
          <>
            <View style={styles.kpiGrid}>
              <MetricCard
                label="Net Worth"
                value={formatCurrency(summary.netWorth)}
                variant={summary.netWorth >= 0 ? 'success' : 'danger'}
              />
              <MetricCard
                label="Total Assets"
                value={formatCurrency(summary.totalAssets)}
              />
              <MetricCard
                label="Total Liabilities"
                value={formatCurrency(summary.totalLiabilities)}
                variant="warning"
              />
              {summary.runway != null && (
                <MetricCard
                  label="Runway"
                  value={`${Math.round(summary.runway)} months`}
                  helper="Months of expenses covered"
                />
              )}
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Assets ({assets.length})
            </Text>
            {assets.slice(0, 3).map((asset: any) => (
              <Card key={asset.id} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <Text variant="titleSmall">{asset.name}</Text>
                    <Text variant="titleMedium" style={styles.assetValue}>
                      {formatCurrency(asset.valueCents)}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.itemType}>
                    {asset.category}
                  </Text>
                </Card.Content>
              </Card>
            ))}

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Liabilities ({liabilities.length})
            </Text>
            {liabilities.slice(0, 3).map((liability: any) => (
              <Card key={liability.id} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <Text variant="titleSmall">{liability.name}</Text>
                    <Text variant="titleMedium" style={styles.liabilityValue}>
                      {formatCurrency(liability.balanceCents)}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.itemType}>
                    {liability.type}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {viewMode === 'assets' && (
          <>
            <Button
              mode="contained"
              onPress={() => {
                /* TODO: Open add asset modal */
              }}
              style={styles.addButton}
            >
              Add Asset
            </Button>
            {assets.map((asset: any) => (
              <Card key={asset.id} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <Text variant="titleSmall">{asset.name}</Text>
                    <Text variant="titleMedium" style={styles.assetValue}>
                      {formatCurrency(asset.valueCents)}
                    </Text>
                  </View>
                  {asset.description && (
                    <Text variant="bodySmall" style={styles.itemDescription}>
                      {asset.description}
                    </Text>
                  )}
                  <Text variant="bodySmall" style={styles.itemType}>
                    {asset.category}
                  </Text>
                </Card.Content>
              </Card>
            ))}
            {assets.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💰</Text>
                <Text variant="titleMedium" style={styles.emptyText}>
                  No assets yet
                </Text>
                <Text variant="bodySmall" style={styles.emptySubtext}>
                  Track your assets to monitor your financial health
                </Text>
              </View>
            )}
          </>
        )}

        {viewMode === 'liabilities' && (
          <>
            <Button
              mode="contained"
              onPress={() => {
                /* TODO: Open add liability modal */
              }}
              style={styles.addButton}
            >
              Add Liability
            </Button>
            {liabilities.map((liability: any) => (
              <Card key={liability.id} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <Text variant="titleSmall">{liability.name}</Text>
                    <Text variant="titleMedium" style={styles.liabilityValue}>
                      {formatCurrency(liability.balanceCents)}
                    </Text>
                  </View>
                  {liability.description && (
                    <Text variant="bodySmall" style={styles.itemDescription}>
                      {liability.description}
                    </Text>
                  )}
                  <Text variant="bodySmall" style={styles.itemType}>
                    {liability.type} • {liability.apr}% APR
                  </Text>
                </Card.Content>
              </Card>
            ))}
            {liabilities.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text variant="titleMedium" style={styles.emptyText}>
                  No liabilities yet
                </Text>
                <Text variant="bodySmall" style={styles.emptySubtext}>
                  Track debts and liabilities for complete financial picture
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    paddingTop: 12,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewSelector: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  kpiGrid: {
    gap: 14,
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 14,
    fontWeight: '600',
    fontSize: 17,
  },
  itemCard: {
    backgroundColor: '#1E293B',
    marginBottom: 14,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  assetValue: {
    color: '#10B981',
    fontWeight: '700',
  },
  liabilityValue: {
    color: '#EF4444',
    fontWeight: '700',
  },
  itemType: {
    color: '#94A3B8',
    fontSize: 13,
  },
  itemDescription: {
    color: '#94A3B8',
    marginBottom: 6,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#10B981',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
