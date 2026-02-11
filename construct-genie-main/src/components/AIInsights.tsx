import { motion } from "framer-motion";
import { BrainCircuit, Lightbulb } from "lucide-react";

interface Props {
  insights: string[];
}

export default function AIInsightsCard({ insights }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card-blueprint p-6 border-glow col-span-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center animate-pulse-glow">
          <BrainCircuit className="w-4 h-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-mono font-semibold text-foreground">AI-Powered Insights</h3>
          <p className="text-xs text-muted-foreground">IBM Granite 3.3 2B Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            className="flex gap-3 p-3 bg-secondary/60 rounded-lg border border-border/50"
          >
            <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-4 text-center font-mono">
        Note: Connect to Ollama (granite3.3:2b model) for live AI-powered insights · Powered by IBM Granite 3.3 2B via Ollama
      </p>
    </motion.div>
  );
}
