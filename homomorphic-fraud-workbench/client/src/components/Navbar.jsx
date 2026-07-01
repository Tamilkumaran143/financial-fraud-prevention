import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: '18px',
        mb: 2,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#0f2c63', fontWeight: 800 }}>
            Secure Finance AI
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Fraud monitoring workspace
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && (
            <>
              <Button color="inherit" onClick={() => navigate('/profile')} sx={{ color: '#0f2c63', fontWeight: 700 }}>
                <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: '#2563eb' }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                {user.name}
              </Button>
              <Button variant="contained" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
