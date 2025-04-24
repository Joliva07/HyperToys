// /app/routes/clientes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const listaProductoController = require('../controllers/listaProducto.controller');
const tipoProductoController = require('../controllers/tipoProducto.controller');
const pagoController = require('../controllers/pago.controller');
const bodyParser = require('body-parser'); // 👈 Nuevo requerimiento

// Rutas CRUD para Clientes
router.post('/', clienteController.createCliente);
router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClienteById);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

// Rutas para Productos
router.get('/productos/all', listaProductoController.getAllProductos);
router.get('/productos/:id', listaProductoController.getProductoById);  

// Rutas para Tipos de Producto
router.get('/tipos-producto/all', tipoProductoController.getAllTiposProducto);
router.get('/tipos-producto/:id', tipoProductoController.getTipoProductoById);

// 👇 Nuevas Rutas de Pago (Stripe)
router.post('/pagar', pagoController.createPaymentIntent); // Crear intención de pago
router.post('/pagos/webhook', 
  bodyParser.raw({ type: 'application/json' }), // 🔥 Importante para webhook
  pagoController.stripeWebhook
);

module.exports = router;