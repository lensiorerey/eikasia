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
} from 'lucide-react';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

export const SwimStrokeSimulator = ({ session, allSessions = [] }) => {
  // Swimmer 1 settings
  const [swimmer1Gender, setSwimmer1Gender] = useState('male'); // 'male' | 'female'

  // Comparison mode settings
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [swimmer2Gender, setSwimmer2Gender] = useState('female');
  const [swimmer2SessionId, setSwimmer2SessionId] = useState(
    allSessions[1]?.id || allSessions[0]?.id || ''
  );

  // Animation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1); // 1x | 0.5x Slow-Mo | 1.5x
  const canvasRef = useRef(null);

  // Swimmer 1 telemetry
  const s1Swolf = session?.avgSwolf || 33;
  const s1PoolLen = session?.poolLength || 25;
  const s1TotalDist = session?.totalDistance || 2800;
  const s1TimeSecs = session?.totalTimeSeconds || 3120;
  const s1Strokes = session?.totalStrokes || 1450;
  const s1DPS = (s1TotalDist / Math.max(1, s1Strokes)).toFixed(2); // meters per stroke

  // Swimmer 2 telemetry
  const swimmer2Session =
    allSessions.find((s) => s.id === swimmer2SessionId) ||
    allSessions[1] ||
    allSessions[0] ||
    session;
  const s2Swolf = swimmer2Session?.avgSwolf || 38;
  const s2PoolLen = swimmer2Session?.poolLength || 25;
  const s2TotalDist = swimmer2Session?.totalDistance || 2500;
  const s2Strokes = swimmer2Session?.totalStrokes || 1500;
  const s2DPS = (s2TotalDist / Math.max(1, s2Strokes)).toFixed(2);

  // Canvas Animation Effect
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

    // Initialize bubble particles
    for (let i = 0; i < 45; i++) {
      bubbleParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.5,
        speedY: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Water Pool Lanes Background
      const laneHeight = isComparisonMode ? canvas.height / 2 : canvas.height;

      // Lane dividers & Pool Grid
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isComparisonMode) {
        // Center Lane Rope
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 2. Draw Bubbles
      bubbleParticles.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${b.alpha})`;
        ctx.fill();
        b.y -= b.speedY;
        if (b.y < 0) b.y = canvas.height;
      });

      // 3. Move Swimmers based on efficiency (DPS & SWOLF)
      if (isPlaying) {
        // Lower SWOLF = Faster forward glide displacement per stroke cycle
        const speed1 = (45 / Math.max(20, s1Swolf)) * 1.6 * animSpeed;
        const speed2 = (45 / Math.max(20, s2Swolf)) * 1.6 * animSpeed;

        posX1 += speed1;
        posX2 += speed2;
        armAngle1 += 0.08 * (35 / s1Swolf) * animSpeed;
        armAngle2 += 0.08 * (35 / s2Swolf) * animSpeed;

        if (posX1 > canvas.width - 80) posX1 = 60;
        if (posX2 > canvas.width - 80) posX2 = 60;
      }

      // Draw Swimmer 1
      const y1 = isComparisonMode ? laneHeight / 2 : canvas.height / 2;
      drawSwimmerAvatar(
        ctx,
        posX1,
        y1,
        swimmer1Gender,
        armAngle1,
        s1Swolf,
        s1DPS,
        '#00f2fe',
        'Nadador 1 (Tú)'
      );

      // Draw Swimmer 2 (Comparison Mode)
      if (isComparisonMode) {
        const y2 = laneHeight + laneHeight / 2;
        drawSwimmerAvatar(
          ctx,
          posX2,
          y2,
          swimmer2Gender,
          armAngle2,
          s2Swolf,
          s2DPS,
          '#ff007f',
          `Nadador 2 (${swimmer2Session.userEmail ? swimmer2Session.userEmail.split('@')[0] : 'Rival'})`
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
    s1Swolf,
    s2Swolf,
    s1DPS,
    s2DPS,
    swimmer2SessionId,
  ]);

  // Helper: Draw 2D Swimmer Hydrodynamic Silhouette & Water Resistance Waves
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

    // Hydrodynamic Resistance Water Trails (Turbulence increases with higher SWOLF)
    const turbulenceCount = Math.min(8, Math.max(2, Math.round(swolf / 6)));
    ctx.strokeStyle = swolf <= 34 ? 'rgba(0, 255, 179, 0.4)' : 'rgba(255, 75, 92, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 1; i <= turbulenceCount; i++) {
      ctx.beginPath();
      ctx.arc(-40 - i * 10, (Math.sin(angle * 2 + i) * 6), 8 + i * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Hydrodynamic Slip Wave (Bow Wave ahead of head)
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(35, 0, 14, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

    // Body Torso (Gender Anatomical Scaling)
    ctx.fillStyle = colorHex;
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 12;

    // Head
    ctx.beginPath();
    ctx.arc(30, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    // Torso Shape (Shoulders & Waist)
    ctx.beginPath();
    if (gender === 'female') {
      // Sleek tapered female swimmer torso
      ctx.moveTo(22, -9);
      ctx.lineTo(22, 9);
      ctx.lineTo(-10, 6);
      ctx.lineTo(-25, 4);
      ctx.lineTo(-25, -4);
      ctx.lineTo(-10, -6);
    } else {
      // V-taper male swimmer torso
      ctx.moveTo(22, -12);
      ctx.lineTo(22, 12);
      ctx.lineTo(-10, 7);
      ctx.lineTo(-25, 5);
      ctx.lineTo(-25, -5);
      ctx.lineTo(-10, -7);
    }
    ctx.closePath();
    ctx.fill();

    // Arm Stroke Cycle Animation (High-elbow Catch & Pull)
    const strokeX = Math.cos(angle) * 28;
    const strokeY = Math.sin(angle) * 16;

    // Right Arm (Pull phase)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(15, -10);
    ctx.lineTo(15 + strokeX, -10 + strokeY);
    ctx.lineTo(15 + strokeX * 1.3, -10 + strokeY * 0.5);
    ctx.stroke();

    // Left Arm (Recobro/Recovery phase)
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

    // Label & HUD Overlay on Swimmer
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
    <div className="glass-panel-glow p-6 md:p-8 rounded-3xl border border-biolum-cyan/50 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-biolum-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-ocean-700">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40 flex items-center gap-1.5 shadow-lg shadow-biolum-cyan/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              SIMULADOR DE BRAZADA 2D & MODO COMPARACIÓN
            </span>
            <span className="text-xs text-slate-400 font-mono">Hydrodynamic Canvas Engine</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black font-heading text-white tracking-tight">
            Simulación de <span className="text-shimmer">Eficiencia Hidrodinámica</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Visualiza en tiempo real el deslizamiento, turbulencia de agua y frecuencia de brazada según el SWOLF y la distancia por brazada (DPS).
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 bg-ocean-950/80 p-1.5 rounded-2xl border border-ocean-700">
          <button
            onClick={() => {
              aquaticAudio.playBubbleSound();
              setIsComparisonMode(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !isComparisonMode
                ? 'bg-biolum-cyan text-ocean-950 font-bold shadow-md shadow-biolum-cyan/30'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isComparisonMode
                ? 'bg-biolum-emerald text-ocean-950 font-bold shadow-md shadow-biolum-emerald/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4 text-amber-300" />
            Modo Comparación (2 Nadadores)
          </button>
        </div>
      </div>

      {/* Control Panel Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-ocean-950/80 rounded-2xl border border-ocean-750 text-xs">
        {/* Swimmer 1 Sex & Avatar Selector */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <User className="w-4 h-4 text-biolum-cyan" />
            Nadador 1 (Sexo):
          </span>
          <div className="flex items-center gap-1 bg-ocean-900 p-1 rounded-xl border border-ocean-700">
            <button
              onClick={() => setSwimmer1Gender('male')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                swimmer1Gender === 'male'
                  ? 'bg-biolum-cyan text-ocean-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hombre ♂
            </button>
            <button
              onClick={() => setSwimmer1Gender('female')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                swimmer1Gender === 'female'
                  ? 'bg-biolum-cyan text-ocean-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mujer ♀
            </button>
          </div>
        </div>

        {/* Swimmer 2 Selector (Comparison Mode Only) */}
        {isComparisonMode ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-rose-400" />
              Nadador 2 (Rival):
            </span>
            <div className="flex items-center gap-1">
              <select
                value={swimmer2SessionId}
                onChange={(e) => setSwimmer2SessionId(e.target.value)}
                className="bg-ocean-900 border border-ocean-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-biolum-cyan"
              >
                {allSessions.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {s.title.substring(0, 22)}... (SWOLF {s.avgSwolf})
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  setSwimmer2Gender(swimmer2Gender === 'male' ? 'female' : 'male')
                }
                className="px-2 py-1 rounded bg-ocean-800 text-biolum-cyan border border-ocean-600 font-bold"
              >
                {swimmer2Gender === 'male' ? '♂' : '♀'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 text-slate-400 font-mono">
            <span>Telemetría: Garmin Swim 2 Active</span>
            <span className="text-biolum-cyan">SWOLF {s1Swolf}</span>
          </div>
        )}

        {/* Simulation Speed & Play/Pause */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              aquaticAudio.playBubbleSound();
              setIsPlaying(!isPlaying);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40 font-bold flex items-center gap-1.5 hover:bg-biolum-cyan/30 transition-all"
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

          <div className="flex items-center gap-1 bg-ocean-900 p-1 rounded-xl border border-ocean-700">
            <button
              onClick={() => setAnimSpeed(0.5)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                animSpeed === 0.5 ? 'bg-amber-400 text-ocean-950' : 'text-slate-400'
              }`}
            >
              0.5x Slow
            </button>
            <button
              onClick={() => setAnimSpeed(1)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                animSpeed === 1 ? 'bg-biolum-cyan text-ocean-950' : 'text-slate-400'
              }`}
            >
              1.0x Normal
            </button>
          </div>
        </div>
      </div>

      {/* HTML5 Canvas Simulation Area */}
      <div className="relative rounded-2xl overflow-hidden border border-biolum-cyan/40 bg-gradient-to-b from-ocean-950 via-ocean-900 to-ocean-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={850}
          height={isComparisonMode ? 320 : 200}
          className="w-full h-auto block cursor-pointer"
        />

        {/* Floating Overlay Info Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-ocean-950/80 text-biolum-cyan border border-biolum-cyan/40 backdrop-blur-md">
            🌊 Hidro-Simulador 60 FPS
          </span>
        </div>
      </div>

      {/* Head-to-Head Comparison Stats Cards (When comparison is active) */}
      {isComparisonMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
          {/* Swimmer 1 Telemetry Card */}
          <div className="p-4 rounded-2xl bg-ocean-900/90 border border-biolum-cyan/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-biolum-cyan">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-300" />
                Nadador 1 (Tú - {swimmer1Gender === 'male' ? 'Hombre' : 'Mujer'})
              </span>
              <span className="font-mono">SWOLF {s1Swolf}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                <div className="text-[10px] text-slate-400">DPS (Metros/Brazada)</div>
                <div className="font-bold text-white text-base">{s1DPS}m</div>
              </div>
              <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                <div className="text-[10px] text-slate-400">Resistencia al Agua</div>
                <div className="font-bold text-biolum-emerald text-base">
                  {s1Swolf <= 34 ? 'Baja (Glide)' : 'Moderada'}
                </div>
              </div>
              <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                <div className="text-[10px] text-slate-400">Brazadas Totales</div>
                <div className="font-bold text-white text-base">{s1Strokes}</div>
              </div>
            </div>
          </div>

          {/* Swimmer 2 Telemetry Card */}
          <div className="p-4 rounded-2xl bg-ocean-900/90 border border-rose-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span className="flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-rose-400" />
                Nadador 2 (Rival - {swimmer2Gender === 'male' ? 'Hombre' : 'Mujer'})
              </span>
              <span className="font-mono">SWOLF {s2Swolf}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                <div className="text-[10px] text-slate-400">DPS (Metros/Brazada)</div>
                <div className="font-bold text-white text-base">{s2DPS}m</div>
              </div>
              <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                <div className="text-[10px] text-slate-400">Diferencia Eficiencia</div>
                <div
                  className={`font-bold text-base ${
                    s1Swolf < s2Swolf ? 'text-biolum-emerald' : 'text-rose-400'
                  }`}
                >
                  {s1Swolf < s2Swolf ? `+${s2Swolf - s1Swolf} pts Mejor` : `-${s1Swolf - s2Swolf} pts`}
                </div>
              </div>
              <div className="bg-ocean-950 p-2 rounded-xl border border-ocean-800">
                <div className="text-[10px] text-slate-400">Brazadas Totales</div>
                <div className="font-bold text-white text-base">{s2Strokes}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
