import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Check, 
  DollarSign, 
  Phone, 
  Trash2, 
  Save, 
  QrCode, 
  User as UserIcon 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { Item, ItemCondition, ItemMode } from '../types';

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

export const EditItemModal: React.FC = () => {
  const { selectedItem, closeModal, updateItem, deleteItem, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedItem) return null;

  const [title, setTitle] = useState(selectedItem.title);
  const [category, setCategory] = useState(selectedItem.category);
  const [description, setDescription] = useState(selectedItem.description);
  const [condition, setCondition] = useState<ItemCondition>(selectedItem.condition);
  const [borrowAvailable, setBorrowAvailable] = useState(selectedItem.mode === 'borrow' || selectedItem.mode === 'both');
  const [rentAvailable, setRentAvailable] = useState(selectedItem.mode === 'rent' || selectedItem.mode === 'both');
  const [rentPrice, setRentPrice] = useState(selectedItem.rentPricePerDay || 25);
  const [securityDeposit, setSecurityDeposit] = useState(selectedItem.securityDeposit || 0);
  const [imageUrl, setImageUrl] = useState(selectedItem.images[0] || PRESET_IMAGES[0].url);
  const [location, setLocation] = useState(selectedItem.location || '');
  const [contactPreference, setContactPreference] = useState(selectedItem.contactPreference || '');
  const [ownerPhone, setOwnerPhone] = useState(selectedItem.ownerPhone || '');
  const [backupPhone, setBackupPhone] = useState(selectedItem.backupPhone || '');
  const [backupPhoneLabel, setBackupPhoneLabel] = useState(selectedItem.backupPhoneLabel || '');
  const [ownerQrCode, setOwnerQrCode] = useState(selectedItem.ownerQrCode || '');
  const [ownerUpiId, setOwnerUpiId] = useState(selectedItem.ownerUpiId || 'abbas.shaik@okhdfcbank');
  const [ownerQrLabel, setOwnerQrLabel] = useState(selectedItem.ownerQrLabel || 'Google Pay / PhonePe Scanner');
  const [returnReceiverName, setReturnReceiverName] = useState(selectedItem.returnReceiverName || '');
  const [returnReceiverPhone, setReturnReceiverPhone] = useState(selectedItem.returnReceiverPhone || '');
  const [returnReceiverLocation, setReturnReceiverLocation] = useState(selectedItem.returnReceiverLocation || '');
  const [showPhoneToBorrowers, setShowPhoneToBorrowers] = useState(selectedItem.showPhoneToBorrowers ?? true);
  const [urgentToday, setUrgentToday] = useState(!!selectedItem.urgentToday);
  const [isAvailable, setIsAvailable] = useState(selectedItem.isAvailable);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('QR Image is larger than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOwnerQrCode(reader.result);
          showToast('Owner QR Code Scanner attached successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image is larger than 2MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast('New photo uploaded! Click "Save Changes" to apply.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Item title cannot be empty.');
      return;
    }

    let mode: ItemMode = 'both';
    if (borrowAvailable && !rentAvailable) mode = 'borrow';
    else if (!borrowAvailable && rentAvailable) mode = 'rent';

    const updated: Item = {
      ...selectedItem,
      title: title.trim(),
      category,
      description: description.trim(),
      condition,
      mode,
      rentPricePerDay: rentAvailable ? Number(rentPrice) : 0,
      securityDeposit: Number(securityDeposit) || 0,
      images: [imageUrl],
      location: location.trim(),
      contactPreference: contactPreference.trim(),
      ownerPhone: ownerPhone.trim(),
      backupPhone: backupPhone.trim(),
      backupPhoneLabel: backupPhoneLabel.trim(),
      showPhoneToBorrowers,
      urgentToday,
      isAvailable,
      ownerQrCode,
      ownerUpiId: ownerUpiId.trim(),
      ownerQrLabel: ownerQrLabel.trim(),
      returnReceiverName: returnReceiverName.trim(),
      returnReceiverPhone: returnReceiverPhone.trim(),
      returnReceiverLocation: returnReceiverLocation.trim()
    };
    updateItem(updated);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      deleteItem(selectedItem.id);
      closeModal();
    }
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
            <span>✨ Manage Your Item</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Edit Item & Change Picture</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Update your item's photo from your device, modify rental price, or adjust availability.
          </p>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Picture Edit Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                Change Item Picture *
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">Upload Photo from Device</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative group w-full sm:w-44 h-36 rounded-2xl overflow-hidden border-2 border-indigo-400 bg-white shrink-0 shadow-sm">
                <img src={imageUrl} alt="Item Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-bold transition-opacity cursor-pointer"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span>Change Photo</span>
                </button>
                <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  Current Picture
                </div>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Photo from Device</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Select a photo from your gallery or mobile camera (JPG, PNG, WEBP).
                </p>

                {/* Presets */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Or select a category preset:
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

            {/* Custom URL Fallback */}
            <div className="pt-2 border-t border-indigo-100 flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Or paste image URL:</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-hidden"
              />
            </div>
          </div>

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
              placeholder="e.g. Casio FX-991EX Scientific Calculator"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-hidden font-semibold text-slate-900"
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

          {/* Sharing Modes & Pricing */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
            <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Sharing & Rental Options
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                <input
                  type="checkbox"
                  checked={borrowAvailable}
                  onChange={(e) => {
                    if (!e.target.checked && !rentAvailable) setRentAvailable(true);
                    setBorrowAvailable(e.target.checked);
                  }}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Free to Borrow</div>
                  <div className="text-[11px] text-slate-500">Allow students to borrow for 1-7 days free of cost</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                <input
                  type="checkbox"
                  checked={rentAvailable}
                  onChange={(e) => {
                    if (!e.target.checked && !borrowAvailable) setBorrowAvailable(true);
                    setRentAvailable(e.target.checked);
                  }}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Available for Rent</div>
                  <div className="text-[11px] text-slate-500">Charge an affordable nominal daily campus fee</div>
                </div>
              </label>
            </div>

            {rentAvailable && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rental Price (₹ per day) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={rentPrice}
                      onChange={(e) => setRentPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Refundable Security Deposit (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={5000}
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Campus Location & Handover */}
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
                placeholder="e.g. Hostel Block B, Main Library"
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
                placeholder="e.g. In-App Chat, Hostel Lobby"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Owner Mobile & Backup Number */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  Primary Owner Contact Number
                </label>
              </div>
              <input
                type="tel"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            {/* Backup Contact Number */}
            <div className="pt-3 border-t border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Backup / Alternate Number (When in Class / Lab)</span>
                </label>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Alternate Contact
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Number of a roommate or friend to call for pickup/handover when you are in class or busy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Backup Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={backupPhone}
                    onChange={(e) => setBackupPhone(e.target.value)}
                    placeholder="+91 91234 56780"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Contact Name / Role
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
                Borrowers can scan this QR code or use your UPI ID for security deposits and daily rental payments.
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
                By default, the owner receives items back. If another person receives the return, specify their name and phone number.
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
          </div>

          {/* Availability status toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <div className="text-xs font-bold text-slate-800">
                Item is Available for Booking
              </div>
            </label>
            <label className="flex-1 flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={urgentToday}
                onChange={(e) => setUrgentToday(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <div className="text-xs font-bold text-amber-900">
                ⚡ Available Immediately Today
              </div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDelete}
              className="py-2.5 px-4 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Listing</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes & Picture</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
