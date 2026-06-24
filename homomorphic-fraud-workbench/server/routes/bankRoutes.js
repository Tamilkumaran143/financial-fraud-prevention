const express = require('express');
const { body } = require('express-validator');
const { fetchBanks, fetchBank, addBank, editBank, removeBank } = require('../controllers/bankController');
const { verifyRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', fetchBanks);
router.get('/:id', fetchBank);
router.post(
  '/',
  verifyRole('ADMIN', 'ANALYST'),
  [
    body('bank_name').optional().notEmpty().withMessage('Bank name is required'),
    body('name').optional().notEmpty().withMessage('Bank name is required'),
    body('branch').notEmpty().withMessage('Branch is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().notEmpty().withMessage('Phone is required'),
    body('address').optional().notEmpty().withMessage('Address is required'),
  ],
  addBank
);
router.put(
  '/:id',
  verifyRole('ADMIN', 'ANALYST'),
  [
    body('bank_name').optional().notEmpty().withMessage('Bank name is required'),
    body('name').optional().notEmpty().withMessage('Bank name is required'),
    body('branch').optional().notEmpty().withMessage('Branch is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().notEmpty().withMessage('Phone is required'),
    body('address').optional().notEmpty().withMessage('Address is required'),
  ],
  editBank
);
router.delete('/:id', verifyRole('ADMIN'), removeBank);

module.exports = router;
