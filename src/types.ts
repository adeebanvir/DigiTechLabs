export interface Product {
  id: string;
  productId: string; // Used for sorting as requested
  name: string;
  description: string;
  price: number;
  discount: number; // Applied to price
  category: string;
  image: string;
  rating: number;
  reviews: number;
  isReviewsEnabled: boolean; // Toggleable reviews
  features: string[];
  specs: Record<string, string>;
  isNew?: boolean;
  isBestSeller?: boolean;
  stock: number;
  status: 'published' | 'draft' | 'archived';
  sku: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
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
  email: string;
  phone: string;
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
