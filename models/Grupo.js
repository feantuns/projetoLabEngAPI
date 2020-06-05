const Sequelize = require('sequelize');
const db = require('../config/database');

const Grupo = db.define('grupo', {
  nome: {
    type: Sequelize.STRING(50),
  },
  modalidade: {
    type: Sequelize.STRING(50),
  },
});

module.exports = Grupo;
