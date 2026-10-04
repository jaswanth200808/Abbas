import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Star, 
  RotateCcw, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Edit3, 
  Camera, 
  Upload, 
  X, 
  Save, 
  Download, 
  Database 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';

const AVATAR_PRESETS = [
  { label: 'Campus Casual', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { label: 'Tech / Coder', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80' },
  { label: 'College Girl', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { label: 'Student Hoodie', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { label: 'Sports / Campus', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  { label: 'Senior / Scholar', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' }
];

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    items, 
    requests, 
    verifyStudent, 
    updateCurrentUser,
    showToast,
    saveAllDataToStorage,
    exportAllDataJSON,
    importAllDataJSON,
    resetDemoData,
    lastSavedTime
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'listings' | 'activity' | 'reviews'>('listings');
  const [editing, setEditing] = useState(false);

  // Form states
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [phone, setPhone] = useState(currentUser.phone);
  const [backupPhone, setBackupPhone] = useState(currentUser.backupPhone || '');
  const [backupPhoneLabel, setBackupPhoneLabel] = useState(currentUser.backupPhoneLabel || '');
  const [email, setEmail] = useState(currentUser.email);
  const [studentId, setStudentId] = useState(currentUser.studentId);
  const [college, setCollege] = useState(currentUser.college);
  const [campus, setCampus] = useState(currentUser.campus);
  const [department, setDepartment] = useState(currentUser.department);
  const [year, setYear] = useState(currentUser.year);

  // Sync state if currentUser changes
  useEffect(() => {
    setName(currentUser.name);
    setAvatar(currentUser.avatar);
    setPhone(currentUser.phone);
    setBackupPhone(currentUser.backupPhone || '');
    setBackupPhoneLabel(currentUser.backupPhoneLabel || '');
    setEmail(currentUser.email);
    setStudentId(currentUser.studentId);
    setCollege(currentUser.college);
    setCampus(currentUser.campus);
    setDepartment(currentUser.department);
    setYear(currentUser.year);
  }, [currentUser]);

  const userItems = items.filter(i => i.ownerId === currentUser.id);
  const userBorrowRequests = requests.filter(r => r.requesterId === currentUser.id && r.status === 'COMPLETED');
  const reviewsReceived = userItems.flatMap(i => i.reviews);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo is too large (max 2MB). Please select a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          showToast('Photo selected! Click "Save Changes" to apply.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          importAllDataJSON(content);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty.');
      return;
    }
    updateCurrentUser({
      name: name.trim(),
      avatar,
      phone: phone.trim(),
      backupPhone: backupPhone.trim(),
      backupPhoneLabel: backupPhoneLabel.trim(),
      email: email.trim(),
      studentId: studentId.trim(),
      college: college.trim(),
      campus: campus.trim(),
      department: department.trim(),
      year
    });
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Student ID Card style */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Decorative Top header */}
        <div className="bg-gradient-to-r from-indigo-700 via-violet-800 to-purple-800 h-32 sm:h-40 relative px-6 flex items-end">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-violet-600 text-white text-xs font-mono font-black px-3.5 py-1.5 rounded-xl shadow-lg ring-2 ring-white/40 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ID: {currentUser.studentId}
            </span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setTimeout(() => fileInputRef.current?.click(), 100);
                  }}
                  className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity"
                  title="Change Profile Picture"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span>Change Photo</span>
                </button>
                {currentUser.isVerified && (
                  <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full ring-2 ring-white shadow-md" title="Student ID Verified">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {currentUser.name}
                  </h1>
                  {currentUser.isVerified && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Student Verified
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-indigo-700">
                  {currentUser.department} • <span className="text-slate-600 font-medium">{currentUser.year}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.college} ({currentUser.campus})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-violet-600" />
                    <span className="font-mono font-bold text-violet-700">{currentUser.phone}</span>
                  </span>
                  {currentUser.backupPhone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span>Backup: <strong className="font-mono">{currentUser.backupPhone}</strong> ({currentUser.backupPhoneLabel || 'Roommate'})</span>
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!currentUser.isVerified ? (
                <button
                  onClick={verifyStudent}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Student ID</span>
                </button>
              ) : (
                <div className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ID Card Verified</span>
                </div>
              )}
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  editing 
                    ? 'bg-slate-200 text-slate-800' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>{editing ? 'Cancel' : 'Edit My Profile'}</span>
              </button>
            </div>
          </div>

          {/* Comprehensive Edit Profile Form */}
          {editing && (
            <form onSubmit={handleSaveProfile} className="mb-8 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-200/80 shadow-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-indigo-600" />
                    <span>Customize Your Campus Profile Details</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your photo, phone number, name, and department. Changes automatically reflect on all your active item listings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="p-1.5 rounded-full hover:bg-indigo-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Upload & Preset Avatars */}
              <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Profile Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={avatar} 
                      alt="Preview" 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
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
                        className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>
                      <span className="text-[11px] text-slate-400">JPG, PNG or WEBP (Max 2MB)</span>
                    </div>

                    {/* Presets */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Or select a student avatar:
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(preset.url)}
                            className={`p-1 rounded-xl border-2 transition-all ${
                              avatar === preset.url 
                                ? 'border-indigo-600 ring-2 ring-indigo-200' 
                                : 'border-transparent hover:border-slate-300'
                            }`}
                            title={preset.label}
                          >
                            <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-lg object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom URL Input */}
                    <div>
                      <input
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="Or paste external image URL..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal & Academic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abbas Shaik"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Mobile Number (WhatsApp & Calls) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Backup Mobile (Roommate / When in Class)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={backupPhone}
                      onChange={(e) => setBackupPhone(e.target.value)}
                      placeholder="+91 91234 56780"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Backup Contact Relationship / Note
                  </label>
                  <input
                    type="text"
                    value={backupPhoneLabel}
                    onChange={(e) => setBackupPhoneLabel(e.target.value)}
                    placeholder="e.g. Roommate: Rohan (Room 204)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student / Campus Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@campus.edu"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student ID / Roll No.
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. NIE-CS-2024-018"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department / Branch
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Graduate / PG">Graduate / Post-Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Engineering"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Campus / Hostel Pickup Location
                  </label>
                  <input
                    type="text"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="e.g. Hostel Block A, Main Campus"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </button>
              </div>
            </form>
          )}

          {/* TRUST SYSTEM & SAFETY SCORE CARD */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Verified Campus Trust Metric</span>
                </div>
                <h3 className="text-xl font-black text-white">Trust & Safety System</h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                  Trust score is based on verification, ratings, successful exchanges, and timely returns.
                </p>
              </div>

              {/* Big Trust Score Badge */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-6 py-4 rounded-2xl text-center self-start sm:self-auto">
                <div className="text-3xl sm:text-4xl font-black text-yellow-300 font-mono">
                  {currentUser.trustScore}<span className="text-lg text-indigo-200">/100</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                  High Trust Rating
                </div>
              </div>
            </div>

            {/* 5 Trust Pillar Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/10 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-emerald-400 font-bold text-base flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentUser.isVerified ? 'Active' : 'Pending'}</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1 uppercase font-semibold">Student Verified</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-amber-400 font-bold text-base flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{currentUser.rating} ★</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1 uppercase font-semibold">Peer Rating</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-indigo-300 font-bold text-base font-mono">
                  {currentUser.itemsListedCount}
                </div>
                <div className="text-[10px] text-slate-300 mt-1 uppercase font-semibold">Items Shared</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-purple-300 font-bold text-base font-mono">
                  {currentUser.itemsBorrowedCount}
                </div>
                <div className="text-[10px] text-slate-300 mt-1 uppercase font-semibold">Items Borrowed</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <div className="text-teal-300 font-bold text-base font-mono flex items-center justify-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{currentUser.successfulReturnsCount}</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1 uppercase font-semibold">100% Safe Returns</div>
              </div>
            </div>
          </div>

          {/* WEBSITE DATA PERSISTENCE & BACKUP MANAGER */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Website Data & Local Storage Persistence</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Auto-Saving Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All listings, requests, chat messages, and reviews persist in your browser. Export or restore your database anytime.
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-mono self-start sm:self-auto">
                Last synced: <span className="font-bold text-slate-700">{lastSavedTime}</span>
              </div>
            </div>

            {/* Hidden file input for JSON restore */}
            <input 
              type="file" 
              ref={jsonInputRef} 
              onChange={handleJsonUpload} 
              accept=".json,application/json" 
              className="hidden" 
            />

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <button
                type="button"
                onClick={saveAllDataToStorage}
                className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
              >
                <Save className="w-4 h-4 text-indigo-600" />
                <span>Save All Data Now</span>
              </button>
              <button
                type="button"
                onClick={exportAllDataJSON}
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export JSON Backup</span>
              </button>
              <button
                type="button"
                onClick={() => jsonInputRef.current?.click()}
                className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
              >
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Restore from JSON</span>
              </button>
              <button
                type="button"
                onClick={resetDemoData}
                className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: My Listings, Borrowing History, Reviews */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'listings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Listed by {currentUser.name.split(' ')[0]} ({userItems.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'activity'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Borrow History ({userBorrowRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reviews Received ({reviewsReceived.length})
          </button>
        </div>

        {/* Tab 1: Listed items */}
        {activeTab === 'listings' && (
          <div>
            {userItems.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                You haven't listed any items yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Borrow history */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {userBorrowRequests.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No completed borrow records yet.
              </div>
            ) : (
              userBorrowRequests.map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={req.itemImage} alt={req.itemTitle} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800">{req.itemTitle}</h4>
                      <div className="text-slate-500 text-[11px]">Owner: {req.ownerName} • {req.startDate} to {req.endDate}</div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Returned Safely
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Reviews received */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviewsReceived.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No reviews received yet.
              </div>
            ) : (
              reviewsReceived.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={rev.authorAvatar} alt={rev.authorName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-slate-800">{rev.authorName}</span>
                    </div>
                    <div className="text-amber-500 font-bold">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-slate-600 pl-8">
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
  );
};
