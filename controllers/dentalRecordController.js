const DentalRecord = require('../models/DentalRecord');

exports.createDentalRecord = async (req, res) => {
  try {
    const record = new DentalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar registro', error: error.message });
  }
};

exports.searchDentalRecords = async (req, res) => {
  try {
    const records = await DentalRecord.find({ 'dentalData.notes': { $regex: req.query.search, $options: 'i' } });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar registros', error: error.message });
  }
};