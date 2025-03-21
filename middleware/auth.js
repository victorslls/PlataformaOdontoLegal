const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Não autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

exports.checkPermission = (permission) => (req, res, next) => {
  if (!req.user.permissions[permission]) {
    return res.status(403).json({ message: 'Permissão negada' });
  }
  next();
};