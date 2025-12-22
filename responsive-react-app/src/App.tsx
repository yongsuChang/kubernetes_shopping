import Layout from './components/layout/Layout';
import Button from './components/common/Button/Button';
import ToggleSwitch from './components/common/ToggleSwitch/ToggleSwitch';
import './App.css';

function App() {
  return (
    <Layout>
      <h2>Hello from the new layout!</h2>
      <div style={{ display: 'flex', gap: '10px', padding: '20px', alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <ToggleSwitch />
      </div>
    </Layout>
  );
}

export default App;
