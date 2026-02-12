
import React from 'react';
import { TimelinePhase } from '../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface Props {
  timeline: TimelinePhase[];
}

const Timeline: React.FC<Props> = ({ timeline }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Construction Timeline</h2>
          <p className="text-sm text-slate-500">Optimized phase-wise execution strategy</p>
        </div>
        <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Estimated: {Math.max(...timeline.map(t => t.week))} Weeks</span>
        </div>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {timeline.map((item, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="text-xs font-bold">{item.week}</span>
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-blue-300 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <time className="font-bold text-blue-600 text-sm">Week {item.week}</time>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.phase}</span>
              </div>
              <ul className="space-y-2">
                {item.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">RESOURCES</span>
                <span className="text-xs font-semibold text-slate-700">{item.resources}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
