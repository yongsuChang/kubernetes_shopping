import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { shopClient } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import './Auth.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await shopClient.post('/api/v1/auth/login', { email, password });
      const { accessToken, email: userEmail, role } = response.data;
      setAuth(accessToken, userEmail, role);
      
      if (role === 'ROLE_SUPER_ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <Card title="Login">
        <form onSubmit={handleLogin}>
          <LabeledInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LabeledInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" variant="primary">Login</Button>
          <p className="auth-link">
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
