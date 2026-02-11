import { motion } from "framer-motion";
import { IndianRupee, TrendingUp } from "lucide-react";
import type { CostBreakdown as CostData } from "@/lib/construction-calculator";
import { formatCurrency } from "@/lib/construction-calculator";

interface Props {
  data: CostData;
}

const COST_ITEMS = [
  { key: "labourCost", label: "Labour Cost", icon: "👷" },
  { key: "materialCost", label: "Material Cost", icon: "🧱" },
  { key: "overheadCost", label: "Overhead (10%)", icon: "📋" },
  { key: "contingency", label: "Contingency (5%)", icon: "🛡️" },
] as const;

export default function CostBreakdownCard({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-blueprint p-6 border-glow"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
          <IndianRupee className="w-4 h-4 text-accent-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-foreground">Cost Breakdown</h3>
      </div>

      <div className="space-y-3">
        {COST_ITEMS.map(({ key, label, icon }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{icon}</span> {label}
            </span>
            <span className="font-mono text-sm text-foreground">₹{formatCurrency(data[key])}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t-2 border-primary/30">
        <div className="flex items-center justify-between">
          <span className="font-mono font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Total Project Cost
          </span>
          <span className="font-mono font-bold text-primary text-xl glow-text">₹{formatCurrency(data.totalCost)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">Cost per sq. yard</span>
          <span className="font-mono text-sm text-accent">₹{formatCurrency(data.costPerSqYard)}/sq.yd</span>
        </div>
      </div>
    </motion.div>
  );
}
