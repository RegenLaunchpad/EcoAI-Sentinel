
import React, { useState, useEffect } from 'react';
import { AppMode, UserState, ComputeIntensity } from './types';
import { IndividualChat } from './components/IndividualChat';
import { BusinessDashboard } from './components/BusinessDashboard';
import { PermacomputingConsultant } from './components/PermacomputingConsultant';
import { OnboardingIntent } from './components/OnboardingIntent';
import { Logo } from './components/Logo';
import { ENERGY_PER_TOKEN, WATER_PER_TOKEN } from './constants';

const WORKDAY_SECONDS = 8 * 60 * 60; // 8 Hours

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.INDIVIDUAL);
  const [isSystemOn, setIsSystemOn] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(WORKDAY_SECONDS);
  
  const [userState, setUserState] = useState<UserState>({
    tokensRemaining: 2500,
    totalDonated: 0,
    history: [],
    computeMode: ComputeIntensity.MEDIUM,
    isAutoMode: true,
    hasStartedSession: false,
    metrics: {
      waterUsedLiters: 0,
      energyConsumedWh: 0,
      tokensUsed: 0,
      biodiversityImpactScore: 92,
      financialBenefit: 0
    }
  });

  // Workday timer logic
  useEffect(() => {
    let timer: number;
    if (isSystemOn && secondsRemaining > 0) {
      timer = window.setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    if (secondsRemaining === 0) {
      setIsSystemOn(false);
    }

    return () => clearInterval(timer);
  }, [isSystemOn, secondsRemaining]);

  useEffect(() => {
    setUserState(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        energyConsumedWh: prev.metrics.tokensUsed * ENERGY_PER_TOKEN,
        waterUsedLiters: prev.metrics.tokensUsed * WATER_PER_TOKEN,
      }
    }));
  }, [userState.metrics.tokensUsed]);

  const updateState = (newState: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const handleStartSession = (mode: ComputeIntensity, initialPrompt?: string) => {
    updateState({ 
      computeMode: mode, 
      hasStartedSession: true,
      pendingInput: initialPrompt
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className={`h-screen flex flex-col p-4 md:px-8 md:pt-6 md:pb-4 max-w-7xl mx-auto overflow-hidden transition-all duration-1000 ${!isSystemOn ? 'brightness-[0.4] grayscale-[0.5]' : ''}`}>
      {/* Brand Bar Section */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-6 group cursor-default">
          {/* Enhanced Logo Container - Using the Custom SVG Logo */}
          <div className="relative w-16 h-16 rounded-[1.6rem] shadow-[0_0_40px_rgba(78,232,159,0.15)] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 border border-white/5">
            <Logo className="w-full h-full" isOff={!isSystemOn} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none italic">EcoAI <span className="text-green-400">Sentinel</span></h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1.5">
              Collaborative Nature Indicator {secondsRemaining === 0 ? "(RESTING)" : "(ACTIVE)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Time to Rest</span>
            <span className={`text-xs font-black mono ${secondsRemaining < 3600 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
              {formatTime(secondsRemaining)}
            </span>
          </div>

          <nav className="glass p-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xl">
            <button 
              disabled={!isSystemOn}
              onClick={() => setMode(AppMode.INDIVIDUAL)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === AppMode.INDIVIDUAL 
                ? 'bg-white/10 text-white shadow-xl border border-white/10' 
                : 'text-white/25 hover:text-white/40'
              } disabled:opacity-30`}
            >
              Individual
            </button>
            <button 
              disabled={!isSystemOn}
              onClick={() => setMode(AppMode.BUSINESS)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === AppMode.BUSINESS 
                ? 'bg-white/10 text-white shadow-xl border border-white/10' 
                : 'text-white/25 hover:text-white/40'
              } disabled:opacity-30`}
            >
              Business
            </button>
            <button 
              disabled={!isSystemOn}
              onClick={() => setMode(AppMode.CONSULTANT)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === AppMode.CONSULTANT 
                ? 'bg-[#4ee89f]/20 text-[#4ee89f] shadow-xl border border-[#4ee89f]/20' 
                : 'text-white/25 hover:text-white/40'
              } disabled:opacity-30`}
            >
              Consultant
            </button>
          </nav>

          {/* Switch Off Button */}
          <button 
            onClick={() => setIsSystemOn(!isSystemOn)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border ${isSystemOn ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-black' : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" /></svg>
          </button>
        </div>
      </header>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-6 shrink-0"></div>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {!isSystemOn ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/5 flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <Logo className="w-16 h-16 grayscale" isOff={true} />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/20">Sentinel Dormant</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 mt-4 max-w-sm">
                Collaborative indicators suggest resource depletion. AI Sentinel is in rest mode to preserve biodiversity and water levels.
              </p>
            </div>
            <button 
              onClick={() => { if (secondsRemaining > 0) setIsSystemOn(true); else setSecondsRemaining(WORKDAY_SECONDS); setIsSystemOn(true); }}
              className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white hover:bg-white/10 transition-all"
            >
              Reactivate Protocol
            </button>
          </div>
        ) : (
          <>
            {mode === AppMode.INDIVIDUAL && (
              !userState.hasStartedSession ? (
                <OnboardingIntent onStartSession={handleStartSession} />
              ) : (
                <IndividualChat 
                  state={userState} 
                  onUpdateState={updateState} 
                />
              )
            )}
            
            {mode === AppMode.BUSINESS && (
              <div className="overflow-y-auto pr-2">
                 <BusinessDashboard metrics={userState.metrics} computeMode={userState.computeMode} />
              </div>
            )}

            {mode === AppMode.CONSULTANT && (
              <div className="overflow-y-auto pr-2">
                <PermacomputingConsultant />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="glass-dark rounded-xl p-4 mt-4 flex flex-wrap items-center justify-between text-[9px] font-black uppercase tracking-[0.25em] text-white/20 shrink-0 border border-white/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${isSystemOn ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-900 shadow-none'}`}></div>
            <span>Status: {isSystemOn ? 'Collaborating (Sentinel)' : 'Resting'}</span>
          </div>
          <div className="hidden sm:block">
            Biodiversity Delta: <span className="text-green-400/60">+0.002% (Peacock Index)</span>
          </div>
          <div className="hidden md:block">
            Shift: <span className="text-cyan-400/60">{formatTime(secondsRemaining)} Remaining</span>
          </div>
        </div>
        <div className="opacity-40">
          Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </footer>
    </div>
  );
};

export default App;
