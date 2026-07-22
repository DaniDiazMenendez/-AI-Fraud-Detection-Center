import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { KPICard } from '../components/KPICard';
import {
  calculateDashboardStats,
  getFraudByRegion,
  getFraudByChannel,
  getTimeSeriesData,
} from '../data/generators';

export const Dashboard: React.FC = () => {
  const transactions = useAppStore((state) => state.transactions);
  const [stats, setStats] = useState<any>(null);
  const [fraudByRegion, setFraudByRegion] = useState<any[]>([]);
  const [fraudByChannel, setFraudByChannel] = useState<any[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);

  useEffect(() => {
    setStats(calculateDashboardStats(transactions));
    setFraudByRegion(getFraudByRegion(transactions));
    setFraudByChannel(getFraudByChannel(transactions));
    setTimeSeriesData(getTimeSeriesData(transactions));
  }, [transactions]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin text-ms-blue text-4xl">⚙️</div>
      </div>
    );
  }

  const fraudRate = Math.round((stats.fraudsDetected / stats.totalTransactions) * 100);

  const COLORS = ['#D13438', '#107C10', '#FFB900', '#0078D4', '#6B69D6', '#038387'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Ejecutivo</h1>
        <p className="text-gray-400 mt-1">
          Resumen de detección de fraude y análisis de riesgo
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Transacciones"
          value={stats.totalTransactions}
          subtext={`${fraudRate}% sospechosas`}
          icon="💳"
          color="blue"
          trend="stable"
          animated
        />
        <KPICard
          title="Riesgo Promedio"
          value={`${stats.averageRiskScore}/100`}
          subtext="Score IA"
          icon="📈"
          color="orange"
          trend={stats.averageRiskScore > 50 ? 'up' : 'down'}
          animated
        />
        <KPICard
          title="Fraudes Detectados"
          value={stats.fraudsDetected}
          subtext={`${fraudRate}% del total`}
          icon="🚨"
          color="red"
          trend="up"
          animated
        />
        <KPICard
          title="Monto Bloqueado"
          value={`$${stats.amountBlocked.toLocaleString()}`}
          subtext="USD"
          icon="🔒"
          color="green"
          trend="up"
          animated
        />
      </div>

      {/* Success Rate Bar */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Tasa de Éxito</h2>
        <div className="relative h-8 bg-dark-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-safe-green to-safe-green/50 transition-all duration-500 flex items-center justify-center"
            style={{ width: `${stats.successRate}%` }}>
            <span className="text-white text-xs font-bold">
              {stats.successRate}%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {stats.totalTransactions - stats.fraudsDetected} transacciones legítimas
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud by Channel */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fraude por Canal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3E3E42" />
              <XAxis dataKey="channel" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#252526',
                  border: '1px solid #3E3E42',
                }}
              />
              <Bar dataKey="fraudCount" fill="#D13438" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud by Region */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Fraude por Región</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudByRegion}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ country, percentage }) => `${country}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="fraudCount">
                {fraudByRegion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#252526',
                  border: '1px solid #3E3E42',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Evolución Temporal</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3E3E42" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#252526',
                border: '1px solid #3E3E42',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#0078D4"
              strokeWidth={2}
              dot={false}
              name="Total Transacciones"
            />
            <Line
              type="monotone"
              dataKey="fraud"
              stroke="#D13438"
              strokeWidth={2}
              dot={false}
              name="Fraudes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
