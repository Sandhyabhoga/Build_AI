import { motion } from "framer-motion";
import { Users, HardHat } from "lucide-react";
import type { WorkerBreakdown as WorkerData } from "@/lib/construction-calculator";

interface Props {
  data: WorkerData;
}

const WORKER_TYPES = [
  { key: "masons", label: "Masons", color: "bg-primary" },
  { key: "helpers", label: "Helpers", color: "bg-blue-500" },
  { key: "steelWorkers", label: "Steel Workers", color: "bg-accent" },
  { key: "carpenters", label: "Carpenters", color: "bg-orange-500" },
  { key: "supervisors", label: "Supervisors", color: "bg-emerald-500" },
] as const;

export default function WorkerBreakdownCard({ data }: Props) {
  const total = data.masons + data.helpers + data.steelWorkers + data.carpenters + data.supervisors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-blueprint p-6 border-glow"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Users className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-foreground">Worker Requirements</h3>
      </div>

      <div className="space-y-3">
        {WORKER_TYPES.map(({ key, label, color }) => {
          const value = data[key];
          const pct = (value / total) * 100;
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono text-foreground">{value}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HardHat className="w-4 h-4 text-primary" />
          Total Workforce
        </div>
        <span className="font-mono font-bold text-primary text-lg">{total}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">Total Labour Days</span>
        <span className="font-mono text-sm text-accent">{data.totalLabourDays}</span>
      </div>
    </motion.div>
  );
}
