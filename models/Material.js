const Sequelize = require('sequelize');
const db = require('../config/database');

const Material = db.define(
  'material',
  {
    nome: {
      type: Sequelize.STRING,
    },
    descricao: {
      type: Sequelize.STRING,
    },
    quantidade: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING(10),
    },
  },
  {
    tableName: 'materiais',
  }
);

module.exports = Material;
