const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./app/config/databse.config");
const clientesRoutes = require("./app/routes/router"); // Aquí tienes tus rutas actuales
const pagoController = require("./app/controllers/pago.controller"); // Añadimos controlador de pago

const app = express();

// ✅ Primero, configurar CORS
app.use(cors({
  origin: 'https://hypertoys-front.onrender.com', // tu frontend (React)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware para construir req.rawBody SOLO para Stripe
app.use((req, res, next) => {
  if (req.originalUrl === '/HyperToys/pagos/webhook') {
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      req.rawBody += chunk;
    });
    req.on('end', () => {
      next();
    });
  } else {
    next();
  }
});


// Ruta especial para el webhook de Stripe
// ✅ Ruta especial para Webhook de Stripe (solo esta usa body crudo)
app.post(
  '/HyperToys/pagos/webhook',
  bodyParser.raw({ type: 'application/json' }),
  pagoController.stripeWebhook
);

// Middlewares normales para el resto
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tus rutas normales
app.use("/HyperToys", clientesRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 1522;
db.sequelize.authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error("Error conectando a la BD:", error));
