import { useTranslation } from "react-i18next";
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
  vendorName: string;
  imageUrl?: string;
}

const ProductListPage: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMsg, setShowMsg] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const addItem = useCartStore(state => state.addItem);

  const categories = ['ELECTRONICS', 'FASHION', 'HOME_KITCHEN', 'BEAUTY', 'SPORTS', 'BOOKS', 'TOYS', 'OTHERS'];

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
      vendorId: 0
    });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '30px' }}>
      {/* Sidebar Filters */}
      <aside style={{ width: '200px', flexShrink: 0 }}>
        <h3>{t('shop.categories')}</h3>
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
            {t('shop.all_products')}
          </li>
          {categories.map(cat => (
            <li 
              key={cat} 
              style={{ 
                padding: '10px', 
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                color: selectedCategory === cat ? 'var(--color-primary)' : 'inherit',
                fontSize: '0.85rem'
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
          <h2>{selectedCategory || t('shop.all_products')}</h2>
          <div style={{ width: '300px' }}>
            <Input 
              placeholder={t('common.search')} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {showMsg && <Alert variant="success" style={{ marginBottom: '20px' }}>{t('shop.item_added')}</Alert>}

        {loading ? (
          <Spinner />
        ) : (
          <Grid columns={3}>
            {products.map((product) => (
              <Card key={product.id} title={product.name}>
                <div style={{ 
                  backgroundColor: '#f0f0f0', 
                  height: '150px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginBottom: '15px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  {product.imageUrl ? (
                    <img 
                      src={`${import.meta.env.VITE_SHOP_API_URL}${product.imageUrl}`} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ color: '#999' }}>No Image</span>
                  )}
                </div>
                <p style={{ height: '60px', overflow: 'hidden', fontSize: '0.9rem', color: '#666' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>${product.price.toFixed(2)}</span>
                  <Button variant="primary" onClick={() => handleAddToCart(product)}>{t('shop.add_to_cart')}</Button>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <span style={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem' 
                  }}>
                    {product.category}
                  </span>
                </div>
              </Card>
            ))}
          </Grid>
        )}
        {!loading && products.length === 0 && <p>{t('shop.no_products')}</p>}
      </div>
    </div>
  );
};

export default ProductListPage;
