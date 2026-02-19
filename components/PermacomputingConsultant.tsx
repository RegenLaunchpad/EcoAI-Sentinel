
import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { geminiService } from '../geminiService';

export const PermacomputingConsultant: React.FC = () => {
  const [input, setInput] = useState('');
  const [report, setReport] = useState<any>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const handleConsult = async () => {
    if (!input.trim() || isConsulting) return;
    setIsConsulting(true);
    setReport(null);
    try {
      const data = await geminiService.analyzeBusinessCase(input);
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden py-4 animate-in fade-in duration-700">
      {/* Centered Header Section */}
      <div className="text-center mb-10 shrink-0 space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">High-Reasoning Strategic Lab</span>
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Permacomputing <span className="text-emerald-400">Auditor</span>
        </h2>
        <p className="text-[11px] uppercase font-bold text-white/30 tracking-[0.5em] max-w-3xl mx-auto leading-loose">
          Determining the ecological necessity of artificial intelligence through silicon-level efficiency analysis.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 overflow-hidden px-1">
        {/* Left Column: Business Intent Mapping */}
        <div className="flex flex-col h-full min-h-0 space-y-6">
          <GlassCard 
            className="flex-1 border border-white/10 flex flex-col bg-[#0e0e0e]"
            title="Business Intent Mapping"
            description="Detail the deployment context for sustainability audit."
          >
            <div className="flex flex-col h-full gap-6">
              <div className="relative flex-1 min-h-0 group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your use-case (e.g., 'We want to deploy a real-time LLM agent for sorting our 10,000 internal Slack messages daily...')"
                  className="w-full h-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm focus:outline-none focus:border-emerald-500/40 transition-all resize-none placeholder:text-white/5 font-medium leading-relaxed"
                />
                <div className="absolute top-4 right-6 text-[8px] font-black uppercase text-white/10 tracking-widest pointer-events-none">
                  Secure Input Channel
                </div>
              </div>
              
              <button
                onClick={handleConsult}
                disabled={isConsulting || !input.trim()}
                className={`w-full py-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:bg-emerald-500 hover:text-black active:scale-[0.98] ${isConsulting || !input.trim() ? 'opacity-20 pointer-events-none' : ''}`}
              >
                {isConsulting ? (
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Initiate Audit
                  </>
                )}
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-6 shrink-0">
             <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 text-center">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Audit Reasoning</p>
                <p className="text-2xl font-black text-emerald-400 italic">T-Zero</p>
             </div>
             <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 text-center">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Impact Model</p>
                <p className="text-2xl font-black text-cyan-400 italic">Sentinel-3</p>
             </div>
          </div>
        </div>

        {/* Right Column: Results or Auditor Ready */}
        <div className="flex flex-col h-full min-h-0">
          {report ? (
            <div className="flex-1 flex flex-col min-h-0 bg-black/60 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="p-6 border-b border-white/5 bg-emerald-500/5 flex items-center justify-between shrink-0">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">Sustainability Report</h4>
                <div className="text-[10px] font-black text-emerald-400/50 uppercase px-3 py-1 bg-white/5 rounded-lg border border-white/5">Offset Breakeven: {report.temporalBreakeven.value} {report.temporalBreakeven.unit}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-4 shadow-inner flex flex-col justify-center min-h-[140px]">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Planetary Integrity</h5>
                    <span className="text-5xl font-black italic text-white leading-none">{report.metrics.planetScore}%</span>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-auto"><div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${report.metrics.planetScore}%` }}></div></div>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-4 shadow-inner flex flex-col justify-center min-h-[140px]">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Financial Yield</h5>
                    <span className="text-5xl font-black italic text-white leading-none">{report.metrics.profitScore}%</span>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-auto"><div className="h-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" style={{ width: `${report.metrics.profitScore}%` }}></div></div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-3 italic font-bold">Social Equity & Precision Metrics</h5>
                  <div className="flex justify-between items-center"><span className="text-xs font-black text-white uppercase">Inclusion Index</span><span className="text-2xl font-black italic text-emerald-400">{report.socialImpact.score}%</span></div>
                  <p className="text-[13px] text-white/40 leading-relaxed italic">{report.socialImpact.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">{report.socialImpact.pillars.map((p: string, i: number) => (<span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold text-white/20 uppercase tracking-widest">{p}</span>))}</div>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-3 italic font-bold">The Eco-Efficient Choice: Roadmap</h5>
                  <div className="space-y-4">
                    {report.roadmap.map((step: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-black/40 border-l-4 border-emerald-500/40 space-y-4 group hover:bg-black/60 transition-all border border-white/5">
                        <div className="flex justify-between items-start">
                           <div><p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 mb-1">{step.stage}</p><p className="text-sm font-black text-white uppercase tracking-tight">{step.action}</p></div>
                           <span className="text-[10px] font-black mono text-white/10 uppercase bg-white/5 px-2 py-1 rounded">{step.timeline}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                           <div><p className="text-[8px] font-black uppercase text-green-400/40 tracking-widest mb-1">Economic Gains</p><p className="text-[11px] font-bold text-white/50">{step.gains}</p></div>
                           <div><p className="text-[8px] font-black uppercase text-red-400/40 tracking-widest mb-1">Ecological Costs</p><p className="text-[11px] font-bold text-white/50">{step.losses}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl">
                  <p className="text-xl font-black italic text-white uppercase tracking-tighter leading-tight font-black">{report.verdict}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] transition-all hover:bg-emerald-500/[0.02] group">
              <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-700 shadow-xl border border-white/5">
                <svg className="w-12 h-12 text-white/5 group-hover:text-emerald-400/30 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h5 className="text-xl font-black uppercase tracking-[0.4em] text-white/20 mb-4 italic">Auditor Ready</h5>
              <p className="text-[12px] text-white/10 max-w-sm font-bold uppercase tracking-widest leading-loose">
                Submit your business case to calculate the <span className="text-emerald-400/50">Eco-Efficient Choice</span>—balancing biosphere and economy with granular precision.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
