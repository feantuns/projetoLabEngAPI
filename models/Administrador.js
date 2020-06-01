const Sequelize = require('sequelize');
const db = require('../config/database');

const Administrador = db.define('administradore', {
  nome: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  senha: {
    type: Sequelize.STRING,
  },
  contato: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Administrador;
