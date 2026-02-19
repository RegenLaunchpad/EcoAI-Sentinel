
export const WATER_PER_TOKEN = 0.0005; 
export const ENERGY_PER_TOKEN = 0.002; 
export const TOKEN_PRICE_USD = 0.005; 
export const PRODUCTIVITY_VALUE_PER_PROMPT = 2.50; 

export const DAILY_COOLING_CAPACITY_LITERS = 10.0; 
export const DATA_CENTER_REGION = "Nordics (Renewable Optimized)";
export const BIODIVERSITY_REGION_INFO = {
  region: "Northern Europe",
  status: "Sensitive Wetlands Ecosystem",
  impactFactor: 0.12, 
};

export const BIO_REGIONAL_NODES = [
  { 
    id: 'arc-1', name: 'Arctic Edge', location: 'Luleå, SE', health: 98, status: 'Pristine',
    metrics: { social: 'High Employment', water: '0.01L/t', energy: '100% Wind', biodiversity: 'Near Zero Loss' }
  },
  { 
    id: 'fin-1', name: 'Central Mire', location: 'Oulu, FI', health: 84, status: 'Recovering',
    metrics: { social: 'Local Grant Pgm', water: '0.04L/t', energy: '90% Geo', biodiversity: 'Offset Verified' }
  },
  { 
    id: 'nor-1', name: 'Atlantic Coast', location: 'Bergen, NO', health: 91, status: 'Stable',
    metrics: { social: 'Uni-Partnership', water: '0.02L/t', energy: '100% Hydro', biodiversity: 'Marine Protected' }
  },
  { 
    id: 'swi-1', name: 'Alpine High', location: 'Zürich, CH', health: 76, status: 'Monitored',
    metrics: { social: 'Carbon Tax Contrib', water: '0.08L/t', energy: 'Solar/Grid', biodiversity: 'Fragmented' }
  }
];

export const COMPUTE_MODES = {
  LOW: {
    multiplier: 0.4,
    label: "Minimalist",
    description: "Ideal for: Word definitions, proofreading, simple logic. Minimal grid impact.",
    color: "text-blue-400",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-500/10"
  },
  MEDIUM: {
    multiplier: 1.0,
    label: "Balanced",
    description: "Ideal for: Creative writing, summarization, general chat. Optimized throughput.",
    color: "text-green-400",
    glow: "shadow-green-500/20",
    bg: "bg-green-500/10"
  },
  HEAVY: {
    multiplier: 2.8,
    label: "Deep Reason",
    description: "Ideal for: Complex coding, multi-step math, deep research. High thermal output.",
    color: "text-amber-500",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-500/10"
  }
};
