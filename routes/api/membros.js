const express = require('express');
const router = express.Router();
const Membro = require('../../models/Membro');
const MembroGrupo = require('../../models/MembroGrupo');
const { ensureAuthenticated } = require('../../config/auth');

// Get lista de membros ativos
router.get('/', ensureAuthenticated, (req, res) =>
  Membro.findAll({ where: { status: 'Ativo' }, order: [['createdAt', 'DESC']] })
    .then(membros => res.json(membros))
    .catch(err => console.log(err))
);

// Get lista de membros desativados
router.get('/desativados', ensureAuthenticated, (req, res) =>
  Membro.findAll({
    where: { status: 'Desativado' },
    order: [['createdAt', 'DESC']],
  })
    .then(membros => res.json(membros))
    .catch(err => console.log(err))
);

// Add a membro
router.post('/', ensureAuthenticated, (req, res) => {
  let {
    nome,
    contato,
    nome_responsavel,
    conta_responsavel,
    data_nascimento,
    cpf,
  } = req.body;
  let errors = [];

  if (
    !nome ||
    !contato ||
    !nome_responsavel ||
    !conta_responsavel ||
    !data_nascimento ||
    !cpf
  ) {
    errors.push({
      message:
        'Informe um nome, contato, nome de um responsável, data de nascimento, cpf e conta de um responsável',
    });
  }

  Membro.create({
    nome,
    contato,
    nome_responsavel,
    conta_responsavel,
    data_nascimento,
    cpf,
    status: 'Ativo',
  })
    .then(membro => res.status(200).json(membro))
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

// Edit a membro
router.put('/:membroId', ensureAuthenticated, async (req, res) => {
  const { membroId } = req.params;
  const {
    nome,
    contato,
    nome_responsavel,
    conta_responsavel,
    data_nascimento,
    cpf,
    status,
  } = req.body;
  let errors = [];

  if (!membroId) {
    errors.push({ message: 'Informe o id de um membro.' });
  }

  const membroInformado = await Membro.findOne({ where: { id: membroId } });

  if (!membroInformado) {
    errors.push({ message: 'O membro informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const updates = {
    nome: nome || membroInformado.nome,
    contato: contato || membroInformado.contato,
    nome_responsavel: nome_responsavel || membroInformado.nome_responsavel,
    conta_responsavel: conta_responsavel || membroInformado.conta_responsavel,
    data_nascimento: data_nascimento || membroInformado.data_nascimento,
    cpf: cpf || membroInformado.cpf,
    status: status || membroInformado.status,
  };

  await Membro.update({ ...updates }, { where: { id: membroId } });
  res.sendStatus(204);
});

// Delete a membro
router.delete('/:membroId', ensureAuthenticated, async (req, res) => {
  const { membroId } = req.params;
  let errors = [];

  if (!membroId) {
    errors.push({ message: 'Informe o id de um membro.' });
  }

  const membroInformado = await Membro.findOne({ where: { id: membroId } });

  if (!membroInformado) {
    errors.push({ message: 'O membro informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  if (membroInformado.status === 'Ativo') {
    await Membro.update({ status: 'Desativado' }, { where: { id: membroId } });
    return res.sendStatus(204);
  }

  const deleteMembroFromHisGroups = await MembroGrupo.destroy({
    where: {
      membro_id: membroId,
    },
  });

  if (!deleteMembroFromHisGroups) {
    errors.push({ message: 'Erro ao excluir membro de seus grupos.' });
    return res.status(500).json(errors);
  }

  const deleteMembro = await Membro.destroy({
    where: {
      id: membroId,
    },
  });

  if (!deleteMembro) {
    errors.push({ message: 'Erro ao excluir membro.' });
    return res.status(500).json(errors);
  }

  return res.sendStatus(204);
});

module.exports = router;
