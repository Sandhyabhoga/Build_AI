
import React from 'react';
import { LayoutResponse } from '../types';
import { Info, Maximize2 } from 'lucide-react';

interface Props {
  layout: LayoutResponse;
}

const Blueprint: React.FC<Props> = ({ layout }) => {
  // Use a fixed unit system (0-20) and scale to SVG container
  const padding = 40;
  const unitSize = 25; // Scale unit factor
  const svgSize = 20 * unitSize + padding * 2;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Architectural Floor Plan</h2>
          <p className="text-sm text-slate-500">Scaled SVG Grid (20x20 units)</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 overflow-auto border border-slate-200 flex justify-center min-h-[500px] items-center">
        <svg 
          viewBox={`0 0 ${svgSize} ${svgSize}`} 
          className="w-full max-w-[500px] drop-shadow-md"
        >
          {/* Architectural Background Grid */}
          <defs>
            <pattern id="blueprintGrid" width={unitSize} height={unitSize} patternUnits="userSpaceOnUse">
              <rect width={unitSize} height={unitSize} fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect x={padding} y={padding} width={20 * unitSize} height={20 * unitSize} fill="url(#blueprintGrid)" stroke="#cbd5e1" />

          {/* Rooms */}
          {layout.rooms && layout.rooms.map((room, i) => {
            const rx = room.x * unitSize + padding;
            const ry = room.y * unitSize + padding;
            const rw = room.width * unitSize;
            const rh = room.height * unitSize;

            return (
              <g key={i} className="group cursor-help">
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  fill="white"
                  stroke="#1e293b"
                  strokeWidth="2"
                  className="group-hover:fill-blue-50/80 transition-all"
                />
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2}
                  textAnchor="middle"
                  className="fill-slate-800 text-[10px] font-bold pointer-events-none uppercase tracking-tighter"
                >
                  {room.name}
                </text>
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 + 10}
                  textAnchor="middle"
                  className="fill-slate-400 text-[8px] font-medium pointer-events-none"
                >
                  {room.width}u x {room.height}u
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-start space-x-4">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Architectural Reasoning</h4>
          <p className="text-xs text-slate-600 leading-relaxed italic">
            {layout.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blueprint;
