import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AIInsight } from '../types';
import { calculateDashboardStats, getFraudByRegion, getFraudByChannel } from '../data/generators';

export const AIInsights: React.FC = () => {
  const transactions = useAppStore((state) => state.transactions);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const simulateAttack = useAppStore((state) => state.simulateAttack);

  useEffect(() => {
    generateInsights();
  }, [transactions]);

  const generateInsights = () => {
    const stats = calculateDashboardStats(transactions);
    const fraudByRegion = getFraudByRegion(transactions);
    const fraudByChannel = getFraudByChannel(transactions);

    const newInsights: AIInsight[] = [];

    // Insight 1: General Status
    newInsights.push({
      id: '1',
      title: 'Estado General del Sistema',
      description: `${stats.fraudsDetected} fraudes detectados de ${stats.totalTransactions} transacciones (${((stats.fraudsDetected / stats.totalTransactions) * 100).toFixed(2)}%). El sistema está funcionando correctamente.`,
      severity: stats.fraudsDetected > 50 ? 'critical' : 'info',
      icon: '📊',
      trend: 'stable',
      timestamp: new Date().toISOString(),
    });

    // Insight 2: High Risk Transactions
    const highRiskCount = transactions.filter((t) => t.riskScore > 75).length;
    newInsights.push({
      id: '2',
      title: 'Transacciones de Alto Riesgo',
      description: `Se detectaron ${highRiskCount} transacciones con riesgo crítico (score > 75). Recomendamos revisar estos casos inmediatamente.`,
      severity: highRiskCount > 20 ? 'critical' : highRiskCount > 10 ? 'warning' : 'info',
      icon: '🚨',
      trend: highRiskCount > 30 ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    });

    // Insight 3: Regional Analysis
    const topRegion = [...fraudByRegion].sort((a, b) => b.fraudCount - a.fraudCount)[0];
    newInsights.push({
      id: '3',
      title: `Actividad Sospechosa en ${topRegion.country}`,
      description: `${topRegion.country} tiene la tasa más alta de fraude (${topRegion.percentage}%). Se recomienda fortalecer controles en esta región.`,
      severity: topRegion.fraudCount > 30 ? 'critical' : topRegion.fraudCount > 15 ? 'warning' : 'info',
      icon: '🌍',
      trend: 'up',
      timestamp: new Date().toISOString(),
    });

    // Insight 4: Channel Risk
    const risklyChannel = [...fraudByChannel].sort((a, b) => b.percentage - a.percentage)[0];
    newInsights.push({
      id: '4',
      title: `Vulnerabilidad en Canal ${risklyChannel.channel}`,
      description: `El canal ${risklyChannel.channel} presenta ${risklyChannel.percentage}% de tasa de fraude. Implementar validación adicional.`,
      severity: risklyChannel.percentage > 30 ? 'critical' : 'warning',
      icon: '📱',
      trend: 'up',
      timestamp: new Date().toISOString(),
    });

    // Insight 5: Pattern Detection
    const mobileHighRisk = transactions.filter((t) => t.channel === 'Mobile' && t.riskScore > 50).length;
    if (mobileHighRisk > transactions.filter((t) => t.channel === 'Mobile').length * 0.3) {
      newInsights.push({
        id: '5',
        title: 'Patrón Detectado: Dispositivos Móviles',
        description: `Se detectó que ${Math.round((mobileHighRisk / transactions.filter((t) => t.channel === 'Mobile').length) * 100)}% de transacciones móviles tienen riesgo moderado o alto.`,
        severity: 'warning',
        icon: '🔍',
        trend: 'up',
        timestamp: new Date().toISOString(),
      });
    }

    // Insight 6: Amount Analysis
    const largeTransactions = transactions.filter((t) => t.amount > 5000).length;
    const largeTransactionFraudRate =
      transactions.filter((t) => t.amount > 5000 && t.isFraud).length / (largeTransactions || 1);
    newInsights.push({
      id: '6',
      title: 'Transacciones de Alto Monto',
      description: `${largeTransactionFraudRate > 0.1 ? 'ALERTA: ' : ''}${largeTransactions} transacciones mayores a $5,000. Tasa de fraude: ${(largeTransactionFraudRate * 100).toFixed(1)}%.`,
      severity: largeTransactionFraudRate > 0.15 ? 'critical' : largeTransactionFraudRate > 0.1 ? 'warning' : 'info',
      icon: '💰',
      trend: largeTransactionFraudRate > 0.1 ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    });

    setInsights(newInsights);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-fraud-red/50 bg-fraud-red/10';
      case 'warning':
        return 'border-warning-orange/50 bg-warning-orange/10';
      case 'info':
        return 'border-ms-blue/50 bg-ms-blue/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟠';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-gray-400 mt-1">Recomendaciones y análisis generado por IA</p>
        </div>
        <button
          onClick={simulateAttack}
          className="px-6 py-3 bg-fraud-red hover:bg-fraud-red/80 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
          ⚔️ Simular Ataque
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`border-l-4 rounded-lg p-6 transition-all hover:shadow-lg ${getSeverityColor(insight.severity)}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{insight.icon}</span>
                <span className="text-2xl">{getSeverityIcon(insight.severity)}</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {new Date(insight.timestamp).toLocaleTimeString('es-ES')}
              </span>
            </div>

            <h3 className="font-semibold text-white text-lg mb-2">{insight.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{insight.description}</p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Tendencia:{' '}
                {insight.trend === 'up' && <span className="text-fraud-red ml-1">↑ Aumentando</span>}
                {insight.trend === 'down' && <span className="text-safe-green ml-1">↓ Disminuyendo</span>}
                {insight.trend === 'stable' && <span className="text-gray-400 ml-1">→ Estable</span>}
              </div>
              <button className="text-ms-blue hover:text-ms-blue-dark text-sm font-semibold">
                Detalles →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">📋 Recomendaciones del Sistema</h2>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">1️⃣</span>
            <div>
              <p className="font-semibold text-white">Aumentar validación en canales móviles</p>
              <p className="text-sm text-gray-400 mt-1">
                Implementar autenticación de dos factores (2FA) para todas las transacciones móviles
                mayores a $1,000.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">2️⃣</span>
            <div>
              <p className="font-semibold text-white">Monitoreo reforzado en regionesde alto riesgo</p>
              <p className="text-sm text-gray-400 mt-1">
                Asignar recursos adicionales para revisión manual en regiones con tasa de fraude
                superior al 10%.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">3️⃣</span>
            <div>
              <p className="font-semibold text-white">Validación de dispositivos desconocidos</p>
              <p className="text-sm text-gray-400 mt-1">
                Solicitar verificación adicional cuando se detecte acceso desde dispositivos no
                registrados previamente.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">4️⃣</span>
            <div>
              <p className="font-semibold text-white">Alertas en tiempo real para montos críticos</p>
              <p className="text-sm text-gray-400 mt-1">
                Configurar notificaciones inmediatas para transacciones mayores a $10,000 desde
                nuevos dispositivos.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">5️⃣</span>
            <div>
              <p className="font-semibold text-white">Machine Learning: Entrenar modelo con casos confirmados</p>
              <p className="text-sm text-gray-400 mt-1">
                Usar Azure AI Foundry para mejorar precisión del modelo con feedback de analistas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Info */}
      <div className="bg-gradient-to-br from-ms-blue/10 to-purple-600/10 border border-ms-blue/30 rounded-lg p-6">
        <h3 className="font-semibold text-white mb-3">🔗 Integración con Azure AI Foundry</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Este panel de insights está preparado para integración con <strong>Azure AI Foundry</strong>.
          Los insights actuales se generan con lógica de demostración. En producción:
        </p>
        <ul className="mt-3 text-sm text-gray-300 space-y-2 ml-4">
          <li>✓ Usar Azure OpenAI para generar análisis más complejos</li>
          <li>✓ Conectar con Microsoft Fabric para análisis de datos en tiempo real</li>
          <li>✓ Integrar Power BI para visualizaciones avanzadas</li>
          <li>✓ Usar Azure Event Hub para ingesta de datos en streaming</li>
          <li>✓ Implementar GitHub Actions para CI/CD</li>
        </ul>
      </div>
    </div>
  );
};
