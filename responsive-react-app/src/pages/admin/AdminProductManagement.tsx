import React, { useEffect, useState } from 'react';
import { adminClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Alert from '../../components/common/Alert/Alert';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  vendorName: string;
  deleted: boolean;
  createdAt: string;
}

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminClient.get('/api/v1/admin/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setMessage({ type: 'danger', text: 'Failed to fetch product data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      await adminClient.patch(`/api/v1/admin/products/${id}/toggle-status`);
      setMessage({ type: 'success', text: 'Product status updated successfully' });
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update product status' });
    }
  };

  if (loading && products.length === 0) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Platform Product Management</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Grid columns={3}>
          {products.map((product) => (
            <Card key={product.id} title={product.name}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>ID: #{product.id} | Vendor: {product.vendorName}</p>
              <p>Category: <Badge variant="info">{product.category}</Badge></p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stockQuantity}</p>
              <p>Status: <Badge variant={product.deleted ? 'danger' : 'success'}>{product.deleted ? 'HIDDEN' : 'VISIBLE'}</Badge></p>
              
              <div style={{ marginTop: '15px' }}>
                <Button 
                  variant={product.deleted ? 'outline-success' : 'outline-danger'} 
                  onClick={() => handleToggleStatus(product.id)}
                >
                  {product.deleted ? 'Show Product' : 'Hide Product'}
                </Button>
              </div>
            </Card>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default AdminProductManagement;
