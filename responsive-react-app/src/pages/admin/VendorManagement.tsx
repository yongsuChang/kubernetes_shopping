import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Alert from '../../components/common/Alert/Alert';
import { Tabs, Tab } from '../../components/common/Tabs/Tabs';

interface Vendor {
  id: number;
  name: string;
  description: string;
  contactEmail: string;
  status: string;
}

const VendorManagement: React.FC = () => {
  const { t } = useTranslation();
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        adminClient.get('/api/v1/admin/vendors/pending'),
        adminClient.get('/api/v1/admin/vendors')
      ]);
      setPendingVendors(pendingRes.data);
      setAllVendors(allRes.data);
    } catch (err) {
      console.error('Failed to fetch vendors', err);
      setMessage({ type: 'danger', text: 'Failed to fetch vendor data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: number, status: string, actionName: string) => {
    try {
      if (status === 'ACTIVE' && actionName === 'Approve') {
        await adminClient.post(`/api/v1/admin/vendors/${id}/approve`);
      } else {
        await adminClient.patch(`/api/v1/admin/vendors/${id}/status?status=${status}`);
      }
      setMessage({ type: 'success', text: `Vendor ${actionName}d successfully` });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: `Failed to ${actionName} vendor` });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">{t('admin.status_active')}</Badge>;
      case 'PENDING': return <Badge variant="warning">{t('admin.status_pending')}</Badge>;
      case 'SUSPENDED': return <Badge variant="danger">Suspended</Badge>;
      case 'INACTIVE': return <Badge variant="secondary">{t('admin.status_inactive')}</Badge>;
      default: return <Badge variant="info">{status}</Badge>;
    }
  };

  if (loading && pendingVendors.length === 0) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('admin.vendor_mgmt')}</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      
      <Tabs>
        <Tab label={t('admin.status_pending')}>
          <div style={{ marginTop: '20px' }}>
            {pendingVendors.length === 0 ? (
              <p>No pending vendor registrations.</p>
            ) : (
              <Grid columns={2}>
                {pendingVendors.map((vendor) => (
                  <Card key={vendor.id} title={vendor.name}>
                    <p>{vendor.description}</p>
                    <p><strong>{t('auth.vendor_email')}:</strong> {vendor.contactEmail}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <Button variant="success" onClick={() => handleUpdateStatus(vendor.id, 'ACTIVE', 'Approve')}>{t('admin.approve')}</Button>
                      <Button variant="danger" onClick={() => handleUpdateStatus(vendor.id, 'INACTIVE', 'Reject')}>{t('admin.reject')}</Button>
                    </div>
                  </Card>
                ))}
              </Grid>
            )}
          </div>
        </Tab>
        <Tab label="All Vendors">
          <div style={{ marginTop: '20px' }}>
            <Grid columns={3}>
              {allVendors.map((vendor) => (
                <Card key={vendor.id} title={vendor.name}>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>ID: #{vendor.id}</p>
                  <p>Status: {getStatusBadge(vendor.status)}</p>
                  <p><strong>{t('auth.vendor_email')}:</strong> {vendor.contactEmail}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {vendor.status === 'ACTIVE' ? (
                      <Button variant="outline-danger" onClick={() => handleUpdateStatus(vendor.id, 'SUSPENDED', 'Suspend')}>Suspend</Button>
                    ) : (vendor.status === 'SUSPENDED' || vendor.status === 'INACTIVE') && (
                      <Button variant="outline-success" onClick={() => handleUpdateStatus(vendor.id, 'ACTIVE', 'Activate')}>Activate</Button>
                    )}
                  </div>
                </Card>
              ))}
            </Grid>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default VendorManagement;
