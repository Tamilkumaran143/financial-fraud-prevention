const express = require('express');
const { fraudSummaryReport } = require('../controllers/reportController');
const { verifyRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/fraud-summary', verifyRole('ADMIN', 'ANALYST'), fraudSummaryReport);

module.exports = router;
