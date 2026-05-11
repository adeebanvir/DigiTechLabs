import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  History, 
  Monitor, 
  Smartphone as PhoneIcon,
  Globe,
  Trash2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export default function AccountSecurity() {
  const { user } = useAuth();
  const [is2FAEnabled, set2FAEnabled] = useState(false);

  const sessions = [
    { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome', location: 'San Francisco, CA', lastActive: 'Active now', current: true, icon: Monitor },
    { id: 2, device: 'iPhone 15 Pro', browser: 'Safari', location: 'London, UK', lastActive: '2 days ago', icon: PhoneIcon },
    { id: 3, device: 'Windows Desktop', browser: 'Edge', location: 'New York, NY', lastActive: '5 days ago', icon: Monitor },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Security Center</h1>
        <p className="text-gray-500 mt-1">Protect your account and manage login sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Protection Score */}
        <div className="space-y-8">
           <div className="bg-[#111111] p-10 rounded-[40px] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 scale-150 opacity-10">
                <ShieldCheck size={180} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#00A650] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00A650]/20">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A650]">Identity Verified</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">Account Security: High</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">We've implemented enterprise-grade security to ensure your data and transactions are always safe.</p>
                
                <div className="mt-8 flex gap-3">
                   <div className="flex-grow flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Check</p>
                      <p className="text-sm font-bold">Today, 10:24 AM</p>
                   </div>
                   <div className="flex-grow flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Status</p>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-[#00A650] rounded-full animate-pulse" />
                         <p className="text-sm font-bold text-[#00A650]">Encrypted</p>
                      </div>
                   </div>
                </div>
              </div>
           </div>

           {/* Change Password Form */}
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <h4 className="text-xl font-bold text-gray-900 mb-8">Update Password</h4>
             <form className="space-y-6">
                <div>
                   <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Current Password</label>
                   <input type="password" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="••••••••" />
                </div>
                <div>
                   <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">New Password</label>
                   <input type="password" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="Minimum 8 characters" />
                </div>
                <div>
                   <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm New Password</label>
                   <input type="password" required className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#111111] text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-gray-200">
                  Update Password
                </button>
             </form>
           </div>
        </div>

        {/* 2FA and Sessions */}
        <div className="space-y-8">
           {/* 2FA Toggle */}
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="flex items-start justify-between gap-6">
                <div className="flex gap-5">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Smartphone size={28} />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 mt-1 max-w-xs">Add an extra layer of security to your account by requiring a code from your phone.</p>
                   </div>
                </div>
                <button 
                  onClick={() => set2FAEnabled(!is2FAEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${is2FAEnabled ? 'bg-[#00A650]' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    animate={{ x: is2FAEnabled ? 26 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                  />
                </button>
             </div>
             
             {is2FAEnabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Protected via SMS</p>
                        <p className="text-xs text-gray-500">Ending in •••• 9821</p>
                      </div>
                   </div>
                   <button className="text-xs font-bold text-[#00A650] hover:underline">Manage methods</button>
                </motion.div>
             )}
           </div>

           {/* Active Sessions */}
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-bold text-gray-900">Active Sessions</h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                   <History size={12} />
                   Login History
                </div>
             </div>

             <div className="space-y-6">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${session.current ? 'bg-[#F3FAF7] text-[#00A650]' : 'bg-gray-50 text-gray-400'}`}>
                       <session.icon size={22} />
                    </div>
                    <div className="flex-grow">
                       <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">{session.device}</p>
                          {session.current && <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3FAF7] text-[#00A650] rounded-full uppercase tracking-widest">Active</span>}
                       </div>
                       <p className="text-xs text-gray-500 mt-1">{session.browser} • {session.location} • {session.lastActive}</p>
                    </div>
                    {!session.current && (
                      <button className="p-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
             </div>

             <button className="w-full mt-8 py-4 bg-gray-50 text-gray-600 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors">
               Log Out All Other Devices
             </button>
           </div>

           {/* Danger Zone */}
           <div className="p-10 rounded-[40px] border border-red-100 bg-red-50/30">
              <div className="flex items-start gap-4">
                 <AlertTriangle className="text-red-600 shrink-0" size={24} />
                 <div>
                    <h4 className="font-bold text-red-900">Account Deletion</h4>
                    <p className="text-sm text-red-700/70 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="mt-6 text-sm font-bold text-red-600 hover:underline flex items-center gap-2">
                       Request Account Deletion <ChevronRight size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
