import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  CreditCard, 
  Trash2, 
  CheckCircle2, 
  Calendar,
  Lock,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/dataService';
import { PaymentMethod } from '../../types';

export default function AccountPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      accountService.getPaymentMethods(user.uid).then(data => {
        setPayments(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      await accountService.deletePaymentMethod(user!.uid, id);
      setPayments(prev => prev.filter(p => p.id !== id));
    }
  };

  const getCardIcon = (type: string) => {
    // In a real app, you'd have specific brand SVGs
    return <CreditCard size={32} />;
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-56 bg-gray-100 rounded-[32px]" />)}
    </div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payment Methods</h1>
          <p className="text-gray-500 mt-1">Manage your cards and billing history.</p>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#111111] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gray-200"
        >
          <PlusCircle size={20} />
          Add New Card
        </button>
      </div>

      {/* Security Banner */}
      <div className="bg-[#F3FAF7] border border-[#00A650]/10 p-6 rounded-[32px] flex items-center gap-4">
        <div className="w-12 h-12 bg-[#00A650] text-white rounded-2xl flex items-center justify-center shrink-0">
          <Lock size={24} />
        </div>
        <div>
           <h4 className="font-bold text-[#00A650]">Your payment data is secure</h4>
           <p className="text-xs text-[#03543F] font-medium opacity-80">DigiTechLabs uses 256-bit encryption and does not store your full card details.</p>
        </div>
        <HelpCircle size={20} className="ml-auto text-[#00A650] opacity-30 cursor-pointer hover:opacity-100 transition-opacity" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {payments.length > 0 ? payments.map((card, i) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-[36px] bg-white border-2 overflow-hidden group transition-all duration-500 ${
              card.isDefault ? 'border-[#111111] shadow-2xl shadow-gray-200 ring-4 ring-gray-50' : 'border-gray-100'
            }`}
          >
            {/* Card Brand Background Decal */}
            <div className="absolute top-0 right-0 p-8 scale-150 opacity-[0.03] group-hover:scale-[1.8] transition-transform duration-1000">
              <CreditCard size={150} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.isDefault ? 'bg-[#111111] text-white' : 'bg-gray-50 text-gray-400'}`}>
                   {getCardIcon(card.cardType)}
                </div>
                {card.isDefault && (
                  <div className="px-3 py-1 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Default
                  </div>
                )}
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Card Number</p>
                <div className="flex items-center gap-2">
                   <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-200 rounded-full" />)}
                   </div>
                   <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-200 rounded-full" />)}
                   </div>
                   <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-200 rounded-full" />)}
                   </div>
                   <span className="text-lg font-bold text-gray-900 ml-1">{card.last4}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                 <div className="flex items-center gap-6">
                   <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Expires</p>
                     <p className="text-sm font-bold text-gray-700">{card.expiryDate}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Brand</p>
                     <p className="text-sm font-bold text-gray-700 uppercase">{card.cardType}</p>
                   </div>
                 </div>
                 
                 <button 
                  onClick={() => handleDelete(card.id)}
                  className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="lg:col-span-3 py-24 bg-white rounded-[40px] border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
              <CreditCard size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No payment methods saved</h3>
            <p className="text-gray-500 mt-2">Add a card to your account for faster checkout.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-3xl overflow-hidden"
            >
              <div className="p-10">
                <div className="w-12 h-12 bg-[#111111] text-white rounded-2xl flex items-center justify-center mb-6">
                  <Plus size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Save New Card</h3>
                <p className="text-sm text-gray-500 mb-8">Add a payment method for future transactions.</p>

                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const newCard: Omit<PaymentMethod, 'id'> = {
                    cardType: 'Visa', // Simulation
                    last4: target.cardNumber.value.slice(-4),
                    expiryDate: target.expiry.value,
                    holderName: target.holder.value,
                    isDefault: target.isDefault.checked,
                  };
                  accountService.addPaymentMethod(user!.uid, newCard).then(id => {
                    if (id) {
                      setPayments(prev => [...prev, { id, ...newCard }]);
                      setAddModalOpen(false);
                    }
                  });
                }}>
                  <div className="space-y-5">
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Cardholder Name</label>
                       <input name="holder" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#111111] focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium" placeholder="Full Name on Card" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Card Number</label>
                       <div className="relative">
                          <input name="cardNumber" required maxLength={16} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#111111] focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium pr-12" placeholder="0000 0000 0000 0000" />
                          <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Expiry Date</label>
                         <input name="expiry" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#111111] outline-none transition-all font-medium" placeholder="MM/YY" />
                      </div>
                      <div>
                         <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">CVC / CVV</label>
                         <div className="relative">
                            <input name="cvv" required maxLength={4} type="password" className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#111111] outline-none transition-all font-medium" placeholder="***" />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" name="isDefault" id="isDefaultCard" className="w-5 h-5 rounded border-gray-300 text-[#111111] focus:ring-[#111111]" />
                    <label htmlFor="isDefaultCard" className="text-sm font-bold text-gray-700">Set as default payment method</label>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <button 
                      type="button"
                      onClick={() => setAddModalOpen(false)}
                      className="flex-grow px-8 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-grow-[2] px-8 py-4 bg-[#111111] text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-gray-200"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
