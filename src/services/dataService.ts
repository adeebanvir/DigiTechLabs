import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Category, Order, Address, PaymentMethod, ActivityLog, UserProfile, AppSetting } from '../types';

export const userService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        return { userId: snap.id, ...snap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }
};

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const snap = await getDoc(doc(db, 'products', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Product;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `products/${id}`);
      return null;
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, 'products'), where('isFeatured', '==', true));
      const snap = await getDocs(q);
      
      // Fallback to best sellers if no featured products
      if (snap.empty) {
        const fallbackQ = query(collection(db, 'products'), where('isBestSeller', '==', true), limit(8));
        const fallbackSnap = await getDocs(fallbackQ);
        return fallbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      }

      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
      return [];
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
      return null;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...product,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  }
};

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'categories');
      return [];
    }
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<string | null> {
    try {
      const id = category.slug.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'categories', id), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
      return null;
    }
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    try {
      await updateDoc(doc(db, 'categories', id), {
        ...category,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  }
};

export const orderService = {
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      return [];
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const snap = await getDoc(doc(db, 'orders', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Order;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `orders/${id}`);
      return null;
    }
  },

  async createOrder(userId: string, items: any[], total: number, address: string, email: string, phone: string, customerName: string) {
    try {
      const orderData = {
        userId,
        customerName: customerName.trim() || 'Guest Customer',
        email: email.trim() || 'N/A',
        phone: phone.trim() || 'N/A',
        items,
        total,
        shippingAddress: address.trim() || 'N/A',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  }
};

export const accountService = {
  async getAddresses(userId: string): Promise<Address[]> {
    try {
      const snap = await getDocs(collection(db, `users/${userId}/addresses`));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/addresses`);
      return [];
    }
  },

  async addAddress(userId: string, address: Omit<Address, 'id'>): Promise<string | null> {
    try {
      if (address.isDefault) {
        // Reset other defaults
        const addresses = await this.getAddresses(userId);
        for (const addr of addresses) {
          if (addr.isDefault) {
            await updateDoc(doc(db, `users/${userId}/addresses`, addr.id), { isDefault: false });
          }
        }
      }
      const docRef = await addDoc(collection(db, `users/${userId}/addresses`), address);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/addresses`);
      return null;
    }
  },

  async updateAddress(userId: string, addressId: string, address: Partial<Address>): Promise<void> {
    try {
      if (address.isDefault) {
        const addresses = await this.getAddresses(userId);
        for (const addr of addresses) {
          if (addr.isDefault && addr.id !== addressId) {
            await updateDoc(doc(db, `users/${userId}/addresses`, addr.id), { isDefault: false });
          }
        }
      }
      await updateDoc(doc(db, `users/${userId}/addresses`, addressId), address);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/addresses/${addressId}`);
    }
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, `users/${userId}/addresses`, addressId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}/addresses/${addressId}`);
    }
  },

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const snap = await getDocs(collection(db, `users/${userId}/payments`));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/payments`);
      return [];
    }
  },

  async addPaymentMethod(userId: string, payment: Omit<PaymentMethod, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/payments`), payment);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/payments`);
      return null;
    }
  },

  async deletePaymentMethod(userId: string, paymentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, `users/${userId}/payments`, paymentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}/payments/${paymentId}`);
    }
  },

  async getWishlist(userId: string): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, `users/${userId}/wishlist`));
      const productIds = snap.docs.map(doc => doc.id);
      
      const products: Product[] = [];
      for (const pid of productIds) {
        const p = await productService.getProductById(pid);
        if (p) products.push(p);
      }
      return products;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/wishlist`);
      return [];
    }
  },

  async addToWishlist(userId: string, productId: string): Promise<void> {
    try {
      await setDoc(doc(db, `users/${userId}/wishlist`, productId), { addedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/wishlist/${productId}`);
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, `users/${userId}/wishlist`, productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}/wishlist/${productId}`);
    }
  },

  async getActivityLogs(userId: string): Promise<ActivityLog[]> {
    try {
      const q = query(collection(db, `users/${userId}/activity`), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/activity`);
      return [];
    }
  },

  async logActivity(userId: string, type: ActivityLog['type'], description: string): Promise<void> {
    try {
      await addDoc(collection(db, `users/${userId}/activity`), {
        type,
        description,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/activity`);
    }
  }
};

export const settingsService = {
  async getSettings(id: string = 'home'): Promise<AppSetting | null> {
    try {
      const snap = await getDoc(doc(db, 'settings', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as AppSetting;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `settings/${id}`);
      return null;
    }
  },

  async updateSettings(id: string, data: Partial<AppSetting>): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', id), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `settings/${id}`);
    }
  }
};
