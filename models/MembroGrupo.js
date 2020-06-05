const Sequelize = require('sequelize');
const db = require('../config/database');
const Grupo = require('./Grupo');
const Membro = require('./Membro');

const MembroGrupo = db.define(
  'membro_grupo',
  {
    grupo_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'grupo',
        key: 'id',
      },
    },
    membro_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'membro',
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = MembroGrupo;
