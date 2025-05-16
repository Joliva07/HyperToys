const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// Ruta de login
router.post('/login', authController.login);

// Ejemplo de ruta protegida
router.get('/protected', authController.verifyToken, (req, res) => {
    res.json({ message: 'Acceso concedido', userId: req.userId });
});


const clienteController = require('../controllers/cliente.controller');

// CRUD Routes
router.post('/crearUsuario', clienteController.createCliente); // Create
//router.get('/verClientes', clienteController.getAllClientes); // Read all
router.get('/cliente/:id', clienteController.getClienteById); // Read one
router.put('/actualizarcliente/:id', clienteController.updateCliente); // Update
router.delete('/eliminarcliente/:id', clienteController.deleteCliente); // Delete

const DetalleReserva = require('../controllers/reservas.controller.js');

// Ruta para realizar la compra
router.post('/reservas', DetalleReserva.realizarReserva);
router.get('/reservas/:id_cliente', DetalleReserva.retrieveReservasByCliente);
router.get('/reservas/:idReserva/detalles', DetalleReserva.getDetallesByReserva);
//router.put('/reservas/:idReserva', DetalleReserva.actualizarReserva);
router.delete('/reservas/:idReserva', DetalleReserva.eliminarReserva);

const listaProductosController = require('../controllers/listaProductos.controller'); 

// Nuevas Rutas GET para Productos
router.get('/productos/all', listaProductosController.getAllProductos);          // GET /clientes/productos
router.get('/productos/:id', listaProductosController.getProductoById); 

const tipoProductoController = require('../controllers/tipoProducto.controller');

// Rutas para Tipos de Producto
router.get('/tipos-producto/all', tipoProductoController.getAllTiposProducto);
router.get('/tipos-producto/:id', tipoProductoController.getTipoProductoById);

const facturaController = require('../controllers/factura.controller');

router.post('/realizarcompra',facturaController.realizarCompra);
router.get('/verfactura/:id_cliente', facturaController.retrieveFacturasByCliente);
router.get('/facturas/:idFactura/detalles', facturaController.getDetallesByFactura);


const pagoController = require('../controllers/pago.controller');
const bodyParser = require('body-parser'); // 👈 Nuevo requerimiento

// 👇 Nuevas Rutas de Pago (Stripe)
router.post('/pagar', pagoController.createPaymentIntent); // Crear intención de pago
router.post('/pagos/webhook', 
  bodyParser.raw({ type: 'application/json' }), // 🔥 Importante para webhook
  pagoController.stripeWebhook
);

module.exports = router;