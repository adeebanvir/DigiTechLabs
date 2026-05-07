import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Cpu, LogIn, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, login, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#00A650] ${
                  location.pathname === link.path ? 'text-[#00A650]' : 'text-[#141414]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-gray-200" />

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-[#141414] hover:text-[#00A650] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#00A650] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-[#141414] hover:text-[#00A650] transition-colors" title="Admin Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#141414] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#00A650] transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-[#141414]">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#00A650] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
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
            <div className="px-4 pt-2 pb-6 space-y-2">
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
              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#00A650] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-4 text-base font-medium text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { login(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-4 text-base font-medium text-[#00A650] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
