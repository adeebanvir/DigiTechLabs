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
import { Product, Category } from '../types';

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
