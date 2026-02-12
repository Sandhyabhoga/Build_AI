
import React from 'react';
import { jsPDF } from 'jspdf';
import { SustainabilityReport } from '../types';
import { X, Leaf, Sun, Droplets, Zap, ShieldCheck, Download } from 'lucide-react';

interface Props {
  report: SustainabilityReport | null;
  onClose: () => void;
  loading: boolean;
}

const SustainabilityModal: React.FC<Props> = ({ report, onClose, loading }) => {
  if (!report && !loading) return null;

  const downloadLeedGuide = () => {
    if (!report) return;
    
    try {
      const doc = new jsPDF();
      const margin = 15;
      let y = 20;
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129); // Emerald-600
      doc.text("BUILDWISE GREEN BUILDING GUIDE", margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
      y += 15;
      
      // Sustainability Score
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`Sustainability Score: ${report.score}%`, margin, y);
      y += 12;
      
      // Eco Materials
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Recommended Eco-Materials:", margin, y);
      y += 8;
      doc.setFontSize(10);
      report.ecoMaterials.forEach((m) => {
        doc.text(`• ${m}`, margin + 5, y);
        y += 6;
      });
      y += 5;
      
      // Solar Recommendation
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Solar Recommendation:", margin, y);
      y += 8;
      doc.setFontSize(10);
      const solarLines = doc.splitTextToSize(report.solarRecommendation, 180);
      solarLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 6;
      });
      y += 5;
      
      // Water Harvesting
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Water Harvesting:", margin, y);
      y += 8;
      doc.setFontSize(10);
      const waterLines = doc.splitTextToSize(report.waterHarvesting, 180);
      waterLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 6;
      });
      y += 5;
      
      // Carbon Estimate
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Carbon Footprint:", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(report.carbonEstimate, margin, y);
      y += 12;
      
      // Suggestions
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Sustainability Suggestions:", margin, y);
      y += 8;
      doc.setFontSize(10);
      report.suggestions.forEach((s) => {
        const suggestionLines = doc.splitTextToSize(s, 175);
        suggestionLines.forEach((line: string, idx: number) => {
          if (idx === 0) {
            doc.text(`• ${line}`, margin + 5, y);
          } else {
            doc.text(line, margin + 10, y);
          }
          y += 6;
        });
      });
      
      doc.save("BuildWise_Green_Report.pdf");
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="w-6 h-6" />
            <h2 className="text-xl font-bold">BuildWise Green Report</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Analyzing environmental footprint...</p>
            </div>
          ) : report && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Sustainability Score</span>
                  <div className="text-5xl font-black text-emerald-700">{report.score}%</div>
                  <p className="text-xs text-emerald-600 mt-2 font-medium italic">High efficiency rating</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Sun className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Solar Potential</h4>
                      <p className="text-xs text-slate-600">{report.solarRecommendation}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Droplets className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Water Management</h4>
                      <p className="text-xs text-slate-600">{report.waterHarvesting}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-emerald-600" /> ECO-MATERIALS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.ecoMaterials.map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Carbon Footprint</span>
                   <span className="text-lg font-bold text-rose-600">{report.carbonEstimate}</span>
                </div>
                <button 
                  onClick={downloadLeedGuide}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center space-x-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download LEED Guide</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityModal;
