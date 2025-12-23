import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { shopClient } from '../../api/client';
import './Auth.css';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
    vendorName: '',
    vendorDescription: '',
    vendorEmail: '',
    vendorPhone: '',
    vendorAddress: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await shopClient.post('/api/v1/auth/signup', formData);
      alert('Signup successful! If you are a vendor, please wait for admin approval.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Email or Vendor name might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <Card title="Create Account">
        <form onSubmit={handleSignup}>
          <h3>User Information</h3>
          <Grid2 columns={2}>
            <LabeledInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <LabeledInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Grid2>
          <LabeledInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="labeled-input" style={{ marginBottom: '20px' }}>
            <label>Account Type</label>
            <select 
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="ROLE_USER">Customer (Standard User)</option>
              <option value="ROLE_SHOP_ADMIN">Vendor (Store Owner)</option>
            </select>
          </div>

          {formData.role === 'ROLE_SHOP_ADMIN' && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
              <h3>Store Information (Pending Admin Approval)</h3>
              <LabeledInput
                label="Store Name"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                required={formData.role === 'ROLE_SHOP_ADMIN'}
              />
              <LabeledInput
                label="Store Description"
                value={formData.vendorDescription}
                onChange={(e) => setFormData({ ...formData, vendorDescription: e.target.value })}
              />
              <Grid2 columns={2}>
                <LabeledInput
                  label="Contact Email"
                  value={formData.vendorEmail}
                  onChange={(e) => setFormData({ ...formData, vendorEmail: e.target.value })}
                />
                <LabeledInput
                  label="Contact Phone"
                  value={formData.vendorPhone}
                  onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                />
              </Grid2>
              <LabeledInput
                label="Business Address"
                value={formData.vendorAddress}
                onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
              />
            </div>
          )}

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? 'Processing...' : 'Sign Up'}
          </Button>
          
          <p className="auth-link" style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

// Internal Grid for signup form
const Grid2: React.FC<{children: React.ReactNode, columns: number}> = ({children, columns}) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '15px', marginBottom: '15px' }}>
    {children}
  </div>
);

export default SignupPage;