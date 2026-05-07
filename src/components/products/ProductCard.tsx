import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00A650]/5 border border-gray-100"
    >
      {/* Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-[#00A650] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            New Arrival
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[#141414] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Best Seller
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-6">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>

      {/* Content */}
      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {product.category}
          </span>
          <div className="flex items-center text-[#00A650]">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[11px] font-bold ml-1">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block group">
          <h3 className="text-lg font-bold text-[#141414] mb-1 group-hover:text-[#00A650] transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-[#141414]">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-[#141414] text-white rounded-xl flex items-center justify-center hover:bg-[#00A650] transition-all duration-300 transform active:scale-90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
