import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../../types';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to decommission this technology SKU?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Inventory Control</h1>
          <p className="text-gray-500 font-medium">Manage and optimize your product ecosystem.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-[#00A650] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center hover:bg-[#008a42] transition-all shadow-lg shadow-[#00A650]/20"
        >
          <Plus size={20} className="mr-2" />
          Add Innovation
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A650] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by SKU, name, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
             <button className="flex items-center space-x-2 px-4 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                <span>Filters</span>
             </button>
             <button className="p-3 rounded-2xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors">
                <MoreVertical size={18} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Innovation</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Pricing</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Stock Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Performance</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8 h-20 bg-gray-50/20" />
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden ring-1 ring-gray-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-[#141414] leading-none mb-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{product.sku || product.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-[#141414]">${product.price.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className={`text-xs font-bold ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                            {product.stock} Units
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                            />
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-1 text-[#FACC15]">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold text-[#141414]">{product.rating}</span>
                        <span className="text-xs text-gray-400 font-medium">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                            className="p-2 text-gray-400 hover:text-[#00A650] hover:bg-[#00A650]/5 rounded-lg transition-all"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500 font-medium">No results matched your ecosystem query.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">
                Showing <span className="font-bold text-[#141414]">{filteredProducts.length}</span> of <span className="font-bold text-[#141414]">{products.length}</span> technological assets
            </p>
            <div className="flex items-center space-x-2">
                <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-[#141414] disabled:opacity-50">
                    <ChevronLeft size={18} />
                </button>
                <div className="flex items-center mx-2 space-x-1">
                    <button className="w-8 h-8 rounded-lg bg-[#00A650] text-white text-xs font-bold">1</button>
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-xs font-bold transition-colors">2</button>
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-50 text-xs font-bold transition-colors">3</button>
                </div>
                <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-[#141414]">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Modal would go here - for brevity skipping full form logic for now, but placeholder established */}
    </div>
  );
}

function Star({ size, fill, className }: any) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill={fill} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
