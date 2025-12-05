import React, { useState } from 'react';
import { AnalysisModel, CalibrationParams } from '../types';
import { Save, RefreshCw, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

interface ConfigurationProps {
  models: AnalysisModel[];
  onUpdateModel: (modelId: string, params: CalibrationParams) => void;
  onReset: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ models, onUpdateModel, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleParamChange = (modelId: string, paramName: keyof CalibrationParams, value: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    const numValue = parseFloat(value);
    
    const newParams = {
      ...model.params,
      [paramName]: isNaN(numValue) ? 0 : numValue,
    };

    onUpdateModel(modelId, newParams);
  };

  // Group parameters
  const basicKeys: (keyof CalibrationParams)[] = ['zero', 'min_threshold'];
  const advancedKeys: (keyof CalibrationParams)[] = [
    'm_cpo', 'm_agua', 'm_arcilla', 'm_pasta', 
    'percent_cpo', 'percent_agua', 'percent_arcilla'
  ];

  const labels: Record<keyof CalibrationParams, string> = {
    m_cpo: 'Pendiente m (CPO)',
    m_agua: 'Pendiente m (Agua)',
    m_arcilla: 'Pendiente m (Arcilla)',
    m_pasta: 'Pendiente m (Pasta)',
    percent_cpo: '% CPO (Normalización)',
    percent_agua: '% Agua',
    percent_arcilla: '% Arcilla',
    zero: 'Punto Cero (Offset)',
    min_threshold: 'Umbral Mínimo (Dispara XXX)'
  };

  const renderTable = (keys: (keyof CalibrationParams)[], title: string, description: string) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold min-w-[200px]">Parámetro</th>
              {models.map(m => (
                <th key={m.id} className="px-4 py-4 text-center border-l border-slate-100 min-w-[120px]">
                  <div className="flex flex-col items-center">
                    <span className="text-base font-bold text-slate-700">{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Origen: {m.sourceChannel}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <td className="px-6 py-3 font-medium text-slate-700 bg-slate-50/30">
                  {labels[key]}
                </td>
                {models.map(model => (
                  <td key={`${model.id}-${key}`} className="px-4 py-2 border-l border-slate-100 text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={model.params[key]}
                      onChange={(e) => handleParamChange(model.id, key, e.target.value)}
                      className="w-full text-center bg-transparent border border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded px-2 py-1 focus:outline-none focus:bg-white transition-all font-mono text-slate-600"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configuración de Calibración</h2>
          <p className="text-slate-500">Modifique los parámetros para cada modelo. Los cambios se aplican automáticamente al cálculo.</p>
        </div>
        <div className="flex space-x-3">
           <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border ${
              showAdvanced 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{showAdvanced ? 'Ocultar Avanzados' : 'Mostrar Avanzados'}</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
          </button>

          <button 
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Restaurar Valores</span>
          </button>
        </div>
      </div>

      {renderTable(basicKeys, 'Ajustes Básicos', 'Configure los umbrales de detección y puntos cero para la operación diaria.')}

      {showAdvanced && (
        renderTable(advancedKeys, 'Coeficientes Matemáticos Avanzados', 'Ajuste fino de las pendientes y factores de normalización de las fórmulas internas. Solo para usuarios expertos.')
      )}

      <div className="bg-blue-50 px-6 py-4 rounded-lg border border-blue-100 flex items-start space-x-3 text-blue-700 text-sm">
        <Save className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold">Guardado Automático</p>
          <p>Todos los cambios se guardan en la sesión actual. El motor de cálculo se actualiza inmediatamente tras editar cualquier celda.</p>
        </div>
      </div>
    </div>
  );
};

export default Configuration;