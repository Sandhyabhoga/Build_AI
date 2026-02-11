import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import type { ScheduleWeek } from "@/lib/construction-calculator";

interface Props {
  data: ScheduleWeek[];
}

export default function WeeklyScheduleCard({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-blueprint p-6 border-glow col-span-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-foreground">Weekly Construction Schedule</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-4 min-w-max">
          {data.map((week, i) => (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.03 }}
              className="bg-secondary border border-border rounded-lg p-3 w-40 flex-shrink-0 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-primary font-semibold">Week {week.week}</span>
                <span className="text-xs text-muted-foreground font-mono">{week.workersNeeded}w</span>
              </div>
              <div className="space-y-1">
                {week.activities.map((act, j) => (
                  <p key={j} className="text-xs text-foreground truncate" title={act}>
                    {act}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
