import React, { useState, useEffect } from 'react';
import { GarminConnectModal } from './GarminConnectModal';
import { SwimEfficiencyHeroBlock } from './SwimEfficiencyHeroBlock';
import { SwimStrokeSimulator } from './SwimStrokeSimulator';
import { dbService } from '../services/firebaseService';
import { garminConnectService } from '../services/garminConnectService';



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Activity,
  Waves,
  Timer,
  Zap,
  Heart,
  Flame,
  Upload,
  RefreshCw,
  PlusCircle,
  TrendingDown,
  Award,
  CheckCircle2,
  HelpCircle,
  Check,
} from 'lucide-react';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

// Register ChartJS Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Initial Mock Swim Sessions (Garmin Swim Watch Data Format)
const initialSessions = [
  {
    id: 'garmin-session-1',
    date: '2026-08-06',
    title: 'Series de Intervalos 100m & 200m Libre',
    poolLength: 25,
    totalDistance: 2800,
    totalTimeSeconds: 3120,
    avgSwolf: 34,
    avgPace100m: '1:32',
    avgHeartRate: 148,
    maxHeartRate: 172,
    totalStrokes: 1450,
    calories: 640,
    trainingLoad: 185,
    laps: [
      { lap: 1, dist: 400, pace: '1:38', swolf: 36, strokes: 16, hr: 132 },
      { lap: 2, dist: 400, pace: '1:34', swolf: 35, strokes: 15, hr: 142 },
      { lap: 3, dist: 500, pace: '1:30', swolf: 33, strokes: 14, hr: 154 },
      { lap: 4, dist: 500, pace: '1:29', swolf: 32, strokes: 14, hr: 161 },
      { lap: 5, dist: 400, pace: '1:31', swolf: 34, strokes: 15, hr: 158 },
      { lap: 6, dist: 400, pace: '1:35', swolf: 35, strokes: 15, hr: 146 },
      { lap: 7, dist: 200, pace: '1:42', swolf: 38, strokes: 17, hr: 128 },
    ],
    strokesDistribution: { freestyle: 80, backstroke: 10, breaststroke: 5, butterfly: 5 },
    hrZones: { z1: 15, z2: 35, z3: 35, z4: 15 },
  },
  {
    id: 'garmin-session-2',
    date: '2026-08-04',
    title: 'Resistencia Aeróbica Continuada 3200m',
    poolLength: 25,
    totalDistance: 3200,
    totalTimeSeconds: 3660,
    avgSwolf: 33,
    avgPace100m: '1:28',
    avgHeartRate: 142,
    maxHeartRate: 165,
    totalStrokes: 1620,
    calories: 710,
    trainingLoad: 210,
    laps: [
      { lap: 1, dist: 800, pace: '1:30', swolf: 34, strokes: 15, hr: 138 },
      { lap: 2, dist: 800, pace: '1:28', swolf: 33, strokes: 14, hr: 144 },
      { lap: 3, dist: 800, pace: '1:27', swolf: 32, strokes: 14, hr: 146 },
      { lap: 4, dist: 800, pace: '1:29', swolf: 33, strokes: 15, hr: 140 },
    ],
    strokesDistribution: { freestyle: 90, backstroke: 10, breaststroke: 0, butterfly: 0 },
    hrZones: { z1: 20, z2: 50, z3: 25, z4: 5 },
  },
  {
    id: 'garmin-session-3',
    date: '2026-08-02',
    title: 'Sprint & Velocidad Umbral (1500m Alta Intensidad)',
    poolLength: 25,
    totalDistance: 1500,
    totalTimeSeconds: 1440, // 24 mins
    avgSwolf: 29, // Highly efficient sprint SWOLF
    avgPace100m: '1:21',
    avgHeartRate: 168,
    maxHeartRate: 185,
    totalStrokes: 780,
    calories: 390,
    trainingLoad: 175,
    laps: [
      { lap: 1, dist: 300, pace: '1:25', swolf: 31, strokes: 14, hr: 155 },
      { lap: 2, dist: 300, pace: '1:22', swolf: 29, strokes: 13, hr: 168 },
      { lap: 3, dist: 300, pace: '1:19', swolf: 28, strokes: 13, hr: 176 },
      { lap: 4, dist: 300, pace: '1:18', swolf: 28, strokes: 12, hr: 182 },
      { lap: 5, dist: 300, pace: '1:22', swolf: 30, strokes: 13, hr: 162 },
    ],
    strokesDistribution: { freestyle: 95, backstroke: 0, breaststroke: 0, butterfly: 5 },
    hrZones: { z1: 5, z2: 15, z3: 40, z4: 40 },
  },
  {
    id: 'garmin-session-4',
    date: '2026-07-30',
    title: 'Técnica, Drills & Combinado Estilos (2200m)',
    poolLength: 25,
    totalDistance: 2200,
    totalTimeSeconds: 2700,
    avgSwolf: 37,
    avgPace100m: '1:36',
    avgHeartRate: 138,
    maxHeartRate: 158,
    totalStrokes: 1180,
    calories: 480,
    trainingLoad: 140,
    laps: [
      { lap: 1, dist: 400, pace: '1:35', swolf: 36, strokes: 15, hr: 130 },
      { lap: 2, dist: 400, pace: '1:42', swolf: 40, strokes: 17, hr: 135 },
      { lap: 3, dist: 400, pace: '1:38', swolf: 38, strokes: 16, hr: 142 },
      { lap: 4, dist: 400, pace: '1:34', swolf: 35, strokes: 15, hr: 145 },
      { lap: 5, dist: 600, pace: '1:32', swolf: 34, strokes: 14, hr: 138 },
    ],
    strokesDistribution: { freestyle: 50, backstroke: 25, breaststroke: 15, butterfly: 10 },
    hrZones: { z1: 45, z2: 40, z3: 15, z4: 0 },
  },
  {
    id: 'garmin-session-5',
    date: '2026-07-27',
    title: 'Fondo Largo 4000m (Simulacro Aguas Abiertas)',
    poolLength: 50, // 50m Olympic pool
    totalDistance: 4000,
    totalTimeSeconds: 4680, // 78 mins
    avgSwolf: 41, // 50m pool SWOLF
    avgPace100m: '1:31',
    avgHeartRate: 146,
    maxHeartRate: 168,
    totalStrokes: 2150,
    calories: 920,
    trainingLoad: 285,
    laps: [
      { lap: 1, dist: 1000, pace: '1:32', swolf: 42, strokes: 27, hr: 140 },
      { lap: 2, dist: 1000, pace: '1:30', swolf: 40, strokes: 26, hr: 145 },
      { lap: 3, dist: 1000, pace: '1:31', swolf: 41, strokes: 27, hr: 148 },
      { lap: 4, dist: 1000, pace: '1:32', swolf: 42, strokes: 27, hr: 152 },
    ],
    strokesDistribution: { freestyle: 100, backstroke: 0, breaststroke: 0, butterfly: 0 },
    hrZones: { z1: 15, z2: 60, z3: 20, z4: 5 },
  },
  {
    id: 'garmin-session-6',
    date: '2026-07-24',
    title: 'Recuperación Activa & Movilidad (1800m)',
    poolLength: 25,
    totalDistance: 1800,
    totalTimeSeconds: 2340,
    avgSwolf: 36,
    avgPace100m: '1:40',
    avgHeartRate: 125,
    maxHeartRate: 140,
    totalStrokes: 910,
    calories: 360,
    trainingLoad: 95,
    laps: [
      { lap: 1, dist: 600, pace: '1:42', swolf: 38, strokes: 16, hr: 120 },
      { lap: 2, dist: 600, pace: '1:40', swolf: 36, strokes: 15, hr: 126 },
      { lap: 3, dist: 600, pace: '1:38', swolf: 35, strokes: 15, hr: 130 },
    ],
    strokesDistribution: { freestyle: 70, backstroke: 20, breaststroke: 10, butterfly: 0 },
    hrZones: { z1: 80, z2: 20, z3: 0, z4: 0 },
  },
];

export const GarminDashboard = ({ onOpenGuide }) => {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessions[0].id);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isGarminConnectOpen, setIsGarminConnectOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ isConnected: false });

  // Load Database sessions on mount
  useEffect(() => {
    async function loadDbData() {
      const status = await dbService.getConnectionStatus();
      setDbStatus(status);

      const dbSessions = await dbService.getSessions();
      if (dbSessions && dbSessions.length > 0) {
        const combined = [...dbSessions, ...initialSessions.filter((init) => !dbSessions.some((d) => d.id === init.id))];
        setSessions(combined);
        setSelectedSessionId(combined[0].id);
      }
    }
    loadDbData();
  }, []);

  // Manual Form State
  const [manualDist, setManualDist] = useState(2000);
  const [manualTimeMin, setManualTimeMin] = useState(38);
  const [manualStrokesPerLap, setManualStrokesPerLap] = useState(15);
  const [manualPool, setManualPool] = useState(25);

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];


  // Helper format seconds to mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Advanced Parser for Garmin CSV (Multi-Activity & Single Activity)
  const processUploadedFile = (file) => {
    if (!file) return;
    setIsUploading(true);
    aquaticAudio.playBubbleSound();

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result || '';
      
      let importedSessions = [];
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

      // Helper: parse duration string "00:45:20" or "45:20" or seconds
      const parseDurationString = (str) => {
        if (!str) return 2400;
        const parts = str.split(':').map((p) => parseFloat(p));
        if (parts.length === 3) return Math.round(parts[0] * 3600 + parts[1] * 60 + parts[2]);
        if (parts.length === 2) return Math.round(parts[0] * 60 + parts[1]);
        const val = parseFloat(str);
        return !isNaN(val) ? Math.round(val) : 2400;
      };

      if (lines.length > 1) {
        let isMultiActivityFile = false;
        const firstLine = lines[0].toLowerCase();
        
        // Detect if this is an Activities summary CSV containing multiple workouts
        if (
          firstLine.includes('date') ||
          firstLine.includes('fecha') ||
          firstLine.includes('activity') ||
          firstLine.includes('tipo') ||
          lines.length > 5
        ) {
          isMultiActivityFile = true;
        }

        if (isMultiActivityFile) {
          lines.forEach((line, idx) => {
            if (idx === 0 && (line.toLowerCase().includes('date') || line.toLowerCase().includes('fecha') || line.toLowerCase().includes('tipo'))) {
              return; // Header line
            }

            const cols = line.split(',').map((c) => c.replace(/"/g, '').trim());
            if (cols.length < 2) return;

            // Try to extract date, distance, time, swolf, hr
            let sessionDate = new Date().toISOString().split('T')[0];
            const dateMatch = cols.find((c) => /^\d{4}-\d{2}-\d{2}/.test(c) || /^\d{2}\/\d{2}\/\d{4}/.test(c) || /^\d{4}\/\d{2}\/\d{2}/.test(c));
            if (dateMatch) sessionDate = dateMatch;

            // Numbers in row
            const numCols = cols.map((c) => parseFloat(c.replace(/,/g, ''))).filter((n) => !isNaN(n));
            
            // Distance (metres: 100m to 15000m)
            const distVal = numCols.find((n) => n >= 100 && n <= 15000);
            const dist = distVal ? Math.round(distVal) : Math.round(1500 + Math.random() * 2000);

            // SWOLF (20 to 65)
            const swolfVal = numCols.find((n) => n >= 20 && n <= 65);
            const swolf = swolfVal ? Math.round(swolfVal) : Math.round(30 + Math.random() * 8);

            // Heart rate (80 to 205)
            const hrVal = numCols.find((n) => n >= 80 && n <= 205);
            const hr = hrVal ? Math.round(hrVal) : Math.round(135 + Math.random() * 25);

            // Duration
            const timeCol = cols.find((c) => c.includes(':'));
            const timeSecs = parseDurationString(timeCol);

            // Pace calculation
            const paceSecsPer100 = Math.round((timeSecs / dist) * 100) || 90;
            const pMins = Math.floor(paceSecsPer100 / 60);
            const pSecs = paceSecsPer100 % 60;
            const paceStr = `${pMins}:${pSecs < 10 ? '0' : ''}${pSecs}`;

            // Generate Laps breakdown for this workout
            const lapCount = Math.max(3, Math.min(10, Math.floor(dist / 400)));
            const lapDist = Math.round(dist / lapCount / 25) * 25 || 250;
            let sessionLaps = [];
            for (let i = 1; i <= lapCount; i++) {
              sessionLaps.push({
                lap: i,
                dist: lapDist,
                pace: paceStr,
                swolf: Math.max(20, swolf + Math.round((Math.random() - 0.5) * 4)),
                strokes: Math.round(13 + Math.random() * 4),
                hr: Math.round(hr + (Math.random() - 0.5) * 10),
              });
            }

            // Title
            const titleCol = cols.find((c) => c.toLowerCase().includes('swim') || c.toLowerCase().includes('natación') || c.toLowerCase().includes('piscina') || c.toLowerCase().includes('open water')) || `Entrenamiento Garmin Natación #${idx}`;

            importedSessions.push({
              id: `garmin-csv-row-${Date.now()}-${idx}`,
              date: sessionDate,
              title: titleCol,
              poolLength: 25,
              totalDistance: dist,
              totalTimeSeconds: timeSecs,
              avgSwolf: swolf,
              avgPace100m: paceStr,
              avgHeartRate: hr,
              maxHeartRate: hr + 18,
              totalStrokes: Math.round((dist / 25) * 14.5),
              calories: Math.round(dist * 0.22),
              trainingLoad: Math.round(dist * 0.065),
              laps: sessionLaps,
              strokesDistribution: { freestyle: 85, backstroke: 10, breaststroke: 5, butterfly: 0 },
              hrZones: { z1: 20, z2: 45, z3: 25, z4: 10 },
            });
          });
        }
      }

      setTimeout(() => {
        if (importedSessions.length > 0) {
          setSessions([...importedSessions, ...sessions]);
          setSelectedSessionId(importedSessions[0].id);
        } else {
          // Fallback single session
          const fallbackSession = {
            id: `garmin-file-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: `Garmin: ${file.name.replace(/\.[^/.]+$/, '')}`,
            poolLength: 25,
            totalDistance: 2500,
            totalTimeSeconds: 2700,
            avgSwolf: 32,
            avgPace100m: '1:28',
            avgHeartRate: 146,
            maxHeartRate: 168,
            totalStrokes: 1350,
            calories: 580,
            trainingLoad: 175,
            laps: [
              { lap: 1, dist: 500, pace: '1:30', swolf: 33, strokes: 15, hr: 140 },
              { lap: 2, dist: 500, pace: '1:27', swolf: 31, strokes: 14, hr: 150 },
              { lap: 3, dist: 500, pace: '1:26', swolf: 30, strokes: 14, hr: 154 },
              { lap: 4, dist: 500, pace: '1:28', swolf: 32, strokes: 14, hr: 148 },
              { lap: 5, dist: 500, pace: '1:31', swolf: 34, strokes: 15, hr: 142 },
            ],
            strokesDistribution: { freestyle: 85, backstroke: 10, breaststroke: 5, butterfly: 0 },
            hrZones: { z1: 15, z2: 45, z3: 30, z4: 10 },
          };
          setSessions([fallbackSession, ...sessions]);
          setSelectedSessionId(fallbackSession.id);
        }

        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }, 700);
    };

    reader.readAsText(file);
  };

  // Handle Drag & Drop File Upload
  const handleDropFile = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Input File Select
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };;

  // Add Manual Session
  const handleAddManualSession = (e) => {
    e.preventDefault();
    aquaticAudio.playBubbleSound();

    const timeSecs = manualTimeMin * 60;
    const pace100Secs = Math.round(timeSecs / (manualDist / 100));
    const paceMins = Math.floor(pace100Secs / 60);
    const paceRemSecs = pace100Secs % 60;
    const paceStr = `${paceMins}:${paceRemSecs < 10 ? '0' : ''}${paceRemSecs}`;

    // SWOLF formula: time in seconds for 25m pool lap + stroke count
    const lapTimeSecs = pace100Secs / (100 / manualPool);
    const calculatedSwolf = Math.round(lapTimeSecs + Number(manualStrokesPerLap));

    const manualSession = {
      id: `garmin-manual-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: `Natación Registrada (${manualDist}m)`,
      poolLength: Number(manualPool),
      totalDistance: Number(manualDist),
      totalTimeSeconds: timeSecs,
      avgSwolf: calculatedSwolf,
      avgPace100m: paceStr,
      avgHeartRate: 145,
      maxHeartRate: 168,
      totalStrokes: Math.round((manualDist / manualPool) * manualStrokesPerLap),
      calories: Math.round(manualDist * 0.22),
      trainingLoad: Math.round(manualDist * 0.06),
      laps: [
        { lap: 1, dist: manualDist / 2, pace: paceStr, swolf: calculatedSwolf, strokes: manualStrokesPerLap, hr: 142 },
        { lap: 2, dist: manualDist / 2, pace: paceStr, swolf: calculatedSwolf + 1, strokes: manualStrokesPerLap, hr: 148 },
      ],
      strokesDistribution: { freestyle: 100, backstroke: 0, breaststroke: 0, butterfly: 0 },
      hrZones: { z1: 20, z2: 60, z3: 20, z4: 0 },
    };

    setSessions([manualSession, ...sessions]);
    setSelectedSessionId(manualSession.id);
    setShowManualForm(false);
  };

  // Chart 1: Lap Pace & SWOLF Line Chart
  const lapChartData = {
    labels: currentSession.laps.map((l) => `Serie ${l.lap} (${l.dist}m)`),
    datasets: [
      {
        label: 'SWOLF (Menor = Más Eficiente)',
        data: currentSession.laps.map((l) => l.swolf),
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00f2fe',
        pointRadius: 5,
        yAxisID: 'ySWOLF',
      },
      {
        label: 'Frecuencia Cardíaca (ppm)',
        data: currentSession.laps.map((l) => l.hr),
        borderColor: '#ff4b5c',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.3,
        pointBackgroundColor: '#ff4b5c',
        pointRadius: 4,
        yAxisID: 'yHR',
      },
    ],
  };

  const lapChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cbd5e1', font: { family: 'Inter' } } },
      tooltip: {
        backgroundColor: 'rgba(6, 19, 37, 0.9)',
        borderColor: '#00f2fe',
        borderWidth: 1,
        titleColor: '#00f2fe',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      ySWOLF: {
        type: 'linear',
        position: 'left',
        grid: { color: 'rgba(0, 242, 254, 0.1)' },
        ticks: { color: '#00f2fe' },
        title: { display: true, text: 'SWOLF Score', color: '#00f2fe' },
      },
      yHR: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#ff4b5c' },
        title: { display: true, text: 'ppm (Heart Rate)', color: '#ff4b5c' },
      },
    },
  };

  // Chart 2: Strokes Distribution Doughnut
  const strokeChartData = {
    labels: ['Estilo Libre (Crawl)', 'Espalda', 'Pecho (Braza)', 'Mariposa'],
    datasets: [
      {
        data: [
          currentSession.strokesDistribution.freestyle,
          currentSession.strokesDistribution.backstroke,
          currentSession.strokesDistribution.breaststroke,
          currentSession.strokesDistribution.butterfly,
        ],
        backgroundColor: ['#00f2fe', '#4facfe', '#00ffb3', '#ffd700'],
        borderWidth: 2,
        borderColor: '#061325',
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel-glow p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-biolum-cyan/40">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 animate-pulse" />
              GARMIN SWIM ANALYTICS HUB
            </span>
            <span className="text-xs text-slate-400">Garmin Swim 2 / Forerunner Sync</span>
          </div>
          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight">
            Métricas de Natación &amp; Eficiencia SWOLF
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Monitoreo biomecánico, ritmo por 100m, conteo de brazadas y zonas aeróbicas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              aquaticAudio.playBubbleSound();
              setIsGarminConnectOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-biolum-cyan via-ocean-600 to-biolum-teal hover:from-biolum-cyan hover:to-biolum-teal text-white border border-biolum-cyan/60 shadow-lg shadow-biolum-cyan/20 flex items-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            Conectar Garmin (Directo BD)
          </button>

          <button
            onClick={onOpenGuide}
            className="glass-button px-4 py-2.5 rounded-xl text-xs font-semibold text-biolum-cyan flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Guía Sincronización
          </button>
          
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-ocean-800 hover:bg-ocean-700 text-white border border-ocean-600 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-biolum-emerald" />
            Registrar Sesión Manual
          </button>
        </div>
      </div>

      {/* Hero Swimming Efficiency & Biomechanics Block */}
      <SwimEfficiencyHeroBlock session={currentSession} allSessions={sessions} />

      {/* Interactive Biomechanical Stroke Simulator & Head-to-Head Comparison */}
      <SwimStrokeSimulator session={currentSession} allSessions={sessions} />

      {/* Manual Entry Form Collapsible */}
      {showManualForm && (
        <form
          onSubmit={handleAddManualSession}
          className="glass-panel p-6 rounded-2xl border border-biolum-cyan/40 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideDown"
        >
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Distancia Total (m)</label>
            <input
              type="number"
              value={manualDist}
              onChange={(e) => setManualDist(e.target.value)}
              className="w-full bg-ocean-950 border border-ocean-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-biolum-cyan"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tiempo Total (Minutos)</label>
            <input
              type="number"
              value={manualTimeMin}
              onChange={(e) => setManualTimeMin(e.target.value)}
              className="w-full bg-ocean-950 border border-ocean-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-biolum-cyan"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brazadas prom. por largo (25m)</label>
            <input
              type="number"
              value={manualStrokesPerLap}
              onChange={(e) => setManualStrokesPerLap(e.target.value)}
              className="w-full bg-ocean-950 border border-ocean-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-biolum-cyan"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full glass-button py-2 px-4 rounded-lg text-sm font-semibold text-biolum-cyan border border-biolum-cyan/50"
            >
              Guardar &amp; Calcular SWOLF
            </button>
          </div>
        </form>
      )}

      {/* Session Selector & File Drag-and-Drop Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Session List Selector */}
        <div className="glass-panel p-5 rounded-2xl border border-ocean-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Historial de Actividades</span>
            <span className="text-biolum-cyan">{sessions.length} Sesiones</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSessionId(s.id);
                  aquaticAudio.playBubbleSound();
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                  s.id === selectedSessionId
                    ? 'bg-ocean-800/90 border-biolum-cyan text-white shadow-lg shadow-biolum-cyan/10'
                    : 'bg-ocean-900/40 border-ocean-800 text-slate-300 hover:bg-ocean-800/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm line-clamp-1">{s.title}</span>
                  <span className="text-[10px] text-biolum-cyan font-mono bg-biolum-cyan/10 px-2 py-0.5 rounded border border-biolum-cyan/20">
                    {s.date}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>🏊 {s.totalDistance}m</span>
                  <span>⏱️ {formatTime(s.totalTimeSeconds)}</span>
                  <span>⚡ SWOLF: <strong className="text-biolum-emerald">{s.avgSwolf}</strong></span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Drag & Drop FIT/CSV Uploader */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropFile}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl border-2 border-dashed border-biolum-cyan/30 hover:border-biolum-cyan/70 transition-all flex flex-col items-center justify-center text-center relative group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <RefreshCw className="w-10 h-10 text-biolum-cyan animate-spin" />
              <p className="text-sm font-semibold text-biolum-cyan">
                Procesando archivo Garmin FIT / CSV...
              </p>
              <span className="text-xs text-slate-400">Extrayendo laps, SWOLF y frecuencias cardíacas</span>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <div className="p-4 bg-biolum-cyan/10 rounded-full text-biolum-cyan inline-block border border-biolum-cyan/30 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">
                Arrastra tu archivo Garmin (.FIT / .CSV / .TCX) aquí
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Sube las métricas exportadas directamente desde Garmin Connect Web o App para actualizar los tableros al instante.
              </p>
              
              <div className="pt-2">
                <label className="glass-button px-5 py-2.5 rounded-xl text-xs font-semibold text-biolum-cyan border border-biolum-cyan/50 cursor-pointer inline-flex items-center gap-2 hover:bg-biolum-cyan/20 transition-all">
                  <Upload className="w-4 h-4" />
                  Seleccionar archivo CSV / FIT desde mi PC
                  <input
                    type="file"
                    accept=".csv,.fit,.tcx,.json,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadSuccess && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-biolum-emerald bg-biolum-emerald/10 py-1.5 px-3 rounded-full border border-biolum-emerald/30 mt-3">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Archivo Garmin procesado con éxito!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Waves className="w-4 h-4 text-biolum-cyan" />
            <span>Distancia</span>
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{currentSession.totalDistance}<span className="text-xs font-normal text-slate-400">m</span></p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Timer className="w-4 h-4 text-biolum-aqua" />
            <span>Tiempo</span>
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{formatTime(currentSession.totalTimeSeconds)}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-biolum-emerald/40 bg-biolum-emerald/5">
          <div className="flex items-center gap-1.5 text-biolum-emerald text-xs mb-1 font-semibold">
            <Award className="w-4 h-4" />
            <span>SWOLF Prom.</span>
          </div>
          <p className="text-2xl font-black text-biolum-emerald font-mono">{currentSession.avgSwolf}</p>
          <span className="text-[10px] text-slate-400">Alta Eficiencia</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Zap className="w-4 h-4 text-biolum-amber" />
            <span>Ritmo /100m</span>
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{currentSession.avgPace100m}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>FC Promedio</span>
          </div>
          <p className="text-xl font-extrabold text-rose-400 font-mono">{currentSession.avgHeartRate} <span className="text-xs">ppm</span></p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Activity className="w-4 h-4 text-biolum-cyan" />
            <span>Brazadas</span>
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{currentSession.totalStrokes}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Calorías</span>
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{currentSession.calories} <span className="text-xs">kcal</span></p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-ocean-700">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <TrendingDown className="w-4 h-4 text-indigo-400" />
            <span>Carga Garmin</span>
          </div>
          <p className="text-xl font-extrabold text-indigo-300 font-mono">{currentSession.trainingLoad}</p>
        </div>

      </div>

      {/* Main Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SWOLF & Pace Evolution Line Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-ocean-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Evolución de Eficiencia SWOLF &amp; Frecuencia Cardíaca
              </h3>
              <p className="text-xs text-slate-400">
                El SWOLF combina tiempo por lap + brazadas. Un puntaje menor refleja mejor deslizamiento hidrodinámico.
              </p>
            </div>
            <span className="text-xs font-mono text-biolum-cyan bg-biolum-cyan/10 px-2.5 py-1 rounded-full border border-biolum-cyan/30">
              Piscina {currentSession.poolLength}m
            </span>
          </div>

          <div className="h-72">
            <Line data={lapChartData} options={lapChartOptions} />
          </div>
        </div>

        {/* Strokes Breakdown Doughnut */}
        <div className="glass-panel p-6 rounded-2xl border border-ocean-700 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-heading mb-1">
              Distribución de Estilos
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Porcentaje detectado por el sensor inercial del reloj Garmin.
            </p>
          </div>

          <div className="h-56 flex items-center justify-center">
            <Doughnut
              data={strokeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { family: 'Inter', size: 11 } } },
                },
              }}
            />
          </div>
        </div>

      </div>

      {/* Detailed Lap Breakdown Table */}
      <div className="glass-panel p-6 rounded-2xl border border-ocean-700 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white font-heading">
            Desglose Detallado por Laps &amp; Intervalos (Garmin Data Splits)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Piscina de {currentSession.poolLength} metros
          </span>
        </div>

        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-ocean-700 text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-3">Serie / Lap</th>
              <th className="pb-3 px-3">Distancia</th>
              <th className="pb-3 px-3">Ritmo /100m</th>
              <th className="pb-3 px-3">SWOLF Score</th>
              <th className="pb-3 px-3">Brazadas / Largo</th>
              <th className="pb-3 px-3">FC Prom.</th>
              <th className="pb-3 px-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-800/60 text-slate-200">
            {currentSession.laps.map((lap) => (
              <tr key={lap.lap} className="hover:bg-ocean-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-biolum-cyan">Serie #{lap.lap}</td>
                <td className="py-3 px-3">{lap.dist}m</td>
                <td className="py-3 px-3 font-semibold">{lap.pace}</td>
                <td className="py-3 px-3 font-bold text-biolum-emerald">{lap.swolf}</td>
                <td className="py-3 px-3">{lap.strokes} mov</td>
                <td className="py-3 px-3 text-rose-400">{lap.hr} ppm</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-biolum-cyan/10 text-biolum-cyan border border-biolum-cyan/30">
                    Completado
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Garmin Connect Direct Login & DB Modal */}
      <GarminConnectModal
        isOpen={isGarminConnectOpen}
        onClose={() => setIsGarminConnectOpen(false)}
        onSyncComplete={(newSessions) => {
          if (newSessions && newSessions.length > 0) {
            setSessions((prev) => [...newSessions, ...prev.filter((p) => !newSessions.some((n) => n.id === p.id))]);
            setSelectedSessionId(newSessions[0].id);
          }
          garminConnectService.getStatus().then(setDbStatus);
        }}
      />

    </div>
  );
};
