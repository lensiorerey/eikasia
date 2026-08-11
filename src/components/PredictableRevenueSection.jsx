import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calculator,
  Compass,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

export const PredictableRevenueSection = () => {
  // Calculator Interactive State
  const [sdrCount, setSdrCount] = useState(2);
  const [outboundContactsPerSdr, setOutboundContactsPerSdr] = useState(300);
  const [prospectConversionRate, setProspectConversionRate] = useState(15); // %
  const [sqlConversionRate, setSqlConversionRate] = useState(25); // %
  const [avgDealSize, setAvgDealSize] = useState(12000); // USD

  // Calculations
  const totalSuspects = sdrCount * outboundContactsPerSdr;
  const totalProspects = Math.round(totalSuspects * (prospectConversionRate / 100));
  const totalSqls = Math.round(totalProspects * (sqlConversionRate / 100));
  const totalClosedDeals = Math.round(totalSqls * 0.35); // 35% AE close rate
  const totalProjectedRevenue = totalClosedDeals * avgDealSize;

  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-biolum-emerald/20 text-biolum-emerald border border-biolum-emerald/40">
          <Target className="w-3.5 h-3.5" />
          AARON ROSS &amp; MARYLOU TYLER FRAMEWORK
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
          Predictable Revenue Framework
        </h2>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
          Diseña un pipeline de ventas altamente predecible y escalable diferenciando las vías de adquisición y la especialización entre SDRs (prospectores) y AEs (cerradores).
        </p>
      </div>

      {/* Part 1: The Three Avenues of Acquisition Cards */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-biolum-cyan" />
          <h3 className="text-xl font-bold font-heading text-white">
            Parte 1: Las 3 Vías de Adquisición
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Seeds */}
          <div className="glass-panel p-6 rounded-2xl border border-ocean-700 hover:border-biolum-emerald/60 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-biolum-emerald/10 border border-biolum-emerald/30 flex items-center justify-center text-biolum-emerald mb-4 group-hover:scale-110 transition-transform">
              🌱
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-heading">
              1. Seeds (Semillas)
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Oportunidades de altísima calidad que crecen orgánicamente por recomendación boca a boca y éxito del cliente.
            </p>
            <div className="bg-ocean-950/60 p-3 rounded-xl border border-ocean-800 text-xs text-slate-300 space-y-1 font-mono">
              <p><strong className="text-biolum-emerald">Ejemplo:</strong> Recomendaciones de clientes actuales satisfechos.</p>
              <p><strong className="text-slate-400">Conversión:</strong> Muy alta pero difícil de escalar.</p>
            </div>
          </div>

          {/* Nets */}
          <div className="glass-panel p-6 rounded-2xl border border-ocean-700 hover:border-biolum-cyan/60 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-biolum-cyan/10 border border-biolum-cyan/30 flex items-center justify-center text-biolum-cyan mb-4 group-hover:scale-110 transition-transform">
              🕸️
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-heading">
              2. Nets (Redes)
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Inbound Marketing de 1-a-muchos: capturar un alto volumen de interés potencial mediante contenido valioso.
            </p>
            <div className="bg-ocean-950/60 p-3 rounded-xl border border-ocean-800 text-xs text-slate-300 space-y-1 font-mono">
              <p><strong className="text-biolum-cyan">Ejemplo:</strong> Descargas de whitepapers en IA y webinars.</p>
              <p><strong className="text-slate-400">Conversión:</strong> Alta escala, requiere nutrición constante.</p>
            </div>
          </div>

          {/* Spears */}
          <div className="glass-panel p-6 rounded-2xl border border-ocean-700 hover:border-biolum-amber/60 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-biolum-amber/10 border border-biolum-amber/30 flex items-center justify-center text-biolum-amber mb-4 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-heading">
              3. Spears (Lanzas)
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Prospección outbound directiva 1-a-1 realizada por SDRs dedicados hacia cuentas objetivo prioritarias.
            </p>
            <div className="bg-ocean-950/60 p-3 rounded-xl border border-ocean-800 text-xs text-slate-300 space-y-1 font-mono">
              <p><strong className="text-biolum-amber">Ejemplo:</strong> Outreach directo a 50 COOs de manufactura.</p>
              <p><strong className="text-slate-400">Conversión:</strong> Máxima predictibilidad y control.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Part 2: Interactive Lead Qualification Funnel Simulator */}
      <div className="glass-panel-glow p-6 md:p-8 rounded-2xl border border-biolum-cyan/40">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-biolum-cyan text-xs font-semibold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Simulador Interactivo de Pipeline</span>
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">
              Redefiniendo el "Lead": Suspect → Prospect → SQL
            </h3>
          </div>

          <div className="bg-biolum-emerald/10 border border-biolum-emerald/40 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-300 uppercase block font-semibold">Proyección de Ingresos</span>
            <span className="text-2xl font-black text-biolum-emerald font-mono">
              ${totalProjectedRevenue.toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Simulator Input Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-ocean-950/60 p-5 rounded-xl border border-ocean-800 mb-8">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nº de SDRs (Prospectores): <span className="text-biolum-cyan font-bold">{sdrCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={sdrCount}
              onChange={(e) => {
                setSdrCount(Number(e.target.value));
                aquaticAudio.playBubbleSound();
              }}
              className="w-full accent-biolum-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contactos Outbound / SDR / Mes: <span className="text-biolum-cyan font-bold">{outboundContactsPerSdr}</span>
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={outboundContactsPerSdr}
              onChange={(e) => {
                setOutboundContactsPerSdr(Number(e.target.value));
                aquaticAudio.playBubbleSound();
              }}
              className="w-full accent-biolum-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Conversión a Prospect (ICP): <span className="text-biolum-cyan font-bold">{prospectConversionRate}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={prospectConversionRate}
              onChange={(e) => {
                setProspectConversionRate(Number(e.target.value));
                aquaticAudio.playBubbleSound();
              }}
              className="w-full accent-biolum-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor Prom. de Contrato: <span className="text-biolum-emerald font-bold">${avgDealSize.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={avgDealSize}
              onChange={(e) => {
                setAvgDealSize(Number(e.target.value));
                aquaticAudio.playBubbleSound();
              }}
              className="w-full accent-biolum-emerald"
            />
          </div>

        </div>

        {/* Funnel Stage Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          
          {/* Stage 1: Suspects */}
          <div className="glass-panel p-4 rounded-xl border border-ocean-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Etapa 1</span>
            <h5 className="font-bold text-white text-sm mt-1">Suspects</h5>
            <p className="text-xs text-slate-400 mb-2">Datos crudos sin verificar</p>
            <div className="text-2xl font-black text-slate-200 font-mono">{totalSuspects}</div>
          </div>

          {/* Stage 2: Prospects */}
          <div className="glass-panel p-4 rounded-xl border border-biolum-aqua/30">
            <span className="text-[10px] uppercase font-bold text-biolum-aqua">Etapa 2</span>
            <h5 className="font-bold text-white text-sm mt-1">Prospects</h5>
            <p className="text-xs text-slate-400 mb-2">Encaja con el perfil ICP</p>
            <div className="text-2xl font-black text-biolum-aqua font-mono">{totalProspects}</div>
          </div>

          {/* Stage 3: Qualified Leads (SQL) */}
          <div className="glass-panel p-4 rounded-xl border border-biolum-cyan/50 bg-biolum-cyan/5">
            <span className="text-[10px] uppercase font-bold text-biolum-cyan">Etapa 3 (Handoff)</span>
            <h5 className="font-bold text-white text-sm mt-1">SQLs (Leads Calificados)</h5>
            <p className="text-xs text-slate-400 mb-2">Necesidad y reunión confirmada</p>
            <div className="text-2xl font-black text-biolum-cyan font-mono">{totalSqls}</div>
          </div>

          {/* Stage 4: Closed Deals */}
          <div className="glass-panel p-4 rounded-xl border border-biolum-emerald/50 bg-biolum-emerald/5">
            <span className="text-[10px] uppercase font-bold text-biolum-emerald">Cierre AE</span>
            <h5 className="font-bold text-white text-sm mt-1">Contratos Cerrados</h5>
            <p className="text-xs text-slate-400 mb-2">Account Executive Closers</p>
            <div className="text-2xl font-black text-biolum-emerald font-mono">{totalClosedDeals}</div>
          </div>

        </div>

        {/* Role Handoff Workflow Diagram */}
        <div className="mt-8 pt-6 border-t border-ocean-800">
          <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-biolum-cyan" />
            Especialización de Roles: El Handoff SDR → AE
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-ocean-950/80 p-4 rounded-xl border border-ocean-800">
              <span className="font-bold text-biolum-cyan block mb-1">1. Prospectores (SDRs)</span>
              <p className="text-slate-300 leading-relaxed">
                Investigan <strong>Suspects</strong> y <strong>Prospects</strong>, filtrando el ruido. Su objetivo único es entregar únicamente <strong>Leads Calificados (SQLs)</strong> con presupuesto e intención real.
              </p>
            </div>
            <div className="bg-ocean-950/80 p-4 rounded-xl border border-ocean-800">
              <span className="font-bold text-biolum-emerald block mb-1">2. Cerradores (Account Executives)</span>
              <p className="text-slate-300 leading-relaxed">
                Dedican el 100% de su tiempo a presentar demos y cerrar negocios con empresas validadas por los SDRs, maximizando la tasa de cierre y los ingresos por vendedor.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
