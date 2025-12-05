import React from 'react';
import { AnalysisResult, AnalysisModel, SensorReading } from '../types';
import { FileDown, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsProps {
  results: AnalysisResult[];
  models: AnalysisModel[];
  readings: SensorReading[];
}

const Reports: React.FC<ReportsProps> = ({ results, models, readings }) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Reporte de Análisis SensorFlow', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);
    doc.text(`Total de Lecturas Procesadas: ${readings.length}`, 14, 36);

    // Summary Table
    const summaryData = models.map(m => {
      const modelResults = results.filter(r => r.modelId === m.id);
      const validResults = modelResults.filter(r => r.status === 'OK').map(r => r.calculatedValue);
      const anomalies = modelResults.filter(r => r.status === 'XXX').length;
      
      const avg = validResults.length ? (validResults.reduce((a, b) => a + b, 0) / validResults.length).toFixed(2) : '0';
      const max = validResults.length ? Math.max(...validResults).toFixed(2) : '0';

      return [m.name, m.sourceChannel, avg, max, anomalies];
    });

    autoTable(doc, {
      startY: 45,
      head: [['Modelo', 'Canal Origen', 'Promedio', 'Máximo', 'Anomalías (XXX)']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] } // Blue header
    });

    // Detailed Data Snapshot (First 20 rows for brevity in demo)
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.text('Detalle de Datos (Extracto - Primeras 20 lecturas)', 14, finalY + 15);

    const detailData = results.slice(0, 20).map(r => {
        const modelName = models.find(m => m.id === r.modelId)?.name || 'N/A';
        return [
            (r.timestamp_sec / 3600).toFixed(2) + 'h',
            modelName,
            r.calculatedValue.toString(),
            r.status
        ];
    });

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Tiempo (h)', 'Modelo', 'Valor Calc.', 'Estado']],
      body: detailData,
      theme: 'striped'
    });

    doc.save('Reporte_SensorFlow.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Generador de Reportes</h2>
        <p className="text-slate-500 mt-2">Exporte los resultados del análisis y resúmenes estadísticos en formato PDF para su distribución.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Reporte Ejecutivo Completo</h3>
                <p className="text-sm text-slate-500 mt-2">
                    Incluye resumen estadístico por modelo, conteo de anomalías y una muestra tabular de los datos procesados. Ideal para impresión y archivo.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Resumen Estadístico</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Detección de Anomalías</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Tablas de Datos</li>
                </ul>
            </div>
            <button 
                onClick={generatePDF}
                className="mt-6 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
                <FileDown className="w-5 h-5" />
                <span>Descargar PDF</span>
            </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between opacity-70">
            <div>
                <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="text-slate-500 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Reporte de Incidencias (Próximamente)</h3>
                <p className="text-sm text-slate-500 mt-2">
                    Enfocado exclusivamente en las lecturas marcadas con "XXX" o fuera de rango. Útil para mantenimiento correctivo.
                </p>
            </div>
            <button disabled className="mt-6 w-full bg-slate-100 text-slate-400 py-3 rounded-lg font-medium cursor-not-allowed">
                No disponible
            </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;