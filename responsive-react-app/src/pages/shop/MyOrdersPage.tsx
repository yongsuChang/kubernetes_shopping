import React, { useEffect, useState } from 'react';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Spinner from '../../components/common/Spinner/Spinner';
import { Grid } from '../../components/common/Grid/Grid';
import Modal from '../../components/common/Modal/Modal';
import Button from '../../components/common/Button/Button';

interface Order {
  id: number;
  product: { name: string };
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OrderHistory {
  id: number;
  previousStatus: string;
  newStatus: string;
  reason: string;
  createdAt: string;
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await shopClient.get('/api/v1/shop/orders/me');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const viewHistory = async (orderId: number) => {
    setSelectedOrder(orderId);
    setHistoryLoading(true);
    try {
      const response = await shopClient.get(`/api/v1/shop/orders/${orderId}/history`);
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <Grid columns={1}>
          {orders.map((order) => (
            <Card key={order.id} title={`Order #${order.id} - ${order.product.name}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total: <strong>${order.totalAmount}</strong></p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <Badge variant="info">{order.status}</Badge>
                </div>
                <Button onClick={() => viewHistory(order.id)}>View Status History</Button>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      {selectedOrder && (
        <Modal 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          title={`Order Status Timeline (#${selectedOrder})`}
        >
          {historyLoading ? <Spinner /> : (
            <div style={{ padding: '10px' }}>
              {history.map((h, index) => (
                <div key={h.id} style={{ 
                  borderLeft: '2px solid var(--color-primary)', 
                  paddingLeft: '20px', 
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: 'var(--color-primary)', 
                    borderRadius: '50%', 
                    position: 'absolute', 
                    left: '-7px', 
                    top: '0' 
                  }}></div>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>{h.newStatus}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0' }}>
                    {new Date(h.createdAt).toLocaleString()}
                  </p>
                  {h.reason && <p style={{ fontStyle: 'italic' }}>"{h.reason}"</p>}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default MyOrdersPage;
