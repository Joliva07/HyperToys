const env = require('./env.js');
const { Sequelize } = require('sequelize');
const oracledb = require('oracledb');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: 'oracle',
    dialectModule: oracledb,
    pool: {
      max: env.pool.max,
      min: env.pool.min,
      acquire: env.pool.acquire,
      idle: env.pool.idle,
    },
    logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Clientes = require('../models/cliente.model.js')(sequelize, Sequelize);
db.ListaProductos = require('../models/listaProducto.model.js')(sequelize, Sequelize);
db.TipoProductos = require('../models/tipoProducto.model.js')(sequelize, Sequelize);
db.Facturas = require('../models/factura.model.js')(sequelize, Sequelize);

module.exports = db;
