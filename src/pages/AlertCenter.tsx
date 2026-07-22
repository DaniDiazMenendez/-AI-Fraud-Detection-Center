import { useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';

interface Filters {
  country: string;
  channel: string;
  status: string;
  riskRange: string;
  search: string;
}

export const AlertCenter: React.FC = () => {
  const transactions = useAppStore((state) => state.transactions);
  const setSelectedTransaction = useAppStore((state) => state.setSelectedTransaction);
  const [filters, setFilters] = useState<Filters>({
    country: '',
    channel: '',
    status: '',
    riskRange: '',
    search: '',
  });
  const [sortField, setSortField] = useState<'riskScore' | 'amount' | 'timestamp'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply filters
    if (filters.country) {
      result = result.filter((t) => t.country === filters.country);
    }
    if (filters.channel) {
      result = result.filter((t) => t.channel === filters.channel);
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.riskRange === 'high') {
      result = result.filter((t) => t.riskScore >= 71);
    } else if (filters.riskRange === 'medium') {
      result = result.filter((t) => t.riskScore >= 31 && t.riskScore < 71);
    } else if (filters.riskRange === 'low') {
      result = result.filter((t) => t.riskScore < 31);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(search) ||
          t.customerId.toLowerCase().includes(search) ||
          t.customerName.toLowerCase().includes(search)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'timestamp') {
        aVal = new Date(a[sortField]).getTime();
        bVal = new Date(b[sortField]).getTime();
      }
      const aNum = typeof aVal === 'number' ? aVal : 0;
      const bNum = typeof bVal === 'number' ? bVal : 0;
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return result;
  }, [transactions, filters, sortField, sortOrder]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-safe-green';
    if (score < 50) return 'text-warning-orange';
    if (score < 75) return 'text-fraud-red/70';
    return 'text-fraud-red';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-safe-green/20 text-safe-green border border-safe-green/30';
      case 'Revisar':
        return 'bg-warning-orange/20 text-warning-orange border border-warning-orange/30';
      case 'Sospechosa':
        return 'bg-fraud-red/20 text-fraud-red border border-fraud-red/30';
      case 'Fraude Confirmado':
        return 'bg-fraud-red/40 text-fraud-red border border-fraud-red/60 animate-glow';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Centro de Alertas</h1>
        <p className="text-gray-400 mt-1">
          {filteredTransactions.length} alertas encontradas
        </p>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">BUSCAR</label>
            <input
              type="text"
              placeholder="ID, Cliente..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-ms-blue"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">PAÍS</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
              <option value="">Todos</option>
              <option value="Argentina">Argentina</option>
              <option value="Brasil">Brasil</option>
              <option value="Chile">Chile</option>
              <option value="México">México</option>
              <option value="Colombia">Colombia</option>
              <option value="Perú">Perú</option>
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">CANAL</label>
            <select
              value={filters.channel}
              onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
              <option value="">Todos</option>
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
              <option value="ATM">ATM</option>
              <option value="Branch">Branch</option>
            </select>
          </div>

          {/* Risk Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">RIESGO</label>
            <select
              value={filters.riskRange}
              onChange={(e) => setFilters({ ...filters, riskRange: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
              <option value="">Todos</option>
              <option value="low">Bajo (0-30)</option>
              <option value="medium">Medio (31-70)</option>
              <option value="high">Alto (71-100)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">ESTADO</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ms-blue">
              <option value="">Todos</option>
              <option value="Normal">Normal</option>
              <option value="Revisar">Revisar</option>
              <option value="Sospechosa">Sospechosa</option>
              <option value="Fraude Confirmado">Fraude Confirmado</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {Object.values(filters).some((v) => v) && (
          <button
            onClick={() =>
              setFilters({
                country: '',
                channel: '',
                status: '',
                riskRange: '',
                search: '',
              })
            }
            className="text-sm text-ms-blue hover:text-ms-blue-dark transition-colors">
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">
                  ID TRANSACCIÓN
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">CLIENTE</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">MONTO</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">PAÍS</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">CANAL</th>
                <th
                  className="px-6 py-4 text-left font-semibold text-gray-400 cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    if (sortField === 'riskScore') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('riskScore');
                      setSortOrder('desc');
                    }
                  }}>
                  SCORE {sortField === 'riskScore' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">ESTADO</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => (
                <tr
                  key={tx.transactionId}
                  className="border-b border-dark-border hover:bg-dark-hover transition-colors">
                  <td className="px-6 py-4 font-mono text-ms-blue">{tx.transactionId}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{tx.customerName}</p>
                      <p className="text-xs text-gray-500">{tx.customerId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    ${tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{tx.country}</td>
                  <td className="px-6 py-4 text-gray-400">{tx.channel}</td>
                  <td className={`px-6 py-4 font-semibold ${getRiskColor(tx.riskScore)}`}>
                    {tx.riskScore}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedTransaction(tx)}
                      className="text-ms-blue hover:text-ms-blue-dark font-semibold transition-colors">
                      Revisar →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-dark-border flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, filteredTransactions.length)} de{' '}
            {filteredTransactions.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-dark-bg hover:bg-dark-hover disabled:opacity-50 text-white text-sm">
              ← Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded text-sm ${
                      currentPage === page
                        ? 'bg-ms-blue text-white'
                        : 'bg-dark-bg hover:bg-dark-hover text-white'
                    }`}>
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-dark-bg hover:bg-dark-hover disabled:opacity-50 text-white text-sm">
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
