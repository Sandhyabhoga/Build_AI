import { motion } from "framer-motion";
import { Package } from "lucide-react";
import type { MaterialRequirement } from "@/lib/construction-calculator";
import { formatCurrency } from "@/lib/construction-calculator";

interface Props {
  data: MaterialRequirement;
}

const MATERIAL_INFO = [
  { key: "cement", label: "Cement", icon: "🏗️" },
  { key: "steel", label: "Steel", icon: "⚙️" },
  { key: "sand", label: "Sand", icon: "🏖️" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "bricks", label: "Bricks", icon: "🧱" },
] as const;

export default function MaterialEstimationCard({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-blueprint p-6 border-glow"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Package className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-foreground">Material Requirements</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-mono font-medium">Material</th>
              <th className="text-right py-2 text-muted-foreground font-mono font-medium">Quantity</th>
              <th className="text-right py-2 text-muted-foreground font-mono font-medium">Unit</th>
            </tr>
          </thead>
          <tbody>
            {MATERIAL_INFO.map(({ key, label, icon }) => {
              const mat = data[key];
              return (
                <tr key={key} className="border-b border-border/30">
                  <td className="py-3 flex items-center gap-2">
                    <span>{icon}</span>
                    <span className="text-foreground">{label}</span>
                  </td>
                  <td className="py-3 text-right font-mono text-primary font-semibold">
                    {typeof mat.quantity === "number" ? formatCurrency(mat.quantity) : mat.quantity}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">{mat.unit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
