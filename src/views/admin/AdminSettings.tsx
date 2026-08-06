import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, Plus, X, Tag, Info, Image as ImageIcon, Link as LinkIcon, Edit2, Mail } from 'lucide-react';
import { AppSetting, Banner } from '../../types';
import { settingsService } from '../../services/dataService';

const DEFAULT_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Spring Collection 2026',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200',
    link: '/shop?category=Audio',
    createdAt: new Date('2026-01-01')
  },
  {
    id: '2',
    title: 'Elite Gaming Gear',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Gaming',
    createdAt: new Date('2026-01-02')
  },
  {
    id: '3',
    title: 'Smart Office Pro',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Work',
    createdAt: new Date('2026-01-03')
  },
  {
    id: '4',
    title: 'Next-Gen Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Wearables',
    createdAt: new Date('2026-01-04')
  },
  {
    id: '5',
    title: 'Immersive Visuals',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Visual',
    createdAt: new Date('2026-01-05')
  }
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newOffer, setNewOffer] = useState('');
  
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  useEffect(() => {
    setLoading(true);
    settingsService.getSettings('home').then(data => {
      if (data) {
        setSettings({
          ...data,
          banners: (data.banners && data.banners.length > 0) ? data.banners : DEFAULT_BANNERS,
          offers: (data.offers && data.offers.length > 0) ? data.offers : ['New Arrivals', 'Best Sellers', 'Flash Sale', 'Innovation', 'Spring Collection', 'Echo Series', 'Pro Grade', 'Limited Edition'],
          limitBanners: data.limitBanners ?? false,
          contactTitle: data.contactTitle || "Let's Start a",
          contactSubtitle: data.contactSubtitle || "Technical issues, partnership inquiries, or just sharing your tech vision—our experts are ready to listen.",
          supportEmail: data.supportEmail || "assist@digitechlabs.com",
          partnershipsEmail: data.partnershipsEmail || "growth@digitechlabs.com",
          phone: data.phone || "+1 (888) DIGI-LAB",
          address: data.address || "One Infinite Loop, Tech City",
          responseTime: data.responseTime || "Currently active: 12-24 hour response window."
        });
      } else {
        setSettings({
            id: 'home',
            whatWeAreTitle: 'Simple Gear.',
            whatWeAreHighlight: 'Better Life.',
            whatWeAreDescription: 'We curate high-performance, minimalist tech that integrates seamlessly into your daily workflow.',
            offers: ['New Arrivals', 'Best Sellers', 'Flash Sale', 'Innovation', 'Spring Collection', 'Echo Series', 'Pro Grade', 'Limited Edition'],
            banners: DEFAULT_BANNERS,
            limitBanners: false,
            updatedAt: new Date(),
            contactTitle: "Let's Start a",
            contactSubtitle: "Technical issues, partnership inquiries, or just sharing your tech vision—our experts are ready to listen.",
            supportEmail: "assist@digitechlabs.com",
            partnershipsEmail: "growth@digitechlabs.com",
            phone: "+1 (888) DIGI-LAB",
            address: "One Infinite Loop, Tech City",
            responseTime: "Currently active: 12-24 hour response window."
        });
      }
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch settings in admin", err);
      setSettings({
          id: 'home',
          whatWeAreTitle: 'Simple Gear.',
          whatWeAreHighlight: 'Better Life.',
          whatWeAreDescription: 'We curate high-performance, minimalist tech that integrates seamlessly into your daily workflow.',
          offers: ['New Arrivals', 'Best Sellers', 'Flash Sale', 'Innovation', 'Spring Collection', 'Echo Series', 'Pro Grade', 'Limited Edition'],
          banners: DEFAULT_BANNERS,
          limitBanners: false,
          updatedAt: new Date(),
          contactTitle: "Let's Start a",
          contactSubtitle: "Technical issues, partnership inquiries, or just sharing your tech vision—our experts are ready to listen.",
          supportEmail: "assist@digitechlabs.com",
          partnershipsEmail: "growth@digitechlabs.com",
          phone: "+1 (888) DIGI-LAB",
          address: "One Infinite Loop, Tech City",
          responseTime: "Currently active: 12-24 hour response window."
      });
      setLoading(false);
    });
  }, []);

  const seedDefaults = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      banners: DEFAULT_BANNERS,
      offers: ['New Arrivals', 'Best Sellers', 'Flash Sale', 'Innovation', 'Spring Collection', 'Echo Series', 'Pro Grade', 'Limited Edition']
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await settingsService.updateSettings('home', settings);
      alert('System configuration updated successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to update system configuration.');
    } finally {
      setSaving(false);
    }
  };

  const addOffer = () => {
    if (!newOffer.trim() || !settings) return;
    if (settings.offers.includes(newOffer.trim())) return;
    
    setSettings({
      ...settings,
      offers: [...settings.offers, newOffer.trim()]
    });
    setNewOffer('');
  };

  const removeOffer = (offer: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      offers: settings.offers.filter(o => o !== offer)
    });
  };

  const addBanner = () => {
    if (!settings) return;
    const newB: Banner = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Event',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000',
      link: '/shop',
      createdAt: new Date()
    };
    setSettings({
      ...settings,
      banners: [newB, ...(settings.banners || [])]
    });
  };

  const removeBanner = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      banners: settings.banners.filter(b => b.id !== id)
    });
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      banners: settings.banners.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#00A650]" size={40} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accessing Core Config...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Ecosystem Branding</h1>
        <p className="text-gray-500 font-medium">Manage the homepage "What We Are" content, banners, and active offers.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#00A650]/10 text-[#00A650] rounded-xl">
               <Info size={18} />
            </div>
            <h3 className="font-bold text-[#141414]">Identity & Content</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Primary Title</label>
              <input 
                type="text" 
                value={settings?.whatWeAreTitle}
                onChange={e => setSettings(prev => prev ? {...prev, whatWeAreTitle: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium"
                placeholder="e.g., Simple Gear."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Highlight Text</label>
              <input 
                type="text" 
                value={settings?.whatWeAreHighlight}
                onChange={e => setSettings(prev => prev ? {...prev, whatWeAreHighlight: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium text-[#00A650]"
                placeholder="e.g., Better Life."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description Brief</label>
            <textarea 
              rows={4}
              value={settings?.whatWeAreDescription}
              onChange={e => setSettings(prev => prev ? {...prev, whatWeAreDescription: e.target.value} : null)}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium resize-none"
              placeholder="Tell your story in 2-3 sentences..."
              required
            />
          </div>
        </div>

        {/* Banners Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                 <ImageIcon size={18} />
              </div>
              <h3 className="font-bold text-[#141414]">Promotional Banners</h3>
            </div>
              <button 
                type="button"
                onClick={seedDefaults}
                className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all mr-2"
              >
                <span>Load Templates</span>
              </button>
              <button 
                type="button"
                onClick={addBanner}
                className="flex items-center space-x-2 text-xs font-bold text-[#00A650] uppercase tracking-widest hover:bg-[#00A650]/10 px-4 py-2 rounded-xl transition-all"
              >
              <Plus size={16} />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-6 bg-blue-50 rounded-[2rem] border border-blue-100 mb-8 mt-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-bold text-blue-900 uppercase tracking-wider">Display Newest Four Only</span>
              <span className="text-xs text-blue-600 font-medium">"Having four promotional banners will make the site look nicer"</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings(prev => prev ? {...prev, limitBanners: !prev.limitBanners} : null)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${settings?.limitBanners ? 'bg-[#00A650]' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings?.limitBanners ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings?.banners?.slice().sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
              return dateB.getTime() - dateA.getTime();
            }).map((banner, index) => (
              <div key={banner.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 group relative">
                <button 
                  type="button"
                  onClick={() => removeBanner(banner.id)}
                  className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={16} />
                </button>

                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-gray-200">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Display Title</label>
                    <input 
                      type="text"
                      value={banner.title}
                      onChange={e => updateBanner(banner.id, { title: e.target.value })}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Image URL</label>
                    <input 
                      type="text"
                      value={banner.imageUrl}
                      onChange={e => updateBanner(banner.id, { imageUrl: e.target.value })}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Target Link</label>
                    <input 
                      type="text"
                      value={banner.link}
                      onChange={e => updateBanner(banner.id, { link: e.target.value })}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
            {settings?.banners?.length === 0 && (
              <div className="col-span-2 py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-[2rem]">
                <ImageIcon size={32} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No banners added yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
               <Tag size={18} />
            </div>
            <h3 className="font-bold text-[#141414]">Taglines Area</h3>
          </div>

          <div className="flex space-x-3">
            <input 
              type="text" 
              value={newOffer}
              onChange={e => setNewOffer(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addOffer())}
              className="flex-grow bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium"
              placeholder="Add new offer or tagline..."
            />
            <button 
              type="button"
              onClick={addOffer}
              className="bg-[#141414] text-white px-6 rounded-2xl font-bold hover:bg-[#00A650] transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {settings?.offers.map(offer => (
              <div 
                key={offer}
                className="flex items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-full space-x-2 animate-in zoom-in duration-300"
              >
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{offer}</span>
                <button 
                  type="button"
                  onClick={() => removeOffer(offer)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {settings?.offers.length === 0 && (
              <p className="text-sm text-gray-400 italic">No active tags listed.</p>
            )}
          </div>
        </div>

        {/* Contact Customization Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-500/10 text-[#00A650] rounded-xl">
               <Mail size={18} />
            </div>
            <h3 className="font-bold text-[#141414]">Contact Center Hub</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Contact Header Title</label>
              <input 
                type="text" 
                value={settings?.contactTitle || ''}
                onChange={e => setSettings(prev => prev ? {...prev, contactTitle: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium"
                placeholder="e.g., Let's Start a"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Support Email Address</label>
              <input 
                type="email" 
                value={settings?.supportEmail || ''}
                onChange={e => setSettings(prev => prev ? {...prev, supportEmail: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium text-[#00A650] font-sans"
                placeholder="e.g., support@yourbrand.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Contact Header Subtitle</label>
            <textarea 
              rows={2}
              value={settings?.contactSubtitle || ''}
              onChange={e => setSettings(prev => prev ? {...prev, contactSubtitle: e.target.value} : null)}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium resize-none"
              placeholder="E.g., Technical issues, partnerships, or support requests..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Partnerships Email Address</label>
              <input 
                type="email" 
                value={settings?.partnershipsEmail || ''}
                onChange={e => setSettings(prev => prev ? {...prev, partnershipsEmail: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium text-xs font-mono"
                placeholder="e.g., partnerships@yourbrand.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Telephone Line</label>
              <input 
                type="text" 
                value={settings?.phone || ''}
                onChange={e => setSettings(prev => prev ? {...prev, phone: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium text-sm"
                placeholder="e.g., +1 (888) DIGI-LAB"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Response Speed Note</label>
              <input 
                type="text" 
                value={settings?.responseTime || ''}
                onChange={e => setSettings(prev => prev ? {...prev, responseTime: e.target.value} : null)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium text-sm text-amber-600"
                placeholder="e.g., Active: 2-3 hour window"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Headquarters Address</label>
            <input 
              type="text" 
              value={settings?.address || ''}
              onChange={e => setSettings(prev => prev ? {...prev, address: e.target.value} : null)}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#00A650]/20 font-medium text-sm"
              placeholder="e.g., One Infinite Loop, Tech City"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center space-x-3 bg-[#141414] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#00A650] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#141414]/10 hover:shadow-[#00A650]/20"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Deploy Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
