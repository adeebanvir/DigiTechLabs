import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Order } from '../../types';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck,
  Download,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any }> = {
  pending: { color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={14} /> },
  paid: { color: 'text-green-500', bg: 'bg-green-50', icon: <CheckCircle size={14} /> },
  processing: { color: 'text-blue-500', bg: 'bg-blue-50', icon: <Clock size={14} /> },
  shipped: { color: 'text-purple-500', bg: 'bg-purple-50', icon: <Truck size={14} /> },
  delivered: { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle size={14} /> },
  cancelled: { color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle size={14} /> },
  refunded: { color: 'text-gray-500', bg: 'bg-gray-100', icon: <AlertCircle size={14} /> }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      fetchOrders();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Ecosystem Transactions</h1>
          <p className="text-gray-500 font-medium">Monitor and fulfill innovation acquisitions.</p>
        </div>
        <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-100 text-[#141414] px-6 py-3 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
                <Download size={20} className="mr-2" />
                Export Ledger
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A650] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none font-medium focus:ring-2 focus:ring-[#00A650]/20 transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            {['All', 'Pending', 'Paid', 'Shipped'].map((tab) => (
                <button key={tab} className={`font-bold transition-colors ${tab === 'All' ? 'text-[#00A650]' : 'text-gray-400 hover:text-[#141414]'}`}>
                    {tab}
                </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Order Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Inventory</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Transaction</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Ecosystem Status</th>
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
              ) : filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-[#141414]">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#141414]/5 flex items-center justify-center text-xs font-bold text-[#141414]">
                            {order.customerName ? order.customerName.charAt(0) : 'U'}
                        </div>
                        <div>
                         <p className="text-sm font-bold text-[#141414] leading-none mb-1">{order.customerName || 'Anonymous'}</p>
                         <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{order.userId.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                      {order.items?.length || 0} Technology Units
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-[#141414]">${order.total?.toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                        {status.icon}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-gray-400 hover:text-[#00A650] hover:bg-gray-50 rounded-lg transition-all" title="View Details">
                            <Eye size={18} />
                         </button>
                         <select 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            value={order.status}
                            className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 border-none rounded-lg p-1 outline-none"
                         >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                         </select>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500 font-medium">No order data found in the current temporal slice.</p>
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
