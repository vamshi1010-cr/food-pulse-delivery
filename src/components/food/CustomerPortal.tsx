import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  ArrowLeft,
  Bike
} from 'lucide-react';
import type { Restaurant, MenuItem, Order, Review } from '../../types/food';

interface CustomerPortalProps {
  restaurants: Restaurant[];
  reviews: Review[];
  activeOrders: Order[];
  onOpenDishModal: (item: MenuItem) => void;
  onTrackOrder: (order: Order) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  restaurants,
  reviews,
  activeOrders,
  onOpenDishModal,
  onTrackOrder
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuSearch, setMenuSearch] = useState('');

  const categories = ['All', 'Hyderabadi', 'Pizzas', 'Burgers', 'Italian', 'Healthy'];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.featuredItems.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      r.cuisine.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());

    const matchesVeg = !pureVegOnly || r.isPureVeg;
    const matchesRating = !topRatedOnly || r.rating >= 4.7;

    return matchesSearch && matchesCategory && matchesVeg && matchesRating;
  });

  return (
    <div className="space-y-6">
      
      {/* ACTIVE ORDER BANNER */}
      {activeOrders.length > 0 && (
        <div className="bg-[#161b22] border border-[#f97316]/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-medium tracking-wider text-[#8b949e]">Active Order Mission</p>
              <h4 className="text-xs font-medium text-[#f0f6fc]">
                {activeOrders[0].restaurantName} — Status: <span className="text-[#f97316] font-medium">{activeOrders[0].status}</span>
              </h4>
            </div>
          </div>
          <button
            onClick={() => onTrackOrder(activeOrders[0])}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            Track GPS Delivery
          </button>
        </div>
      )}

      {/* RESTAURANT EXPLORER VIEW */}
      {!selectedRestaurant ? (
        <>
          {/* Asymmetric High-Density Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Main Search & Heading Column */}
            <div className="lg:col-span-8 bg-[#161b22] border border-[#21262d] p-6 sm:p-8 rounded-xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-medium text-[#f97316] uppercase tracking-wider">
                  Hyderabadi Gourmet & Express Delivery
                </span>
                <h1 className="text-2xl sm:text-3xl font-medium text-[#f0f6fc] mt-1 leading-tight">
                  Online Food Delivery System
                </h1>
                <p className="text-xs text-[#8b949e] mt-1 max-w-xl">
                  Order authentic Hyderabadi Mutton Dum Biryani, Neapolitan sourdough pizzas, smash burgers, and fresh grain bowls with real-time GPS telemetry tracking.
                </p>
              </div>

              {/* High-density search bar */}
              <div className="relative pt-2">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b949e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, biryanis, pizzas, or restaurants..."
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#30363d]"
                />
              </div>
            </div>

            {/* Asymmetric Quick Stat Panel */}
            <div className="lg:col-span-4 bg-[#161b22] border border-[#21262d] p-6 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] uppercase font-medium text-[#8b949e]">System Parameters</span>
                <h3 className="text-sm font-medium text-[#f0f6fc] mt-0.5">Delivery Service Metrics</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#21262d]">
                  <span className="text-[#8b949e]">Avg Prep Time</span>
                  <span className="font-medium text-[#f0f6fc]">18.5 Mins</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#21262d]">
                  <span className="text-[#8b949e]">Platform Fee</span>
                  <span className="font-medium text-[#f0f6fc]">₹10 Flat</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8b949e]">Active Kitchens</span>
                  <span className="font-medium text-[#3fb950]">4 Operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills & Toggle Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                      : 'bg-[#0d1117] text-[#8b949e] hover:text-[#f0f6fc] border border-[#21262d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Toggle Filters */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setPureVegOnly(!pureVegOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  pureVegOnly
                    ? 'bg-[#238636]/10 text-[#3fb950] border-[#238636]/40'
                    : 'bg-[#0d1117] text-[#8b949e] border-[#21262d]'
                }`}
              >
                Pure Veg
              </button>

              <button
                onClick={() => setTopRatedOnly(!topRatedOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  topRatedOnly
                    ? 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/40'
                    : 'bg-[#0d1117] text-[#8b949e] border-[#21262d]'
                }`}
              >
                4.7+ Rating
              </button>
            </div>
          </div>

          {/* Restaurant Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium text-[#f0f6fc]">
                Restaurants ({filteredRestaurants.length})
              </h2>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-8 text-center text-[#8b949e] space-y-1">
                <h4 className="text-sm font-medium text-[#f0f6fc]">No Restaurants Match Filters</h4>
                <p className="text-xs">Adjust your search input or clear active filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => setSelectedRestaurant(rest)}
                    className="bg-[#161b22] border border-[#21262d] hover:border-[#30363d] rounded-xl overflow-hidden cursor-pointer flex flex-col transition"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={rest.heroImage}
                        alt={rest.name}
                        className="w-full h-full object-cover"
                      />
                      {rest.discountBadge && (
                        <div className="absolute top-2 left-2 bg-[#0d1117]/90 text-[#f97316] text-[10px] font-medium px-2 py-0.5 rounded border border-[#21262d]">
                          {rest.discountBadge}
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-[#0d1117]/90 px-2 py-0.5 rounded text-[11px] font-medium text-[#d29922] flex items-center gap-1 border border-[#21262d]">
                        <Star className="w-3 h-3 fill-[#d29922]" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-[#f0f6fc] truncate">
                            {rest.name}
                          </h3>
                          {rest.isPureVeg && (
                            <span className="text-[9px] font-medium text-[#3fb950] border border-[#238636]/30 px-1 rounded">
                              VEG
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8b949e] mt-0.5 line-clamp-1">{rest.cuisine.join(', ')}</p>
                      </div>

                      <div className="pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px] text-[#8b949e]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#f97316]" /> {rest.deliveryTimeMinutes} Mins
                        </span>
                        <span>₹{rest.costForTwo} for two</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-[#f0f6fc]">
              Customer Reviews & Benchmarks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-[#0d1117] p-3.5 rounded-lg border border-[#21262d] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#f0f6fc] text-xs">{rev.userName}</span>
                    <span className="text-[#d29922] text-xs font-medium">★ {rev.rating}.0</span>
                  </div>
                  <p className="text-xs text-[#8b949e]">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* RESTAURANT DETAILED MENU VIEW */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="flex items-center space-x-1.5 text-xs font-medium text-[#f97316] hover:underline bg-[#161b22] px-3 py-1.5 rounded-lg border border-[#21262d]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Restaurant Directory</span>
          </button>

          {/* Restaurant Hero Banner */}
          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-medium text-[#f0f6fc]">{selectedRestaurant.name}</h1>
                <span className="bg-[#21262d] text-[#d29922] border border-[#30363d] text-xs font-medium px-2 py-0.5 rounded">
                  ★ {selectedRestaurant.rating}
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">{selectedRestaurant.tagline}</p>
              <p className="text-[11px] text-[#8b949e]">{selectedRestaurant.cuisine.join(', ')} • {selectedRestaurant.address}</p>
            </div>

            <img
              src={selectedRestaurant.heroImage}
              alt={selectedRestaurant.name}
              className="w-full md:w-48 h-28 rounded-lg object-cover border border-[#21262d]"
            />
          </div>

          {/* Menu Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder={`Search dishes in ${selectedRestaurant.name}...`}
              className="w-full bg-[#161b22] border border-[#21262d] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#30363d]"
            />
          </div>

          {/* Dishes List */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-[#f0f6fc]">Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedRestaurant.featuredItems
                .filter((item) => item.name.toLowerCase().includes(menuSearch.toLowerCase()))
                .map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-[#161b22] border border-[#21262d] p-4 rounded-xl flex justify-between gap-3"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-sm border ${
                          dish.isVeg ? 'border-[#3fb950] bg-[#238636]/20' : 'border-[#f85149] bg-[#f85149]/20'
                        }`} />
                      </div>
                      <h4 className="font-medium text-[#f0f6fc] text-xs">{dish.name}</h4>
                      <p className="text-[11px] text-[#8b949e] line-clamp-2">{dish.description}</p>
                      <p className="text-xs font-medium text-[#f97316]">₹{dish.price}</p>
                    </div>

                    <div className="flex flex-col items-center justify-between shrink-0">
                      <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-lg object-cover border border-[#21262d]" />
                      <button
                        onClick={() => onOpenDishModal(dish)}
                        className="mt-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-medium text-xs px-3 py-1 rounded-md transition"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
