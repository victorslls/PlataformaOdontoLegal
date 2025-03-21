const Evidence = require('../models/Evidence');

exports.uploadEvidence = async (req, res) => {
  try {
    const { caseId, type } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    if (!caseId) return res.status(400).json({ message: 'ID do caso é obrigatório' });
    if (!type || !['Radiografia', 'Odontograma', 'Outro'].includes(type)) {
      return res.status(400).json({ message: 'Tipo inválido. Use: Radiografia, Odontograma ou Outro' });
    }

    const evidence = new Evidence({
      caseId,
      type,
      filePath: file.path,
      fileName: file.filename,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
    });

    await evidence.save();

    res.status(201).json({
      message: 'Evidência enviada com sucesso',
      evidence: {
        id: evidence._id,
        filePath: evidence.filePath,
        fileName: evidence.fileName,
        caseId: evidence.caseId,
      },
    });
  } catch (error) {
    console.error('Erro ao enviar evidência:', error);
    res.status(500).json({ message: 'Erro ao enviar evidência', error: error.message });
  }
};

exports.getEvidencesByCase = async (req, res) => {
  try {
    const { caseId } = req.query;
    if (!caseId) return res.status(400).json({ message: 'ID do caso é obrigatório' });

    const evidences = await Evidence.find({ caseId }).populate('uploadedBy', 'name');
    res.status(200).json(evidences);
  } catch (error) {
    console.error('Erro ao listar evidências:', error);
    res.status(500).json({ message: 'Erro ao listar evidências', error: error.message });
  }
};

exports.updateEvidence = async (req, res) => {
  try {
    const { evidenceId, annotations, type } = req.body;
    if (!evidenceId) {
      return res.status(400).json({ message: 'ID da evidência é obrigatório' });
    }

    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }

    if (evidence.uploadedBy.toString() !== req.user.id && req.user.role !== 'Administrador') {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    if (annotations) evidence.annotations = annotations;
    if (type && ['Radiografia', 'Odontograma', 'Outro'].includes(type)) {
      evidence.type = type;
    } else if (type) {
      return res.status(400).json({ message: 'Tipo inválido' });
    }

    await evidence.save();

    res.status(200).json({
      message: 'Evidência atualizada com sucesso',
      evidence: {
        id: evidence._id,
        filePath: evidence.filePath,
        fileName: evidence.fileName,
        type: evidence.type,
        annotations: evidence.annotations,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar evidência:', error);
    res.status(500).json({ message: 'Erro ao atualizar evidência', error: error.message });
  }
};