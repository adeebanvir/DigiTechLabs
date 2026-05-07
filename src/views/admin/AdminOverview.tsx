import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { PRODUCTS } from '../../constants';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Activity,
  Database,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 13 },
  { name: 'Wed', revenue: 2000, orders: 98 },
  { name: 'Thu', revenue: 2780, orders: 39 },
  { name: 'Fri', revenue: 1890, orders: 48 },
  { name: 'Sat', revenue: 2390, orders: 38 },
  { name: 'Sun', revenue: 3490, orders: 43 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, isPositive, icon, color }: StatCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl text-white ${color}`}>
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <span>{change}</span>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">{title}</p>
    <p className="text-3xl font-bold text-[#141414]">{value}</p>
  </motion.div>
);

export default function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      const uSnap = await getDocs(collection(db, 'users'));
      const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5)));
      
      setStats({
        products: pSnap.size,
        users: uSnap.size,
        orders: oSnap.size
      });
      setRecentActivity(oSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  const seedEcosystem = async () => {
    setIsSeeding(true);
    try {
      for (const product of PRODUCTS) {
        await setDoc(doc(db, 'products', product.id), {
          ...product,
          status: 'published',
          sku: `DTL-${product.id.slice(-4).toUpperCase()}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      alert("Technological ecosystem initialized.");
      fetchStats();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Ecosystem Intelligence</h1>
          <p className="text-gray-500 font-medium">Real-time performance metrics and business health.</p>
        </div>
        <div className="flex items-center space-x-3">
            <button 
                onClick={seedEcosystem}
                disabled={isSeeding}
                className="flex items-center space-x-2 bg-white border border-gray-100 text-xs font-bold text-[#141414] px-4 py-2 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest"
            >
                {isSeeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                <span>Initialize Ecosystem</span>
            </button>
            <button className="bg-[#141414] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00A650] transition-colors">
                Export Data
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$128,430" 
          change="+12.5%" 
          isPositive={true}
          icon={<TrendingUp size={20} />}
          color="bg-[#00A650]"
        />
        <StatCard 
          title="Active Orders" 
          value={stats.orders} 
          change="+4.2%" 
          isPositive={true}
          icon={<ShoppingBag size={20} />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.24%" 
          change="-0.8%" 
          isPositive={false}
          icon={<Activity size={20} />}
          color="bg-purple-500"
        />
        <StatCard 
          title="Inventory Items" 
          value={stats.products} 
          change="+18" 
          isPositive={true}
          icon={<Package size={20} />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#141414]">Revenue Streams</h3>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none">
                <option>Weekly View</option>
                <option>Monthly View</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A650" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00A650" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}} 
                />
                <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#00A650" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Customers/Activity */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#141414] mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#00A650]">
                    <ShoppingBag size={18} />
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-bold text-[#141414]">Order #{activity.id.slice(-6)}</p>
                    <p className="text-xs text-gray-500">{activity.customerName || 'Anonymous User'}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-[#00A650]">${activity.total?.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{activity.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <Activity size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 text-sm italic">No recent transactions recorded.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-10 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            View All Ecosystem Activity
          </button>
        </div>
      </div>
    </div>
  );
}
