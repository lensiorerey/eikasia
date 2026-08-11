import React from 'react';
import { X, Download, ShieldCheck, Cpu, UploadCloud, Database, Info } from 'lucide-react';

export const GarminIntegrationGuideModal = ({ isOpen, onClose, onSyncDemo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-2xl p-6 md:p-8 text-slate-100 max-h-[90vh] overflow-y-auto relative border border-biolum-cyan/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-biolum-cyan transition-colors p-2 rounded-full hover:bg-ocean-800/50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-ocean-700/60 pb-4">
          <div className="p-3 bg-biolum-cyan/10 border border-biolum-cyan/40 rounded-xl text-biolum-cyan">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Sincronización de Datos Garmin Connect
            </h2>
            <p className="text-sm text-slate-300">
              ¿Cómo conectar tus entrenamientos de natación a esta plataforma?
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 text-sm">
          
          {/* Advice / Recommendation Banner */}
          <div className="p-4 bg-ocean-800/80 rounded-xl border border-biolum-teal/30 flex gap-3 items-start">
            <Info className="w-5 h-5 text-biolum-cyan shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-biolum-cyan mb-1">
                Recomendación de Integración
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Garmin requiere aprobación previa corporativa para la API directa en tiempo real (*Garmin Developer Program*). 
                Para uso libre y privado, la forma estándar de mayor precisión es la <strong>exportación directa de archivos .FIT / .CSV</strong> o la <strong>sincronización simulada en 1-click</strong>.
              </p>
            </div>
          </div>

          {/* Option 1: File Drag & Drop */}
          <div className="glass-panel p-5 rounded-xl border border-ocean-700">
            <div className="flex items-center gap-3 mb-2 text-biolum-cyan font-semibold text-base">
              <UploadCloud className="w-5 h-5" />
              <span>1. Importador Directo de Archivos (.FIT / .CSV)</span>
            </div>
            <p className="text-slate-300 text-xs mb-3">
              Puedes descargar tus entrenamientos desde <a href="https://connect.garmin.com" target="_blank" rel="noreferrer" className="text-biolum-cyan underline">Garmin Connect Web</a>:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs bg-ocean-950/60 p-3 rounded-lg border border-ocean-800">
              <li>Ingresa a tu cuenta de <strong>Garmin Connect</strong>.</li>
              <li>Ve a <strong>Actividades &gt; Natación</strong>.</li>
              <li>Abre una actividad de natación y haz clic en el icono de engranaje (⚙️).</li>
              <li>Selecciona <strong>"Exportar archivo original (.fit)"</strong> o <strong>"Exportar a CSV"</strong>.</li>
              <li>Arrastra ese archivo a nuestra zona de carga en el Dashboard.</li>
            </ol>
          </div>

          {/* Option 2: Demo Preset Sync */}
          <div className="glass-panel p-5 rounded-xl border border-ocean-700">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3 text-biolum-emerald font-semibold text-base">
                <Database className="w-5 h-5" />
                <span>2. Sincronización Inmediata con Datos Reales</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-biolum-emerald/20 text-biolum-emerald border border-biolum-emerald/40">
                RECOMENDADO PARA PROBAR
              </span>
            </div>
            <p className="text-slate-300 text-xs mb-4">
              ¿Quieres ver los gráficos de SWOLF, ritmos por 100m y zonas de frecuencia cardíaca de inmediato? Genera un set completo de datos de natación Garmin realistas con un solo clic.
            </p>
            <button
              onClick={() => {
                onSyncDemo();
                onClose();
              }}
              className="w-full glass-button py-2.5 px-4 rounded-xl text-biolum-cyan font-medium flex items-center justify-center gap-2 border border-biolum-cyan/50 hover:bg-biolum-cyan/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Sincronizar Datos de Natación Garmin (Preset)
            </button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-ocean-800">
            <ShieldCheck className="w-4 h-4 text-biolum-emerald" />
            <span>Tus datos se procesan 100% de forma local en tu navegador. Ninguna información se envía a servidores externos.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
