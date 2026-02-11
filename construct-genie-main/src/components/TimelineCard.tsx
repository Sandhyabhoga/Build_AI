import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import type { TimelineEstimation } from "@/lib/construction-calculator";

interface Props {
  data: TimelineEstimation;
}

export default function TimelineCard({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-blueprint p-6 border-glow"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
          <Calendar className="w-4 h-4 text-accent-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-foreground">Timeline Estimation</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Days", value: data.totalDays, icon: <Clock className="w-3.5 h-3.5" /> },
          { label: "Weeks", value: data.totalWeeks },
          { label: "Months", value: data.totalMonths },
        ].map((item) => (
          <div key={item.label} className="bg-secondary rounded-lg p-3 text-center">
            <p className="text-2xl font-mono font-bold text-primary glow-text">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {data.phases.map((phase, i) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-3 text-xs"
          >
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse-glow" />
            <span className="text-muted-foreground w-20 flex-shrink-0 font-mono">
              Day {phase.startDay}–{phase.endDay}
            </span>
            <span className="text-foreground flex-1 truncate">{phase.name}</span>
            <span className="text-muted-foreground font-mono">{phase.workers}w</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
