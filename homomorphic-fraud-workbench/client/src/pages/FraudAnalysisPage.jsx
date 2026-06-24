import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TransactionAPI from '../services/transactionService.js';

const FraudAnalysisPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await TransactionAPI.getTransactions();
      setTransactions(data.transactions || []);
    };
    load();
  }, []);

  const riskCounts = transactions.reduce(
    (acc, tx) => {
      acc[tx.risk_level] = (acc[tx.risk_level] || 0) + 1;
      return acc;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 }
  );

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-header">
        Fraud Analysis
      </Typography>
      <Box className="stats-grid">
        <Paper className="chart-card">
          <Typography variant="subtitle2">Low Risk</Typography>
          <Typography variant="h4">{riskCounts.LOW}</Typography>
        </Paper>
        <Paper className="chart-card">
          <Typography variant="subtitle2">Medium Risk</Typography>
          <Typography variant="h4">{riskCounts.MEDIUM}</Typography>
        </Paper>
        <Paper className="chart-card">
          <Typography variant="subtitle2">High Risk</Typography>
          <Typography variant="h4">{riskCounts.HIGH}</Typography>
        </Paper>
      </Box>
      <Paper className="chart-card" sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Fraud Summary Table
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction</TableCell>
                <TableCell>Merchant</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.merchant}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.location}</TableCell>
                  <TableCell>{tx.risk_level}</TableCell>
                  <TableCell>{tx.fraud_score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FraudAnalysisPage;
