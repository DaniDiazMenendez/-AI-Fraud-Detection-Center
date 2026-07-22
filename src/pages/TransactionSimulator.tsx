import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Transaction } from '../types';

interface SimulatorForm {
  customerId: string;
  customerName: string;
  amount: number;
  country: string;
  channel: string;
  deviceType: string;
  merchantName: string;
}

export const TransactionSimulator: React.FC = () => {
  const addTransaction = useAppStore((state) => state.addTransaction);
  const setSelectedTransaction = useAppStore((state) => state.setSelectedTransaction);
  const [form, setForm] = useState<SimulatorForm>({
    customerId: `CUST-${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(6, '0')}`,
    customerName: 'Cliente Simulado',
    amount: 500,
    country: 'Argentina',
    channel: 'Web',
    deviceType: 'Desktop Chrome',
    merchantName: 'Amazon',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const countries = ['Argentina', 'Brasil', 'Chile', 'México', 'Colombia', 'Perú'];
  const channels = ['Web', 'Mobile', 'ATM', 'Branch'];
  const deviceTypes = ['Desktop Chrome', 'Mobile iOS', 'Mobile Android', 'Tablet', 'ATM Machine'];
  const merchants = ['Amazon', 'Netflix', 'Spotify', 'Starbucks', 'Walmart', 'Target', 'Apple'];

  const calculateRiskScore = (): number => {
    let score = 0;

    // Amount factor
    if (form.amount > 5000) score += 30;
    else if (form.amount > 2000) score += 15;
    else if (form.amount > 1000) score += 5;

    // Channel factor
    if (form.channel === 'ATM') score += 5;
    if (form.channel === 'Mobile') score += 10;

    // Device factor
    if (form.deviceType.includes('Unknown')) score += 25;
    if (form.deviceType.includes('VPN')) score += 20;

    // Country factor
    if (form.country === 'México') score += 3;

    // Add some randomness
    score += Math.floor(Math.random() * 20) - 10;

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  const getStatus = (score: number): Transaction['status'] => {
    if (score < 30) return 'Normal';
    if (score < 50) return 'Revisar';
    if (score < 75) return 'Sospechosa';
    return 'Fraude Confirmado';
  };

  const getRecommendation = (score: number): string => {
    if (score < 30)
      return '✓ Transacción de bajo riesgo. Proceder normalmente.';
    if (score < 50)
      return '⚠️ Riesgo moderado. Recomendado revisar manualmente.';
    if (score < 75)
      return '⛔ Riesgo alto. Requiere verificación urgente.';
    return '🚫 Riesgo crítico. Recomendado bloquear.';
  };

  const handleSimulate = async () => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const riskScore = calculateRiskScore();
    const status = getStatus(riskScore);

    const newTransaction: Transaction = {
      transactionId: `TX-SIM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerId: form.customerId,
      customerName: form.customerName,
      country: form.country,
      channel: form.channel as any,
      amount: form.amount,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      deviceType: form.deviceType,
      riskScore,
      isFraud: riskScore > 75,
      status,
      reason: `Score simulado: ${riskScore}`,
      location: form.country,
      merchantName: form.merchantName,
      merchantCategory: 'Simulado',
    };

    setResult(newTransaction);
    addTransaction(newTransaction);
    setLoading(false);
  };

  const handleAddResult = () => {
    if (result) {
      setSelectedTransaction(result);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Simulador de Transacciones</h1>
        <p className="text-gray-400 mt-1">
          Genera transacciones sintéticas y prueba el motor de detección de fraude
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Parámetros de Transacción</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                ID Cliente
              </label>
              <input
                type="text"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                Nombre Cliente
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                Monto ($)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                País
              </label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                Canal
              </label>
              <select
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
                {channels.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                Tipo Dispositivo
              </label>
              <select
                value={form.deviceType}
                onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
                {deviceTypes.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                Comerciante
              </label>
              <select
                value={form.merchantName}
                onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
                {merchants.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full px-6 py-3 bg-ms-blue hover:bg-ms-blue-dark disabled:opacity-50 text-white font-semibold rounded-lg transition-all">
            {loading ? '⚙️ Procesando...' : '🚀 Simular Transacción'}
          </button>
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-1">
          {result ? (
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Resultado</h3>

              {/* Risk Score */}
              <div className="relative h-32 flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#3E3E42" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={
                      result.riskScore > 75
                        ? '#D13438'
                        : result.riskScore > 50
                          ? '#FFB900'
                          : '#107C10'
                    }
                    strokeWidth="10"
                    strokeDasharray={`${(result.riskScore / 100) * 314} 314`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-white">{result.riskScore}</span>
              </div>

              {/* Classification */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase font-semibold">Clasificación</p>
                <div
                  className={`px-4 py-2 rounded font-semibold text-center ${
                    result.riskScore < 30
                      ? 'bg-safe-green/20 text-safe-green'
                      : result.riskScore < 50
                        ? 'bg-warning-orange/20 text-warning-orange'
                        : result.riskScore < 75
                          ? 'bg-fraud-red/20 text-fraud-red'
                          : 'bg-fraud-red/40 text-fraud-red animate-glow'
                  }`}>
                  {result.riskScore < 30
                    ? '🟢 Bajo Riesgo'
                    : result.riskScore < 50
                      ? '🟡 Riesgo Medio'
                      : result.riskScore < 75
                        ? '🔴 Riesgo Alto'
                        : '🚨 Crítico'}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase font-semibold">Estado</p>
                <p className="text-white font-semibold">{result.status}</p>
              </div>

              {/* Recommendation */}
              <div className="space-y-2 pt-4 border-t border-dark-border">
                <p className="text-xs text-gray-400 uppercase font-semibold">Recomendación</p>
                <p className="text-sm text-gray-300">{getRecommendation(result.riskScore)}</p>
              </div>

              <button
                onClick={handleAddResult}
                className="w-full px-4 py-2 bg-ms-blue hover:bg-ms-blue-dark text-white font-semibold rounded transition-colors">
                Ir a Investigación →
              </button>
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-4xl mb-2">⚙️</p>
                <p className="text-gray-400">Configura y simula una transacción</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-ms-blue/10 border border-ms-blue/30 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          💡 <strong>Consejo:</strong> Prueba diferentes combinaciones de parámetros. Montos altos,
          canales móviles y dispositivos desconocidos incrementan el score de riesgo.
        </p>
      </div>
    </div>
  );
};
