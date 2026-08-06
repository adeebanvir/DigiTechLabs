import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, addressService, paymentService, taxService } from '../services/dataService';
import { Address, PaymentMethod, TaxRate } from '../types';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, Loader2, MapPin, CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { user, login } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [savedPayments, setSavedPayments] = useState<PaymentMethod[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: 'United States',
    cardNumber: '',
    expDate: '',
    cvc: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));

      addressService.getAddresses(user.uid).then(addrs => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setFormData(prev => ({
            ...prev,
            name: defaultAddr.fullName,
            phone: defaultAddr.phone,
            address: `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.postalCode}, ${defaultAddr.country}`,
            country: defaultAddr.country
          }));
        }
      });

      paymentService.getPaymentMethods(user.uid).then(pmts => {
        setSavedPayments(pmts);
        const defaultPmt = pmts.find(p => p.isDefault) || pmts[0];
        if (defaultPmt) {
          setSelectedPaymentId(defaultPmt.id);
          setFormData(prev => ({
            ...prev,
            cardNumber: `•••• •••• •••• ${defaultPmt.last4}`,
            expDate: defaultPmt.expiryDate,
            cvc: '***'
          }));
        }
      });
    }

    taxService.getTaxRates().then(rates => setTaxRates(rates));
  }, [user]);

  // Tax calculation based on selected address country (VPN-proof)
  const matchedTaxRate = taxRates.find(r => r.country.toLowerCase() === (formData.country || 'united states').toLowerCase());
  const taxPercent = matchedTaxRate ? matchedTaxRate.ratePercent : 8.0;

  const shipping = cartTotal > 500 ? 0 : 25;
  const tax = cartTotal * (taxPercent / 100);
  const grandTotal = cartTotal + shipping + tax;

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    const addr = savedAddresses.find(a => a.id === addrId);
    if (addr) {
      setFormData(prev => ({
        ...prev,
        name: addr.fullName,
        phone: addr.phone,
        address: `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`,
        country: addr.country
      }));
    }
  };

  const handleSelectPayment = (pmtId: string) => {
    setSelectedPaymentId(pmtId);
    const pmt = savedPayments.find(p => p.id === pmtId);
    if (pmt) {
      setFormData(prev => ({
        ...prev,
        cardNumber: `•••• •••• •••• ${pmt.last4}`,
        expDate: pmt.expiryDate,
        cvc: '***'
      }));
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to proceed with your innovation purchase.");
      login();
      return;
    }

    setIsProcessing(true);
    try {
      await orderService.createOrder(
        user.uid,
        cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        grandTotal,
        formData.address,
        formData.email,
        formData.phone,
        formData.name
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
                  <span>Tax ({taxPercent}% - {formData.country})</span>
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
                  {/* Saved Address Auto-fill */}
                  {savedAddresses.length > 0 && (
                    <div className="p-3 bg-green-50/50 border border-green-200 rounded-2xl space-y-1">
                      <label className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin size={12} /> Auto-fill Saved Shipping Address
                      </label>
                      <select 
                        value={selectedAddressId}
                        onChange={(e) => handleSelectAddress(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 outline-none"
                      >
                        {savedAddresses.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.fullName} - {a.street}, {a.city} ({a.country})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Saved Payment Auto-fill */}
                  {savedPayments.length > 0 && (
                    <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-1">
                      <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                        <CreditCard size={12} /> Auto-fill Saved Payment Method
                      </label>
                      <select 
                        value={selectedPaymentId}
                        onChange={(e) => handleSelectPayment(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 outline-none"
                      >
                        {savedPayments.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.cardType} ending in {p.last4} ({p.expiryDate})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <input 
                    required
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#00A650]"
                  />
                  <input 
                    required
                    name="name"
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#00A650]"
                  />
                  <input 
                    required
                    name="phone"
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone Number" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#00A650]"
                  />
                  <input 
                    required
                    name="address"
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Shipping Address" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#00A650]"
                  />
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country for Tax Calculation</label>
                    <input 
                      required
                      name="country"
                      type="text" 
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Country e.g. United States, France, United Kingdom" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold text-[#00A650] focus:outline-none focus:border-[#00A650]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      required 
                      name="expDate" 
                      type="text" 
                      value={formData.expDate}
                      onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                      placeholder="Exp Date (MM/YY)" 
                      className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#00A650]" 
                    />
                    <input 
                      required 
                      name="cvc" 
                      type="text" 
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                      placeholder="CVC" 
                      className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#00A650]" 
                    />
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
