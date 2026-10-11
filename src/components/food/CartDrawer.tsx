import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  Check, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Wallet,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { CartItem, UserAddress } from '../../types/food';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  selectedAddress: UserAddress;
  addresses: UserAddress[];
  onSelectAddress: (addr: UserAddress) => void;
  onPlaceOrder: (orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    tax: number;
    discount: number;
    appliedCoupon?: string;
    totalAmount: number;
    deliveryAddress: UserAddress;
    paymentMethod: 'UPI' | 'CREDIT_CARD' | 'COD' | 'WALLET';
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedAddress,
  addresses,
  onSelectAddress,
  onPlaceOrder
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'COD' | 'WALLET'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial math calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 600 ? 0 : 35) : 0;
  const platformFee = subtotal > 0 ? 10 : 0;
  const tax = Math.round(subtotal * 0.05); // 5% GST

  // Coupon evaluation engine
  let discount = 0;
  if (appliedCoupon === 'SE2026') {
    discount = Math.min(Math.round(subtotal * 0.5), 100);
  } else if (appliedCoupon === 'CBITFOOD') {
    discount = Math.min(Math.round(subtotal * 0.2), 150);
  } else if (appliedCoupon === 'FIRST50') {
    discount = 50;
  }

  const totalAmount = Math.max(0, subtotal + deliveryFee + platformFee + tax - discount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError(null);

    if (!code) return;

    if (code === 'SE2026') {
      if (subtotal < 250) {
        setCouponError('SE2026 requires a minimum subtotal of ₹250');
        return;
      }
      setAppliedCoupon('SE2026');
      setCouponInput('');
    } else if (code === 'CBITFOOD') {
      setAppliedCoupon('CBITFOOD');
      setCouponInput('');
    } else if (code === 'FIRST50') {
      setAppliedCoupon('FIRST50');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try SE2026, CBITFOOD, or FIRST50.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      onPlaceOrder({
        items: cartItems,
        subtotal,
        deliveryFee,
        platformFee,
        tax,
        discount,
        appliedCoupon: appliedCoupon || undefined,
        totalAmount,
        deliveryAddress: selectedAddress,
        paymentMethod
      });
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500/15 rounded-xl border border-orange-500/20 text-orange-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Your Food Basket</h3>
                <p className="text-xs text-slate-400">{cartItems.length} items selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-200">Your Cart is Empty</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explore top Hyderabadi biryanis, sourdough pizzas, and smash burgers to add to your order!
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <span>Order Items</span>
                    <button onClick={onClearCart} className="text-rose-400 hover:underline">
                      Clear All
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className={`w-3 h-3 mt-1 rounded-sm border ${
                            item.menuItem.isVeg ? 'border-emerald-500 bg-emerald-500/20' : 'border-rose-500 bg-rose-500/20'
                          }`} />
                          <div>
                            <h5 className="font-bold text-slate-200 text-sm">{item.menuItem.name}</h5>
                            <p className="text-xs font-semibold text-orange-400">₹{item.menuItem.price} each</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Render Selected Addons */}
                      {item.selectedAddons.length > 0 && (
                        <div className="pl-6 pt-1 text-xs text-slate-400 space-y-0.5 border-l-2 border-orange-500/30">
                          {item.selectedAddons.map((group) => (
                            <div key={group.groupId}>
                              <span className="font-medium text-slate-300">{group.groupTitle}: </span>
                              {group.selectedOptions.map((o) => o.name).join(', ')}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Instructions */}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-amber-300/80 italic pl-6">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center space-x-2 bg-slate-900 rounded-xl p-1 border border-slate-800">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-extrabold text-sm text-white">₹{item.itemTotalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Coupon System */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-orange-400">
                      <Tag className="w-4 h-4" /> Apply Coupon Code
                    </span>
                    <span className="text-slate-400 text-[11px]">Save up to ₹150</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-emerald-400">{appliedCoupon} APPLIED!</p>
                          <p className="text-[11px] text-slate-300">Discount of ₹{discount} deducted</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs font-bold text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Try SE2026 or CBITFOOD"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-orange-500"
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Quick Coupon Suggestions */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['SE2026', 'CBITFOOD', 'FIRST50'].map((code) => (
                          <button
                            key={code}
                            onClick={() => handleApplyCoupon(code)}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/20"
                          >
                            +{code}
                          </button>
                        ))}
                      </div>

                      {couponError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Delivery Address Selector */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Delivery Address</p>
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => onSelectAddress(addr)}
                        className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                          selectedAddress.id === addr.id
                            ? 'bg-orange-500/10 border-orange-500/40 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-200">{addr.label}: </span>
                          <span>{addr.street}, {addr.area}</span>
                        </div>
                        {selectedAddress.id === addr.id && <Check className="w-4 h-4 text-orange-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'UPI', label: 'UPI / GPay', icon: Smartphone },
                      { id: 'CREDIT_CARD', label: 'Cards', icon: CreditCard },
                      { id: 'WALLET', label: 'Wallets', icon: Wallet },
                      { id: 'COD', label: 'Cash on Delivery', icon: Banknote }
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const isSel = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id as any)}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 transition ${
                            isSel
                              ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Bill Summary */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-slate-300 uppercase tracking-wider mb-2">Bill Details</p>
                  <div className="flex justify-between text-slate-400">
                    <span>Item Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Fee {deliveryFee === 0 && <span className="text-emerald-400 font-bold">(FREE)</span>}</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Government Taxes (5% GST)</span>
                    <span>₹{tax}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-extrabold text-white">
                    <span>To Pay</span>
                    <span className="text-lg text-orange-400">₹{totalAmount}</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/25 transition active:scale-[0.99]"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <>
                    <span>Place Food Order</span>
                    <span>•</span>
                    <span className="text-lg font-extrabold">₹{totalAmount}</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-bit Encrypted SSL Gateway & Instant Refund Guarantee
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
