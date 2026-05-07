import React, { useMemo, useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/products/ProductCard';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default: 'newest'
    });
  }, [searchQuery, selectedCategory, sortBy]);

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
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#00A650] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by product name or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 transition-all text-[#141414]"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:pb-0">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category 
                    ? 'bg-[#141414] text-white shadow-lg' 
                    : 'bg-white text-gray-500 hover:text-[#141414] border border-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-12 text-sm font-bold text-[#141414] focus:outline-none focus:border-[#00A650] cursor-pointer"
            >
              <option value="newest">Latest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
          <span>{filteredProducts.length} Products Found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#141414] mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
