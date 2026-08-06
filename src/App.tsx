/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './views/Home';
import Shop from './views/Shop';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart';
import About from './views/About';
import Contact from './views/Contact';
import Login from './views/Login';
import PolicyDetail from './views/PolicyDetail';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './views/admin/AdminOverview';
import AdminProducts from './views/admin/AdminProducts';
import AdminOrders from './views/admin/AdminOrders';
import AdminUsers from './views/admin/AdminUsers';
import AdminCategories from './views/admin/AdminCategories';
import AdminInventory from './views/admin/AdminInventory';
import AdminMedia from './views/admin/AdminMedia';
import AdminFeatured from './views/admin/AdminFeatured';
import AdminSettings from './views/admin/AdminSettings';
import AdminFAQ from './views/admin/AdminFAQ';
import AdminPolicies from './views/admin/AdminPolicies';
import AdminTax from './views/admin/AdminTax';
import AccountLayout from './components/account/AccountLayout';
import AccountOverview from './views/account/AccountOverview';
import AccountOrders from './views/account/AccountOrders';
import AccountWishlist from './views/account/AccountWishlist';
import AccountAddresses from './views/account/AccountAddresses';
import AccountPayments from './views/account/AccountPayments';
import AccountSecurity from './views/account/AccountSecurity';
import AccountNotifications from './views/account/AccountNotifications';
import AccountSettings from './views/account/AccountSettings';
import AccountSupport from './views/account/AccountSupport';

// Admin Auth Guard
const AdminRoute = ({ children }: { children: any }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-[#00A650]">Verifying Security...</div>;
  if (!isAdmin) return <div className="h-screen flex items-center justify-center font-bold text-red-500">Access Restricted.</div>;
  return <>{children}</>;
};

// User Auth Guard
const UserRoute = ({ children }: { children: any }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-[#00A650]">Authenticating...</div>;
  if (!user) return <Login />;
  return <>{children}</>;
};

// Scroll to top on navigation component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/admin');
  const isAccountPath = pathname.startsWith('/account');

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white selection:bg-[#00A650]/30 transition-colors duration-300 ${isAdminPath || isAccountPath ? 'overflow-hidden h-screen' : ''}`}>
      {!isAdminPath && !isAccountPath && <Navbar />}
      <main className={isAdminPath || isAccountPath ? "h-full overflow-hidden" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/policies/:slug" element={<PolicyDetail />} />
          <Route path="/policies" element={<PolicyDetail />} />
          
          {/* Account Ecosystem */}
          <Route path="/account" element={<UserRoute><AccountLayout><AccountOverview /></AccountLayout></UserRoute>} />
          <Route path="/account/orders" element={<UserRoute><AccountLayout><AccountOrders /></AccountLayout></UserRoute>} />
          <Route path="/account/wishlist" element={<UserRoute><AccountLayout><AccountWishlist /></AccountLayout></UserRoute>} />
          <Route path="/account/addresses" element={<UserRoute><AccountLayout><AccountAddresses /></AccountLayout></UserRoute>} />
          <Route path="/account/payments" element={<UserRoute><AccountLayout><AccountPayments /></AccountLayout></UserRoute>} />
          <Route path="/account/security" element={<UserRoute><AccountLayout><AccountSettings /></AccountLayout></UserRoute>} />
          <Route path="/account/notifications" element={<UserRoute><AccountLayout><AccountNotifications /></AccountLayout></UserRoute>} />
          <Route path="/account/settings" element={<UserRoute><AccountLayout><AccountSettings /></AccountLayout></UserRoute>} />
          <Route path="/account/support" element={<UserRoute><AccountLayout><AccountSettings /></AccountLayout></UserRoute>} />

          {/* Admin Ecosystem */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminOverview /></AdminLayout></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
          <Route path="/admin/inventory" element={<AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
          <Route path="/admin/media" element={<AdminRoute><AdminLayout><AdminMedia /></AdminLayout></AdminRoute>} />
          <Route path="/admin/featured" element={<AdminRoute><AdminLayout><AdminFeatured /></AdminLayout></AdminRoute>} />
          <Route path="/admin/faq" element={<AdminRoute><AdminLayout><AdminFAQ /></AdminLayout></AdminRoute>} />
          <Route path="/admin/policies" element={<AdminRoute><AdminLayout><AdminPolicies /></AdminLayout></AdminRoute>} />
          <Route path="/admin/tax" element={<AdminRoute><AdminLayout><AdminTax /></AdminLayout></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />
        </Routes>
      </main>
      {!isAdminPath && !isAccountPath && <Footer />}
    </div>
  );
}

