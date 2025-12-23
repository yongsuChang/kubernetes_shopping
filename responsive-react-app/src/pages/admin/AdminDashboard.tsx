import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the administration panel.</p>
      
      <Grid columns={3}>
        <Card title="Vendor Management">
          <p>Review and approve new vendor registrations.</p>
          <Link to="/admin/vendors">
            <Button variant="primary">Go to Vendors</Button>
          </Link>
        </Card>
        
        <Card title="User Management">
          <p>Manage platform users and roles.</p>
          <Button variant="secondary" disabled>Coming Soon</Button>
        </Card>
        
        <Card title="System Reports">
          <p>View platform statistics and reports.</p>
          <Button variant="secondary" disabled>Coming Soon</Button>
        </Card>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
