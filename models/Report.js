const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  template: { type: String, default: 'default' }, // Modelo pré-definido
  description: { type: String, required: true },
  attachments: [{ type: String }], // Caminhos de anexos
  pdfPath: String, // Caminho do PDF gerado
  signature: { type: String }, // Assinatura digital (ex.: hash ou certificado)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);