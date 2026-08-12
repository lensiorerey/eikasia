import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Users,
  User,
  Zap,
  Swords,
  Trophy,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Activity,
  Flame,
  Gauge,
  Edit3,
} from 'lucide-react';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

export const SwimStrokeSimulator = ({ session, allSessions = [] }) => {
  // Swimmer 1 settings
  const [swimmer1Gender, setSwimmer1Gender] = useState('male'); // 'male' | 'female'
  const [swimmer1Name, setSwimmer1Name] = useState('Nadador 1 (Tú)');
  const [customS1Swolf, setCustomS1Swolf] = useState(session?.avgSwolf || 32);
  const [customS1Dist, setCustomS1Dist] = useState(session?.totalDistance || 2500);
  const [customS1StrokesPerLap, setCustomS1StrokesPerLap] = useState(14);
  const [customS1Pace, setCustomS1Pace] = useState(session?.avgPace100m || '1:26');
  const [customS1Hr, setCustomS1Hr] = useState(session?.avgHeartRate || 145);

  // Swimmer 2 settings (Comparison mode)
  const [isComparisonMode, setIsComparisonMode] = useState(true);
  const [swimmer2Gender, setSwimmer2Gender] = useState('female');
  const [swimmer2Name, setSwimmer2Name] = useState('Nadador 2 (Rival)');
  const [customS2Swolf, setCustomS2Swolf] = useState(42); // Example SWOLF 42 requested by user
  const [customS2Dist, setCustomS2Dist] = useState(2200);
  const [customS2StrokesPerLap, setCustomS2StrokesPerLap] = useState(19);
  const [customS2Pace, setCustomS2Pace] = useState('1:45');
  const [customS2Hr, setCustomS2Hr] = useState(158);

  // Selected session selector for swimmer 2
  const [swimmer2SessionId, setSwimmer2SessionId] = useState(
    allSessions[1]?.id || allSessions[0]?.id || ''
  );

  // Animation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1); // 1x | 0.5x Slow-Mo
  const canvasRef = useRef(null);

  // Synchronize when props session changes
  useEffect(() => {
    if (session) {
      if (session.avgSwolf) setCustomS1Swolf(session.avgSwolf);
      if (session.totalDistance) setCustomS1Dist(session.totalDistance);
      if (session.avgPace100m) setCustomS1Pace(session.avgPace100m);
      if (session.avgHeartRate) setCustomS1Hr(session.avgHeartRate);
    }
  }, [session]);

  // Handle swimmer 2 session selection change
  useEffect(() => {
    if (swimmer2SessionId) {
      const selected = allSessions.find((s) => s.id === swimmer2SessionId);
      if (selected) {
        if (selected.avgSwolf) setCustomS2Swolf(selected.avgSwolf);
        if (selected.totalDistance) setCustomS2Dist(selected.totalDistance);
        if (selected.avgPace100m) setCustomS2Pace(selected.avgPace100m);
        if (selected.avgHeartRate) setCustomS2Hr(selected.avgHeartRate);
        setSwimmer2Name(selected.title ? selected.title.substring(0, 18) : 'Nadador 2');
      }
    }
  }, [swimmer2SessionId, allSessions]);

  // Derived DPS (Distance Per Stroke in meters/stroke for 25m pool)
  const s1DPS = (25 / Math.max(1, customS1StrokesPerLap)).toFixed(2);
  const s2DPS = (25 / Math.max(1, customS2StrokesPerLap)).toFixed(2);

  // Combined Averages
  const avgDist = Math.round((Number(customS1Dist) + Number(customS2Dist)) / 2);
  const avgSwolf = Math.round((Number(customS1Swolf) + Number(customS2Swolf)) / 2);
  const avgDPS = ((parseFloat(s1DPS) + parseFloat(s2DPS)) / 2).toFixed(2);
  const avgHr = Math.round((Number(customS1Hr) + Number(customS2Hr)) / 2);

  // Canvas Animation Engine (60 FPS HTML5 Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let posX1 = 60;
    let posX2 = 60;
    let armAngle1 = 0;
    let armAngle2 = 0;
    let bubbleParticles = [];

    // Water bubble particle generator
    for (let i = 0; i < 50; i++) {
      bubbleParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.5,
        speedY: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const laneHeight = isComparisonMode ? canvas.height / 2 : canvas.height;

      // Pool Grid & Lane Lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isComparisonMode) {
        // Olympic Center Lane Line
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Bubbles
      bubbleParticles.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${b.alpha})`;
        ctx.fill();
        b.y -= b.speedY;
        if (b.y < 0) b.y = canvas.height;
      });

      // Hydrodynamic Physics: Lower SWOLF & higher DPS = faster displacement
      if (isPlaying) {
        const speed1 = (46 / Math.max(18, customS1Swolf)) * 1.6 * animSpeed;
        const speed2 = (46 / Math.max(18, customS2Swolf)) * 1.6 * animSpeed;

        posX1 += speed1;
        posX2 += speed2;

        armAngle1 += 0.08 * (35 / Math.max(18, customS1Swolf)) * animSpeed;
        armAngle2 += 0.08 * (35 / Math.max(18, customS2Swolf)) * animSpeed;

        if (posX1 > canvas.width - 80) posX1 = 60;
        if (posX2 > canvas.width - 80) posX2 = 60;
      }

      // Render Swimmer 1
      const y1 = isComparisonMode ? laneHeight / 2 : canvas.height / 2;
      drawSwimmerAvatar(
        ctx,
        posX1,
        y1,
        swimmer1Gender,
        armAngle1,
        customS1Swolf,
        s1DPS,
        '#00f2fe',
        `🏊 ${swimmer1Name}`
      );

      // Render Swimmer 2 (Comparison Mode)
      if (isComparisonMode) {
        const y2 = laneHeight + laneHeight / 2;
        drawSwimmerAvatar(
          ctx,
          posX2,
          y2,
          swimmer2Gender,
          armAngle2,
          customS2Swolf,
          s2DPS,
          '#ff007f',
          `🏊 ${swimmer2Name}`
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isPlaying,
    animSpeed,
    isComparisonMode,
    swimmer1Gender,
    swimmer2Gender,
    customS1Swolf,
    customS2Swolf,
    s1DPS,
    s2DPS,
    swimmer1Name,
    swimmer2Name,
  ]);

  // Helper function to render swimmer 2D anatomical avatar & hydrodynamic drag waves
  const drawSwimmerAvatar = (
    ctx,
    x,
    y,
    gender,
    angle,
    swolf,
    dps,
    colorHex,
    nameLabel
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // Turbulence & Resistance Waves (Higher SWOLF = more drag turbulence)
    const turbulenceCount = Math.min(8, Math.max(2, Math.round(swolf / 6)));
    ctx.strokeStyle = swolf <= 34 ? 'rgba(0, 255, 179, 0.4)' : 'rgba(255, 75, 92, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 1; i <= turbulenceCount; i++) {
      ctx.beginPath();
      ctx.arc(-40 - i * 10, Math.sin(angle * 2 + i) * 6, 8 + i * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Bow Wave ahead of swimmer
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(35, 0, 14, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

    // Body Fill & Shadow Glow
    ctx.fillStyle = colorHex;
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 12;

    // Head
    ctx.beginPath();
    ctx.arc(30, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    // Torso Shape according to gender
    ctx.beginPath();
    if (gender === 'female') {
      ctx.moveTo(22, -9);
      ctx.lineTo(22, 9);
      ctx.lineTo(-10, 6);
      ctx.lineTo(-25, 4);
      ctx.lineTo(-25, -4);
      ctx.lineTo(-10, -6);
    } else {
      ctx.moveTo(22, -12);
      ctx.lineTo(22, 12);
      ctx.lineTo(-10, 7);
      ctx.lineTo(-25, 5);
      ctx.lineTo(-25, -5);
      ctx.lineTo(-10, -7);
    }
    ctx.closePath();
    ctx.fill();

    // Arm Pull & Catch Animation Cycle
    const strokeX = Math.cos(angle) * 28;
    const strokeY = Math.sin(angle) * 16;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(15, -10);
    ctx.lineTo(15 + strokeX, -10 + strokeY);
    ctx.lineTo(15 + strokeX * 1.3, -10 + strokeY * 0.5);
    ctx.stroke();

    const strokeX2 = Math.cos(angle + Math.PI) * 28;
    const strokeY2 = Math.sin(angle + Math.PI) * 16;
    ctx.beginPath();
    ctx.moveTo(15, 10);
    ctx.lineTo(15 + strokeX2, 10 + strokeY2);
    ctx.lineTo(15 + strokeX2 * 1.3, 10 + strokeY2 * 0.5);
    ctx.stroke();

    // Flutter Kick Legs Oscillation
    const kickY = Math.sin(angle * 4) * 8;
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-25, -3);
    ctx.lineTo(-45, -3 + kickY);
    ctx.moveTo(-25, 3);
    ctx.lineTo(-45, 3 - kickY);
    ctx.stroke();

    // Swimmer HUD Labels
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(nameLabel, -30, -22);

    ctx.fillStyle = colorHex;
    ctx.font = '10px monospace';
    ctx.fillText(`SWOLF ${swolf} | ${dps}m/mov`, -30, 28);

    ctx.restore();
  };

  return (
    <div className="glass-panel-glow p-6 md:p-8 rounded-3xl border border-biolum-cyan/60 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-biolum-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-ocean-700">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40 flex items-center gap-1.5 shadow-lg shadow-biolum-cyan/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              MÓDULO PRINCIPAL DE SIMULACIÓN DE EFICIENCIA HIDRODINÁMICA
            </span>
            <span className="text-xs text-slate-300 font-mono">Garmin Watch Telemetry Engine</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight">
            Simulador Biomecánico &amp; <span className="text-shimmer">Comparación de Nadadores</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Modifica directamente el SWOLF (ej. 42, 32), la distancia por brazada y el pulso cardíaco para simular y comparar la eficiencia en tiempo real.
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 bg-ocean-950/90 p-1.5 rounded-2xl border border-ocean-700 shrink-0">
          <button
            onClick={() => {
              aquaticAudio.playBubbleSound();
              setIsComparisonMode(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isComparisonMode
                ? 'bg-biolum-cyan text-ocean-950 shadow-md shadow-biolum-cyan/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Nadador Individual
          </button>

          <button
            onClick={() => {
              aquaticAudio.playBubbleSound();
              setIsComparisonMode(true);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isComparisonMode
                ? 'bg-biolum-emerald text-ocean-950 shadow-md shadow-biolum-emerald/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4 text-amber-300" />
            Modo Comparación (2 Nadadores)
          </button>
        </div>
      </div>

      {/* Live Swimmer Parameters Tuning Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Swimmer 1 Param Card */}
        <div className="p-4 rounded-2xl bg-ocean-950/80 border border-biolum-cyan/50 space-y-3">
          <div className="flex items-center justify-between border-b border-ocean-800 pb-2">
            <span className="text-xs font-bold text-biolum-cyan flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-300" />
              1. Nadador Principal (Tú / Garmin)
            </span>

            {/* Gender Toggle */}
            <div className="flex items-center gap-1 bg-ocean-900 p-0.5 rounded-lg border border-ocean-700 text-[10px]">
              <button
                onClick={() => setSwimmer1Gender('male')}
                className={`px-2 py-0.5 rounded font-bold ${
                  swimmer1Gender === 'male' ? 'bg-biolum-cyan text-ocean-950' : 'text-slate-400'
                }`}
              >
                Hombre ♂
              </button>
              <button
                onClick={() => setSwimmer1Gender('female')}
                className={`px-2 py-0.5 rounded font-bold ${
                  swimmer1Gender === 'female' ? 'bg-biolum-cyan text-ocean-950' : 'text-slate-400'
                }`}
              >
                Mujer ♀
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block">SWOLF Real</label>
              <input
                type="number"
                value={customS1Swolf}
                onChange={(e) => setCustomS1Swolf(e.target.value)}
                className="w-full bg-ocean-900 border border-ocean-700 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-biolum-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block">Brazadas/25m</label>
              <input
                type="number"
                value={customS1StrokesPerLap}
                onChange={(e) => setCustomS1StrokesPerLap(e.target.value)}
                className="w-full bg-ocean-900 border border-ocean-700 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-biolum-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block">Distancia (m)</label>
              <input
                type="number"
                value={customS1Dist}
                onChange={(e) => setCustomS1Dist(e.target.value)}
                className="w-full bg-ocean-900 border border-ocean-700 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-biolum-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block">Ritmo 100m</label>
              <input
                type="text"
                value={customS1Pace}
                onChange={(e) => setCustomS1Pace(e.target.value)}
                className="w-full bg-ocean-900 border border-ocean-700 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-biolum-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Swimmer 2 Param Card */}
        {isComparisonMode && (
          <div className="p-4 rounded-2xl bg-ocean-950/80 border border-rose-500/50 space-y-3">
            <div className="flex items-center justify-between border-b border-ocean-800 pb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <Swords className="w-4 h-4 text-rose-400" />
                2. Nadador Comparativo (Rival / Amigo)
              </span>

              {/* Gender Toggle */}
              <div className="flex items-center gap-1 bg-ocean-900 p-0.5 rounded-lg border border-ocean-700 text-[10px]">
                <button
                  onClick={() => setSwimmer2Gender('male')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    swimmer2Gender === 'male' ? 'bg-rose-500 text-white' : 'text-slate-400'
                  }`}
                >
                  Hombre ♂
                </button>
                <button
                  onClick={() => setSwimmer2Gender('female')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    swimmer2Gender === 'female' ? 'bg-rose-500 text-white' : 'text-slate-400'
                  }`}
                >
                  Mujer ♀
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">SWOLF Real</label>
                <input
                  type="number"
                  value={customS2Swolf}
                  onChange={(e) => setCustomS2Swolf(e.target.value)}
                  className="w-full bg-ocean-900 border border-rose-900/60 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Brazadas/25m</label>
                <input
                  type="number"
                  value={customS2StrokesPerLap}
                  onChange={(e) => setCustomS2StrokesPerLap(e.target.value)}
                  className="w-full bg-ocean-900 border border-rose-900/60 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Distancia (m)</label>
                <input
                  type="number"
                  value={customS2Dist}
                  onChange={(e) => setCustomS2Dist(e.target.value)}
                  className="w-full bg-ocean-900 border border-rose-900/60 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block">Ritmo 100m</label>
                <input
                  type="text"
                  value={customS2Pace}
                  onChange={(e) => setCustomS2Pace(e.target.value)}
                  className="w-full bg-ocean-900 border border-rose-900/60 rounded-lg px-2.5 py-1 text-white font-bold text-sm focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* HTML5 Canvas Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-biolum-cyan/40 bg-gradient-to-b from-ocean-950 via-ocean-900 to-ocean-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={850}
          height={isComparisonMode ? 320 : 200}
          className="w-full h-auto block cursor-pointer"
        />

        {/* Simulation Controls Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => {
              aquaticAudio.playBubbleSound();
              setIsPlaying(!isPlaying);
            }}
            className="px-3 py-1 rounded-xl bg-ocean-950/90 text-biolum-cyan border border-biolum-cyan/40 font-bold text-xs flex items-center gap-1.5 hover:bg-biolum-cyan/20 transition-all backdrop-blur-md"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Reproducir
              </>
            )}
          </button>

          <div className="flex items-center gap-1 bg-ocean-950/90 p-1 rounded-xl border border-ocean-700 backdrop-blur-md">
            <button
              onClick={() => setAnimSpeed(0.5)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                animSpeed === 0.5 ? 'bg-amber-400 text-ocean-950' : 'text-slate-400'
              }`}
            >
              0.5x Slow
            </button>
            <button
              onClick={() => setAnimSpeed(1)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                animSpeed === 1 ? 'bg-biolum-cyan text-ocean-950' : 'text-slate-400'
              }`}
            >
              1.0x Normal
            </button>
          </div>
        </div>
      </div>

      {/* Promedio Total del Nado Combinado & Head-to-Head Telemetry Cards */}
      {isComparisonMode && (
        <div className="space-y-4 animate-slideDown">
          
          {/* COMBINED TOTAL AVERAGE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-biolum-cyan/15 via-ocean-900 to-biolum-emerald/15 border border-biolum-cyan/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40">
                <Gauge className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  Promedio Total Combinado del Nado
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-biolum-emerald/20 text-biolum-emerald border border-biolum-emerald/30">
                    2 Nadadores
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Consolidado biomecánico global de ambos nadadores en la piscina.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-ocean-950/80 px-3 py-1.5 rounded-xl border border-ocean-750">
                <div className="text-[9px] text-slate-400">Distancia Prom.</div>
                <div className="font-bold text-white text-sm">{avgDist}m</div>
              </div>
              <div className="bg-ocean-950/80 px-3 py-1.5 rounded-xl border border-ocean-750">
                <div className="text-[9px] text-slate-400">SWOLF Prom.</div>
                <div className="font-bold text-biolum-cyan text-sm">{avgSwolf}</div>
              </div>
              <div className="bg-ocean-950/80 px-3 py-1.5 rounded-xl border border-ocean-750">
                <div className="text-[9px] text-slate-400">Largo Brazada</div>
                <div className="font-bold text-biolum-emerald text-sm">{avgDPS}m/mov</div>
              </div>
              <div className="bg-ocean-950/80 px-3 py-1.5 rounded-xl border border-ocean-750">
                <div className="text-[9px] text-slate-400">Pulso Prom.</div>
                <div className="font-bold text-rose-300 text-sm">{avgHr} ppm</div>
              </div>
            </div>
          </div>

          {/* Individual Swimmers Telemetry Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Swimmer 1 Telemetry */}
            <div className="p-4 rounded-2xl bg-ocean-900/90 border border-biolum-cyan/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-biolum-cyan">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  {swimmer1Name} ({swimmer1Gender === 'male' ? 'Hombre ♂' : 'Mujer ♀'})
                </span>
                <span className="font-mono bg-biolum-cyan/20 px-2 py-0.5 rounded text-biolum-cyan border border-biolum-cyan/30">
                  SWOLF {customS1Swolf}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                  <div className="text-[10px] text-slate-400">Largo de Brazada</div>
                  <div className="font-bold text-white text-sm">{s1DPS} m/mov</div>
                </div>
                <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                  <div className="text-[10px] text-slate-400">Hidrodinámica</div>
                  <div className="font-bold text-biolum-emerald text-sm">
                    {customS1Swolf <= 34 ? 'Élite (Bajo Arrastre)' : 'Moderado'}
                  </div>
                </div>
                <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                  <div className="text-[10px] text-slate-400">Ritmo / 100m</div>
                  <div className="font-bold text-white text-sm">{customS1Pace}</div>
                </div>
              </div>
            </div>

            {/* Swimmer 2 Telemetry */}
            <div className="p-4 rounded-2xl bg-ocean-900/90 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-rose-400" />
                  {swimmer2Name} ({swimmer2Gender === 'male' ? 'Hombre ♂' : 'Mujer ♀'})
                </span>
                <span className="font-mono bg-rose-500/20 px-2 py-0.5 rounded text-rose-300 border border-rose-500/30">
                  SWOLF {customS2Swolf}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                  <div className="text-[10px] text-slate-400">Largo de Brazada</div>
                  <div className="font-bold text-white text-sm">{s2DPS} m/mov</div>
                </div>
                <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                  <div className="text-[10px] text-slate-400">Diferencia SWOLF</div>
                  <div
                    className={`font-bold text-sm ${
                      Number(customS1Swolf) < Number(customS2Swolf)
                        ? 'text-biolum-emerald'
                        : 'text-rose-400'
                    }`}
                  >
                    {Number(customS1Swolf) < Number(customS2Swolf)
                      ? `+${customS2Swolf - customS1Swolf} pts Mejor`
                      : `-${customS1Swolf - customS2Swolf} pts`}
                  </div>
                </div>
                <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                  <div className="text-[10px] text-slate-400">Ritmo / 100m</div>
                  <div className="font-bold text-white text-sm">{customS2Pace}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
