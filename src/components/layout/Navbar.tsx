import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Cpu, LogIn, LogOut, LayoutDashboard, User as UserIcon, Search, Package, ChevronDown, Layers } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { productService, categoryService } from '../../services/dataService';
import { Product, Category } from '../../types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, login, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productService.getAllProducts().then(setAllProducts);
    categoryService.getAllCategories().then(setCategories);

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#00A650] rounded-xl flex items-center justify-center">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#141414]">
              DigiTech<span className="text-[#00A650]">Labs</span>
            </span>
          </Link>

          {/* Desktop Nav & Actions */}
          <div className="hidden md:flex items-center space-x-6 flex-grow justify-end lg:justify-between ml-8">
            {/* Search Bar - Hidden on smaller tablets, shown on lg */}
            <div ref={searchRef} className="relative w-full max-w-sm hidden lg:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length > 0 && setShowSearch(true)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 transition-all"
                />
              </form>

              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden z-50"
                  >
                    {searchResults.length > 0 ? (
                      <div>
                        {searchResults.map(product => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                            {product.image ? (
                              <img src={product.image} className="w-10 h-10 rounded-lg object-cover mr-3" alt="" />
                            ) : (
                              <LayoutDashboard className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-[#141414] truncate">{product.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                            </div>
                            <span className="ml-auto text-sm font-bold whitespace-nowrap">${product.price}</span>
                          </Link>
                        ))}
                        <Link 
                          to={`/shop?search=${searchQuery}`}
                          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                          className="block w-full py-2 text-center text-[10px] font-bold text-[#00A650] uppercase tracking-widest border-t border-gray-50 mt-1 hover:bg-gray-50"
                        >
                          View all results
                        </Link>
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No gadgets found</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-6">
              {/* Category Dropdown */}
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-[#00A650] py-2 cursor-pointer ${
                    showCategories ? 'text-[#00A650]' : 'text-[#141414]'
                  }`}
                >
                  <Layers className="w-4 h-4 mr-1" />
                  <span>Categories</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 overflow-hidden z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Browse by tech</p>
                      </div>
                      {categories.slice(0, 5).map((category) => (
                        <Link
                          key={category.id}
                          to={`/shop?category=${category.slug}`}
                          onClick={() => setShowCategories(false)}
                          className="flex items-center px-4 py-2 text-sm text-[#141414] hover:bg-gray-50 hover:text-[#00A650] transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-gray-200 mr-3 group-hover:bg-[#00A650]"></span>
                          {category.name}
                        </Link>
                      ))}
                      {categories.length > 5 && (
                        <Link
                          to="/shop"
                          onClick={() => setShowCategories(false)}
                          className="flex items-center px-4 py-3 mt-1 text-xs font-bold text-[#00A650] hover:bg-[#00A650]/5 border-t border-gray-50 uppercase tracking-widest"
                        >
                          More categories
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center space-x-6 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-[#00A650] whitespace-nowrap ${
                      location.pathname === link.path ? 'text-[#00A650]' : 'text-[#141414]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <Link to="/cart" className="relative p-2 text-[#141414] hover:text-[#00A650] transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#00A650] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="flex items-center space-x-3">
                    {isAdmin && (
                      <Link to="/admin" className="p-2 text-[#141414] hover:text-[#00A650] transition-colors" title="Admin Dashboard">
                        <LayoutDashboard className="w-5 h-5" />
                      </Link>
                    )}
                    <Link to="/account" className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 hover:ring-2 hover:ring-[#00A650]/20 transition-all flex items-center justify-center bg-gray-50">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </Link>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#141414] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#00A650] transition-all whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative p-2 text-[#141414]">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#00A650] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user && (
              <Link to="/account" className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center bg-gray-50">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-400" />
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#141414] focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative mt-2">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00A650]"
                  />
                </form>
                {searchQuery.trim().length > 0 && searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 max-h-60 overflow-y-auto">
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => { setIsOpen(false); setSearchQuery(''); }}
                        className="flex items-center p-3"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 mr-3">
                          {product.image ? (
                            <img src={product.image} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-300 m-auto h-full flex items-center justify-center pt-2" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-xs font-bold text-[#141414]">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                        </div>
                        <span className="text-xs font-bold">${product.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#141414] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Categories */}
              <div className="border-t border-gray-50 pt-2 pb-1 px-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 5).map((category) => (
                    <Link
                      key={category.id}
                      to={`/shop?category=${category.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm py-2 text-[#141414] hover:text-[#00A650]"
                    >
                      {category.name}
                    </Link>
                  ))}
                  {categories.length > 5 && (
                    <Link
                      to="/shop"
                      onClick={() => setIsOpen(false)}
                      className="text-sm py-2 font-bold text-[#00A650]"
                    >
                      More...
                    </Link>
                  )}
                </div>
              </div>

              {user && (
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-4 text-base font-medium text-[#141414] hover:bg-gray-50 rounded-lg transition-colors border-t border-gray-50 mt-2"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center bg-gray-50">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold leading-none">{user.displayName || 'My Account'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage Profile</p>
                  </div>
                </Link>
              )}

              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#00A650] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#00A650] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
  );
}
