
import React from 'react';
import { AIInsight } from '../types';
import { Lightbulb, TrendingDown, Leaf, ShieldAlert, ArrowRight } from 'lucide-react';

interface Props {
  insights: AIInsight[];
  onOpenGreenReport: () => void;
}

const Insights: React.FC<Props> = ({ insights, onOpenGreenReport }) => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Budget': return <TrendingDown className="w-5 h-5 text-rose-500" />;
      case 'Sustainability': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'Timeline': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'high': return 'bg-rose-100 text-rose-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
      {insights.map((insight, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden group hover:border-blue-200"
        >
          {/* Progress Bar Header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <div 
              className={`h-full transition-all duration-1000 ${
                insight.score > 80 ? 'bg-emerald-500' : insight.score > 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${insight.score}%` }}
            />
          </div>

          <div className="flex items-start justify-between mb-4 mt-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">{getIcon(insight.category)}</div>
              <div>
                <h3 className="font-bold text-slate-800">{insight.title}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{insight.category}</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getSeverityColor(insight.severity)}`}>
              {insight.severity} Priority
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {insight.recommendation}
          </p>

          <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
            <span className="text-slate-400 font-medium italic">Confidence Score</span>
            <span className="font-bold text-slate-800">{insight.score}/100</span>
          </div>
        </div>
      ))}
      
      <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <div className="inline-flex p-2 bg-white/20 rounded-lg mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Build Green, Save More</h2>
          <p className="opacity-80 max-w-md text-sm leading-relaxed">
            Our AI analysis shows a potential for 15% reduction in lifecycle costs using fly-ash bricks and solar-reflective tiling.
          </p>
        </div>
        <button 
          onClick={onOpenGreenReport}
          className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg flex items-center space-x-2 group"
        >
          <span>View Green Report</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Insights;
