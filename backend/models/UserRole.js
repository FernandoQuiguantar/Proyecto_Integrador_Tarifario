const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserRole = sequelize.define('UserRole', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'visor',
    validate: { isIn: [['admin', 'editor', 'visor']] },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'user_roles',
  timestamps: true,
});

module.exports = UserRole;
