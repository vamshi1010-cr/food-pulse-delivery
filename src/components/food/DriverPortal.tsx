import React from 'react';
import { Bike, Navigation, CheckCircle } from 'lucide-react';
import type { Order, OrderStatus, DriverInfo } from '../../types/food';

interface DriverPortalProps {
  driver: DriverInfo;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ driver, orders, onUpdateStatus }) => {
  const activeDelivery = orders.find((o) => o.status === 'OUT_FOR_DELIVERY');
  const availableOrders = orders.filter((o) => o.status === 'PREPARING' || o.status === 'CONFIRMED');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Driver Profile Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={driver.avatar} 
            alt={driver.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">{driver.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" /> Duty Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{driver.vehicleNumber} • Rating: ★ {driver.rating}</p>
          </div>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium">Today's Earnings</p>
          <p className="text-2xl font-extrabold text-cyan-400">₹1,240</p>
        </div>
      </div>

      {/* ACTIVE DELIVERY IN PROGRESS */}
      {activeDelivery ? (
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Active Delivery Mission #{activeDelivery.id.slice(-6)}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">
                Pickup from {activeDelivery.restaurantName}
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1">
              <Navigation className="w-4 h-4 animate-spin" /> In Transit
            </span>
          </div>

          {/* Route Pins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Pickup Restaurant</span>
              <p className="font-bold text-slate-200 text-sm">{activeDelivery.restaurantName}</p>
              <p className="text-xs text-slate-400">{activeDelivery.restaurantAddress}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Dropoff Customer</span>
              <p className="font-bold text-slate-200 text-sm">{activeDelivery.deliveryAddress.label}</p>
              <p className="text-xs text-slate-400">{activeDelivery.deliveryAddress.street}</p>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => onUpdateStatus(activeDelivery.id, 'DELIVERED')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 transition active:scale-[0.99]"
          >
            <CheckCircle className="w-5 h-5" />
            <span>SWIPE TO MARK DELIVERED TO CUSTOMER</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
          <Bike className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-200">No Active Trip right now</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Stay in high-demand zones like Hitec City & Jubilee Hills to receive fast delivery dispatches.
          </p>
        </div>
      )}

      {/* AVAILABLE ORDERS TO ACCEPT */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Available Dispatch Requests Nearby</h3>

        {availableOrders.length === 0 ? (
          <p className="text-xs text-slate-500">No pending dispatches waiting right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableOrders.map((ord) => (
              <div key={ord.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-sm">{ord.restaurantName}</h5>
                  <p className="text-xs text-slate-400">To {ord.deliveryAddress.area} (3.2 km)</p>
                  <p className="text-xs text-emerald-400 font-bold mt-1">Payout: ₹65</p>
                </div>
                <button
                  onClick={() => onUpdateStatus(ord.id, 'OUT_FOR_DELIVERY')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Accept Dispatch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
