import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
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
  ShoppingBag,
  Trash2,
  FileText,
  Printer
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

  const handleEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await updateDoc(doc(db, 'orders', editingOrder.id), {
        customerName: editingOrder.customerName,
        shippingAddress: editingOrder.shippingAddress,
        email: editingOrder.email,
        phone: editingOrder.phone,
        status: editingOrder.status,
        updatedAt: new Date()
      });
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${editingOrder.id}`);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("CRITICAL: This will permanently remove this transaction from the ledger. Proceed?")) return;
    try {
      setOrders(prev => prev.filter(o => o.id !== orderId)); // Optimistic UI
      await deleteDoc(doc(db, 'orders', orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (error) {
      fetchOrders(); // Rollback on error
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  const generateInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #141414; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; }
            .info { display: flex; justify-content: space-between; margin-top: 40px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            .table th { text-align: left; background: #f9f9f9; padding: 12px; font-size: 10px; text-transform: uppercase; }
            .table td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
            .total { text-align: right; margin-top: 40px; font-size: 20px; font-weight: bold; }
            .footer { margin-top: 80px; font-size: 10px; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">DIGITECH LABS</div>
            <div>
              <p><strong>Invoice ID:</strong> #${order.id.toUpperCase()}</p>
              <p><strong>Date:</strong> ${order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div class="info">
            <div>
              <p><strong>BILL TO:</strong></p>
              <p>${order.customerName}</p>
              <p>${order.email || 'N/A'}</p>
              <p>${order.phone || 'N/A'}</p>
            </div>
            <div style="text-align: right">
              <p><strong>SHIPPING ADDRESS:</strong></p>
              <p>${order.shippingAddress || 'Digital Delivery'}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>1</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total Amount: $${order.total.toFixed(2)}</div>
          <div class="footer">Thank you for powering the future with DigiTech Labs.</div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items?.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#00A650]" />
                           <p className="font-mono text-sm font-bold text-[#141414]">ID: {order.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-1.5 pl-3.5 border-l border-gray-100">
                            Recorded: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
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
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                           <div key={idx} className="flex items-center text-[10px] bg-gray-50 px-2 py-0.5 rounded-md text-gray-600 font-bold border border-gray-100">
                             {item.name}
                           </div>
                        ))}
                        {(!order.items || order.items.length === 0) && "No Items"}
                      </div>
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
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => setEditingOrder(order)}
                            className="p-2 text-gray-400 hover:text-[#00A650] hover:bg-gray-50 rounded-lg transition-all" 
                            title="Edit Order"
                         >
                            <Eye size={18} />
                         </button>
                         <button 
                            onClick={() => generateInvoice(order)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 rounded-lg transition-all" 
                            title="Print Invoice"
                         >
                            <FileText size={18} />
                         </button>
                         <select 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            value={order.status}
                            className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 border-none rounded-lg p-1 outline-none mx-1"
                         >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                         </select>
                         <button 
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                            title="Delete Order"
                         >
                            <Trash2 size={18} />
                         </button>
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

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#141414]">Modify Transaction</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Order #{editingOrder.id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-[#141414]">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditOrder} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Customer Identity</label>
                  <input 
                    type="text" 
                    value={editingOrder.customerName}
                    onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none outline-none rounded-xl font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    value={editingOrder.email}
                    onChange={(e) => setEditingOrder({...editingOrder, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none outline-none rounded-xl font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={editingOrder.phone}
                    onChange={(e) => setEditingOrder({...editingOrder, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none outline-none rounded-xl font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Fulfillment Status</label>
                  <select 
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border-none outline-none rounded-xl font-bold text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Shipping Destination</label>
                <textarea 
                  rows={3}
                  value={editingOrder.shippingAddress}
                  onChange={(e) => setEditingOrder({...editingOrder, shippingAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-none outline-none rounded-xl font-bold text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 px-6 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-[#141414] text-white font-bold rounded-2xl hover:bg-[#00A650] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
