import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import type { FloorLayout } from "@/lib/construction-calculator";

interface Props {
  data: FloorLayout[];
}

const ROOM_COLORS: Record<string, string> = {
  "Living Room": "border-primary/60 bg-primary/10",
  Kitchen: "border-accent/60 bg-accent/10",
  Dining: "border-orange-500/60 bg-orange-500/10",
  Staircase: "border-muted-foreground/60 bg-muted/30",
  Balcony: "border-emerald-500/60 bg-emerald-500/10",
  default: "border-blue-400/60 bg-blue-400/10",
};

function getRoomStyle(name: string) {
  for (const key of Object.keys(ROOM_COLORS)) {
    if (name.includes(key)) return ROOM_COLORS[key];
  }
  if (name.includes("Bedroom")) return ROOM_COLORS.default;
  if (name.includes("Bathroom")) return "border-purple-400/60 bg-purple-400/10";
  return ROOM_COLORS.default;
}

export default function BlueprintVisualizationCard({ data }: Props) {
  const [activeFloor, setActiveFloor] = useState(0);
  const layout = data[activeFloor];

  const maxDim = Math.max(
    ...layout.rooms.map((r) => r.x + r.width),
    ...layout.rooms.map((r) => r.y + r.height)
  );
  const scale = 280 / maxDim;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="card-blueprint p-6 border-glow"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
          <LayoutGrid className="w-4 h-4 text-accent-foreground" />
        </div>
        <h3 className="font-mono font-semibold text-foreground">Blueprint Layout</h3>
      </div>

      {/* Floor tabs */}
      <div className="flex gap-2 mb-4">
        {data.map((fl, i) => (
          <button
            key={fl.floor}
            onClick={() => setActiveFloor(i)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              activeFloor === i
                ? "gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {fl.label}
          </button>
        ))}
      </div>

      {/* Blueprint */}
      <div className="relative bg-secondary/50 rounded-lg p-4 border border-border" style={{ minHeight: 300 }}>
        <div className="relative" style={{ width: 280, height: 280, margin: "0 auto" }}>
          {layout.rooms.map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`absolute border-2 rounded-sm flex items-center justify-center p-1 ${getRoomStyle(room.name)}`}
              style={{
                left: room.x * scale,
                top: room.y * scale,
                width: room.width * scale,
                height: room.height * scale,
              }}
            >
              <span className="text-[10px] font-mono text-foreground text-center leading-tight">{room.name}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3 font-mono">
          {layout.label} — {layout.totalArea.toFixed(0)} sq. yards
        </p>
      </div>
    </motion.div>
  );
}
