const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Permite ambas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions); // Exporta a função middleware configurada