const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const MembroGrupo = require('../../models/MembroGrupo');
const Membro = require('../../models/Membro');
const Grupo = require('../../models/Grupo');
const { ensureAuthenticated } = require('../../config/auth');

// atributos que devem ser retornados nas buscas na tabela membro_grupo
const attributes = ['grupo_id', 'membro_id'];

// Get list of members of a group
router.get('/:grupoId', ensureAuthenticated, (req, res) => {
  const { grupoId } = req.params;

  MembroGrupo.findAll({
    attributes,
    where: { grupo_id: grupoId },
  })
    .then(membrosGrupos => {
      const membrosIds = membrosGrupos.map(
        membroGrupo => membroGrupo.membro_id
      );
      if (membrosIds.length > 0) {
        Membro.findAll({
          where: {
            id: {
              [Op.or]: membrosIds,
            },
          },
        })
          .then(membros => res.json(membros))
          .catch(err => console.log(err));
      } else {
        return res.json([]);
      }
    })
    .catch(err => console.log(err));
});

// Add member to a group
router.post('/:grupoId/:membroId', ensureAuthenticated, async (req, res) => {
  const { grupoId, membroId } = req.params;
  let errors = [];

  if (!grupoId || !membroId) {
    errors.push({ message: 'Informe o id de um grupo e o id de um membro.' });
  }

  // Check if grupoId and membroId are valid
  const grupoInformado = await Grupo.findOne({ where: { id: grupoId } });

  if (!grupoInformado) {
    errors.push({ message: 'O grupo informado não existe.' });
  }

  const membroInformado = await Membro.findOne({ where: { id: membroId } });

  if (!membroInformado) {
    errors.push({ message: 'O membro informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  // Check if member is already in group
  MembroGrupo.findOne({
    attributes,
    where: { grupo_id: grupoId, membro_id: membroId },
  })
    .then(membroGrupo => {
      if (membroGrupo) {
        errors.push({ message: 'O membro já faz parte do grupo.' });
        return res.status(400).json(errors);
      }

      MembroGrupo.create({
        grupo_id: parseInt(grupoId),
        membro_id: parseInt(membroId),
      })
        .then(() => {
          MembroGrupo.findAll({
            attributes,
            where: { grupo_id: grupoId },
          })
            .then(membrosGrupos => {
              const membrosIds = membrosGrupos.map(
                membroGrupo => membroGrupo.membro_id
              );
              Membro.findAll({
                where: {
                  id: {
                    [Op.or]: membrosIds,
                  },
                },
              })
                .then(membros => res.json(membros))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          console.log(err);
          return res.sendStatus(500);
        });
    })
    .catch(err => console.log(err));
});

// Remove member of a group
router.delete('/:grupoId/:membroId', ensureAuthenticated, async (req, res) => {
  const { grupoId, membroId } = req.params;
  let errors = [];

  if (!grupoId || !membroId) {
    errors.push({ message: 'Informe o id de um grupo e o id de um membro.' });
  }

  // Check if grupoId and membroId are valid
  const grupoInformado = await Grupo.findOne({ where: { id: grupoId } });

  if (!grupoInformado) {
    errors.push({ message: 'O grupo informado não existe.' });
  }

  const membroInformado = await Membro.findOne({ where: { id: membroId } });

  if (!membroInformado) {
    errors.push({ message: 'O membro informado não existe.' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const membroGrupo = await MembroGrupo.findOne({
    attributes,
    where: { grupo_id: grupoId, membro_id: membroId },
  });

  console.log(membroGrupo);

  if (!membroGrupo) {
    errors.push({ message: 'O membro não faz parte do grupo.' });
    return res.status(400).json(errors);
  }

  const deleteMembro = await MembroGrupo.destroy({
    where: {
      [Op.and]: [{ membro_id: membroId }, { grupo_id: grupoId }],
    },
  });

  if (!deleteMembro) {
    errors.push({ message: 'Erro ao remover membro do grupo.' });
    return res.status(500).json(errors);
  }

  return res.sendStatus(204);
});

module.exports = router;
