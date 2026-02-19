
import React, { useState } from 'react';
import { geminiService } from '../geminiService';
import { ComputeIntensity } from '../types';
import { GlassCard } from './GlassCard';
import { COMPUTE_MODES } from '../constants';

interface OnboardingIntentProps {
  onStartSession: (mode: ComputeIntensity, task: string) => void;
}

export const OnboardingIntent: React.FC<OnboardingIntentProps> = ({ onStartSession }) => {
  const [task, setTask] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<ComputeIntensity | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || analyzing) return;

    setAnalyzing(true);
    try {
      const mode = await geminiService.detectIntentMode(task);
      setSuggestion(mode);
    } catch (error) {
      console.error(error);
      setSuggestion(ComputeIntensity.MEDIUM);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto px-4 text-center">
      <div className="mb-6 relative">
        {/* Intricate Peacock Eye Scanner */}
        <div className={`w-24 h-24 bg-gradient-to-br from-[#4ee89f]/10 to-[#32cfe0]/10 border border-white/5 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(78,232,159,0.1)] ${analyzing ? 'animate-pulse scale-110' : ''} transition-all duration-700`}>
          <svg viewBox="0 0 100 100" className={`w-16 h-16 fill-none stroke-current ${analyzing ? 'text-green-400' : 'text-white/40'}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Peacock Iris Pattern */}
            <path d="M50 20 C 70 20, 85 35, 85 50 C 85 65, 70 80, 50 80 C 30 80, 15 65, 15 50 C 15 35, 30 20, 50 20 Z" className={analyzing ? 'animate-[pulse_2s_infinite]' : ''} />
            <path d="M50 35 A 15 15 0 1 1 50 65 A 15 15 0 1 1 50 35" fill={analyzing ? 'currentColor' : 'none'} fillOpacity="0.1" />
            <circle cx="50" cy="50" r="6" fill="currentColor" className={analyzing ? 'animate-ping' : ''} />
            
            {/* Ornate Radiating Lines */}
            <path d="M50 15 L50 25M50 75 L50 85M15 50 L25 50M75 50 L85 50" opacity="0.3" />
            <path d="M25 25 L32 32M68 68 L75 75M25 75 L32 68M68 32 L75 25" opacity="0.3" />
            
            {/* Spinning Data Rings */}
            <circle cx="50" cy="50" r="42" strokeDasharray="4 12" className={analyzing ? 'animate-[spin_10s_linear_infinite]' : ''} opacity="0.2" />
          </svg>
        </div>
        {analyzing && (
           <div className="absolute -inset-6 border-2 border-[#4ee89f]/10 rounded-[3rem] animate-ping"></div>
        )}
      </div>

      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Intent <span className="text-green-400">Analysis</span></h2>
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-10">Optimizing compute allocation for your task</p>

      {!suggestion ? (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative group">
            <textarea
              autoFocus
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What are you here for today? (e.g. debugging a complex script, writing a poem...)"
              className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-green-500/50 transition-all resize-none placeholder:text-white/10"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(e))}
            />
            <div className="absolute inset-0 rounded-2xl bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          
          <button
            type="submit"
            disabled={!task.trim() || analyzing}
            className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-20"
          >
            {analyzing ? 'Synthesizing Reasoning Matrix...' : 'Submit Intent'}
          </button>
        </form>
      ) : (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${COMPUTE_MODES[suggestion].bg} blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity`}></div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className={`p-4 rounded-2xl ${COMPUTE_MODES[suggestion].bg} ${COMPUTE_MODES[suggestion].color} border border-white/5`}>
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Suggested Mode</p>
                <h3 className={`text-2xl font-black italic uppercase ${COMPUTE_MODES[suggestion].color}`}>{COMPUTE_MODES[suggestion].label}</h3>
              </div>
            </div>

            <p className="text-sm text-white/60 text-left leading-relaxed mb-8 font-medium">
              Sentinel has analyzed your query and recommends the <span className="text-white font-black">{COMPUTE_MODES[suggestion].label}</span> intensity profile. {COMPUTE_MODES[suggestion].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onStartSession(suggestion, task)}
                className={`flex-1 py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-400 transition-all active:scale-95 shadow-xl`}
              >
                Accept Allocation
              </button>
              <button
                onClick={() => setSuggestion(null)}
                className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/10 transition-all"
              >
                Modify Intent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
