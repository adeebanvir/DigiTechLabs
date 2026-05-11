import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Search, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/dataService';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function AccountWishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      accountService.getWishlist(user.uid).then(data => {
        setItems(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleRemove = async (productId: string) => {
    await accountService.removeFromWishlist(user!.uid, productId);
    setItems(prev => prev.filter(p => p.id !== productId));
  };

  const handleMoveToCart = async (product: Product) => {
    addToCart(product);
    await handleRemove(product.id);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-[400px] bg-gray-100 rounded-[40px]" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wishlist</h1>
          <p className="text-gray-500 mt-1">Products you've saved for later.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
           <Zap size={14} className="fill-amber-700" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Price Drops Tracked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.length > 0 ? items.map((product, i) => (
          <motion.div 
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 overflow-hidden"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button 
                onClick={() => handleRemove(product.id)}
                className="absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
              >
                <Trash2 size={18} />
              </button>
              
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1 bg-[#00A650] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                  <TrendingDown size={12} />
                  Save {product.discount}%
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{product.category}</span>
                 <div className="flex items-center gap-1 text-amber-500">
                    <span className="text-xs font-bold">{product.rating}</span>
                 </div>
              </div>
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#00A650] transition-colors leading-tight line-clamp-1">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
                {product.discount > 0 && (
                   <p className="text-sm text-gray-400 line-through">${(product.price * (1 + product.discount/100)).toFixed(0)}</p>
                )}
              </div>

              <div className="mt-8 flex items-center gap-3">
                 <button 
                  onClick={() => handleMoveToCart(product)}
                  className="flex-grow flex items-center justify-center gap-2 py-4 bg-[#111111] text-white text-xs font-bold rounded-2xl hover:bg-[#00A650] transition-all shadow-lg hover:shadow-[#00A650]/20"
                 >
                   <ShoppingCart size={16} />
                   Move to Cart
                 </button>
                 <Link 
                  to={`/product/${product.id}`}
                  className="w-14 h-14 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                 >
                   <Info size={18} />
                 </Link>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="lg:col-span-3 py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                <Heart size={48} className="fill-gray-50" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
             <p className="text-gray-500 mt-3 max-w-sm mx-auto leading-relaxed">Save items you love and we'll keep an eye on them for you, including price drops.</p>
             <Link 
              to="/shop" 
              className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-[#00A650] text-white font-bold rounded-2xl shadow-2xl shadow-[#00A650]/30 hover:scale-105 transition-all"
             >
               Start Exploring
               <ArrowRight size={20} />
             </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
