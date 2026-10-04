import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Users, 
  IndianRupee, 
  TrendingUp,
  MapPin,
  CheckCircle2,
  Zap,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { 
    items, 
    setSearchQuery, 
    setSelectedCategory, 
    openPostItemModal,
    openHowItWorksModal
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch.trim());
    setActiveTab('browse');
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('browse');
  };

  const quickSearchSuggestions = ['Drafter', 'Calculator', 'Lab Coat', 'Bicycle', 'Books', 'Laptop Stand'];

  // Smart feature filters for homepage showcases:
  const urgentItems = items.filter(it => it.urgentToday && it.isAvailable).slice(0, 3);
  const freeItems = items.filter(it => (it.freeToBorrow || it.mode === 'borrow') && it.isAvailable).slice(0, 3);
  const nearbyItems = items.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20">
        {/* Subtle background ambient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] bg-gradient-to-tr from-indigo-200/40 via-purple-150/30 to-blue-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          
          {/* Tagline micro badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>Need it? Don't buy it. Rent it. Borrow it. Reuse it.</span>
          </div>

          {/* Big Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Need It for a While? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Don’t Buy It. Reuse It.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 font-medium leading-relaxed">
            Borrow or rent useful items from students around your campus and give unused items a second life.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-slate-400">
                <Search className="w-5 h-5 text-indigo-600" />
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="What are you looking for? (calculator, drafter, books, cycle, lab coat...)"
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xl shadow-indigo-500/5 text-sm sm:text-base font-medium placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all text-slate-900"
              />
              <button
                type="submit"
                className="absolute right-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick search chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular on campus:</span>
              {quickSearchSuggestions.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setActiveTab('browse');
                  }}
                  className="bg-white hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 font-medium transition-colors shadow-2xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('browse')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              Browse Available Items
            </button>
            <button
              onClick={openPostItemModal}
              className="bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-xs transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <span>Post an Item</span>
            </button>
          </div>

          {/* Student Trust Micro-Banner */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Student Profiles</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Same Campus Handover</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Zero Middleman Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              Find by Need
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Explore Categories
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white p-4 rounded-2xl border-2 border-violet-300 shadow-lg shadow-violet-600/30 hover:scale-105 hover:shadow-2xl hover:shadow-violet-700/50 transition-all duration-200 text-center flex flex-col items-center justify-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-2xl sm:text-3xl mb-2.5 group-hover:scale-110 group-hover:bg-white group-hover:text-violet-700 transition-all shadow-md border border-white/30">
                {cat.icon}
              </div>
              <span className="text-xs font-black text-white tracking-wide group-hover:text-violet-100 transition-colors line-clamp-1 drop-shadow-xs">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          
          <div className="relative z-10 max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 font-mono">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 text-white">
              How RENT & REUSE Works
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-2">
              From finding an unused item to physical campus handover and mutual review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="font-extrabold text-base text-white">FIND</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Search for the item you need for your course, exam, lab practical, or weekend sports.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="font-extrabold text-base text-white">REQUEST</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Choose Borrow (Free) or Rent (affordable fee) and submit your dates with a quick note.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="font-extrabold text-base text-white">CONNECT</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Owner accepts your request. Coordinate in-app to meet at the library or hostel lobby.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                04
              </div>
              <h3 className="font-extrabold text-base text-white">RETURN & REUSE</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Return the item safely, exchange reviews, and let another student reuse it next semester!
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-indigo-200">
              💡 Solves: No student needs to waste ₹1,500+ buying a drafter or lab gear used for just 3 months.
            </span>
            <button
              onClick={openHowItWorksModal}
              className="text-white hover:text-indigo-300 font-bold underline flex items-center gap-1"
            >
              <span>View Full Interactive Diagram</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* URGENT NEED SECTION */}
      {urgentItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider font-mono">
                <Zap className="w-4 h-4 fill-rose-600" />
                <span>Urgent Need</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Need It Today?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Items available immediately on campus for upcoming lab tests or exams.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('browse')}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              Browse All ({items.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgentItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* FREE TO BORROW SECTION */}
      {freeItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider font-mono">
                <Gift className="w-4 h-4" />
                <span>Goodwill Sharing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Free to Borrow
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero rental cost items shared generously by fellow students.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('browse')}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              View Free Items →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* REUSE IMPACT DASHBOARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              Sustainability & Savings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Campus Reuse Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every item borrowed or rented preserves student allowances and prevents brand-new plastic & metal waste.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">1,248</div>
              <div className="text-xs font-bold text-indigo-900 mt-1">Items Reused</div>
              <p className="text-[11px] text-slate-500 mt-1">Kept in continuous student circulation</p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-md shadow-purple-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">856</div>
              <div className="text-xs font-bold text-purple-900 mt-1">Students Helped</div>
              <p className="text-[11px] text-slate-500 mt-1">Across 14 campus departments</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-emerald-800 font-mono">₹2.4 Lakhs</div>
              <div className="text-xs font-bold text-emerald-950 mt-1">Estimated Savings</div>
              <p className="text-[11px] text-slate-500 mt-1">Saved from unnecessary new purchases</p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-md shadow-amber-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-amber-900 font-mono">420 kg</div>
              <div className="text-xs font-bold text-amber-950 mt-1">Waste Prevented</div>
              <p className="text-[11px] text-slate-500 mt-1">Diverted from campus trash bins</p>
            </div>
          </div>
        </div>
      </section>

      {/* AVAILABLE NEAR YOU (LOCATION BASED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              <MapPin className="w-4 h-4" />
              <span>Hostels & Blocks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Available Near You
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pickup within walking distance in your campus blocks & library.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            Explore Map & List →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nearbyItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
