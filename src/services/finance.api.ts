/**
 * Finance API Service
 * Handles financial data (assets, liabilities, cashflow)
 */

import apiService from './api';

export type CashflowDirection = 'inflow' | 'outflow';

export interface Asset {
  id: string;
  userId: string;
  name: string;
  category: string;
  valueCents: number;
  isLiquid: boolean;
  note?: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  userId: string;
  name: string;
  category: string;
  balanceCents: number;
  aprPercent?: number;
  minimumPayment?: number;
  note?: string;
  updatedAt: string;
}

export interface CashflowTxn {
  id: string;
  userId: string;
  description: string;
  amountCents: number;
  date: string;
  category: string;
  direction: CashflowDirection;
  note?: string;
}

export interface FinanceSummary {
  netWorth: number; // assets - liabilities
  totalAssets: number;
  totalLiabilities: number;
  runway: number; // months
  dscr: number; // debt service coverage ratio
  monthlyInflow: number;
  monthlyOutflow: number;
}

export interface FinanceData {
  assets: Asset[];
  liabilities: Liability[];
  cashflow: CashflowTxn[];
  summary: FinanceSummary;
  currency: string;
}

export interface CreateAssetData {
  name: string;
  category: string;
  valueCents: number;
  isLiquid?: boolean;
  note?: string;
}

export interface CreateLiabilityData {
  name: string;
  category: string;
  balanceCents: number;
  aprPercent?: number;
  minimumPayment?: number;
  note?: string;
}

export interface CreateCashflowData {
  description: string;
  amountCents: number;
  date?: string;
  category: string;
  direction: CashflowDirection;
  note?: string;
}

export const financeApi = {
  /**
   * Get all finance data
   */
  getAllData: (): Promise<FinanceData> => {
    return apiService.get<FinanceData>('/api/finance');
  },

  /**
   * Get all assets
   */
  getAssets: (): Promise<Asset[]> => {
    return apiService.get<Asset[]>('/api/finance/assets');
  },

  /**
   * Create a new asset
   */
  createAsset: (data: CreateAssetData): Promise<Asset> => {
    return apiService.post<Asset>('/api/finance/assets', data);
  },

  /**
   * Update an asset
   */
  updateAsset: (id: string, data: Partial<CreateAssetData>): Promise<Asset> => {
    return apiService.patch<Asset>(`/api/finance/assets/${id}`, data);
  },

  /**
   * Delete an asset
   */
  deleteAsset: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/finance/assets/${id}`);
  },

  /**
   * Get all liabilities
   */
  getLiabilities: (): Promise<Liability[]> => {
    return apiService.get<Liability[]>('/api/finance/liabilities');
  },

  /**
   * Create a new liability
   */
  createLiability: (data: CreateLiabilityData): Promise<Liability> => {
    return apiService.post<Liability>('/api/finance/liabilities', data);
  },

  /**
   * Update a liability
   */
  updateLiability: (id: string, data: Partial<CreateLiabilityData>): Promise<Liability> => {
    return apiService.patch<Liability>(`/api/finance/liabilities/${id}`, data);
  },

  /**
   * Delete a liability
   */
  deleteLiability: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/finance/liabilities/${id}`);
  },

  /**
   * Get cashflow transactions
   */
  getCashflow: (startDate?: string, endDate?: string): Promise<CashflowTxn[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    const queryString = params.toString();
    return apiService.get<CashflowTxn[]>(`/api/finance/cashflow${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Create a cashflow transaction
   */
  createCashflow: (data: CreateCashflowData): Promise<CashflowTxn> => {
    return apiService.post<CashflowTxn>('/api/finance/cashflow', data);
  },

  /**
   * Update a cashflow transaction
   */
  updateCashflow: (id: string, data: Partial<CreateCashflowData>): Promise<CashflowTxn> => {
    return apiService.patch<CashflowTxn>(`/api/finance/cashflow/${id}`, data);
  },

  /**
   * Delete a cashflow transaction
   */
  deleteCashflow: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/finance/cashflow/${id}`);
  },

  /**
   * Get finance summary/KPIs
   */
  getSummary: (): Promise<FinanceSummary> => {
    return apiService.get<FinanceSummary>('/api/finance/summary');
  },
};

export default financeApi;
