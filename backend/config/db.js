const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    pool: { max: 1, min: 0, idle: 10000, acquire: 30000 },
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      // Deshabilitar prepared statements para compatibilidad con Supabase pooler
      statement_timeout: 30000,
    },
    // Evitar prepared statements en el pooler de Supabase
    query: { raw: false },
    native: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'tarifario_db',
    process.env.DB_USER || 'user_p',
    process.env.DB_PASSWORD || 'password_p',
    { host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false }
  );
}

module.exports = sequelize;