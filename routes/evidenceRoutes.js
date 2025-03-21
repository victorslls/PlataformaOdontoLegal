const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/evidences', protect, upload.single('file'), evidenceController.uploadEvidence);
router.get('/evidences', protect, evidenceController.getEvidencesByCase);
router.put('/evidences/:id', protect, evidenceController.updateEvidence); // Ajuste para usar ID

module.exports = router;