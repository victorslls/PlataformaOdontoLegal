const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  filePath: { type: String, required: true }, // Caminho do arquivo (ex.: radiografia)
  type: { type: String, enum: ['Radiografia', 'Odontograma', 'Outro'], required: true },
  annotations: [{ x: Number, y: Number, note: String }], // Marcações na imagem
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evidence', evidenceSchema);