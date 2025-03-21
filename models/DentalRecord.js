const mongoose = require('mongoose');

const dentalRecordSchema = new mongoose.Schema({
  patientName: { type: String }, // Pode ser nulo se não identificado
  isIdentified: { type: Boolean, default: false },
  dentalData: {
    odontogram: { type: String }, // Representação do odontograma
    radiographs: [{ type: String }], // Caminhos de radiografias
    notes: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DentalRecord', dentalRecordSchema);