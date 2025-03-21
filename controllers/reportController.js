const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');

exports.createReport = async (req, res) => {
  try {
    const report = new Report({
      caseId: req.body.caseId,
      description: req.body.description,
      createdBy: req.user.id,
    });
    await report.save();
    await new ActivityLog({ userId: req.user.id, action: 'Criou laudo', targetId: report._id, targetType: 'Report' }).save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar laudo', error: error.message });
  }
};