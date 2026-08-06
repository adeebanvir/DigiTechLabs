import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Save, Loader2, CheckCircle2, ShieldCheck, Percent } from 'lucide-react';
import { motion } from 'motion/react';
import { taxService } from '../../services/dataService';
import { TaxRate } from '../../types';

export default function AdminTax() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [country, setCountry] = useState('');
  const [ratePercent, setRatePercent] = useState<number | ''>('');

  const loadTaxRates = async () => {
    setLoading(true);
    const rates = await taxService.getTaxRates();
    if (rates.length > 0) {
      setTaxRates(rates);
    } else {
      setTaxRates([
        { id: '1', country: 'United States', ratePercent: 7.5 },
        { id: '2', country: 'Canada', ratePercent: 13.0 },
        { id: '3', country: 'United Kingdom', ratePercent: 20.0 },
        { id: '4', country: 'Germany', ratePercent: 19.0 },
        { id: '5', country: 'Australia', ratePercent: 10.0 }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTaxRates();
  }, []);

  const handleAddTaxRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim() || ratePercent === '') return;

    setSaving(true);
    await taxService.saveTaxRate(country.trim(), Number(ratePercent));
    setCountry('');
    setRatePercent('');
    setSaving(false);
    loadTaxRates();
  };

  const handleDelete = async (id: string) => {
    await taxService.deleteTaxRate(id);
    loadTaxRates();
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Tax Rates by Country</h1>
          <p className="text-gray-500 font-medium">Configure regional tax rules applied dynamically during checkout based on delivery address (VPN-proof).</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-[#00A650] border border-green-200 rounded-full text-xs font-bold">
          <ShieldCheck size={16} />
          <span>Address-Based Calculation</span>
        </div>
      </div>

      {/* Add Tax Rate Form */}
      <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#141414] text-lg mb-6">Add / Update Country Tax Rate</h3>
        <form onSubmit={handleAddTaxRate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Country Name</label>
            <input 
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 font-bold text-sm text-gray-900 focus:bg-white focus:border-[#00A650] outline-none"
              placeholder="e.g. France, Japan"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tax Percentage (%)</label>
            <div className="relative">
              <input 
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={ratePercent}
                onChange={(e) => setRatePercent(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 font-bold text-sm text-gray-900 focus:bg-white focus:border-[#00A650] outline-none pr-10"
                placeholder="e.g. 20.0"
                required
              />
              <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-[#00A650] text-white font-bold text-sm rounded-2xl hover:bg-[#009245] transition-all shadow-lg shadow-[#00A650]/20 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            <span>Save Tax Rate</span>
          </button>
        </form>
      </div>

      {/* Active Tax Rates Table */}
      <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-lg">Configured Country Tax Rates</h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{taxRates.length} Regions</span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="animate-spin mx-auto text-[#00A650]" size={36} />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {taxRates.map((rate) => (
              <div key={rate.id} className="p-6 px-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{rate.country}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Calculated automatically based on user shipping address</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-4 py-1.5 bg-green-50 text-[#00A650] rounded-xl text-sm font-bold">
                    {rate.ratePercent}% Tax
                  </span>
                  <button 
                    onClick={() => handleDelete(rate.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
