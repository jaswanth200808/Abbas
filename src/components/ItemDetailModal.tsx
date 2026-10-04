import React, { useState, useRef } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Clock, 
  Share2, 
  Phone, 
  User as UserIcon, 
  Edit3, 
  Camera, 
  Upload, 
  Save, 
  ThumbsUp, 
  QrCode,
  MessageSquare,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AVATAR_PRESETS = [
  { label: 'Campus Casual', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { label: 'Tech / Coder', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80' },
  { label: 'College Girl', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { label: 'Student Hoodie', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { label: 'Sports / Campus', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  { label: 'Senior / Scholar', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' }
];

interface ItemDetailModalProps {
  onNavigateToMessages?: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ onNavigateToMessages }) => {
  const { 
    selectedItem, 
    currentUser, 
    closeModal, 
    openRequestModal, 
    openReportModal, 
    openOwnerProfileModal,
    openEditItemModal,
    openScannerModal,
    addReview,
    updateCurrentUser,
    sendMessage,
    showToast 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [editOwnerName, setEditOwnerName] = useState(selectedItem?.ownerName || '');
  const [editOwnerAvatar, setEditOwnerAvatar] = useState(selectedItem?.ownerAvatar || '');
  const [editOwnerPhone, setEditOwnerPhone] = useState(selectedItem?.ownerPhone || '');
  const [editOwnerBackupPhone, setEditOwnerBackupPhone] = useState(selectedItem?.backupPhone || '');
  const [editOwnerBackupLabel, setEditOwnerBackupLabel] = useState(selectedItem?.backupPhoneLabel || '');

  // Review & Rating state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [hoverRatingVal, setHoverRatingVal] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRole, setReviewRole] = useState<'borrower' | 'owner'>('borrower');

  if (!selectedItem) return null;

  const isOwner = currentUser.id === selectedItem.ownerId;
  const canBorrow = selectedItem.mode === 'borrow' || selectedItem.mode === 'both';
  const canRent = selectedItem.mode === 'rent' || selectedItem.mode === 'both';

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please provide a brief comment with your rating.');
      return;
    }
    addReview({
      targetId: selectedItem.id,
      targetType: 'item',
      rating: ratingVal,
      comment: reviewComment.trim(),
      role: reviewRole
    });
    setIsWritingReview(false);
    setReviewComment('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size exceeds 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditOwnerAvatar(reader.result);
          showToast('New photo chosen! Click "Save Owner Details" to apply.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveOwnerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOwnerName.trim()) {
      showToast('Owner name cannot be empty.');
      return;
    }
    updateCurrentUser({
      name: editOwnerName.trim(),
      avatar: editOwnerAvatar,
      phone: editOwnerPhone.trim(),
      backupPhone: editOwnerBackupPhone.trim(),
      backupPhoneLabel: editOwnerBackupLabel.trim()
    });
    // Update active selectedItem in place for instant visual feedback
    selectedItem.ownerName = editOwnerName.trim();
    selectedItem.ownerAvatar = editOwnerAvatar;
    selectedItem.ownerPhone = editOwnerPhone.trim();
    selectedItem.backupPhone = editOwnerBackupPhone.trim();
    selectedItem.backupPhoneLabel = editOwnerBackupLabel.trim();
    setIsEditingOwner(false);
    showToast('Owner details and contact numbers updated!');
  };

  const handleContactOwner = () => {
    sendMessage(
      selectedItem.ownerId,
      selectedItem.ownerName,
      `Hi ${selectedItem.ownerName}, I'm interested in your "${selectedItem.title}". Is it still available to see/pick up?`,
      selectedItem.id,
      selectedItem.title
    );
    closeModal();
    if (onNavigateToMessages) {
      onNavigateToMessages();
    } else {
      showToast(`Conversation started with ${selectedItem.ownerName}! Check Messages tab.`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Item link copied to campus clipboard!');
    } else {
      showToast('Campus link ready to share!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
              Campus Item #{selectedItem.id.replace('item_', '')}
            </span>
            <span className="text-xs text-slate-500">• Posted {selectedItem.createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                type="button"
                onClick={() => openEditItemModal(selectedItem)}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Edit item picture, price and description"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Item & Photo</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200/60 transition-colors"
              title="Share Item"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Grid: Image & Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative group">
                <img 
                  src={selectedItem.images[0]} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                />
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => openEditItemModal(selectedItem)}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    title="Change this item's photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Picture</span>
                  </button>
                )}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedItem.isAvailable ? 'Available on Campus' : 'Currently Borrowed'}</span>
                </div>
              </div>

              {/* Quick Specs Pill Box */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Condition</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.condition}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Category</div>
                  <div className="font-bold text-slate-800 mt-0.5 capitalize">{selectedItem.category}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Security Deposit</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedItem.securityDeposit > 0 ? `₹${selectedItem.securityDeposit}` : 'No Deposit'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Available Until</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedItem.availableUntil}</div>
                </div>
              </div>
            </div>

            {/* Title, Pricing & Description */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedItem.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-700">{selectedItem.location}</span>
                  </div>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(true)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Click to give a rating for this item"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{selectedItem.ownerRating} ({selectedItem.reviews.length} reviews)</span>
                    <span className="text-[10px] text-amber-700 underline font-bold ml-1">+ Rate</span>
                  </button>
                </div>

                {/* Pricing Box */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 border border-indigo-100 space-y-2">
                  <div className="text-xs font-semibold text-indigo-900">Sharing Options:</div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {canBorrow && (
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <div className="text-xs font-black text-emerald-700">FREE BORROW</div>
                          <div className="text-[10px] text-slate-500">Goodwill peer sharing</div>
                        </div>
                      </div>
                    )}

                    {canRent && (
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <div>
                          <div className="text-xs font-black text-indigo-900">
                            ₹{selectedItem.rentPricePerDay} <span className="text-[11px] font-normal text-slate-500">/ day</span>
                          </div>
                          <div className="text-[10px] text-slate-500">Affordable student rent</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedItem.securityDeposit > 0 && (
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Fully refundable ₹{selectedItem.securityDeposit} security deposit held until return.</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    About this Item
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.contactPreference && (
                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800">Handover Preference: </span>
                    {selectedItem.contactPreference}
                  </div>
                )}
              </div>

              {/* Owner Trust Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div 
                    onClick={() => openOwnerProfileModal(selectedItem)}
                    className="flex items-center gap-3 cursor-pointer group"
                    title="Click to view full Owner Profile"
                  >
                    <img 
                      src={selectedItem.ownerAvatar} 
                      alt={selectedItem.ownerName} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs group-hover:ring-2 group-hover:ring-indigo-500 transition-all" 
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                        <span>{selectedItem.ownerName}</span>
                        <span title="Verified Campus Student">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        </span>
                        <span className="text-[10px] text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile →
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          ★ {selectedItem.ownerRating}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded text-[10px]">
                          {selectedItem.ownerTrustScore}% Trust
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => setIsEditingOwner(!isEditingOwner)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Edit My Owner Name & Photo"
                      >
                        <Edit3 className="w-4 h-4 text-indigo-600" />
                        <span>{isEditingOwner ? 'Cancel' : 'Edit Name & Photo'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => openOwnerProfileModal(selectedItem)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="View Owner Profile & Items"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      <span>Owner Profile</span>
                    </button>
                    {!isOwner && (
                      <>
                        {selectedItem.ownerPhone && (
                          <a
                            href={`tel:${selectedItem.ownerPhone.replace(/\s+/g, '')}`}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                            title={`Call Owner: ${selectedItem.ownerPhone}`}
                          >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">Call</span>
                          </a>
                        )}
                        <button
                          onClick={handleContactOwner}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="hidden sm:inline">Message</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Owner Profile Editor */}
                {isEditingOwner && (
                  <form onSubmit={handleSaveOwnerInfo} className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 mt-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-1 border-b border-indigo-100">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Edit Your Owner Identity</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Changes sync instantly</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <img src={editOwnerAvatar} alt="Owner Preview" className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-400 shrink-0" />
                      <div className="flex-1 space-y-1.5 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Picture</span>
                          </button>
                          <span className="text-[10px] text-slate-400">or pick avatar:</span>
                          {AVATAR_PRESETS.slice(0, 4).map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditOwnerAvatar(p.url)}
                              className="p-0.5 rounded-lg border border-slate-200 hover:border-indigo-600 transition-colors"
                            >
                              <img src={p.url} alt={p.label} className="w-5 h-5 rounded-md object-cover" />
                            </button>
                          ))}
                        </div>
                        <input
                          type="url"
                          value={editOwnerAvatar}
                          onChange={(e) => setEditOwnerAvatar(e.target.value)}
                          placeholder="Or paste photo URL..."
                          className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-0.5">Owner Name *</label>
                        <input
                          type="text"
                          required
                          value={editOwnerName}
                          onChange={(e) => setEditOwnerName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-0.5">Handover Mobile Number</label>
                        <input
                          type="tel"
                          value={editOwnerPhone}
                          onChange={(e) => setEditOwnerPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-0.5">Backup Mobile (Roommate/Friend)</label>
                        <input
                          type="tel"
                          value={editOwnerBackupPhone}
                          onChange={(e) => setEditOwnerBackupPhone(e.target.value)}
                          placeholder="+91 91234 56780"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-0.5">Backup Name & Role</label>
                        <input
                          type="text"
                          value={editOwnerBackupLabel}
                          onChange={(e) => setEditOwnerBackupLabel(e.target.value)}
                          placeholder="e.g. Roommate: Rohan"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingOwner(false)}
                        className="py-1 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save Owner Info</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Owner Direct Mobile Contact info */}
                {selectedItem.ownerPhone && (
                  <div className="pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="p-1 rounded-md bg-indigo-100/70 text-indigo-700">
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-semibold text-slate-700">Owner Mobile:</span>
                      <a 
                        href={`tel:${selectedItem.ownerPhone.replace(/\s+/g, '')}`}
                        className="font-mono font-bold text-slate-900 hover:text-indigo-600 hover:underline"
                      >
                        {selectedItem.ownerPhone}
                      </a>
                    </div>
                    <button
                      onClick={() => openOwnerProfileModal(selectedItem)}
                      className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <UserIcon className="w-3 h-3" />
                      <span>Full Student Profile</span>
                    </button>
                  </div>
                )}

                {/* Backup / Alternate Contact Number (When Owner is in Class / Lab / Busy) */}
                {selectedItem.backupPhone && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5 text-amber-950">
                      <span className="p-1.5 rounded-lg bg-amber-200 text-amber-900 shrink-0">
                        <Phone className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                          <span>Backup / Roommate Contact (If Owner in Class / Busy)</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-slate-700">{selectedItem.backupPhoneLabel || 'Backup Handover'}:</span>
                          <a 
                            href={`tel:${selectedItem.backupPhone.replace(/\s+/g, '')}`}
                            className="font-mono font-bold text-slate-900 hover:text-amber-700 hover:underline"
                          >
                            {selectedItem.backupPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                    {!isOwner && (
                      <a
                        href={`tel:${selectedItem.backupPhone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                        title={`Call Backup: ${selectedItem.backupPhone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Backup</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Return Receiver Person Info (When returning item from customer) */}
                {selectedItem.returnReceiverName && (
                  <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5 text-purple-950">
                      <span className="p-1.5 rounded-lg bg-purple-200 text-purple-950 shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                          Return Receiver Person (When Returning Item)
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 font-semibold text-slate-800">
                          <span>{selectedItem.returnReceiverName}</span>
                          {selectedItem.returnReceiverPhone && (
                            <a href={`tel:${selectedItem.returnReceiverPhone}`} className="font-mono text-purple-700 hover:underline">
                              ({selectedItem.returnReceiverPhone})
                            </a>
                          )}
                          {selectedItem.returnReceiverLocation && (
                            <span className="text-[11px] text-slate-500">• Location: {selectedItem.returnReceiverLocation}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Owner QR Scanner / UPI Payment Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openScannerModal({ item: selectedItem })}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-yellow-300" />
                    <span>⚡ View Owner QR Scanner / Pay Deposit & Rent</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Student Reviews ({selectedItem.reviews.length})</span>
                <span className="text-xs text-amber-500 font-normal">★ {selectedItem.ownerRating} average</span>
              </h3>
              {!isOwner && (
                <button
                  type="button"
                  onClick={() => setIsWritingReview(!isWritingReview)}
                  className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>{isWritingReview ? 'Close Rating Box' : '★ Rate & Review Item'}</span>
                </button>
              )}
            </div>

            {/* Interactive Rating & Review Form */}
            {isWritingReview && !isOwner && (
              <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-sm space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                    <span>Rate Your Experience with this Item & Owner</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Live Score Update
                  </span>
                </div>

                {/* Star rating selector */}
                <div className="text-center py-1">
                  <div className="text-[11px] font-bold uppercase text-slate-600 mb-1.5">
                    Select Rating (1 - 5 Stars)
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRatingVal(star)}
                        onMouseLeave={() => setHoverRatingVal(0)}
                        onClick={() => setRatingVal(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                      >
                        <Star 
                          className={`w-7 h-7 transition-colors ${
                            (hoverRatingVal || ratingVal) >= star 
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs' 
                              : 'text-slate-300 fill-slate-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-amber-900 mt-1">
                    {ratingVal === 5 && '🌟 Outstanding (5/5)! Pristine condition & fast handover'}
                    {ratingVal === 4 && '👍 Great (4/5)! Very good & recommended'}
                    {ratingVal === 3 && '👌 Good (3/5)! Standard campus sharing'}
                    {ratingVal === 2 && '⚠️ Fair (2/5)! Minor issues'}
                    {ratingVal === 1 && '👎 Poor (1/5)! Not as described'}
                  </div>
                </div>

                {/* Role / Relation */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700 text-[11px]">Your Role:</span>
                  <button
                    type="button"
                    onClick={() => setReviewRole('borrower')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      reviewRole === 'borrower'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    Student Borrower / User
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewRole('owner')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      reviewRole === 'owner'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    Classmate / Verified Peer
                  </button>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Your Review Feedback *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe item condition, battery life, calibration, or how helpful the owner was..."
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-hidden resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Submit Rating</span>
                  </button>
                </div>
              </form>
            )}

            {selectedItem.reviews.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No reviews yet. Be the first student to check this item and leave a rating!
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedItem.reviews.map(rev => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.authorAvatar} alt={rev.authorName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-slate-800">{rev.authorName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">({rev.role})</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        {'★'.repeat(rev.rating)}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 pl-8 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    {rev.image && (
                      <div className="pl-8 pt-1">
                        <img 
                          src={rev.image} 
                          alt="Returned item review photo" 
                          className="w-28 h-28 object-cover rounded-xl border border-slate-200 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(rev.image, '_blank')}
                          title="Click to view full photo"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust Guarantee & Report */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus ID verification & physical handover safeguard.</span>
            </div>
            <button
              onClick={() => openReportModal(selectedItem)}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={closeModal}
            className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            Back to Items
          </button>

          {isOwner ? (
            <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-200">
              You own this listed item
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleContactOwner}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-white text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Contact Owner</span>
              </button>

              {canBorrow && (
                <button
                  onClick={() => openRequestModal(selectedItem, 'borrow')}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  Request to Borrow (Free)
                </button>
              )}

              {canRent && (
                <button
                  onClick={() => openRequestModal(selectedItem, 'rent')}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  Request to Rent (₹{selectedItem.rentPricePerDay}/day)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
