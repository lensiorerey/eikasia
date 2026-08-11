import React, { useState } from 'react';
import { WaterBackground } from './components/WaterBackground';
import { GarminDashboard } from './components/GarminDashboard';
import { PredictableRevenueSection } from './components/PredictableRevenueSection';
import { GarminIntegrationGuideModal } from './components/GarminIntegrationGuideModal';
import { aquaticAudio } from './audio/aquaticAudioEngine';
import {
  Waves,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Github,
  FileText,
  HelpCircle,
  Award,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('swim'); // 'swim' | 'revenue'
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
                    AQUATIC<span className="text-biolum-cyan">HUB</span>
                  </h1>
                  <span className="n64-badge text-[9px] font-retro bg-amber-500 text-ocean-950 px-2 py-0.5 rounded font-black tracking-widest">
                    N64 VIBE
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono">
                  Garmin Swim Analytics &amp; Predictable Revenue
                </p>
              </div>
            </div>

            {/* Central Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-2 bg-ocean-950/80 p-1.5 rounded-2xl border border-ocean-700">
              <button
                onClick={() => {
                  setActiveTab('swim');
                  aquaticAudio.playBubbleSound();
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'swim'
                    ? 'bg-biolum-cyan text-ocean-950 shadow-lg shadow-biolum-cyan/30'
                    : 'text-slate-300 hover:text-white hover:bg-ocean-800/50'
                }`}
              >
                <Waves className="w-4 h-4" />
                Garmin Swim Analytics
              </button>

              <button
                onClick={() => {
                  setActiveTab('revenue');
                  aquaticAudio.playBubbleSound();
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'revenue'
                    ? 'bg-biolum-emerald text-ocean-950 shadow-lg shadow-biolum-emerald/30'
                    : 'text-slate-300 hover:text-white hover:bg-ocean-800/50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Predictable Revenue Framework
              </button>
            </nav>

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

          {/* Mobile Tab Switcher */}
          <div className="md:hidden flex border-t border-ocean-800 bg-ocean-950/90">
            <button
              onClick={() => setActiveTab('swim')}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 ${
                activeTab === 'swim' ? 'border-biolum-cyan text-biolum-cyan' : 'border-transparent text-slate-400'
              }`}
            >
              🏊 Natación Garmin
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 ${
                activeTab === 'revenue' ? 'border-biolum-emerald text-biolum-emerald' : 'border-transparent text-slate-400'
              }`}
            >
              📈 Predictable Revenue
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-biolum-cyan/10 border border-biolum-cyan/30 text-biolum-cyan mb-4 animate-bounce">
            <Sparkles className="w-4 h-4" />
            Elegancia Acuática &amp; Rendimiento de Alto Nivel
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Visualiza tu <span className="text-shimmer">Rendimiento de Natación</span> &amp; Escala tus Ingresos
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal">
            Plataforma interactiva con análisis SWOLF de Garmin Connect, gráficos inmersivos y simulador del framework <em className="text-biolum-cyan font-serif">Predictable Revenue</em>.
          </p>
        </section>

        {/* Dynamic Content View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {activeTab === 'swim' ? (
            <GarminDashboard onOpenGuide={() => setIsGuideOpen(true)} />
          ) : (
            <PredictableRevenueSection />
          )}
        </main>

      </div>

      {/* Garmin Connect Integration Guide Modal */}
      <GarminIntegrationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSyncDemo={() => {
          setActiveTab('swim');
          aquaticAudio.playBubbleSound();
        }}
      />

      {/* Footer */}
      <footer className="relative z-10 glass-panel border-t border-ocean-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-biolum-cyan" />
            <span>Desarrollado para seguimiento de Natación Garmin &amp; Ventas B2B Predecibles</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="file:///Users/alejandrozacharias/Desktop/eikasia/Predictable_Revenue_Framework.md"
              className="text-biolum-cyan hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              Predictable_Revenue_Framework.md
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
