
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../geminiService';
import { Message, UserState, ComputeIntensity } from '../types';
import { GlassCard } from './GlassCard';
import { TokenReplenishModal } from './TokenReplenishModal';
import { BiodiversityVisualizer } from './BiodiversityVisualizer';
import { WATER_PER_TOKEN, TOKEN_PRICE_USD, BIODIVERSITY_REGION_INFO, DAILY_COOLING_CAPACITY_LITERS, COMPUTE_MODES } from '../constants';

interface IndividualChatProps {
  state: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
}

export const IndividualChat: React.FC<IndividualChatProps> = ({ state, onUpdateState }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeTheme = COMPUTE_MODES[state.computeMode];

  const handleSend = useCallback(async (customInput?: string) => {
    const userPrompt = customInput || input.trim();
    if (!userPrompt || state.tokensRemaining <= 0 || loading) return;

    if (!customInput) setInput('');
    setLoading(true);

    let effectiveMode = state.computeMode;
    
    // Auto Adaptive Mode check
    if (state.isAutoMode && !customInput) {
      effectiveMode = await geminiService.detectIntentMode(userPrompt);
      onUpdateState({ computeMode: effectiveMode });
    }

    const newUserMessage: Message = {
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
      modeUsed: effectiveMode
    };

    const multiplier = COMPUTE_MODES[effectiveMode].multiplier;
    const tokensCost = Math.ceil((userPrompt.length / 4) * multiplier);
    
    try {
      // Use state.history plus the new message for context
      const currentHistory = state.history;
      const response = await geminiService.generateResponse(currentHistory, userPrompt, effectiveMode);
      const responseTokens = Math.ceil((response.length / 4) * multiplier);
      const totalTokensUsed = tokensCost + responseTokens;
      
      const modelMessage: Message = {
        role: 'model',
        content: response,
        timestamp: Date.now(),
        modeUsed: effectiveMode
      };

      onUpdateState({
        history: [...currentHistory, newUserMessage, modelMessage],
        tokensRemaining: Math.max(0, state.tokensRemaining - totalTokensUsed),
        metrics: {
          ...state.metrics,
          tokensUsed: state.metrics.tokensUsed + totalTokensUsed,
          waterUsedLiters: state.metrics.waterUsedLiters + (totalTokensUsed * WATER_PER_TOKEN),
          financialBenefit: state.metrics.financialBenefit + (2.50 * multiplier),
          biodiversityImpactScore: Math.max(0, Math.min(100, state.metrics.biodiversityImpactScore - (totalTokensUsed * 0.0001 * multiplier)))
        }
      });
    } catch (error) {
      console.error(error);
      // Still add the user message to history even if response fails
      onUpdateState({
        history: [...state.history, newUserMessage, { role: 'model', content: "SYSTEM ERROR: SENTINEL UNAVAILABLE. PLEASE RETRY.", timestamp: Date.now(), modeUsed: effectiveMode }]
      });
    } finally {
      setLoading(false);
    }
  }, [input, state.tokensRemaining, loading, state.computeMode, state.isAutoMode, state.history, state.metrics, onUpdateState]);

  // Handle auto-send of onboarding prompt
  useEffect(() => {
    if (state.pendingInput && state.history.length === 0 && !loading) {
      const initialPrompt = state.pendingInput;
      // Clear pending input immediately to prevent loops
      onUpdateState({ pendingInput: undefined });
      handleSend(initialPrompt);
    }
  }, [state.pendingInput, state.history.length, loading, handleSend, onUpdateState]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.history]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Increased min initial height logic here if needed, but CSS handles it better
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 64)}px`;
    }
  }, [input]);

  const waterSpent = state.metrics.waterUsedLiters;
  const waterLevelPercent = Math.max(0, 100 - (waterSpent / DAILY_COOLING_CAPACITY_LITERS) * 100);

  return (
    <div className="flex flex-col h-full overflow-visible transition-all duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6 shrink-0 z-50">
        <div className="min-w-0">
          <GlassCard 
            title="Water Level Sentinel"
            description="Real-time tracking of H2O consumed for server cooling. Color shifts based on compute intensity."
            className={`${activeTheme.glow} h-full`}
          >
            <div className="relative h-20 lg:h-28 w-full bg-black/40 rounded-xl overflow-hidden flex items-end transition-colors duration-500">
              <div 
                className={`w-full ${activeTheme.bg.replace('/10', '/30')} transition-all duration-1000 ease-in-out relative`}
                style={{ height: `${waterLevelPercent}%` }}
              >
                <div className={`absolute inset-0 animate-pulse bg-gradient-to-t ${activeTheme.bg.replace('/10', '/40')} to-transparent`}></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <span className={`text-xl lg:text-3xl font-black mono leading-none transition-colors duration-500 ${activeTheme.color}`}>
                  {waterSpent.toFixed(2)}<span className="text-[10px] ml-0.5 opacity-40">L</span>
                </span>
                <span className="text-[7px] lg:text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1 lg:mt-2">Spent Cooling</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="min-w-0">
          <GlassCard title="Compute Intensity" description="Select reasoning depth or let Sentinel auto-adapt." className="h-full">
            <div className="h-20 lg:h-28 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                 <span className="text-[7px] md:text-[8px] font-black uppercase text-white/30 tracking-widest">Auto</span>
                 <button 
                  onClick={() => onUpdateState({ isAutoMode: !state.isAutoMode })}
                  className={`w-6 md:w-7 h-3 md:h-3.5 rounded-full relative transition-all border ${state.isAutoMode ? 'bg-green-500 border-green-400' : 'bg-white/5 border-white/10'}`}
                >
                  <div className={`absolute top-0.5 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white transition-all ${state.isAutoMode ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(COMPUTE_MODES) as ComputeIntensity[]).map((m) => (
                  <button
                    key={m}
                    disabled={state.isAutoMode}
                    onClick={() => onUpdateState({ computeMode: m as ComputeIntensity })}
                    className={`py-1 rounded-lg text-[6px] md:text-[7px] font-black uppercase tracking-tighter transition-all border ${
                      state.computeMode === m 
                        ? `${COMPUTE_MODES[m as keyof typeof COMPUTE_MODES].bg} border-white/20 text-white` 
                        : 'bg-white/5 border-white/5 text-white/20 opacity-50'
                    }`}
                  >
                    {m[0]}
                  </button>
                ))}
              </div>
              <p className="text-[6px] lg:text-[8px] text-white/40 mt-1 leading-tight italic line-clamp-2">
                {activeTheme.description}
              </p>
            </div>
          </GlassCard>
        </div>

        <div className="min-w-0">
          <GlassCard title="Ecosystem Monitor" description="Health of Nordic Wetlands near node." className="h-full">
            <div className="h-20 lg:h-28 flex flex-col justify-center">
               <BiodiversityVisualizer score={Math.round(state.metrics.biodiversityImpactScore)} status={BIODIVERSITY_REGION_INFO.status} />
            </div>
          </GlassCard>
        </div>

        <div className="min-w-0">
          <GlassCard title="Nature Fund Ledger" description="Available credits. Each prompt donates to global restoration." className="h-full">
            <div className="flex flex-col justify-between h-20 lg:h-28">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-lg lg:text-2xl font-black mono leading-none transition-colors ${activeTheme.color}`}>{state.tokensRemaining.toLocaleString()}</p>
                  <p className="text-[7px] text-white/30 uppercase font-bold tracking-widest mt-1">Tokens</p>
                </div>
                <div className="text-right">
                  <p className="text-sm lg:text-lg font-bold mono text-white/60 leading-none">${state.totalDonated.toFixed(2)}</p>
                  <p className="text-[6px] text-white/20 uppercase font-bold mt-0.5">Fund</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={`w-full py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 font-black hover:bg-white/10 transition-all text-[7px] md:text-[8px] uppercase tracking-[0.2em]`}>
                Replenish
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-h-0 bg-black/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 ${activeTheme.glow}`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scroll-smooth scrollbar-thin">
          {state.history.length === 0 && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 transition-all duration-1000">
              <svg className={`w-12 h-12 md:w-16 md:h-16 mb-6 transition-colors ${activeTheme.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.4em]">Sentinel: {activeTheme.label}</h3>
              <p className="max-w-xs text-[9px] md:text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">Ready to process {state.computeMode.toLowerCase()} intensity requests.</p>
            </div>
          ) : (
            <>
              {state.history.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-4 md:p-5 ${
                    msg.role === 'user' 
                      ? 'bg-white/5 border border-white/10 rounded-tr-none' 
                      : `bg-black/40 border-l-2 rounded-tl-none border-white/10`
                  }`}
                  style={msg.role === 'model' ? { borderLeftColor: COMPUTE_MODES[msg.modeUsed || ComputeIntensity.MEDIUM].color.replace('text-', '') } : {}}
                  >
                    <div className="flex justify-between items-center mb-3 gap-4">
                      <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] opacity-40 ${msg.role === 'model' ? COMPUTE_MODES[msg.modeUsed || ComputeIntensity.MEDIUM].color : ''}`}>
                        {msg.role === 'user' ? 'Query Source' : `${COMPUTE_MODES[msg.modeUsed || ComputeIntensity.MEDIUM].label} Node`}
                      </span>
                      <p className="text-[7px] md:text-[8px] opacity-20 mono uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`max-w-[85%] rounded-2xl p-5 bg-black/40 border-l-2 border-white/10 animate-pulse`}>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 md:p-8 bg-[#0c0c0c] border-t border-white/5">
          <div className="relative flex items-center max-w-4xl mx-auto min-h-[72px] md:min-h-[84px]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              disabled={loading || state.tokensRemaining <= 0}
              placeholder={state.tokensRemaining <= 0 ? "LEDGER EXHAUSTED" : `Ask a ${state.computeMode.toLowerCase()} complexity question...`}
              rows={1}
              className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 md:py-7 pl-6 md:pl-8 pr-14 md:pr-20 focus:outline-none transition-all text-sm md:text-base disabled:opacity-50 resize-none max-h-32 md:max-h-48 overflow-y-hidden scrollbar-none flex items-center ${state.tokensRemaining > 0 ? activeTheme.color.replace('text-', 'focus:border-') + '/40' : 'focus:border-red-500'}`}
              style={{ display: 'flex', alignItems: 'center' }}
            />
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim() || state.tokensRemaining <= 0}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-3.5 md:p-4 text-black rounded-2xl transition-all disabled:opacity-0 active:scale-95 shadow-xl ${activeTheme.color.replace('text-', 'bg-')}`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      <TokenReplenishModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={(amount, donation) => {
          onUpdateState({
            tokensRemaining: state.tokensRemaining + amount,
            totalDonated: state.totalDonated + donation
          });
          setIsModalOpen(false);
        }}
        tokenPrice={TOKEN_PRICE_USD}
      />
    </div>
  );
};
