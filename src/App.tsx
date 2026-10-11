import { useState, useEffect } from 'react';
import { Navbar } from './components/food/Navbar';
import { CustomerPortal } from './components/food/CustomerPortal';
import { CustomerOrders } from './components/food/CustomerOrders';
import { DishModal } from './components/food/DishModal';
import { CartDrawer } from './components/food/CartDrawer';
import { LiveOrderTracker } from './components/food/LiveOrderTracker';
import { MerchantDashboard } from './components/food/MerchantDashboard';
import { DriverPortal } from './components/food/DriverPortal';
import { SEStudio } from './components/se/SEStudio';
import { AuthPortal } from './components/auth/AuthPortal';

import { 
  MOCK_RESTAURANTS, 
  INITIAL_ADDRESSES, 
  DEFAULT_DRIVER, 
  MOCK_REVIEWS 
} from './data/mockFoodData';

import type { 
  MenuItem, 
  CartItem, 
  CartAddonSelection, 
  Order, 
  OrderStatus, 
  UserAddress,
  Restaurant
} from './types/food';

import type { UserSession } from './types/auth';

export function App() {
  // Theme state: dark | light with persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('foodpulse_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('foodpulse_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth Session State
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('foodpulse_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('foodpulse_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('foodpulse_session');
    }
  }, [session]);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setActiveView(newSession.role);
  };

  const handleLogout = () => {
    setSession(null);
  };

  // Navigation & View State
  const [activeView, setActiveView] = useState<'CUSTOMER' | 'CUSTOMER_ORDERS' | 'MERCHANT' | 'DRIVER' | 'SE_STUDIO'>('CUSTOMER');

  // App Master Data States
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [addresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(INITIAL_ADDRESSES[0]);

  // Cart & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-89241',
      restaurantId: 'rest-1',
      restaurantName: 'Paradise Dum Biryani & Kebabs',
      restaurantAddress: 'Near Cyber Towers, Hitec City',
      restaurantCoords: { lat: 17.4483, lng: 78.3808 },
      items: [
        {
          cartItemId: 'c-1',
          menuItem: MOCK_RESTAURANTS[0].featuredItems[0],
          quantity: 1,
          selectedAddons: [],
          itemTotalPrice: 380
        }
      ],
      subtotal: 380,
      deliveryFee: 0,
      platformFee: 10,
      tax: 19,
      discount: 100,
      appliedCoupon: 'SE2026',
      totalAmount: 309,
      deliveryAddress: INITIAL_ADDRESSES[0],
      status: 'OUT_FOR_DELIVERY',
      driver: DEFAULT_DRIVER,
      createdAt: '12 minutes ago',
      estimatedDeliveryTime: '24 mins',
      paymentMethod: 'UPI'
    },
    {
      id: 'ord-71029',
      restaurantId: 'rest-2',
      restaurantName: 'Artisan Woodfired Pizza & Pasta',
      restaurantAddress: 'Jubilee Hills, Hyderabad',
      restaurantCoords: { lat: 17.4350, lng: 78.4010 },
      items: [
        {
          cartItemId: 'c-2',
          menuItem: MOCK_RESTAURANTS[1].featuredItems[0],
          quantity: 1,
          selectedAddons: [],
          itemTotalPrice: 495
        }
      ],
      subtotal: 495,
      deliveryFee: 35,
      platformFee: 10,
      tax: 25,
      discount: 120,
      appliedCoupon: undefined,
      totalAmount: 445,
      deliveryAddress: INITIAL_ADDRESSES[0],
      status: 'DELIVERED',
      driver: DEFAULT_DRIVER,
      createdAt: 'Yesterday at 8:30 PM',
      estimatedDeliveryTime: 'Delivered',
      paymentMethod: 'CREDIT_CARD'
    }
  ]);

  // Active tracking modal focus
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Cart Operations
  const handleAddToCart = (
    menuItem: MenuItem,
    quantity: number,
    selectedAddons: CartAddonSelection[],
    specialInstructions: string,
    itemTotalPrice: number
  ) => {
    const newItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random()}`,
      menuItem,
      quantity,
      selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined,
      itemTotalPrice
    };

    setCartItems((prev) => [...prev, newItem]);
  };

  const handleReorder = (itemsToReorder: CartItem[]) => {
    setCartItems((prev) => [...prev, ...itemsToReorder]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.itemTotalPrice / item.quantity;
          return {
            ...item,
            quantity: newQty,
            itemTotalPrice: unitPrice * newQty
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Place Order Handler
  const handlePlaceOrder = (orderData: {
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
  }) => {
    const newOrder: Order = {
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      restaurantId: orderData.items[0]?.menuItem.category || 'rest-1',
      restaurantName: 'Paradise Dum Biryani & Kebabs',
      restaurantAddress: 'Hitec City, Hyderabad',
      restaurantCoords: { lat: 17.4483, lng: 78.3808 },
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      platformFee: orderData.platformFee,
      tax: orderData.tax,
      discount: orderData.discount,
      appliedCoupon: orderData.appliedCoupon,
      totalAmount: orderData.totalAmount,
      deliveryAddress: orderData.deliveryAddress,
      status: 'PLACED',
      driver: DEFAULT_DRIVER,
      createdAt: 'Just now',
      estimatedDeliveryTime: '25 mins',
      paymentMethod: orderData.paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setTrackedOrder(newOrder);
  };

  // Order Status Updater
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Toggle Item Availability for Merchant
  const handleToggleItemAvailability = (dishId: string) => {
    setRestaurants((prev) =>
      prev.map((r) => ({
        ...r,
        featuredItems: r.featuredItems.map((item) =>
          item.id === dishId ? { ...item, available: !item.available } : item
        )
      }))
    );
  };

  // Active customer orders
  const activeCustomerOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  // If user is not authenticated and is not explicitly viewing SE Studio, show AuthPortal
  if (!session && activeView !== 'SE_STUDIO') {
    return (
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        <AuthPortal 
          onLoginSuccess={handleLoginSuccess}
          onBypassToStudio={() => setActiveView('SE_STUDIO')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        selectedAddress={selectedAddress}
        addresses={addresses}
        onSelectAddress={setSelectedAddress}
        activeOrderCount={activeCustomerOrders.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUserSession={session}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* CUSTOMER DISCOVERY VIEW */}
        {activeView === 'CUSTOMER' && (
          <div className="space-y-8">
            {trackedOrder ? (
              <div className="space-y-4">
                <button
                  onClick={() => setTrackedOrder(null)}
                  className="text-xs font-medium text-[#f97316] hover:underline bg-[#161b22] px-3 py-1.5 rounded-lg border border-[#21262d]"
                >
                  ← Back to Restaurant Directory
                </button>
                <LiveOrderTracker
                  order={trackedOrder}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              </div>
            ) : (
              <CustomerPortal
                restaurants={restaurants}
                reviews={MOCK_REVIEWS}
                activeOrders={activeCustomerOrders}
                onOpenDishModal={(dish) => setSelectedDishForModal(dish)}
                onTrackOrder={(order) => setTrackedOrder(order)}
              />
            )}
          </div>
        )}

        {/* CUSTOMER ORDERS & LIVE TRACKING VIEW */}
        {activeView === 'CUSTOMER_ORDERS' && (
          <div className="space-y-8">
            {trackedOrder ? (
              <div className="space-y-4">
                <button
                  onClick={() => setTrackedOrder(null)}
                  className="text-xs font-medium text-[#f97316] hover:underline bg-[#161b22] px-3 py-1.5 rounded-lg border border-[#21262d]"
                >
                  ← Back to My Orders List
                </button>
                <LiveOrderTracker
                  order={trackedOrder}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              </div>
            ) : (
              <CustomerOrders
                orders={orders}
                onTrackOrder={(order) => setTrackedOrder(order)}
                onReorder={handleReorder}
              />
            )}
          </div>
        )}

        {/* MERCHANT VIEW */}
        {activeView === 'MERCHANT' && (
          <MerchantDashboard
            restaurant={restaurants[0]}
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onToggleItemAvailability={handleToggleItemAvailability}
          />
        )}

        {/* DRIVER VIEW */}
        {activeView === 'DRIVER' && (
          <DriverPortal
            driver={DEFAULT_DRIVER}
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {/* SE 22CSC21N SYLLABUS STUDIO */}
        {activeView === 'SE_STUDIO' && (
          <SEStudio />
        )}

      </main>

      {/* Dish Customization Modal */}
      <DishModal
        item={selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        selectedAddress={selectedAddress}
        addresses={addresses}
        onSelectAddress={setSelectedAddress}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* App Footer */}
      <footer className="border-t border-[#21262d] py-6 mt-12 bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#8b949e] space-y-1">
          <p className="font-medium text-[#f0f6fc]">
            FoodPulse • Online Food Delivery System Case Study Application
          </p>
          <p className="text-[#8b949e]">
            Designed for <strong>22CSC21N Software Engineering Syllabus</strong> • Chaitanya Bharathi Institute of Technology (A)
          </p>
        </div>
      </footer>

    </div>
  );
}
export default App;
