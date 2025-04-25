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
    },
    STRIPE_SECRET_KEY: 'sk_test_51RDv6zBSQYARwyezzfyJOrCpvbNfWWGUPfnWCGiWcW53XMvLPkVUcwFmPmKZtuzmGOYJYnzkLKnUwfBFokTSxVRI00B5YD2Sv8',
    STRIPE_WEBHOOK_SECRET: 'whsec_tu_webhook_secret',
    STRIPE_PUBLIC_KEY: 'pk_test_51RDv6zBSQYARwyeznfVje7jgu6rXEfmFfGiOH58ThsVwaz77zxZvLqyYFCsZoCX6OsaGgErxsEAJxaN9P85OveC500Y1UxYIwd',
    FRONTEND_URL: 'http://localhost:3000'
  };