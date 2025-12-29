import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import Alert from '../../components/common/Alert/Alert';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import { Grid } from '../../components/common/Grid/Grid';

interface VendorInfo {
  id: number;
  name: string;
  status: string;
  description: string;
}

interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import Alert from '../../components/common/Alert/Alert';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import { Grid } from '../../components/common/Grid/Grid';

const VendorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorRes = await shopClient.get('/api/v1/shop-admin/vendors/me');
        setVendor(vendorRes.data);
        
        if (vendorRes.data.status === 'ACTIVE') {
          const statsRes = await shopClient.get(`/api/v1/shop-admin/vendors/${vendorRes.data.id}/stats`);
          setStats(statsRes.data);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('Your vendor account is pending approval from the administrator.');
        } else {
          setError('Failed to load vendor information.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert variant="warning">
          <h3>Access Restricted</h3>
          <p>{error}</p>
          <p>Please contact the support team if you think this is an error.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('vendor.dashboard')}</h1>
      <Card title={vendor?.name || 'My Shop'}>
        <p>{vendor?.description}</p>
        <p>
          Current Status: <Badge variant={vendor?.status === 'ACTIVE' ? 'success' : 'warning'}>{vendor?.status}</Badge>
        </p>
      </Card>

      {stats && (
        <div style={{ marginTop: '30px' }}>
          <h3>{t('vendor.my_sales')}</h3>
          <Grid columns={4}>
            <Card title="Total Revenue">
              <h2 style={{ color: 'var(--color-success)' }}>${stats.totalRevenue.toFixed(2)}</h2>
            </Card>
            <Card title="Total Orders">
              <h2>{stats.totalOrders}</h2>
            </Card>
            <Card title="Pending">
              <h2 style={{ color: 'var(--color-warning)' }}>{stats.pendingOrders}</h2>
            </Card>
            <Card title="Delivered">
              <h2 style={{ color: 'var(--color-primary)' }}>{stats.deliveredOrders}</h2>
            </Card>
          </Grid>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Management Tools</h3>
        <Grid columns={3}>
          <Card title={t('vendor.product_mgmt')}>
            <p>Add, edit, or remove your products.</p>
            <Link to="/vendor/products">
              <Button variant="primary">Manage Products</Button>
            </Link>
          </Card>
          <Card title={t('vendor.order_mgmt')}>
            <p>Manage incoming orders and shipping.</p>
            <Link to="/vendor/orders">
              <Button variant="primary">Manage Orders</Button>
            </Link>
          </Card>
          <Card title="Sales Statistics">
            <p>View your sales reports and trends.</p>
            <Button variant="secondary" disabled>Detailed Reports (Coming Soon)</Button>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export default VendorDashboard;