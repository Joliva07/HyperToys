module.exports = {
    DB_USER: 'USR_PROYECTO',
    DB_PASSWORD: 'password.',
    DB_HOST: 'localhost',
    DB_PORT: '1521',
    DB_NAME: 'HyperToys',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };