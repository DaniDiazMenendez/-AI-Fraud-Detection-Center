import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Transaction } from '../types';

interface AIExplanation {
  title: string;
  explanation: string;
  factors: string[];
  recommendation: string;
}

export const CaseInvestigation: React.FC = () => {
  const selectedTransaction = useAppStore((state) => state.selectedTransaction);
  const transactions = useAppStore((state) => state.transactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(selectedTransaction);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);

  const handleTransactionSelect = (tx: Transaction) => {
    setSelectedTx(tx);
    // Generate AI explanation
    generateAIExplanation(tx);
  };

  const generateAIExplanation = (tx: Transaction) => {
    const factors: string[] = [];

    if (tx.riskScore > 75) {
      factors.push('Risk score crítico (>75)');
    }
    if (tx.amount > 5000) {
      factors.push('Monto de transacción elevado');
    }

    const sameCountryTxs = transactions.filter((t) => t.country === tx.country);
    const avgAmount = sameCountryTxs.reduce((sum, t) => sum + t.amount, 0) / sameCountryTxs.length;
    if (tx.amount > avgAmount * 3) {
      factors.push('Monto 3x superior al promedio del país');
    }

    if (tx.isFraud) {
      factors.push('Patrón coincide con transacciones fraudulentas previas');
      factors.push('Dispositivo no reconocido en registro histórico');
    }

    const explanation = `Esta transacción presenta comportamiento anómalo debido a múltiples factores convergentes. El score de riesgo de ${tx.riskScore}/100 indica alta probabilidad de fraude. 

Análisis detallado: ${tx.reason || 'Análisis en curso...'}

Recomendación: Se sugiere ${
      tx.riskScore > 80 ? 'bloqueo inmediato' : 'revisión manual urgente'
    } de esta transacción.`;

    setAiExplanation({
      title: `Análisis IA - ${tx.transactionId}`,
      explanation,
      factors,
      recommendation:
        tx.riskScore > 80
          ? '🔴 Bloquear inmediatamente'
          : tx.riskScore > 60
            ? '🟠 Requiere revisión urgente'
            : '🟢 Permitir con monitoreo',
    });
  };

  if (!selectedTx) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Investigación de Casos</h1>
          <p className="text-gray-400 mt-1">Selecciona una transacción para analizar</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400">
            No hay transacción seleccionada. Ve al Centro de Alertas y haz clic en "Revisar" para
            analizar una transacción.
          </p>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Transacciones Recientes</h2>
          <div className="grid gap-4">
            {transactions.slice(0, 5).map((tx) => (
              <button
                key={tx.transactionId}
                onClick={() => handleTransactionSelect(tx)}
                className="text-left bg-dark-card border border-dark-border rounded-lg p-4 hover:border-ms-blue hover:shadow-lg hover:shadow-ms-blue/20 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-ms-blue">{tx.transactionId}</p>
                    <p className="text-white font-semibold mt-1">{tx.customerName}</p>
                  </div>
                  <span className="text-fraud-red font-bold">{tx.riskScore}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Investigación de Casos</h1>
        <p className="text-gray-400 mt-1">Análisis detallado: {selectedTx.transactionId}</p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setSelectedTx(null)}
        className="text-ms-blue hover:text-ms-blue-dark transition-colors">
        ← Volver a seleccionar
      </button>

      {/* Transaction Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Details */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Detalles de la Transacción</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">ID Transacción</span>
              <span className="font-mono text-ms-blue font-semibold">{selectedTx.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monto</span>
              <span className="text-white font-semibold">
                ${selectedTx.amount.toLocaleString()} {selectedTx.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fecha</span>
              <span className="text-white">
                {new Date(selectedTx.timestamp).toLocaleString('es-ES')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Canal</span>
              <span className="text-white">{selectedTx.channel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dispositivo</span>
              <span className="text-white">{selectedTx.deviceType}</span>
            </div>
          </div>
        </div>

        {/* Customer Profile */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Perfil del Cliente</h2>

          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-xs uppercase">Nombre</p>
              <p className="text-white font-semibold text-lg">{selectedTx.customerName}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ID Cliente</span>
              <span className="text-white font-mono">{selectedTx.customerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">País</span>
              <span className="text-white">{selectedTx.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Comerciante</span>
              <span className="text-white">{selectedTx.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estado</span>
              <span
                className={`font-semibold px-3 py-1 rounded ${
                  selectedTx.status === 'Fraude Confirmado'
                    ? 'bg-fraud-red/40 text-fraud-red'
                    : selectedTx.status === 'Sospechosa'
                      ? 'bg-fraud-red/20 text-fraud-red'
                      : 'bg-warning-orange/20 text-warning-orange'
                }`}>
                {selectedTx.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score Analysis */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Análisis de Riesgo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3E3E42"
                  strokeWidth="10"/>
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={
                    selectedTx.riskScore > 75
                      ? '#D13438'
                      : selectedTx.riskScore > 50
                        ? '#FFB900'
                        : '#107C10'
                  }
                  strokeWidth="10"
                  strokeDasharray={`${(selectedTx.riskScore / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{selectedTx.riskScore}</span>
              </div>
            </div>
            <p className="mt-4 text-center font-semibold">
              {selectedTx.riskScore > 75
                ? '🔴 Alto Riesgo'
                : selectedTx.riskScore > 50
                  ? '🟠 Riesgo Medio'
                  : '🟢 Bajo Riesgo'}
            </p>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Factores de Riesgo</h3>
            {aiExplanation?.factors.map((factor, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-dark-bg rounded border border-dark-border">
                <span className="text-warning-orange">⚠️</span>
                <span className="text-gray-300 text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Investigation Summary */}
      {aiExplanation && (
        <div className="bg-gradient-to-br from-ms-blue/10 to-fraud-red/10 border border-ms-blue/30 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            🤖 Resumen de Investigación IA
          </h2>

          <div className="bg-dark-card/50 rounded p-4 text-gray-300 text-sm leading-relaxed">
            {aiExplanation.explanation}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <span className="text-gray-400">Recomendación del Sistema</span>
            <span className="text-lg font-bold">{aiExplanation.recommendation}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 px-6 py-3 bg-safe-green hover:bg-safe-green/80 text-white font-semibold rounded-lg transition-colors">
          ✓ Aprobar Transacción
        </button>
        <button className="flex-1 px-6 py-3 bg-fraud-red hover:bg-fraud-red/80 text-white font-semibold rounded-lg transition-colors">
          ✕ Bloquear Transacción
        </button>
        <button className="flex-1 px-6 py-3 bg-warning-orange hover:bg-warning-orange/80 text-white font-semibold rounded-lg transition-colors">
          📧 Contactar Cliente
        </button>
      </div>
    </div>
  );
};
