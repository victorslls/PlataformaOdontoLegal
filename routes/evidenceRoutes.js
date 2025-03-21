const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth(['perito', 'admin']), upload.single('file'), evidenceController.uploadEvidence);

module.exports = router;