const express = require('express');
const router = express.Router();
const Material = require('../../models/Material');
const { ensureAuthenticated } = require('../../config/auth');

// Get list of materials
router.get('/', ensureAuthenticated, (req, res) =>
  Material.findAll({ where: { status: 'Ativo' } })
    .then(materiais => res.json(materiais))
    .catch(err => console.log(err))
);

// Add a material
router.post('/', ensureAuthenticated, (req, res) => {
  let { nome, descricao, quantidade } = req.body;

  Material.create({
    nome,
    descricao,
    quantidade,
    status: 'Ativo',
  })
    .then(grupo => res.status(200).json(grupo))
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

// Edit a material
router.put('/:materialId', ensureAuthenticated, async (req, res) => {
  const { materialId } = req.params;
  const { nome, descricao, quantidade } = req.body;
  let errors = [];

  if (!materialId) {
    errors.push({ message: 'Informe o id de um material.' });
  }

  const materialInformado = await Material.findOne({
    where: { id: materialId },
  });

  if (!materialInformado) {
    errors.push({ message: 'O material informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const updates = {
    nome: nome || materialInformado.nome,
    descricao: descricao || materialInformado.descricao,
    quantidade: quantidade || materialInformado.quantidade,
  };

  await Material.update({ ...updates }, { where: { id: materialId } });
  res.sendStatus(204);
});

// Delete a material
router.delete('/:materialId', ensureAuthenticated, async (req, res) => {
  const { materialId } = req.params;
  let errors = [];

  if (!materialId) {
    errors.push({ message: 'Informe o id de um material.' });
  }

  const materialInformado = await Material.findOne({
    where: { id: materialId },
  });

  if (!materialInformado) {
    errors.push({ message: 'O material informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  await Material.update(
    { status: 'Desativado' },
    { where: { id: materialId } }
  );
  return res.sendStatus(204);
});

module.exports = router;
