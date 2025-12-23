import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProductListPage from './pages/shop/ProductListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorManagement from './pages/admin/VendorManagement';
import VendorDashboard from './pages/vendor/VendorDashboard';
import MyOrdersPage from './pages/shop/MyOrdersPage';
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;