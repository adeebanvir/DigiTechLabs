import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../services/dataService';
import { Product, Category } from '../../types';
import { Tag, Plus, Trash2, Search, Loader2, Image as ImageIcon, ChevronRight, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryWithCount extends Category {
  productCount?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProducts()
      ]);
      
      const catsWithCount = cats.map(cat => ({
        ...cat,
        productCount: prods.filter(p => p.category === cat.name).length
      }));
      
      setCategories(catsWithCount);
      setProducts(prods);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) return;
    
    setIsSubmitting(true);
    try {
      await categoryService.addCategory(newCategory);
      setNewCategory({ name: '', slug: '', image: '' });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsSubmitting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory.name)
    : [];

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
            onClick={() => setSelectedCategory(category)}
            className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#00A650] group-hover:bg-[#00A650] group-hover:text-white transition-colors overflow-hidden">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <Tag size={28} />
                )}
              </div>
              <div className="relative z-20">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
                    setCategoryToDelete(category.id); 
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete Category"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[#141414] mb-1">{category.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">/{category.slug}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-xs font-bold text-gray-500">{category.productCount} Products</span>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#00A650] transition-colors" />
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <Tag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No categorical structures defined yet.</p>
          </div>
        )}
      </div>

      {/* Category Products Drawer/Overlay */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00A650]/10 rounded-2xl flex items-center justify-center text-[#00A650]">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#141414]">{selectedCategory.name}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">In-category Inventory</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {categoryProducts.length > 0 ? categoryProducts.map(product => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-[#141414] truncate">{product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.productId}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs font-black text-[#00A650]">${product.price}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Package size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-[#141414]">No products linked</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">Go to the products panel to assign items to this category.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Category Name</label>
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
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Slug (URL Path)</label>
                  <input 
                    type="text" 
                    required
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="neural-linkers"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Icon/Image URL</label>
                  <input 
                    type="text" 
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-medium text-sm"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#141414] text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#141414] mb-2">Delete Category?</h3>
              <p className="text-gray-500 text-sm mb-8">
                This action cannot be undone. Linked products will remain but will lose their category association.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Delete Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

