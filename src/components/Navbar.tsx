import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  PlusCircle, 
  Save, 
  ChevronDown, 
  RotateCcw, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentUser, 
    allUsers, 
    switchUser, 
    requests, 
    notifications,
    openPostItemModal,
    openHowItWorksModal,
    resetDemoData,
    saveAllDataToStorage,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  // Incoming requests waiting for current user
  const incomingPending = requests.filter(r => r.ownerId === currentUser.id && r.status === 'PENDING').length;
  // Active/accepted requests for current user as requester
  const myActiveUpdates = requests.filter(r => r.requesterId === currentUser.id && (r.status === 'ACCEPTED' || r.status === 'ACTIVE')).length;
  const totalBadges = incomingPending + myActiveUpdates;

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse Items' },
    { id: 'post', label: 'Post an Item', isAction: true },
    { 
      id: 'my-requests', 
      label: 'My Requests', 
      badge: myActiveUpdates > 0 ? myActiveUpdates : undefined,
      badgeColor: 'bg-emerald-500'
    },
    { 
      id: 'my-listings', 
      label: 'My Listings', 
      badge: incomingPending > 0 ? incomingPending : undefined,
      badgeColor: 'bg-indigo-600'
    },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile' },
  ];

  const handleNavClick = (id: string, isAction?: boolean) => {
    if (isAction) {
      openPostItemModal();
    } else {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      {/* Top micro banner for Hackathon Demo Persona switching */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold tracking-wider">
              Hackathon Live Demo
            </span>
            <span className="hidden sm:inline text-indigo-100">
              Switch persona to test both Borrower & Owner interactions:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveAllDataToStorage}
              className="flex items-center gap-1 bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 hover:text-white border border-emerald-400/30 transition-all px-2.5 py-1 rounded text-xs font-semibold"
              title="Force save all data to browser storage"
            >
              <Save className="w-3.5 h-3.5 text-emerald-300" />
              <span>Save Data</span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-1 rounded text-xs text-white font-medium"
              >
                <span>Current: <strong className="text-yellow-300">{currentUser.name}</strong> ({currentUser.year})</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-800 dark:text-slate-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Switch Active Student
                  </div>
                  {allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        user.id === currentUser.id ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold' : ''
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold flex items-center gap-1">
                          {user.name}
                          {user.id === currentUser.id && (
                            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-bold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.department}</div>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="text-amber-500 font-bold">★ {user.rating}</span>
                        <div className="text-[10px] text-emerald-600 font-medium">{user.trustScore} Trust</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5 px-3">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowPersonaMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1 text-slate-500 hover:text-rose-600 text-xs transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={openHowItWorksModal}
              className="text-xs text-indigo-200 hover:text-white underline underline-offset-2 flex items-center gap-1 ml-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-lg tracking-tighter">R&R</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    RENT & REUSE
                  </span>
                  <span className="hidden lg:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 uppercase tracking-wider">
                    Campus Sharing
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Need it? Don't buy it. Rent it. Borrow it. Reuse it.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              if (link.isAction) {
                return (
                  <button
                    key={link.id}
                    onClick={() => openPostItemModal()}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-xs shadow-indigo-600/20 transition-all hover:shadow-md hover:-translate-y-0.5 ml-1 mr-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post an Item</span>
                  </button>
                );
              }

              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className={`${link.badgeColor || 'bg-indigo-600'} text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Notifications & Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {totalBadges > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-3 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Campus Notifications</span>
                    <span className="text-[11px] text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full font-semibold">
                      {notifications.length} updates
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {incomingPending > 0 && (
                      <div 
                        onClick={() => {
                          setActiveTab('my-listings');
                          setShowNotifications(false);
                        }}
                        className="p-3.5 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 cursor-pointer bg-amber-50/30 dark:bg-amber-950/10 transition-colors flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs">
                          !
                        </div>
                        <div className="flex-1 text-xs">
                          <p className="font-semibold text-slate-900 dark:text-white">Incoming Requests Waiting!</p>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5">You have {incomingPending} pending request(s) on your listed items.</p>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium inline-block mt-1">Review & Accept in My Listings →</span>
                        </div>
                      </div>
                    )}
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          if (notif.actionTab) setActiveTab(notif.actionTab);
                          setShowNotifications(false);
                        }}
                        className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 text-xs">
                          {notif.type === 'request' ? '📦' : notif.type === 'status' ? '🔔' : '✨'}
                        </div>
                        <div className="flex-1 text-xs">
                          <p className="font-semibold text-slate-900 dark:text-white">{notif.title}</p>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50/70 dark:bg-slate-800 hover:bg-slate-100'
              }`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white dark:border-slate-700 shadow-xs" 
              />
              <div className="hidden lg:block text-left text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100 leading-tight flex items-center gap-1">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  {currentUser.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Trust: {currentUser.trustScore}/100
                </div>
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3 p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl mb-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200" />
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Verified
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{currentUser.department}</div>
              <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mt-0.5">Trust Score: {currentUser.trustScore}/100</div>
            </div>
          </div>

          <button
            onClick={() => handleNavClick('post', true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-md shadow-indigo-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post an Item to Share</span>
          </button>

          <div className="space-y-1 pt-2">
            {navLinks.filter(l => !l.isAction).map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className={`${link.badgeColor || 'bg-indigo-600'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
            <div className="text-xs font-semibold text-slate-400 mb-2">Hackathon Switcher:</div>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs p-2 rounded-lg border text-left flex items-center gap-2 ${
                    u.id === currentUser.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 font-bold' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="truncate">{u.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
