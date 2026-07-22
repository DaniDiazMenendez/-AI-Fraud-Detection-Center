import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onToggleDarkMode?: () => void;
  darkMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleDarkMode, darkMode = true }) => {
  return (
    <nav className="bg-dark-bg border-b border-dark-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ms-blue to-ms-blue-dark rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🛡️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Fraud Detection</h1>
            <p className="text-xs text-gray-500">Enterprise Center</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          <div className="flex items-center gap-2 pl-4 border-l border-dark-border">
            <div className="w-8 h-8 bg-ms-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
              AD
            </div>
            <span className="text-sm text-gray-400">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
