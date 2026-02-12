
import React, { useState } from 'react';
import { ConstructionConfig } from '../types';
import { Settings, Maximize, Home, MapPin, Play, Clock } from 'lucide-react';

interface Props {
  config: ConstructionConfig;
  onAnalyze: (config: ConstructionConfig) => void;
  loading: boolean;
}

const ConfigForm: React.FC<Props> = ({ config: initialConfig, onAnalyze, loading }) => {
  const [config, setConfig] = useState<ConstructionConfig>(initialConfig);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? (value === "" ? null : Number(value)) : value;
    
    setConfig(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(config);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-800">Parameters</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center mb-1">
              <Maximize className="w-3 h-3 mr-1" /> Area (Sq Ft)
            </label>
            <input 
              type="number" 
              name="builtUpArea"
              value={config.builtUpArea}
              onChange={handleChange}
              min="200"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center mb-1">
                <Home className="w-3 h-3 mr-1" /> Floors
              </label>
              <select 
                name="floors"
                value={config.floors}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>G + {n-1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center mb-1">
                <Clock className="w-3 h-3 mr-1" /> Duration (Days)
              </label>
              <input 
                type="number" 
                name="durationDays"
                placeholder="Auto"
                value={config.durationDays || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center mb-1">
              <MapPin className="w-3 h-3 mr-1" /> Location Tier
            </label>
            <select 
              name="location"
              value={config.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Urban">Metro / Tier 1 City</option>
              <option value="Suburban">Tier 2 / Suburban</option>
              <option value="Rural">Rural / Semi-urban</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
           <h3 className="text-[10px] font-bold text-slate-700 uppercase mb-3">Room Configuration</h3>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Bedrooms</label>
                <input 
                  type="number" 
                  name="bedrooms" 
                  min="1" max="8"
                  value={config.bedrooms} 
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Bathrooms</label>
                <input 
                  type="number" 
                  name="bathrooms" 
                  min="1" max="8"
                  value={config.bathrooms} 
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
           </div>

           <div className="mt-3 space-y-1">
              {['Dining Room', 'Balcony', 'Car Parking'].map((item) => {
                const key = item.toLowerCase().replace(' ', '') === 'carparking' ? 'parking' : item.toLowerCase().replace(' ', '');
                return (
                  <label key={item} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <span className="text-xs font-medium text-slate-600">{item}</span>
                    <input 
                      type="checkbox" 
                      name={key} 
                      checked={(config as any)[key]} 
                      onChange={handleChange} 
                      className="w-3.5 h-3.5 text-blue-600 rounded" 
                    />
                  </label>
                );
              })}
           </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 text-sm mt-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Update Analysis</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ConfigForm;
