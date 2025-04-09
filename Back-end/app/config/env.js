module.exports = {
    DB_USER: 'C##HYPER',
    DB_PASSWORD: '1234',
    DB_HOST: 'localhost',
    DB_PORT: '1521',
    DB_NAME: 'xe',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };