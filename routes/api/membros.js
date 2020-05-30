const express = require('express');
const router = express.Router();
const Membro = require('../../models/Membro');

// Get lista de membros
router.get('/', (req, res) =>
  Membro.findAll()
    .then(membros => res.json(membros))
    .catch(err => console.log(err))
);

// Add a membro
router.post('/', (req, res) => {
  let { nome, contato, nome_responsavel, conta_responsavel, status } = req.body;

  Membro.create({
    nome,
    contato,
    nome_responsavel,
    conta_responsavel,
    status,
  })
    .then(membro => res.status(200).json(membro))
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});

module.exports = router;
