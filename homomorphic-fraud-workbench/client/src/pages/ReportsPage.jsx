import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ReportAPI from '../services/reportService.js';

const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const data = await ReportAPI.getFraudSummary();
    setReport(data);
    setLoading(false);
  };

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-header">
        Reports
      </Typography>
      <Paper className="chart-card" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Fraud Summary PDF
        </Typography>
        <Button variant="contained" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate PDF Report'}
        </Button>
        {report && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">Report created: {report.file}</Typography>
            <Typography variant="body2">Path: {report.path}</Typography>
          </Box>
        )}
      </Paper>
      <Paper className="chart-card" sx={{ p: 3 }}>
        <Typography variant="subtitle1">Note</Typography>
        <Typography variant="body2">
          Generated report files are created on the server and are available in the server/reports folder.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
