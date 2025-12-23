import React, { useEffect, useState } from 'react';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Spinner from '../../components/common/Spinner/Spinner';
import Button from '../../components/common/Button/Button';
import { useCartStore } from '../../store/useCartStore';
import Alert from '../../components/common/Alert/Alert';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor?: { id: number };
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMsg, setShowMsg] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await shopClient.get('/api/v1/shop/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      vendorId: product.vendor?.id || 0
    });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products</h2>
        {showMsg && <Alert variant="success">Item added to cart!</Alert>}
      </div>
      <Grid columns={3}>
        {products.map((product) => (
          <Card key={product.id} title={product.name}>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><small>Category: {product.category}</small></p>
            <Button variant="primary" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
          </Card>
        ))}
      </Grid>
      {products.length === 0 && <p>No products available.</p>}
    </div>
  );
};

export default ProductListPage;
