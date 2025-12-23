import React, { useEffect, useState } from 'react';
import { adminClient } from '../../api/client';
import Card from '../../components/common/Card/Card';
import { Grid } from '../../components/common/Grid/Grid';
import Spinner from '../../components/common/Spinner/Spinner';
import Alert from '../../components/common/Alert/Alert';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DailyStats {
  date: string;
  count: number;
  amount: number;
}

interface SystemReport {
  totalSales: number;
  totalUsers: number;
  totalVendors: number;
  pendingVendorApprovals: number;
  dailySales: DailyStats[];
  dailyUserRegistrations: DailyStats[];
  dailyVendorRegistrations: DailyStats[];
}

const SystemReport: React.FC = () => {
  const [report, setReport] = useState<SystemReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await adminClient.get('/api/v1/admin/reports/system');
        setReport(response.data);
      } catch (err) {
        console.error('Failed to fetch system report:', err);
        setError('Failed to load system report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error" message={error} />;
  if (!report) return null;

  return (
    <div style={{ padding: '20px' }}>
      <h1>System Report</h1>
      
      <Grid columns={4}>
        <Card title="Total Sales">
          <h2 style={{ color: 'var(--primary-color)' }}>
            ${report.totalSales.toLocaleString()}
          </h2>
        </Card>
        <Card title="Total Users">
          <h2>{report.totalUsers}</h2>
        </Card>
        <Card title="Total Vendors">
          <h2>{report.totalVendors}</h2>
        </Card>
        <Card title="Pending Approvals">
          <h2 style={{ color: report.pendingVendorApprovals > 0 ? 'orange' : 'inherit' }}>
            {report.pendingVendorApprovals}
          </h2>
        </Card>
      </Grid>

      <div style={{ marginTop: '30px' }}>
        <Card title="Daily Sales (Last 30 Days)">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={[...report.dailySales].reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" name="Sales Amount ($)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Grid columns={2}>
          <Card title="User Registrations">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={[...report.dailyUserRegistrations].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Users" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card title="Vendor Registrations">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={[...report.dailyVendorRegistrations].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Vendors" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export default SystemReport;
