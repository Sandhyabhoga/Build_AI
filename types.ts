
export interface ConstructionConfig {
  builtUpArea: number;
  floors: number;
  location: string;
  timelineMonths: number | null;
  durationDays: number | null; // New field
  bedrooms: number;
  bathrooms: number;
  diningRoom: boolean;
  staircase: boolean;
  balcony: boolean;
  balconyCount: number;
  parking: boolean;
}

export interface RoomLayout {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface LayoutResponse {
  rooms: RoomLayout[];
  totalWidth: number;
  totalHeight: number;
  explanation: string;
}

export interface MaterialEstimate {
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface LaborEstimate {
  role: string;
  workers: number;
  totalDays: number;
  cost: number;
}

export interface EstimationResults {
  materials: MaterialEstimate[];
  labor: LaborEstimate[];
  totalCost: number;
  costPerSqFt: number;
  breakdown: {
    labor: number;
    materials: number;
    overhead: number;
    contingency: number;
  };
}

export interface AIInsight {
  title: string;
  severity: 'low' | 'medium' | 'high';
  score: number;
  recommendation: string;
  category: 'Budget' | 'Timeline' | 'Sustainability' | 'Optimization';
}

export interface TimelinePhase {
  week: number;
  phase: string;
  tasks: string[];
  resources: string;
}

export interface SustainabilityReport {
  score: number;
  ecoMaterials: string[];
  solarRecommendation: string;
  waterHarvesting: string;
  carbonEstimate: string;
  suggestions: string[];
}
