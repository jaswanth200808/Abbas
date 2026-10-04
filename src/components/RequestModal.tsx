import React, { useState } from 'react';
import { X, Send, CheckCircle2, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RequestModal: React.FC = () => {
  const { 
    currentUser, 
    selectedItem, 
    preferredRequestType, 
    closeModal, 
    createRequest 
  } = useApp();

  if (!selectedItem) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const canBorrow = selectedItem.mode === 'borrow' || selectedItem.mode === 'both';
  const canRent = selectedItem.mode === 'rent' || selectedItem.mode === 'both';

  const [requestType, setRequestType] = useState<'borrow' | 'rent'>(
    preferredRequestType === 'borrow' && canBorrow ? 'borrow' : canRent ? 'rent' : 'borrow'
  );
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextWeekStr);
  const [message, setMessage] = useState(
    `Hi ${selectedItem.ownerName}, I need this item for my upcoming campus coursework. I'll take great care of it and return it on time!`
  );
  const [pickupNote, setPickupNote] = useState('Hostel Block Entrance / Library');

  // Calculate day difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyPrice = requestType === 'rent' ? selectedItem.rentPricePerDay : 0;
  const totalPrice = dailyPrice * diffDays;
  const securityDeposit = selectedItem.securityDeposit || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      itemId: selectedItem.id,
      type: requestType,
      startDate,
      endDate,
      message: `${message} (Preferred Handover: ${pickupNote})`,
      totalDays: diffDays,
      dailyPrice,
      totalPrice,
      securityDeposit
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white p-6 relative">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold mb-2">
            <span>✨ Campus Handover Request</span>
          </div>
          <h2 className="text-xl font-bold">Request to {requestType === 'borrow' ? 'Borrow' : 'Rent'}</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Send a direct request to {selectedItem.ownerName}. You'll be notified when they accept.
          </p>
        </div>

        {/* Item mini summary */}
        <div className="p-5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
          <img 
            src={selectedItem.images[0]} 
            alt={selectedItem.title} 
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{selectedItem.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{selectedItem.ownerName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-amber-600 font-semibold">★ {selectedItem.ownerRating}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{selectedItem.ownerTrustScore}% Trust</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">{selectedItem.location}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Request Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!canBorrow}
                onClick={() => setRequestType('borrow')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  requestType === 'borrow'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : canBorrow
                    ? 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>🎁 Borrow (Free)</span>
                  {requestType === 'borrow' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Peer goodwill sharing ₹0/day
                </div>
              </button>

              <button
                type="button"
                disabled={!canRent}
                onClick={() => setRequestType('rent')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  requestType === 'rent'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : canRent
                    ? 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>💰 Rent Item</span>
                  {requestType === 'rent' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ₹{selectedItem.rentPricePerDay}/day rental fee
                </div>
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                min={todayStr}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all outline-hidden text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all outline-hidden text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Handover note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Handover Pickup Spot
            </label>
            <input
              type="text"
              value={pickupNote}
              onChange={(e) => setPickupNote(e.target.value)}
              placeholder="e.g. Hostel Block Entrance / Library Table / Campus Canteen"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Pricing & Duration summary calculation */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Rental Duration</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{diffDays} day(s)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Rate per day</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{requestType === 'borrow' ? 'Free (₹0)' : `₹${dailyPrice}/day`}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {securityDeposit > 0 ? `₹${securityDeposit} (returned on safe handover)` : '₹0 (None)'}
              </span>
            </div>
            <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800 flex items-center justify-between font-bold text-sm text-indigo-950 dark:text-indigo-200">
              <span>Total Estimated Cost</span>
              <span className="text-base text-indigo-600 dark:text-indigo-400 font-mono">
                {requestType === 'borrow' ? '₹0 (Free Sharing)' : `₹${totalPrice}`}
              </span>
            </div>
          </div>

          {/* Requester Identity preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>Requesting as {currentUser.name}</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded-full">
                  Trust: {currentUser.trustScore}/100
                </span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">{currentUser.department} • {currentUser.studentId}</div>
            </div>
          </div>

          {/* Message to Owner */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message to Owner ({selectedItem.ownerName})
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-850 transition-all outline-hidden resize-none text-slate-800 dark:text-slate-100"
              placeholder="Explain why you need the item, when you can pick it up..."
            />
          </div>

          {/* Submit button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Request to Owner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
