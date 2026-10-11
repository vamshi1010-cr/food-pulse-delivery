import React from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  MapPin, 
  BookOpen, 
  Store, 
  Bike, 
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  PackageCheck
} from 'lucide-react';
import type { UserAddress } from '../../types/food';
import type { UserSession } from '../../types/auth';

interface NavbarProps {
  activeView: 'CUSTOMER' | 'CUSTOMER_ORDERS' | 'MERCHANT' | 'DRIVER' | 'SE_STUDIO';
  setActiveView: (view: 'CUSTOMER' | 'CUSTOMER_ORDERS' | 'MERCHANT' | 'DRIVER' | 'SE_STUDIO') => void;
  cartCount: number;
  openCart: () => void;
  selectedAddress: UserAddress;
  addresses: UserAddress[];
  onSelectAddress: (addr: UserAddress) => void;
  activeOrderCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentUserSession: UserSession | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartCount,
  openCart,
  selectedAddress,
  addresses,
  onSelectAddress,
  activeOrderCount,
  theme,
  onToggleTheme,
  currentUserSession,
  onLogout
}) => {
  const [showAddrDropdown, setShowAddrDropdown] = React.useState(false);

  const role = currentUserSession?.role || 'CUSTOMER';

  const getProfileDisplayName = () => {
    if (!currentUserSession) return null;
    const p = currentUserSession.profile;
    if (role === 'CUSTOMER') {
      return (p as any).name || 'Customer';
    } else if (role === 'MERCHANT') {
      return (p as any).restaurantName || 'Merchant';
    } else {
      return (p as any).name || 'Driver';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#161b22] border-b border-[#21262d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              if (role === 'CUSTOMER') setActiveView('CUSTOMER');
              else if (role === 'MERCHANT') setActiveView('MERCHANT');
              else if (role === 'DRIVER') setActiveView('DRIVER');
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-[#f97316] flex items-center justify-center text-white">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium tracking-tight text-[#f0f6fc]">
                  FoodPulse
                </span>
                <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                  {role} Portal
                </span>
              </div>
              <p className="text-[11px] text-[#8b949e] font-normal hidden sm:block">
                CBIT 22CSC21N SE Case Study Platform
              </p>
            </div>
          </div>

          {/* Location Selector (Visible in Customer mode only) */}
          {(role === 'CUSTOMER' && (activeView === 'CUSTOMER' || activeView === 'CUSTOMER_ORDERS')) && (
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowAddrDropdown(!showAddrDropdown)}
                className="flex items-center space-x-2 bg-[#0d1117] hover:bg-[#21262d] px-3 py-1.5 rounded-lg border border-[#21262d] text-xs transition"
              >
                <MapPin className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                <div className="text-left max-w-[180px] truncate">
                  <span className="font-medium text-[#f0f6fc] block text-[11px]">{selectedAddress.label}</span>
                  <span className="text-[#8b949e] text-[10px] truncate block">{selectedAddress.street}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
              </button>

              {showAddrDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-[#161b22] rounded-lg shadow-xl p-2 z-50 border border-[#21262d]">
                  <p className="text-[10px] font-medium text-[#8b949e] px-2 py-1 uppercase tracking-wider">Delivery Location</p>
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        setShowAddrDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                        selectedAddress.id === addr.id 
                          ? 'bg-[#21262d] text-[#f97316] font-medium border border-[#30363d]' 
                          : 'hover:bg-[#21262d] text-[#c9d1d9]'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{addr.label}</div>
                        <div className="text-[#8b949e] text-[10px] truncate max-w-[180px]">{addr.street}</div>
                      </div>
                      {selectedAddress.id === addr.id && <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Strict Role-Based Navigation Bar */}
          <div className="flex items-center space-x-2">
            
            {/* Active User Session Profile Badge */}
            {currentUserSession && (
              <div className="hidden lg:flex items-center space-x-2 bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#21262d] text-xs">
                <UserCheck className="w-3.5 h-3.5 text-[#3fb950]" />
                <span className="font-medium text-[#f0f6fc] max-w-[140px] truncate">
                  {getProfileDisplayName()}
                </span>
                <span className="text-[10px] uppercase font-medium text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
                  {role}
                </span>
              </div>
            )}

            {/* Navigation Role Tabs - STRICTLY ISOLATED BY ROLE */}
            <div className="flex items-center space-x-1 bg-[#0d1117] p-1 rounded-lg border border-[#21262d]">
              
              {/* CUSTOMER ROLE ONLY BUTTONS */}
              {role === 'CUSTOMER' && (
                <>
                  <button
                    onClick={() => setActiveView('CUSTOMER')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition ${
                      activeView === 'CUSTOMER'
                        ? 'bg-[#f97316] text-white'
                        : 'text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Order Food</span>
                  </button>

                  <button
                    onClick={() => setActiveView('CUSTOMER_ORDERS')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition ${
                      activeView === 'CUSTOMER_ORDERS'
                        ? 'bg-[#21262d] text-white border border-[#30363d]'
                        : 'text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-[#f97316]" />
                    <span>My Orders & Live Track</span>
                    {activeOrderCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#f97316] text-white text-[9px] font-medium flex items-center justify-center animate-pulse">
                        {activeOrderCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* MERCHANT ROLE ONLY BUTTONS */}
              {role === 'MERCHANT' && (
                <button
                  onClick={() => setActiveView('MERCHANT')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition ${
                    activeView === 'MERCHANT'
                      ? 'bg-[#21262d] text-white border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span>Kitchen Admin Portal</span>
                  {activeOrderCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#3fb950] text-white text-[9px] font-medium flex items-center justify-center">
                      {activeOrderCount}
                    </span>
                  )}
                </button>
              )}

              {/* DRIVER ROLE ONLY BUTTONS */}
              {role === 'DRIVER' && (
                <button
                  onClick={() => setActiveView('DRIVER')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition ${
                    activeView === 'DRIVER'
                      ? 'bg-[#21262d] text-white border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Driver Navigation Portal</span>
                </button>
              )}

              {/* ACADEMIC SYLLABUS STUDIO BUTTON - COMMON ACCESSIBLE */}
              <button
                onClick={() => setActiveView('SE_STUDIO')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition ${
                  activeView === 'SE_STUDIO'
                    ? 'bg-[#238636] text-white'
                    : 'text-[#3fb950] bg-[#238636]/10 border border-[#238636]/30'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>SE 22CSC21N Studio</span>
              </button>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] transition flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#d29922]" />
              ) : (
                <Moon className="w-4 h-4 text-[#57606a]" />
              )}
            </button>

            {/* Logout / Switch Role Button */}
            {currentUserSession && (
              <button
                onClick={onLogout}
                title="Switch Role / Logout"
                className="p-2 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] text-[#f85149] transition flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Cart Button (Customer role only) */}
            {role === 'CUSTOMER' && (
              <button
                onClick={openCart}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-[#0d1117] text-[#f97316] font-medium text-[11px] px-1.5 py-0.5 rounded border border-[#f97316]/40">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
