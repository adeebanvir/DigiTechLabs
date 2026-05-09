import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Product } from '../../types';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'products'), orderBy('stock', 'asc')));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    } finally {
      setLoading(false);
    }
  }

  const updateStock = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, 'products', id), {
        stock: newStock,
        updatedAt: new Date()
      });
      // Update local state for immediate feedback
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockThreshold = 10;
  const lowStockCount = products.filter(p => p.stock <= lowStockThreshold).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Stock Intelligence</h1>
          <p className="text-gray-500 font-medium">Real-time supply chain monitoring and asset fulfillment.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl flex items-center space-x-2 text-orange-600 font-bold text-xs">
            <AlertTriangle size={14} />
            <span>{lowStockCount} Critical Re-supply Required</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Stock</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-[#141414]">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <Package size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">SKUs at Risk</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-red-500">{lowStockCount}</p>
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <TrendingDown size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Optimal Stock</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-green-500">{products.length - lowStockCount}</p>
            <div className="p-2 bg-green-50 text-green-500 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A650] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search products by SKU or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Product</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Current Stock</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Stock Deployment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-8 h-20 bg-gray-50/20" />
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-[#141414]">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{product.sku || product.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg font-bold ${product.stock <= lowStockThreshold ? 'text-red-500' : 'text-[#141414]'}`}>
                        {product.stock}
                      </span>
                      {product.stock <= lowStockThreshold && (
                        <div className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">Low</div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col w-32">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            product.stock <= lowStockThreshold ? 'bg-red-500' : 
                            product.stock <= 25 ? 'bg-orange-500' : 'bg-[#00A650]'
                          }`}
                          style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1 group/input">
                        <button 
                          disabled={updatingId === product.id}
                          onClick={() => updateStock(product.id, product.stock, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all disabled:opacity-50"
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          value={isNaN(product.stock) ? '' : product.stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: val } : p));
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val !== products.find(p => p.id === product.id)?.stock) {
                               updateStock(product.id, val, 0);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = parseInt((e.target as HTMLInputElement).value) || 0;
                              updateStock(product.id, val, 0);
                            }
                          }}
                          className="w-16 text-center text-xs font-bold bg-transparent border-none outline-none focus:text-[#00A650]"
                        />
                        <button 
                          disabled={updatingId === product.id}
                          onClick={() => updateStock(product.id, product.stock, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#00A650] hover:bg-white rounded-lg transition-all disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      {updatingId === product.id && <Loader2 size={16} className="animate-spin text-[#00A650]" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
