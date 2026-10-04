import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  Calendar, 
  Star 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RentalRequest, RequestStatus } from '../types';

interface MyRequestsPageProps {
  setActiveTab: (tab: string) => void;
}

export const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ setActiveTab }) => {
  const { 
    currentUser, 
    requests, 
    updateRequestStatus, 
    markReturned, 
    openReviewModal, 
    openOwnerProfileModal,
    sendMessage 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Requests made by the current user
  const myRequests = requests.filter(r => r.requesterId === currentUser.id);

  const filtered = myRequests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Pending Owner Review',
          icon: Clock
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Accepted! Ready for Handover',
          icon: CheckCircle
        };
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Active Borrow / Rental',
          icon: CheckCircle
        };
      case 'COMPLETED':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          label: 'Returned & Completed',
          icon: RotateCcw
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Declined by Owner',
          icon: XCircle
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: status,
          icon: Clock
        };
    }
  };

  const handleMessageOwner = (req: RentalRequest) => {
    sendMessage(
      req.ownerId,
      req.ownerName,
      `Hi ${req.ownerName}! Following up on my request for "${req.itemTitle}".`,
      req.itemId,
      req.itemTitle
    );
    setActiveTab('messages');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
            Borrower Dashboard
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            My Requests & Rentals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your outgoing requests, arrange handovers with item owners, and return borrowed items.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('browse')}
          className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
        >
          Find More Items
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'PENDING', label: 'Pending' },
          { id: 'ACCEPTED', label: 'Accepted' },
          { id: 'ACTIVE', label: 'Active Rentals' },
          { id: 'COMPLETED', label: 'Completed' },
          { id: 'REJECTED', label: 'Declined' }
        ].map(tab => {
          const count = tab.id === 'all' 
            ? myRequests.length 
            : myRequests.filter(r => r.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                filterStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-slate-800">No requests in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't requested any items with this status. Browse items available around your campus and request to borrow or rent!
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Browse Campus Items
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const statusConfig = getStatusBadge(req.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div 
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
              >
                
                {/* Top status bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${statusConfig.bg}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusConfig.label}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Requested on {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-600">
                    ID: #{req.id.slice(-6)}
                  </div>
                </div>

                {/* Item Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  
                  {/* Photo & Name */}
                  <div className="sm:col-span-2 flex items-center gap-3.5">
                    <img 
                      src={req.itemImage} 
                      alt={req.itemTitle} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {req.itemTitle}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>
                          Owner:{' '}
                          <button
                            type="button"
                            onClick={() => openOwnerProfileModal(req.ownerId)}
                            className="font-bold text-slate-800 hover:text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                            title="Click to view Owner Profile"
                          >
                            <span>{req.ownerName}</span>
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1 rounded ml-1 font-semibold">Profile</span>
                          </button>
                        </span>
                        <span>•</span>
                        <span className="capitalize text-indigo-600 font-semibold">{req.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates & Duration */}
                  <div className="text-xs space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Duration & Dates
                    </div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{req.startDate} → {req.endDate}</span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      {req.totalDays} day(s) duration
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="text-xs space-y-1 sm:text-right">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Payment / Sharing
                    </div>
                    <div className="text-sm font-black text-slate-900 font-mono">
                      {req.type === 'borrow' ? (
                        <span className="text-emerald-600">FREE BORROW</span>
                      ) : (
                        `₹${req.totalPrice} (₹${req.dailyPrice}/day)`
                      )}
                    </div>
                    {req.securityDeposit > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Refundable Deposit: ₹{req.securityDeposit}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message preview */}
                {req.message && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Your Note: </span>
                    "{req.message}"
                  </div>
                )}

                {/* Action Buttons depending on status */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => handleMessageOwner(req)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Message {req.ownerName}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* If ACCEPTED: Requester can confirm physical pickup and mark ACTIVE */}
                    {req.status === 'ACCEPTED' && (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'ACTIVE')}
                        className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirm Handover (Start Rental)</span>
                      </button>
                    )}

                    {/* If ACTIVE: Requester can mark returned */}
                    {req.status === 'ACTIVE' && (
                      <button
                        onClick={() => markReturned(req.id)}
                        className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return Item & Review</span>
                      </button>
                    )}

                    {/* If COMPLETED: Allow review */}
                    {req.status === 'COMPLETED' && (
                      <button
                        onClick={() => openReviewModal(req)}
                        className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>{req.borrowerReviewed ? 'Update Review' : 'Leave Review'}</span>
                      </button>
                    )}

                    {/* If PENDING: allow cancel */}
                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'CANCELLED')}
                        className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
