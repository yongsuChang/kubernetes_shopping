import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProductListPage from './pages/shop/ProductListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorManagement from './pages/admin/VendorManagement';
import { useAuthStore } from './store/useAuthStore';
import Button from './components/common/Button/Button';
import './App.css';

const Home: React.FC = () => {
  const { email, role, logout } = useAuthStore();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Shopping Mall</h1>
      {email ? (
        <div>
          <p>Logged in as: <strong>{email}</strong> ({role})</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <Link to="/products"><Button variant="secondary">Browse Products</Button></Link>
            {role === 'ROLE_SUPER_ADMIN' && (
              <Link to="/admin"><Button variant="warning">Admin Dashboard</Button></Link>
            )}
          </div>
          <Button onClick={logout} variant="danger">Logout</Button>
        </div>
      ) : (
        <div>
          <p>Please login to start shopping.</p>
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vendors" element={<VendorManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;