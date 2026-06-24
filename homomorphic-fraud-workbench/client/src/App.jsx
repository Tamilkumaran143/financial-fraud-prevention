import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BanksPage from './pages/BanksPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import FraudAnalysisPage from './pages/FraudAnalysisPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Layout from './layouts/Layout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b3d91' },
    secondary: { main: '#1976d2' },
    background: { default: '#f1f5fb', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="banks" element={<BanksPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="fraud-analysis" element={<FraudAnalysisPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
