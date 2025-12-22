import Layout from './components/layout/Layout';
import Button from './components/common/Button/Button';
import ToggleSwitch from './components/common/ToggleSwitch/ToggleSwitch';
import Dropdown from './components/common/Dropdown/Dropdown';
import Input from './components/common/Input/Input';
import LabeledInput from './components/common/LabeledInput/LabeledInput';
import Textarea from './components/common/Textarea/Textarea';
import Checkbox from './components/common/Checkbox/Checkbox';
import RadioButton from './components/common/RadioButton/RadioButton';
import Slider from './components/common/Slider/Slider';
import DatePicker from './components/common/DatePicker/DatePicker';
import FileUpload from './components/common/FileUpload/FileUpload';
import Navbar from './components/common/Navbar/Navbar';
import './App.css';

function App() {
  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const navbarLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <Layout>
      <Navbar title="My Responsive App" links={navbarLinks} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
        <h2>Hello from the new layout!</h2>
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
        <Checkbox label="Check me" />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <RadioButton name="radioGroup" label="Option A" />
          <RadioButton name="radioGroup" label="Option B" defaultChecked />
          <RadioButton name="radioGroup" label="Option C" />
        </div>
        <div style={{ width: '300px', padding: '10px 0' }}>
          <Slider min={0} max={100} step={1} defaultValue={50} />
        </div>
        <DatePicker />
        <FileUpload />
      </div>
    </Layout>
  );
}

export default App;
