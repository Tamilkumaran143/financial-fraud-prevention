const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bankRoutes = require('./routes/bankRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/banks', verifyToken, bankRoutes);
app.use('/api/transactions', verifyToken, transactionRoutes);
app.use('/api/reports', verifyToken, reportRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Homomorphic Fraud Workbench backend is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
