
import React from 'react';
import { EstimationResults } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { DollarSign, HardHat, Package, TrendingUp } from 'lucide-react';

interface Props {
  estimation: EstimationResults;
}

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const Dashboard: React.FC<Props> = ({ estimation }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  const pieData = [
    { name: 'Labor', value: estimation.breakdown.labor },
    { name: 'Materials', value: estimation.breakdown.materials },
    { name: 'Overhead', value: estimation.breakdown.overhead },
    { name: 'Contingency', value: estimation.breakdown.contingency },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Project Cost</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <h3 className="text-xl font-bold text-slate-800">{formatINR(estimation.totalCost)}</h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">ESTIMATED LANDING COST</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Rate</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Package className="w-4 h-4" /></div>
          </div>
          <h3 className="text-xl font-bold text-slate-800">{formatINR(estimation.costPerSqFt)}</h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">PER SQUARE FOOT</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Labor Strength</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><HardHat className="w-4 h-4" /></div>
          </div>
          <h3 className="text-xl font-bold text-slate-800">{estimation.labor.reduce((a,b) => a+b.workers, 0)}</h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">SKILLED & UNSKILLED</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Risk</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Package className="w-4 h-4" /></div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 text-emerald-600">Stable</h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">CONTINGENCY APPLIED</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-6 uppercase tracking-widest">Financial Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: any) => formatINR(value)}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400 font-bold uppercase">{item.name}</span>
                   <span className="text-xs font-bold text-slate-700">{formatINR(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-widest">Key Material Estimates</h3>
          <div className="flex-1 overflow-auto space-y-2">
            {estimation.materials.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-all group hover:bg-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{m.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400">{m.quantity.toLocaleString()} {m.unit}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600">{formatINR(m.cost)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">Total Material Cost</span>
            <span className="text-sm font-bold text-blue-900">{formatINR(estimation.breakdown.materials)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
