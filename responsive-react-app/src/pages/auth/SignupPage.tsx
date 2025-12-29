import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { shopClient } from '../../api/client';
import './Auth.css';

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
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
      alert(t('auth.signup_success'));
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <Card title={t('auth.signup_title')}>
        <form onSubmit={handleSignup}>
          <h3>{t('auth.name')}</h3>
          <Grid2 columns={2}>
            <LabeledInput
              label={t('auth.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <LabeledInput
              label={t('auth.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Grid2>
          <LabeledInput
            label={t('auth.password')}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="labeled-input" style={{ marginBottom: '20px' }}>
            <label>{t('auth.role')}</label>
            <select 
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="ROLE_USER">Customer</option>
              <option value="ROLE_SHOP_ADMIN">Vendor</option>
            </select>
          </div>

          {formData.role === 'ROLE_SHOP_ADMIN' && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
              <h3>Vendor Information</h3>
              <LabeledInput
                label={t('auth.vendor_name')}
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                required={formData.role === 'ROLE_SHOP_ADMIN'}
              />
              <LabeledInput
                label={t('auth.vendor_description')}
                value={formData.vendorDescription}
                onChange={(e) => setFormData({ ...formData, vendorDescription: e.target.value })}
              />
              <Grid2 columns={2}>
                <LabeledInput
                  label={t('auth.vendor_email')}
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
                label={t('auth.vendor_address')}
                value={formData.vendorAddress}
                onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
              />
            </div>
          )}

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? t('common.loading') : t('common.signup')}
          </Button>
          
          <p className="auth-link" style={{ textAlign: 'center', marginTop: '15px' }}>
            {t('auth.have_account')} <Link to="/login">{t('common.login')}</Link>
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