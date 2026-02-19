
import React, { useState } from 'react';
import { GlassCard } from './GlassCard';

interface TokenReplenishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, donation: number) => void;
  tokenPrice: number;
}

export const TokenReplenishModal: React.FC<TokenReplenishModalProps> = ({ isOpen, onClose, onConfirm, tokenPrice }) => {
  const [amount, setAmount] = useState<number>(5000);
  const [approved, setApproved] = useState(false);

  if (!isOpen) return null;

  const donation = amount * tokenPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <GlassCard className="max-w-md w-full border-green-500/30 shadow-[0_0_80px_rgba(34,197,94,0.1)]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Credit <span className="text-green-400">Replenishment</span></h2>
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 mt-1">Protocol: offset_migration_v4</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors group">
            <svg className="w-5 h-5 text-white/40 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black mb-4 block">Select Allocation Magnitude</label>
            <div className="grid grid-cols-3 gap-3">
              {[1000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={`py-3 rounded-xl border-2 text-xs font-black mono transition-all ${
                    amount === v 
                      ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                      : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  {v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-black/60 rounded-2xl border border-white/10 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Calculated Offset Yield</span>
              <span className="text-2xl font-black mono text-white">${donation.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[9px] uppercase font-black tracking-widest text-white/20">Target Beneficiary</span>
              <span className="text-[10px] font-bold text-green-400/80 uppercase">Global Wetlands Restoration</span>
            </div>
          </div>

          <label className="flex items-start gap-4 cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-all">
            <div className="relative mt-0.5">
              <input 
                type="checkbox" 
                checked={approved} 
                onChange={(e) => setApproved(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                approved ? 'bg-green-500 border-green-500' : 'bg-black border-white/20 group-hover:border-white/40'
              }`}>
                {approved && <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7"></path></svg>}
              </div>
            </div>
            <span className="text-[11px] text-white/50 leading-relaxed font-medium">
              I authorize the migration of <b className="text-white font-black mono">${donation.toFixed(2)}</b> for environmental remediation and compute credit provisioning.
            </span>
          </label>

          <button
            disabled={!approved}
            onClick={() => onConfirm(amount, donation)}
            className="w-full py-5 rounded-2xl bg-green-500 text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-green-400 transition-all disabled:opacity-20 disabled:grayscale shadow-[0_10px_30px_rgba(34,197,94,0.3)] active:scale-[0.98]"
          >
            Authorize Asset Migration
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
