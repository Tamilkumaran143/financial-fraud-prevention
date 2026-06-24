import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import DashboardAPI from '../services/dashboardService.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({ transactions: [], banks: [] });

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await DashboardAPI.getDashboardMetrics();
      setMetrics(data);
    };
    loadMetrics();
  }, []);

  const fraudCount = metrics.transactions?.filter?.((tx) => tx.risk_level === 'HIGH')?.length || 0;
  const bankCount = metrics.banks?.length || 0;
  const totalCount = metrics.transactions?.length || 0;
  const highRiskCount = fraudCount;

  const fraudTrendData = {
    labels: (metrics.transactions || []).slice(0, 7).map((tx) => new Date(tx.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Fraud Score',
        data: (metrics.transactions || []).slice(0, 7).map((tx) => tx.fraud_score),
        borderColor: '#0b3d91',
        backgroundColor: 'rgba(11,61,145,0.12)',
        tension: 0.4,
      },
    ],
  };

  const monthlyData = {
    labels: (metrics.transactions || []).slice(0, 6).map((tx) => new Date(tx.created_at).toLocaleString('default', { month: 'short' })),
    datasets: [
      {
        label: 'Transactions',
        data: (metrics.transactions || []).slice(0, 6).map((tx, index) => index + 2),
        backgroundColor: '#1976d2',
      },
    ],
  };

  const bankComparisonData = {
    labels: (metrics.banks || []).map((bank) => bank.name),
    datasets: [
      {
        label: 'Transaction Volume',
        data: (metrics.banks || []).map((bank) => (metrics.transactions || []).filter((tx) => tx.bank_id === bank.id).length),
        backgroundColor: '#0b3d91',
      },
    ],
  };

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-header">
        Dashboard
      </Typography>
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="chart-card">
            <Typography variant="subtitle2">Total Transactions</Typography>
            <Typography variant="h4">{totalCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="chart-card">
            <Typography variant="subtitle2">Fraud Transactions</Typography>
            <Typography variant="h4">{fraudCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="chart-card">
            <Typography variant="subtitle2">Total Banks</Typography>
            <Typography variant="h4">{bankCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="chart-card">
            <Typography variant="subtitle2">High Risk Alerts</Typography>
            <Typography variant="h4">{highRiskCount}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Fraud Trend
            </Typography>
            <Line data={fraudTrendData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Transactions
            </Typography>
            <Bar data={monthlyData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className="chart-card">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bank Comparison
            </Typography>
            <Bar data={bankComparisonData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
