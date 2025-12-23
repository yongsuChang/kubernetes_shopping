import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProductListPage from './pages/shop/ProductListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorManagement from './pages/admin/VendorManagement';
import UserManagement from './pages/admin/UserManagement';
import VendorDashboard from './pages/vendor/VendorDashboard';
import ProductManagement from './pages/vendor/ProductManagement';
import OrderFulfillment from './pages/vendor/OrderFulfillment';
import MyOrdersPage from './pages/shop/MyOrdersPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/Home';
import { useAuthStore } from './store/useAuthStore';
import Button from './components/common/Button/Button';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/vendors" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <VendorManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mypage" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_SUPER_ADMIN']}>
                <MyOrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SHOP_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/products" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SHOP_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <ProductManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/orders" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SHOP_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <OrderFulfillment />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;