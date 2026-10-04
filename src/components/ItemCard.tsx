import React from 'react';
import { Clock, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import { Item } from '../types';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: Item;
  onOpenDetails?: (item: Item) => void;
  onOpenRequest?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onOpenDetails, onOpenRequest }) => {
  const { currentUser, openDetailModal, openRequestModal, openOwnerProfileModal } = useApp();
  const isOwner = currentUser.id === item.ownerId;

  const handleDetails = () => {
    if (onOpenDetails) onOpenDetails(item);
    else openDetailModal(item);
  };

  const handleRequest = () => {
    if (onOpenRequest) onOpenRequest(item);
    else openRequestModal(item);
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Excellent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Good':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'study':
        return { label: 'Study & Eng', icon: '📐' };
      case 'books':
        return { label: 'Books', icon: '📚' };
      case 'electronics':
        return { label: 'Electronics', icon: '💻' };
      case 'sports':
        return { label: 'Sports', icon: '🏏' };
      case 'tools':
        return { label: 'Tools', icon: '🔧' };
      case 'transport':
        return { label: 'Transport', icon: '🚲' };
      case 'lab':
        return { label: 'Lab Equipment', icon: '🔬' };
      default:
        return { label: 'Other', icon: '✨' };
    }
  };

  const catBadge = getCategoryBadge(item.category);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <span>{catBadge.icon}</span>
            <span>{catBadge.label}</span>
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>
        </div>

        {/* Urgent Today / Free Borrow Chip */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {item.urgentToday && (
            <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md animate-pulse">
              ⚡ Need Today
            </span>
          )}
          {item.freeToBorrow && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md">
              Free to Borrow
            </span>
          )}
        </div>

        {/* Bottom price tag on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
            {item.mode === 'borrow' || item.rentPricePerDay === 0 ? (
              <span className="text-emerald-400 font-extrabold text-sm">FREE BORROW</span>
            ) : item.mode === 'both' ? (
              <div>
                <span className="text-white font-extrabold text-sm">₹{item.rentPricePerDay}</span>
                <span className="text-slate-300 text-[11px]">/day</span>
                <span className="text-emerald-300 text-[10px] ml-1.5 font-semibold">| or Borrow</span>
              </div>
            ) : (
              <div>
                <span className="text-white font-extrabold text-sm">₹{item.rentPricePerDay}</span>
                <span className="text-slate-300 text-[11px]">/day</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-slate-200">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{item.isAvailable ? 'Available Now' : 'Currently in Use'}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={handleDetails}
            className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer leading-snug"
          >
            {item.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Location & Deposit info */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 truncate max-w-[55%]">
              <span className="text-indigo-500 shrink-0">📍</span>
              <span className="truncate">{item.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {item.ownerPhone && (
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Direct Phone/WhatsApp Available">
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call/WA</span>
                </span>
              )}
              {item.securityDeposit > 0 ? (
                <div className="text-[11px] text-slate-400 font-medium shrink-0">
                  Deposit: <span className="text-slate-700 dark:text-slate-300 font-semibold">₹{item.securityDeposit}</span>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                  No Deposit
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Owner profile & Action buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Owner row */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => openOwnerProfileModal(item)}
              className="flex items-center gap-2 cursor-pointer group/owner"
              title="Click to view Owner Profile & other items"
            >
              <img
                src={item.ownerAvatar}
                alt={item.ownerName}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover/owner:ring-2 group-hover/owner:ring-indigo-500 transition-all"
              />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 leading-none group-hover/owner:text-indigo-600 dark:group-hover/owner:text-indigo-400 transition-colors">
                  <span>{item.ownerName}</span>
                  {isOwner && (
                    <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1 py-0.2 rounded font-bold">You</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetailModal(item);
                    }}
                    className="text-amber-500 hover:text-amber-600 font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                    title="Click to see reviews or leave a rating"
                  >
                    <span>★ {item.ownerRating}</span>
                    <span className="text-slate-400 font-normal">({item.reviews.length})</span>
                  </button>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {item.ownerTrustScore}% Trust
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDetails}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDetails}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              View Details
            </button>
            {isOwner ? (
              <button
                onClick={handleDetails}
                className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Your Listing
              </button>
            ) : (
              <button
                onClick={handleRequest}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
