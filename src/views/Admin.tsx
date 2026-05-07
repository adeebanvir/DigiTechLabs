import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { PRODUCTS } from '../constants';
import { Package, Users, ShoppingBag, Database, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      const uSnap = await getDocs(collection(db, 'users'));
      const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5)));
      
      setStats({
        products: pSnap.size,
        users: uSnap.size,
        orders: oSnap.size
      });
      setRecentOrders(oSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      for (const product of PRODUCTS) {
        await setDoc(doc(db, 'products', product.id), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      alert("Database seeded successfully!");
      fetchStats();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <div className="pt-40 text-center uppercase tracking-widest font-bold">Checking Credentials...</div>;

  if (!isAdmin) {
    return (
      <div className="pt-40 pb-24 text-center px-4">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-[#141414] mb-4">Access Denied.</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            This module is reserved for verified DigiTechLabs administrators. Please authenticate with an authorized account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-[#141414] mb-4">Admin Command Center.</h1>
            <p className="text-gray-500 font-medium">Welcome back, {user?.displayName}. Managing {stats.products} products in the ecosystem.</p>
          </div>
          <button 
            onClick={seedDatabase}
            disabled={seeding}
            className={`px-6 py-4 rounded-2xl font-bold transition-all flex items-center ${
              seeding ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#00A650] text-white hover:bg-[#008a42]'
            }`}
          >
            <Database className="w-5 h-5 mr-2" />
            {seeding ? 'Syncing Ecosystem...' : 'Seed Data Seeder'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Inventory', value: stats.products, icon: <Package />, color: 'bg-blue-500' },
            { label: 'Verified Users', value: stats.users, icon: <Users />, color: 'bg-purple-500' },
            { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag />, color: 'bg-[#00A650]' }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-[#141414]">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl text-white ${stat.color}`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Recent Orders */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-gray-100">
            <h3 className="text-2xl font-bold mb-8">Recent Transactions.</h3>
            <div className="space-y-6">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#00A650]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#141414]">Order #{order.id.slice(-8)}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{order.userId.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#141414] text-lg">${order.total?.toFixed(2)}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-green-100 text-green-600 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 italic">No orders logged in the ecosystem yet.</p>
              )}
            </div>
            <button className="mt-10 text-[#00A650] font-bold flex items-center hover:underline">
              View All Transactions <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#141414] text-white p-10 rounded-[3rem] border border-white/10">
              <h4 className="text-xl font-bold mb-6">System Health.</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Database Engine</span>
                  <span className="text-[#00A650] font-bold">Optimal</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Auth Modules</span>
                  <span className="text-[#00A650] font-bold">Secured</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">CDN Propagation</span>
                  <span className="text-[#00A650] font-bold">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
