import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  updateUserProfile: (updates: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', currUser.uid);
        const userSnap = await getDoc(userRef);
        
        const providerId = currUser.providerData[0]?.providerId || 'password';

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            userId: currUser.uid,
            displayName: currUser.displayName || emailToName(currUser.email || ''),
            email: currUser.email,
            photoURL: currUser.photoURL || `https://ui-avatars.com/api/?name=${currUser.displayName || currUser.email}&background=00A650&color=fff`,
            role: currUser.email === 'adeebanvir09@gmail.com' ? 'admin' : 'customer',
            status: 'active',
            provider: providerId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
            // Update last login
            await setDoc(userRef, { 
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp(),
                provider: providerId // Ensure provider is tracked
            }, { merge: true });
        }
        
        const role = userSnap.exists() ? userSnap.data()?.role : (currUser.email === 'adeebanvir09@gmail.com' ? 'admin' : 'customer');
        setIsAdmin(role === 'admin' || role === 'super-admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const emailToName = (email: string) => {
    return email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
  };

  const updateUserProfile = async (updates: any) => {
    if (!auth.currentUser) return;
    
    // Update Firebase Auth profile
    const profileUpdates: any = {};
    if (updates.displayName) profileUpdates.displayName = updates.displayName;
    if (updates.photoURL) profileUpdates.photoURL = updates.photoURL;
    
    if (Object.keys(profileUpdates).length > 0) {
      await updateProfile(auth.currentUser, profileUpdates);
    }

    // Update Firestore user document
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Refresh local user state
    setUser({ ...auth.currentUser });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, loginWithGoogle, loginWithEmail, registerWithEmail, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
