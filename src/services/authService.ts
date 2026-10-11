import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserSession, UserRole } from '../types/auth';

// ── Sign Up ─────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  metadata: Record<string, string>
): Promise<{ session: UserSession | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { session: buildMockSession(role, email, metadata), error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: role.toLowerCase(), name: metadata.name || email, ...metadata },
    },
  });

  if (error) return { session: null, error: error.message };
  if (!data.user) return { session: null, error: 'No user returned from signup.' };

  // Update profile with extra fields
  await supabase.from('profiles').upsert({
    id: data.user.id,
    role: role.toLowerCase(),
    name: metadata.name,
    phone: metadata.phone,
    restaurant_name: metadata.restaurantName,
    fssai_license: metadata.fssaiLicense,
    kitchen_address: metadata.address,
    license_number: metadata.licenseNumber,
    vehicle_type: metadata.vehicleType,
    vehicle_number: metadata.vehicleNumber,
    default_street: metadata.street,
    default_area: metadata.area,
  });

  return { session: await buildSession(data.user.id, role, email, metadata), error: null };
}

// ── Sign In ─────────────────────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<{ session: UserSession | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Mock login fallback — role derived from email pattern for demo
    const role: UserRole = email.includes('merchant') ? 'MERCHANT'
      : email.includes('driver') ? 'DRIVER'
      : 'CUSTOMER';
    return { session: buildMockSession(role, email, {}), error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { session: null, error: error.message };
  if (!data.user) return { session: null, error: 'Login failed. Please try again.' };

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) return { session: null, error: 'Profile not found. Please contact support.' };

  const role = profile.role.toUpperCase() as UserRole;
  return { session: mapProfileToSession(data.user.id, role, data.user.email || email, profile), error: null };
}

// ── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('foodpulse_session');
}

// ── Restore Session from Supabase ─────────────────────────────────────────────
export async function restoreSession(): Promise<UserSession | null> {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('foodpulse_session');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) return null;
  const role = profile.role.toUpperCase() as UserRole;
  return mapProfileToSession(session.user.id, role, session.user.email || '', profile);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function buildSession(
  id: string,
  role: UserRole,
  email: string,
  meta: Record<string, string>
): Promise<UserSession> {
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  return mapProfileToSession(id, role, email, profile || meta);
}

function mapProfileToSession(
  id: string,
  role: UserRole,
  email: string,
  p: Record<string, unknown>
): UserSession {
  if (role === 'MERCHANT') {
    return {
      role: 'MERCHANT',
      profile: {
        id,
        restaurantName: (p.restaurant_name as string) || 'My Restaurant',
        ownerName: (p.name as string) || 'Owner',
        email,
        phone: (p.phone as string) || '',
        cuisine: ['Indian'],
        address: (p.kitchen_address as string) || '',
        fssaiLicense: (p.fssai_license as string) || '',
      },
      token: id,
    };
  }
  if (role === 'DRIVER') {
    return {
      role: 'DRIVER',
      profile: {
        id,
        name: (p.name as string) || 'Driver',
        phone: (p.phone as string) || '',
        licenseNumber: (p.license_number as string) || '',
        vehicleType: ((p.vehicle_type as string) || 'Electric Scooter') as 'Electric Scooter' | 'Motorcycle',
        vehicleNumber: (p.vehicle_number as string) || '',
        rating: (p.driver_rating as number) || 4.5,
      },
      token: id,
    };
  }
  return {
    role: 'CUSTOMER',
    profile: {
      id,
      name: (p.name as string) || email.split('@')[0],
      email,
      phone: (p.phone as string) || '',
      defaultAddress: {
        label: 'Home',
        street: (p.default_street as string) || '',
        area: (p.default_area as string) || '',
        city: (p.default_city as string) || 'Hyderabad',
        zipCode: (p.default_zipcode as string) || '500033',
      },
    },
    token: id,
  };
}

function buildMockSession(
  role: UserRole,
  email: string,
  meta: Record<string, string>
): UserSession {
  const id = `mock-${Date.now()}`;
  if (role === 'MERCHANT') {
    return {
      role: 'MERCHANT',
      profile: {
        id: 'rest-1',
        restaurantName: meta.restaurantName || 'Paradise Dum Biryani & Kebabs',
        ownerName: meta.name || 'Mirza Ali Khan',
        email,
        phone: meta.phone || '+91 91234 56789',
        cuisine: ['Hyderabadi', 'North Indian'],
        address: meta.address || 'Hitec City, Hyderabad',
        fssaiLicense: meta.fssaiLicense || '13322005000124',
      },
      token: `demo-${id}`,
    };
  }
  if (role === 'DRIVER') {
    return {
      role: 'DRIVER',
      profile: {
        id,
        name: meta.name || 'Vikram Singh',
        phone: meta.phone || '+91 98765 43210',
        licenseNumber: meta.licenseNumber || 'TS-09-2022-0049182',
        vehicleType: (meta.vehicleType as 'Electric Scooter' | 'Motorcycle') || 'Electric Scooter',
        vehicleNumber: meta.vehicleNumber || 'TS 09 EZ 4521',
        rating: 4.9,
      },
      token: `demo-${id}`,
    };
  }
  return {
    role: 'CUSTOMER',
    profile: {
      id,
      name: meta.name || 'Ananya Sharma',
      email,
      phone: meta.phone || '+91 98765 43210',
      defaultAddress: {
        label: 'Home',
        street: meta.street || 'Road No 36',
        area: meta.area || 'Jubilee Hills',
        city: 'Hyderabad',
        zipCode: '500033',
      },
    },
    token: `demo-${id}`,
  };
}
