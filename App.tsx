import React, { useState, useEffect, useCallback } from 'react';
import { AnalysisModel, CalibrationParams, SensorReading, ViewState, AnalysisResult } from './types';
import { DEFAULT_MODELS, generateMockReadings } from './constants';
import { calculateResults } from './services/analysisEngine';
import Dashboard from './components/Dashboard';
import Configuration from './components/Configuration';
import DataImport from './components/DataImport';
import Reports from './components/Reports';
import Documentation from './components/Documentation';
import { LayoutDashboard, Settings, FileInput, Menu, Activity, FileText, Book } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>('dashboard');
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [models, setModels] = useState<AnalysisModel[]>(DEFAULT_MODELS);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- Actions ---

  // Handle Resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recalculate whenever readings or models change
  useEffect(() => {
    if (readings.length > 0) {
      const newResults = calculateResults(readings, models);
      setResults(newResults);
    } else {
      setResults([]);
    }
  }, [readings, models]);

  const handleUpdateModel = useCallback((modelId: string, params: CalibrationParams) => {
    setModels(prev => prev.map(m => 
      m.id === modelId ? { ...m, params } : m
    ));
  }, []);

  const handleResetModels = () => {
    setModels(DEFAULT_MODELS);
  };

  const handleImportData = () => {
    // Simulate new data import by regenerating random data
    const newData = generateMockReadings();
    setReadings(newData);
    setView('dashboard');
  };

  // --- Render ---

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} ${isMobile && !isSidebarOpen ? 'w-0' : ''} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20 absolute md:relative h-full`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2 font-bold text-xl tracking-tight animate-in fade-in">
              <Activity className="text-blue-500" />
              <span>SensorFlow</span>
            </div>
          ) : (
            <Activity className="text-blue-500" />
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="Panel Principal" 
            isActive={view === 'dashboard'} 
            isExpanded={isSidebarOpen}
            onClick={() => { setView('dashboard'); if(isMobile) setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Settings />} 
            label="Calibración" 
            isActive={view === 'configuration'} 
            isExpanded={isSidebarOpen}
            onClick={() => { setView('configuration'); if(isMobile) setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<FileInput />} 
            label="Importar Datos" 
            isActive={view === 'data-import'} 
            isExpanded={isSidebarOpen}
            onClick={() => { setView('data-import'); if(isMobile) setSidebarOpen(false); }} 
          />
          <div className="pt-4 pb-2 border-t border-slate-800 mt-4">
             {isSidebarOpen && <span className="text-xs text-slate-500 px-3 uppercase font-semibold">Salida</span>}
          </div>
          <SidebarItem 
            icon={<FileText />} 
            label="Reportes" 
            isActive={view === 'reports'} 
            isExpanded={isSidebarOpen}
            onClick={() => { setView('reports'); if(isMobile) setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Book />} 
            label="Documentación" 
            isActive={view === 'documentation'} 
            isExpanded={isSidebarOpen}
            onClick={() => { setView('documentation'); if(isMobile) setSidebarOpen(false); }} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          {isSidebarOpen && <p>&copy; 2024 Analytics Corp</p>}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 z-10"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
             <div className="text-sm text-slate-500 text-right hidden sm:block">
               <p className="font-medium text-slate-700">Proyecto: Análisis Multi-Canal</p>
               <p className="text-xs">Estado del Sistema: {readings.length > 0 ? 'Datos Cargados' : 'Esperando Datos'}</p>
             </div>
             <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border ${readings.length > 0 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
               {readings.length > 0 ? 'A' : '-'}
             </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {view === 'dashboard' && (
              <Dashboard 
                readings={readings} 
                results={results} 
                models={models} 
                onNavigate={() => setView('data-import')}
              />
            )}
            {view === 'configuration' && (
              <Configuration 
                models={models} 
                onUpdateModel={handleUpdateModel} 
                onReset={handleResetModels}
              />
            )}
            {view === 'data-import' && (
              <DataImport onImport={handleImportData} />
            )}
            {view === 'reports' && (
              <Reports results={results} models={models} readings={readings} />
            )}
            {view === 'documentation' && (
              <Documentation />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Subcomponent for Sidebar
const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`min-w-[24px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{icon}</div>
    <span 
      className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
        isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
      }`}
    >
      {label}
    </span>
  </button>
);

export default App;