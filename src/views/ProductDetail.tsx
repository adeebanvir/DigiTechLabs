import { useParams, Link } from 'react-router-dom';
import { Product, ProductReview } from '../types';
import { productService, reviewService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowLeft, Shield, Truck, RotateCcw, Check, Plus, Minus, Loader2, MessageSquare, Send, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadReviews = async (productId: string) => {
    const data = await reviewService.getProductReviews(productId);
    setReviewsList(data);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      productService.getProductById(id).then(async (data) => {
        setProduct(data);
        if (data) {
          const all = await productService.getAllProducts();
          setRelatedProducts(all.filter(p => p.category === data.category && p.id !== data.id).slice(0, 3));
          loadReviews(data.id);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newComment.trim()) return;

    setSubmittingReview(true);
    try {
      await reviewService.addReview(product.id, {
        userId: user?.uid || 'guest',
        userName: user?.displayName || 'Verified Tech Customer',
        rating: newRating,
        comment: newComment.trim()
      });

      // Reload product to get recalculated rating
      const updatedP = await productService.getProductById(product.id);
      if (updatedP) setProduct(updatedP);

      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      loadReviews(product.id);
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setSubmittingReview(false);
    }
  };

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

        {/* Customer Reviews Section */}
        <div className="mt-24 pt-24 border-t border-gray-100 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-[#141414]">Customer Reviews.</h3>
              <p className="text-gray-500 text-sm mt-1">Verified ratings and real feedback from our tech community.</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100 shrink-0">
              <div className="flex text-[#00A650]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} className={s <= Math.round(product.rating) ? "fill-current" : "text-gray-200"} />
                ))}
              </div>
              <div className="border-l border-gray-200 pl-4">
                <p className="text-2xl font-bold text-[#141414] leading-none">{product.rating.toFixed(1)}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{product.reviews} Total Reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-6">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{rev.userName}</p>
                          <p className="text-[10px] text-gray-400">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-[#00A650]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={s <= rev.rating ? "fill-current" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-10 bg-gray-50 rounded-3xl text-center space-y-3">
                  <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No customer reviews yet</p>
                  <p className="text-xs text-gray-400">Be the first to leave a review for this innovation!</p>
                </div>
              )}
            </div>

            {/* Write Review Form */}
            <div className="lg:col-span-5 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-fit space-y-6">
              <h4 className="font-bold text-lg text-[#141414]">Write a Review</h4>
              {reviewSuccess ? (
                <div className="p-4 bg-green-50 text-[#00A650] rounded-2xl text-xs font-bold text-center">
                  🎉 Thank you! Your review has been submitted and average rating updated.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Overall Rating</label>
                    <div className="flex gap-2 text-gray-300">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star size={24} className={s <= newRating ? "text-[#00A650] fill-[#00A650]" : "text-gray-200"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Your Review</label>
                    <textarea 
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this tech..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-medium focus:bg-white focus:border-[#00A650] outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-4 bg-[#141414] text-white font-bold text-xs rounded-2xl hover:bg-[#00A650] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {submittingReview ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    <span>Submit Review</span>
                  </button>
                </form>
              )}
            </div>
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
