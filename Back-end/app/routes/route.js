const express = require('express');
const router = express.Router();

const facturaController = require('../controllers/factura.controller');

router.post('/realizarcompra',facturaController.realizarCompra);
router.get('/verfactura/:id_cliente', facturaController.retrieveFacturasByCliente);


module.exports = router;