
import React, { useState, useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title, description, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className={`glass rounded-2xl p-4 md:p-6 relative transition-all duration-300 overflow-visible ${className} ${isHovered ? 'border-white/20 z-[30]' : 'z-0'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      {title && (
        <h3 className="text-[9px] md:text-xs uppercase tracking-widest text-white/40 mb-3 md:mb-4 font-black">
          {title}
        </h3>
      )}
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Simplified Tooltip - Matches width and appears below */}
      {description && isHovered && (
        <div 
          className="absolute top-[calc(100%+6px)] left-0 w-full z-[100] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="p-3 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <p className="text-[10px] md:text-[11px] text-white/60 leading-relaxed font-medium">
              {description}
            </p>
            <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-transparent rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};
