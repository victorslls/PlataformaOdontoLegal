const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'Nenhum token fornecido' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Permissão negada' });
      }
      next();
    } catch (error) {
      logger.error('Erro na autenticação:', error);
      res.status(401).json({ msg: 'Token inválido' });
    }
  };
};

module.exports = auth;