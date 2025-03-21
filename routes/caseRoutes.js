const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', auth(['perito', 'admin']), validate(caseController.caseSchema), caseController.createCase);
router.put('/:caseId/status', auth(['perito', 'admin']), caseController.updateCaseStatus);
router.get('/', auth(), caseController.getCases);

module.exports = router;