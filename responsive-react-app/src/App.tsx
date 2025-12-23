import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProductListPage from './pages/shop/ProductListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorManagement from './pages/admin/VendorManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import Button from './components/common/Button/Button';
import './App.css';

const Home: React.FC = () => {
  const { email, role, logout } = useAuthStore();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Shopping Mall</h1>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/products"><Button variant="secondary">Browse Products</Button></Link>
      </div>

      {email ? (
        <div>
          <p>Logged in as: <strong>{email}</strong> ({role})</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {role === 'ROLE_USER' && (
              <Link to="/mypage"><Button variant="info">My Page</Button></Link>
            )}
            {role === 'ROLE_SHOP_ADMIN' && (
              <Link to="/vendor"><Button variant="success">Vendor Dashboard</Button></Link>
            )}
            {role === 'ROLE_SUPER_ADMIN' && (
              <Link to="/admin"><Button variant="warning">Admin Dashboard</Button></Link>
            )}
          </div>
          <Button onClick={logout} variant="danger">Logout</Button>
        </div>
      ) : (
        <div>
          <p>Login to access personalized features.</p>
          <Link to="/login"><Button variant="primary">Go to Login</Button></Link>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
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
                <div style={{ padding: '20px' }}><h1>My Page</h1><p>User profile and order history coming soon.</p></div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_SHOP_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <div style={{ padding: '20px' }}><h1>Vendor Dashboard</h1><p>Product management and shop settings coming soon.</p></div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;