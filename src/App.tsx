import './styles/globals.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AlertCenter } from './pages/AlertCenter';
import { CaseInvestigation } from './pages/CaseInvestigation';
import { TransactionSimulator } from './pages/TransactionSimulator';
import { CopilotAnalyst } from './pages/CopilotAnalyst';
import { AIInsights } from './pages/AIInsights';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const darkMode = useAppStore((state) => state.darkMode);

  return (
    <Router>
      <div className="bg-dark-bg text-white min-h-screen">
        <Navbar
          onToggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />

        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 overflow-auto">
            <div className="p-6 max-w-7xl mx-auto">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mb-4 p-2 hover:bg-dark-hover rounded-lg"
                title="Menú">
                ☰
              </button>

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alerts" element={<AlertCenter />} />
                <Route path="/investigation" element={<CaseInvestigation />} />
                <Route path="/simulator" element={<TransactionSimulator />} />
                <Route path="/copilot" element={<CopilotAnalyst />} />
                <Route path="/insights" element={<AIInsights />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
