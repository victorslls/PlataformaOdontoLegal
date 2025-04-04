const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Usuário já existe' });

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
    });

    await user.save();
    await ActivityLog.create({ userId: user._id, action: 'Usuário registrado' });

    const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    logger.error('Erro ao registrar usuário:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isActive) return res.status(400).json({ msg: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciais inválidas' });

    const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await ActivityLog.create({ userId: user._id, action: 'Login realizado' });

    res.json({ token });
  } catch (error) {
    logger.error('Erro ao fazer login:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    // Gera um código numérico de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetCode; // Reutilizamos o campo existente
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hora
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Redefinição de Senha',
      text: `Seu código de redefinição de senha é: ${resetCode}. Use-o para redefinir sua senha.`,
    });

    res.json({ msg: 'Código enviado por e-mail' });
  } catch (error) {
    logger.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.resetPassword = async (req, res) => {
  const { code, password } = req.body; // Mudamos de req.params para req.body

  try {
    const user = await User.findOne({
      resetPasswordToken: code, // Agora é o código enviado
      resetPasswordExpire: { $gt: Date.now() }, // Verifica expiração
    });

    if (!user) return res.status(400).json({ msg: 'Código inválido ou expirado' });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined; // Limpa o código
    user.resetPasswordExpire = undefined; // Limpa a expiração
    await user.save();

    res.json({ msg: 'Senha redefinida com sucesso' });
  } catch (error) {
    logger.error('Erro ao redefinir senha:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};


// Logout de usuários
exports.logoutUser = async (req, res) => {
  try {
    // Aqui você pode implementar lógica para invalidar o token, se desejar
    // Exemplo: adicionar token a uma blacklist (opcional)
    res.status(200).json({ msg: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao realizar logout' });
  }
};