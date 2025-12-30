import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shopClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import Alert from '../../components/common/Alert/Alert';
import Modal from '../../components/common/Modal/Modal';
import LabeledInput from '../../components/common/LabeledInput/LabeledInput';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  status: string;
  imageUrl?: string;
}

const ProductManagement: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: 'OTHERS',
    status: 'AVAILABLE',
    imageUrl: ''
  });

  const categories = [
    'ELECTRONICS',
    'FASHION',
    'HOME_KITCHEN',
    'BEAUTY',
    'SPORTS',
    'BOOKS',
    'TOYS',
    'OTHERS'
  ];

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await shopClient.post('/api/v1/shop/images/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: response.data.imageUrl });
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (err) {
      console.error('Upload failed', err);
      setMessage({ type: 'danger', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const fetchVendorAndProducts = async () => {
    setLoading(true);
    try {
      const vendorRes = await shopClient.get('/api/v1/shop-admin/vendors/me');
      const vId = vendorRes.data.id;
      setVendorId(vId);
      
      const productRes = await shopClient.get(`/api/v1/shop-admin/vendors/${vId}/products`);
      setProducts(productRes.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setMessage({ type: 'danger', text: 'Failed to load product data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorAndProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.category,
        status: product.status,
        imageUrl: product.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: 'OTHERS',
        status: 'AVAILABLE',
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;

    try {
      if (editingProduct) {
        await shopClient.put(`/api/v1/shop-admin/vendors/${vendorId}/products/${editingProduct.id}`, formData);
        setMessage({ type: 'success', text: 'Product updated successfully' });
      } else {
        await shopClient.post(`/api/v1/shop-admin/vendors/${vendorId}/products`, formData);
        setMessage({ type: 'success', text: 'Product created successfully' });
      }
      setIsModalOpen(false);
      fetchVendorAndProducts();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to save product' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!vendorId || !window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await shopClient.delete(`/api/v1/shop-admin/vendors/${vendorId}/products/${id}`);
      setMessage({ type: 'success', text: 'Product deleted successfully' });
      fetchVendorAndProducts();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to delete product' });
    }
  };

  if (loading && products.length === 0) return <Spinner />;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{t('vendor.product_mgmt')}</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>+ {t('vendor.add_product')}</Button>
      </div>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

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
            <p>{product.description}</p>
            <p><strong>{t('vendor.price')}:</strong> ${product.price}</p>
            <p><strong>{t('vendor.stock')}:</strong> {product.stockQuantity}</p>
            <p>Status: <Badge variant={product.status === 'AVAILABLE' ? 'success' : 'warning'}>{product.status}</Badge></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Button variant="secondary" onClick={() => handleOpenModal(product)}>{t('common.confirm')}</Button>
              <Button variant="outline-danger" onClick={() => handleDelete(product.id)}>{t('vendor.delete_product')}</Button>
            </div>
          </Card>
        ))}
      </Grid>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? t('vendor.edit_product') : t('vendor.add_product')}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <LabeledInput 
            label="Product Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <LabeledInput 
            label="Description" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <LabeledInput 
              label={t('vendor.price')} 
              type="number" 
              value={formData.price.toString()} 
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} 
              required 
            />
            <LabeledInput 
              label={t('vendor.stock')} 
              type="number" 
              value={formData.stockQuantity.toString()} 
              onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value)})} 
              required 
            />
          </div>
          <div className="labeled-input" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
            <select 
              className="input"
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Image</label>
            {formData.imageUrl && (
              <div style={{ marginBottom: '10px' }}>
                <img 
                  src={`${import.meta.env.VITE_SHOP_API_URL}${formData.imageUrl}`} 
                  alt="Preview" 
                  style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '5px', border: '1px solid #eee' }} 
                />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ width: '100%' }} />
            {uploading && <p style={{ margin: '5px 0', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Uploading image...</p>}
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button type="submit" variant="success" style={{ width: '100%' }}>
              {editingProduct ? t('vendor.edit_product') : t('vendor.add_product')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;