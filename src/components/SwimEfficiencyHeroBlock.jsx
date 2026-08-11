import React, { useState } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Zap,
  Award,
  TrendingUp,
  Activity,
  Gauge,
  Info,
  ChevronRight,
  Sliders,
  Sparkles,
  BarChart3,
  Flame,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

export const SwimEfficiencyHeroBlock = ({ session, allSessions }) => {
  const [metricMode, setMetricMode] = useState('swolf'); // 'swolf' | 'dps' | 'hrCost' | 'sei'
  const [activeTab, setActiveTab] = useState('trend'); // 'trend' | 'laps' | 'radar'
  const [showBestComparison, setShowBestComparison] = useState(true);

  if (!session) return null;

  // Efficiency calculations
  const poolLen = session.poolLength || 25;
  const avgSwolf = session.avgSwolf || 34;
  const totalDist = session.totalDistance || 2000;
  const totalStrokes = session.totalStrokes || 1200;
  const avgHr = session.avgHeartRate || 145;

  // Calculated Biomechanical Metrics
  const totalLaps = Math.max(1, Math.round(totalDist / poolLen));
  const avgStrokesPerLap = Math.round(totalStrokes / totalLaps);
  const distancePerStroke = (totalDist / Math.max(1, totalStrokes)).toFixed(2); // Meters per stroke
  const hrCostIndex = (avgHr / Math.max(1, avgSwolf)).toFixed(1); // HR / SWOLF ratio

  // Rating badge logic
  const getEfficiencyRating = (swolf) => {
    if (swolf <= 32) {
      return {
        label: 'Élite Hidrodinámico',
        color: 'text-biolum-cyan border-biolum-cyan/50 bg-biolum-cyan/15',
        gradient: 'from-biolum-cyan via-biolum-teal to-biolum-emerald',
        desc: 'Deslizamiento biomecánico óptimo. Mínimo arrastre hidrodinámico.',
        percentile: 'Top 3% Swimmers',
      };
    }
    if (swolf <= 36) {
      return {
        label: 'Alta Eficiencia (Avanzado)',
        color: 'text-biolum-emerald border-biolum-emerald/50 bg-biolum-emerald/15',
        gradient: 'from-biolum-emerald to-biolum-teal',
        desc: 'Excelente agarre y propulsión constante con bajo gasto metabólico.',
        percentile: 'Top 15% Swimmers',
      };
    }
    if (swolf <= 42) {
      return {
        label: 'Eficiencia Moderada',
        color: 'text-amber-300 border-amber-400/50 bg-amber-400/15',
        gradient: 'from-amber-400 to-amber-600',
        desc: 'Ritmo aeróbico estable. Margen de mejora en la fase de recobro y patada.',
        percentile: 'Promedio Competitivo',
      };
    }
    return {
      label: 'Trabajo Técnico Requerido',
      color: 'text-rose-400 border-rose-400/50 bg-rose-400/15',
      gradient: 'from-rose-500 to-amber-500',
      desc: 'Alta resistencia al agua. Se recomienda ejercicios de rolido y agarre de codo alto.',
      percentile: 'Fase de Desarrollo',
    };
  };

  const rating = getEfficiencyRating(avgSwolf);

  // Lap level charts data
  const lapLabels = session.laps.map((l) => `Serie ${l.lap} (${l.dist}m)`);
  const lapSwolfs = session.laps.map((l) => l.swolf);
  const lapHrs = session.laps.map((l) => l.hr);

  // DPS per lap calculation (Distance / Total Lap Strokes)
  const lapDPS = session.laps.map((l) => {
    const lapPoolCount = Math.max(1, Math.round(l.dist / poolLen));
    const totalLapStrokes = Math.max(1, l.strokes * lapPoolCount);
    return Number((l.dist / totalLapStrokes).toFixed(2));
  });

  // Dynamic Chart Dataset based on metricMode
  const getChartDataset = () => {
    switch (metricMode) {
      case 'dps':
        return {
          label: 'Distancia por Brazada (Metros/Movimiento)',
          data: lapDPS,
          borderColor: '#00ffb3',
          backgroundColor: 'rgba(0, 255, 179, 0.15)',
          unit: 'm/brazada',
        };
      case 'hrCost':
        return {
          label: 'Coste Cardíaco (ppm / SWOLF)',
          data: session.laps.map((l) => Number((l.hr / Math.max(1, l.swolf)).toFixed(2))),
          borderColor: '#ff4b5c',
          backgroundColor: 'rgba(255, 75, 92, 0.15)',
          unit: 'ratio',
        };
      case 'swolf':
      default:
        return {
          label: 'SWOLF Score (Menor = Más Eficiente)',
          data: lapSwolfs,
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.15)',
          unit: 'puntos',
        };
    }
  };

  const currentDataset = getChartDataset();

  const chartData = {
    labels: lapLabels,
    datasets: [
      {
        label: currentDataset.label,
        data: currentDataset.data,
        borderColor: currentDataset.borderColor,
        backgroundColor: currentDataset.backgroundColor,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: currentDataset.borderColor,
        pointRadius: 6,
        pointHoverRadius: 9,
      },
      ...(showBestComparison
        ? [
            {
              label: 'Marca Personal de Referencia (Mejor Serie)',
              data: lapLabels.map(() => Math.min(...lapSwolfs)),
              borderColor: '#ffd700',
              borderDash: [4, 4],
              backgroundColor: 'transparent',
              pointRadius: 0,
            },
          ]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#cbd5e1', font: { family: 'Inter', size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(6, 19, 37, 0.95)',
        borderColor: currentDataset.borderColor,
        borderWidth: 1.5,
        titleColor: '#00f2fe',
        bodyColor: '#ffffff',
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(0, 242, 254, 0.08)' },
        ticks: { color: '#e2e8f0', font: { size: 11 } },
        title: {
          display: true,
          text: currentDataset.label,
          color: currentDataset.borderColor,
        },
      },
    },
  };

  // Radar Chart Data: Biomechanical Efficiency Dimensions
  const radarData = {
    labels: [
      'Economía de Brazada',
      'Velocidad de Deslizamiento',
      'Estabilidad del Pulso',
      'Resistencia Hidrodinámica',
      'Consistencia por Serie',
    ],
    datasets: [
      {
        label: 'Sesión Actual',
        data: [
          Math.min(100, Math.round((distancePerStroke / 2.2) * 100)),
          Math.min(100, Math.round((30 / avgSwolf) * 95)),
          Math.min(100, Math.round((140 / avgHr) * 90)),
          Math.min(100, Math.round((32 / avgSwolf) * 100)),
          88,
        ],
        backgroundColor: 'rgba(0, 242, 254, 0.25)',
        borderColor: '#00f2fe',
        borderWidth: 2,
        pointBackgroundColor: '#00f2fe',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#00f2fe', font: { size: 11, weight: 'bold' } },
        ticks: { display: false },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="glass-panel-glow p-6 md:p-8 rounded-3xl border border-biolum-cyan/50 shadow-2xl relative overflow-hidden space-y-8 animate-fadeIn">
      {/* Subtle background glow effect */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-biolum-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-ocean-700/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40 flex items-center gap-1.5 shadow-lg shadow-biolum-cyan/10">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              MÓDULO DE ALTA EFICIENCIA SWOLF & BIOMECÁNICA
            </span>
            <span className="text-xs text-slate-400 font-mono">Garmin Telemetry V2</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight">
            Análisis de <span className="text-shimmer">Eficiencia Hidrodinámica</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Optimizador de gasto energético, relación longitud/frecuencia de brazada y economía aeróbica en piscina de {poolLen}m.
          </p>
        </div>

        {/* Real-time Status Badge & Rating Dial */}
        <div className={`p-4 rounded-2xl border ${rating.color} space-y-1 text-right min-w-[260px] shadow-xl`}>
          <div className="flex items-center justify-end gap-2 text-xs font-mono">
            <Gauge className="w-4 h-4 text-biolum-cyan" />
            <span>Nivel de Deslizamiento</span>
          </div>
          <div className="text-xl font-extrabold font-heading text-white tracking-tight">
            {rating.label}
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{rating.desc}</p>
        </div>
      </div>

      {/* Core Efficiency KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: SWOLF */}
        <div
          onClick={() => {
            aquaticAudio.playBubbleSound();
            setMetricMode('swolf');
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer ${
            metricMode === 'swolf'
              ? 'border-biolum-cyan bg-biolum-cyan/10 shadow-lg shadow-biolum-cyan/20 scale-[1.02]'
              : 'border-ocean-700 hover:border-ocean-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-biolum-cyan">SWOLF Score</span>
            <Award className="w-4 h-4 text-biolum-cyan" />
          </div>
          <div className="text-3xl font-black font-heading text-white">{avgSwolf}</div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            {avgSwolf <= 34 ? '🟢 Excelente (Bajo SWOLF)' : '🟡 Moderado'}
          </p>
        </div>

        {/* KPI 2: Distance per Stroke (DPS) */}
        <div
          onClick={() => {
            aquaticAudio.playBubbleSound();
            setMetricMode('dps');
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer ${
            metricMode === 'dps'
              ? 'border-biolum-emerald bg-biolum-emerald/10 shadow-lg shadow-biolum-emerald/20 scale-[1.02]'
              : 'border-ocean-700 hover:border-ocean-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-biolum-emerald">Distancia / Brazada</span>
            <TrendingUp className="w-4 h-4 text-biolum-emerald" />
          </div>
          <div className="text-3xl font-black font-heading text-white">
            {distancePerStroke} <span className="text-sm font-normal text-slate-400">m</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Metros avanzados por movimiento
          </p>
        </div>

        {/* KPI 3: HR Cost Ratio */}
        <div
          onClick={() => {
            aquaticAudio.playBubbleSound();
            setMetricMode('hrCost');
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer ${
            metricMode === 'hrCost'
              ? 'border-rose-400 bg-rose-400/10 shadow-lg shadow-rose-400/20 scale-[1.02]'
              : 'border-ocean-700 hover:border-ocean-600'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-rose-400">Economía Cardíaca</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black font-heading text-white">
            {hrCostIndex} <span className="text-sm font-normal text-slate-400">ppm/sw</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Gasto aeróbico por unidad SWOLF</p>
        </div>

        {/* KPI 4: Average Strokes per 25m */}
        <div className="glass-panel p-4 rounded-2xl border border-ocean-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-amber-300">Brazadas / Largo</span>
            <Activity className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-3xl font-black font-heading text-white">
            {avgStrokesPerLap} <span className="text-sm font-normal text-slate-400">mov</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Promedio en piscina de {poolLen}m</p>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-ocean-950/70 rounded-2xl border border-ocean-750">
          {/* Chart View Selector Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                aquaticAudio.playBubbleSound();
                setActiveTab('trend');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'trend'
                  ? 'bg-biolum-cyan text-ocean-950 font-bold shadow-md shadow-biolum-cyan/30'
                  : 'text-slate-300 hover:text-white hover:bg-ocean-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Tendencia por Serie
            </button>

            <button
              onClick={() => {
                aquaticAudio.playBubbleSound();
                setActiveTab('radar');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'radar'
                  ? 'bg-biolum-emerald text-ocean-950 font-bold shadow-md shadow-biolum-emerald/30'
                  : 'text-slate-300 hover:text-white hover:bg-ocean-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Radar Biomecánico
            </button>
          </div>

          {/* Dynamic Metric Switcher */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showBestComparison}
                onChange={(e) => setShowBestComparison(e.target.checked)}
                className="rounded accent-biolum-cyan cursor-pointer"
              />
              <span>Comparar con Marca Personal</span>
            </label>

            <div className="h-4 w-px bg-ocean-700 hidden sm:block" />

            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-biolum-cyan" />
              <span className="hidden sm:inline">Métrica Activa:</span>
              <span className="font-mono text-biolum-cyan font-semibold uppercase">{metricMode}</span>
            </div>
          </div>
        </div>

        {/* Interactive Chart Canvas Container */}
        <div className="glass-panel p-5 rounded-2xl border border-ocean-700 h-[340px] relative">
          {activeTab === 'trend' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Radar data={radarData} options={radarOptions} />
          )}
        </div>
      </div>

      {/* Biomechanical Insights & Efficiency Formula Banner */}
      <div className="p-4 rounded-2xl bg-ocean-900/80 border border-biolum-cyan/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-biolum-cyan shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">
              Fórmula de Eficiencia SWOLF Garmin: <code className="text-biolum-cyan">SWOLF = Tiempo (seg) + Brazadas por Largo</code>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Un menor número refleja que estás recorriendo más metros con menos esfuerzo. La combinación ideal es mantener un **DPS alto** sin reducir drásticamente la frecuencia de brazada.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            aquaticAudio.playSonar();
          }}
          className="px-4 py-2 rounded-xl bg-biolum-cyan/15 text-biolum-cyan border border-biolum-cyan/40 font-semibold hover:bg-biolum-cyan/30 transition-all shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Audio Feedback Biomecánico
        </button>
      </div>
    </div>
  );
};
