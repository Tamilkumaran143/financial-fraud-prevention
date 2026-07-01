import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/banks', label: 'Banks', icon: <AccountBalanceIcon /> },
  { path: '/transactions', label: 'Transactions', icon: <ReceiptLongIcon /> },
  { path: '/fraud-analysis', label: 'Fraud Analysis', icon: <AnalyticsIcon /> },
  { path: '/reports', label: 'Reports', icon: <DescriptionIcon /> },
  { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
];

const Sidebar = () => {
  return (
    <Box sx={{ width: 280, minHeight: '100vh', background: 'linear-gradient(180deg, #0f2c63 0%, #2563eb 100%)', color: '#ffffff', py: 2, position: 'sticky', top: 0 }}>
      <Box className="sidebar-brand">Secure Finance AI</Box>
      <Typography variant="overline" sx={{ px: 3, pt: 2, pb: 1, display: 'block', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.18em' }}>
        Workspace
      </Typography>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            component={NavLink}
            to={item.path}
            key={item.path}
            sx={{ color: '#ffffff', '&.active': { backgroundColor: 'rgba(255,255,255,0.16)' } }}
          >
            <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
