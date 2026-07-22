import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ChatMessage } from '../types';
import { calculateDashboardStats, getFraudByRegion, getFraudByChannel } from '../data/generators';

export const CopilotAnalyst: React.FC = () => {
  const transactions = useAppStore((state) => state.transactions);
  const chatMessages = useAppStore((state) => state.chatMessages);
  const addChatMessage = useAppStore((state) => state.addChatMessage);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    const stats = calculateDashboardStats(transactions);
    const fraudByRegion = getFraudByRegion(transactions);
    const fraudByChannel = getFraudByChannel(transactions);

    const lowerMessage = userMessage.toLowerCase();

    // Predefined responses
    if (
      lowerMessage.includes('riesg') &&
      (lowerMessage.includes('transaccion') || lowerMessage.includes('alto'))
    ) {
      const highRiskTxs = transactions.filter((t) => t.riskScore > 75).slice(0, 5);
      return `He identificado ${highRiskTxs.length} transacciones de alto riesgo (score > 75):
      
${highRiskTxs.map((t) => `• ${t.transactionId}: ${t.customerName} - $${t.amount} (Score: ${t.riskScore})`).join('\n')}

Recomendación: Revisar estos casos inmediatamente.`;
    }

    if (lowerMessage.includes('region') && lowerMessage.includes('fraude')) {
      const sortedRegions = [...fraudByRegion].sort((a, b) => b.fraudCount - a.fraudCount);
      const topRegion = sortedRegions[0];
      return `La región con mayor fraude es **${topRegion.country}** con ${topRegion.fraudCount} casos (${topRegion.percentage}% del total).

Ranking de fraude por región:
${sortedRegions.map((r, i) => `${i + 1}. ${r.country}: ${r.fraudCount} fraudes (${r.percentage}%)`).join('\n')}

Recomendación: Fortalecer controles en ${topRegion.country}.`;
    }

    if (lowerMessage.includes('canal') && lowerMessage.includes('fraude')) {
      const sortedChannels = [...fraudByChannel].sort((a, b) => b.fraudCount - a.fraudCount);
      return `Fraude detectado por canal de acceso:

${sortedChannels.map((c) => `• **${c.channel}**: ${c.fraudCount} casos (${c.percentage}%)`).join('\n')}

El canal ${sortedChannels[0].channel} tiene la tasa más alta de fraude.`;
    }

    if (lowerMessage.includes('resumen') || lowerMessage.includes('general')) {
      return `📊 **Resumen General de Fraude**

• Total de transacciones: ${stats.totalTransactions}
• Fraudes detectados: ${stats.fraudsDetected}
• Tasa de fraude: ${((stats.fraudsDetected / stats.totalTransactions) * 100).toFixed(2)}%
• Monto bloqueado: $${stats.amountBlocked.toLocaleString()}
• Score de riesgo promedio: ${stats.averageRiskScore}/100
• Tasa de éxito: ${stats.successRate}%

Recomendación: Los indicadores muestran actividad fraudulenta moderada. Continuar monitoreo.`;
    }

    if (lowerMessage.includes('tendencia') || lowerMessage.includes('patron')) {
      const recentFrauds = transactions.filter((t) => t.isFraud).length;
      const olderFrauds = Math.floor(recentFrauds * 0.7);
      const trend = recentFrauds > olderFrauds ? 'aumentando' : 'disminuyendo';

      return `📈 **Análisis de Tendencias**

Se detecta que la actividad fraudulenta está ${trend}.

Patrones observados:
• Picos de fraude en horarios nocturnos
• Correlación entre montos altos y riesgo
• Dispositivos desconocidos tienen 3x mayor riesgo
• Canales móviles presentan vulnerabilidades

Acción recomendada: Implementar validación adicional en horarios de riesgo.`;
    }

    if (lowerMessage.includes('tx-') || lowerMessage.includes('transaccion')) {
      const match = userMessage.match(/TX-[A-Z0-9]+/i);
      if (match) {
        const txId = match[0];
        const tx = transactions.find((t) => t.transactionId === txId);
        if (tx) {
          return `📋 **Detalles de ${txId}**

Cliente: ${tx.customerName}
Monto: $${tx.amount}
País: ${tx.country}
Canal: ${tx.channel}
Score de Riesgo: ${tx.riskScore}/100
Estado: ${tx.status}

${tx.reason ? `Razón: ${tx.reason}` : ''}

¿Necesitas más información sobre esta transacción?`;
        }
      }
      return 'No encontré esa transacción. Por favor, verifica el ID.';
    }

    // Default response
    return `¡Hola! Soy tu asistente IA para análisis de fraude. Puedo ayudarte con preguntas como:

📊 "¿Cuál es el resumen general?"
🔴 "¿Cuáles son las transacciones más riesgosas?"
🌍 "¿Qué región tiene más fraude?"
📱 "¿Cuál es el canal con más fraude?"
📈 "¿Cuáles son las tendencias?"
🔍 "¿Info de TX-XXXXX?"

Hazme una pregunta para comenzar.`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    });

    // Generate and add AI response
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

    const aiResponse = await generateResponse(userMessage);

    addChatMessage({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });

    setIsLoading(false);
  };

  const suggestedQuestions = [
    '¿Cuáles son las transacciones más riesgosas?',
    '¿Qué región tiene más fraude?',
    '¿Cuál es el canal con más fraude?',
    'Resume el análisis general',
    '¿Cuáles son las tendencias?',
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white">Copilot para Analistas</h1>
        <p className="text-gray-400 mt-1">Asistente IA para análisis de fraude en tiempo real</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-dark-card border border-dark-border rounded-lg overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-xl font-semibold text-white mb-2">Bienvenido al Copilot IA</p>
              <p className="text-gray-400 mb-8">Hazme preguntas sobre fraude y análisis de riesgo</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => {
                      setInput(question);
                    }}
                    className="text-left px-4 py-3 bg-dark-bg hover:bg-dark-hover border border-dark-border rounded transition-colors text-sm text-gray-300 hover:text-white">
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-ms-blue text-white rounded-br-none'
                        : 'bg-dark-bg text-gray-200 rounded-bl-none border border-dark-border'
                    }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-bg border border-dark-border rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-ms-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-ms-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-ms-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-dark-border p-4 bg-dark-bg">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ms-blue disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-ms-blue hover:bg-ms-blue-dark disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
              {isLoading ? '...' : '→'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-ms-blue/10 border border-ms-blue/30 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          ✨ <strong>IA Powered:</strong> Respuestas basadas en análisis de datos en tiempo real
          usando Azure AI Foundry (simulado).
        </p>
      </div>
    </div>
  );
};
