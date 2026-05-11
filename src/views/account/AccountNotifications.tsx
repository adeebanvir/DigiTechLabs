import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor, 
  Megaphone, 
  Package, 
  Tag, 
  ShieldAlert,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AccountNotifications() {
  const [showSaved, setShowSaved] = useState(false);
  
  const notificationGroups = [
    {
      title: 'Order Tracking',
      description: 'Stay updated on your purchase journey from payment to doorstep.',
      items: [
        { id: 'ord-1', label: 'Order Confirmation', description: 'Receive an alert when your order is successfully placed.', email: true, sms: false, push: true },
        { id: 'ord-2', label: 'Shipping Updates', description: 'Real-time tracking notifications when your package moves.', email: true, sms: true, push: true },
        { id: 'ord-3', label: 'Delivery Status', description: 'Notification precisely when your order arrives at your address.', email: true, sms: true, push: true },
      ],
      icon: Package,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Promotions & Offers',
      description: 'Exclusive deals, seasonal sales, and member-only early access.',
      items: [
        { id: 'promo-1', label: 'Personalized Offers', description: 'Discounts based on items in your wishlist and past purchases.', email: true, sms: false, push: false },
        { id: 'promo-2', label: 'Seasonal Campaigns', description: 'Early access to Black Friday, Cyber Monday, and holiday sales.', email: true, sms: false, push: true },
        { id: 'promo-3', label: 'Inventory Alerts', description: 'Get notified when out-of-stock items you love are back.', email: false, sms: false, push: true },
      ],
      icon: Tag,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Account Security',
      description: 'Critical alerts regarding your account access and security settings.',
      items: [
        { id: 'sec-1', label: 'New Login Alert', description: 'Immediate notification if a new device logs into your account.', email: true, sms: true, push: true },
        { id: 'sec-2', label: 'Password Changes', description: 'Confirmation alerts for password or security setting updates.', email: true, sms: true, push: true },
      ],
      icon: ShieldAlert,
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notification Settings</h1>
          <p className="text-gray-500 mt-1">Configure how and when you want to be reached.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#111111] text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gray-200"
        >
          <Save size={20} />
          Save Preferences
        </button>
      </div>

      <AnimatePresence>
        {showSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-white px-6 py-3 rounded-full border border-green-100 shadow-2xl flex items-center gap-3"
          >
             <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={14} />
             </div>
             <span className="text-sm font-bold text-gray-900">Preferences updated successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {notificationGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-[44px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-start justify-between gap-6">
               <div className="flex gap-6">
                  <div className={`w-16 h-16 ${group.color} rounded-3xl flex items-center justify-center shrink-0`}>
                     <group.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{group.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm">{group.description}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-8 px-8 py-4 bg-gray-50 rounded-3xl">
                  <div className="flex flex-col items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SMS</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Monitor size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Push</span>
                  </div>
               </div>
            </div>

            <div className="divide-y divide-gray-50">
               {group.items.map((item) => (
                 <div key={item.id} className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-gray-50/50 transition-colors">
                    <div className="max-w-md">
                       <h4 className="font-bold text-gray-900">{item.label}</h4>
                       <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-10">
                       {[item.email, item.sms, item.push].map((checked, idx) => (
                         <div key={idx} className="relative w-14 h-8">
                            <input 
                              type="checkbox" 
                              defaultChecked={checked}
                              className="sr-only peer"
                              id={`${item.id}-${idx}`}
                            />
                            <label 
                              htmlFor={`${item.id}-${idx}`}
                              className="block w-full h-full bg-gray-200 peer-checked:bg-[#00A650] rounded-full transition-colors cursor-pointer"
                            />
                            <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all peer-checked:translate-x-6" />
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}

        <div className="bg-[#111111] p-12 rounded-[44px] text-white flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="max-w-lg">
              <h3 className="text-3xl font-bold leading-tight">Master Mute</h3>
              <p className="text-gray-400 mt-4 leading-relaxed">Instantly disable all non-essential notifications including marketing, sales, and community updates with a single click.</p>
           </div>
           <button className="px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all whitespace-nowrap">
              Disable Marketing Alerts
           </button>
        </div>
      </div>
    </motion.div>
  );
}
