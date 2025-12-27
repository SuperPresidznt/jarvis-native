/**
 * Transaction Repository
 * Wraps database operations for financial transactions with a clean interface
 */

import type { IRepository } from './IRepository';
import * as financeDb from '../database/finance';
import type {
  Transaction,
  Asset,
  Liability,
  FinanceSummary,
  TransactionType,
} from '../database/finance';

/**
 * Transaction creation data
 */
export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description?: string;
  currency?: string;
}

/**
 * Transaction update data
 */
export interface UpdateTransactionData {
  type?: TransactionType;
  amount?: number;
  category?: string;
  date?: string;
  description?: string;
  currency?: string;
}

/**
 * Asset creation data
 */
export interface CreateAssetData {
  name: string;
  type: string;
  value: number;
  currency?: string;
}

/**
 * Asset update data
 */
export interface UpdateAssetData {
  name?: string;
  type?: string;
  value?: number;
  currency?: string;
}

/**
 * Liability creation data
 */
export interface CreateLiabilityData {
  name: string;
  type: string;
  amount: number;
  interestRate?: number;
  currency?: string;
}

/**
 * Liability update data
 */
export interface UpdateLiabilityData {
  name?: string;
  type?: string;
  amount?: number;
  interestRate?: number;
  currency?: string;
}

/**
 * Transaction repository interface
 */
export interface ITransactionRepository
  extends IRepository<Transaction, CreateTransactionData, UpdateTransactionData> {
  // Filtered queries
  getByDateRange(startDate: string, endDate: string): Promise<Transaction[]>;
  getByType(type: TransactionType): Promise<Transaction[]>;

  // Asset operations
  getAssets(): Promise<Asset[]>;
  createAsset(data: CreateAssetData): Promise<Asset>;
  updateAsset(id: string, data: UpdateAssetData): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;

  // Liability operations
  getLiabilities(): Promise<Liability[]>;
  createLiability(data: CreateLiabilityData): Promise<Liability>;
  updateLiability(id: string, data: UpdateLiabilityData): Promise<Liability>;
  deleteLiability(id: string): Promise<void>;

  // Summary
  getSummary(): Promise<FinanceSummary>;
}

/**
 * Transaction Repository Implementation
 */
class TransactionRepositoryImpl implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    return financeDb.getTransactions();
  }

  async getById(_id: string): Promise<Transaction | null> {
    // The current DB implementation doesn't have getTransaction by ID
    // We can find it from all transactions
    const all = await this.getAll();
    return all.find((t) => t.id === _id) ?? null;
  }

  async create(data: CreateTransactionData): Promise<Transaction> {
    return financeDb.createTransaction(data);
  }

  async update(id: string, data: UpdateTransactionData): Promise<Transaction> {
    return financeDb.updateTransaction(id, data);
  }

  async delete(id: string): Promise<void> {
    return financeDb.deleteTransaction(id);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return financeDb.getTransactionsByDateRange(startDate, endDate);
  }

  async getByType(type: TransactionType): Promise<Transaction[]> {
    return financeDb.getTransactionsByType(type);
  }

  // Asset operations
  async getAssets(): Promise<Asset[]> {
    return financeDb.getAssets();
  }

  async createAsset(data: CreateAssetData): Promise<Asset> {
    return financeDb.createAsset(data);
  }

  async updateAsset(id: string, data: UpdateAssetData): Promise<Asset> {
    return financeDb.updateAsset(id, data);
  }

  async deleteAsset(id: string): Promise<void> {
    return financeDb.deleteAsset(id);
  }

  // Liability operations
  async getLiabilities(): Promise<Liability[]> {
    return financeDb.getLiabilities();
  }

  async createLiability(data: CreateLiabilityData): Promise<Liability> {
    return financeDb.createLiability(data);
  }

  async updateLiability(id: string, data: UpdateLiabilityData): Promise<Liability> {
    return financeDb.updateLiability(id, data);
  }

  async deleteLiability(id: string): Promise<void> {
    return financeDb.deleteLiability(id);
  }

  // Summary
  async getSummary(): Promise<FinanceSummary> {
    return financeDb.getFinanceSummary();
  }
}

// Singleton instance
export const TransactionRepository: ITransactionRepository = new TransactionRepositoryImpl();

// Re-export types for convenience
export type {
  Transaction,
  Asset,
  Liability,
  FinanceSummary,
  TransactionType,
} from '../database/finance';
