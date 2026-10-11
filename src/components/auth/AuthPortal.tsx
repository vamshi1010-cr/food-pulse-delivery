import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Store, 
  Bike, 
  ArrowRight, 
  BookOpen, 
  Lock, 
  Mail, 
  User 
} from 'lucide-react';
import type { UserRole, UserSession } from '../../types/auth';

interface AuthPortalProps {
  onLoginSuccess: (session: UserSession) => void;
  onBypassToStudio: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess, onBypassToStudio }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Customer Form Fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custStreet, setCustStreet] = useState('');
  const [custArea, setCustArea] = useState('');
  const [custPassword, setCustPassword] = useState('');

  // Merchant Form Fields
  const [merchRestName, setMerchRestName] = useState('');
  const [merchEmail, setMerchEmail] = useState('');
  const [merchAddress, setMerchAddress] = useState('');
  const [merchLicense, setMerchLicense] = useState('');
  const [merchPassword, setMerchPassword] = useState('');

  // Driver Form Fields
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'Electric Scooter' | 'Motorcycle'>('Electric Scooter');
  const [driverPassword, setDriverPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Demo Logins
  const handleQuickDemo = (role: UserRole) => {
    if (role === 'CUSTOMER') {
      onLoginSuccess({
        role: 'CUSTOMER',
        profile: {
          id: 'cust-demo-1',
          name: 'Ananya Sharma (CBIT Student)',
          email: 'ananya.sharma@cbit.ac.in',
          phone: '+91 98765 43210',
          defaultAddress: {
            label: 'Home',
            street: 'Plot 42, Jubilee Hills Road No. 36',
            area: 'Jubilee Hills',
            city: 'Hyderabad',
            zipCode: '500033'
          }
        },
        token: 'demo-jwt-token-customer'
      });
    } else if (role === 'MERCHANT') {
      onLoginSuccess({
        role: 'MERCHANT',
        profile: {
          id: 'rest-1',
          restaurantName: 'Paradise Dum Biryani & Kebabs',
          ownerName: 'Mirza Ali Khan',
          email: 'partner@paradisebiryani.com',
          phone: '+91 91234 56789',
          cuisine: ['Hyderabadi', 'North Indian', 'Mughlai'],
          address: 'Near Cyber Towers, Hitec City, Hyderabad',
          fssaiLicense: '13322005000124'
        },
        token: 'demo-jwt-token-merchant'
      });
    } else {
      onLoginSuccess({
        role: 'DRIVER',
        profile: {
          id: 'drv-789',
          name: 'Vikram Singh',
          phone: '+91 98765 43210',
          licenseNumber: 'TS-09-2022-0049182',
          vehicleType: 'Electric Scooter',
          vehicleNumber: 'TS 09 EZ 4521',
          rating: 4.9
        },
        token: 'demo-jwt-token-driver'
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedRole) {
      setErrorMsg('Please select a role first.');
      return;
    }

    if (selectedRole === 'CUSTOMER') {
      if (mode === 'LOGIN') {
        if (!custEmail || !custPassword) {
          setErrorMsg('Please enter both Email/Phone and Password.');
          return;
        }
      }
      onLoginSuccess({
        role: 'CUSTOMER',
        profile: {
          id: `cust-${Date.now()}`,
          name: custName || 'Ananya Sharma',
          email: custEmail || 'ananya@cbit.ac.in',
          phone: '+91 98765 43210',
          defaultAddress: {
            label: 'Home',
            street: custStreet || 'Road No 36',
            area: custArea || 'Jubilee Hills',
            city: 'Hyderabad',
            zipCode: '500033'
          }
        },
        token: 'jwt-auth-token-customer'
      });
    } else if (selectedRole === 'MERCHANT') {
      onLoginSuccess({
        role: 'MERCHANT',
        profile: {
          id: `rest-${Date.now()}`,
          restaurantName: merchRestName || 'Paradise Dum Biryani',
          ownerName: 'Mirza Ali Khan',
          email: merchEmail || 'merchant@foodpulse.com',
          phone: '+91 91234 56789',
          cuisine: ['Hyderabadi', 'North Indian'],
          address: merchAddress || 'Hitec City, Hyderabad',
          fssaiLicense: merchLicense || '13322005000124'
        },
        token: 'jwt-auth-token-merchant'
      });
    } else if (selectedRole === 'DRIVER') {
      onLoginSuccess({
        role: 'DRIVER',
        profile: {
          id: `drv-${Date.now()}`,
          name: driverName || 'Vikram Singh',
          phone: '+91 98765 43210',
          licenseNumber: driverLicense || 'TS-09-2022-0049182',
          vehicleType,
          vehicleNumber: vehicleNumber || 'TS 09 EZ 4521',
          rating: 4.9
        },
        token: 'jwt-auth-token-driver'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f97316] text-white shadow-md">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#f0f6fc]">
            FoodPulse Authentication Portal
          </h1>
          <p className="text-xs text-[#8b949e] max-w-md mx-auto">
            Select your account type to access the food delivery platform or the 22CSC21N Software Engineering Studio.
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION GRID */}
        {!selectedRole ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Role Card 1: Customer */}
              <div 
                onClick={() => setSelectedRole('CUSTOMER')}
                className="bg-[#161b22] border border-[#21262d] hover:border-[#f97316]/60 rounded-xl p-5 cursor-pointer flex flex-col justify-between space-y-4 group transition"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-medium text-[#8b949e]">Role 01</span>
                    <h3 className="text-base font-medium text-[#f0f6fc] group-hover:text-[#f97316] transition">
                      Food Customer
                    </h3>
                    <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
                      Browse Hyderabadi restaurants, customize dish addons, apply promo coupons & track live GPS delivery map.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs font-medium text-[#f97316]">
                  <span>Login / Signup as Customer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Role Card 2: Merchant */}
              <div 
                onClick={() => setSelectedRole('MERCHANT')}
                className="bg-[#161b22] border border-[#21262d] hover:border-[#3fb950]/60 rounded-xl p-5 cursor-pointer flex flex-col justify-between space-y-4 group transition"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#238636]/10 border border-[#238636]/30 text-[#3fb950] flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-medium text-[#8b949e]">Role 02</span>
                    <h3 className="text-base font-medium text-[#f0f6fc] group-hover:text-[#3fb950] transition">
                      Restaurant Merchant
                    </h3>
                    <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
                      Accept incoming kitchen orders, manage dish menu availability, and track daily revenue analytics.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs font-medium text-[#3fb950]">
                  <span>Login / Signup as Merchant</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Role Card 3: Delivery Partner */}
              <div 
                onClick={() => setSelectedRole('DRIVER')}
                className="bg-[#161b22] border border-[#21262d] hover:border-[#58a6ff]/60 rounded-xl p-5 cursor-pointer flex flex-col justify-between space-y-4 group transition"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#388bfd]/10 border border-[#388bfd]/30 text-[#58a6ff] flex items-center justify-center">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-medium text-[#8b949e]">Role 03</span>
                    <h3 className="text-base font-medium text-[#f0f6fc] group-hover:text-[#58a6ff] transition">
                      Delivery Driver
                    </h3>
                    <p className="text-xs text-[#8b949e] mt-1 leading-relaxed">
                      Accept dispatch requests, navigate pickup & customer dropoff routes, and mark orders delivered.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs font-medium text-[#58a6ff]">
                  <span>Login / Signup as Driver</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Quick Demo Access Options */}
            <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-3 text-center">
              <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wider block">
                Instant One-Click Demo Access
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleQuickDemo('CUSTOMER')}
                  className="bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] text-[#f97316] text-xs font-medium px-3.5 py-2 rounded-lg transition"
                >
                  ⚡ Demo Customer Login
                </button>
                <button
                  onClick={() => handleQuickDemo('MERCHANT')}
                  className="bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] text-[#3fb950] text-xs font-medium px-3.5 py-2 rounded-lg transition"
                >
                  ⚡ Demo Merchant Login
                </button>
                <button
                  onClick={() => handleQuickDemo('DRIVER')}
                  className="bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] text-[#58a6ff] text-xs font-medium px-3.5 py-2 rounded-lg transition"
                >
                  ⚡ Demo Driver Login
                </button>
                <button
                  onClick={onBypassToStudio}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium px-3.5 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore 22CSC21N SE Studio</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: ROLE-SPECIFIC LOGIN / SIGNUP FORM */
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 sm:p-8 max-w-lg mx-auto space-y-6">
            
            {/* Role Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#21262d]">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-[#8b949e]">Role selected:</span>
                <span className="text-xs font-medium text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded border border-[#f97316]/30">
                  {selectedRole}
                </span>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc] underline"
              >
                Change Role
              </button>
            </div>

            {/* Mode Switcher: Login / Signup */}
            <div className="grid grid-cols-2 gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#21262d]">
              <button
                onClick={() => setMode('LOGIN')}
                className={`py-2 text-xs font-medium rounded-md transition ${
                  mode === 'LOGIN' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#8b949e]'
                }`}
              >
                Account Login
              </button>
              <button
                onClick={() => setMode('SIGNUP')}
                className={`py-2 text-xs font-medium rounded-md transition ${
                  mode === 'SIGNUP' ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#8b949e]'
                }`}
              >
                New Account Signup
              </button>
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* CUSTOMER FORM */}
              {selectedRole === 'CUSTOMER' && (
                <>
                  {mode === 'SIGNUP' && (
                    <div>
                      <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
                        <input
                          type="text"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#30363d]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Email / Phone Number</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
                      <input
                        type="text"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="e.g. customer@cbit.ac.in or +91 9876543210"
                        className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#30363d]"
                      />
                    </div>
                  </div>

                  {mode === 'SIGNUP' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Street Address</label>
                        <input
                          type="text"
                          value={custStreet}
                          onChange={(e) => setCustStreet(e.target.value)}
                          placeholder="Road No 36"
                          className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Area / Locality</label>
                        <input
                          type="text"
                          value={custArea}
                          onChange={(e) => setCustArea(e.target.value)}
                          placeholder="Jubilee Hills"
                          className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
                      <input
                        type="password"
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#30363d]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* MERCHANT FORM */}
              {selectedRole === 'MERCHANT' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Restaurant / Merchant Name</label>
                    <input
                      type="text"
                      value={merchRestName}
                      onChange={(e) => setMerchRestName(e.target.value)}
                      placeholder="e.g. Paradise Dum Biryani & Kebabs"
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Merchant Email / Owner ID</label>
                    <input
                      type="text"
                      value={merchEmail}
                      onChange={(e) => setMerchEmail(e.target.value)}
                      placeholder="partner@restaurant.com"
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                    />
                  </div>

                  {mode === 'SIGNUP' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1">FSSAI License Registration No.</label>
                        <input
                          type="text"
                          value={merchLicense}
                          onChange={(e) => setMerchLicense(e.target.value)}
                          placeholder="13322005000124"
                          className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Kitchen Address</label>
                        <input
                          type="text"
                          value={merchAddress}
                          onChange={(e) => setMerchAddress(e.target.value)}
                          placeholder="Cyber Towers, Hitec City, Hyderabad"
                          className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Password</label>
                    <input
                      type="password"
                      value={merchPassword}
                      onChange={(e) => setMerchPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                    />
                  </div>
                </>
              )}

              {/* DRIVER FORM */}
              {selectedRole === 'DRIVER' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Driver Full Name</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="e.g. Vikram Singh"
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                    />
                  </div>

                  {mode === 'SIGNUP' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Driving License Number</label>
                        <input
                          type="text"
                          value={driverLicense}
                          onChange={(e) => setDriverLicense(e.target.value)}
                          placeholder="TS-09-2022-0049182"
                          className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Vehicle Type</label>
                          <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value as any)}
                            className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-2 py-2 text-xs text-[#f0f6fc]"
                          >
                            <option value="Electric Scooter">Electric Scooter</option>
                            <option value="Motorcycle">Motorcycle</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Vehicle Reg Number</label>
                          <input
                            type="text"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            placeholder="TS 09 EZ 4521"
                            className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#c9d1d9] mb-1">Password</label>
                    <input
                      type="password"
                      value={driverPassword}
                      onChange={(e) => setDriverPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-xs text-[#f0f6fc]"
                    />
                  </div>
                </>
              )}

              {errorMsg && (
                <p className="text-xs text-[#f85149] font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-2.5 rounded-lg text-xs font-medium transition"
              >
                {mode === 'LOGIN' ? `Login to ${selectedRole} Account` : `Complete ${selectedRole} Registration`}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
