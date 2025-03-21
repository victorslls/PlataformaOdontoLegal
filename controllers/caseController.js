const Case = require('../models/Case');

// Criar um caso (Create)
exports.createCase = async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar caso', error: error.message });
  }
};

// Recuperar todos os casos (Read)
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recuperar casos', error: error.message });
  }
};

// Recuperar um caso por ID (Read)
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: 'Caso não encontrado' });
    res.status(200).json(caseData);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recuperar caso', error: error.message });
  }
};

// Atualizar um caso (Update)
exports.updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Retorna o documento atualizado
      runValidators: true, // Valida os dados
    });
    if (!updatedCase) return res.status(404).json({ message: 'Caso não encontrado' });
    res.status(200).json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar caso', error: error.message });
  }
};

// Deletar um caso (Delete)
exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) return res.status(404).json({ message: 'Caso não encontrado' });
    res.status(200).json({ message: 'Caso deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar caso', error: error.message });
  }
};