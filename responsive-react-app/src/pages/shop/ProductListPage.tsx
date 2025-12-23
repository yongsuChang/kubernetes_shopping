import React, { useEffect, useState, useCallback } from 'react';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Spinner from '../../components/common/Spinner/Spinner';
import Button from '../../components/common/Button/Button';
import { useCartStore } from '../../store/useCartStore';
import Alert from '../../components/common/Alert/Alert';
import Input from '../../components/common/Input/Input';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const addItem = useCartStore(state => state.addItem);

  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Beauty', 'Sports'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/v1/shop/products';
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await shopClient.get(url);
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

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

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '30px' }}>
      {/* Sidebar Filters */}
      <aside style={{ width: '200px', flexShrink: 0 }}>
        <h3>Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li 
            style={{ 
              padding: '10px', 
              cursor: 'pointer', 
              fontWeight: selectedCategory === '' ? 'bold' : 'normal',
              color: selectedCategory === '' ? 'var(--color-primary)' : 'inherit'
            }}
            onClick={() => setSelectedCategory('')}
          >
            All Products
          </li>
          {categories.map(cat => (
            <li 
              key={cat} 
              style={{ 
                padding: '10px', 
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                color: selectedCategory === cat ? 'var(--color-primary)' : 'inherit'
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{selectedCategory || 'All Products'}</h2>
          <div style={{ width: '300px' }}>
            <Input 
              placeholder="Search products..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {showMsg && <Alert variant="success" style={{ marginBottom: '20px' }}>Item added to cart!</Alert>}

        {loading ? (
          <Spinner />
        ) : (
          <Grid columns={3}>
            {products.map((product) => (
              <Card key={product.id} title={product.name}>
                <p style={{ height: '60px', overflow: 'hidden' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${product.price}</span>
                  <Button variant="primary" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                </div>
                <p><small>Category: {product.category}</small></p>
              </Card>
            ))}
          </Grid>
        )}
        {!loading && products.length === 0 && <p>No products found matching your criteria.</p>}
      </div>
    </div>
  );
};

export default ProductListPage;