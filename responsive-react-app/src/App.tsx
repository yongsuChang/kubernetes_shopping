import Layout from './components/layout/Layout';
import Button from './components/common/Button/Button';
import './App.css';

function App() {
  return (
    <Layout>
      <h2>Hello from the new layout!</h2>
      <div style={{ display: 'flex', gap: '10px', padding: '20px' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </Layout>
  );
}

export default App;
