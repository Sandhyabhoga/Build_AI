import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Download } from "lucide-react";
import InputForm from "@/components/InputForm";
import WorkerBreakdownCard from "@/components/WorkerBreakdown";
import CostBreakdownCard from "@/components/CostBreakdown";
import MaterialEstimationCard from "@/components/MaterialEstimation";
import TimelineCard from "@/components/TimelineCard";
import WeeklyScheduleCard from "@/components/WeeklySchedule";
import BlueprintVisualizationCard from "@/components/BlueprintVisualization";
import AIInsightsCard from "@/components/AIInsights";
import { calculateProject, formatCurrency } from "@/lib/construction-calculator";
import type { ProjectInput, ProjectResult } from "@/lib/construction-calculator";

export default function Index() {
  const [result, setResult] = useState<ProjectResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (input: ProjectInput) => {
    setIsCalculating(true);
    // Simulate processing time for UX
    setTimeout(() => {
      const res = calculateProject(input);
      setResult(res);
      setIsCalculating(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 800);
  };

  const handleExportPDF = async () => {
    if (!resultsRef.current || !result) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(resultsRef.current, { scale: 1.5, backgroundColor: "#131825" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`construction-plan-${result.input.floorsLabel}-${result.input.area}sqyd.pdf`);
  };

  return (
    <div className="min-h-screen blueprint-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center glow-primary">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-foreground tracking-wide">
                Construction Planning System
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono">
                AI Powered · IBM Granite 3.3 2B · Ollama
              </p>
            </div>
          </div>
          {result && (
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-md text-xs font-mono text-foreground hover:border-primary/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-3 glow-text">
              Intelligent Construction Planning
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Generate comprehensive construction plans with AI-powered workforce analysis,
              cost estimation, material requirements, and blueprint layouts.
            </p>
          </motion.div>
        )}

        {/* Input Form */}
        <div className="max-w-2xl mx-auto mb-10">
          <InputForm onCalculate={handleCalculate} isCalculating={isCalculating} />
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Summary bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Area", value: `${result.input.area} sq.yd` },
                  { label: "Floors", value: result.input.floorsLabel },
                  { label: "Total Cost", value: `₹${formatCurrency(result.cost.totalCost)}` },
                  { label: "Duration", value: `${result.timeline.totalDays} days` },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-lg p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground font-mono">{item.label}</p>
                    <p className="text-lg font-mono font-bold text-primary mt-1">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WorkerBreakdownCard data={result.workers} />
                <TimelineCard data={result.timeline} />
                <CostBreakdownCard data={result.cost} />
                <MaterialEstimationCard data={result.materials} />
                <BlueprintVisualizationCard data={result.blueprint} />
                <AIInsightsCard insights={result.aiInsights} />
                <WeeklyScheduleCard data={result.schedule} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-4 mt-12">
        <p className="text-center text-[10px] text-muted-foreground font-mono">
          Construction Planning System · AI Powered by IBM Granite 3.3 2B via Ollama · All calculations are estimates
        </p>
      </footer>
    </div>
  );
}
