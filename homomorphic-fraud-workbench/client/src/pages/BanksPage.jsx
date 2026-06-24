import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import BankAPI from '../services/bankService.js';

const BanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [selection, setSelection] = useState({ name: '', country: '', branch: '', manager: '' });
  const [editingId, setEditingId] = useState(null);

  const loadBanks = async () => {
    const response = await BankAPI.getBanks();
    setBanks(response.banks || []);
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const handleChange = (event) => {
    setSelection({ ...selection, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await BankAPI.updateBank(editingId, selection);
    } else {
      await BankAPI.createBank(selection);
    }
    setSelection({ name: '', country: '', branch: '', manager: '' });
    setEditingId(null);
    loadBanks();
  };

  const handleEdit = (bank) => {
    setSelection(bank);
    setEditingId(bank.id);
  };

  const handleDelete = async (id) => {
    await BankAPI.deleteBank(id);
    loadBanks();
  };

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-header">
        Bank Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6" sx={{ mb: 2 }}>
              {editingId ? 'Edit Bank' : 'Add Bank'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Bank Name" name="name" value={selection.name} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Country" name="country" value={selection.country} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Branch" name="branch" value={selection.branch} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Manager" name="manager" value={selection.manager} onChange={handleChange} sx={{ mb: 2 }} />
              <Button type="submit" variant="contained">
                {editingId ? 'Update Bank' : 'Create Bank'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bank List
            </Typography>
            {banks.map((bank) => (
              <Paper key={bank.id} sx={{ p: 2, mb: 2, backgroundColor: '#f8fafc' }}>
                <Typography variant="subtitle1">{bank.name}</Typography>
                <Typography variant="body2">{bank.branch}, {bank.country}</Typography>
                <Typography variant="body2">Manager: {bank.manager}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEdit(bank)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" variant="contained" onClick={() => handleDelete(bank.id)}>
                    Delete
                  </Button>
                </Box>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BanksPage;
