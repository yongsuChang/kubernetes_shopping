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

const VendorDashboard: React.FC = () => {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorInfo = async () => {
      try {
        // 내 업체 정보를 가져오는 API 호출 (미승인 상태면 여기서 403 발생 가능)
        const response = await shopClient.get('/api/v1/shop/vendors/me');
        setVendor(response.data);
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
    fetchVendorInfo();
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
      <h1>Vendor Dashboard</h1>
      <Card title={vendor?.name || 'My Shop'}>
        <p>{vendor?.description}</p>
        <p>
          Current Status: <Badge variant={vendor?.status === 'ACTIVE' ? 'success' : 'warning'}>{vendor?.status}</Badge>
        </p>
      </Card>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Management Tools</h3>
        <Grid columns={3}>
          <Card title="Product Management">
            <p>Add, edit, or remove your products.</p>
            <Link to="/vendor/products">
              <Button variant="primary">Manage Products</Button>
            </Link>
          </Card>
          <Card title="Order Fulfillment">
            <p>Manage incoming orders and shipping.</p>
            <Link to="/vendor/orders">
              <Button variant="primary">Manage Orders</Button>
            </Link>
          </Card>
          <Card title="Sales Statistics">
            <p>View your sales reports and trends.</p>
            <Button variant="secondary" disabled>Coming Soon</Button>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export default VendorDashboard;
