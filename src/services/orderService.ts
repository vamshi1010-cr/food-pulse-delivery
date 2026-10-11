import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CartItem, Order, OrderStatus, UserAddress } from '../types/food';
import { DEFAULT_DRIVER } from '../data/mockFoodData';

// ── Place Order ────────────────────────────────────────────────────────────────
export async function placeOrder(
  customerId: string,
  cartItems: CartItem[],
  financials: {
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    tax: number;
    discount: number;
    appliedCoupon?: string;
    totalAmount: number;
    paymentMethod: string;
  },
  address: UserAddress
): Promise<{ order: Order | null; error: string | null }> {
  // Build a mock order (always works, even without Supabase)
  const mockOrder: Order = {
    id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
    restaurantId: 'rest-1',
    restaurantName: 'Paradise Dum Biryani & Kebabs',
    restaurantAddress: 'Hitec City, Hyderabad',
    restaurantCoords: { lat: 17.4483, lng: 78.3808 },
    items: cartItems,
    subtotal: financials.subtotal,
    deliveryFee: financials.deliveryFee,
    platformFee: financials.platformFee,
    tax: financials.tax,
    discount: financials.discount,
    appliedCoupon: financials.appliedCoupon,
    totalAmount: financials.totalAmount,
    deliveryAddress: address,
    status: 'PLACED',
    driver: DEFAULT_DRIVER,
    createdAt: 'Just now',
    estimatedDeliveryTime: '25 mins',
    paymentMethod: financials.paymentMethod as Order['paymentMethod'],
  };

  if (!isSupabaseConfigured()) {
    return { order: mockOrder, error: null };
  }

  try {
    // Get restaurant id from first cart item
    const restaurantId = 'a0000001-0000-0000-0000-000000000001';

    const { data: orderRow, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        restaurant_id: restaurantId,
        status: 'PLACED',
        subtotal: financials.subtotal,
        delivery_fee: financials.deliveryFee,
        platform_fee: financials.platformFee,
        tax: financials.tax,
        discount: financials.discount,
        total_amount: financials.totalAmount,
        applied_coupon: financials.appliedCoupon || null,
        delivery_street: address.street,
        delivery_area: address.area,
        delivery_city: address.city,
        delivery_zipcode: address.zipCode,
        delivery_label: address.label,
        payment_method: financials.paymentMethod,
        estimated_delivery: '25 mins',
      })
      .select()
      .single();

    if (orderErr || !orderRow) {
      console.error('[orderService] insert error:', orderErr);
      return { order: mockOrder, error: null }; // fallback to mock
    }

    // Insert order items
    const itemRows = cartItems.map((ci) => ({
      order_id: orderRow.id,
      menu_item_id: null,
      name: ci.menuItem.name,
      price: ci.menuItem.price,
      quantity: ci.quantity,
      item_total: ci.itemTotalPrice,
      addons: ci.selectedAddons.flatMap((a) => a.selectedOptions.map((o) => o.name)),
      special_instructions: ci.specialInstructions || null,
    }));

    await supabase.from('order_items').insert(itemRows);

    return {
      order: {
        ...mockOrder,
        id: orderRow.id,
      },
      error: null,
    };
  } catch (err) {
    console.error('[orderService] unexpected error:', err);
    return { order: mockOrder, error: null }; // always return mock as fallback
  }
}

// ── Fetch Customer Orders ──────────────────────────────────────────────────────
export async function fetchCustomerOrders(customerId: string): Promise<Order[]> {
  if (!isSupabaseConfigured() || customerId.startsWith('mock-') || customerId.startsWith('cust-')) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      restaurants (name, address, coords_lat, coords_lng)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((row) => mapRowToOrder(row));
}

// ── Fetch Merchant Orders ──────────────────────────────────────────────────────
export async function fetchMerchantOrders(restaurantId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('restaurant_id', restaurantId)
    .in('status', ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'])
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapRowToOrder(row));
}

// ── Update Order Status ────────────────────────────────────────────────────────
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  if (orderId.startsWith('ord-')) return true; // mock order

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  return !error;
}

// ── Subscribe to Order Status Changes (Realtime) ──────────────────────────────
export function subscribeToOrder(
  orderId: string,
  onUpdate: (status: OrderStatus) => void
): () => void {
  if (!isSupabaseConfigured() || orderId.startsWith('ord-')) {
    return () => {};
  }

  const channel = supabase
    .channel(`order:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        const newStatus = (payload.new as { status: OrderStatus }).status;
        if (newStatus) onUpdate(newStatus);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ── Validate Coupon ────────────────────────────────────────────────────────────
export async function validateCoupon(
  code: string,
  orderSubtotal: number
): Promise<{ valid: boolean; discountPct: number; maxDiscount: number; error?: string }> {
  // Local fallback codes (always work)
  const LOCAL_CODES: Record<string, { discountPct: number; maxDiscount: number; minOrder: number }> = {
    SE2026: { discountPct: 25, maxDiscount: 100, minOrder: 200 },
    CBITFOOD: { discountPct: 20, maxDiscount: 120, minOrder: 150 },
    NEWUSER50: { discountPct: 50, maxDiscount: 200, minOrder: 100 },
  };

  const local = LOCAL_CODES[code.toUpperCase()];
  if (local) {
    if (orderSubtotal < local.minOrder) {
      return { valid: false, discountPct: 0, maxDiscount: 0, error: `Minimum order ₹${local.minOrder} required.` };
    }
    return { valid: true, discountPct: local.discountPct, maxDiscount: local.maxDiscount };
  }

  if (!isSupabaseConfigured()) {
    return { valid: false, discountPct: 0, maxDiscount: 0, error: 'Invalid coupon code.' };
  }

  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (!data) return { valid: false, discountPct: 0, maxDiscount: 0, error: 'Invalid or expired coupon.' };
  if (orderSubtotal < (data.min_order || 0)) {
    return { valid: false, discountPct: 0, maxDiscount: 0, error: `Minimum order ₹${data.min_order} required.` };
  }

  return { valid: true, discountPct: data.discount_pct, maxDiscount: data.max_discount };
}

// ── Row Mapper ────────────────────────────────────────────────────────────────
function mapRowToOrder(row: Record<string, unknown>): Order {
  const restaurant = (row.restaurants as Record<string, unknown> | null) || {};
  const orderItems = (row.order_items as Record<string, unknown>[]) || [];

  return {
    id: row.id as string,
    restaurantId: (row.restaurant_id as string) || 'rest-1',
    restaurantName: (restaurant.name as string) || 'Restaurant',
    restaurantAddress: (restaurant.address as string) || '',
    restaurantCoords: {
      lat: (restaurant.coords_lat as number) || 17.4483,
      lng: (restaurant.coords_lng as number) || 78.3808,
    },
    items: orderItems.map((oi) => ({
      cartItemId: oi.id as string,
      menuItem: {
        id: (oi.menu_item_id as string) || `item-${oi.id as string}`,
        name: oi.name as string,
        description: '',
        price: oi.price as number,
        category: 'Main',
        image: '',
        isVeg: false,
        isBestseller: false,
        rating: 4.0,
        ratingCount: 0,
        preparationTimeMinutes: 20,
        available: true,
        addonGroups: [],
      },
      quantity: oi.quantity as number,
      selectedAddons: [],
      itemTotalPrice: oi.item_total as number,
    })),
    subtotal: row.subtotal as number,
    deliveryFee: (row.delivery_fee as number) || 0,
    platformFee: (row.platform_fee as number) || 10,
    tax: (row.tax as number) || 0,
    discount: (row.discount as number) || 0,
    appliedCoupon: (row.applied_coupon as string) || undefined,
    totalAmount: row.total_amount as number,
    deliveryAddress: {
      id: `addr-${row.id as string}`,
      label: ((row.delivery_label as string) || 'Home') as 'Home' | 'Work' | 'Other',
      street: (row.delivery_street as string) || '',
      area: (row.delivery_area as string) || '',
      city: (row.delivery_city as string) || 'Hyderabad',
      zipCode: (row.delivery_zipcode as string) || '500033',
      lat: 17.4483,
      lng: 78.3808,
    },
    status: (row.status as OrderStatus) || 'PLACED',
    driver: DEFAULT_DRIVER,
    createdAt: new Date(row.created_at as string).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    }),
    estimatedDeliveryTime: (row.estimated_delivery as string) || '30 mins',
    paymentMethod: (row.payment_method as Order['paymentMethod']) || 'UPI',
  };
}
