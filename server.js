const express = require('express');
const connectDB = require('./config/db');
const cors = require('./config/cors');
const caseRoutes = require('./routes/caseRoutes');
const userRoutes = require('./routes/userRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dentalRecordRoutes = require('./routes/dentalRecordRoutes');

require('dotenv').config();

const app = express();

connectDB();
app.use(cors); // Já funciona porque cors.js exporta o middleware
app.use(express.json());

app.use('/api', caseRoutes);
app.use('/api', userRoutes);
app.use('/api', evidenceRoutes);
app.use('/api', reportRoutes);
app.use('/api', dentalRecordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));