import React, { useState } from 'react';
import { 
  Store, 
  ChefHat, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ToggleLeft, 
  ToggleRight,
  Utensils
} from 'lucide-react';
import type { Order, OrderStatus, Restaurant } from '../../types/food';

interface MerchantDashboardProps {
  restaurant: Restaurant;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onToggleItemAvailability: (itemId: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  restaurant,
  orders,
  onUpdateStatus,
  onToggleItemAvailability
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU' | 'ANALYTICS'>('ORDERS');

  // Filter orders related to this merchant
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED');

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 14500;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Merchant Header */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 p-6 sm:p-8 rounded-3xl border border-purple-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white">{restaurant.name}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Kitchen Online
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{restaurant.address} • Merchant Portal</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'ORDERS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Live Kitchen Orders ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MENU')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'MENU'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'ANALYTICS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Orders</p>
            <p className="text-2xl font-extrabold text-white">{activeOrders.length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Today's Revenue</p>
            <p className="text-2xl font-extrabold text-emerald-400">₹{totalRevenue}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg Kitchen Prep Time</p>
            <p className="text-2xl font-extrabold text-white">16.4 Mins</p>
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* ORDERS QUEUE */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-purple-400" /> Incoming Kitchen Orders Queue
          </h3>

          {activeOrders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-200">Kitchen Queue Clean!</h4>
              <p className="text-xs text-slate-400 mt-1">No pending active orders right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                        #{order.id.slice(-6)}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">Delivering to {order.deliveryAddress.label}</h4>
                      <p className="text-[11px] text-slate-400">{order.createdAt}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((it) => (
                      <div key={it.cartItemId} className="flex justify-between items-center text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <span className="font-bold text-white">{it.quantity}x </span>
                          <span>{it.menuItem.name}</span>
                        </div>
                        <span className="font-bold text-orange-400">₹{it.itemTotalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons for Kitchen */}
                  <div className="pt-2 flex gap-2">
                    {order.status === 'PLACED' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-bold text-xs transition"
                      >
                        Accept & Confirm
                      </button>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-xl font-bold text-xs transition"
                      >
                        Start Cooking (In Kitchen)
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs transition"
                      >
                        Handover to Delivery Driver
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MENU MANAGER */}
      {activeTab === 'MENU' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Restaurant Dishes & Stock Availability</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant.featuredItems.map((dish) => (
              <div key={dish.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4">
                <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-white text-sm truncate">{dish.name}</h5>
                  <p className="text-xs text-orange-400 font-bold">₹{dish.price}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {dish.available ? 'In Stock' : 'Sold Out'}
                  </p>
                </div>
                <button
                  onClick={() => onToggleItemAvailability(dish.id)}
                  className={`p-2 rounded-xl transition ${
                    dish.available ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  {dish.available ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-center">
          <h3 className="text-lg font-bold text-white">Sales & Customer Rating Trends</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Order volume is peak during weekends between 7:00 PM and 10:30 PM. Hyderabadi Dum Biryani accounts for 62% of daily revenue.
          </p>
        </div>
      )}

    </div>
  );
};
