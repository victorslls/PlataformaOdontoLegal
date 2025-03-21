const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const Joi = require('joi');

// Schema de validação para registro
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'perito', 'assistente'),
});

// Rotas
router.post('/register', validate(registerSchema), userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgotpassword', userController.forgotPassword);
router.put('/reset/:resetToken', userController.resetPassword);

module.exports = router;