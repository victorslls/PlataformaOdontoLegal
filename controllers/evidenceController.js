const Evidence = require('../models/Evidence');
const ActivityLog = require('../models/ActivityLog');

exports.uploadEvidence = async (req, res) => {
  try {
    const evidence = new Evidence({
      caseId: req.body.caseId,
      filePath: req.file.path,
      type: req.body.type,
      uploadedBy: req.user.id,
    });
    await evidence.save();
    await new ActivityLog({ userId: req.user.id, action: 'Upload de evidência', targetId: evidence._id, targetType: 'Evidence' }).save();
    res.status(201).json(evidence);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer upload', error: error.message });
  }
};

exports.addAnnotation = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    evidence.annotations.push(req.body.annotation);
    await evidence.save();
    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar anotação', error: error.message });
  }
};