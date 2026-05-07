import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Bell, 
  Search,
  Menu,
  X,
  Truck,
  Image,
  LogOut,
  Info,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
  key?: string;
}

const SidebarItem = ({ to, icon, label, badge, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        isActive 
          ? 'bg-[#00A650] text-white shadow-lg shadow-[#00A650]/20' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-[#141414]'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </span>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isActive ? 'bg-white text-[#00A650]' : 'bg-red-500 text-white'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Listen for new pending orders as "notifications"
    const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
      setRecentNotifications(snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'order',
        title: 'New Order Received',
        description: `Order #${doc.id.slice(-6).toUpperCase()} is awaiting processing.`,
        time: 'Just now'
      })));
    });

    return () => unsubscribe();
  }, []);

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
      ]
    },
    {
      title: 'Catalog',
      items: [
        { to: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { to: '/admin/categories', icon: <Tag size={20} />, label: 'Categories' },
        { to: '/admin/inventory', icon: <Truck size={20} />, label: 'Inventory' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { to: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders', badge: unreadCount > 0 ? unreadCount.toString() : undefined },
        { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { to: '/admin/media', icon: <Image size={20} />, label: 'Media' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 p-6 overflow-y-auto scrollbar-hide">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="font-bold text-[#141414] tracking-tighter">DigiTech Dashboard</h2>
            <p className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest">Enterprise v2.0</p>
          </div>
        </div>

        <nav className="flex-grow space-y-8">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 px-4">
                {group.title}
              </h3>
                <nav className="flex-grow space-y-1">
                  {group.items.map((item: any) => (
                    <SidebarItem 
                      key={item.to} 
                      to={item.to} 
                      icon={item.icon} 
                      label={item.label} 
                      badge={item.badge} 
                    />
                  ))}
                </nav>
            </div>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-gray-100 space-y-2">
           <Link 
            to="/"
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
           >
            <Store size={20} />
            <span className="font-bold text-sm">Exit Dashboard</span>
           </Link>
           <button 
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
           >
            <LogOut size={20} />
            <span className="font-bold text-sm">System Logout</span>
           </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div className="w-72 bg-white h-full p-6 shadow-2xl relative overflow-y-auto scrollbar-hide">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-500"
              >
                <X />
              </button>
              {/* Sidebar content repeated for mobile */}
              <nav className="space-y-8 mt-4">
                {menuGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 px-4">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item: any) => (
                        <SidebarItem 
                          key={item.to} 
                          to={item.to} 
                          icon={item.icon} 
                          label={item.label} 
                          badge={item.badge} 
                          onClick={() => setSidebarOpen(false)} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-10 pt-6 border-t border-gray-100 space-y-2">
                <Link 
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <Store size={20} />
                  <span className="font-bold text-sm">Exit Dashboard</span>
                </Link>
                <button 
                  onClick={() => { logout(); setSidebarOpen(false); }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-bold text-sm">System Logout</span>
                </button>
              </div>
            </div>
            <div 
              className="flex-grow bg-[#141414]/20 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 lg:static">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-[#141414]"
          >
            <Menu />
          </button>
          
          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-96 group focus-within:ring-2 focus-within:ring-[#00A650]/20 transition-all">
            <Search size={18} className="text-gray-400 group-focus-within:text-[#00A650]" />
            <input 
              type="text" 
              placeholder="Search dashboard..." 
              className="bg-transparent border-none outline-none ml-3 text-sm font-medium w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-[#00A650] transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#141414]">Notifications</h3>
                        <span className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest">{unreadCount} New</span>
                      </div>
                      
                      <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                        {recentNotifications.length > 0 ? recentNotifications.map((note) => (
                          <div key={note.id} className="flex space-x-4 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#00A650] shadow-sm">
                              <ShoppingBag size={18} />
                            </div>
                            <div className="flex-grow">
                              <p className="text-xs font-bold text-[#141414]">{note.title}</p>
                              <p className="text-[10px] text-gray-500 leading-tight mt-1">{note.description}</p>
                              <p className="text-[8px] text-[#00A650] font-bold uppercase mt-1.5 tracking-tighter">{note.time}</p>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-10">
                            <Info size={40} className="mx-auto text-gray-100 mb-4" />
                            <p className="text-gray-400 text-xs italic">System status stable. No new alerts.</p>
                          </div>
                        )}
                      </div>
                      
                      {recentNotifications.length > 0 && (
                        <button className="w-full mt-6 py-3 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 transition-colors">
                          View All Activity
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#141414]">{user?.displayName}</p>
                <p className="text-[10px] font-bold text-[#00A650] uppercase tracking-widest leading-none mt-1">Admin Access</p>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                <img src={user?.photoURL || ''} alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-4 sm:p-8 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
