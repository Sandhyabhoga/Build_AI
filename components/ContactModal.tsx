
import React from 'react';
import { X, Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Inquire Architect</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-blue-600 p-3 rounded-xl text-white">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Call Now</h4>
                <p className="text-sm font-bold text-slate-800">+91 1800-ARCH-BUILD</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-indigo-600 p-3 rounded-xl text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Email Support</h4>
                <p className="text-sm font-bold text-slate-800">projects@buildwise.ai</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-emerald-600 p-3 rounded-xl text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Headquarters</h4>
                <p className="text-sm font-bold text-slate-800">Cyber City, Gurugram, India</p>
              </div>
            </div>
          </div>

          <form className="space-y-4 pt-4 border-t border-slate-100" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); onClose(); }}>
            <div>
              <input 
                type="text" 
                placeholder="Your Full Name" 
                required 
                className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
