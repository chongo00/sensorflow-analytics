import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, Loader2 } from 'lucide-react';

interface DataImportProps {
  onImport: () => void;
}

const DataImport: React.FC<DataImportProps> = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setStatus('processing');
    
    // Simulate parsing and analysis delay
    setTimeout(() => {
      onImport();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center py-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Importar Datos de Sensores</h2>
        <p className="text-slate-500 mt-2">Cargue archivos CSV o Excel que contengan flujos de sensores del Canal 4 al 8.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".csv,.xlsx,.xls" 
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${status === 'success' ? 'bg-green-100' : 'bg-slate-100'}`}>
            {status === 'success' ? (
              <Check className="w-8 h-8 text-green-600 animate-in zoom-in" />
            ) : status === 'processing' ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-slate-900">
              {status === 'processing' 
                ? 'Analizando archivo...' 
                : status === 'success' 
                  ? '¡Importación Exitosa!' 
                  : fileName 
                    ? `Archivo seleccionado: ${fileName}`
                    : 'Arrastre su archivo aquí'}
            </h3>
            <p className="text-sm text-slate-500">
              {status === 'processing' 
                ? 'Calculando modelos y aplicando calibración...'
                : 'o haga clic para buscar en su dispositivo'}
            </p>
          </div>

          <button 
            disabled={status !== 'idle'}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 pointer-events-none"
          >
            Seleccionar Archivo
          </button>
        </div>
      </div>

      <div className="text-left bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Formato Requerido (Ejemplo)
        </h4>
        <code className="block bg-slate-900 text-slate-200 p-4 rounded-lg text-xs overflow-x-auto font-mono">
          Hora(s), Canal_4(mW), Canal_5(mW), Canal_6(mW), Canal_7(mW), Canal_8(mW)<br/>
          28800, 110.5, 112.3, 98.4, 99.1, 105.2<br/>
          28860, 110.8, 112.5, 98.1, 99.3, 105.0<br/>
          ...
        </code>
      </div>
    </div>
  );
};

export default DataImport;