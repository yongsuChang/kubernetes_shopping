import React, { useEffect, useState } from 'react';
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
}

const ProductManagement: React.FC = () => {
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
    category: '',
    status: 'AVAILABLE'
  });

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
        status: product.status
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
        status: 'AVAILABLE'
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
        <h2>Product Management</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>+ Add New Product</Button>
      </div>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid columns={3}>
        {products.map((product) => (
          <Card key={product.id} title={product.name}>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stockQuantity}</p>
            <p>Status: <Badge variant={product.status === 'AVAILABLE' ? 'success' : 'warning'}>{product.status}</Badge></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Button variant="secondary" onClick={() => handleOpenModal(product)}>Edit</Button>
              <Button variant="outline-danger" onClick={() => handleDelete(product.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </Grid>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
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
              label="Price" 
              type="number" 
              value={formData.price.toString()} 
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} 
              required 
            />
            <LabeledInput 
              label="Stock" 
              type="number" 
              value={formData.stockQuantity.toString()} 
              onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value)})} 
              required 
            />
          </div>
          <LabeledInput 
            label="Category" 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})} 
          />
          <div style={{ marginTop: '10px' }}>
            <Button type="submit" variant="success" style={{ width: '100%' }}>
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
