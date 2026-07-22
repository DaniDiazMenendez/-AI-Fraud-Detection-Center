import { create } from 'zustand';
import { Transaction, ChatMessage, AIInsight } from '../types';
import { getTransactions, saveTransactions } from '../data/transactions';

interface AppStore {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  chatMessages: ChatMessage[];
  aiInsights: AIInsight[];
  darkMode: boolean;
  
  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  addTransactions: (transactions: Transaction[]) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setAIInsights: (insights: AIInsight[]) => void;
  toggleDarkMode: () => void;
  simulateAttack: () => void;
  clearChatMessages: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  transactions: getTransactions(),
  selectedTransaction: null,
  chatMessages: [],
  aiInsights: [],
  darkMode: true,

  setTransactions: (transactions) => {
    saveTransactions(transactions);
    set({ transactions });
  },

  addTransaction: (transaction) => {
    const current = get().transactions;
    const updated = [transaction, ...current];
    saveTransactions(updated);
    set({ transactions: updated });
  },

  addTransactions: (newTransactions) => {
    const current = get().transactions;
    const updated = [...newTransactions, ...current];
    if (updated.length > 1000) {
      updated.splice(1000);
    }
    saveTransactions(updated);
    set({ transactions: updated });
  },

  setSelectedTransaction: (transaction) => {
    set({ selectedTransaction: transaction });
  },

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }));
  },

  setAIInsights: (insights) => {
    set({ aiInsights: insights });
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      document.documentElement.classList.toggle('dark', newDarkMode);
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      return { darkMode: newDarkMode };
    });
  },

  simulateAttack: () => {
    const current = get().transactions;
    const fraudTransactions: Transaction[] = [];
    const countries = ['Argentina', 'Brasil', 'Chile', 'México', 'Colombia', 'Perú'];
    const channels = ['Web', 'Mobile', 'ATM', 'Branch'] as const;
    const merchants = ['Amazon', 'Netflix', 'Spotify', 'Walmart', 'Target'];

    // Generate 20 fraudulent transactions
    for (let i = 0; i < 20; i++) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - i);

      fraudTransactions.push({
        transactionId: `TX-FRAUD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        customerId: `CUST-${Math.floor(Math.random() * 100000)
          .toString()
          .padStart(6, '0')}`,
        customerName: `Fraudster ${i + 1}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        amount: Math.floor(Math.random() * 10000) + 5000,
        currency: 'USD',
        timestamp: now.toISOString(),
        deviceType: 'Unknown VPN',
        riskScore: Math.floor(Math.random() * 25) + 85,
        isFraud: true,
        status: 'Fraude Confirmado',
        reason: 'Simulación de ataque coordinado detectada',
        location: countries[Math.floor(Math.random() * countries.length)],
        merchantName: merchants[Math.floor(Math.random() * merchants.length)],
        merchantCategory: 'Suspicious',
      });
    }

    const updated = [...fraudTransactions, ...current];
    if (updated.length > 1000) {
      updated.splice(1000);
    }
    saveTransactions(updated);
    set({ transactions: updated });
  },

  clearChatMessages: () => {
    set({ chatMessages: [] });
  },
}));

// Initialize dark mode from localStorage
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode !== null) {
  const isDarkMode = JSON.parse(savedDarkMode);
  if (!isDarkMode) {
    document.documentElement.classList.toggle('dark', false);
  }
}
