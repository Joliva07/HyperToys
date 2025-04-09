const express = require('express');
const router = express.Router();

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