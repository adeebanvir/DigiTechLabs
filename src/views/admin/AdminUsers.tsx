import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { UserProfile } from '../../types';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Shield, 
  Ban, 
  Clock,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(doc => ({ ...doc.data() } as UserProfile)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: newStatus,
        updatedAt: new Date()
      });
      fetchUsers();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date()
      });
      fetchUsers();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Ecosystem Citizens</h1>
          <p className="text-gray-500 font-medium">Govern user access and role privileges.</p>
        </div>
        <button className="bg-[#141414] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center hover:bg-[#00A650] transition-all shadow-lg shadow-black/10">
          <UserPlus size={20} className="mr-2" />
          Invite Associate
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A650] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
             <button className="flex items-center space-x-2 px-4 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                <span>Filters</span>
             </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Citizen Profile</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Governance Role</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Registration</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Activity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8 h-20 bg-gray-50/20" />
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                      <div>
                        <p className="font-bold text-[#141414] leading-none mb-1">{user.displayName}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                        <Shield size={14} className={user.role === 'admin' ? 'text-[#00A650]' : 'text-gray-400'} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-[#00A650]' : 'text-gray-500'}`}>
                            {user.role}
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Historical'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-gray-400 space-x-1">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Active Now</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => toggleAdminRole(user.userId, user.role || 'user')}
                            className={`p-2 rounded-lg transition-all ${user.role === 'admin' ? 'text-blue-500 hover:bg-blue-50' : 'text-[#00A650] hover:bg-green-50'}`}
                            title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                         >
                            <Shield size={18} />
                         </button>
                         <button 
                            onClick={() => toggleUserStatus(user.userId, user.status || 'active')}
                            className={`p-2 rounded-lg transition-all ${user.status === 'suspended' ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}
                            title={user.status === 'suspended' ? 'Restore Access' : 'Suspend Access'}
                         >
                            <Ban size={18} />
                         </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400">
                        No citizens matching the current query.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
