// const env = require('./env.js');
// const Sequelize = require('sequelize');
// const oracledb = require('oracledb');

// // const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
// //     host: env.DB_HOST,
// //     dialect: 'oracle',
// //     dialectModule: oracledb,
// //     dialectOptions: {
// //       connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=${env.DB_PORT})(host=${env.DB_HOST}))(connect_data=(service_name=${env.DB_NAME}))(security=(ssl_server_dn_match=yes)))`
// //     },
// //     pool: {
// //       max: env.pool.max,
// //       min: env.pool.min,
// //       acquire: env.pool.acquire,
// //       idle: env.pool.idle,
// //     },
// //     logging: false,
// //   });

// const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
//     host: env.DB_HOST,
//     dialect: 'oracle',
//     dialectModule: oracledb,
//     pool: {
//       max: env.pool.max,
//       min: env.pool.min,
//       acquire: env.pool.acquire,
//       idle: env.pool.idle,
//     },
//     logging: false,
//   });

//   const db = {};



//   module.exports = db;


const env = require('./env.js');
const Sequelize = require('sequelize');
const oracledb = require('oracledb');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: 'localhost', // Cambia esto a 'localhost' para una conexión local
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

module.exports = db;