import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  CreditCard,
  Truck,
  PieChart,
  LogOut
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
  const { user, logout } = useAuth();

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { to: '/admin/analytics', icon: <PieChart size={20} />, label: 'Analytics' },
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
      title: 'Sales',
      items: [
        { to: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders', badge: '12' },
        { to: '/admin/payments', icon: <CreditCard size={20} />, label: 'Payments' },
        { to: '/admin/coupons', icon: <Tag size={20} />, label: 'Coupons' },
      ]
    },
    {
      title: 'Customers',
      items: [
        { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { to: '/admin/reviews', icon: <MessageSquare size={20} />, label: 'Reviews', badge: '5' },
        { to: '/admin/support', icon: <Bell size={20} />, label: 'Support' },
      ]
    },
    {
      title: 'System',
      items: [
        { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden pt-20">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 p-6 overflow-y-auto">
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

        <div className="mt-10 pt-6 border-t border-gray-100">
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
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div className="w-72 bg-white h-full p-6 shadow-2xl relative overflow-y-auto pt-20">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-24 right-6 p-2 text-gray-500"
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
              placeholder="Search ecosystem..." 
              className="bg-transparent border-none outline-none ml-3 text-sm font-medium w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 hover:text-[#00A650] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#00A650] rounded-full border-2 border-white" />
            </button>
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

        <main className="flex-grow overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
