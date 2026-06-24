import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import useAuth from '../hooks/useAuth.js';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-header">
        Profile
      </Typography>
      <Paper className="chart-card" sx={{ p: 4 }}>
        <Typography variant="h6">User Information</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Name: </strong> {user?.name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Email: </strong> {user?.email}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Role: </strong> {user?.role}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
