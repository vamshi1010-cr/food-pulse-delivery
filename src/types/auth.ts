export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'DRIVER';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: {
    label: string;
    street: string;
    area: string;
    city: string;
    zipCode: string;
  };
}

export interface MerchantProfile {
  id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  cuisine: string[];
  address: string;
  fssaiLicense: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleType: 'Electric Scooter' | 'Motorcycle' | 'Bicycle';
  vehicleNumber: string;
  rating: number;
}

export interface UserSession {
  role: UserRole;
  profile: CustomerProfile | MerchantProfile | DriverProfile;
  token: string;
}
