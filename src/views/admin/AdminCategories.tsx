import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Tag, Plus, Trash2, Search, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      const prodSnap = await getDocs(collection(db, 'products'));
      
      const prodDocs = prodSnap.docs.map(doc => doc.data());
      
      const cats = catSnap.docs.map(doc => {
        const data = doc.data();
        const count = prodDocs.filter(p => p.category === data.name).length;
        return { id: doc.id, ...data, productCount: count } as Category;
      });
      
      setCategories(cats);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) return;
    
    setIsSubmitting(true);
    try {
      const id = newCategory.slug.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'categories', id), {
        ...newCategory,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewCategory({ name: '', slug: '', image: '' });
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this category? Products won't be deleted but will lose their category reference.")) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        fetchCategories();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Category Architecture</h1>
          <p className="text-gray-500 font-medium">Define and organize your product hierarchy.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#141414] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center hover:bg-[#00A650] transition-all shadow-lg shadow-black/10"
        >
          <Plus size={20} className="mr-2" />
          Define Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-[2rem] border border-gray-100 animate-pulse" />
          ))
        ) : categories.length > 0 ? categories.map((category) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#00A650] group-hover:bg-[#00A650] group-hover:text-white transition-colors">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Tag size={28} />
                )}
              </div>
              <button 
                onClick={() => handleDelete(category.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-[#141414] mb-1">{category.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">/{category.slug}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-xs font-bold text-gray-500">{category.productCount} Products</span>
              <div className="w-2 h-2 rounded-full bg-[#00A650]" />
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <Tag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No categorical structures defined yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-[#141414] mb-6">New Category Definition</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCategory.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewCategory({ 
                        ...newCategory, 
                        name: val, 
                        slug: val.toLowerCase().replace(/\s+/g, '-') 
                      });
                    }}
                    placeholder="e.g. Neural Linkers"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Slugs (URL Path)</label>
                  <input 
                    type="text" 
                    required
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="neural-linkers"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Icon/Image URL</label>
                  <input 
                    type="text" 
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#00A650] text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-[#008a42] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
