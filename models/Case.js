const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Em andamento', 'Finalizado', 'Arquivado'], default: 'Em andamento' },
  type: { type: String, enum: ['Acidente', 'Identificação', 'Exame Criminal'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Case', caseSchema);