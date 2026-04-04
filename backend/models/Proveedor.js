const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proveedor = sequelize.define('Proveedor', {
  ruc: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero_contacto: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'proveedores',
  timestamps: true
});

module.exports = Proveedor;
