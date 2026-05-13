import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/dataService';
import ProductCard from '../components/products/ProductCard';
import { Search, ChevronDown, Loader2, Filter, X, Laptop, Headphones, Glasses, Zap, Keyboard, Gamepad2, Watch, Home as HomeIcon, Shield, Monitor, Sparkles, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_MAP = [
  { name: 'All', icon: <Sparkles className="w-4 h-4" /> },
  { name: 'Featured', icon: <Star className="w-4 h-4" /> },
  { name: 'Laptop', icon: <Laptop className="w-4 h-4" /> },
  { name: 'Audio', icon: <Headphones className="w-4 h-4" /> },
  { name: 'Visual', icon: <Glasses className="w-4 h-4" /> },
  { name: 'Power', icon: <Zap className="w-4 h-4" /> },
  { name: 'Work', icon: <Keyboard className="w-4 h-4" /> },
  { name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> },
  { name: 'Wearables', icon: <Watch className="w-4 h-4" /> },
  { name: 'Smart Home', icon: <HomeIcon className="w-4 h-4" /> },
  { name: 'Security', icon: <Shield className="w-4 h-4" /> },
  { name: 'Desktop', icon: <Monitor className="w-4 h-4" /> }
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Parse URL params
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category');
  const initialSearch = queryParams.get('search');

  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    productService.getAllProducts().then(data => {
      setProducts(data);
      setLoading(false);
      
      if (initialCategory) {
        // Find category name from products or mapping if slug is used
        // For simplicity, we'll try to match name or keep slug
        setSelectedCategory(initialCategory);
      }
    });
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== null) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const categories = useMemo(() => {
    const list = ['All', 'Featured', ...new Set(products.map(p => p.category))];
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = false;
      const lowerSelected = selectedCategory.toLowerCase();
      const lowerProductCat = product.category.toLowerCase();

      if (selectedCategory === 'All') {
        matchesCategory = true;
      } else if (selectedCategory === 'Featured') {
        matchesCategory = !!product.isFeatured;
      } else {
        // Match by exact name or slugified name
        matchesCategory = lowerProductCat === lowerSelected || 
                          lowerProductCat.replace(/\s+/g, '-') === lowerSelected;
      }

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#00A650] animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Syncing Catalog...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-[#141414] mb-4">
            Shop Gadgets.
          </h1>
          <p className="text-gray-500 text-lg">Curated technology for the modern life.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#0081C9] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by product name or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#0081C9] focus:ring-4 focus:ring-[#0081C9]/5 transition-all text-[#141414] font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex lg:hidden items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white border border-gray-200 hover:border-[#0081C9] transition-all ${isFilterOpen ? 'border-[#0081C9] text-[#0081C9]' : 'text-gray-500'}`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            <div className="relative group flex-1 lg:flex-none">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-12 text-sm font-bold text-[#141414] focus:outline-none focus:border-[#0081C9] cursor-pointer transition-all"
              >
                <option value="newest">Latest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-xs font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0081C9]" />
                  Categories
                </h3>
                <div className="flex flex-col space-y-1">
                  {CATEGORY_MAP.map(category => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group ${
                        selectedCategory === category.name 
                          ? 'bg-[#0081C9]/5 text-[#0081C9]' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-[#141414]'
                      }`}
                    >
                      <div className={`transition-colors ${selectedCategory === category.name ? 'text-[#0081C9]' : 'text-gray-300 group-hover:text-gray-500'}`}>
                        {category.icon}
                      </div>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Need advice?</h4>
                <p className="text-xs text-blue-700 leading-relaxed mb-4">Our tech experts are here to help you choose the perfect gadget.</p>
                <Link to="/contact" className="text-xs font-black text-blue-900 uppercase tracking-wider hover:underline flex items-center gap-1">
                  Chat with us <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 inset-x-0 z-[101] bg-white rounded-t-[2.5rem] p-8 max-h-[80vh] overflow-y-auto lg:hidden"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-[#141414]">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-50 rounded-full">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {CATEGORY_MAP.map(category => (
                          <button
                            key={category.name}
                            onClick={() => {
                              setSelectedCategory(category.name);
                              setIsFilterOpen(false);
                            }}
                            className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm border transition-all ${
                              selectedCategory === category.name 
                                ? 'bg-[#0081C9]/5 border-[#0081C9] text-[#0081C9]' 
                                : 'bg-white border-gray-100 text-gray-500'
                            }`}
                          >
                            {category.icon}
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Area */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#141414]">{filteredProducts.length}</span>
                <span>Products Found</span>
                {selectedCategory !== 'All' && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-[#141414]">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#141414] mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-8 text-[#0081C9] font-bold underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
