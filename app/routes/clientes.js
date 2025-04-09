// /app/routes/clientes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const listaProductoController = require('../controllers/listaProducto.controller');  // Nueva importación
const tipoProductoController = require('../controllers/tipoProducto.controller');

// Rutas CRUD para Clientes (existentes)
router.post('/', clienteController.createCliente);
router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClienteById);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);


// Nuevas Rutas GET para Productos
router.get('/productos/all', listaProductoController.getAllProductos);          // GET /clientes/productos
router.get('/productos/:id', listaProductoController.getProductoById);  
router.get('/tipos-producto/all', tipoProductoController.getAllTiposProducto);
router.get('/tipos-producto/:id', tipoProductoController.getTipoProductoById);  

module.exports = router;