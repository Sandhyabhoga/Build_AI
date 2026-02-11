import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Clock, IndianRupee, Hammer } from "lucide-react";
import type { ProjectInput } from "@/lib/construction-calculator";
import { parseFloorsLabel } from "@/lib/construction-calculator";

interface InputFormProps {
  onCalculate: (input: ProjectInput) => void;
  isCalculating: boolean;
}

const LOCATIONS = ["Urban", "Suburban", "Rural", "Metro"];

export default function InputForm({ onCalculate, isCalculating }: InputFormProps) {
  const [area, setArea] = useState("1000");
  const [floorsLabel, setFloorsLabel] = useState("G+2");
  const [timeline, setTimeline] = useState("");
  const [location, setLocation] = useState("Urban");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floors = parseFloorsLabel(floorsLabel);
    onCalculate({
      area: parseInt(area) || 1000,
      floors,
      floorsLabel,
      timelineConstraint: timeline ? parseInt(timeline) : undefined,
      location,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-blueprint p-6 md:p-8 border-glow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-mono font-semibold text-foreground">Project Parameters</h2>
          <p className="text-xs text-muted-foreground">Enter construction details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Area */}
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground flex items-center gap-2">
            <Hammer className="w-3.5 h-3.5 text-primary" />
            Built-up Area (sq. yards)
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="1000"
            min={100}
            required
          />
        </div>

        {/* Floors */}
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            Number of Floors
          </label>
          <select
            value={floorsLabel}
            onChange={(e) => setFloorsLabel(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="G">G (Ground Only)</option>
            <option value="G+1">G+1</option>
            <option value="G+2">G+2</option>
            <option value="G+3">G+3</option>
            <option value="G+4">G+4</option>
          </select>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-accent" />
            Timeline Constraint (days, optional)
          </label>
          <input
            type="number"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="No constraint"
            min={30}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isCalculating}
        className="mt-6 w-full gradient-primary text-primary-foreground font-mono font-semibold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary text-sm tracking-wider uppercase"
      >
        {isCalculating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Generate Construction Plan
          </span>
        )}
      </button>
    </motion.form>
  );
}
