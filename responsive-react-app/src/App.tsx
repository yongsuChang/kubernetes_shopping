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
import Badge from './components/common/Badge/Badge';
import { Grid, GridItem } from './components/common/Grid/Grid';
import Container from './components/common/Container/Container';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
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
    <Layout footerContent={<Footer />}>
      <Navbar title="My Responsive App" links={navbarLinks} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} links={sidebarLinks} />
      <div style={{ padding: '0 20px' }}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 0 20px 0' }}>
          <Button onClick={() => setIsSidebarOpen(true)}>Open Sidebar</Button>
          <Header title="Welcome to the Demo Page" />
          <h2>Hello from the new layout!</h2>
          <Grid columns={12} gap="20px">
            <GridItem span={4}>
              <Button variant="primary">Primary</Button>
            </GridItem>
            <GridItem span={4}>
              <Button variant="secondary">Secondary</Button>
            </GridItem>
            <GridItem span={4}>
              <Button variant="danger">Danger</Button>
            </GridItem>
            <GridItem span={6}>
              <ToggleSwitch />
            </GridItem>
            <GridItem span={6}>
              <Dropdown options={dropdownOptions} />
            </GridItem>
            <GridItem span={12}>
              <Input placeholder="This is an input" />
            </GridItem>
            <GridItem span={12}>
              <LabeledInput label="This is a labeled input" placeholder="Enter value" />
            </GridItem>
            <GridItem span={12}>
              <Textarea placeholder="This is a textarea" />
            </GridItem>
            <GridItem span={6}>
              <Checkbox label="Check me" />
            </GridItem>
            <GridItem span={6}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <RadioButton name="radioGroup" label="Option A" />
                <RadioButton name="radioGroup" label="Option B" defaultChecked />
              </div>
            </GridItem>
            <GridItem span={12}>
              <div style={{ padding: '10px 0' }}>
                <Slider min={0} max={100} step={1} defaultValue={50} />
              </div>
            </GridItem>
            <GridItem span={6}>
              <DatePicker />
            </GridItem>
            <GridItem span={6}>
              <FileUpload />
            </GridItem>
            <GridItem span={12}>
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
            </GridItem>
            <GridItem span={12}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </GridItem>
            <GridItem span={6}>
              <Menu items={menuItems}>
                <Button variant="secondary">Open Menu</Button>
              </Menu>
            </GridItem>
            <GridItem span={6}>
              <Card title="My Card Title" footer="Card Footer Text">
                <p>This is the content of the card.</p>
                <p>More content here.</p>
              </Card>
            </GridItem>
            <GridItem span={12}>
              <Accordion>
                <AccordionItem title="Section 1">
                  <p>Content for accordion section 1.</p>
                </AccordionItem>
                <AccordionItem title="Section 2">
                  <p>Content for accordion section 2.</p>
                </AccordionItem>
              </Accordion>
            </GridItem>
            <GridItem span={12}>
              <Tooltip content="This is a helpful tooltip">
                <span>Hover over me</span>
              </Tooltip>
            </GridItem>
            <GridItem span={12}>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="My Modal Title">
                <p>This is the content of the modal.</p>
                <p>You can put any React children here.</p>
                <Button onClick={() => setIsModalOpen(false)}>Close Modal</Button>
              </Modal>
            </GridItem>
            <GridItem span={12}>
              <Alert message="This is a success alert!" variant="success" onClose={() => console.log('success alert closed')} />
              <Alert message="This is an error alert!" variant="error" />
              <Alert message="This is an info alert!" variant="info" />
              <Alert message="This is a warning alert!" variant="warning" />
            </GridItem>
            <GridItem span={12}>
              <ProgressBar progress={75} />
            </GridItem>
            <GridItem span={12}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Spinner size="small" />
                <Spinner />
                <Spinner size="large" color="green" />
              </div>
            </GridItem>
            <GridItem span={12}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Avatar initials="JD" />
                <Avatar src="https://i.pravatar.cc/150?img=3" alt="User Avatar" size="medium" />
                <Avatar initials="SM" size="large" />
              </div>
            </GridItem>
            <GridItem span={12}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Badge>New</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Error</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </GridItem>
          </Grid>
        </div>
      </Container>
    </Layout>
  );
}

export default App;
