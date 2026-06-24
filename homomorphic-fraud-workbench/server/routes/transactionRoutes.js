 
  
  
  const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
  fetchTransactions,
  fetchTransaction,
  addTransaction,
  editTransaction,
  removeTransaction,
  uploadTransactions,
} = require('../controllers/transactionController');
const { verifyRole } = require('../middleware/roleMiddleware');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed')); 
  }
}});

router.get('/', fetchTransactions);
router.get('/:id', fetchTransaction);
router.post(
  '/',
  verifyRole('ADMIN', 'ANALYST', 'BANK_USER'),
  [
    body('bank_id').isInt().withMessage('Bank ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('merchant').notEmpty().withMessage('Merchant is required'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
  addTransaction
);
router.put(
  '/:id',
  verifyRole('ADMIN', 'ANALYST', 'BANK_USER'),
  [
    body('bank_id').isInt().withMessage('Bank ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('merchant').notEmpty().withMessage('Merchant is required'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
  editTransaction
);
router.delete('/:id', verifyRole('ADMIN', 'ANALYST'), removeTransaction);
router.post('/upload', verifyRole('ADMIN', 'ANALYST', 'BANK_USER'), upload.single('file'), uploadTransactions);

module.exports = router;
