import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, Edit, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { faqService } from '../../services/dataService';
import { FAQItem } from '../../types';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: '',
    answer: ''
  });

  const loadFaqs = async () => {
    setLoading(true);
    const data = await faqService.getFAQs();
    setFaqs(data.length > 0 ? data : [
      { id: '1', question: 'How fast is express shipping?', answer: 'Orders placed before 2 PM EST ship same-day for 24-48 hour delivery.' },
      { id: '2', question: 'What is the hardware warranty policy?', answer: 'All hardware includes a 2-Year advance replacement warranty.' }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;

    if (editingId) {
      await faqService.updateFAQ(editingId, form);
      setEditingId(null);
    } else {
      await faqService.addFAQ(form);
    }
    setForm({ question: '', answer: '' });
    loadFaqs();
  };

  const handleEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id: string) => {
    await faqService.deleteFAQ(id);
    loadFaqs();
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[#141414] tracking-tight">FAQ Management</h1>
        <p className="text-gray-500 font-medium">Create and refine frequently asked questions shown on support and product pages.</p>
      </div>

      <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-bold text-[#141414] text-lg">{editingId ? 'Edit FAQ Item' : 'Add New FAQ'}</h3>
        <form onSubmit={handleAddOrUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question</label>
            <input 
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-medium text-sm focus:bg-white focus:border-[#00A650] outline-none"
              placeholder="e.g., What is your return window?"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Answer</label>
            <textarea 
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-medium text-sm focus:bg-white focus:border-[#00A650] outline-none resize-none"
              placeholder="Provide a clear, helpful response..."
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm({ question: '', answer: '' }); }}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-[#00A650] text-white rounded-2xl font-bold text-sm hover:bg-[#009245] transition-all shadow-lg shadow-[#00A650]/20 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>{editingId ? 'Update FAQ' : 'Publish FAQ'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing FAQs */}
      <div className="space-y-4">
        <h3 className="font-bold text-[#141414] text-xl">Active FAQs ({faqs.length})</h3>
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <Loader2 className="animate-spin mx-auto text-[#00A650]" size={32} />
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between gap-6 group hover:border-gray-200 transition-all">
              <div className="space-y-2">
                <p className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <HelpCircle size={18} className="text-[#00A650]" />
                  {faq.question}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed pl-6">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleEdit(faq)}
                  className="p-2.5 bg-gray-50 text-gray-500 hover:text-[#00A650] hover:bg-gray-100 rounded-xl transition-all"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(faq.id)}
                  className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
