import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { shopClient } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import './Auth.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await shopClient.post('/api/v1/auth/login', { email, password });
      const { token, email: userEmail, role } = response.data;
      setAuth(token, userEmail, role);
      
      if (role === 'ROLE_SUPER_ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <Card title={t('auth.login_title')}>
        <form onSubmit={handleLogin}>
          <LabeledInput
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LabeledInput
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" variant="primary">{t('common.login')}</Button>
          <p className="auth-link">
            {t('auth.no_account')} <Link to="/signup">{t('common.signup')}</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
