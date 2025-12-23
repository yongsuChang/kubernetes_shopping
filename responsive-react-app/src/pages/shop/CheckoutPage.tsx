import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopClient } from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Alert from '../../components/common/Alert/Alert';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
  
  // New address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'South Korea' });

  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const response = await shopClient.get('/api/v1/shop/members/addresses');
      setAddresses(response.data);
      if (response.data.length > 0) setSelectedAddressId(response.data[0].id);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
      return;
    }
    fetchAddresses();
  }, [items, navigate]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await shopClient.post('/api/v1/shop/members/addresses', newAddress);
      setAddresses([...addresses, response.data]);
      setSelectedAddressId(response.data.id);
      setShowAddressForm(false);
    } catch (err) {
      alert('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select an address');
      return;
    }

    setOrdering(true);
    try {
      // In this simple implementation, we place orders for each item sequentially
      // or just the first item if the API only supports one.
      // Ideally, the backend should support a list of items.
      for (const item of items) {
        await shopClient.post('/api/v1/shop/orders', {
          productId: item.id,
          addressId: selectedAddressId,
          quantity: item.quantity
        });
      }
      
      setMessage({ type: 'success', text: 'Order placed successfully!' });
      clearCart();
      setTimeout(() => navigate('/mypage'), 2000);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to place order' });
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Checkout</h1>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <Card title="Shipping Address">
            {addresses.map((addr) => (
              <div key={addr.id} style={{ marginBottom: '10px', padding: '10px', border: selectedAddressId === addr.id ? '2px solid var(--color-primary)' : '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setSelectedAddressId(addr.id)}>
                <p style={{ margin: 0 }}>{addr.street}, {addr.city}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{addr.state} {addr.zipCode}</p>
              </div>
            ))}
            
            {!showAddressForm ? (
              <Button variant="outline-primary" onClick={() => setShowAddressForm(true)}>+ Add New Address</Button>
            ) : (
              <form onSubmit={handleAddAddress} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <LabeledInput label="Street" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <LabeledInput label="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} required />
                  <LabeledInput label="State" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} required />
                </div>
                <LabeledInput label="Zip Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})} required />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Button type="submit" variant="success">Save Address</Button>
                  <Button variant="outline-secondary" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        <div>
          <Card title="Order Summary">
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <Button variant="success" style={{ width: '100%', marginTop: '20px' }} onClick={handlePlaceOrder} disabled={ordering || !selectedAddressId}>
              {ordering ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
