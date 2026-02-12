
import React, { useState, useEffect, useRef } from 'react';
import { startAIChat } from '../services/gemini';
import { MessageSquare, X, Mic, Send, Volume2, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am BuildWise AI. I can explain cost breakdowns or suggest optimizations in plain text. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        chatRef.current = await startAIChat();
        setApiReady(true);
      } catch (err) {
        console.error("Chat initialization failed", err);
        setApiReady(false);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: 'Note: API key not configured. Using local responses. Please update .env.local with your Gemini API key for full functionality.' 
        }]);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      // Always try API first if ready
      if (apiReady && chatRef.current) {
        try {
          const result = await chatRef.current.sendMessage({ message: text });
          let reply = result.text || 'I apologize, I could not process that.';
          
          // Sanitizing any leftover markdown symbols if they appear (defensive)
          reply = reply.replace(/[#*`_~]/g, '');

          setMessages(prev => [...prev, { role: 'model', text: reply }]);
          
          if (reply.length < 300) {
            speak(reply);
          }
          return;
        } catch (apiErr) {
          console.error("API call failed, using fallback:", apiErr);
          // Fall through to fallback responses
        }
      }
      
      // Fallback response when API is not ready or failed
      const lowerText = text.toLowerCase();
      let reply = '';

      // Cost-related questions
      if (lowerText.includes('cost') || lowerText.includes('price') || lowerText.includes('budget') || lowerText.includes('rupee') || lowerText.includes('inr') || lowerText.includes('₹') || lowerText.includes('expense') || lowerText.includes('bill') || lowerText.includes('rate')) {
        if (lowerText.includes('1250') || lowerText.includes('bhk') || lowerText.includes('bedroom')) {
          reply = 'For a 2 BHK house of 1250 sq ft: Estimated total cost is ₹25-35 lakhs depending on location. Breakdown: Materials ₹11-16 lakhs (45%), Labor ₹7.5-10.5 lakhs (30%), Overhead ₹3.75-5.25 lakhs (15%), Contingency ₹2.5-3.5 lakhs (10%). Urban areas cost 30-40% more. Check the Estimates tab to see detailed material-wise breakdown and adjust for your location.';
        } else {
          reply = 'Cost breakdown includes: Materials (45%), Labor (30%), Overhead (15%), and Contingency (10%). For a 1250 sq ft house, expect ₹25-35 lakhs. Location affects costs significantly - urban areas cost 30-40% more than semi-urban. Enter your details in the left panel to get exact estimates and see the detailed cost breakdown in the Estimates tab.';
        }
      } 
      // Planning/Building questions
      else if (lowerText.includes('plan') || lowerText.includes('build') || lowerText.includes('construction') || lowerText.includes('project') || lowerText.includes('bhk') || lowerText.includes('bedroom')) {
        if (lowerText.includes('2 bhk') || lowerText.includes('two bhk')) {
          reply = 'For a 2 BHK construction plan: Typical layout includes living room (30x18 ft), kitchen (20x15 ft), master bedroom (18x15 ft), second bedroom (15x12 ft), 2 bathrooms, and balcony. Total built-up area: 1200-1300 sq ft. Timeline: 4-6 months. See the Layout tab for a detailed room arrangement and Schedule tab for week-by-week construction phases.';
        } else {
          reply = 'Construction plan steps: 1) Foundation & Excavation (2 weeks), 2) Structural Work (4 weeks), 3) Flooring & Masonry (3 weeks), 4) MEP Installation (2 weeks), 5) Finishing (2-3 weeks). Enter your specifications (area, floors, bedrooms) in the left panel to get a customized plan. Check the Schedule tab for detailed timeline and Layout tab for room arrangement.';
        }
      }
      // Timeline/Duration questions
      else if (lowerText.includes('time') || lowerText.includes('timeline') || lowerText.includes('schedule') || lowerText.includes('duration') || lowerText.includes('how long') || lowerText.includes('month') || lowerText.includes('week')) {
        reply = 'A typical residential project takes 4-6 months. Breakdown: Foundation (2 weeks), Structural work (4 weeks), MEP installation (2 weeks), Finishing (2-3 weeks). Parallel tasks can reduce duration by 15%. Check the Schedule tab for a detailed week-by-week breakdown with specific tasks and resource requirements.';
      }
      // Material questions
      else if (lowerText.includes('material') || lowerText.includes('brick') || lowerText.includes('cement') || lowerText.includes('steel') || lowerText.includes('sand') || lowerText.includes('paint') || lowerText.includes('quality')) {
        reply = 'Common materials: Concrete, steel reinforcement, bricks, cement, sand, aggregate, and finish materials (paint, tiles, etc.). Materials typically cost 40-50% of total budget. The Dashboard shows exact quantities needed. Green alternatives available: fly ash bricks, recycled steel, low-VOC paints. See the Sustainability report for eco-friendly options that reduce costs by 10-15%.';
      }
      // Labor/Worker questions
      else if (lowerText.includes('labor') || lowerText.includes('worker') || lowerText.includes('employee') || lowerText.includes('person') || lowerText.includes('skill') || lowerText.includes('manpower')) {
        reply = 'For 1250 sq ft house: ~20-25 skilled and unskilled workers needed. Labor cost: 25-35% of total budget (₹6-12 lakhs). Includes masons, electricians, plumbers, carpenters. Typical wage: ₹500-1200/day per worker. The Timeline tab shows crew scheduling and daily requirements. Plan advance booking to avoid delays.';
      }
      // Green/Sustainability questions
      else if (lowerText.includes('green') || lowerText.includes('eco') || lowerText.includes('sustainable') || lowerText.includes('solar') || lowerText.includes('water') || lowerText.includes('environment') || lowerText.includes('carbon')) {
        reply = 'Green building recommendations: Solar panels (8-10 kW saves ₹50k+/year), rainwater harvesting (50k liters capacity), LED lighting (40% energy saving), double-glazed windows, eco-materials (fly ash bricks, recycled steel). Estimated additional cost: 5-8%. Carbon footprint reduction: 40-50%. Click the green button to open the full Sustainability report with detailed recommendations.';
      }
      // Cost Reduction/Optimization
      else if (lowerText.includes('reduce') || lowerText.includes('optimize') || lowerText.includes('save') || lowerText.includes('cheap') || lowerText.includes('budget') || lowerText.includes('less')) {
        reply = 'Cost reduction strategies: 1) Bulk material purchases (5-10% savings), 2) Parallel construction phases (15% time reduction), 3) Local labor (20% cheaper), 4) Simple design (fewer rooms), 5) Phased construction. Typical savings: ₹2-5 lakhs. Check Strategy tab for AI insights specific to your project parameters.';
      }
      // Location questions
      else if (lowerText.includes('location') || lowerText.includes('area') || lowerText.includes('region') || lowerText.includes('city') || lowerText.includes('place') || lowerText.includes('urban') || lowerText.includes('rural')) {
        reply = 'Location impact: Urban areas cost 30-40% more than semi-urban. Labor rates vary: ₹500-700 in rural, ₹800-1200 in urban. Material availability affects timeline. Try different locations in the Location dropdown (left panel) to see updated cost estimates. Tax/regulatory costs also vary by location - urban areas add 15-20% overhead.';
      }
      // Floor/Structure questions
      else if (lowerText.includes('floor') || lowerText.includes('storey') || lowerText.includes('level') || lowerText.includes('ground') || lowerText.includes('structure')) {
        reply = 'For typical 2-floor house (G+1): Ground floor (1250 sq ft) + First floor (800-1000 sq ft). Total: 2000-2250 sq ft. Multi-floor adds 20-30% cost. Foundation must support additional load - increases excavation cost. See Layout tab for room arrangement. Adjust Floors parameter in the left panel to see updated estimates and timeline.';
      }
      // Size/Area questions
      else if (lowerText.includes('size') || lowerText.includes('square') || lowerText.includes('sqft') || lowerText.includes('1250') || lowerText.includes('area')) {
        reply = 'For 1250 sq ft house: Optimal for 2-3 bedrooms. Typical room breakdown: Living (350 sq ft), Kitchen (200 sq ft), Master Bedroom (180 sq ft), Bedroom 2 (120 sq ft), 2 Bathrooms (120 sq ft), Balcony (100 sq ft). Adjust the "Built-up Area" parameter (left panel) to see cost changes. Larger homes cost proportionally less per sq ft due to economies of scale.';
      }
      // Bathroom/Kitchen questions
      else if (lowerText.includes('bathroom') || lowerText.includes('kitchen') || lowerText.includes('bedroom') || lowerText.includes('living') || lowerText.includes('room')) {
        reply = 'Room costs: Kitchen (₹80-120k), Bathroom (₹40-60k each), Bedroom (₹150-250k), Living room (₹200-350k). Higher costs for premium finishes. Standard specifications shown in Layout tab. You can customize room count via parameters on the left - more bedrooms increase cost but reduce per-sq-ft rate.';
      }
      // Default response
      else {
        reply = 'I am BuildWise AI Assistant. I can help with: Cost estimation (pricing in rupees), Timeline planning (construction schedule), Material selection (types and quantities), Labor planning (workforce needs), Sustainability (green building), Room planning (BHK configuration), Location impact, and Cost optimization. What would you like to know?';
      }

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      speak(reply);
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'I encountered an unexpected error. Please try asking about costs, timeline, materials, or sustainability features.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.start();
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-90"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[380px] sm:w-[420px] h-[600px] rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">BuildWise Assistant</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-auto p-5 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm font-medium'
                }`}>
                  {msg.text}
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => speak(msg.text)} 
                      className="mt-3 block opacity-40 hover:opacity-100 transition-opacity"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">ANALYZING...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <button 
                onClick={startListening}
                className={`p-3 rounded-xl transition-all ${isListening ? 'bg-rose-100 text-rose-600 ring-4 ring-rose-50' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="How to reduce cost?"
                className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              />
              <button 
                onClick={() => handleSend(input)}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
