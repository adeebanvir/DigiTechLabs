import React, { useEffect, useState } from 'react';
import { 
  Package, 
  CreditCard, 
  Heart, 
  Star, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  LifeBuoy
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
import { useAuth } from '../../context/AuthContext';
import { orderService, accountService, productService } from '../../services/dataService';
import { Order, ActivityLog, Product } from '../../types';
import { Link } from 'react-router-dom';

export default function AccountOverview() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        const [userOrders, userActivity, wishlist] = await Promise.all([
          orderService.getOrdersByUserId(user.uid),
          accountService.getActivityLogs(user.uid),
          accountService.getWishlist(user.uid)
        ]);
        setOrders(userOrders);
        setActivity(userActivity);
        setWishlistCount(wishlist.length);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  const latestOrder = orders[0];

  // Calculate monthly spending for the last 6 months
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      
      const monthlyTotal = orders.reduce((sum, order) => {
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        if (orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === year) {
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);
      
      result.push({ name: monthName, amount: monthlyTotal });
    }
    return result;
  };

  const chartData = getMonthlyData();

  const stats = [
    { name: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, icon: CreditCard, color: 'bg-blue-500', trend: 'Lifetime' },
    { name: 'Active Orders', value: activeOrders, icon: Package, color: 'bg-[#00A650]', trend: 'In Progress' },
    { name: 'Wishlist Items', value: wishlistCount, icon: Heart, color: 'bg-rose-500', trend: 'Saved' },
    { name: 'Average Order', value: orders.length > 0 ? `$${(totalSpent / orders.length).toFixed(2)}` : '$0', icon: TrendingUp, color: 'bg-indigo-500', trend: 'Per Order' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-3xl" />
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Overview</h1>
          <p className="text-gray-500 mt-1">Check your latest activity and subscription stats.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Download Report
          </button>
          <Link to="/shop" className="px-5 py-2.5 bg-[#00A650] text-white rounded-xl text-sm font-semibold hover:bg-[#009245] transition-colors shadow-lg shadow-[#00A650]/20 flex items-center gap-2">
            <ShoppingBag size={16} />
            Shop Now
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <div className="flex items-center justify-between lg:flex-col lg:items-start lg:gap-1.5 mt-1">
                <h3 className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400 uppercase tracking-wider'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 min-w-0 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Spending Overview</h3>
              <p className="text-sm text-gray-500">Your monthly spending patterns</p>
            </div>
            <select className="bg-gray-50 border-none rounded-lg text-xs font-semibold text-gray-600 px-3 py-1.5 focus:ring-1 focus:ring-[#00A650]">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A650" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00A650" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#00A650" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-[#00A650] text-xs font-bold hover:underline">View All</button>
          </div>
          
          <div className="space-y-6 flex-grow">
            {activity.length > 0 ? activity.map((item, i) => (
              <div key={item.id} className="flex gap-4 group">
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'order' ? 'bg-green-50 text-green-600' :
                  item.type === 'security' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {item.type === 'order' ? <Package size={14} /> :
                   item.type === 'security' ? <ShieldCheck size={14} /> :
                   <Zap size={14} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-[#00A650] transition-colors">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {item.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <TrendingUp size={32} />
                </div>
                <p className="text-sm font-medium text-gray-500">No activity yet</p>
                <p className="text-xs text-gray-400 mt-1">Start shopping to see updates</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
             {/* Membership/Elite Club section removed */}
          </div>
        </div>
      </div>

      {/* Latest Order & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Active Order Status</h3>
            {latestOrder ? (
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 scale-150 opacity-[0.03] group-hover:scale-[1.7] transition-transform duration-700">
                  <Package size={120} />
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                       <Package size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#00A650] uppercase tracking-wider">Tracking ID: {latestOrder.trackingCode || 'TRK-9821-X'}</span>
                        <div className="w-1.5 h-1.5 bg-[#00A650] rounded-full animate-pulse" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Order #{latestOrder.id.slice(0, 8).toUpperCase()}</h4>
                      <p className="text-sm text-gray-500 mt-1">Estimate Delivery: <span className="text-gray-900 font-semibold">May 15, 2026</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                      latestOrder.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      latestOrder.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {latestOrder.status}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${latestOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-100 rounded-full mb-10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="absolute h-full bg-[#00A650] rounded-full shadow-[0_0_8px_rgba(0,166,80,0.4)]"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="text-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items</p>
                     <p className="font-bold text-gray-900">{latestOrder.items.length}</p>
                   </div>
                   <div className="text-center border-l border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Carrier</p>
                     <p className="font-bold text-gray-900">FedEx Express</p>
                   </div>
                   <div className="text-center border-l border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                     <p className="font-bold text-gray-900">1.2 kg</p>
                   </div>
                   <div className="text-center border-l border-gray-100 flex items-center justify-center">
                     <Link to={`/account/orders`} className="text-[#00A650] font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                       Manage Details <ChevronRight size={14} />
                     </Link>
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[32px] border border-dashed border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <Package size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">No active orders</h4>
                <p className="text-sm text-gray-500 mt-2">Ready to find something new?</p>
                <Link to="/shop" className="inline-flex items-center gap-2 mt-6 font-bold text-[#00A650] hover:gap-3 transition-all">
                  Go to Shop <ArrowUpRight size={16} />
                </Link>
              </div>
            )}
         </div>

         <div>
           <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
           <div className="space-y-4">
              <button className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-gray-100 transition-all group">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Flash Sales</p>
                  <p className="text-xs text-gray-400">Exclusive deals for you</p>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-600" />
              </button>


              <button className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-gray-100 transition-all group">
                <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center">
                  <LifeBuoy size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Instant Help</p>
                  <p className="text-xs text-gray-400">24/7 priority support</p>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-600" />
              </button>
           </div>
         </div>
      </div>
    </motion.div>
  );
}
