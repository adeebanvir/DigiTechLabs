import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Send, 
  Cloud, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  FileJson, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { backupService, FirebaseBackupData, TargetFirebaseConfig } from '../../services/backupService';
import { productService, bannerService, mediaService } from '../../services/dataService';

export default function DataMigrationSuite() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [migratingImages, setMigratingImages] = useState(false);

  const [statusMsg, setStatusMsg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [jsonBackup, setJsonBackup] = useState<FirebaseBackupData | null>(null);

  // Target Firebase Form
  const [targetConfig, setTargetConfig] = useState<TargetFirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  // Target Cloudinary Form
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('');
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState('');
  const [imageProgress, setImageProgress] = useState<{ current: number; total: number; currentUrl: string } | null>(null);

  // File Upload state for JSON restore
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 1. Export All Firebase Data
  const handleExportFirebase = async () => {
    setExporting(true);
    setStatusMsg('Gathering all documents from Firestore collections...');
    try {
      const data = await backupService.exportAllFirebaseData();
      setJsonBackup(data);

      // Create download blob
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `firebase-full-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const totalDocs = Object.values(data.collections).reduce((sum, arr) => sum + arr.length, 0);
      setStatusMsg(`Export successful! Exported ${totalDocs} total documents across ${Object.keys(data.collections).length} collections.`);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(false);
    }
  };

  // 2. Import JSON file to Current Database
  const handleRestoreCurrentDb = async () => {
    if (!selectedFile && !jsonBackup) {
      alert('Please select a .json backup file or export data first.');
      return;
    }

    if (!confirm('Warning: Importing data will merge documents into your current Firestore database. Continue?')) {
      return;
    }

    setImporting(true);
    setStatusMsg('Reading backup file...');

    try {
      let dumpData: FirebaseBackupData;
      if (selectedFile) {
        const fileContent = await selectedFile.text();
        dumpData = JSON.parse(fileContent);
      } else {
        dumpData = jsonBackup!;
      }

      const total = await backupService.restoreToCurrentDb(dumpData, (msg) => setStatusMsg(msg));
      setStatusMsg(`Restore complete! Successfully imported ${total} documents into the current database.`);
      alert(`Import complete! Successfully imported ${total} documents.`);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Import error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setImporting(false);
    }
  };

  // 3. Transfer Data to Target Firebase Project using Config Keys
  const handleTransferToTargetFirebase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetConfig.apiKey || !targetConfig.projectId) {
      alert('Please fill in at least the Target API Key and Project ID.');
      return;
    }

    if (!confirm(`Are you sure you want to write all data to target Firebase project "${targetConfig.projectId}"?`)) {
      return;
    }

    setTransferring(true);
    setStatusMsg('Exporting source data first...');

    try {
      const dumpData = jsonBackup || await backupService.exportAllFirebaseData();
      const totalTransferred = await backupService.transferToTargetFirebase(targetConfig, dumpData, (msg) => setStatusMsg(msg));
      setStatusMsg(`Transfer finished! ${totalTransferred} documents migrated to project "${targetConfig.projectId}".`);
      alert(`Transfer completed successfully to target Firebase project "${targetConfig.projectId}"!`);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Transfer failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setTransferring(false);
    }
  };

  // 4. Migrate Cloudinary Media to New Cloudinary Account
  const handleMigrateCloudinary = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      alert('Please enter both the Target Cloud Name and Unsigned Upload Preset.');
      return;
    }

    setMigratingImages(true);
    setStatusMsg('Starting image migration to target Cloudinary account...');

    try {
      const migratedAssets = await backupService.migrateImagesToCloudinary(
        cloudinaryCloudName,
        cloudinaryUploadPreset,
        (current, total, url) => {
          setImageProgress({ current, total, currentUrl: url });
          setStatusMsg(`Uploading image ${current} of ${total}...`);
        }
      );

      setStatusMsg(`Migrated ${migratedAssets.length} images to Cloudinary account "${cloudinaryCloudName}".`);

      if (migratedAssets.length > 0 && confirm('Would you like to auto-update old Cloudinary URLs in your products with the new Cloudinary URLs?')) {
        setStatusMsg('Updating image URLs in product catalog...');
        let updatedProductsCount = 0;

        const products = await productService.getAllProducts();
        for (const prod of products) {
          let modified = false;
          let newImages = [...(prod.images || [])];

          migratedAssets.forEach(m => {
            newImages = newImages.map(imgUrl => {
              if (imgUrl === m.originalUrl) {
                modified = true;
                return m.newUrl;
              }
              return imgUrl;
            });
          });

          if (modified) {
            await productService.updateProduct(prod.id, { images: newImages });
            updatedProductsCount++;
          }
        }
        setStatusMsg(`Complete! Updated images for ${updatedProductsCount} products.`);
      }

      alert(`Cloudinary migration finished! ${migratedAssets.length} images uploaded to target Cloudinary account.`);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Cloudinary migration failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setMigratingImages(false);
      setImageProgress(null);
    }
  };

  const copyJsonToClipboard = () => {
    if (!jsonBackup) return;
    navigator.clipboard.writeText(JSON.stringify(jsonBackup, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-[#00A650] rounded-2xl">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#141414]">Data Export, Import & Project Migration</h3>
            <p className="text-xs text-gray-500 mt-1">
              Export all database collections, migrate to another Firebase project, or move images to a new Cloudinary account using API keys.
            </p>
          </div>
        </div>
      </div>

      {/* Live Status Logger */}
      {statusMsg && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center space-x-3 text-xs text-gray-800">
          {(exporting || importing || transferring || migratingImages) ? (
            <Loader2 className="animate-spin text-[#00A650] shrink-0" size={18} />
          ) : (
            <CheckCircle2 className="text-[#00A650] shrink-0" size={18} />
          )}
          <span className="font-medium leading-relaxed">{statusMsg}</span>
        </div>
      )}

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* TOOL 1: Export Firebase Data */}
        <div className="p-6 bg-gray-50/70 border border-gray-100 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <Download size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#141414] text-sm">1. Export Firebase Database</h4>
              <p className="text-[11px] text-gray-400">Download a full JSON snapshot of all Firestore collections.</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Includes products, categories, orders, settings, faqs, policies, tax rates, media, banners, and users.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportFirebase}
              disabled={exporting}
              className="flex items-center space-x-2 px-5 py-3 bg-[#00A650] text-white rounded-xl text-xs font-bold hover:bg-[#009245] transition-all disabled:opacity-50 shadow-md shadow-[#00A650]/20"
            >
              {exporting ? <Loader2 className="animate-spin" size={16} /> : <FileJson size={16} />}
              <span>Export All Collections (.json)</span>
            </button>

            {jsonBackup && (
              <button
                type="button"
                onClick={copyJsonToClipboard}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copied ? 'Copied JSON!' : 'Copy to Clipboard'}</span>
              </button>
            )}
          </div>

          {jsonBackup && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-gray-100 text-[11px] space-y-1">
              <span className="font-bold text-gray-700">Backup Summary:</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-500 mt-1">
                {Object.entries(jsonBackup.collections).map(([key, docs]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span className="font-mono font-bold text-gray-800">{docs.length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TOOL 2: Import / Restore Data from JSON */}
        <div className="p-6 bg-gray-50/70 border border-gray-100 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Upload size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#141414] text-sm">2. Restore / Import Database</h4>
              <p className="text-[11px] text-gray-400">Upload a JSON backup file to populate or restore Firestore.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select JSON Backup File</label>
            <input 
              type="file"
              accept=".json"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-gray-800 hover:file:bg-gray-100 border border-gray-200 rounded-2xl p-2 bg-white"
            />
          </div>

          <button
            type="button"
            onClick={handleRestoreCurrentDb}
            disabled={importing || (!selectedFile && !jsonBackup)}
            className="flex items-center space-x-2 px-5 py-3 bg-[#141414] text-white rounded-xl text-xs font-bold hover:bg-[#00A650] transition-all disabled:opacity-40 shadow-md"
          >
            {importing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            <span>Import / Restore into Active Database</span>
          </button>
        </div>

        {/* TOOL 3: Transfer to Another Firebase Project */}
        <div className="p-6 bg-gray-50/70 border border-gray-100 rounded-3xl space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <Key size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#141414] text-sm">3. Migrate to Another Firebase Project</h4>
              <p className="text-[11px] text-gray-400">Enter the API Keys for your target Firebase project to transfer all data directly.</p>
            </div>
          </div>

          <form onSubmit={handleTransferToTargetFirebase} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Target API Key *</label>
                <input 
                  type="text"
                  value={targetConfig.apiKey}
                  onChange={e => setTargetConfig({...targetConfig, apiKey: e.target.value})}
                  placeholder="AIzaSy..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Target Project ID *</label>
                <input 
                  type="text"
                  value={targetConfig.projectId}
                  onChange={e => setTargetConfig({...targetConfig, projectId: e.target.value})}
                  placeholder="my-new-firebase-app"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Auth Domain</label>
                <input 
                  type="text"
                  value={targetConfig.authDomain}
                  onChange={e => setTargetConfig({...targetConfig, authDomain: e.target.value})}
                  placeholder="my-app.firebaseapp.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Storage Bucket</label>
                <input 
                  type="text"
                  value={targetConfig.storageBucket}
                  onChange={e => setTargetConfig({...targetConfig, storageBucket: e.target.value})}
                  placeholder="my-app.appspot.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Messaging Sender ID</label>
                <input 
                  type="text"
                  value={targetConfig.messagingSenderId}
                  onChange={e => setTargetConfig({...targetConfig, messagingSenderId: e.target.value})}
                  placeholder="1234567890"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">App ID</label>
                <input 
                  type="text"
                  value={targetConfig.appId}
                  onChange={e => setTargetConfig({...targetConfig, appId: e.target.value})}
                  placeholder="1:123456789:web:abcdef..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={transferring}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all disabled:opacity-50 shadow-md"
            >
              {transferring ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              <span>Transfer All Data to Target Firebase Project</span>
            </button>
          </form>
        </div>

        {/* TOOL 4: Migrate Cloudinary Media Account */}
        <div className="p-6 bg-gray-50/70 border border-gray-100 rounded-3xl space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <Cloud size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#141414] text-sm">4. Migrate Images to New Cloudinary Account</h4>
              <p className="text-[11px] text-gray-400">Re-upload all stored images to your own target Cloudinary cloud account.</p>
            </div>
          </div>

          <form onSubmit={handleMigrateCloudinary} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Target Cloud Name *</label>
                <input 
                  type="text"
                  value={cloudinaryCloudName}
                  onChange={e => setCloudinaryCloudName(e.target.value)}
                  placeholder="your-cloud-name"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Unsigned Upload Preset *</label>
                <input 
                  type="text"
                  value={cloudinaryUploadPreset}
                  onChange={e => setCloudinaryUploadPreset(e.target.value)}
                  placeholder="ml_default or custom_preset"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-mono focus:border-[#00A650] focus:outline-none"
                  required
                />
              </div>
            </div>

            {imageProgress && (
              <div className="p-3 bg-white border border-indigo-100 rounded-xl space-y-1">
                <div className="flex justify-between text-xs font-bold text-indigo-900">
                  <span>Migrating image assets...</span>
                  <span>{imageProgress.current} / {imageProgress.total}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300" 
                    style={{ width: `${(imageProgress.current / imageProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={migratingImages}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
            >
              {migratingImages ? <Loader2 className="animate-spin" size={16} /> : <Cloud size={16} />}
              <span>Migrate All Images to Target Cloudinary Account</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
