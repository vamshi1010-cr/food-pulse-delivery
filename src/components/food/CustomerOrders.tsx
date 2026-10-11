import React from 'react';
import { 
  PackageCheck, 
  Bike, 
  Clock, 
  RotateCcw, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import type { Order, CartItem } from '../../types/food';

interface CustomerOrdersProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onReorder: (items: CartItem[]) => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({ orders, onTrackOrder, onReorder }) => {
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const pastOrders = orders.filter((o) => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-1">
        <h1 className="text-xl font-medium text-[#f0f6fc] flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-[#f97316]" /> My Customer Orders & Tracking History
        </h1>
        <p className="text-xs text-[#8b949e]">
          Track active GPS delivery telemetry or reorder your favorite Hyderabadi biryanis & pizzas.
        </p>
      </div>

      {/* SECTION 1: LIVE ACTIVE ORDERS */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[#f0f6fc] flex items-center gap-2">
          <Bike className="w-4 h-4 text-[#f97316]" /> Live Active Orders ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 text-center text-[#8b949e] space-y-1">
            <CheckCircle2 className="w-8 h-8 text-[#3fb950] mx-auto" />
            <h4 className="text-xs font-medium text-[#f0f6fc]">No Live Deliveries Right Now</h4>
            <p className="text-[11px]">Browse restaurants to place a new food order!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((ord) => (
              <div key={ord.id} className="bg-[#161b22] border border-[#f97316]/50 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-[#21262d]">
                  <div>
                    <span className="text-[10px] font-medium text-[#f97316] uppercase bg-[#f97316]/10 px-2 py-0.5 rounded border border-[#f97316]/30">
                      Order #{ord.id.slice(-6)}
                    </span>
                    <h3 className="text-sm font-medium text-[#f0f6fc] mt-1">{ord.restaurantName}</h3>
                    <p className="text-[11px] text-[#8b949e]">{ord.createdAt}</p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded bg-[#d29922]/20 text-[#d29922] border border-[#d29922]/40">
                    {ord.status}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs text-[#c9d1d9]">
                  {ord.items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between bg-[#0d1117] p-2 rounded border border-[#21262d]">
                      <span>{it.quantity}x {it.menuItem.name}</span>
                      <span className="font-mono text-[#f97316]">₹{it.itemTotalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8b949e] block">Total Amount</span>
                    <span className="text-sm font-mono font-medium text-[#f0f6fc]">₹{ord.totalAmount}</span>
                  </div>
                  <button
                    onClick={() => onTrackOrder(ord)}
                    className="bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <span>Track Live GPS Map</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: PAST ORDERS HISTORY */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[#f0f6fc]">
          Past Delivered Orders History ({pastOrders.length})
        </h2>

        {pastOrders.length === 0 ? (
          <p className="text-xs text-[#8b949e]">No past delivered orders found.</p>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((ord) => (
              <div key={ord.id} className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-[#f0f6fc] text-sm">{ord.restaurantName}</h4>
                    <span className="text-[10px] font-medium text-[#3fb950] bg-[#238636]/20 px-2 py-0.5 rounded border border-[#238636]/40">
                      DELIVERED
                    </span>
                  </div>
                  <p className="text-xs text-[#8b949e]">
                    {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-[#8b949e] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8b949e]" /> Delivered on {ord.createdAt} • Address: {ord.deliveryAddress.label}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="text-sm font-mono font-medium text-[#f0f6fc]">₹{ord.totalAmount}</span>
                  <button
                    onClick={() => onReorder(ord.items)}
                    className="bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] text-[#f97316] hover:text-[#ea580c] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder Dishes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
