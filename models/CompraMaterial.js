const Sequelize = require('sequelize');
const db = require('../config/database');

const CompraMaterial = db.define(
  'compra_material',
  {
    material_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'material',
        key: 'id',
      },
    },
    admin_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'administrador',
        key: 'id',
      },
    },
    fornecedor: Sequelize.STRING(50),
    valor: Sequelize.STRING(50),
    quantidade: Sequelize.INTEGER,
    data: Sequelize.DATE,
  },
  {
    tableName: 'compra_material',
  }
);

module.exports = CompraMaterial;
