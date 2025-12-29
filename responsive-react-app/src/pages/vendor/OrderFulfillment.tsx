import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Alert from '../../components/common/Alert/Alert';
import { Grid } from '../../components/common/Grid/Grid';

interface Order {
  id: number;
  product: { name: string };
  member: { name: string, email: string };
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrderFulfillment: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const vendorRes = await shopClient.get('/api/v1/shop-admin/vendors/me');
      const vId = vendorRes.data.id;
      setVendorId(vId);
      
      const response = await shopClient.get(`/api/v1/shop-admin/vendors/${vId}/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setMessage({ type: 'danger', text: 'Failed to load order data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    if (!vendorId) return;
    const reason = window.prompt('Enter reason for status change (optional):');
    
    try {
      await shopClient.patch(`/api/v1/shop-admin/vendors/${vendorId}/orders/${orderId}/status?status=${newStatus}&reason=${reason || ''}`);
      setMessage({ type: 'success', text: `Order #${orderId} status updated to ${newStatus}` });
      fetchOrders();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update order status' });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading && orders.length === 0) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('vendor.order_mgmt')}</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {orders.length === 0 ? (
        <p>No orders received yet.</p>
      ) : (
        <Grid columns={1}>
          {orders.map((order) => (
            <Card key={order.id} title={`${t('vendor.order_id')} #${order.id} - ${order.product.name}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p><strong>{t('vendor.customer')}:</strong> {order.member.name} ({order.member.email})</p>
                  <p><strong>{t('vendor.quantity')}:</strong> {order.quantity}</p>
                  <p><strong>{t('shop.total')}:</strong> ${order.totalAmount}</p>
                  <p><strong>{t('vendor.fulfillment_status')}:</strong> <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge></p>
                  <p><small>{t('vendor.order_date')}: {new Date(order.createdAt).toLocaleString()}</small></p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.status === 'PENDING' && (
                    <Button variant="info" onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}>Start Processing</Button>
                  )}
                  {order.status === 'PROCESSING' && (
                    <Button variant="primary" onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}>Mark as Shipped</Button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <Button variant="success" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>Mark as Delivered</Button>
                  )}
                  {['PENDING', 'PROCESSING'].includes(order.status) && (
                    <Button variant="outline-danger" onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}>Cancel Order</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default OrderFulfillment;