import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Dropdown from '../../components/common/Dropdown/Dropdown';
import { shopClient } from '../../api/client';
import './Auth.css';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shopClient.post('/api/v1/auth/signup', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <Card title="Signup">
        <form onSubmit={handleSignup}>
          <LabeledInput
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <LabeledInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <LabeledInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="labeled-input">
            <label>Role</label>
            <select 
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="ROLE_USER">Customer</option>
              <option value="ROLE_SHOP_ADMIN">Vendor Admin</option>
            </select>
          </div>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" variant="primary">Signup</Button>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;
