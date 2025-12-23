import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shopClient } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Grid } from '../components/common/Grid/Grid';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import Spinner from '../components/common/Spinner/Spinner';
import Badge from '../components/common/Badge/Badge';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
}

const HomePage: React.FC = () => {
  const { email, role, logout } = useAuthStore();
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        // 백엔드에서 최신 상품을 가져오는 API가 있다면 사용, 없으면 전체 상품 중 일부 사용
        const response = await shopClient.get('/api/v1/shop/products');
        // 최근 등록순으로 정렬하거나 상위 6개만 표시
        setLatestProducts(response.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch latest products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section" style={{ backgroundColor: '#f0f2f5', padding: '40px', borderRadius: '10px', marginBottom: '40px' }}>
        <h1>Discover Amazing Products</h1>
        <p>Your one-stop destination for everything you need.</p>
        {!email && (
          <Link to="/login">
            <Button variant="primary" style={{ padding: '10px 30px' }}>Get Started</Button>
          </Link>
        )}
      </section>

      <section className="user-info-section" style={{ marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        {email ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p>Logged in as: <strong>{email}</strong> <Badge variant="info">{role}</Badge></p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {role === 'ROLE_USER' && <Link to="/mypage"><Button variant="secondary">My Page</Button></Link>}
                {role === 'ROLE_SHOP_ADMIN' && <Link to="/vendor"><Button variant="success">Vendor Dashboard</Button></Link>}
                {role === 'ROLE_SUPER_ADMIN' && <Link to="/admin"><Button variant="warning">Admin Dashboard</Button></Link>}
              </div>
            </div>
            <Button onClick={logout} variant="danger">Logout</Button>
          </div>
        ) : (
          <p>Login to enjoy more personalized shopping features.</p>
        )}
      </section>

      <section className="latest-products-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Latest Arrivals</h2>
          <Link to="/products" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>View All →</Link>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Grid columns={3}>
            {latestProducts.map((product) => (
              <Card key={product.id} title={product.name}>
                <p style={{ height: '50px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${product.price}</span>
                  <Link to={`/products`}><Button variant="outline-primary">Details</Button></Link>
                </div>
              </Card>
            ))}
          </Grid>
        )}
        {!loading && latestProducts.length === 0 && <p>No products available yet.</p>}
      </section>
    </div>
  );
};

export default HomePage;
