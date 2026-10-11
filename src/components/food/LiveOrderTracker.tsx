import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Bike, 
  Utensils, 
  ChefHat, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Order, OrderStatus } from '../../types/food';

interface LiveOrderTrackerProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ order, onUpdateStatus }) => {
  const [etaMinutes, setEtaMinutes] = useState(24);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: 'Namaste! I have accepted your delivery task and am heading to Paradise Biryani.', time: 'Just now' }
  ]);

  // Order timeline steps definition
  const steps: { status: OrderStatus; label: string; icon: React.ComponentType<any>; description: string }[] = [
    { status: 'PLACED', label: 'Order Placed', icon: ShoppingBag, description: 'Sent to restaurant kitchen' },
    { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, description: 'Restaurant accepted order' },
    { status: 'PREPARING', label: 'In Kitchen', icon: ChefHat, description: 'Chef is preparing your meal' },
    { status: 'OUT_FOR_DELIVERY', label: 'On The Way', icon: Bike, description: 'Driver assigned & delivering' },
    { status: 'DELIVERED', label: 'Delivered', icon: Sparkles, description: 'Enjoy your hot meal!' }
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  // Simulated GPS movement & ETA tick
  useEffect(() => {
    if (order.status === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setEtaMinutes((prev) => Math.max(1, prev - 1));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [order.status]);

  // Trigger celebration confetti on DELIVERED status
  useEffect(() => {
    if (order.status === 'DELIVERED') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [order.status]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = { sender: 'user' as const, text: chatMessage, time: 'Now' };
    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'driver', text: 'Got it! Driving carefully with hot food container.', time: 'Just now' }
      ]);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Live Order #{order.id.slice(-6)}
            </span>
            <span className="text-xs text-slate-400">{order.createdAt}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {order.restaurantName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Delivering to: <strong className="text-slate-200">{order.deliveryAddress.label}</strong> ({order.deliveryAddress.street})
          </p>
        </div>

        {/* ETA Badge */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700/60 rounded-2xl p-4 flex items-center space-x-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Estimated Delivery Time</div>
            <div className="text-2xl font-extrabold text-white">
              {order.status === 'DELIVERED' ? 'DELIVERED!' : `${etaMinutes} Mins`}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div className="relative pt-2 pb-4">
        <div className="flex items-center justify-between relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="flex flex-col items-center text-center max-w-[100px]">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-orange-500 border-amber-400 text-white shadow-lg shadow-orange-500/40 scale-110 animate-bounce'
                    : isDone
                    ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className={`text-xs font-bold mt-2 ${isDone ? 'text-slate-200' : 'text-slate-600'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">{step.description}</span>
              </div>
            );
          })}
        </div>

        {/* Background Connecting Bar */}
        <div className="absolute top-7 sm:top-8 left-6 right-6 h-1 bg-slate-800 -z-0">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Simulated Live GPS Map View */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 h-80 shadow-2xl">
        
        {/* Map Canvas Background grid simulation */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        
        {/* Simulated Road Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800 stroke-[4] fill-none">
          <path d="M 50 120 Q 200 80, 350 160 T 650 200 T 800 120" strokeDasharray="6 6" />
          <path d="M 100 240 Q 300 280, 500 180 T 750 260" strokeDasharray="8 8" />
        </svg>

        {/* Restaurant Pin */}
        <div className="absolute top-16 left-12 sm:left-24 flex items-center space-x-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-xl">
          <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
            <Utensils className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">{order.restaurantName}</p>
            <p className="text-[10px] text-slate-400">Kitchen Base Pin</p>
          </div>
        </div>

        {/* Customer Address Pin */}
        <div className="absolute bottom-12 right-12 sm:right-24 flex items-center space-x-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-xl">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">{order.deliveryAddress.label}</p>
            <p className="text-[10px] text-slate-400">{order.deliveryAddress.street}</p>
          </div>
        </div>

        {/* Live Driver Moving Marker */}
        <div 
          className="absolute transition-all duration-1000 ease-out transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: order.status === 'DELIVERED' ? '70%' : order.status === 'OUT_FOR_DELIVERY' ? '45%' : '25%',
            left: order.status === 'DELIVERED' ? '80%' : order.status === 'OUT_FOR_DELIVERY' ? '50%' : '20%'
          }}
        >
          <div className="relative group">
            <div className="w-14 h-14 rounded-full bg-orange-500/30 border-2 border-orange-400 flex items-center justify-center shadow-2xl animate-map-pulse">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Bike className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap">
              {order.driver?.name || 'Driver Vikram'} (GPS Active)
            </div>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Live GPS Telemetry Active (5G Node)
        </div>
      </div>

      {/* Driver Information & Actions Card */}
      {order.driver && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <img 
              src={order.driver.avatar} 
              alt={order.driver.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500/40"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-white text-base">{order.driver.name}</h4>
                <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ★ {order.driver.rating}
                </span>
              </div>
              <p className="text-xs text-slate-400">{order.driver.vehicleNumber}</p>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Vaccinated & Insulated Thermal Bag
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setCallModalOpen(true)}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 transition"
            >
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span>Chat / Message</span>
            </button>
            
            <a
              href={`tel:${order.driver.phone}`}
              className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Driver</span>
            </a>
          </div>
        </div>
      )}

      {/* Simulation Controls for Demo */}
      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Demo State Simulator:
        </span>
        <div className="flex flex-wrap gap-2">
          {steps.map((st) => (
            <button
              key={st.status}
              onClick={() => onUpdateStatus(order.id, st.status)}
              className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                order.status === st.status
                  ? 'bg-orange-500 text-white border-orange-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              Set {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Driver Chat Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-base">Chat with {order.driver?.name}</h4>
              <button onClick={() => setCallModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="h-48 overflow-y-auto space-y-3 p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-orange-500 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about delivery ETA..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
