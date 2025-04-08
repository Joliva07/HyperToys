const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

// CRUD Routes
router.post('/', clienteController.createCliente); // Create
router.get('/', clienteController.getAllClientes); // Read all
router.get('/:id', clienteController.getClienteById); // Read one
router.put('/:id', clienteController.updateCliente); // Update
router.delete('/:id', clienteController.deleteCliente); // Delete

module.exports = router;