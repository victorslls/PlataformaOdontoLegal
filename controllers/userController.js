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

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetUrl = `http://localhost:5000/api/users/reset/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Redefinição de Senha',
      text: `Clique para redefinir sua senha: ${resetUrl}`,
    });

    res.json({ msg: 'E-mail enviado' });
  } catch (error) {
    logger.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: 'Token inválido ou expirado' });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await ActivityLog.create({ userId: user._id, action: 'Senha redefinida' });
    res.json({ msg: 'Senha atualizada com sucesso' });
  } catch (error) {
    logger.error('Erro ao redefinir senha:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};