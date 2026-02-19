
export enum AppMode {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  CONSULTANT = 'CONSULTANT'
}

export enum ComputeIntensity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HEAVY = 'HEAVY'
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  modeUsed?: ComputeIntensity;
}

export interface EcologicalMetrics {
  waterUsedLiters: number;
  energyConsumedWh: number;
  tokensUsed: number;
  biodiversityImpactScore: number; // 0-100
  financialBenefit: number; // USD
}

export interface UserState {
  tokensRemaining: number;
  totalDonated: number;
  history: Message[];
  metrics: EcologicalMetrics;
  computeMode: ComputeIntensity;
  isAutoMode: boolean;
  hasStartedSession: boolean;
  pendingInput?: string; // Prompt captured during onboarding
}
