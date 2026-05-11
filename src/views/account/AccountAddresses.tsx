import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  MoreVertical,
  Phone,
  Globe,
  Home,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/dataService';
import { Address } from '../../types';

export default function AccountAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      accountService.getAddresses(user.uid).then(data => {
        setAddresses(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await accountService.deleteAddress(user!.uid, id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = async (id: string) => {
    await accountService.updateAddress(user!.uid, id, { isDefault: true });
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-[32px]" />)}
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Saved Addresses</h1>
          <p className="text-gray-500 mt-1">Manage your shipping and billing locations.</p>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00A650] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#00A650]/20"
        >
          <Plus size={20} />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {addresses.length > 0 ? addresses.map((addr, i) => (
          <motion.div 
            key={addr.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-[40px] border-2 transition-all duration-300 group ${
              addr.isDefault 
                ? 'bg-white border-[#00A650] shadow-2xl shadow-[#00A650]/5 ring-4 ring-[#00A650]/5' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            {addr.isDefault && (
              <div className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1 bg-[#F3FAF7] text-[#00A650] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#00A650]/10">
                <CheckCircle2 size={12} />
                Default Address
              </div>
            )}

            <div className="flex items-start gap-5 mb-8">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                 addr.isDefault ? 'bg-[#00A650] text-white shadow-lg shadow-[#00A650]/20' : 'bg-gray-50 text-gray-400'
               }`}>
                 {addr.type === 'shipping' ? <Home size={24} /> : <Briefcase size={24} />}
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-900">{addr.fullName}</h3>
                  <p className="text-sm font-semibold text-[#00A650] uppercase tracking-wider mt-0.5">{addr.type} Address</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-1 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400 shrink-0" />
                <p className="text-sm text-gray-600 font-medium">{addr.phone}</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
               {!addr.isDefault && (
                 <button 
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-bold text-[#00A650] hover:underline uppercase tracking-wider"
                 >
                   Set as Default
                 </button>
               )}
               <div className="flex items-center gap-2 ml-auto">
                 <button className="p-3 text-gray-400 hover:text-[#00A650] hover:bg-[#F3FAF7] rounded-xl transition-all">
                   <Edit2 size={18} />
                 </button>
                 <button 
                  onClick={() => handleDelete(addr.id)}
                  className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
            </div>
          </motion.div>
        )) : (
          <div className="md:col-span-2 py-24 bg-white rounded-[40px] border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
              <MapPin size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No addresses saved</h3>
            <p className="text-gray-500 mt-2">Add a shipping address to speed up checkout.</p>
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
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-3xl overflow-hidden"
            >
              <div className="p-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add New Address</h3>
                <p className="text-sm text-gray-500 mb-8">Enter your correct details for seamless delivery.</p>

                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  // Fake form data for demo
                  const target = e.target as any;
                  const newAddress: Omit<Address, 'id'> = {
                    fullName: target.fullName.value,
                    phone: target.phone.value,
                    street: target.street.value,
                    city: target.city.value,
                    state: target.state.value,
                    postalCode: target.postalCode.value,
                    country: target.country.value,
                    isDefault: target.isDefault.checked,
                    type: target.type.value,
                  };
                  accountService.addAddress(user!.uid, newAddress).then(id => {
                    if (id) {
                      setAddresses(prev => [...prev, { id, ...newAddress }]);
                      setAddModalOpen(false);
                    }
                  });
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                       <input name="fullName" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 outline-none transition-all font-medium" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone Number</label>
                       <input name="phone" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 outline-none transition-all font-medium" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Address Type</label>
                       <select name="type" className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium appearance-none">
                         <option value="shipping">Shipping</option>
                         <option value="billing">Billing</option>
                       </select>
                    </div>
                    <div className="col-span-2">
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Street Address</label>
                       <input name="street" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 outline-none transition-all font-medium" placeholder="123 Luxury Lane" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">City</label>
                       <input name="city" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="Silicon Valley" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">ZIP / Postal Code</label>
                       <input name="postalCode" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="94025" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">State / Province</label>
                       <input name="state" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="California" />
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Country</label>
                       <input name="country" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="United States" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" name="isDefault" id="isDefault" className="w-5 h-5 rounded border-gray-300 text-[#00A650] focus:ring-[#00A650]" />
                    <label htmlFor="isDefault" className="text-sm font-bold text-gray-700">Set as default address</label>
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
                      className="flex-grow-[2] px-8 py-4 bg-[#00A650] text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[#00A650]/20"
                    >
                      Save Address
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
