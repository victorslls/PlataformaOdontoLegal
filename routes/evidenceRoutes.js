const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/evidences', protect, upload.single('file'), evidenceController.uploadEvidence);
router.put('/evidences/:id/annotate', protect, evidenceController.addAnnotation);

module.exports = router;