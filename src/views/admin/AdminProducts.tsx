import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../services/dataService';
import { Product, Category } from '../../types';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Save,
  Star,
  Settings,
  ArrowUpDown,
  Tag,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SortOption = 'A-Z' | 'Z-A' | 'ID' | 'PriceLowToHigh' | 'PriceHighToLow';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('ID');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [filterStock, setFilterStock] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    discount: 0,
    stock: 0,
    productId: '',
    isReviewsEnabled: true,
    status: 'published',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    sku: '',
    rating: 0,
    reviews: 0,
    features: [],
    specs: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorVisible, setErrorVisible] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    setErrorVisible(null);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error(error);
      setErrorVisible("Failed to load inventory data. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await productService.deleteProduct(id);
      fetchInitialData();
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        productId: product.productId || (products.length + 1).toString().padStart(3, '0'),
        discount: product.discount || 0,
        isReviewsEnabled: product.isReviewsEnabled !== undefined ? product.isReviewsEnabled : true,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: categories[0]?.name || '',
        price: 0,
        discount: 0,
        stock: 0,
        productId: (products.length + 1).toString().padStart(3, '0'),
        isReviewsEnabled: true,
        status: 'published',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
        rating: 4.5,
        reviews: 0,
        features: [],
        specs: {}
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorVisible(null);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.addProduct(formData as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error(error);
      setErrorVisible("Security block or network error: Unable to save product details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAndSortedProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.productId || '').includes(searchQuery);
      
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      
      const price = p.price || 0;
      const discount = p.discount || 0;
      const discountedPrice = price - (price * (discount / 100));
      const matchesPrice = filterPrice === 'All' || (
        filterPrice === '0-100' ? discountedPrice <= 100 :
        filterPrice === '100-500' ? (discountedPrice > 100 && discountedPrice <= 500) :
        filterPrice === '500-1000' ? (discountedPrice > 500 && discountedPrice <= 1000) :
        filterPrice === '1000+' ? discountedPrice > 1000 : true
      );

      const rating = p.rating || 0;
      const matchesRating = filterRating === 'All' || (
        filterRating === '4+' ? rating >= 4 :
        filterRating === '3+' ? rating >= 3 : true
      );

      const stock = p.stock || 0;
      const matchesStock = filterStock === 'All' || (
        filterStock === 'In Stock' ? stock > 10 :
        filterStock === 'Low Stock' ? (stock > 0 && stock <= 10) :
        filterStock === 'Out of Stock' ? stock === 0 : true
      );

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'A-Z': return (a.name || '').localeCompare(b.name || '');
        case 'Z-A': return (b.name || '').localeCompare(a.name || '');
        case 'ID': return (a.productId || '').localeCompare(b.productId || '');
        case 'PriceLowToHigh': return (a.price || 0) - (b.price || 0);
        case 'PriceHighToLow': return (b.price || 0) - (a.price || 0);
        default: return 0;
      }
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Product Management</h1>
          <p className="text-gray-500 font-medium">Control your inventory, pricing, and display settings.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#00A650] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center hover:bg-[#008a42] transition-all shadow-lg shadow-[#00A650]/20"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A650] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, name, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all font-mono"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <Tag size={16} className="text-gray-400" />
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-gray-600 cursor-pointer"
                >
                  <option value="All">Categories</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
             </div>

             <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <ArrowUpDown size={16} className="text-gray-400" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-gray-600 cursor-pointer"
                >
                  <option value="ID">By ID</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                  <option value="PriceLowToHigh">Price: Low-High</option>
                  <option value="PriceHighToLow">Price: High-Low</option>
                </select>
             </div>

             <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-gray-400 text-sm font-bold">$</span>
                <select 
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-gray-600 cursor-pointer"
                >
                  <option value="All">Prices</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-500">$100 - $500</option>
                  <option value="500-1000">$500 - $1000</option>
                  <option value="1000+">$1000+</option>
                </select>
             </div>

             <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <Star size={16} className="text-gray-400" />
                <select 
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-gray-600 cursor-pointer"
                >
                  <option value="All">Ratings</option>
                  <option value="4+">4+ Stars</option>
                  <option value="3+">3+ Stars</option>
                </select>
             </div>

             <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <Package size={16} className="text-gray-400" />
                <select 
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-gray-600 cursor-pointer"
                >
                  <option value="All">Stocks</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">ID & Product</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Pricing</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Stock Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Review Setup</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8 h-24 bg-gray-50/10" />
                  </tr>
                ))
              ) : filteredAndSortedProducts.length > 0 ? filteredAndSortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-[10px] font-bold text-gray-400 w-8">#{product.productId}</span>
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden ring-1 ring-gray-100 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#141414] truncate mb-0.5">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase truncate">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-[#00A650]/5 text-[#00A650] rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <p className="font-bold text-[#141414]">${(product.price - (product.price * (product.discount / 100))).toFixed(2)}</p>
                        {product.discount > 0 && (
                            <p className="text-[10px] text-red-500 font-bold uppercase">Save {product.discount}% <span className="line-through text-gray-300 ml-1">${product.price}</span></p>
                        )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col max-w-[120px]">
                        <span className={`text-[11px] font-bold mb-1.5 ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} Units`}
                        </span>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                className={`h-full rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}
                            />
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${product.isReviewsEnabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                            {product.isReviewsEnabled ? <Star size={14} fill="currentColor" /> : <Settings size={14} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#141414] uppercase tracking-wider">{product.isReviewsEnabled ? 'Active' : 'Disabled'}</p>
                            <p className="text-[10px] text-gray-400 font-medium italic">{product.reviews} Reviews</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                        <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-2.5 text-gray-400 hover:text-[#00A650] hover:bg-[#00A650]/5 rounded-xl transition-all"
                            title="Edit Product"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Product"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                            <Package size={32} className="text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-[#141414] mb-2">No products found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Displaying <span className="text-[#141414]">{filteredAndSortedProducts.length}</span> / {products.length} Products
            </p>
            <div className="flex items-center space-x-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-white hover:text-[#141414] transition-all disabled:opacity-30" disabled>
                    <ChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#141414] text-white text-xs font-bold shadow-lg">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-white hover:text-[#141414] transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-black text-[#141414] tracking-tight">{editingProduct ? 'Update Product' : 'Register Product'}</h2>
                    <p className="text-sm font-medium text-gray-400">#{formData.productId || 'NEW'} — {formData.sku || 'TEMP-SKU'}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                {errorVisible && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 text-sm font-bold"
                  >
                    <AlertCircle size={18} />
                    <span>{errorVisible}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Product Identity</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Sony WH-1000XM5" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Display Image (URL)</label>
                        <div className="flex space-x-4">
                            <div className="flex-grow">
                                <input 
                                    required
                                    type="text" 
                                    placeholder="https://images.unsplash.com/..." 
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-medium text-sm"
                                />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex-shrink-0">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="m-auto text-gray-300" size={20} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Sort ID</label>
                            <input 
                                required
                                type="text" 
                                placeholder="001" 
                                value={formData.productId}
                                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-mono font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                            <select 
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-bold appearance-none"
                            >
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Brief Description</label>
                        <textarea 
                            required
                            rows={4}
                            placeholder="Explain the item's unique value proposition..." 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-medium text-sm leading-relaxed"
                        />
                    </div>
                  </div>

                  {/* Right Column: Pricing & Logistics */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Base Price ($)</label>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                placeholder="0.00" 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Discount (%)</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                value={formData.discount}
                                onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value) || 0})}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-bold text-red-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Current Stock (Inventory)</label>
                        <input 
                            required
                            type="number" 
                            placeholder="0" 
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A650] focus:bg-white rounded-2xl outline-none transition-all font-bold"
                        />
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[2rem] space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[#141414]">Review Management</h4>
                                <p className="text-[10px] text-gray-400 font-medium italic">Allow customers to submit ratings</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, isReviewsEnabled: !formData.isReviewsEnabled})}
                                className={`w-12 h-6 rounded-full transition-all relative ${formData.isReviewsEnabled ? 'bg-[#00A650]' : 'bg-gray-300'}`}
                            >
                                <motion.div 
                                    animate={{ left: formData.isReviewsEnabled ? 'calc(100% - 20px)' : '4px' }}
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[#141414]">New Release Label</h4>
                                <p className="text-[10px] text-gray-400 font-medium italic">Displays a "NEW" badge on product cards</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, isNew: !formData.isNew})}
                                className={`w-12 h-6 rounded-full transition-all relative ${formData.isNew ? 'bg-[#00A650]' : 'bg-gray-300'}`}
                            >
                                <motion.div 
                                    animate={{ left: formData.isNew ? 'calc(100% - 20px)' : '4px' }}
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center justify-end space-x-4 bg-white sticky bottom-0 z-10">
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#141414] text-white px-10 py-4 rounded-2xl font-bold flex items-center shadow-xl shadow-black/10 hover:bg-black transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                        ) : (
                            <Save size={20} className="mr-2" />
                        )}
                        {editingProduct ? 'Update Inventory' : 'Finalize Registration'}
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
