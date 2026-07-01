import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { register as registerUser } from '../services/authService.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'New Analyst',
    email: 'newuser@fraudworkbench.local',
    password: 'Password123',
    role: 'ANALYST',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box className="auth-shell">
      <Container component="main" maxWidth="sm">
        <Box className="auth-card">
          <Avatar sx={{ m: '0 auto', bgcolor: '#2563eb' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" align="center" sx={{ mt: 2, mb: 1 }}>
            Create your workspace
          </Typography>
          <Typography variant="body2" align="center" sx={{ color: '#64748b', mb: 3 }}>
            Start collaborating on fraud risk monitoring in minutes.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              select
              fullWidth
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="ANALYST">ANALYST</option>
              <option value="BANK_USER">BANK_USER</option>
            </TextField>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Register
            </Button>
            <Typography variant="body2" align="center">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
