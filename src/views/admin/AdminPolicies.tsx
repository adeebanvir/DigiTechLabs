import React, { useState, useEffect } from 'react';
import { Shield, Save, Loader2, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { policyService } from '../../services/dataService';
import { Link } from 'react-router-dom';

const POLICIES_LIST = [
  { slug: 'shipping', label: 'Shipping Policy' },
  { slug: 'refunds', label: 'Refunds & Returns' },
  { slug: 'warranty', label: 'Warranty Information' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service' }
];

export default function AdminPolicies() {
  const [activeSlug, setActiveSlug] = useState('shipping');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSavedSuccess(false);
    policyService.getPolicyBySlug(activeSlug).then(policy => {
      if (policy) {
        setTitle(policy.title);
        setContent(policy.content);
      } else {
        const defaultTitle = POLICIES_LIST.find(p => p.slug === activeSlug)?.label || 'Policy';
        setTitle(defaultTitle);
        setContent(`### 1. Overview\nEnter policy details for ${defaultTitle} here...`);
      }
      setLoading(false);
    });
  }, [activeSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await policyService.savePolicy(activeSlug, title, content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Policy Management</h1>
          <p className="text-gray-500 font-medium">Update store shipping, refunds, warranty, privacy, and terms documents accessible from the footer.</p>
        </div>
        <Link 
          to={`/policies/${activeSlug}`} 
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl transition-colors"
        >
          <span>Preview Public Page</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm">
        {POLICIES_LIST.map((policy) => (
          <button
            key={policy.slug}
            onClick={() => setActiveSlug(policy.slug)}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeSlug === policy.slug
                ? 'bg-[#00A650] text-white shadow-md shadow-[#00A650]/20'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {policy.label}
          </button>
        ))}
      </div>

      {/* Editor Card */}
      <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-gray-100 shadow-sm">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="animate-spin mx-auto text-[#00A650]" size={36} />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Loading Document...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Document Heading Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-lg text-gray-900 focus:bg-white focus:border-[#00A650] outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Document Content (Markdown / Text)</label>
              <textarea 
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-mono text-sm text-gray-800 leading-relaxed focus:bg-white focus:border-[#00A650] outline-none"
                placeholder="Write policy content here..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {savedSuccess ? (
                <div className="flex items-center gap-2 text-[#00A650] font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Policy updated live on storefront!</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Saved automatically to Firestore.</span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 bg-[#141414] text-white font-bold text-sm rounded-2xl hover:bg-[#00A650] transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>Publish Document</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
