import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { openHowItWorksModal, resetDemoData, items } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Impact Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-slate-800/80 last:border-none">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1,248+</div>
              <div className="text-xs text-indigo-300 font-medium mt-1">Items Reused & Kept Active</div>
            </div>
            <div className="border-r border-slate-800/80 last:border-none">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">856</div>
              <div className="text-xs text-purple-300 font-medium mt-1">Students Helped on Campus</div>
            </div>
            <div className="border-r border-slate-800/80 last:border-none">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">₹2.4L+</div>
              <div className="text-xs text-emerald-300 font-medium mt-1">Student Money Saved</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">420 kg</div>
              <div className="text-xs text-amber-300 font-medium mt-1">Waste & E-Waste Prevented</div>
            </div>
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                R&R
              </div>
              <span className="text-lg font-black text-white tracking-tight">RENT & REUSE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Need it? Don't buy it. Rent it. Borrow it. Reuse it.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The peer-to-peer campus sharing platform designed for engineering, medical, and collegiate students to borrow drafters, lab coats, books, tools, and electronics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Campus Students</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Browse All Items ({items.length})
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-requests')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  My Requests & Rentals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-listings')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  My Shared Listings
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('messages')} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Campus Messages
                </button>
              </li>
              <li>
                <button onClick={openHowItWorksModal} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" />
                  How the 4 Steps Work
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition-colors cursor-pointer">
                  Mini-Drafters & Engineering Kits
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition-colors cursor-pointer">
                  Scientific Calculators & Tech
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition-colors cursor-pointer">
                  Lab Coats & Safety Goggles
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition-colors cursor-pointer">
                  Engineering & Science Books
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-white transition-colors cursor-pointer">
                  Campus Bicycles & Sports Gear
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Safety info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Trust & Safety</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every member is linked with their official college ID card & email. Trust scores are dynamically updated based on prompt returns, item care, and mutual ratings.
            </p>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-xs">
              <div className="text-indigo-300 font-semibold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Security Deposit Protection
              </div>
              <p className="text-[11px] text-slate-400">
                Owners can set refundable security deposits for high-value equipment.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 RENT & REUSE. Dedicated college community sharing platform.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={resetDemoData}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo State
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-indigo-400">Active Peer Sharing Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
