import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

const Layout = () => {
  return (
    <Box className="layout-root">
      <Sidebar />
      <Box className="content-area">
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
