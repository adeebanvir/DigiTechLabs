export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  specs: Record<string, string>;
  isNew?: boolean;
  isBestSeller?: boolean;
  stock: number;
  status: 'published' | 'draft' | 'archived';
  sku: string;
  createdAt?: any;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'super-admin' | 'admin' | 'moderator' | 'support' | 'customer';
  status: 'active' | 'suspended' | 'banned';
  createdAt: any;
  lastLogin?: any;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress: string;
  trackingCode?: string;
  createdAt: any;
  updatedAt: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  expiryDate: any;
  usageCount: number;
  isActive: boolean;
}
