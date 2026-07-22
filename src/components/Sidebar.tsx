import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  path: string;
  icon: string;
  label: string;
  description?: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    icon: '📊',
    label: 'Dashboard',
    description: 'Panel ejecutivo',
  },
  {
    path: '/alerts',
    icon: '🚨',
    label: 'Centro de Alertas',
    description: 'Alertas en tiempo real',
  },
  {
    path: '/investigation',
    icon: '🔍',
    label: 'Investigación',
    description: 'Análisis de casos',
  },
  {
    path: '/simulator',
    icon: '⚙️',
    label: 'Simulador',
    description: 'Generar transacciones',
  },
  {
    path: '/copilot',
    icon: '💬',
    label: 'Copilot',
    description: 'Asistente IA',
  },
  {
    path: '/insights',
    icon: '✨',
    label: 'AI Insights',
    description: 'Recomendaciones',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-dark-bg border-r border-dark-border transition-transform duration-300 z-40 pt-20 lg:pt-0 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <nav className="h-full overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-ms-blue text-white shadow-lg shadow-ms-blue/30'
                    : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong>Versión:</strong> 1.0.0
            </p>
            <p>
              <strong>Ambiente:</strong> Demo
            </p>
            <p className="text-gray-600">
              Powered by Azure AI Foundry & Microsoft Fabric
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
