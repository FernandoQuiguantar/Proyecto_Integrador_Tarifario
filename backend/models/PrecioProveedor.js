const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Tarifa = require('./Tarifa');

const PrecioProveedor = sequelize.define('PrecioProveedor', {
  tarifa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Tarifa, key: 'id' }
  },
  proveedor_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proveedor_nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'precios_proveedor',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['tarifa_id', 'proveedor_email'] }
  ]
});

// Relaciones
Tarifa.hasMany(PrecioProveedor, { foreignKey: 'tarifa_id', as: 'precios_proveedores' });
PrecioProveedor.belongsTo(Tarifa, { foreignKey: 'tarifa_id' });

module.exports = PrecioProveedor;
