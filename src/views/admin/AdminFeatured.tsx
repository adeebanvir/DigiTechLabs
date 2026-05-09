import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Product } from '../../types';
import { 
  Star, 
  Search, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productService } from '../../services/dataService';
import { handleFirestoreError, OperationType } from '../../lib/firebase';

export default function AdminFeatured() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      await productService.updateProduct(id, {
        isFeatured: !currentStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'featured') return matchesSearch && product.isFeatured;
    if (filterType === 'not-featured') return matchesSearch && !product.isFeatured;
    return matchesSearch;
  });

  const featuredCount = products.filter(p => p.isFeatured).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Featured Selection</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 saturate-150">Manage high-visibility items appearing on your homepage sliders.</p>
        </div>
        <div className="flex items-center px-6 py-4 bg-[#00A650]/10 rounded-2xl border border-[#00A650]/20">
          <Star className="text-[#00A650] mr-3 fill-[#00A650]" size={20} />
          <div>
            <p className="text-[#141414] font-bold text-lg leading-none">{featuredCount}</p>
            <p className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest mt-1">Total Featured</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow pointer-events-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-medium text-sm"
          />
        </div>
        <div className="flex bg-gray-50 p-1 rounded-2xl">
          {(['all', 'featured', 'not-featured'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type 
                  ? 'bg-white text-[#141414] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {type.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Featured Visibility</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00A650]" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Retrieving Inventory...</p>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-[#141414] text-sm">{product.name}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleFeatured(product.id, !!product.isFeatured)}
                          disabled={updatingId === product.id}
                          className={`relative w-16 h-8 rounded-full transition-all duration-300 flex items-center px-1.5 ${
                            product.isFeatured ? 'bg-[#00A650]' : 'bg-gray-200'
                          } ${updatingId === product.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                        >
                          <motion.div 
                            animate={{ 
                              x: product.isFeatured ? 32 : 0,
                              scale: updatingId === product.id ? 0.8 : 1
                            }}
                            className="w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                          >
                            {updatingId === product.id ? (
                              <Loader2 size={10} className="animate-spin text-gray-400" />
                            ) : product.isFeatured ? (
                              <Star size={10} className="text-[#00A650] fill-[#00A650]" />
                            ) : null}
                          </motion.div>
                          <span className={`absolute left-0 w-full text-center text-[8px] font-bold uppercase tracking-tighter ${
                            product.isFeatured ? 'text-white translate-x-[-12px]' : 'text-gray-400 translate-x-[12px]'
                          }`}>
                            {product.isFeatured ? 'Live' : 'Off'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <AnimatePresence mode="wait">
                        {product.isFeatured ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center space-x-2 text-[#00A650]"
                          >
                            <CheckCircle2 size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Featured</span>
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-300 text-[11px] font-bold uppercase tracking-widest"
                          >
                            Hidden
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <AlertCircle className="w-10 h-10 mx-auto text-gray-200 mb-4" />
                    <p className="text-sm font-bold text-gray-300 uppercase tracking-widest italic">No products match your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 bg-[#141414] rounded-3xl text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Info className="text-[#00A650]" />
          </div>
          <div>
            <h4 className="font-bold">Optimization Protocol</h4>
            <p className="text-xs text-gray-400 mt-1">For optimal storefront performance, keep featured items between 4 and 12 selections. This ensures the slider remains engaging without overloading system resources.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
