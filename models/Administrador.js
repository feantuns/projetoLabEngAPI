const Sequelize = require('sequelize');
const db = require('../config/database');

const Administrador = db.define(
  'administrador',
  {
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
  },
  {
    tableName: 'administradores',
  }
);

module.exports = Administrador;
