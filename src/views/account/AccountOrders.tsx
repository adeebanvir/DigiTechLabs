import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  RefreshCcw, 
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/dataService';
import { Order } from '../../types';
import { Link } from 'react-router-dom';

export default function AccountOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.uid) {
      orderService.getOrdersByUserId(user.uid).then(data => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'pending': return 'bg-gray-50 text-gray-700 border-gray-100';
      case 'cancelled':
      case 'refunded': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'processing': return <RefreshCcw size={14} className="animate-spin-slow" />;
      case 'pending': return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) {
    return <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl" />)}
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track your recent purchases.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A650]/20 focus:border-[#00A650] outline-none transition-all w-full md:w-64"
            />
          </div>
          <div className="relative">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
               <Filter size={18} />
               <span>Status</span>
               <ChevronDown size={14} />
             </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-[#00A650]/5 border border-[#00A650]/10 p-6 rounded-3xl">
            <p className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
         </div>
         <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Active</p>
            <p className="text-2xl font-bold text-gray-900">{orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}</p>
         </div>
         <div className="bg-green-50 border border-green-100 p-6 rounded-3xl">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'delivered').length}</p>
         </div>
         <div className="bg-red-50 border border-red-100 p-6 rounded-3xl">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'cancelled').length}</p>
         </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <motion.div 
            key={order.id}
            layout
            className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 overflow-hidden group"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${getStatusColor(order.status)}`}>
                      <Package size={24} />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Placed on {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()} • {order.items.length} Items</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                  <p className="text-xs font-bold text-[#00A650] bg-[#F3FAF7] px-2 py-0.5 rounded-full inline-block mt-2">Payment: {order.paymentStatus}</p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
                 {order.items.map((item: any, idx: number) => (
                   <div key={idx} className="shrink-0 w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 p-2 group-hover:border-[#00A650]/20 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400">{item.name.slice(0, 2).toUpperCase()}</span>
                   </div>
                 ))}
                 {order.items.length > 5 && (
                   <div className="shrink-0 w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400">+{order.items.length - 5} More</span>
                   </div>
                 )}
              </div>

              <div className="pt-8 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                 <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Number</p>
                      <p className="text-sm font-bold text-gray-700">{order.trackingCode || 'Pending Assignment'}</p>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-gray-100" />
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Method</p>
                      <p className="text-sm font-bold text-gray-700">Premium Global Express</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors">
                     <FileText size={16} />
                     Invoice
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00A650] text-white text-xs font-bold rounded-xl hover:bg-[#009245] transition-all shadow-lg shadow-[#00A650]/20">
                     Track Order
                     <ArrowRight size={16} />
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or start shopping.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-[#00A650] text-white font-bold rounded-2xl hover:scale-105 transition-transform">
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
