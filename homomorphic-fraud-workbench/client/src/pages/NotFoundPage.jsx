import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NotFoundPage = () => (
  <Box className="page-container" sx={{ textAlign: 'center', mt: 10 }}>
    <Typography variant="h3" gutterBottom>
      404 — Page not found
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      The requested page is not available in the Homomorphic Encryption Workbench.
    </Typography>
    <Button variant="contained" component={Link} to="/">
      Go to Dashboard
    </Button>
  </Box>
);

export default NotFoundPage;
