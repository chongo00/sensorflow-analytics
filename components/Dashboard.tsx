import React, { useMemo } from 'react';
import { AnalysisModel, AnalysisResult, SensorReading } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { AlertTriangle, Activity, Database, CheckCircle, UploadCloud } from 'lucide-react';

interface DashboardProps {
  readings: SensorReading[];
  results: AnalysisResult[];
  models: AnalysisModel[];
  onNavigate?: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ readings, results, models, onNavigate }) => {
  
  // Empty State Handling
  if (readings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in duration-500">
        <div className="bg-slate-100 p-8 rounded-full">
          <Database className="w-16 h-16 text-slate-400" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">No hay datos cargados</h2>
          <p className="text-slate-500">
            El sistema está esperando entradas. Importe un archivo de sensores (Excel/CSV) para ejecutar el análisis automático.
          </p>
        </div>
        <button 
          onClick={onNavigate}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <UploadCloud className="w-5 h-5" />
          <span>Ir a Importar Datos</span>
        </button>
      </div>
    );
  }

  // Prepare data for the Calculated Results Chart
  const chartData = useMemo(() => {
    const map = new Map<number, any>();
    
    // Initialize with time
    readings.forEach(r => {
      map.set(r.timestamp_sec, {
        time: r.time_hours,
        timestamp: r.timestamp_sec,
        // Also map raw channels for context if needed
        ch4: r.channel_4_mW,
        ch5: r.channel_5_mW,
        ch6: r.channel_6_mW,
        ch7: r.channel_7_mW,
        ch8: r.channel_8_mW,
      });
    });

    results.forEach(res => {
      const entry = map.get(res.timestamp_sec);
      if (entry) {
        const model = models.find(m => m.id === res.modelId);
        if (model) {
          entry[`${model.name}`] = res.calculatedValue;
          entry[`${model.name}_status`] = res.status;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [readings, results, models]);

  const xxxCount = results.filter(r => r.status === 'XXX').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Lecturas Totales</p>
              <h3 className="text-2xl font-bold text-slate-800">{readings.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Modelos Activos</p>
              <h3 className="text-2xl font-bold text-slate-800">{models.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Cálculos Realizados</p>
              <h3 className="text-2xl font-bold text-slate-800">{results.length}</h3>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl shadow-sm border ${xxxCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${xxxCount > 0 ? 'bg-red-200' : 'bg-slate-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${xxxCount > 0 ? 'text-red-700' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${xxxCount > 0 ? 'text-red-700' : 'text-slate-500'}`}>Anomalías (XXX)</p>
              <h3 className={`text-2xl font-bold ${xxxCount > 0 ? 'text-red-800' : 'text-slate-800'}`}>{xxxCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Resultados de Análisis Calculados</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Tiempo (horas)', position: 'insideBottomRight', offset: -5 }} 
                stroke="#64748b"
              />
              <YAxis label={{ value: 'Valor Resultante', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(value) => `Tiempo: ${value}h`}
              />
              <Legend />
              {models.map((model, index) => (
                <Line
                  key={model.id}
                  type="monotone"
                  dataKey={model.name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
              {/* Highlight XXX areas - simplified visual aid */}
              {chartData.some(d => Object.values(d).some(v => v === 'XXX')) && (
                 <ReferenceArea y1={0} y2={10} label="Zona de Anomalía" fill="red" fillOpacity={0.05} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Raw Data Reference Chart */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Entradas de Sensores (mW)</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ch4" name="Canal 4" stroke="#94a3b8" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="ch5" name="Canal 5" stroke="#cbd5e1" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="ch6" name="Canal 6" stroke="#475569" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="ch7" name="Canal 7" stroke="#64748b" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="ch8" name="Canal 8" stroke="#334155" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;