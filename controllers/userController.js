const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função para sanitizar entrada
const sanitize = (input) => input.replace(/[^\w\s@.-]/gi, '');

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const sanitizedEmail = sanitize(email);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email: sanitizedEmail, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar', error: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      console.log(`Tentativa de login falhou para ${req.body.email}`);
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, permissions: user.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`Login bem-sucedido para ${req.body.email}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};