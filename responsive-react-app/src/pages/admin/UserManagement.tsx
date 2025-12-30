import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Alert from '../../components/common/Alert/Alert';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminClient.get('/api/v1/admin/members');
      setMembers(response.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
      setMessage({ type: 'danger', text: 'Failed to fetch user data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: number, status: string, actionName: string) => {
    try {
      await adminClient.patch(`/api/v1/admin/members/${id}/status?status=${status}`);
      setMessage({ type: 'success', text: `User ${actionName}d successfully` });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: `Failed to ${actionName} user` });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN': return <Badge variant="danger">{t('auth.role_super_admin')}</Badge>;
      case 'ROLE_SHOP_ADMIN': return <Badge variant="success">{t('auth.role_shop_admin')}</Badge>;
      case 'ROLE_USER': return <Badge variant="info">{t('auth.role_user')}</Badge>;
      default: return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('admin.user_mgmt')}</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Grid columns={3}>
          {members.map((member) => (
            <Card key={member.id} title={member.name}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>ID: #{member.id}</p>
              <p>{t('auth.email')}: {member.email}</p>
              <p>{t('auth.role')}: {getRoleBadge(member.role)}</p>
              <p>Status: <Badge variant={member.status === 'ACTIVE' ? 'success' : 'warning'}>{member.status}</Badge></p>
              <p><small>{t('vendor.order_date')}: {new Date(member.createdAt).toLocaleDateString()}</small></p>
              
              {member.role !== 'ROLE_SUPER_ADMIN' && (
                <div style={{ marginTop: '15px' }}>
                  {member.status === 'ACTIVE' ? (
                    <Button variant="outline-danger" onClick={() => handleUpdateStatus(member.id, 'SUSPENDED', 'Suspend')}>Suspend</Button>
                  ) : (
                    <Button variant="outline-success" onClick={() => handleUpdateStatus(member.id, 'ACTIVE', 'Activate')}>Activate</Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default UserManagement;