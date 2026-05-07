import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/dataService';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { user, login } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = cartTotal > 500 ? 0 : 25;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shipping + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to proceed with your innovation purchase.");
      login();
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const address = formData.get('address') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const name = formData.get('name') as string;
      
      await orderService.createOrder(
        user.uid,
        cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        grandTotal,
        address,
        email,
        phone,
        name
      );

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Transaction failed. Please verify your credentials and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-24 text-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-[#00A650] rounded-full flex items-center justify-center mx-auto mb-8 text-white">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-[#141414] mb-4">Order Confirmed.</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Thank you for choosing DigiTechLabs. We've sent a detailed confirmation to your email. Your tech ecosystem is about to get an upgrade.
          </p>
          <Link 
            to="/shop" 
            className="block w-full py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all"
          >
            Return to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-[#141414] mb-4">Your Bag is Empty.</h1>
        <p className="text-gray-500 mb-10">Looks like you haven't added any innovations to your cart yet.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center px-10 py-5 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all shadow-xl"
        >
          Start Shopping
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight text-[#141414] mb-12">
          Your Bag. <span className="text-gray-400">({cartCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                >
                  <Link to={`/product/${item.id}`} className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item.id}`} className="text-xl font-bold text-[#141414] hover:text-[#00A650] transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start space-x-6">
                      <div className="flex items-center bg-gray-100 rounded-xl px-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-[#141414]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-[#141414]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 p-2 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#141414]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="p-8 bg-[#00A650]/5 border border-[#00A650]/10 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-[#00A650] text-white rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-[#141414]">Free shipping eligible!</p>
                <p className="text-gray-500 text-sm">Add $500+ worth of tech to your ecosystem for complimentary delivery.</p>
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/[0.02]">
              <h3 className="text-2xl font-bold mb-8">Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-[#141414]">Total</span>
                  <span className="text-3xl font-bold text-[#00A650] tracking-tighter">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {!isCheckoutOpen ? (
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-5 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all shadow-xl shadow-black/10 group"
                >
                  Proceed to Checkout
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <input 
                    required
                    name="email"
                    type="email" 
                    defaultValue={user?.email || ''}
                    placeholder="Email Address" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00A650]"
                  />
                  <input 
                    required
                    name="name"
                    type="text" 
                    defaultValue={user?.displayName || ''}
                    placeholder="Full Name (Required for Identity)" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00A650]"
                  />
                  <input 
                    required
                    name="phone"
                    type="tel" 
                    placeholder="Phone Number (Required)" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00A650]"
                  />
                  <input 
                    required
                    name="address"
                    type="text" 
                    placeholder="Shipping Address" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00A650]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input required name="expDate" type="text" placeholder="Exp Date" className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00A650]" />
                    <input required name="cvc" type="text" placeholder="CVC" className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00A650]" />
                  </div>
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-5 bg-[#00A650] text-white rounded-2xl font-bold transition-all shadow-xl shadow-[#00A650]/20 flex items-center justify-center ${
                      isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#008a42]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      `Confirm & Pay $${grandTotal.toFixed(2)}`
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-3 text-gray-500 font-bold hover:text-[#141414] transition-all"
                  >
                    Back to Summary
                  </button>
                </form>
              )}

              <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <ShieldCheck className="w-4 h-4 text-[#00A650]" />
                <span>Secure SSL Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
