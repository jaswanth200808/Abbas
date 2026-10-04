import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportModal: React.FC = () => {
  const { selectedItem, closeModal, reportIssue } = useApp();
  const [category, setCategory] = useState('Damaged or Inoperable');
  const [comment, setComment] = useState('');

  if (!selectedItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportIssue(selectedItem.id, category, comment);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-rose-600 text-white p-6 relative">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-rose-200 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Safety Flag</span>
          </div>
          <h2 className="text-xl font-bold">Report an Issue</h2>
          <p className="text-xs text-rose-100 mt-1">
            Report misleading listings, damaged items, or non-responsive peers for "{selectedItem.title}".
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden text-slate-800 dark:text-slate-100"
            >
              <option value="Damaged or Inoperable">Item is Damaged or Inoperable</option>
              <option value="Misleading Description">Misleading Description or Wrong Photos</option>
              <option value="Unresponsive Owner">Owner Not Responding for Handover</option>
              <option value="Unfair Pricing or Deposit">Excessive Deposit / Pricing Dispute</option>
              <option value="Other Policy Violation">Other Campus Code Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Details for Campus Proctor / Admin
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-hidden resize-none text-slate-800 dark:text-slate-100"
              placeholder="Describe what occurred during the exchange or why this item shouldn't be listed..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
