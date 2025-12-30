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
      <p>{t('admin.welcome_admin')}</p>
      
      <Grid columns={3}>
        <Card title={t('admin.vendor_mgmt')}>
          <p>{t('admin.vendor_mgmt_desc')}</p>
          <Link to="/admin/vendors">
            <Button variant="primary">{t('admin.go_to_vendors')}</Button>
          </Link>
        </Card>
        
        <Card title={t('admin.user_mgmt')}>
          <p>{t('admin.user_mgmt_desc')}</p>
          <Link to="/admin/users">
            <Button variant="primary">{t('admin.go_to_users')}</Button>
          </Link>
        </Card>
        
        <Card title={t('admin.reports')}>
          <p>{t('admin.report_desc')}</p>
          <Link to="/admin/reports">
            <Button variant="secondary">{t('admin.view_reports')}</Button>
          </Link>
        </Card>

        <Card title={t('admin.product_mgmt')}>
          <p>{t('admin.product_mgmt_desc')}</p>
          <Link to="/admin/products">
            <Button variant="outline-primary">{t('admin.go_to_products')}</Button>
          </Link>
        </Card>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
