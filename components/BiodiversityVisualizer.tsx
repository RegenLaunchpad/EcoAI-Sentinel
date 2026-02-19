
import React from 'react';

interface BiodiversityVisualizerProps {
  score: number; // 0-100
  status: string;
}

export const BiodiversityVisualizer: React.FC<BiodiversityVisualizerProps> = ({ score, status }) => {
  const getColor = () => {
    if (score > 80) return 'text-green-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIcon = (index: number) => {
    const icons = [
      <path d="M12 3v18M12 3l-7 7m7-7l7 7" />, // Tree
      <path d="M12 8l-4 4m4-4l4 4" />, // Compass
      <path d="M12 21a9 9 0 110-18 9 9 0 010 18z" />, // Globe
    ];
    return icons[index % icons.length];
  };

  const colorClass = getColor();

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black mono leading-none ${colorClass}`}>
              {score}
            </span>
            <span className={`text-xs font-bold ${colorClass} opacity-60`}>%</span>
          </div>
          <span className="text-[9px] uppercase font-black text-white/20 tracking-widest mt-1">Local Ecosystem Health</span>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black text-white uppercase tracking-tighter">
            {status}
          </p>
          <p className="text-[8px] uppercase font-bold text-white/10 tracking-widest mt-1">Impact Status</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-1">
        {Array.from({ length: 10 }).map((_, i) => {
          const isActive = (i + 1) * 10 <= score;
          return (
            <div key={i} className={`transition-all duration-700 ${isActive ? colorClass : 'text-white/5'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {getIcon(i)}
              </svg>
            </div>
          );
        })}
      </div>
      
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${colorClass.replace('text', 'bg')} shadow-[0_0_12px_currentColor]`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};
