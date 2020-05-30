const Sequelize = require('sequelize');
const db = require('../config/database');

const Membro = db.define('membro', {
  nome: {
    type: Sequelize.STRING,
  },
  contato: {
    type: Sequelize.INTEGER,
  },
  nome_responsavel: {
    type: Sequelize.STRING,
  },
  conta_responsavel: {
    type: Sequelize.INTEGER,
  },
  status: {
    type: Sequelize.STRING,
  },
});

module.exports = Membro;
