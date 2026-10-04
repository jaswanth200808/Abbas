import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  DollarSign, 
  Phone, 
  User as UserIcon, 
  Camera, 
  Edit3, 
  QrCode 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ItemCondition, ItemMode } from '../types';

const AVATAR_PRESETS = [
  { label: 'Campus Casual', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { label: 'Tech / Coder', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80' },
  { label: 'College Girl', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { label: 'Student Hoodie', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' }
];

const PRESET_IMAGES = [
  {
    name: 'Scientific Calculator',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    category: 'study'
  },
  {
    name: 'Engineering Drafter / Tools',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'study'
  },
  {
    name: 'Chemistry Lab Coat',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    category: 'lab'
  },
  {
    name: 'Engineering Books',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category: 'books'
  },
  {
    name: 'Sports Cricket / Gear',
    url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e359?auto=format&fit=crop&w=800&q=80',
    category: 'sports'
  },
  {
    name: 'Campus Bicycle',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    category: 'transport'
  },
  {
    name: 'Electronics / Stand',
    url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    category: 'electronics'
  },
  {
    name: 'Soldering & Tools',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    category: 'tools'
  }
];

export const PostItemModal: React.FC = () => {
  const { currentUser, closeModal, addItem, updateCurrentUser, showToast } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 2);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];

  const ownerPhotoFileRef = useRef<HTMLInputElement>(null);
  const itemPhotoFileRef = useRef<HTMLInputElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('study');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Excellent');
  const [borrowAvailable, setBorrowAvailable] = useState(true);
  const [rentAvailable, setRentAvailable] = useState(true);
  const [rentPrice, setRentPrice] = useState(25);
  const [securityDeposit, setSecurityDeposit] = useState(200);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [availableFrom, setAvailableFrom] = useState(todayStr);
  const [availableUntil, setAvailableUntil] = useState(nextMonthStr);
  const [location, setLocation] = useState('Hostel Block A, Main Campus');
  const [contactPreference, setContactPreference] = useState('In-App Chat or Hostel Gate');

  // Owner identity states
  const [ownerName, setOwnerName] = useState(currentUser.name);
  const [ownerAvatar, setOwnerAvatar] = useState(currentUser.avatar);
  const [ownerPhone, setOwnerPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [backupPhone, setBackupPhone] = useState(currentUser.backupPhone || '+91 91234 56780');
  const [backupPhoneLabel, setBackupPhoneLabel] = useState(currentUser.backupPhoneLabel || 'Roommate: Rohan (Room 204)');
  const [ownerQrCode, setOwnerQrCode] = useState(currentUser.qrCode || '');
  const [ownerUpiId, setOwnerUpiId] = useState(currentUser.upiId || 'abbas.shaik@okhdfcbank');
  const [ownerQrLabel, setOwnerQrLabel] = useState(currentUser.qrLabel || 'Google Pay / PhonePe Scanner');
  const [returnReceiverName, setReturnReceiverName] = useState('');
  const [returnReceiverPhone, setReturnReceiverPhone] = useState('');
  const [returnReceiverLocation, setReturnReceiverLocation] = useState('');
  const [isCustomizingOwner, setIsCustomizingOwner] = useState(false);
  const [showPhoneToBorrowers, setShowPhoneToBorrowers] = useState(true);
  const [urgentToday, setUrgentToday] = useState(false);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('QR Image is larger than 2MB. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOwnerQrCode(reader.result);
          showToast('Owner Payment QR Scanner attached successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo is larger than 2MB. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast('Item photo uploaded from device!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOwnerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo is larger than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOwnerAvatar(reader.result);
          showToast('Owner photo updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (ownerName !== currentUser.name || ownerAvatar !== currentUser.avatar || ownerPhone !== currentUser.phone) {
      updateCurrentUser({
        name: ownerName.trim(),
        avatar: ownerAvatar,
        phone: ownerPhone.trim()
      });
    }

    let mode: ItemMode = 'both';
    if (borrowAvailable && !rentAvailable) mode = 'borrow';
    else if (!borrowAvailable && rentAvailable) mode = 'rent';

    addItem({
      title: title.trim(),
      category,
      description: description.trim(),
      condition,
      mode,
      rentPricePerDay: rentAvailable ? Number(rentPrice) : 0,
      securityDeposit: Number(securityDeposit) || 0,
      images: [imageUrl],
      ownerName: ownerName.trim(),
      ownerAvatar: ownerAvatar,
      availableFrom,
      availableUntil,
      location: location.trim(),
      contactPreference: contactPreference.trim(),
      ownerPhone: ownerPhone.trim(),
      backupPhone: backupPhone.trim(),
      backupPhoneLabel: backupPhoneLabel.trim(),
      showPhoneToBorrowers,
      urgentToday,
      ownerQrCode,
      ownerUpiId: ownerUpiId.trim(),
      ownerQrLabel: ownerQrLabel.trim(),
      returnReceiverName: returnReceiverName.trim(),
      returnReceiverPhone: returnReceiverPhone.trim(),
      returnReceiverLocation: returnReceiverLocation.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white p-6 relative shrink-0">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold mb-2">
            <span>✨ Campus Circular Economy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Give Your Item a Second Life</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Share items you no longer use with campus juniors & peers. Let them borrow or rent it!
          </p>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mini-Drafter with Scale & Clips / Casio FX-991EX Calculator / Chemistry Lab Coat"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-hidden"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-hidden font-medium"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-hidden font-medium"
              >
                <option value="Like New">Like New (Mint, barely used)</option>
                <option value="Excellent">Excellent (Fully functional, very clean)</option>
                <option value="Good">Good (Working fine with minor cosmetic signs)</option>
                <option value="Fair">Fair (Usable for the semester)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & What is Included *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention semester courses, included cables/accessories, edition number, or notes for the borrower..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-hidden resize-none"
            />
          </div>

          {/* Image Selection with Direct Device Upload */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                Item Picture *
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">Upload from Device or Pick Preset</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative group w-full sm:w-44 h-36 rounded-2xl overflow-hidden border-2 border-indigo-200 bg-white shrink-0 shadow-xs">
                <img src={imageUrl} alt="Item preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => itemPhotoFileRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-bold transition-opacity cursor-pointer"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span>Change Picture</span>
                </button>
                <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  Picture Preview
                </div>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <input
                  type="file"
                  ref={itemPhotoFileRef}
                  onChange={handleItemPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => itemPhotoFileRef.current?.click()}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Picture from Device</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Select a photo of your gear directly from your phone camera or computer storage (JPG, PNG, WEBP).
                </p>

                {/* Preset Category Thumbnails */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Or select a category preset photo:
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(preset.url)}
                        className={`relative rounded-lg overflow-hidden aspect-video border transition-all ${
                          imageUrl === preset.url ? 'ring-2 ring-indigo-600 border-transparent shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {imageUrl === preset.url && (
                          <div className="absolute top-0.5 right-0.5 bg-indigo-600 rounded-full p-0.5 text-white">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional URL input fallback */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Or paste image link:</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-hidden"
              />
            </div>
          </div>

          {/* Sharing Modes & Pricing */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
            <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Sharing & Rental Options
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Borrow toggle */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition-colors">
                <input
                  type="checkbox"
                  checked={borrowAvailable}
                  onChange={(e) => setBorrowAvailable(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Available to Borrow Free</div>
                  <div className="text-[11px] text-slate-500">Allow students to borrow for ₹0 (Goodwill)</div>
                </div>
              </label>

              {/* Rent toggle */}
              <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                <input
                  type="checkbox"
                  checked={rentAvailable}
                  onChange={(e) => setRentAvailable(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Available to Rent</div>
                  <div className="text-[11px] text-slate-500">Set a fair daily rate for your gear</div>
                </div>
              </label>
            </div>

            {/* Price inputs */}
            {rentAvailable && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rental Price per Day (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={rentPrice}
                      onChange={(e) => setRentPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Refundable Security Deposit (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={2000}
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Available From
              </label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Available Until
              </label>
              <input
                type="date"
                value={availableUntil}
                min={availableFrom}
                onChange={(e) => setAvailableUntil(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Campus Location & Handover preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus / Hostel Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hostel Block B Room 104, Library Area"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Handover Preference
              </label>
              <input
                type="text"
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
                placeholder="e.g. In-App Chat, Hostel Lobby, WhatsApp"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Owner Identity & Handover Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                Owner Identity & Contact
              </label>
              <button
                type="button"
                onClick={() => setIsCustomizingOwner(!isCustomizingOwner)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isCustomizingOwner ? 'Done' : 'Edit My Name & Photo'}</span>
              </button>
            </div>

            {/* Owner badge row */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100">
              <div className="flex items-center gap-3">
                <img src={ownerAvatar} alt={ownerName} className="w-10 h-10 rounded-xl object-cover border border-indigo-200" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{ownerName}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.college} • {currentUser.department}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full">
                Verified Owner
              </span>
            </div>

            {/* Inline Customization */}
            {isCustomizingOwner && (
              <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-3 animate-in fade-in duration-150">
                <div className="text-[11px] font-bold text-slate-700 uppercase">
                  Change Owner Picture & Name
                </div>
                <div className="flex items-center gap-3">
                  <img src={ownerAvatar} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-indigo-400 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input type="file" ref={ownerPhotoFileRef} onChange={handleOwnerPhotoUpload} accept="image/*" className="hidden" />
                      <button
                        type="button"
                        onClick={() => ownerPhotoFileRef.current?.click()}
                        className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>
                      <span className="text-[10px] text-slate-400">or presets:</span>
                      {AVATAR_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setOwnerAvatar(p.url)}
                          className="p-0.5 rounded-lg border border-slate-200 hover:border-indigo-600"
                        >
                          <img src={p.url} alt={p.label} className="w-5 h-5 rounded-md object-cover" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="url"
                      value={ownerAvatar}
                      onChange={(e) => setOwnerAvatar(e.target.value)}
                      placeholder="Or paste photo link..."
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Owner Mobile Number (Direct Handover & WhatsApp)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Backup / Alternate Contact Number (When owner is in class/lab) */}
            <div className="pt-3 border-t border-indigo-100/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Backup / Alternate Number (When Owner is in Class / Busy)</span>
                </label>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Alternate Handover
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Add a roommate, hostel wing rep, or lab partner's number to hand over the item if you are in lectures or exams.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Backup Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={backupPhone}
                      onChange={(e) => setBackupPhone(e.target.value)}
                      placeholder="+91 91234 56780"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Backup Contact Name / Relation
                  </label>
                  <input
                    type="text"
                    value={backupPhoneLabel}
                    onChange={(e) => setBackupPhoneLabel(e.target.value)}
                    placeholder="e.g. Roommate: Rohan (Room 204)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Owner QR Scanner / Payment Code Section */}
            <div className="pt-3 border-t border-indigo-100/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Owner Payment Scanner / UPI QR Code</span>
                </label>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                  Instant Payment Scanner
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Add your UPI Scanner (GPay, PhonePe, Paytm QR) so borrowers can scan to pay rent/deposit or verify handover.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Owner UPI ID (For QR Generation)
                  </label>
                  <input
                    type="text"
                    value={ownerUpiId}
                    onChange={(e) => setOwnerUpiId(e.target.value)}
                    placeholder="e.g. abbas.shaik@okhdfcbank"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Scanner Label / App Name
                  </label>
                  <input
                    type="text"
                    value={ownerQrLabel}
                    onChange={(e) => setOwnerQrLabel(e.target.value)}
                    placeholder="e.g. GPay / PhonePe / Paytm Scanner"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Upload custom QR code screenshot or preview */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input 
                  type="file" 
                  ref={qrFileInputRef} 
                  onChange={handleQrUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <button
                  type="button"
                  onClick={() => qrFileInputRef.current?.click()}
                  className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{ownerQrCode ? 'Change QR Scanner Image' : 'Upload QR Scanner Screenshot'}</span>
                </button>
                {ownerQrCode && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Custom Scanner Image Attached</span>
                  </span>
                )}
              </div>
            </div>

            {/* Return Receiver Person Section */}
            <div className="pt-3 border-t border-indigo-100/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Item Return Receiver (When Returning from Customer)</span>
                </label>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  Optional Return Desk / Alternate
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                By default, the owner receives items back. If a lab assistant, roommate, or front desk is receiving the return, specify their name and phone number below.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Return Receiver Name
                  </label>
                  <input
                    type="text"
                    value={returnReceiverName}
                    onChange={(e) => setReturnReceiverName(e.target.value)}
                    placeholder="e.g. Lab Assistant / Roommate"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Receiver Phone Number
                  </label>
                  <input
                    type="tel"
                    value={returnReceiverPhone}
                    onChange={(e) => setReturnReceiverPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Return Desk / Location
                  </label>
                  <input
                    type="text"
                    value={returnReceiverLocation}
                    onChange={(e) => setReturnReceiverLocation(e.target.value)}
                    placeholder="e.g. Lab 204 / Library Desk"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={showPhoneToBorrowers}
                onChange={(e) => setShowPhoneToBorrowers(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 font-medium">
                Show mobile number on item page for quick phone call & WhatsApp handover
              </span>
            </label>
          </div>

          {/* Urgent / Available today toggle */}
          <label className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={urgentToday}
              onChange={(e) => setUrgentToday(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <div className="text-xs text-amber-900 font-semibold">
              ⚡ Mark as "Available Immediately Today" (Helps students needing items urgently for practicals)
            </div>
          </label>

          {/* Sticky buttons in footer */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={closeModal}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Post Item & Make Available</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
