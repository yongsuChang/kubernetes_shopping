import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('admin.dashboard')}</h1>
      <p>Welcome to the administration panel.</p>
      
      <Grid columns={3}>
        <Card title={t('admin.vendor_mgmt')}>
          <p>Review and approve new vendor registrations.</p>
          <Link to="/admin/vendors">
            <Button variant="primary">Go to Vendors</Button>
          </Link>
        </Card>
        
        <Card title={t('admin.user_mgmt')}>
          <p>Manage platform users and roles.</p>
          <Link to="/admin/users">
            <Button variant="primary">Go to Users</Button>
          </Link>
        </Card>
        
        <Card title={t('admin.reports')}>
          <p>View platform statistics and reports.</p>
          <Link to="/admin/reports">
            <Button variant="secondary">View Reports</Button>
          </Link>
        </Card>

        <Card title={t('admin.product_mgmt')}>
          <p>Review and manage all products on the platform.</p>
          <Link to="/admin/products">
            <Button variant="outline-primary">Go to Products</Button>
          </Link>
        </Card>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
