import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { Star, ArrowLeft, Shield, Truck, RotateCcw, Check, Plus, Minus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      productService.getProductById(id).then(async (data) => {
        setProduct(data);
        if (data) {
          const all = await productService.getAllProducts();
          setRelatedProducts(all.filter(p => p.category === data.category && p.id !== data.id).slice(0, 3));
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#00A650] animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Loading Innovation details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center uppercase tracking-widest font-bold">
        Product Not Found
        <Link to="/shop" className="block mt-4 text-[#00A650]">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to="/shop" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#00A650] mb-12 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 flex items-center justify-center p-8">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-[2rem] shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Thumbnails could go here */}
          </motion.div>

          {/* Product Info */}
          <div>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#00A650] text-xs font-bold uppercase tracking-[0.2em]">
                  {product.category}
                </span>
                <div className="flex items-center text-[#00A650] bg-[#00A650]/5 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold ml-1">{product.rating}</span>
                  <span className="text-gray-400 text-xs ml-2 font-medium">({product.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-[#141414] mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-[#141414] tracking-tighter">
                  ${product.price.toFixed(2)}
                </span>
                {product.stock < 10 && (
                  <span className="text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
                    Only {product.stock} left in stock
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg leading-relaxed line-clamp-4 h-[7.3rem] overflow-hidden">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="mb-10">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Top Innovations</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map(feature => (
                  <li key={feature} className="flex items-center text-gray-600 text-sm">
                    <div className="w-5 h-5 bg-[#00A650]/10 text-[#00A650] rounded-full flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center bg-gray-100 rounded-2xl px-2 h-16">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-500 hover:text-[#141414] transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  readOnly
                  className="bg-transparent w-12 text-center font-bold text-lg focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-gray-500 hover:text-[#141414] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => {
                  for(let i=0; i<quantity; i++) addToCart(product);
                }}
                className="flex-1 h-16 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all duration-300 transform active:scale-95 shadow-xl shadow-black/10"
              >
                Add to Cart
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="text-center">
                <Truck className="w-6 h-6 text-[#00A650] mx-auto mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Free Ship</span>
              </div>
              <div className="text-center border-x border-gray-200">
                <Shield className="w-6 h-6 text-[#00A650] mx-auto mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Warranty</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-[#00A650] mx-auto mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">30-Day Ret</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="mt-24 pt-24 border-t border-gray-100">
          <h3 className="text-3xl font-bold tracking-tight mb-12">Technical Specifications.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-4 border-b border-gray-50">
                <span className="text-gray-500 font-medium">{key}</span>
                <span className="text-[#141414] font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-24">
            <h3 className="text-3xl font-bold tracking-tight mb-12 text-center">You may also like.</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
