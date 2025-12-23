import React, { useEffect, useState } from 'react';
import { adminClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Alert from '../../components/common/Alert/Alert';

interface Vendor {
  id: number;
  name: string;
  description: string;
  contactEmail: string;
  status: string;
}

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const fetchPendingVendors = async () => {
    setLoading(true);
    try {
      const response = await adminClient.get('/api/v1/admin/vendors/pending');
      setVendors(response.data);
    } catch (err) {
      console.error('Failed to fetch vendors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await adminClient.post(`/api/v1/admin/vendors/${id}/approve`);
      setMessage({ type: 'success', text: 'Vendor approved successfully' });
      fetchPendingVendors();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to approve vendor' });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminClient.post(`/api/v1/admin/vendors/${id}/reject`);
      setMessage({ type: 'success', text: 'Vendor rejected successfully' });
      fetchPendingVendors();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to reject vendor' });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Vendor Approval Management</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Pending Vendors</h3>
        {vendors.length === 0 ? (
          <p>No pending vendor registrations.</p>
        ) : (
          <Grid columns={2}>
            {vendors.map((vendor) => (
              <Card key={vendor.id} title={vendor.name}>
                <p>{vendor.description}</p>
                <p><strong>Email:</strong> {vendor.contactEmail}</p>
                <p>
                  Status: <Badge variant="warning">{vendor.status}</Badge>
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Button variant="success" onClick={() => handleApprove(vendor.id)}>Approve</Button>
                  <Button variant="danger" onClick={() => handleReject(vendor.id)}>Reject</Button>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
