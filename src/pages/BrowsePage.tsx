import React, { useMemo, useState } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';

export const BrowsePage: React.FC = () => {
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    openPostItemModal 
  } = useApp();

  // Local filter states
  const [modeFilter, setModeFilter] = useState<'all' | 'borrow' | 'rent'>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtering & Sorting pipeline
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesOwner = item.ownerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesOwner) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Mode (Borrow vs Rent)
      if (modeFilter === 'borrow') {
        if (!item.freeToBorrow && item.mode !== 'borrow' && item.mode !== 'both' && item.rentPricePerDay > 0) {
          return false;
        }
      } else if (modeFilter === 'rent') {
        if (item.mode !== 'rent' && item.mode !== 'both') {
          return false;
        }
      }

      // 4. Condition
      if (conditionFilter !== 'all' && item.condition !== conditionFilter) {
        return false;
      }

      // 5. Location
      if (locationFilter !== 'all' && !item.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      // 6. Available only
      if (availableOnly && !item.isAvailable) {
        return false;
      }

      // 7. Max price (only applies if renting)
      if (item.mode === 'rent' && item.rentPricePerDay > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.rentPricePerDay - b.rentPricePerDay;
      }
      if (sortBy === 'price-desc') {
        return b.rentPricePerDay - a.rentPricePerDay;
      }
      if (sortBy === 'rating') {
        return b.ownerRating - a.ownerRating;
      }
      // 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items, searchQuery, selectedCategory, modeFilter, conditionFilter, locationFilter, availableOnly, maxPrice, sortBy]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setModeFilter('all');
    setConditionFilter('all');
    setLocationFilter('all');
    setAvailableOnly(false);
    setMaxPrice(100);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery !== '' || 
    selectedCategory !== 'all' || 
    modeFilter !== 'all' || 
    conditionFilter !== 'all' || 
    locationFilter !== 'all' || 
    availableOnly || 
    maxPrice < 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
            Campus Marketplace
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Find What You Need
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse items shared by campus peers for immediate borrowing or semester rental.
          </p>
        </div>

        {/* Post CTA */}
        <button
          onClick={openPostItemModal}
          className="self-start md:self-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          + Post an Unused Item
        </button>
      </div>

      {/* Main Search & Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calculator, drafter, books, lab coat, cycle..."
              className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Filter toggle button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Refine Search
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Sharing Mode (Borrow vs Rent) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mode
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Modes' },
                  { id: 'borrow', label: '🎁 Free to Borrow Only' },
                  { id: 'rent', label: '💰 Available for Rent' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                    <input
                      type="radio"
                      name="modeFilter"
                      checked={modeFilter === item.id}
                      onChange={() => setModeFilter(item.id as any)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  Max Daily Rent
                </label>
                <span className="font-mono font-bold text-indigo-600">₹{maxPrice}/day</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹10/day</span>
                <span>₹100/day</span>
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Condition
              </label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="all">Any Condition</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Campus Location */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Campus Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="all">All Campus Locations</option>
                <option value="Block A">Campus / Hostel Block A</option>
                <option value="Block B">Hostel Block B</option>
                <option value="Block C">Hostel Block C</option>
                <option value="Library">Library Area</option>
                <option value="Lab">Science & Lab Block</option>
                <option value="Sports">Sports Ground</option>
              </select>
            </div>

            {/* Immediate Availability toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Available Now Only</span>
              </label>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="md:hidden w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Item Cards Grid (3 Columns on desktop) */}
        <div className="md:col-span-3 space-y-4">
          
          {/* Results count & active tags bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-1">
            <div>
              Showing <strong className="text-slate-800 font-bold">{filteredItems.length}</strong> items available on campus
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching items found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn't find items matching your current filters. Try resetting the filters or be the first student to post this item!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Reset Filters
                </button>
                <button
                  onClick={openPostItemModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  Post This Item
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
