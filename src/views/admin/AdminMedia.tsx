/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  Copy, 
  ExternalLink,
  Search,
  Grid,
  List,
  Check,
  AlertCircle,
  Loader2,
  RefreshCcw,
  Home
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: any;
  uploadedBy: string;
}

export default function AdminMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mediaData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaAsset[];
      setAssets(mediaData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'media');
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/v1/media/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          const detailedError = errorData.details ? `${errorData.error}: ${errorData.details}` : (errorData.error || 'Failed to upload to Cloudinary');
          throw new Error(detailedError);
        }

        const data = await response.json();

        // Save to Firestore
        try {
          await addDoc(collection(db, 'media'), {
            url: data.secure_url,
            publicId: data.public_id,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: serverTimestamp(),
            uploadedBy: user?.uid || 'unknown'
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, 'media');
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('authInfo')) {
        // This was thrown by handleFirestoreError
        throw error;
      }
      console.error(error);
      alert(error instanceof Error ? error.message : "Error uploading image to Cloudinary");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/media/sync');
      if (!response.ok) throw new Error('Failed to fetch from Cloudinary');
      
      const data = await response.json();
      const cloudinaryAssets = data.assets;

      // Current public IDs in Firestore
      const existingPublicIds = new Set(assets.map(a => a.publicId));
      
      let newCount = 0;
      for (const asset of cloudinaryAssets) {
        if (!existingPublicIds.has(asset.publicId)) {
          await addDoc(collection(db, 'media'), {
            ...asset,
            uploadedAt: serverTimestamp(),
            uploadedBy: user?.uid || 'system'
          });
          newCount++;
        }
      }
      
      if (newCount > 0) {
        alert(`Sync complete! Added ${newCount} new assets from Cloudinary.`);
      } else {
        alert('Sync complete! Library is already up to date.');
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync library: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (assets.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const asset of assets) {
      try {
        // We reuse the logic from handleDelete but without the individual confirm
        if (asset.publicId) {
          const resourceType = asset.fileType.startsWith('image') ? 'image' : 'video';
          const response = await fetch('/api/v1/media/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId: asset.publicId, resourceType })
          });
          
          // Check content type before parsing JSON
          const contentType = response.headers.get("content-type");
          let result: any = {};
          
          if (contentType && contentType.includes("application/json")) {
            result = await response.json();
          } else {
            console.warn(`Cloudinary delete returned non-JSON for ${asset.publicId}`);
          }

          if (!response.ok) {
            console.warn(`Cloudinary delete failed for ${asset.publicId}:`, result.error);
          }
        }
        await deleteDoc(doc(db, 'media', asset.id));
        successCount++;
      } catch (err) {
        console.error(`Failed to delete ${asset.id}:`, err);
        errorCount++;
      }
    }

    setLoading(false);
    alert(`Deletion complete. Success: ${successCount}, Failed: ${errorCount}`);
  };

  const handleDelete = async (asset: MediaAsset) => {
    setDeletingIds(prev => new Set(prev).add(asset.id));

    try {
      // 1. Delete from Cloudinary via our backend API if we have a publicId
      if (asset.publicId) {
        console.log(`Attempting to delete Cloudinary asset: ${asset.publicId}`);
        const resourceType = asset.fileType.startsWith('image') ? 'image' : 'video';
        const response = await fetch('/api/v1/media/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: asset.publicId, resourceType })
        });

        // Check content type before parsing JSON
        const contentType = response.headers.get("content-type");
        let result: any = {};
        
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const errorText = await response.text();
          console.error("Non-JSON response from server:", errorText);
          throw new Error(`Cloudinary service returned an invalid response (HTML/Text). Status: ${response.status}`);
        }

        if (!response.ok) {
          throw new Error(result.error || 'Failed to delete from Cloudinary');
        }

        // If status is 'success', we can continue
        if (result.status !== 'success') {
          throw new Error("Unexpected response from Cloudinary deletion service.");
        }
      } else {
        console.warn(`Asset ${asset.id} is missing publicId. Deleting from Firestore only.`);
      }

      // 2. Delete from Firestore
      try {
        await deleteDoc(doc(db, 'media', asset.id));
      } catch (dbError) {
        handleFirestoreError(dbError, OperationType.DELETE, `media/${asset.id}`);
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert(error instanceof Error ? error.message : "Error deleting asset");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(asset.id);
        return next;
      });
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssets = assets.filter(asset => 
    asset.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tighter">Media Library</h1>
          <p className="text-gray-500 font-medium">Manage and upload assets for your products</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDeleteAll}
            disabled={loading || assets.length === 0}
            className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all disabled:opacity-50"
            title="Delete all media"
          >
            <Trash2 size={20} />
            <span className="hidden sm:inline">Delete All</span>
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            title="Refresh library"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center space-x-2 bg-[#00A650] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#00A650]/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {uploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
            <span>{uploading ? 'Processing...' : 'Upload Media'}</span>
          </button>
          <a 
            href="/"
            className="flex items-center justify-center bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl hover:bg-gray-50 transition-all"
            title="Go to Home"
          >
            <Home size={20} />
          </a>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          multiple 
          accept="image/*"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search assets by filename..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#00A650] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-[#00A650] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-[#00A650]/20 border-t-[#00A650] rounded-full animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing library...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] py-24 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
            <ImageIcon size={40} />
          </div>
          <h3 className="text-xl font-bold text-[#141414] mb-2">No assets yet</h3>
          <p className="text-gray-500 max-w-xs mb-8">Upload your first image to start building your product media library.</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[#00A650] font-bold hover:underline"
          >
            Upload your first asset
          </button>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-24">
          <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No assets match your search criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => (
              <motion.div 
                layout
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img 
                    src={asset.url} 
                    alt={asset.fileName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-black/20 ${deletingIds.has(asset.id) ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    {deletingIds.has(asset.id) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="animate-spin text-white" size={32} />
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Deleting...</span>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(asset); }}
                          disabled={deletingIds.has(asset.id)}
                          className="absolute top-3 left-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 z-10"
                          title="Delete asset"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="w-full h-full flex items-center justify-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.url, asset.id); }}
                            disabled={deletingIds.has(asset.id)}
                            className="p-3 bg-white text-[#141414] rounded-2xl hover:bg-[#00A650] hover:text-white transition-all shadow-xl disabled:opacity-50"
                            title="Copy URL"
                          >
                            {copiedId === asset.id ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-[#141414] truncate mb-1" title={asset.fileName}>
                    {asset.fileName}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{formatSize(asset.fileSize)}</span>
                    <div className="flex items-center space-x-1">
                      <a 
                        href={asset.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-300 hover:text-blue-500 transition-colors"
                        title="View Full Size"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button 
                        onClick={() => handleDelete(asset)}
                        disabled={deletingIds.has(asset.id)}
                        className={`p-1.5 transition-all rounded-lg ${deletingIds.has(asset.id) ? 'text-red-400 bg-red-50' : 'text-gray-300 hover:text-red-600 hover:bg-red-50'}`}
                        title="Delete asset"
                      >
                        {deletingIds.has(asset.id) ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                {copiedId === asset.id && (
                  <div className="absolute top-2 left-2 bg-[#00A650] text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest animate-bounce">
                    URL Copied
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filename</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size</th>
                <th className="text-left py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="text-right py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                      <img src={asset.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <p className="text-sm font-bold text-[#141414] truncate max-w-[200px]">
                      {asset.fileName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">{asset.id}</p>
                  </td>
                  <td className="py-3 px-6 text-[11px] font-bold text-gray-500 uppercase">
                    {formatSize(asset.fileSize)}
                  </td>
                  <td className="py-3 px-6">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                      {asset.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      {deletingIds.has(asset.id) ? (
                        <div className="flex items-center space-x-2 text-red-500">
                          <Loader2 className="animate-spin" size={16} />
                          <span className="text-[10px] font-bold uppercase">Deleting...</span>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => copyToClipboard(asset.url, asset.id)}
                            disabled={deletingIds.has(asset.id)}
                            className={`p-2 rounded-xl transition-all ${copiedId === asset.id ? 'bg-[#00A650] text-white' : 'text-gray-400 hover:bg-gray-100'} disabled:opacity-50`}
                          >
                            {copiedId === asset.id ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                          <a 
                            href={asset.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all ${deletingIds.has(asset.id) ? 'pointer-events-none opacity-50' : ''}`}
                          >
                            <ExternalLink size={18} />
                          </a>
                          <button 
                            onClick={() => handleDelete(asset)}
                            disabled={deletingIds.has(asset.id)}
                            className={`p-2 transition-all rounded-xl ${deletingIds.has(asset.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                          >
                            {deletingIds.has(asset.id) ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Quick Help */}
      <div className="bg-[#141414] rounded-[40px] p-8 mt-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Using Assets</h2>
          <p className="text-gray-400 text-sm max-w-lg mb-6">
            Click the copy icon on any asset to get its direct URL. You can paste this URL into the product image field when creating or editing items in the Catalog.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#00A650] flex items-center justify-center">
                <Check size={16} />
              </div>
              <span className="text-xs font-bold">Cloudinary Integrated</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <ImageIcon size={16} />
              </div>
              <span className="text-xs font-bold">Direct CDN Delivery</span>
            </div>
          </div>
        </div>
        <ImageIcon className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64 rotate-12" />
      </div>
    </div>
  );
}
