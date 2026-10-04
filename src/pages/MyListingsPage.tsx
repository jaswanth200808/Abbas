import React, { useState } from 'react';
import { 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  Eye, 
  Trash2, 
  Inbox, 
  Phone, 
  Edit3, 
  Camera 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RentalRequest } from '../types';

interface MyListingsPageProps {
  setActiveTab: (tab: string) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({ setActiveTab }) => {
  const { 
    currentUser, 
    items, 
    requests, 
    updateRequestStatus, 
    markReturned,
    toggleItemAvailability, 
    deleteItem, 
    openPostItemModal, 
    openDetailModal,
    openEditItemModal,
    openReviewModal,
    openOwnerProfileModal,
    sendMessage 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'listings'>('requests');

  // Items owned by currentUser
  const myItems = items.filter(it => it.ownerId === currentUser.id);

  // Incoming requests for currentUser's items
  const incomingRequests = requests.filter(r => r.ownerId === currentUser.id);
  const pendingRequests = incomingRequests.filter(r => r.status === 'PENDING');

  const handleMessageRequester = (req: RentalRequest) => {
    sendMessage(
      req.requesterId,
      req.requesterName,
      `Hi ${req.requesterName}! Regarding your request for "${req.itemTitle}"...`,
      req.itemId,
      req.itemTitle
    );
    setActiveTab('messages');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
            Owner Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            My Listings & Incoming Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accept or reject borrower requests, manage gear availability, and arrange campus handovers.
          </p>
        </div>

        <button
          onClick={openPostItemModal}
          className="self-start sm:self-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Another Item</span>
        </button>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'requests'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Student Requests</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            pendingRequests.length > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
          }`}>
            {incomingRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('listings')}
          className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'listings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Shared Items</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
            {myItems.length}
          </span>
        </button>
      </div>

      {/* SECTION A: INCOMING REQUESTS (OWNER APPROVAL) */}
      {activeSubTab === 'requests' && (
        <div className="space-y-6">
          {/* Helpful alert if pending requests exist */}
          {pendingRequests.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <span className="font-bold">You have {pendingRequests.length} pending request(s) awaiting your response.</span>
                <p className="text-amber-800 mt-0.5">Accept to let the student pick up the item on campus, or reject if unavailable.</p>
              </div>
            </div>
          )}

          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                📬
              </div>
              <h3 className="text-lg font-bold text-slate-800">No incoming requests yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When students on campus request to borrow or rent your items, their requests with Trust Scores will appear here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map(req => {
                const isPending = req.status === 'PENDING';
                const isAccepted = req.status === 'ACCEPTED';
                const isActive = req.status === 'ACTIVE';
                const isCompleted = req.status === 'COMPLETED';

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                      isPending 
                        ? 'border-amber-300 ring-2 ring-amber-500/15 shadow-md' 
                        : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          isPending 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : isAccepted 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isCompleted
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {req.status === 'PENDING' ? '⏳ Needs Your Approval' : req.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Received {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-indigo-700 font-mono">
                        {req.type === 'borrow' ? 'Free Borrow Request' : `Rental: ₹${req.totalPrice}`}
                      </div>
                    </div>

                    {/* Requester & Item Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Requester Profile with Trust Score */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Requester Details
                          </span>
                          <button
                            type="button"
                            onClick={() => openOwnerProfileModal(req.requesterId)}
                            className="text-[10px] text-indigo-600 hover:underline font-semibold"
                          >
                            View Full Profile →
                          </button>
                        </div>
                        <div 
                          onClick={() => openOwnerProfileModal(req.requesterId)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <img 
                            src={req.requesterAvatar} 
                            alt={req.requesterName} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-indigo-500 transition-all" 
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                              <span>{req.requesterName}</span>
                              <span title="Verified Campus Student">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{req.requesterCampus}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="font-bold text-amber-500">★ {req.requesterRating}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
                            {req.requesterTrustScore}/100 Trust Score
                          </span>
                        </div>
                      </div>

                      {/* Item requested & dates */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Requested Item & Schedule
                        </div>
                        <div className="flex items-center gap-3">
                          <img 
                            src={req.itemImage} 
                            alt={req.itemTitle} 
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{req.itemTitle}</h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {req.startDate} to {req.endDate} ({req.totalDays} days)
                            </div>
                          </div>
                        </div>
                        {req.securityDeposit > 0 && (
                          <div className="text-[11px] text-slate-600">
                            Refundable Deposit: <strong className="text-slate-800">₹{req.securityDeposit}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requester's message */}
                    {req.message && (
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700">
                        <span className="font-bold text-indigo-900">Message from {req.requesterName}: </span>
                        "{req.message}"
                      </div>
                    )}

                    {/* Owner Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                      <button
                        onClick={() => handleMessageRequester(req)}
                        className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Chat with {req.requesterName.split(' ')[0]}</span>
                      </button>

                      {/* Decision buttons */}
                      <div className="flex items-center gap-2">
                        {isPending && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'REJECTED', 'Item currently reserved for coursework')}
                              className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'ACCEPTED')}
                              className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accept Request</span>
                            </button>
                          </>
                        )}
                        {isAccepted && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'ACTIVE')}
                            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Handed Over (Active)</span>
                          </button>
                        )}
                        {isActive && (
                          <button
                            onClick={() => markReturned(req.id)}
                            className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Confirm Return & Review</span>
                          </button>
                        )}
                        {isCompleted && (
                          <button
                            onClick={() => openReviewModal(req)}
                            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>{req.ownerReviewed ? 'Update Review' : 'Review Borrower'}</span>
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
      )}

      {/* SECTION B: MY POSTED ITEMS */}
      {activeSubTab === 'listings' && (
        <div className="space-y-4">
          {myItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                📦
              </div>
              <h3 className="text-lg font-bold text-slate-800">You haven't listed any items</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Do you have a drafter from last semester, a lab coat, or a calculator? Give it a second life and help other students!
              </p>
              <button
                onClick={openPostItemModal}
                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                + Post an Item Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myItems.map(item => {
                const reqCount = requests.filter(r => r.itemId === item.id).length;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item info */}
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => openEditItemModal(item)}
                        className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer shadow-xs"
                        title="Click to change item picture"
                      >
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] font-bold transition-opacity">
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>Change</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => openEditItemModal(item)}
                            className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            {item.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.isAvailable 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="capitalize">{item.category}</span>
                          <span>•</span>
                          <span>{item.condition}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-800">
                            {item.mode === 'borrow' ? 'Free Borrow' : `₹${item.rentPricePerDay}/day`}
                          </span>
                          {item.ownerPhone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-600 font-mono">
                                <Phone className="w-3 h-3 text-indigo-500" />
                                {item.ownerPhone}
                              </span>
                            </>
                          )}
                          {item.backupPhone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold" title={`Backup Contact: ${item.backupPhoneLabel || 'Alternate'}`}>
                                <Phone className="w-2.5 h-2.5 text-amber-600" />
                                <span>Backup: {item.backupPhone}</span>
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {reqCount} student request(s) received • {item.views} campus views
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Edit item picture, price and details"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Edit & Change Picture</span>
                      </button>
                      <button
                        onClick={() => openDetailModal(item)}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                          item.isAvailable
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                      <button
                        onClick={() => {
                          setActiveSubTab('requests');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
                      >
                        Requests ({reqCount})
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
