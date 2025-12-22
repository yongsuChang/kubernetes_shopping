import React, { useState } from 'react';
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
import Sidebar from './components/common/Sidebar/Sidebar';
import { Tabs, Tab } from './components/common/Tabs/Tabs';
import Breadcrumbs from './components/common/Breadcrumbs/Breadcrumbs';
import Pagination from './components/common/Pagination/Pagination';
import Menu from './components/common/Menu/Menu';
import Card from './components/common/Card/Card';
import { Accordion, AccordionItem } from './components/common/Accordion/Accordion';
import Tooltip from './components/common/Tooltip/Tooltip';
import Modal from './components/common/Modal/Modal';
import Alert from './components/common/Alert/Alert';
import ProgressBar from './components/common/ProgressBar/ProgressBar';
import Spinner from './components/common/Spinner/Spinner';
import Avatar from './components/common/Avatar/Avatar';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const sidebarLinks = [
    { label: 'Dashboard', href: '#' },
    { label: 'Profile', href: '#' },
    { label: 'Settings', href: '#' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '#' },
    { label: 'Category', href: '#' },
    { label: 'Current Page', href: '#' },
  ];

  const menuItems = [
    { label: 'Edit', onClick: () => alert('Edit clicked') },
    { label: 'Delete', onClick: () => alert('Delete clicked') },
    { label: 'Settings', onClick: () => alert('Settings clicked') },
  ];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Layout>
      <Navbar title="My Responsive App" links={navbarLinks} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} links={sidebarLinks} />
      <div style={{ padding: '0 20px' }}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px 20px 20px' }}>
        <Button onClick={() => setIsSidebarOpen(true)}>Open Sidebar</Button>
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

        <div style={{ marginTop: '20px' }}>
          <Tabs>
            <Tab label="Tab 1">
              <h3>Content for Tab 1</h3>
              <p>This is the first tab's content.</p>
            </Tab>
            <Tab label="Tab 2">
              <h3>Content for Tab 2</h3>
              <p>This is the second tab's content.</p>
            </Tab>
            <Tab label="Tab 3">
              <h3>Content for Tab 3</h3>
              <p>This is the third tab's content.</p>
            </Tab>
          </Tabs>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        <Menu items={menuItems}>
          <Button variant="secondary">Open Menu</Button>
        </Menu>
        <div style={{ width: '300px', marginTop: '20px' }}>
          <Card title="My Card Title" footer="Card Footer Text">
            <p>This is the content of the card.</p>
            <p>More content here.</p>
          </Card>
        </div>
        <div style={{ width: '500px', marginTop: '20px' }}>
          <Accordion>
            <AccordionItem title="Section 1">
              <p>Content for accordion section 1.</p>
            </AccordionItem>
            <AccordionItem title="Section 2">
              <p>Content for accordion section 2.</p>
            </AccordionItem>
          </Accordion>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Tooltip content="This is a helpful tooltip">
            <span>Hover over me</span>
          </Tooltip>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="My Modal Title">
            <p>This is the content of the modal.</p>
            <p>You can put any React children here.</p>
            <Button onClick={() => setIsModalOpen(false)}>Close Modal</Button>
          </Modal>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Alert message="This is a success alert!" variant="success" onClose={() => console.log('success alert closed')} />
          <Alert message="This is an error alert!" variant="error" />
          <Alert message="This is an info alert!" variant="info" />
          <Alert message="This is a warning alert!" variant="warning" />
        </div>
        <div style={{ width: '400px', marginTop: '20px' }}>
          <ProgressBar progress={75} />
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
          <Spinner size="small" />
          <Spinner />
          <Spinner size="large" color="green" />
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
          <Avatar initials="JD" />
          <Avatar src="https://i.pravatar.cc/150?img=3" alt="User Avatar" size="medium" />
          <Avatar initials="SM" size="large" />
        </div>
      </div>
    </Layout>
  );
}

export default App;
