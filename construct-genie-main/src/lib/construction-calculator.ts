// ===== TYPES =====
export interface ProjectInput {
  area: number; // sq yards
  floors: number; // total floors including ground
  floorsLabel: string; // e.g. "G+2"
  timelineConstraint?: number; // days
  location: string;
  customWages?: Partial<WageRates>;
  customMaterialCosts?: Partial<MaterialCosts>;
}

export interface WageRates {
  mason: number;
  helper: number;
  steelWorker: number;
  carpenter: number;
  supervisor: number;
}

export interface MaterialCosts {
  cement: number; // per bag
  steel: number; // per ton
  sand: number; // per cubic meter
  bricks: number; // per 1000
  water: number; // per kL
}

export interface WorkerBreakdown {
  masons: number;
  helpers: number;
  steelWorkers: number;
  carpenters: number;
  supervisors: number;
  totalLabourDays: number;
}

export interface TimelineEstimation {
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  phases: ConstructionPhase[];
}

export interface ConstructionPhase {
  name: string;
  startDay: number;
  endDay: number;
  durationDays: number;
  workers: number;
  dependencies: string[];
}

export interface CostBreakdown {
  labourCost: number;
  materialCost: number;
  overheadCost: number;
  contingency: number;
  totalCost: number;
  costPerSqYard: number;
}

export interface MaterialRequirement {
  cement: { quantity: number; unit: string };
  steel: { quantity: number; unit: string };
  sand: { quantity: number; unit: string };
  water: { quantity: number; unit: string };
  bricks: { quantity: number; unit: string };
}

export interface ScheduleWeek {
  week: number;
  activities: string[];
  phase: string;
  workersNeeded: number;
}

export interface BlueprintRoom {
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface FloorLayout {
  floor: number;
  label: string;
  rooms: BlueprintRoom[];
  totalArea: number;
}

export interface ProjectResult {
  input: ProjectInput;
  workers: WorkerBreakdown;
  timeline: TimelineEstimation;
  cost: CostBreakdown;
  materials: MaterialRequirement;
  schedule: ScheduleWeek[];
  blueprint: FloorLayout[];
  aiInsights: string[];
}

// ===== CONSTANTS =====
const LOCATION_MULTIPLIER: Record<string, number> = {
  Urban: 1.0,
  Suburban: 0.85,
  Rural: 0.7,
  Metro: 1.25,
};

const DEFAULT_WAGES: WageRates = {
  mason: 800,
  helper: 500,
  steelWorker: 900,
  carpenter: 850,
  supervisor: 1200,
};

const DEFAULT_MATERIAL_COSTS: MaterialCosts = {
  cement: 380,
  steel: 55000,
  sand: 1800,
  bricks: 7000,
  water: 50,
};

// ===== CALCULATOR =====
export function calculateProject(input: ProjectInput): ProjectResult {
  const locMult = LOCATION_MULTIPLIER[input.location] || 1.0;
  const wages = { ...DEFAULT_WAGES, ...input.customWages };
  const matCosts = { ...DEFAULT_MATERIAL_COSTS, ...input.customMaterialCosts };

  const workers = calculateWorkers(input);
  const materials = calculateMaterials(input);
  const timeline = calculateTimeline(input, workers);
  const cost = calculateCost(input, workers, materials, wages, matCosts, locMult);
  const schedule = generateSchedule(timeline);
  const blueprint = generateBlueprint(input);
  const aiInsights = generateInsights(input, cost, timeline, workers);

  return { input, workers, timeline, cost, materials, schedule, blueprint, aiInsights };
}

function calculateWorkers(input: ProjectInput): WorkerBreakdown {
  const { area, floors } = input;
  const totalWork = area * floors;
  const productivity = 50; // sq yards per day per team

  const totalLabourDays = Math.ceil(totalWork / productivity);
  const masons = Math.ceil(totalWork / 200);
  const helpers = Math.ceil(masons * 2);
  const steelWorkers = Math.ceil(totalWork / 500);
  const carpenters = Math.ceil(totalWork / 400);
  const supervisors = Math.max(3, Math.ceil((masons + helpers + steelWorkers + carpenters) / 20));

  return { masons, helpers, steelWorkers, carpenters, supervisors, totalLabourDays };
}

function calculateMaterials(input: ProjectInput): MaterialRequirement {
  const { area, floors } = input;
  const totalArea = area * floors;

  return {
    cement: { quantity: Math.ceil(totalArea * 0.4), unit: "bags" },
    steel: { quantity: parseFloat((totalArea * 0.004).toFixed(2)), unit: "tons" },
    sand: { quantity: parseFloat((totalArea * 0.04).toFixed(1)), unit: "cubic meters" },
    water: { quantity: Math.ceil(totalArea * 0.5), unit: "kiloliters" },
    bricks: { quantity: Math.ceil(totalArea * 8), unit: "bricks" },
  };
}

function calculateTimeline(input: ProjectInput, workers: WorkerBreakdown): TimelineEstimation {
  const teamSize = workers.masons + workers.helpers + workers.steelWorkers + workers.carpenters;
  let totalDays = Math.ceil(workers.totalLabourDays / Math.max(1, teamSize / 5));

  if (input.timelineConstraint && input.timelineConstraint < totalDays) {
    totalDays = input.timelineConstraint;
  }

  totalDays = Math.max(totalDays, 30);

  const phases = generatePhases(totalDays, input.floors);

  return {
    totalDays,
    totalWeeks: Math.ceil(totalDays / 7),
    totalMonths: parseFloat((totalDays / 30).toFixed(1)),
    phases,
  };
}

function generatePhases(totalDays: number, floors: number): ConstructionPhase[] {
  const d = (pct: number) => Math.max(3, Math.ceil(totalDays * pct));

  const phases: ConstructionPhase[] = [];
  let day = 1;

  const addPhase = (name: string, pct: number, workers: number, deps: string[]) => {
    const dur = d(pct);
    phases.push({ name, startDay: day, endDay: day + dur - 1, durationDays: dur, workers, dependencies: deps });
    day += dur;
  };

  addPhase("Site Preparation", 0.05, 8, []);
  addPhase("Foundation", 0.12, 15, ["Site Preparation"]);
  for (let i = 0; i < floors; i++) {
    addPhase(`Floor ${i} – Columns & Beams`, 0.08, 12, i === 0 ? ["Foundation"] : [`Floor ${i - 1} – Slab Casting`]);
    addPhase(`Floor ${i} – Slab Casting`, 0.06, 18, [`Floor ${i} – Columns & Beams`]);
  }
  addPhase("Brickwork", 0.1, 14, [`Floor ${floors - 1} – Slab Casting`]);
  addPhase("Electrical", 0.07, 8, ["Brickwork"]);
  addPhase("Plumbing", 0.07, 8, ["Brickwork"]);
  addPhase("Plastering", 0.08, 10, ["Electrical", "Plumbing"]);
  addPhase("Painting", 0.06, 8, ["Plastering"]);
  addPhase("Finishing & Fixtures", 0.05, 6, ["Painting"]);
  addPhase("Handover", 0.02, 4, ["Finishing & Fixtures"]);

  return phases;
}

function calculateCost(
  input: ProjectInput,
  workers: WorkerBreakdown,
  materials: MaterialRequirement,
  wages: WageRates,
  matCosts: MaterialCosts,
  locMult: number
): CostBreakdown {
  const labourCost =
    (workers.masons * wages.mason +
      workers.helpers * wages.helper +
      workers.steelWorkers * wages.steelWorker +
      workers.carpenters * wages.carpenter +
      workers.supervisors * wages.supervisor) *
    workers.totalLabourDays * 0.15 * locMult;

  const materialCost =
    (materials.cement.quantity * matCosts.cement +
      materials.steel.quantity * matCosts.steel +
      materials.sand.quantity * matCosts.sand +
      materials.bricks.quantity * (matCosts.bricks / 1000) +
      materials.water.quantity * matCosts.water) *
    locMult;

  const overheadCost = (labourCost + materialCost) * 0.1;
  const contingency = (labourCost + materialCost + overheadCost) * 0.05;
  const totalCost = labourCost + materialCost + overheadCost + contingency;
  const costPerSqYard = totalCost / (input.area * input.floors);

  return { labourCost, materialCost, overheadCost, contingency, totalCost, costPerSqYard };
}

function generateSchedule(timeline: TimelineEstimation): ScheduleWeek[] {
  const weeks: ScheduleWeek[] = [];
  for (let w = 1; w <= timeline.totalWeeks; w++) {
    const weekStart = (w - 1) * 7 + 1;
    const weekEnd = w * 7;
    const activities: string[] = [];
    let phase = "";
    let workers = 0;

    for (const p of timeline.phases) {
      if (p.startDay <= weekEnd && p.endDay >= weekStart) {
        activities.push(p.name);
        phase = p.name;
        workers = Math.max(workers, p.workers);
      }
    }

    if (activities.length > 0) {
      weeks.push({ week: w, activities, phase, workersNeeded: workers });
    }
  }
  return weeks;
}

function generateBlueprint(input: ProjectInput): FloorLayout[] {
  const areaPerFloor = input.area / input.floors;
  const layouts: FloorLayout[] = [];

  for (let f = 0; f < input.floors; f++) {
    const rooms: BlueprintRoom[] = [];
    const isGround = f === 0;
    let x = 0;
    let y = 0;
    const w = Math.sqrt(areaPerFloor) * 3;

    if (isGround) {
      rooms.push({ name: "Living Room", width: w * 0.35, height: w * 0.4, x: 0, y: 0 });
      rooms.push({ name: "Kitchen", width: w * 0.25, height: w * 0.3, x: w * 0.35, y: 0 });
      rooms.push({ name: "Dining", width: w * 0.25, height: w * 0.3, x: w * 0.35, y: w * 0.3 });
      rooms.push({ name: "Bedroom 1", width: w * 0.4, height: w * 0.35, x: 0, y: w * 0.4 });
      rooms.push({ name: "Bathroom 1", width: w * 0.15, height: w * 0.2, x: w * 0.6, y: 0 });
      rooms.push({ name: "Staircase", width: w * 0.15, height: w * 0.25, x: w * 0.6, y: w * 0.2 });
    } else {
      rooms.push({ name: `Bedroom ${f * 2}`, width: w * 0.45, height: w * 0.45, x: 0, y: 0 });
      rooms.push({ name: `Bedroom ${f * 2 + 1}`, width: w * 0.45, height: w * 0.45, x: w * 0.45, y: 0 });
      rooms.push({ name: `Bathroom ${f + 1}`, width: w * 0.25, height: w * 0.25, x: 0, y: w * 0.45 });
      rooms.push({ name: "Balcony", width: w * 0.3, height: w * 0.2, x: w * 0.45, y: w * 0.45 });
      rooms.push({ name: "Staircase", width: w * 0.15, height: w * 0.25, x: w * 0.25, y: w * 0.45 });
    }

    layouts.push({
      floor: f,
      label: f === 0 ? "Ground Floor" : `Floor ${f}`,
      rooms,
      totalArea: areaPerFloor,
    });
  }

  return layouts;
}

function generateInsights(
  input: ProjectInput,
  cost: CostBreakdown,
  timeline: TimelineEstimation,
  workers: WorkerBreakdown
): string[] {
  const insights: string[] = [
    `Weather delays may extend the ${timeline.totalDays}-day timeline by 10-15%. Plan monsoon contingency.`,
    `Material price fluctuations could impact the ₹${formatCurrency(cost.totalCost)} budget. Lock vendor rates early.`,
    `Skilled labour availability in ${input.location} area needs monitoring. Pre-book specialist teams.`,
    `Bulk material procurement can save 8-12% on material costs (₹${formatCurrency(cost.materialCost * 0.1)} potential savings).`,
    `Local material sourcing reduces transportation costs by an estimated 5-8%.`,
    `Foundation work is critical path — cannot be rushed without quality compromise.`,
    `Parallel execution of electrical and plumbing work saves ${Math.ceil(timeline.totalDays * 0.05)} days.`,
    `${workers.totalLabourDays} total labour days require careful scheduling to avoid idle time.`,
    `Supervisor-to-worker ratio of ${workers.supervisors}:${workers.masons + workers.helpers + workers.steelWorkers + workers.carpenters} is within optimal range.`,
    `Maintain 5% contingency buffer (₹${formatCurrency(cost.contingency)}) for unexpected costs.`,
    `Regular quality checks at each construction phase prevent costly rework.`,
    `Ensure compliance with local building codes for ${input.floorsLabel} construction.`,
  ];
  return insights;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function parseFloorsLabel(label: string): number {
  const match = label.match(/G\+(\d+)/i);
  if (match) return parseInt(match[1]) + 1;
  if (label.toLowerCase() === "g") return 1;
  return parseInt(label) || 1;
}
