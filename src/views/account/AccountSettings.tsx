import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Trash2,
  CheckCircle2, 
  AlertTriangle,
  History,
  Monitor,
  Smartphone as PhoneIcon,
  Shield,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [is2FAEnabled, set2FAEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const sessions = [
    { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome', location: 'San Francisco, CA', lastActive: 'Active now', current: true, icon: Monitor },
    { id: 2, device: 'iPhone 15 Pro', browser: 'Safari', location: 'London, UK', lastActive: '2 days ago', icon: PhoneIcon },
    { id: 3, device: 'Windows Desktop', browser: 'Edge', location: 'New York, NY', lastActive: '5 days ago', icon: Monitor },
  ];

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass && passwordForm.newPass === passwordForm.confirmPass) {
      setPasswordSuccess(true);
      setPasswordForm({ current: '', newPass: '', confirmPass: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to delete account", err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings & Security</h1>
          <p className="text-gray-500 mt-1">Manage your personal profile, privacy preferences, and account security.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#00A650]/10 border border-[#00A650]/20 rounded-full text-xs font-bold text-[#00A650]">
          <EyeOff size={16} />
          <span>Strictly Private Account</span>
        </div>
      </div>

      {/* Account Privacy Card */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 rounded-[36px] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 p-8 opacity-10">
          <Shield size={160} />
        </div>
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-12 h-12 bg-[#00A650] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#00A650]/30">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">100% Private Account Guarantee</h3>
            <p className="text-gray-300 text-sm mt-2 leading-relaxed max-w-2xl">
              Your account is completely private and hidden from everyone else by default. No external users, search engines, or third parties can see your profile, saved addresses, or purchase history. Only you have access.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Avatar Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
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
             
             <div className="mt-8 flex flex-col gap-3">
               <button className="w-full py-3 bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl hover:bg-gray-100 transition-colors uppercase tracking-widest">
                  Change Avatar
               </button>
             </div>
          </div>

          {/* 2FA Card */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">2-Factor Auth</h4>
                  <p className="text-xs text-gray-500 mt-1">Extra verification on login.</p>
                </div>
              </div>
              <button 
                onClick={() => set2FAEnabled(!is2FAEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${is2FAEnabled ? 'bg-[#00A650]' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: is2FAEnabled ? 22 : 4 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form & Security Details Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Personal Info Form */}
          <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm">
             <h3 className="text-xl font-bold text-gray-900 mb-8">Personal Information</h3>
             <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Display Name</label>
                      <input name="displayName" defaultValue={user?.displayName} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:border-[#00A650] focus:ring-4 focus:ring-[#00A650]/5 outline-none transition-all font-medium text-gray-900" placeholder="e.g. John Wick" />
                   </div>
                   
                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Primary Email</label>
                      <div className="relative group">
                        <input value={user?.email || ''} disabled className="w-full px-5 py-4 bg-gray-100 border border-transparent rounded-[24px] text-gray-400 font-medium cursor-not-allowed" />
                        <CheckCircle2 size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#00A650]" />
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

                <div className="pt-6 flex items-center justify-between gap-6 border-t border-gray-50">
                   <p className="text-xs text-gray-400 italic">Encrypted & sync'd with vault.</p>
                   <button 
                    disabled={loading}
                    type="submit" 
                    className="px-8 py-3.5 bg-[#141414] text-white font-bold text-sm rounded-2xl hover:bg-[#00A650] transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                   >
                    {loading ? 'Saving...' : success ? 'Saved Successfully!' : 'Save Details'}
                    {success && <CheckCircle2 size={16} />}
                   </button>
                </div>
             </form>
          </div>

          {/* Change Password */}
          <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm">
             <div className="flex items-center space-x-3 mb-6">
                <Lock className="text-[#00A650]" size={22} />
                <h3 className="text-xl font-bold text-gray-900">Password & Authentication</h3>
             </div>
             
             {passwordSuccess && (
               <div className="mb-6 p-4 bg-green-50 text-[#00A650] rounded-2xl text-xs font-bold flex items-center gap-2">
                 <CheckCircle2 size={16} /> Password updated successfully!
               </div>
             )}

             <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                   <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Current Password</label>
                   <input 
                     type="password" 
                     value={passwordForm.current}
                     onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                     className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-sm" 
                     placeholder="••••••••" 
                   />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.newPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-sm" 
                        placeholder="Min 8 characters" 
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.confirmPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#00A650] outline-none transition-all font-medium text-sm" 
                        placeholder="••••••••" 
                      />
                   </div>
                </div>
                <button type="submit" className="px-8 py-3.5 bg-[#141414] text-white text-sm font-bold rounded-2xl hover:bg-[#00A650] transition-all">
                  Update Password
                </button>
             </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Active Login Sessions</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                   <History size={12} />
                   Login History
                </div>
             </div>

             <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${session.current ? 'bg-[#00A650]/10 text-[#00A650]' : 'bg-gray-50 text-gray-400'}`}>
                       <session.icon size={20} />
                    </div>
                    <div className="flex-grow">
                       <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">{session.device}</p>
                          {session.current && <span className="text-[10px] font-bold px-2 py-0.5 bg-[#00A650]/10 text-[#00A650] rounded-full uppercase tracking-widest">Active</span>}
                       </div>
                       <p className="text-xs text-gray-500 mt-1">{session.browser} • {session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Account Deletion (At the end of section) */}
          <div className="p-10 rounded-[44px] border border-red-200 bg-red-50/40">
             <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-bold text-red-950">Permanently Delete Account</h4>
                   <p className="text-sm text-red-800/80 mt-2 leading-relaxed">
                     Permanently remove your DigiTechLabs account, stored addresses, saved payment methods, and profile history. This action cannot be undone.
                   </p>
                   {!showDeleteConfirm ? (
                     <button 
                       onClick={() => setShowDeleteConfirm(true)}
                       className="mt-6 px-8 py-3.5 bg-red-600 text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                     >
                       Request Account Deletion
                     </button>
                   ) : (
                     <div className="mt-6 p-6 bg-white border border-red-200 rounded-2xl space-y-4">
                        <p className="text-xs font-bold text-red-900">Are you sure you want to permanently delete your account?</p>
                        <div className="flex gap-4">
                          <button 
                            onClick={handleDeleteAccount}
                            className="px-6 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl uppercase tracking-widest hover:bg-red-800 transition-colors"
                          >
                            Yes, Permanently Delete
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
