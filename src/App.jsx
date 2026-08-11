import React, { useState } from 'react';
import { WaterBackground } from './components/WaterBackground';
import { GarminDashboard } from './components/GarminDashboard';
import { GarminIntegrationGuideModal } from './components/GarminIntegrationGuideModal';
import { aquaticAudio } from './audio/aquaticAudioEngine';
import {
  Waves,
  Play,
  Pause,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react';

export function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.25);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const toggleAudio = () => {
    const playing = aquaticAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setAudioVolume(val);
    aquaticAudio.setVolume(val);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      
      {/* Real-time HTML5 Water Canvas Background */}
      <WaterBackground />

      {/* Main Content Overlay */}
      <div className="relative z-10">
        
        {/* Navigation Bar */}
        <header className="glass-panel sticky top-0 z-40 border-b border-biolum-cyan/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-biolum-cyan to-biolum-aqua p-0.5 shadow-lg shadow-biolum-cyan/20">
                <div className="w-full h-full bg-ocean-950 rounded-[10px] flex items-center justify-center text-biolum-cyan">
                  <Waves className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold font-heading text-white tracking-tight">
                    SWIM<span className="text-biolum-cyan">CONNECT PRO</span>
                  </h1>
                  <span className="n64-badge text-[9px] font-retro bg-amber-500 text-ocean-950 px-2 py-0.5 rounded font-black tracking-widest">
                    GARMIN 2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono">
                  Plataforma de Eficiencia Hidrodinámica &amp; Comparación de Nadadores
                </p>
              </div>
            </div>

            {/* Center Info Badge */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-biolum-teal bg-ocean-950/80 px-4 py-2 rounded-2xl border border-ocean-750">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Optimización SWOLF &amp; Simulador 2D</span>
            </div>

            {/* Right Tools: Audio Synthesizer Controls */}
            <div className="flex items-center gap-3">
              <div className="glass-panel px-3 py-1.5 rounded-xl border border-biolum-cyan/30 flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  title="Música Ambiental Acuática Synthesizer (Estilo DK64)"
                  className="flex items-center gap-2 text-xs text-biolum-cyan hover:text-white transition-colors"
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-biolum-cyan animate-pulse" />
                      <span className="hidden sm:inline font-mono text-[10px]">Aquatic Sound FX ON</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-slate-400" />
                      <span className="hidden sm:inline font-mono text-[10px] text-slate-400">Play Aquatic Vibe</span>
                    </>
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.02"
                  value={audioVolume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-biolum-cyan cursor-pointer hidden sm:block"
                />
              </div>
            </div>

          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-biolum-cyan/10 border border-biolum-cyan/30 text-biolum-cyan mb-3 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300" />
            100% Enfocado en Eficiencia de Natación &amp; Telemetría Garmin Connect
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Mejora tu <span className="text-shimmer">Técnica de Natación</span> &amp; Compara tu Desempeño
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-2 font-normal">
            Conecta tu reloj Garmin Connect, analiza tu índice SWOLF, distancia por brazada (DPS) y compara métricas cabeza a cabeza con otros nadadores.
          </p>
        </section>

        {/* Main Dashboard View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <GarminDashboard onOpenGuide={() => setIsGuideOpen(true)} />
        </main>

      </div>

      {/* Garmin Connect Integration Guide Modal */}
      <GarminIntegrationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSyncDemo={() => {
          aquaticAudio.playBubbleSound();
        }}
      />

      {/* Footer */}
      <footer className="relative z-10 glass-panel border-t border-ocean-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-biolum-cyan" />
            <span>Plataforma de Seguimiento de Natación Garmin &amp; Análisis Biomecánico 60 FPS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
