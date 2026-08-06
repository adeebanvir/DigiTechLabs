import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, FileText, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { policyService } from '../services/dataService';
import { PolicyItem } from '../types';

const DEFAULT_POLICIES: Record<string, { title: string; content: string; icon: any }> = {
  shipping: {
    title: 'Global Shipping Policy',
    icon: Truck,
    content: `### 1. Processing Time
All DigiTechLabs orders undergo expedited same-day processing when placed before 2:00 PM EST. Orders placed after 2:00 PM EST or on weekends will be dispatched the following business day.

### 2. Domestic & International Rates
- **Domestic Express Shipping (USA & Canada):** Free on all orders over $50. Standard 24-48 hour delivery.
- **International Priority (EU, UK, Asia, Australia):** Flat rate $15, 3-5 business days via FedEx / DHL Express.
- **Tracking:** Once dispatched, an automated tracking code and live GPS update link will be pushed to your Account Dashboard and primary email.

### 3. Customs, Duties, and Import Taxes
All customs and import taxes for international delivery are prepaid by DigiTechLabs at checkout. No surprise charges upon delivery.`
  },
  refunds: {
    title: 'Refunds & Returns Policy',
    icon: RotateCcw,
    content: `### 1. 30-Day Money-Back Guarantee
If you are not 100% satisfied with your DigiTechLabs purchase, you can return your item within 30 days of delivery for a full refund or exchange.

### 2. Condition Requirements
Items must be returned in their original packaging, including all accessories, manuals, and protective films. 

### 3. How to Process a Return
1. Log into your **DigiTechLabs Account**.
2. Navigate to **Orders** and click **Request Return** on the eligible order.
3. Print the pre-paid return shipping label and drop off the package at any authorized shipping location.
4. Refunds are processed to your original payment method within 3 business days of receiving the package.`
  },
  warranty: {
    title: '2-Year Hardware Warranty',
    icon: Shield,
    content: `### 1. Enterprise-Grade Warranty Coverage
Every device purchased directly from DigiTechLabs is backed by our comprehensive 2-Year Hardware Warranty against manufacturing defects, electronic failures, and battery degradation.

### 2. What Is Covered
- Internal circuit failures, Bluetooth/wireless transmission defects, and power delivery issues.
- Defective display panels, audio drivers, and housing structural integrity.
- Battery capacity drops below 80% within the 2-year window.

### 3. Advance Replacement Service
In the event of a verified defect, we will ship a brand-new replacement device immediately before requiring you to return the defective unit.`
  },
  privacy: {
    title: 'Privacy Policy',
    icon: FileText,
    content: `### 1. Account Privacy & Data Ownership
At DigiTechLabs, user data privacy is fundamental to our architecture. **Your account is strictly private and hidden by default.** Other users cannot search, view, or access your profile or purchase history.

### 2. Information We Collect
We collect only essential information required to fulfill your orders:
- Display name and email address.
- Shipping address and phone number for delivery logistics.
- Anonymized payment reference tokens (we never store raw credit card numbers).

### 3. Zero Data Sales
We NEVER sell, trade, or monetize user data. All data transmission uses TLS 1.3 encryption and zero-knowledge storage principles.`
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    content: `### 1. Agreement to Terms
By accessing or placing an order through DigiTechLabs, you agree to be bound by these Terms of Service.

### 2. Use of Ecosystem Services
DigiTechLabs grants you a non-exclusive, non-transferable license to access our platform for personal and enterprise hardware acquisition. 

### 3. Intellectual Property
All product designs, trademarks, neural audio algorithms, and visual branding elements displayed on DigiTechLabs are the exclusive property of DigiTechLabs Inc.`
  }
};

export default function PolicyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const policyKey = (slug || 'shipping').toLowerCase();
  const [policy, setPolicy] = useState<{ title: string; content: string; icon?: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const defaultData = DEFAULT_POLICIES[policyKey] || DEFAULT_POLICIES.shipping;
    
    policyService.getPolicyBySlug(policyKey).then(remote => {
      if (remote) {
        setPolicy({
          title: remote.title,
          content: remote.content,
          icon: defaultData.icon || FileText
        });
      } else {
        setPolicy(defaultData);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setPolicy(defaultData);
      setLoading(false);
    });
  }, [policyKey]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-gray-50 min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#00A650]" size={40} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Policy Documents...</p>
      </div>
    );
  }

  const PolicyIcon = policy?.icon || FileText;

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#00A650] mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </Link>

        {/* Policy Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {[
            { id: 'shipping', label: 'Shipping' },
            { id: 'refunds', label: 'Refunds & Returns' },
            { id: 'warranty', label: 'Warranty' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Service' }
          ].map(tab => (
            <Link
              key={tab.id}
              to={`/policies/${tab.id}`}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                policyKey === tab.id
                  ? 'bg-[#00A650] text-white shadow-md shadow-[#00A650]/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Policy Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 lg:p-16 rounded-[40px] border border-gray-100 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#00A650]/10 text-[#00A650] rounded-2xl flex items-center justify-center">
              <PolicyIcon size={28} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest">Official Policy</span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{policy?.title}</h1>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed font-normal">
            {policy?.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                const title = paragraph.replace('### ', '');
                return <h3 key={index} className="text-xl font-bold text-gray-900 pt-4 mb-2">{title}</h3>;
              }
              return <p key={index} className="text-base text-gray-600">{paragraph}</p>;
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00A650]" />
              <span>Verified Legal Standard • DigiTechLabs Compliance</span>
            </div>
            <span>Updated May 2026</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
