const express = require('express');
const router = express.Router();
const dentalRecordController = require('../controllers/dentalRecordController');
const { protect } = require('../middleware/auth');

router.post('/dental-records', protect, dentalRecordController.createDentalRecord);
router.get('/dental-records', protect, dentalRecordController.searchDentalRecords);

module.exports = router;