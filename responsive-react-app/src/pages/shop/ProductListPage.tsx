import React, { useEffect, useState } from 'react';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import Grid from '../../components/common/Grid/Grid';
import Spinner from '../../components/common/Spinner/Spinner';
import Button from '../../components/common/Button/Button';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>
      <Grid columns={3}>
        {products.map((product) => (
          <Card key={product.id} title={product.name}>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><small>Category: {product.category}</small></p>
            <Button variant="primary">Add to Cart</Button>
          </Card>
        ))}
      </Grid>
      {products.length === 0 && <p>No products available.</p>}
    </div>
  );
};

export default ProductListPage;
