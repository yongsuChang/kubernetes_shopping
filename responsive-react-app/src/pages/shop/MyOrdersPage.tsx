import { useTranslation } from "react-i18next";
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
  product: { id: number, name: string };
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
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // History modal
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Review modal
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

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

  useEffect(() => {
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;
    try {
      await shopClient.post('/api/v1/shop/reviews', {
        orderId: reviewOrder.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      alert('Review submitted successfully!');
      setReviewOrder(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to submit review', err);
      alert('Failed to submit review. You might have already reviewed this order.');
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

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('common.mypage')}</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <Grid columns={1}>
          {orders.map((order) => (
            <Card key={order.id} title={`${t('vendor.order_id')} #${order.id} - ${order.product.name}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p>{t('vendor.quantity')}: {order.quantity}</p>
                  <p>{t('shop.total')}: <strong>${order.totalAmount}</strong></p>
                  <p>{t('vendor.order_date')}: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {order.status === 'DELIVERED' && (
                    <Button variant="success" onClick={() => setReviewOrder(order)}>Write Review</Button>
                  )}
                  <Button onClick={() => viewHistory(order.id)}>Status History</Button>
                </div>
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
              {history.map((h) => (
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

      {reviewOrder && (
        <Modal 
          isOpen={!!reviewOrder} 
          onClose={() => setReviewOrder(null)} 
          title={`Review for ${reviewOrder.product.name}`}
        >
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Rating: </label>
              <select 
                value={reviewData.rating} 
                onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                style={{ padding: '5px', marginLeft: '10px' }}
              >
                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <textarea 
              placeholder="Tell us about your experience..."
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              required
              style={{ minHeight: '100px', padding: '10px', width: '100%', boxSizing: 'border-box' }}
            />
            <Button type="submit" variant="primary">Submit Review</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyOrdersPage;