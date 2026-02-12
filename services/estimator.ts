
import { ConstructionConfig, EstimationResults, MaterialEstimate, LaborEstimate } from '../types';

export const calculateEstimation = (config: ConstructionConfig): EstimationResults => {
  const { builtUpArea, floors, location, durationDays } = config;
  
  // Real-world Indian Construction Rates (Standard Residential)
  const baseRate = location.toLowerCase().includes('urban') ? 2200 : 1800;
  const floorMultiplier = 1 + (floors - 1) * 0.12; 
  const effectiveArea = builtUpArea * floorMultiplier;
  
  // Material Calculation (Thumb rules for India)
  // Cement: 0.4 bags/sqft, Steel: 3.5 kg/sqft, Sand: 1.6 cft/sqft, Bricks: 10/sqft
  const materials: MaterialEstimate[] = [
    { name: 'Cement', quantity: Math.round(effectiveArea * 0.4), unit: 'Bags', cost: 0 },
    { name: 'Steel (TMT)', quantity: Math.round(effectiveArea * 3.8), unit: 'Kg', cost: 0 },
    { name: 'Sand/M-Sand', quantity: Math.round(effectiveArea * 1.6), unit: 'Cu Ft', cost: 0 },
    { name: 'Red Bricks', quantity: Math.round(effectiveArea * 11), unit: 'Pcs', cost: 0 },
    { name: 'Aggregates', quantity: Math.round(effectiveArea * 1.3), unit: 'Cu Ft', cost: 0 }
  ];

  // Assign costs in INR (Average 2024-2025 rates)
  materials[0].cost = materials[0].quantity * 420; // Cement bag
  materials[1].cost = materials[1].quantity * 72;  // Steel kg
  materials[2].cost = materials[2].quantity * 65;  // Sand cft
  materials[3].cost = materials[3].quantity * 9;   // Bricks pcs
  materials[4].cost = materials[4].quantity * 55;  // Aggregates

  const materialTotal = materials.reduce((acc, m) => acc + m.cost, 0);

  // Labor Calculation
  // Standard productivity: 1 man-day per 1.5 sqft
  let totalLaborDays = Math.round(effectiveArea * 0.65);
  
  // Adjust labor if duration is compressed
  let compressionMultiplier = 1;
  if (durationDays && durationDays > 0) {
    const defaultDays = totalLaborDays / 5; // Assuming 5 workers avg
    if (durationDays < defaultDays * 0.8) {
      compressionMultiplier = 1.25; // 25% cost increase for overtime/rush
    }
  }

  const labor: LaborEstimate[] = [
    { role: 'Masons', workers: Math.ceil(totalLaborDays / 60), totalDays: totalLaborDays, cost: (totalLaborDays * 850) * compressionMultiplier },
    { role: 'Helpers/Unskilled', workers: Math.ceil(totalLaborDays / 30), totalDays: totalLaborDays * 1.5, cost: (totalLaborDays * 1.5 * 550) * compressionMultiplier },
    { role: 'Steel Fixers', workers: Math.ceil(totalLaborDays / 120), totalDays: Math.round(totalLaborDays * 0.2), cost: totalLaborDays * 0.2 * 950 },
    { role: 'Plumbing/Electrical', workers: 2, totalDays: 45, cost: 85000 }
  ];

  const laborTotal = labor.reduce((acc, l) => acc + l.cost, 0);
  
  // Overhead (8%) & Contingency (5%)
  const overhead = (materialTotal + laborTotal) * 0.08;
  const contingency = (materialTotal + laborTotal) * 0.05;
  
  const totalCost = materialTotal + laborTotal + overhead + contingency;

  return {
    materials,
    labor,
    totalCost,
    costPerSqFt: totalCost / builtUpArea,
    breakdown: {
      labor: laborTotal,
      materials: materialTotal,
      overhead,
      contingency
    }
  };
};
