import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Zap,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { garminConnectService } from '../services/garminConnectService';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

export const GarminConnectModal = ({ isOpen, onClose, onSyncComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dbTarget, setDbTarget] = useState('firestore');
  const [rememberSession, setRememberSession] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [connectionInfo, setConnectionInfo] = useState({ isConnected: false });

  // Load existing connection on modal open
  useEffect(() => {
    if (isOpen) {
      garminConnectService.getStatus().then((status) => {
        setConnectionInfo(status);
        if (status.userEmail) {
          setEmail(status.userEmail);
        }
      });
      setErrorMessage('');
      setCurrentStep(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    aquaticAudio.playSplash();

    try {
      const result = await garminConnectService.connectAndSync(
        email,
        password,
        (progressInfo) => {
          setCurrentStep(progressInfo);
        }
      );

      aquaticAudio.playSonar();
      setConnectionInfo(result.connectionInfo);
      setIsLoading(false);

      if (onSyncComplete) {
        onSyncComplete(result.sessions);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage(err.message || 'Error al conectar con los servidores de Garmin.');
    }
  };

  const handleDisconnect = async () => {
    aquaticAudio.playSplash();
    await garminConnectService.disconnect();
    setConnectionInfo({ isConnected: false });
    setEmail('');
    setPassword('');
    setCurrentStep(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-xl rounded-2xl p-6 md:p-8 text-slate-100 max-h-[92vh] overflow-y-auto relative border border-biolum-cyan/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-biolum-cyan transition-colors p-2 rounded-full hover:bg-ocean-800/50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-ocean-700/60 pb-4">
          <div className="p-3 bg-biolum-cyan/10 border border-biolum-cyan/40 rounded-xl text-biolum-cyan shadow-lg shadow-biolum-cyan/10">
            <Cpu className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
              Conexión Directa Garmin Connect
              <span className="text-xs px-2 py-0.5 rounded-full bg-biolum-cyan/20 text-biolum-cyan border border-biolum-cyan/40 font-mono">
                API & DB
              </span>
            </h2>
            <p className="text-sm text-slate-300">
              Conecta tu usuario de Garmin para sincronizar la telemetría directo a la Base de Datos.
            </p>
          </div>
        </div>

        {/* Connected State View */}
        {connectionInfo.isConnected && !isLoading ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-ocean-900/90 border border-biolum-emerald/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-biolum-emerald font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Usuario Garmin Conectado en Vivo</span>
                </div>
                <span className="px-2.5 py-1 text-xs rounded-full bg-biolum-emerald/20 text-biolum-emerald border border-biolum-emerald/40 font-mono">
                  Base de Datos Activa
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-300 bg-ocean-950/60 p-3.5 rounded-xl border border-ocean-800 font-mono">
                <p>
                  <strong className="text-slate-400">Cuenta Garmin:</strong>{' '}
                  <span className="text-biolum-cyan">{connectionInfo.userEmail}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Base de Datos:</strong> Firebase Firestore Cloud
                </p>
                <p>
                  <strong className="text-slate-400">Última Sincronización:</strong>{' '}
                  {new Date(connectionInfo.lastSynced).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConnectSubmit}
                className="flex-1 glass-button py-3 px-4 rounded-xl text-biolum-cyan font-medium flex items-center justify-center gap-2 border border-biolum-cyan/50 hover:bg-biolum-cyan/20 transition-all"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                Forzar Resincronización Ahora
              </button>

              <button
                onClick={handleDisconnect}
                className="px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center gap-2 font-medium text-xs"
              >
                <LogOut className="w-4 h-4" />
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          /* Login Form & Progress */
          <form onSubmit={handleConnectSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-biolum-cyan" />
                Correo Electrónico de Garmin Connect
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@deportista.com"
                  className="w-full px-4 py-3 rounded-xl bg-ocean-950/80 border border-ocean-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-biolum-cyan transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-biolum-cyan" />
                Contraseña de Garmin Connect
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-ocean-950/80 border border-ocean-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-biolum-cyan transition-all text-sm font-mono"
                />
              </div>
            </div>

            {/* Target Database Selection */}
            <div className="p-3.5 bg-ocean-900/60 rounded-xl border border-ocean-750 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-biolum-teal">
                  <Database className="w-4 h-4" /> Destination Database
                </span>
                <span className="text-[10px] text-biolum-cyan font-mono">Realtime Firestore</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Los datos de natación descargados se persistirán en la base de datos para consulta permanente y generación de estadísticas de rendimiento.
              </p>
            </div>

            {/* Loading / Progress Animation */}
            {isLoading && currentStep && (
              <div className="p-4 rounded-xl bg-ocean-900/90 border border-biolum-cyan/40 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-biolum-cyan animate-spin" />
                  <div>
                    <h4 className="text-xs font-bold text-biolum-cyan">
                      Paso {currentStep.step} de 5: {currentStep.title}
                    </h4>
                    <p className="text-[11px] text-slate-300">{currentStep.detail}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-ocean-950 rounded-full h-1.5 overflow-hidden border border-ocean-700">
                  <div
                    className="bg-gradient-to-r from-biolum-cyan to-biolum-teal h-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep.step / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-biolum-cyan/80 via-ocean-600 to-biolum-teal/80 hover:from-biolum-cyan hover:to-biolum-teal border border-biolum-cyan/50 shadow-lg shadow-biolum-cyan/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Autenticando y Sincronizando BD...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Conectar Garmin & Sincronizar Base de Datos
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Guarantee Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-ocean-800">
              <ShieldCheck className="w-4 h-4 text-biolum-emerald" />
              <span>Conexión cifrada de extremo a extremo SSL/TLS. Credenciales protegidas.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
