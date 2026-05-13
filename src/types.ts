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
  isFeatured?: boolean;
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
  phone?: string;
  language?: string;
  timezone?: string;
  createdAt: any;
  lastLogin?: any;
  provider?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'shipping' | 'billing';
}

export interface PaymentMethod {
  id: string;
  cardType: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
  holderName: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: any;
}

export interface ActivityLog {
  id: string;
  type: 'order' | 'security' | 'profile' | 'wishlist' | 'system';
  description: string;
  metadata?: Record<string, any>;
  createdAt: any;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  promotional: boolean;
  orderUpdates: boolean;
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

export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  title: string;
  createdAt?: any;
}

export interface AppSetting {
  id: string;
  whatWeAreTitle: string;
  whatWeAreHighlight: string;
  whatWeAreDescription: string;
  offers: string[];
  banners: Banner[];
  limitBanners?: boolean;
  updatedAt: any;
}
