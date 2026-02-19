
import React from 'react';
import { GlassCard } from './GlassCard';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, unit, icon, color = "text-green-400", description }) => {
  return (
    <GlassCard 
      description={description} 
      className="p-4 border border-white/5 bg-[#0e0e0e]"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`p-3 rounded-lg bg-black/60 shrink-0 ${color} border border-white/5 shadow-inner`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" }) : icon}
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p className="text-[9px] text-white/40 font-black uppercase tracking-widest truncate mb-1">{label}</p>
          <p className="text-xl md:text-2xl font-black mono text-white leading-none">
            {value}<span className="text-[10px] md:text-xs font-bold text-white/20 ml-1.5 uppercase">{unit}</span>
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
