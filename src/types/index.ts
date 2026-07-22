// Tipos principales de la aplicación
export interface Transaction {
  transactionId: string;
  customerId: string;
  customerName: string;
  country: string;
  channel: 'Web' | 'Mobile' | 'ATM' | 'Branch';
  amount: number;
  currency: string;
  timestamp: string;
  deviceType: string;
  riskScore: number;
  isFraud: boolean;
  status: 'Normal' | 'Revisar' | 'Sospechosa' | 'Fraude Confirmado';
  reason?: string;
  location?: string;
  merchantName?: string;
  merchantCategory?: string;
}

export interface Alert {
  id: string;
  transactionId: string;
  customerId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  riskScore: number;
}

export interface DashboardStats {
  totalTransactions: number;
  averageRiskScore: number;
  fraudsDetected: number;
  amountBlocked: number;
  successRate: number;
}

export interface FraudByRegion {
  country: string;
  fraudCount: number;
  percentage: number;
}

export interface FraudByChannel {
  channel: string;
  fraudCount: number;
  percentage: number;
}

export interface RiskDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  icon: string;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
}
