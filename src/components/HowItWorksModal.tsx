import React from 'react';
import { X, Search, Send, MessageSquare, RotateCcw, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksModal: React.FC = () => {
  const { closeModal } = useApp();

  const steps = [
    {
      step: '01',
      title: 'FIND',
      subtitle: 'Search & Browse',
      desc: 'Search for drawing drafters, calculators, textbooks, lab coats, or cycles. Filter by category, location, and free borrow vs affordable rental.',
      icon: Search,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      step: '02',
      title: 'REQUEST',
      subtitle: 'Choose Borrow or Rent',
      desc: 'Pick your duration, write a brief note with pickup spot, review refundable deposits, and send the request. Initial status is PENDING.',
      icon: Send,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      step: '03',
      title: 'CONNECT',
      subtitle: 'Arrange Safe Handover',
      desc: 'Owner reviews your Trust Score and accepts. Use in-app messaging to meet at hostel lobbies, library, or campus blocks for physical exchange.',
      icon: MessageSquare,
      color: 'from-purple-600 to-pink-600'
    },
    {
      step: '04',
      title: 'RETURN & REUSE',
      subtitle: 'Mutual Review & Circular Life',
      desc: 'Once done with your exam or semester, return the gear in original shape. Both students leave reviews to boost Trust Scores, and the item stays reusable!',
      icon: RotateCcw,
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 text-white p-6 relative">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-200 text-xs font-semibold mb-2">
            <span>✨ Campus Lifecycle Flow</span>
          </div>
          <h2 className="text-2xl font-black">How RENT & REUSE Works</h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-lg">
            A complete circle solving student resource waste: connecting those who need items temporarily with students holding unused gear.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors relative"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                      {item.step} • {item.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Hackathon Flowchart Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
            <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Full Problem-Solving Flow Demonstrated</span>
            </div>
            <p className="text-indigo-900/80 dark:text-indigo-300 leading-relaxed text-[11px]">
              Need Item → Search & Browse → Request (Borrow/Rent) → Owner Accepts → In-app Message Handover → Return Item → Leave Mutual Review → Ready for Next Student.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={closeModal}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
};
