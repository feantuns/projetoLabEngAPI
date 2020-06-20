const express = require('express');
const router = express.Router();
const Grupo = require('../../models/Grupo');
const MembroGrupo = require('../../models/MembroGrupo');
const { ensureAuthenticated } = require('../../config/auth');

// Get list of groups
router.get('/', ensureAuthenticated, (req, res) =>
  Grupo.findAll()
    .then(grupos => res.json(grupos))
    .catch(err => console.log(err))
);

// Add a group
router.post('/', ensureAuthenticated, (req, res) => {
  let { nome, modalidade } = req.body;

  Grupo.create({
    nome,
    modalidade,
  })
    .then(grupo => res.status(200).json(grupo))
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

// Edit a grupo
router.put('/:grupoId', ensureAuthenticated, async (req, res) => {
  const { grupoId } = req.params;
  const { nome, modalidade } = req.body;
  let errors = [];

  if (!grupoId) {
    errors.push({ message: 'Informe o id de um grupo.' });
  }

  const grupoInformado = await Grupo.findOne({ where: { id: grupoId } });

  if (!grupoInformado) {
    errors.push({ message: 'O grupo informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const updates = {
    nome: nome || grupoInformado.nome,
    modalidade: modalidade || grupoInformado.modalidade,
  };

  await Grupo.update({ ...updates }, { where: { id: grupoId } });
  res.sendStatus(204);
});

// Delete a grupo
router.delete('/:grupoId', ensureAuthenticated, async (req, res) => {
  const { grupoId } = req.params;
  let errors = [];

  if (!grupoId) {
    errors.push({ message: 'Informe o id de um grupo.' });
  }

  const grupoInformado = await Grupo.findOne({ where: { id: grupoId } });

  if (!grupoInformado) {
    errors.push({ message: 'O grupo informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const membrosGrupo = await MembroGrupo.findAll({
    where: { grupo_id: grupoId },
  });

  if (membrosGrupo.length > 0) {
    const deleteConnectionsWithMembros = await MembroGrupo.destroy({
      where: {
        grupo_id: grupoId,
      },
    });

    if (!deleteConnectionsWithMembros) {
      errors.push({ message: 'Erro ao excluir conexões de grupo com membro.' });
      return res.status(500).json(errors);
    }
  }

  const deleteGrupo = await Grupo.destroy({
    where: {
      id: grupoId,
    },
  });

  if (!deleteGrupo) {
    errors.push({ message: 'Erro ao excluir grupo.' });
    return res.status(500).json(errors);
  }

  return res.sendStatus(204);
});

module.exports = router;
