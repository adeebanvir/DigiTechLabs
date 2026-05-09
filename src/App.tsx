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

// Admin Auth Guard
const AdminRoute = ({ children }: { children: any }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-[#00A650]">Verifying Security...</div>;
  if (!isAdmin) return <div className="h-screen flex items-center justify-center font-bold text-red-500">Access Restricted.</div>;
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

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white selection:bg-[#00A650]/30 transition-colors duration-300 ${isAdminPath ? 'overflow-hidden h-screen' : ''}`}>
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? "h-full overflow-hidden" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Ecosystem */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminOverview /></AdminLayout></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
          <Route path="/admin/inventory" element={<AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
          <Route path="/admin/media" element={<AdminRoute><AdminLayout><AdminMedia /></AdminLayout></AdminRoute>} />
          <Route path="/admin/featured" element={<AdminRoute><AdminLayout><AdminFeatured /></AdminLayout></AdminRoute>} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

