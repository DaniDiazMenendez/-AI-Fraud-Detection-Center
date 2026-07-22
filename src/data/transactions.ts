import { generateMockTransactions } from './generators';
import { Transaction } from '../types';

// Generate 500 mock transactions
export const mockTransactions: Transaction[] = generateMockTransactions(500);

// Storage key
export const STORAGE_KEY = 'fraud_detection_transactions';

// Initialize or retrieve transactions from localStorage
export function getTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return mockTransactions;
}

// Save transactions to localStorage
export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// Add new transaction
export function addTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  // Keep only last 1000 transactions
  if (transactions.length > 1000) {
    transactions.pop();
  }
  saveTransactions(transactions);
}

// Add multiple transactions
export function addTransactions(newTransactions: Transaction[]): void {
  const transactions = getTransactions();
  transactions.unshift(...newTransactions);
  // Keep only last 1000 transactions
  if (transactions.length > 1000) {
    transactions.splice(1000);
  }
  saveTransactions(transactions);
}
