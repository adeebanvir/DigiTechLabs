import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export default function AccountSettings() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const updates = {
      displayName: formData.get('displayName') as string,
      phone: formData.get('phone') as string,
      language: formData.get('language') as string,
      timezone: formData.get('timezone') as string,
    };
    
    try {
      await updateUserProfile(updates);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Personal Information</h1>
        <p className="text-gray-500 mt-1">Manage your public profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Avatar Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm text-center">
             <div className="relative inline-block group mb-6">
                <div className="w-32 h-32 rounded-[40px] bg-gray-50 flex items-center justify-center border-4 border-white shadow-xl shadow-gray-200 overflow-hidden ring-1 ring-gray-100">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-300" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#00A650] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
             </div>
             <h3 className="text-xl font-bold text-gray-900">{user?.displayName || 'User'}</h3>
             <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
             
             <div className="mt-10 flex flex-col gap-3">
               <button className="w-full py-4 bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl hover:bg-gray-100 transition-colors uppercase tracking-widest">
                  Change Avatar
               </button>
               <button className="w-full py-4 text-red-600 font-bold text-xs rounded-2xl hover:bg-red-50 transition-colors uppercase tracking-widest">
                  Remove Photo
               </button>
             </div>

             <div className="mt-12 pt-10 border-t border-gray-50 flex flex-col gap-6 text-left">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Member Since</p>
                   <p className="text-sm font-bold text-gray-700">May 10, 2026</p>
                </div>
             </div>
          </div>
        </div>

        {/* Edit Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm relative">
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Display Name</label>
                      <input name="displayName" defaultValue={user?.displayName} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 outline-none transition-all font-medium text-gray-900" placeholder="e.g. John Wick" />
                   </div>
                   
                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Primary Email</label>
                      <div className="relative group">
                        <input value={user?.email} disabled className="w-full px-5 py-4 bg-gray-100 border border-transparent rounded-[24px] text-gray-400 font-medium cursor-not-allowed" />
                        <CheckCircle2 size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                   </div>

                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone Number</label>
                      <input name="phone" defaultValue={user?.phone || '+1 (555) 000-9821'} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-gray-900" />
                   </div>

                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Preferred Language</label>
                      <select name="language" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-gray-900 appearance-none">
                         <option value="en">English (US)</option>
                         <option value="jp">Japanese</option>
                         <option value="fr">French</option>
                         <option value="de">German</option>
                      </select>
                   </div>

                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Timezone</label>
                      <select name="timezone" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-gray-900 appearance-none">
                         <option value="UTC-8">Pacific Time (PT)</option>
                         <option value="UTC-5">Eastern Time (ET)</option>
                         <option value="UTC+0">Universal (UTC)</option>
                         <option value="UTC+9">Tokyo (JST)</option>
                      </select>
                   </div>
                </div>

                <div className="pt-8 flex items-center justify-between gap-6 border-t border-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <p className="text-xs text-gray-400 italic">Account synchronized with secure vault.</p>
                   </div>
                   <button 
                    disabled={loading}
                    type="submit" 
                    className="px-10 py-4 bg-[#111111] text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center gap-2"
                   >
                    {loading ? 'Saving Changes...' : success ? 'Successfully Saved!' : 'Save Profile Details'}
                    {success && <CheckCircle2 size={16} />}
                   </button>
                </div>
             </form>

             {/* Bio Section */}
             <div className="mt-16">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Short Description</h4>
                <textarea 
                  className="w-full h-32 px-6 py-5 bg-gray-50 border border-transparent rounded-[32px] focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-gray-900 resize-none"
                  placeholder="Tell us a bit about yourself..."
                />
             </div>
          </div>
          
          <div className="mt-12 bg-[#FDF2F2] border border-[#FDE2E2] p-10 rounded-[44px]">
             <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm shrink-0">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#9B1C1C]">Deactivate Account</h4>
                  <p className="text-sm text-[#BC5E5E] mt-2 leading-relaxed">This will temporarily hide your profile and information from other users on DigiTechLabs. You can reactivate at any time by logging in.</p>
                  <button className="mt-6 px-8 py-3 bg-[#9B1C1C] text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-red-800 transition-colors">
                    Begin Deactivation
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
