const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

router.post('/cases', caseController.createCase);       // Create
router.get('/cases', caseController.getCases);          // Read (todos)
router.get('/cases/:id', caseController.getCaseById);   // Read (por ID)
router.put('/cases/:id', caseController.updateCase);    // Update
router.delete('/cases/:id', caseController.deleteCase); // Delete

module.exports = router;