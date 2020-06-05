const express = require('express');
const router = express.Router();
const Grupo = require('../../models/Grupo');
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

module.exports = router;
