import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Settings, 
  LifeBuoy, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  CircleCheck,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { group: 'Dashboard', items: [
    { name: 'Overview', path: '/account', icon: LayoutDashboard },
  ]},
  { group: 'Shopping', items: [
    { name: 'Orders', path: '/account/orders', icon: Package },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
  ]},
  { group: 'Preferences', items: [
    { name: 'Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Payment Methods', path: '/account/payments', icon: CreditCard },
  ]},
  { group: 'Security & App', items: [
    { name: 'Security', path: '/account/security', icon: ShieldCheck },
    { name: 'Notifications', path: '/account/notifications', icon: Bell },
    { name: 'Account Settings', path: '/account/settings', icon: Settings },
  ]},
  { group: 'Support', items: [
    { name: 'Support', path: '/account/support', icon: LifeBuoy },
  ]}
];

export default function AccountLayout({ children }: AccountLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle resizing for sidebar animation
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activePath = location.pathname;
  const isMobile = windowWidth < 1024;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#00A650] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : (isMobile ? -280 : 0) }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-[#EEEEEE] z-[70] overflow-y-auto overflow-x-hidden`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A650] rounded-xl flex items-center justify-center shadow-lg shadow-[#00A650]/20 transition-transform hover:scale-105 active:scale-95">
                <Cpu className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#111111]">
                DigiTech<span className="text-[#00A650]">Labs</span>
              </span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-grow space-y-8">
            {navItems.map((group) => (
              <div key={group.group}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 px-3">
                  {group.group}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activePath === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-[#00A650]/5 text-[#00A650] font-medium' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon size={18} className={isActive ? 'text-[#00A650]' : 'text-gray-400 group-hover:text-gray-600'} />
                        <span className="text-[14px]">{item.name}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeTab"
                            className="ml-auto w-1.5 h-1.5 bg-[#00A650] rounded-full shadow-[0_0_8px_rgba(0,166,80,0.5)]"
                          />
                        )}
                        {!isActive && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="text-[14px]">Log out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 h-screen overflow-y-auto overflow-x-hidden flex flex-col">
        {/* Top Header Section */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
               <div className="relative group cursor-pointer">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-sm ring-1 ring-gray-200">
                    <UserIcon size={20} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <CircleCheck size={14} className="text-[#00A650] fill-[#00A650]/10" />
                </div>
               </div>
               <div>
                  <h2 className="font-semibold text-gray-900 leading-tight">Welcome back, {user?.displayName || 'Adventurer'}</h2>
                  <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
               </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* Membership badges removed as requested */}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-6xl mx-auto min-h-[calc(100vh-73px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
