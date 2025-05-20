module.exports = {
    DB_USER: 'HYPER',
    DB_PASSWORD: 'Hyp3rT0ys_2025',
    DB_SSL:'CN=adb.mx-monterrey-1.oraclecloud.com, O=Oracle Corporation, L=Redwood City, ST=California, C=US',
    DB_HOST: 'adb.mx-monterrey-1.oraclecloud.com',  // Cambia Pandnaceous por 127.0.0.1 para asegurar la conexión local
    DB_PORT: '1522',
    DB_NAME: 'g412e364b6296c0_hypertoysdb_low.adb.oraclecloud.com',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    STRIPE_SECRET_KEY: 'sk_test_51RDv6zBSQYARwyezzfyJOrCpvbNfWWGUPfnWCGiWcW53XMvLPkVUcwFmPmKZtuzmGOYJYnzkLKnUwfBFokTSxVRI00B5YD2Sv8',
    STRIPE_WEBHOOK_SECRET: 'whsec_tu_webhook_secret',
    STRIPE_PUBLIC_KEY: 'pk_test_51RDv6zBSQYARwyeznfVje7jgu6rXEfmFfGiOH58ThsVwaz77zxZvLqyYFCsZoCX6OsaGgErxsEAJxaN9P85OveC500Y1UxYIwd',
    FRONTEND_URL: 'https://hypertoys-front.onrender.com'
  };