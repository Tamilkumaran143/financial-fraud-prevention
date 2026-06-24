import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
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
    <Box sx={{ width: 260, bgcolor: '#082b66', color: '#ffffff', minHeight: '100vh' }}>
      <Box className="sidebar-brand">Secure Finance AI</Box>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            component={NavLink}
            to={item.path}
            key={item.path}
            sx={{ color: '#ffffff', '&.active': { backgroundColor: 'rgba(255,255,255,0.08)' } }}
          >
            <ListItemIcon sx={{ color: '#ffffff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
