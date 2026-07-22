import { Transaction } from '../types';

const COUNTRIES = ['Argentina', 'Brasil', 'Chile', 'México', 'Colombia', 'Perú'];
const CHANNELS = ['Web', 'Mobile', 'ATM', 'Branch'] as const;
type ChannelType = typeof CHANNELS[number];
const DEVICE_TYPES = [
  'Desktop Chrome',
  'Mobile iOS',
  'Mobile Android',
  'Tablet',
  'ATM Machine',
  'Branch POS',
];
const MERCHANTS = [
  'Amazon',
  'Netflix',
  'Spotify',
  'Starbucks',
  'Walmart',
  'Target',
  'Best Buy',
  'Apple Store',
  'Delta Airlines',
  'Marriott Hotels',
  'Uber',
  'Airbnb',
];

const CUSTOMER_NAMES = [
  'Carlos Martínez',
  'María García',
  'Juan López',
  'Ana Rodríguez',
  'Pedro Sánchez',
  'Laura Fernández',
  'José Ramírez',
  'Rosa Morales',
  'Luis González',
  'Elena Torres',
];

function generateTransactionId(): string {
  return `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateCustomerId(): string {
  return `CUST-${Math.floor(Math.random() * 100000)
    .toString()
    .padStart(6, '0')}`;
}

function generateRiskScore(): number {
  // Distribución: 70% bajo riesgo, 20% medio, 10% alto
  const rand = Math.random();
  if (rand < 0.7) {
    return Math.floor(Math.random() * 30);
  } else if (rand < 0.9) {
    return Math.floor(Math.random() * 40) + 31;
  } else {
    return Math.floor(Math.random() * 30) + 71;
  }
}

function getStatus(riskScore: number): Transaction['status'] {
  if (riskScore < 30) return 'Normal';
  if (riskScore < 50) return 'Revisar';
  if (riskScore < 75) return 'Sospechosa';
  return 'Fraude Confirmado';
}

function getRandomDate(daysBack: number = 30): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * daysBack);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);

  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  return now;
}

function getRandomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateMockTransactions(count: number = 500): Transaction[] {
  const transactions: Transaction[] = [];
  const fraudPercentage = 0.05; // 5% fraud

  for (let i = 0; i < count; i++) {
    const riskScore = generateRiskScore();
    const isFraud = Math.random() < fraudPercentage && riskScore > 70;
    const channel = getRandomElement(CHANNELS) as ChannelType;
    const amount = Math.floor(Math.random() * 5000) + 10;
    const timestamp = getRandomDate();

    let reason = '';
    if (isFraud || riskScore > 75) {
      reason = getRandomFraudReason();
    }

    transactions.push({
      transactionId: generateTransactionId(),
      customerId: generateCustomerId(),
      customerName: getRandomElement(CUSTOMER_NAMES),
      country: getRandomElement(COUNTRIES),
      channel,
      amount,
      currency: 'USD',
      timestamp: timestamp.toISOString(),
      deviceType: getRandomElement(DEVICE_TYPES),
      riskScore: isFraud ? Math.floor(Math.random() * 25) + 76 : riskScore,
      isFraud,
      status: getStatus(isFraud ? Math.floor(Math.random() * 25) + 76 : riskScore),
      reason,
      location: getRandomElement(COUNTRIES),
      merchantName: getRandomElement(MERCHANTS),
      merchantCategory: 'E-commerce',
    });
  }

  return transactions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

function getRandomFraudReason(): string {
  const reasons = [
    'Transacción fuera de horario habitual del cliente',
    'Ubicación geográfica inconsistente',
    'Monto significativamente mayor al promedio',
    'Múltiples transacciones en corto período',
    'Dispositivo o navegador desconocido',
    'País de origen diferente al del cliente',
    'Actividad sospechosa detectada por patrón de comportamiento',
    'Transacción rechazada previamente por fraude',
    'Velocidad inusual de transacciones',
    'Monto coincide con transacción fraudulenta anterior',
  ];

  return getRandomElement(reasons);
}

export function calculateDashboardStats(transactions: Transaction[]) {
  const frauds = transactions.filter((t) => t.isFraud);
  const fraudAmount = frauds.reduce((sum, t) => sum + t.amount, 0);
  const avgRiskScore =
    transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length;

  return {
    totalTransactions: transactions.length,
    averageRiskScore: Math.round(avgRiskScore),
    fraudsDetected: frauds.length,
    amountBlocked: fraudAmount,
    successRate: Math.round(((transactions.length - frauds.length) / transactions.length) * 100),
  };
}

export function getFraudByRegion(transactions: Transaction[]) {
  const fraudsByCountry: { [key: string]: number } = {};
  const countByCountry: { [key: string]: number } = {};

  transactions.forEach((t) => {
    countByCountry[t.country] = (countByCountry[t.country] || 0) + 1;
    if (t.isFraud) {
      fraudsByCountry[t.country] = (fraudsByCountry[t.country] || 0) + 1;
    }
  });

  return COUNTRIES.map((country) => ({
    country,
    fraudCount: fraudsByCountry[country] || 0,
    percentage: Math.round(
      ((fraudsByCountry[country] || 0) / (countByCountry[country] || 1)) * 100
    ),
  }));
}

export function getFraudByChannel(transactions: Transaction[]) {
  const fraudsByChannel: { [key: string]: number } = {};
  const countByChannel: { [key: string]: number } = {};

  transactions.forEach((t) => {
    countByChannel[t.channel] = (countByChannel[t.channel] || 0) + 1;
    if (t.isFraud) {
      fraudsByChannel[t.channel] = (fraudsByChannel[t.channel] || 0) + 1;
    }
  });

  return CHANNELS.map((channel) => ({
    channel,
    fraudCount: fraudsByChannel[channel] || 0,
    percentage: Math.round(
      ((fraudsByChannel[channel] || 0) / (countByChannel[channel] || 1)) * 100
    ),
  }));
}

export function getRiskDistribution(transactions: Transaction[]) {
  const ranges = [
    { range: '0-30', min: 0, max: 30 },
    { range: '31-50', min: 31, max: 50 },
    { range: '51-70', min: 51, max: 70 },
    { range: '71-85', min: 71, max: 85 },
    { range: '86-100', min: 86, max: 100 },
  ];

  return ranges.map((r) => {
    const count = transactions.filter((t) => t.riskScore >= r.min && t.riskScore <= r.max).length;
    return {
      range: r.range,
      count,
      percentage: Math.round((count / transactions.length) * 100),
    };
  });
}

export function getTimeSeriesData(transactions: Transaction[]) {
  const dailyData: { [key: string]: { date: string; total: number; fraud: number } } = {};

  transactions.forEach((t) => {
    const date = new Date(t.timestamp).toLocaleDateString('es-ES');
    if (!dailyData[date]) {
      dailyData[date] = { date, total: 0, fraud: 0 };
    }
    dailyData[date].total++;
    if (t.isFraud) {
      dailyData[date].fraud++;
    }
  });

  return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
