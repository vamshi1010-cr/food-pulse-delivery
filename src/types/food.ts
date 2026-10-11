export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface AddonGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect?: number;
  options: AddonOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  rating: number;
  ratingCount: number;
  preparationTimeMinutes: number;
  calories?: number;
  addonGroups?: AddonGroup[];
  available: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMinutes: number;
  costForTwo: number;
  heroImage: string;
  isPureVeg: boolean;
  discountBadge?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  featuredItems: MenuItem[];
  categories: string[];
}

export interface CartAddonSelection {
  groupId: string;
  groupTitle: string;
  selectedOptions: AddonOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: CartAddonSelection[];
  specialInstructions?: string;
  itemTotalPrice: number;
}

export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  currentLat: number;
  currentLng: number;
  avatar: string;
}

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  zipCode: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCoords: { lat: number; lng: number };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  discount: number;
  appliedCoupon?: string;
  totalAmount: number;
  deliveryAddress: UserAddress;
  status: OrderStatus;
  driver?: DriverInfo;
  createdAt: string;
  estimatedDeliveryTime: string;
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'COD' | 'WALLET';
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  restaurantId: string;
  dishName?: string;
  tags: string[];
}
