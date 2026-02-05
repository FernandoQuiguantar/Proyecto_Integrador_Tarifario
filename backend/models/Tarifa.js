const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Tarifa = sequelize.define('Tarifa', {
  // Nombre del material/pieza
  pieza: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  ancho: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0 
  },
  alto: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0 
  },
  profundidad: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0 
  },
  unidad: { 
    type: DataTypes.STRING, 
    defaultValue: 'cm' 
  },
  precio_base: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  categoria: { 
    type: DataTypes.STRING, 
    defaultValue: 'Digital' 
  },
  imagen_url: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  }
}, {
  // Esto asegura que la tabla se llame 'tarifas' en tu base de datos de Docker
  tableName: 'tarifas',
  timestamps: true // Crea automáticamente las columnas createdAt y updatedAt
});

module.exports = Tarifa;