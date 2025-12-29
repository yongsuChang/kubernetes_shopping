import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { Grid } from '../../components/common/Grid/Grid';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>{t('shop.empty_cart')}</h2>
        <p>Go add some amazing products!</p>
        <Link to="/products"><Button variant="primary">{t('shop.browse_products')}</Button></Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('common.cart')}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <Grid columns={1}>
            {items.map((item) => (
              <Card key={item.id} title={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p>Price: ${item.price}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Button variant="outline-secondary" size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline-secondary" size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p><strong>Subtotal: ${(item.price * item.quantity).toFixed(2)}</strong></p>
                    <Button variant="outline-danger" size="small" onClick={() => removeItem(item.id)}>Remove</Button>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
        
        <div>
          <Card title={t('shop.order_summary')}>
            <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{t('shop.total')}:</span>
                <strong>${getTotalPrice().toFixed(2)}</strong>
              </div>
            </div>
            <Button variant="success" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
              {t('shop.checkout')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
