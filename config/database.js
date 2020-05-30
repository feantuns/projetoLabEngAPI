const Sequelize = require('sequelize');
const fs = require('fs');

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/ssl/BaltimoreCyberTrustRoot.crt.pem'),
      },
    },
  }
);
