import React, { useState, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Package, 
  ArrowRight, 
  Award, 
  Edit3, 
  Camera, 
  Upload, 
  Save 
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

interface OwnerProfileModalProps {
  onNavigateToMessages?: () => void;
}

export const OwnerProfileModal: React.FC<OwnerProfileModalProps> = ({ onNavigateToMessages }) => {
  const { 
    viewedUser, 
    currentUser, 
    items, 
    closeModal, 
    sendMessage, 
    openDetailModal,
    updateCurrentUser,
    showToast 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'reviews'>('items');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(viewedUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(viewedUser?.avatar || '');
  const [editPhone, setEditPhone] = useState(viewedUser?.phone || '');
  const [editBackupPhone, setEditBackupPhone] = useState(viewedUser?.backupPhone || '');
  const [editBackupPhoneLabel, setEditBackupPhoneLabel] = useState(viewedUser?.backupPhoneLabel || '');
  const [editDept, setEditDept] = useState(viewedUser?.department || '');

  if (!viewedUser) return null;

  const isSelf = currentUser.id === viewedUser.id;
  const ownerItems = items.filter(it => it.ownerId === viewedUser.id);
  const ownerReviews = ownerItems.flatMap(it => it.reviews);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image is too large (max 2MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
          showToast('Photo uploaded! Click "Save Changes" to apply.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveOwnerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty.');
      return;
    }
    updateCurrentUser({
      name: editName.trim(),
      avatar: editAvatar,
      phone: editPhone.trim(),
      backupPhone: editBackupPhone.trim(),
      backupPhoneLabel: editBackupPhoneLabel.trim(),
      department: editDept.trim()
    });
    viewedUser.name = editName.trim();
    viewedUser.avatar = editAvatar;
    viewedUser.phone = editPhone.trim();
    viewedUser.backupPhone = editBackupPhone.trim();
    viewedUser.backupPhoneLabel = editBackupPhoneLabel.trim();
    viewedUser.department = editDept.trim();
    setIsEditing(false);
    showToast('Owner profile and contact numbers updated successfully!');
  };

  const handleMessage = () => {
    sendMessage(
      viewedUser.id,
      viewedUser.name,
      `Hi ${viewedUser.name}! I'm viewing your profile on RENT & REUSE and would like to connect regarding your campus listings.`
    );
    closeModal();
    if (onNavigateToMessages) {
      onNavigateToMessages();
    } else {
      showToast(`Conversation started with ${viewedUser.name}! Check Messages tab.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-6 text-white relative shrink-0">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-yellow-300" />
            <span>Campus Member Profile</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img 
                  src={viewedUser.avatar} 
                  alt={viewedUser.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md bg-white" 
                />
                {isSelf && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setTimeout(() => fileInputRef.current?.click(), 100);
                    }}
                    className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity"
                    title="Change Owner Photo"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span>Change</span>
                  </button>
                )}
                {viewedUser.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{viewedUser.name}</h2>
                  {viewedUser.isVerified && (
                    <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                  {isSelf && (
                    <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-200 font-medium">{viewedUser.department}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-indigo-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {viewedUser.college} • {viewedUser.campus}
                  </span>
                  <span>•</span>
                  <span>ID: {viewedUser.studentId}</span>
                </div>
              </div>
            </div>

            {/* Actions & Big Trust Badge */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 self-start sm:self-auto shrink-0">
              {isSelf && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit My Name & Photo'}</span>
                </button>
              )}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
                <div className="text-2xl font-black text-yellow-300 font-mono">
                  {viewedUser.trustScore}<span className="text-xs text-indigo-200 font-normal">/100</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Trust Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Owner Quick Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveOwnerProfile} className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  <span>Edit Owner Profile Picture & Details</span>
                </h3>
                <span className="text-[11px] text-indigo-600 font-medium">Updates your listings & badge</span>
              </div>
              
              {/* Photo section */}
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <img src={editAvatar} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-indigo-300 shrink-0" />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">Presets:</span>
                      {AVATAR_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditAvatar(p.url)}
                          className={`p-0.5 rounded-lg border transition-all ${editAvatar === p.url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'}`}
                          title={p.label}
                        >
                          <img src={p.url} alt={p.label} className="w-6 h-6 rounded-md object-cover" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Abbas Shaik"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Handover Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Backup Mobile (When in Class / Lab)
                  </label>
                  <input
                    type="tel"
                    value={editBackupPhone}
                    onChange={(e) => setEditBackupPhone(e.target.value)}
                    placeholder="+91 91234 56780"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Backup Contact Name / Relation
                  </label>
                  <input
                    type="text"
                    value={editBackupPhoneLabel}
                    onChange={(e) => setEditBackupPhoneLabel(e.target.value)}
                    placeholder="e.g. Roommate: Rohan"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Save & Cancel */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Owner Details</span>
                </button>
              </div>
            </form>
          )}
          
          {/* Trust Score 4-Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <div className="text-amber-500 font-bold text-base flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{viewedUser.rating}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Rating</div>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="text-purple-700 font-bold text-base font-mono">
                {ownerItems.length}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Items Shared</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="text-emerald-700 font-bold text-base font-mono">
                {viewedUser.successfulReturnsCount}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Safe Returns</div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
              <div className="text-blue-700 font-bold text-base">
                {viewedUser.joinedDate}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Campus Member</div>
            </div>
          </div>

          {/* Contact Box with Primary & Backup Numbers */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Primary Handover Mobile</span>
                </div>
                {viewedUser.phone ? (
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{viewedUser.phone}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      Owner Active
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">Contact through In-App Chat for campus privacy.</div>
                )}
              </div>
              {!isSelf && (
                <div className="flex items-center gap-2">
                  {viewedUser.phone && (
                    <a
                      href={`tel:${viewedUser.phone.replace(/\s+/g, '')}`}
                      className="py-1.5 px-3 rounded-xl bg-white border border-slate-300 hover:border-emerald-400 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Owner</span>
                    </a>
                  )}
                  <button
                    onClick={handleMessage}
                    className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              )}
            </div>

            {/* Backup Contact Number in profile */}
            {viewedUser.backupPhone && (
              <div className="pt-2.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-950">
                  <span className="p-1 rounded-md bg-amber-200 text-amber-900 font-bold">
                    <Phone className="w-3 h-3" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">
                      Backup / Roommate Contact (If owner is in class/busy):
                    </span>
                    <span className="font-semibold text-slate-700">{viewedUser.backupPhoneLabel || 'Roommate'}: </span>
                    <span className="font-mono font-bold text-slate-900">{viewedUser.backupPhone}</span>
                  </div>
                </div>
                {!isSelf && (
                  <a
                    href={`tel:${viewedUser.backupPhone.replace(/\s+/g, '')}`}
                    className="self-start sm:self-auto py-1 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    Call Backup
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Tabs: Items Listed & Reviews */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('items')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'items'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Items Shared by {viewedUser.name.split(' ')[0]} ({ownerItems.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Student Reviews ({ownerReviews.length})</span>
              </button>
            </div>

            {/* Tab 1: Owner's listed items */}
            {activeTab === 'items' && (
              <div>
                {ownerItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    No items currently listed by this student.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ownerItems.map(item => (
                      <div 
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5"
                      >
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.condition} • {item.mode === 'borrow' ? 'Free Borrow' : `₹${item.rentPricePerDay}/day`}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              {item.isAvailable ? 'Available Now' : 'Currently Borrowed'}
                            </span>
                            <button
                              onClick={() => {
                                closeModal();
                                openDetailModal(item);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                            >
                              <span>View Item</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Reviews received */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {ownerReviews.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    No reviews received yet for this student's items.
                  </div>
                ) : (
                  ownerReviews.map(rev => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.authorAvatar} alt={rev.authorName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-800">{rev.authorName}</span>
                          <span className="text-[10px] text-slate-400">({rev.role})</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          {'★'.repeat(rev.rating)}
                          <span className="text-[10px] text-slate-400 font-normal ml-1.5">{rev.date}</span>
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
                            className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" 
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={closeModal}
            className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
          >
            Close
          </button>
          {!isSelf && (
            <button
              onClick={handleMessage}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message {viewedUser.name.split(' ')[0]}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
