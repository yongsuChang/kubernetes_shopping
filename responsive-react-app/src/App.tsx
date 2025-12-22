import Layout from './components/layout/Layout';
import Button from './components/common/Button/Button';
import ToggleSwitch from './components/common/ToggleSwitch/ToggleSwitch';
import Dropdown from './components/common/Dropdown/Dropdown';
import './App.css';

function App() {
  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <Layout>
      <h2>Hello from the new layout!</h2>
      <div style={{ display: 'flex', gap: '10px', padding: '20px', alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <ToggleSwitch />
        <Dropdown options={dropdownOptions} />
      </div>
    </Layout>
  );
}

export default App;
