const Evidence = require('../models/Evidence');
const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

exports.uploadEvidence = async (req, res) => {
  const { caseId, type, content, annotations } = req.body;
  const file = req.file;

  try {
    const evidence = new Evidence({
      caseId,
      type,
      filePath: file ? file.path : undefined,
      content: type === 'texto' ? content : undefined,
      annotations: annotations ? annotations.split(',') : [],
      uploadedBy: req.user.id,
    });

    await evidence.save();
    await ActivityLog.create({ userId: req.user.id, action: 'Evidência adicionada', details: evidence._id });

    res.status(201).json(evidence);
  } catch (error) {
    logger.error('Erro ao adicionar evidência:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};