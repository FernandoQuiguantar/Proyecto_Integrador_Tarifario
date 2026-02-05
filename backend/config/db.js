const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tarifario_db', 'user_p', 'password_p', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;