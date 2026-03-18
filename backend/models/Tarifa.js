const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tarifa = sequelize.define('Tarifa', {
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  pieza: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cotizacion_tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Mantenimiento'
  },
  descripcion_material: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medida: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  unidad: {
    type: DataTypes.STRING,
    defaultValue: 'cm'
  },
  cantidad: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  categoria: {
    type: DataTypes.STRING,
    defaultValue: 'Elemento iluminado'
  },
  centro_comercial: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  imagen_url: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tarifas',
  timestamps: true
});

module.exports = Tarifa;
