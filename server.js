const express = require('express');
const connectDB = require('./config/db');
const cors = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Conectar ao banco
connectDB();

// Middleware
app.use(express.json());
app.use(cors);
app.use('/uploads', express.static('public/uploads'));

// Rotas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/evidences', require('./routes/evidenceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/dental-records', require('./routes/dentalRecordRoutes'));

// Tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));