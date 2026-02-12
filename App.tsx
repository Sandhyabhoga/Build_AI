
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  ConstructionConfig, 
  EstimationResults, 
  LayoutResponse, 
  AIInsight, 
  TimelinePhase,
  SustainabilityReport
} from './types';
import { calculateEstimation } from './services/estimator';
import { generateLayout, generateInsights, generateTimeline, generateSustainabilityReport } from './services/gemini';
import ConfigForm from './components/ConfigForm';
import Dashboard from './components/Dashboard';
import Blueprint from './components/Blueprint';
import Timeline from './components/Timeline';
import Insights from './components/Insights';
import Chatbot from './components/Chatbot';
import SustainabilityModal from './components/SustainabilityModal';
import ContactModal from './components/ContactModal';
import { Layout, Calculator, Calendar, Lightbulb, FileText, Download, ShieldCheck, X, Phone } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ConstructionConfig>({
    builtUpArea: 1800,
    floors: 1,
    location: 'Urban',
    timelineMonths: 10,
    durationDays: null,
    bedrooms: 3,
    bathrooms: 2,
    diningRoom: true,
    staircase: true,
    balcony: true,
    balconyCount: 2,
    parking: true,
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'blueprint' | 'timeline' | 'insights'>('dashboard');
  const [estimation, setEstimation] = useState<EstimationResults | null>(null);
  const [layout, setLayout] = useState<LayoutResponse | null>(null);
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [greenReport, setGreenReport] = useState<SustainabilityReport | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [greenLoading, setGreenLoading] = useState(false);
  const [isGreenModalOpen, setIsGreenModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fallback data generators
  const getDefaultLayout = (config: ConstructionConfig): LayoutResponse => ({
    rooms: [
      { name: 'Living Room', x: 0, y: 0, width: 8, height: 6, description: '48 x 36 feet' },
      { name: 'Kitchen', x: 8, y: 0, width: 5, height: 5, description: '30 x 30 feet' },
      { name: 'Master Bedroom', x: 0, y: 6, width: 7, height: 6, description: '42 x 36 feet' },
      { name: 'Bedroom 2', x: 7, y: 6, width: 5, height: 5, description: '30 x 30 feet' },
      { name: 'Bedroom 3', x: 12, y: 6, width: 5, height: 5, description: '30 x 30 feet' },
      { name: 'Bathroom', x: 8, y: 5, width: 3, height: 3, description: '18 x 18 feet' },
      { name: 'Dining', x: 13, y: 0, width: 5, height: 5, description: '30 x 30 feet' }
    ],
    totalWidth: 18,
    totalHeight: 12,
    explanation: 'Efficient 2-floor layout with optimal room arrangement'
  });

  const getDefaultTimeline = (config: ConstructionConfig): TimelinePhase[] => {
    // Default to 120 days (~4 months) if not specified
    const totalDays = config.durationDays || 120;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    // Define phases and their proportion of total time
    const phases = [
      { phase: 'Foundation & Excavation', proportion: 0.20, baseWorkers: 15 },
      { phase: 'Structural Work & Masonry', proportion: 0.35, baseWorkers: 25 },
      { phase: 'Flooring & Concrete Work', proportion: 0.15, baseWorkers: 20 },
      { phase: 'MEP (Plumbing/Electrical)', proportion: 0.20, baseWorkers: 10 },
      { phase: 'Finishing & Painting', proportion: 0.10, baseWorkers: 15 }
    ];
    
    let timeline: TimelinePhase[] = [];
    let currentWeek = 1;
    let weeksAssigned = 0;
    
    phases.forEach((phaseInfo, idx) => {
      const isLastPhase = idx === phases.length - 1;
      let phaseWeeks = isLastPhase ? totalWeeks - weeksAssigned : Math.max(1, Math.round(totalWeeks * phaseInfo.proportion));
      phaseWeeks = Math.max(1, phaseWeeks);
      
      const tasks = getTasksForPhase(phaseInfo.phase, phaseWeeks);
      
      timeline.push({
        week: currentWeek,
        phase: phaseInfo.phase,
        tasks: tasks,
        resources: `${phaseInfo.baseWorkers} workers`
      });
      
      weeksAssigned += phaseWeeks;
      currentWeek += phaseWeeks;
    });
    
    return timeline;
  };

  const getTasksForPhase = (phase: string, weeks: number): string[] => {
    const taskMap: { [key: string]: string[] } = {
      'Foundation & Excavation': ['Site preparation', 'Survey and marking', 'Excavation', 'Foundation laying', 'Soil testing'],
      'Structural Work & Masonry': ['Column construction', 'Beam installation', 'Wall construction', 'Brick laying', 'Structural curing'],
      'Flooring & Concrete Work': ['Floor shuttering', 'Reinforcement placement', 'Concrete pouring', 'Floor leveling', 'Finishing'],
      'MEP (Plumbing/Electrical)': ['Pipe routing', 'Conduit installation', 'Wiring', 'Termination', 'Testing & commissions'],
      'Finishing & Painting': ['Plastering', 'Sanding & putty', 'Primer coating', 'Final painting', 'Final inspection']
    };
    
    const baseTasks = taskMap[phase] || ['General work'];
    // Return tasks proportional to weeks (max 5 tasks per phase)
    return baseTasks.slice(0, Math.min(5, Math.ceil(weeks / 2)));
  };

  const getDefaultInsights = (): AIInsight[] => [
    { title: 'Budget Optimization', category: 'Cost', severity: 'Info', score: 8.5, recommendation: 'Consider bulk material purchases to reduce unit costs' },
    { title: 'Timeline Efficiency', category: 'Schedule', severity: 'Info', score: 7.8, recommendation: 'Parallel tasks can reduce duration by 15%' },
    { title: 'Labor Planning', category: 'Resources', severity: 'Warning', score: 6.5, recommendation: 'Plan skilled labor availability in advance' },
    { title: 'Quality Assurance', category: 'Quality', severity: 'Info', score: 8.0, recommendation: 'Regular inspections at each phase ensure standards' }
  ];

  const getDefaultSustainabilityReport = (): SustainabilityReport => ({
    score: 7.5,
    ecoMaterials: ['Recycled Steel', 'Fly Ash Bricks', 'Bamboo Reinforcement', 'Low-VOC Paints'],
    solarRecommendation: '10 kW rooftop solar system with 25 kWh battery storage',
    waterHarvesting: 'Rainwater harvesting system with 50,000 liter capacity for gardens and toilets',
    carbonEstimate: 'Estimated 45 tons CO2 equivalent for construction and 5 years of operation',
    suggestions: [
      'Install LED lighting throughout to save 40% electricity',
      'Use double-glazed windows for better thermal insulation',
      'Implement smart HVAC system for energy management',
      'Plant 30+ trees around the property for carbon offset'
    ]
  });

  const handleRunAnalysis = async (newConfig: ConstructionConfig) => {
    setLoading(true);
    setError(null);
    setConfig(newConfig);
    
    const est = calculateEstimation(newConfig);
    setEstimation(est);

    try {
      const [layoutData, timelineData, insightsData] = await Promise.all([
        generateLayout(newConfig),
        generateTimeline(newConfig),
        generateInsights(newConfig, est)
      ]);
      
      setLayout(layoutData);
      setTimeline(timelineData);
      setInsights(insightsData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("AI Analysis failed:", errorMsg, err);
      // Use fallback data
      setLayout(getDefaultLayout(newConfig));
      setTimeline(getDefaultTimeline(newConfig));
      setInsights(getDefaultInsights());
      
      // Only show error if not initial load, and auto-dismiss after 3 seconds
      if (!isInitialLoad) {
        setError("AI generation partially failed. Using deterministic fallbacks.");
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  const handleOpenGreenReport = async () => {
    setIsGreenModalOpen(true);
    if (!greenReport) {
      setGreenLoading(true);
      try {
        const report = await generateSustainabilityReport(config);
        setGreenReport(report);
      } catch (err) {
        console.error("Failed to generate green report", err);
        // Use fallback data silently - no error message for this
        setGreenReport(getDefaultSustainabilityReport());
      } finally {
        setGreenLoading(false);
      }
    }
  };

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const exportReportPDF = () => {
    if (!estimation) return;
    
    try {
      const doc = new jsPDF();
      const margin = 15;
      let y = margin;
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxY = pageHeight - 20;

      // Header
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246);
      doc.text("BUILDWISE AI - PROJECT ANALYSIS", margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
      y += 15;

      // Project Info
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Project Configuration", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(`Area: ${config.builtUpArea} sq ft | Floors: G+${config.floors-1} | Location: ${config.location}`, margin, y);
      y += 5;
      doc.text(`Bedrooms: ${config.bedrooms} | Bathrooms: ${config.bathrooms}`, margin, y);
      y += 15;

      // Costs
      doc.setFontSize(14);
      doc.text("Financial Estimate (INR)", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(`Total Estimated Cost: ${formatINR(estimation.totalCost)}`, margin, y);
      y += 5;
      doc.text(`Unit Rate: ${formatINR(estimation.costPerSqFt)} / sq ft`, margin, y);
      y += 15;

      // Materials
      doc.setFontSize(14);
      doc.text("Material Breakdown", margin, y);
      y += 8;
      doc.setFontSize(9);
      estimation.materials.slice(0, 8).forEach(m => {
        doc.text(`${m.name}: ${m.quantity} ${m.unit} - ${formatINR(m.cost)}`, margin, y);
        y += 5;
        if (y > maxY) {
          doc.addPage();
          y = margin;
        }
      });
      y += 10;

      // Green Report Section if available
      if (greenReport) {
        if (y > maxY - 30) {
          doc.addPage();
          y = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129);
        doc.text("Sustainability Report", margin, y);
        y += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`Sustainability Score: ${greenReport.score}%`, margin, y);
        y += 7;
        
        doc.text("Eco-Materials:", margin, y);
        y += 6;
        doc.setFontSize(9);
        greenReport.ecoMaterials.forEach(m => {
          doc.text(`• ${m}`, margin + 5, y);
          y += 5;
          if (y > maxY) {
            doc.addPage();
            y = margin;
          }
        });
        
        y += 5;
        doc.setFontSize(10);
        doc.text("Solar Recommendation:", margin, y);
        y += 6;
        doc.setFontSize(9);
        const solarLines = doc.splitTextToSize(greenReport.solarRecommendation, 180);
        solarLines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 5;
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Confidential analysis generated by BuildWise AI Smart Construction platform.", margin, pageHeight - 10);

      doc.save(`BuildWise_Report_${config.builtUpArea}sqft.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  useEffect(() => {
    handleRunAnalysis(config);
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-slate-50 selection:bg-blue-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">BuildWise <span className="text-blue-600">AI</span></h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Architectural Intelligence v3.0</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             <button 
               onClick={exportReportPDF}
               className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
             >
               <Download className="w-4 h-4" />
               <span>Download PDF</span>
             </button>
             <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
             <button 
               onClick={() => setIsContactModalOpen(true)}
               className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl active:scale-95 flex items-center space-x-2"
             >
               <Phone className="w-4 h-4" />
               <span>Contact Architect</span>
             </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-center text-amber-800 text-sm font-medium flex items-center justify-center space-x-2">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4"/></button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">
            <ConfigForm 
              config={config} 
              onAnalyze={handleRunAnalysis} 
              loading={loading} 
            />
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl shadow-blue-100 space-y-3">
             <div className="flex items-start space-x-3">
               <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
               <h4 className="text-xs font-bold uppercase tracking-widest text-blue-100">Structural Trust</h4>
             </div>
             <p className="text-sm leading-relaxed break-words font-medium">
               Estimations follow IS 456 codes and current market indexes.
             </p>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-wrap gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
            {[
              { id: 'dashboard', label: 'Estimates', icon: Calculator },
              { id: 'blueprint', label: 'Layout', icon: FileText },
              { id: 'timeline', label: 'Schedule', icon: Calendar },
              { id: 'insights', label: 'Strategy', icon: Lightbulb },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-lg shadow-blue-100' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="min-h-[70vh] relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-slate-50/50 backdrop-blur-sm z-10 rounded-3xl">
                 <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-lg font-bold text-slate-800">Updating Analysis...</p>
              </div>
            ) : null}

            <div className={`transition-all duration-500 ${loading ? 'opacity-20 blur-sm scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              {activeTab === 'dashboard' && estimation && <Dashboard estimation={estimation} />}
              {activeTab === 'blueprint' && layout && <Blueprint layout={layout} />}
              {activeTab === 'timeline' && timeline && timeline.length > 0 && <Timeline timeline={timeline} />}
              {activeTab === 'insights' && insights && insights.length > 0 && <Insights insights={insights} onOpenGreenReport={handleOpenGreenReport} />}
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
      
      <SustainabilityModal 
        report={greenReport} 
        onClose={() => setIsGreenModalOpen(false)} 
        loading={greenLoading} 
      />

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default App;
