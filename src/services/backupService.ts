import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface FirebaseBackupData {
  timestamp: string;
  version: string;
  collections: Record<string, any[]>;
}

export interface TargetFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const KNOWN_COLLECTIONS = [
  'products',
  'categories',
  'orders',
  'media',
  'settings',
  'faqs',
  'policies',
  'taxRates',
  'innovations',
  'banners',
  'users'
];

export const backupService = {
  /**
   * Export all Firestore collections into a JSON object
   */
  async exportAllFirebaseData(): Promise<FirebaseBackupData> {
    const backup: FirebaseBackupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      collections: {}
    };

    for (const colName of KNOWN_COLLECTIONS) {
      try {
        const snap = await getDocs(collection(db, colName));
        backup.collections[colName] = snap.docs.map(d => ({
          _docId: d.id,
          ...d.data()
        }));
      } catch (err) {
        console.warn(`Could not export collection ${colName}:`, err);
        backup.collections[colName] = [];
      }
    }

    return backup;
  },

  /**
   * Import / Restore JSON dump into current Firestore project
   */
  async restoreToCurrentDb(dumpData: FirebaseBackupData, onProgress?: (msg: string) => void): Promise<number> {
    let totalImported = 0;
    if (!dumpData.collections) throw new Error("Invalid backup format: missing 'collections'");

    for (const [colName, docs] of Object.entries(dumpData.collections)) {
      if (!Array.isArray(docs)) continue;
      if (onProgress) onProgress(`Importing collection '${colName}' (${docs.length} items)...`);

      for (const item of docs) {
        const { _docId, ...docData } = item;
        const targetId = _docId || Math.random().toString(36).substring(2, 9);
        await setDoc(doc(db, colName, targetId), docData, { merge: true });
        totalImported++;
      }
    }

    return totalImported;
  },

  /**
   * Export and Transfer all data directly to another Target Firebase project using target API keys
   */
  async transferToTargetFirebase(
    targetConfig: TargetFirebaseConfig, 
    dumpData: FirebaseBackupData,
    onProgress?: (msg: string) => void
  ): Promise<number> {
    let totalTransferred = 0;
    if (onProgress) onProgress("Initializing connection to target Firebase project...");

    const appName = `targetFirebase_${Date.now()}`;
    const targetApp = initializeApp(targetConfig, appName);
    const targetDb = getFirestore(targetApp);

    for (const [colName, docs] of Object.entries(dumpData.collections || {})) {
      if (!Array.isArray(docs) || docs.length === 0) continue;
      if (onProgress) onProgress(`Writing '${colName}' to target Firebase project (${docs.length} docs)...`);

      for (const item of docs) {
        const { _docId, ...docData } = item;
        const targetId = _docId || Math.random().toString(36).substring(2, 9);
        await setDoc(doc(targetDb, colName, targetId), docData, { merge: true });
        totalTransferred++;
      }
    }

    if (onProgress) onProgress(`Transfer complete! Successfully wrote ${totalTransferred} documents to target project.`);
    return totalTransferred;
  },

  /**
   * Re-upload image assets to another Cloudinary account using Unsigned Upload Preset
   */
  async migrateImagesToCloudinary(
    targetCloudName: string,
    targetUploadPreset: string,
    onProgress?: (current: number, total: number, url: string) => void
  ): Promise<{ originalUrl: string; newUrl: string; publicId: string }[]> {
    // 1. Fetch all media from current Firestore 'media' collection
    const snap = await getDocs(collection(db, 'media'));
    const mediaDocs = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));

    const results: { originalUrl: string; newUrl: string; publicId: string }[] = [];
    const uploadUrl = `https://api.cloudinary.com/v1_1/${targetCloudName.trim()}/image/upload`;

    let count = 0;
    const total = mediaDocs.length;

    for (const item of mediaDocs) {
      count++;
      const originalUrl = item.url;
      if (!originalUrl) continue;

      if (onProgress) onProgress(count, total, originalUrl);

      try {
        // Upload image directly via URL or Blob to Cloudinary target account
        const formData = new FormData();
        formData.append('file', originalUrl);
        formData.append('upload_preset', targetUploadPreset.trim());

        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`Cloudinary upload failed for ${originalUrl}:`, errText);
          continue;
        }

        const data = await res.json();
        if (data.secure_url) {
          results.push({
            originalUrl,
            newUrl: data.secure_url,
            publicId: data.public_id
          });
        }
      } catch (err) {
        console.error(`Failed migrating image ${originalUrl}:`, err);
      }
    }

    return results;
  }
};
