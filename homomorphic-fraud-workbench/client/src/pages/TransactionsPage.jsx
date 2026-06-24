import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TransactionAPI from '../services/transactionService.js';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ bank_id: 1, amount: 0, currency: 'USD', merchant: '', location: '', status: 'PENDING' });
  const [file, setFile] = useState(null);

  const loadTransactions = async () => {
    const data = await TransactionAPI.getTransactions();
    setTransactions(data.transactions || []);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await TransactionAPI.createTransaction(formData);
    setFormData({ bank_id: 1, amount: 0, currency: 'USD', merchant: '', location: '', status: 'PENDING' });
    loadTransactions();
  };

  const handleDelete = async (id) => {
    await TransactionAPI.deleteTransaction(id);
    loadTransactions();
  };

  const handleUpload = async () => {
    if (!file) return;
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    await TransactionAPI.uploadCsv(formDataObj);
    setFile(null);
    loadTransactions();
  };

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-header">
        Transactions
      </Typography>
      <Paper className="chart-card" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          New Transaction
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 16 }}>
          <Box sx={{ display: 'grid', gap: 16 }}>
            <TextField name="bank_id" label="Bank ID" type="number" value={formData.bank_id} onChange={handleChange} fullWidth />
            <TextField name="amount" label="Amount" type="number" value={formData.amount} onChange={handleChange} fullWidth />
            <TextField name="currency" label="Currency" value={formData.currency} onChange={handleChange} fullWidth />
            <TextField name="merchant" label="Merchant" value={formData.merchant} onChange={handleChange} fullWidth />
            <TextField name="location" label="Location" value={formData.location} onChange={handleChange} fullWidth />
            <TextField name="status" label="Status" value={formData.status} onChange={handleChange} fullWidth />
          </Box>
          <Button type="submit" variant="contained">
            Add Transaction
          </Button>
        </Box>
      </Paper>
      <Paper className="chart-card" sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Transactions CSV
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" component="label">
            Choose CSV
            <input hidden type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Button>
          <Typography>{file ? file.name : 'No file selected'}</Typography>
          <Button variant="outlined" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </Box>
      </Paper>
      <Paper className="chart-card">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transaction Records
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Merchant</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.bank_name}</TableCell>
                  <TableCell>{tx.merchant}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.location}</TableCell>
                  <TableCell>{tx.risk_level}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>
                    <Button size="small" color="error" onClick={() => handleDelete(tx.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TransactionsPage;
