const env = require('./env.js');
const { Sequelize } = require('sequelize');
const oracledb = require('oracledb');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'oracle',
  dialectModule: oracledb,
  dialectOptions: {
    connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=${env.DB_PORT})(host=${env.DB_HOST}))(connect_data=(service_name=${env.DB_NAME}))(security=(ssl_server_cert_dn="${env.DB_SSL}")))`
  },
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
  logging: false, // Opcional: desactiva el logging si no lo necesitas
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Clientes = require('../models/cliente.model.js')(sequelize, Sequelize);
db.Reserva = require('../models/reserva.model.js')(sequelize, Sequelize);
db.DetalleReserva = require('../models/detallereserva.model.js')(sequelize, Sequelize);
db.ListaProductos = require('../models/listaProductos.model.js')(sequelize, Sequelize);
db.Factura = require('../models/factura.model.js')(sequelize,Sequelize);
db.DetalleFactura = require('../models/detalle_factura.model.js')(sequelize,Sequelize)
db.TipoProductos = require('../models/tipoProducto.model.js')(sequelize,Sequelize)

db.DetalleFactura.belongsTo(db.ListaProductos, {
  foreignKey: 'id_producto',
  as: 'ListaProducto'
});

db.DetalleReserva.belongsTo(db.ListaProductos, {
  foreignKey: 'id_producto',
  as: 'ListaProducto'
});


module.exports = db;