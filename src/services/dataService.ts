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
  addDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

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
      const q = query(collection(db, 'products'), where('isBestSeller', '==', true), limit(3));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
      return [];
    }
  }
};

export const orderService = {
  async createOrder(userId: string, items: any[], total: number, address: string) {
    try {
      const orderData = {
        userId,
        items,
        total,
        address,
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
