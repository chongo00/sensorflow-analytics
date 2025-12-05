import React from 'react';
import { Book, Code, Smartphone, Cpu } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold text-slate-900">Documentación del Sistema</h2>
        <p className="text-lg text-slate-600 mt-2">Guía técnica y de usuario para SensorFlow Analytics v1.0</p>
      </div>

      {/* Architecture */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3 text-blue-700">
            <Cpu className="w-6 h-6" />
            <h3 className="text-xl font-bold">Arquitectura Técnica</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
            <p>
                SensorFlow es una aplicación <strong>Single Page Application (SPA)</strong> totalmente autónoma. 
                No requiere conexión constante a internet para realizar los cálculos una vez cargada.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Frontend:</strong> React 19 + TypeScript.</li>
                <li><strong>Estilos:</strong> Tailwind CSS para diseño responsivo.</li>
                <li><strong>Motor de Cálculo:</strong> <code>analysisEngine.ts</code> ejecuta lógica local en el navegador.</li>
                <li><strong>Persistencia:</strong> Estado volátil (RAM) para la sesión actual.</li>
            </ul>
        </div>
      </section>

      {/* Calculation Logic */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3 text-blue-700">
            <Code className="w-6 h-6" />
            <h3 className="text-xl font-bold">Lógica de Cálculo</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-700 mb-4">
                El sistema aplica las siguientes fórmulas para determinar los valores de calidad de los modelos (CB800, CC750, etc.):
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                // 1. Validación de Umbral<br/>
                IF (Lectura &lt; Min_Threshold) RETURN "XXX"<br/><br/>
                
                // 2. Cálculo Primario<br/>
                Valor = (Lectura * m_cpo) + Zero - (m_agua * 10)<br/><br/>
                
                // 3. Normalización<br/>
                Resultado Final = (Valor / percent_cpo) * 100
            </div>
            <p className="text-sm text-slate-500 mt-3">
                * Estos parámetros pueden ser ajustados en la sección de <strong>Calibración Avanzada</strong>.
            </p>
        </div>
      </section>

      {/* Mobile Support */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3 text-blue-700">
            <Smartphone className="w-6 h-6" />
            <h3 className="text-xl font-bold">Soporte Móvil</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-700">
                La aplicación está diseñada bajo el principio <em>Mobile-First</em>. Puede instalarse en dispositivos Android e iOS como una 
                Web App (PWA) añadiéndola a la pantalla de inicio desde el navegador.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2">iOS (Safari)</h4>
                    <p className="text-sm text-slate-600">Botón Compartir &rarr; "Añadir a pantalla de inicio".</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2">Android (Chrome)</h4>
                    <p className="text-sm text-slate-600">Menú (3 puntos) &rarr; "Instalar aplicación" o "Añadir a inicio".</p>
                </div>
            </div>
        </div>
      </section>

       {/* Manual */}
       <section className="space-y-4">
        <div className="flex items-center space-x-3 text-blue-700">
            <Book className="w-6 h-6" />
            <h3 className="text-xl font-bold">Manual de Uso Rápido</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <ol className="list-decimal pl-5 space-y-3 text-slate-700">
                <li><strong>Importar Datos:</strong> Vaya a la pestaña "Importar Datos" y arrastre su archivo CSV/Excel.</li>
                <li><strong>Verificar Dashboard:</strong> Revise las gráficas de series de tiempo en el Dashboard principal. Las zonas rojas indican anomalías "XXX".</li>
                <li><strong>Ajustar Calibración:</strong> Si los valores parecen incorrectos, vaya a "Calibración". Use el "Modo Avanzado" si necesita ajustar las pendientes de las curvas.</li>
                <li><strong>Exportar:</strong> Vaya a "Reportes" y genere un PDF para compartir con la gerencia.</li>
            </ol>
        </div>
      </section>
    </div>
  );
};

export default Documentation;