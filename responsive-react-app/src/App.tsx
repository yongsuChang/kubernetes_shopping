import Layout from './components/layout/Layout';
import Button from './components/common/Button/Button';
import ToggleSwitch from './components/common/ToggleSwitch/ToggleSwitch';
import Dropdown from './components/common/Dropdown/Dropdown';
import Input from './components/common/Input/Input';
import LabeledInput from './components/common/LabeledInput/LabeledInput';
import Textarea from './components/common/Textarea/Textarea';
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <ToggleSwitch />
          <Dropdown options={dropdownOptions} />
        </div>
        <Input placeholder="This is an input" />
        <LabeledInput label="This is a labeled input" placeholder="Enter value" />
        <Textarea placeholder="This is a textarea" />
      </div>
    </Layout>
  );
}

export default App;
