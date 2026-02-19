
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { EcologicalMetrics, ComputeIntensity } from '../types';
import { GlassCard } from './GlassCard';
import { MetricDisplay } from './MetricDisplay';
import { BiodiversityVisualizer } from './BiodiversityVisualizer';
import { DATA_CENTER_REGION, BIODIVERSITY_REGION_INFO, COMPUTE_MODES, BIO_REGIONAL_NODES } from '../constants';

interface BusinessDashboardProps {
  metrics: EcologicalMetrics;
  computeMode: ComputeIntensity;
}

const MOCK_TIME_DATA = [
  { time: '08:00', benefit: 120 },
  { time: '10:00', benefit: 450 },
  { time: '12:00', benefit: 890 },
  { time: '14:00', benefit: 1250 },
  { time: '16:00', benefit: 1800 },
  { time: '18:00', benefit: 2100 },
];

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ metrics, computeMode }) => {
  const [optStrategy, setOptStrategy] = useState('RENEWABLE NODE ROUTING');
  const [activeNodeId, setActiveNodeId] = useState(BIO_REGIONAL_NODES[0].id);
  const activeMode = COMPUTE_MODES[computeMode];

  const activeNode = BIO_REGIONAL_NODES.find(n => n.id === activeNodeId) || BIO_REGIONAL_NODES[0];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700 overflow-visible">
      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible">
        <MetricDisplay 
          label="Aggregate Energy Draw" 
          value={metrics.energyConsumedWh.toFixed(2)} 
          unit="Wh" 
          color="text-yellow-400"
          description="Total grid load across active clusters, measured in Watt-hours to track precision silicon efficiency."
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
        />
        <MetricDisplay 
          label="Thermal Dissipation" 
          value={metrics.waterUsedLiters.toFixed(2)} 
          unit="L" 
          color="text-cyan-400"
          description="Total freshwater utilized for heat exchange. Every drop tracks back to local watershed health."
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>}
        />
        <MetricDisplay 
          label="Biotic Integrity Index" 
          value={Math.round(metrics.biodiversityImpactScore)} 
          unit="/ 100" 
          color="text-green-400"
          description="A composite score tracking regional flora and fauna stability near our active compute nodes."
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
        />
        <MetricDisplay 
          label="Efficiency Surplus" 
          value={metrics.financialBenefit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', '')} 
          unit="USD" 
          color="text-emerald-400"
          description="Calculated financial ROI gained through permacomputing optimization and waste heat recovery protocols."
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM17 13a5 5 0 11-10 0 5 5 0 0110 0z"></path></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-visible">
        {/* Left Side: Chart Card */}
        <GlassCard 
          title="Compute Intensity Tracking" 
          className="lg:col-span-2 flex flex-col justify-between"
          description="Monitoring dynamic silicon stress. High intensity results in greater thermal dissipation requirements."
        >
          <div className="flex items-center gap-4 mb-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
            <div className={`p-4 rounded-xl ${activeMode.bg} ${activeMode.color} border border-white/5`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Active Fleet Mode</p>
              <h4 className={`text-3xl font-black uppercase italic ${activeMode.color}`}>{activeMode.label}</h4>
              <p className="text-xs text-white/40 mt-1">{activeMode.description}</p>
            </div>
          </div>

          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TIME_DATA}>
                <defs>
                  <linearGradient id="colorBenefit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#ffffff11" fontSize={10} tick={{fill: '#ffffff22'}} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff11', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="benefit" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorBenefit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Right Side: Ecosystem + Routing Integrated Card */}
        <div className="flex flex-col gap-4 overflow-visible">
          <GlassCard 
            title="Node Ecosystem Analysis"
            description="Deep forensic audit of bioregional stability near compute nodes."
            className="flex-1 flex flex-col gap-8"
          >
            <BiodiversityVisualizer 
              score={activeNodeId === 'arc-1' ? 98 : activeNodeId === 'nor-1' ? 91 : activeNodeId === 'fin-1' ? 84 : 76} 
              status={activeNodeId === 'arc-1' ? 'Arctic Tundra' : activeNodeId === 'nor-1' ? 'Sensitive Wetlands' : activeNodeId === 'fin-1' ? 'Boreal Forest' : 'Alpine Region'} 
            />
            
            <div className="mt-auto space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              <h5 className="text-[10px] font-black uppercase text-white/20 tracking-[0.25em] mb-4">Routing Strategy Priority</h5>
              <div className="space-y-3">
                {['RENEWABLE NODE ROUTING', 'OFFPEAK NODE ROUTING', 'MINIMALIST NODE ROUTING'].map((strategy) => (
                  <button
                    key={strategy}
                    onClick={() => setOptStrategy(strategy)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      optStrategy === strategy 
                        ? 'bg-cyan-500/5 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                        : 'bg-black/20 border-white/5 text-white/20 hover:text-white/40'
                    }`}
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
        <GlassCard 
          title="Compute Node Intelligence"
          className="flex flex-col bg-[#0e0e0e]"
          description="Real-time telemetry from physical server clusters monitoring efficiency."
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-black italic uppercase tracking-wider text-white">NORDICS (RENEWABLE OPTIMIZED)</h4>
              <p className="text-[9px] font-black text-white/30 uppercase mt-1 tracking-widest">Active Asset Cluster</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
               <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Operational</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center flex flex-col justify-center min-h-[100px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3">PUE Ratio</p>
                <p className="text-3xl font-black mono text-white">1.08</p>
             </div>
             <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center flex flex-col justify-center min-h-[100px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3">CUE Factor</p>
                <p className="text-3xl font-black mono text-white">0.02</p>
             </div>
          </div>
        </GlassCard>

        <GlassCard 
          title="Emission Suppression Logic"
          className="flex flex-col bg-[#0e0e0e]"
          description="Algorithmic overrides that force tasks into carbon-efficient windows."
        >
          <p className="text-[11px] text-white/50 leading-relaxed mb-6">
            The Sentinel system prioritizes <span className="text-cyan-400 font-bold">Carbon Suppression</span> (source avoidance) over legacy protocols.
          </p>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Dynamic Load Balancing</span>
                <span className="text-[9px] font-black text-green-400 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                   ACTIVE
                </span>
             </div>
             <div className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Waste Heat Recovery</span>
                <span className="text-[10px] font-black text-green-400 tracking-widest">92% NET EFFICIENCY</span>
             </div>
          </div>
        </GlassCard>
      </div>

      {/* Node Asset Mapping Section */}
      <GlassCard title="Bioregional Asset Mapping" description="Dynamic routing based on real-time ecological health and renewable energy availability." className="overflow-visible">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible">
          {BIO_REGIONAL_NODES.map((node) => (
            <div 
              key={node.id} 
              onClick={() => setActiveNodeId(node.id)}
              className={`p-4 bg-white/[0.02] border cursor-pointer group transition-all relative overflow-visible ${
                activeNodeId === node.id ? 'border-green-500/40 bg-green-500/5' : 'border-white/5 hover:border-white/10'
              } rounded-2xl`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 pr-2">
                  <h6 className="text-[11px] font-black text-white uppercase tracking-widest truncate">{node.name}</h6>
                  <p className="text-[9px] text-white/30 font-bold uppercase mt-1">{node.location}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${node.health > 90 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}`}></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${node.health > 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${node.health}%` }}></div>
                </div>
                <span className="text-xs font-black mono text-white/50">{node.health}%</span>
              </div>

              {/* Asset Node Hover Description - Opaque background for maximum readability */}
              <div className="absolute bottom-[calc(100%+8px)] left-0 w-full z-[100] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                  <div className="p-5 space-y-4">
                    {/* Header: Name, Location, Status Dot */}
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{node.name}</h4>
                          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{node.location}</p>
                       </div>
                       <div className={`w-3 h-3 rounded-full ${node.health > 80 ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_12px_#eab308]'}`}></div>
                    </div>

                    {/* Progress Area */}
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                             <div className={`h-full ${node.health > 80 ? 'bg-green-400' : 'bg-yellow-500'}`} style={{ width: `${node.health}%` }}></div>
                          </div>
                          <span className="text-xs font-black mono text-white/60">{node.health}%</span>
                       </div>
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em]">{node.status.toUpperCase()} ECOSYSTEM</p>
                    </div>

                    {/* Metric Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2">
                       <div>
                          <p className="text-[8px] text-white/25 uppercase font-black tracking-widest mb-1">Water Intensity</p>
                          <p className="text-[11px] text-cyan-400 font-bold mono leading-none">{node.metrics.water}</p>
                       </div>
                       <div>
                          <p className="text-[8px] text-white/25 uppercase font-black tracking-widest mb-1">Energy Source</p>
                          <p className="text-[11px] text-yellow-500 font-bold leading-none">{node.metrics.energy.split(' ')[1] || 'Renewable'}</p>
                       </div>
                       <div>
                          <p className="text-[8px] text-white/25 uppercase font-black tracking-widest mb-1">Social Impact</p>
                          <p className="text-[11px] text-emerald-400 font-bold leading-none">{node.health > 80 ? 'High' : 'Stable'}</p>
                       </div>
                       <div>
                          <p className="text-[8px] text-white/25 uppercase font-black tracking-widest mb-1">Biodiversity</p>
                          <p className="text-[11px] text-green-400 font-bold mono leading-none">{node.health}%</p>
                       </div>
                    </div>
                  </div>
                  <div className="h-0.5 w-full bg-gradient-to-r from-green-500/40 via-cyan-500/20 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Eco-ROI Executive Summary Box */}
      <GlassCard 
        className="bg-[#0e0e0e] border border-white/5 p-8"
        title="Eco-ROI Analysis (Executive Summary)"
        description="A high-level synthesis of enterprise-grade sustainability metrics."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
          <div className="space-y-4">
            <h5 className="text-sm font-black text-white uppercase tracking-tight">Resource Efficiency</h5>
            <p className="text-[12px] text-white/40 leading-relaxed">
              Our Permacomputing protocols have reduced energy overhead by 22% compared to standard cloud providers.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="text-sm font-black text-white uppercase tracking-tight">Carbon Offsetting</h5>
            <p className="text-[12px] text-white/40 leading-relaxed">
              By utilizing renewable nodes, your enterprise avoids roughly 4.2kg of CO2 per 1M tokens processed.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="text-sm font-black text-white uppercase tracking-tight">Net Positive Impact</h5>
            <p className="text-[12px] text-white/40 leading-relaxed">
              For every $100 spent on inference, $0.50 is automatically routed to regional restoration initiatives.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
