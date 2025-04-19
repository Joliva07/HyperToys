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
router.post('/', clienteController.createCliente); // Create
router.get('/', clienteController.getAllClientes); // Read all
router.get('/:id', clienteController.getClienteById); // Read one
router.put('/:id', clienteController.updateCliente); // Update
router.delete('/:id', clienteController.deleteCliente); // Delete

const DetalleReserva = require('../controllers/reservas.controller.js');

// Ruta para realizar la compra
router.post('/reservas', DetalleReserva.realizarReserva);
router.get('/reservas/:id_cliente', DetalleReserva.retrieveReservasByCliente);
router.get('/reservas/:idReserva/detalles', DetalleReserva.getDetallesByReserva);
//router.put('/reservas/:idReserva', DetalleReserva.actualizarReserva);
router.delete('/reservas/:idReserva', DetalleReserva.eliminarReserva);

module.exports = router;