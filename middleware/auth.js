const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const auth = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Nenhum token fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Permissão negada" });
      }
      next();
    } catch (error) {
      logger.error("Erro na autenticação:", error);
      res.status(401).json({ msg: "Token inválido" });
    }
  };
};

module.exports = auth;
