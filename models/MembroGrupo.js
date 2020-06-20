const Sequelize = require('sequelize');
const db = require('../config/database');

const MembroGrupo = db.define(
  'membro_grupo',
  {
    grupo_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      onDelete: 'CASCADE',
      references: {
        model: 'grupo',
        key: 'id',
      },
    },
    membro_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      onDelete: 'CASCADE',
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
