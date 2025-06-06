const db = require('../config/databse.config');
const Facturas = db.Factura;
const DetalleFacturas = db.DetalleFactura;
const ListaProductos = db.ListaProductos;

async function getNextFacturaNumber() {
    try {
        // Ejecutar el query para obtener el próximo número de la secuencia
        const result = await db.sequelize.query(`SELECT SEQ_FACTURA.NEXTVAL AS noFactura FROM DUAL`, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return result[0].NOFACTURA;  // Retorna el valor de la secuencia
    } catch (err) {
        console.error(err);
        throw new Error('Error al obtener el número de factura');
    }
}


exports.realizarCompra = async(req, res)=>{
const t = await db.sequelize.transaction();

try {
        const {id_cliente, total_pagar, productos } = req.body;

    // Verificar que todos los campos obligatorios están presentes
    if (!id_cliente || !total_pagar || !productos || productos.length === 0 ) {
        return res.status(400).json({ message: 'Datos incompletos en la solicitud' });
    }

    // Obtener el siguiente número de factura
    const id_factura = await getNextFacturaNumber();

    // Crear la factura
    const nuevaFactura = await Facturas.create({
        id_factura,
        id_cliente,
        total_pagar,
        //serieFactura: 'A',  // Puedes ajustar la serie de factura
        fecha_factura: new Date()
        
        //idEmpleado,
        //idSucursal,
        
    }, { transaction: t });

    // Contador autoincrementable para los detalles
    let idDetalleIncremental = 1;

    // Crear los detalles de la factura
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];

        // Validar que los datos del producto estén completos
        if (!producto.id_producto || !producto.cantidad) {
            throw new Error('Datos incompletos en los productos');
        }

        await DetalleFacturas.create({
            id_detalle_factura: idDetalleIncremental++,  // Incrementa el valor de idDetalle
            id_factura: nuevaFactura.id_factura,
            //serieFactura: nuevaFactura.serieFactura,
            id_producto: producto.id_producto,
            //noReserva: producto.noReserva || null,
            cantidad: producto.cantidad
            //fechaCompra: new Date(),
            //lugarCompra: producto.lugarCompra
        }, { transaction: t });
    }

    // Confirmar la transacción
    await t.commit();

    res.status(201).json({ message: 'Compra realizada con éxito', factura: nuevaFactura });
} catch (error) {
    // Hacer rollback en caso de error
    await t.rollback();
    console.error('Error en la compra:', error);
    res.status(500).json({ message: 'Error al realizar la compra', error });
}

};


exports.retrieveFacturasByCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;

        // Obtener facturas del cliente
        const facturas = await Facturas.findAll({
            where: { id_cliente },
            attributes: ['id_factura', 'fecha_factura', 'total_pagar']
        });

        if (facturas.length === 0) {
            return res.status(404).json({
                message: `No se encontraron facturas para el cliente con ID ${id_cliente}.`
            });
        }

        // Extraer los IDs de factura
        const idsFactura = facturas.map(f => f.id_factura);

        // Obtener detalles de todas las facturas en una sola consulta
        const detalles = await DetalleFacturas.findAll({
            where: {
                id_factura: idsFactura // Sequelize permite usar un array aquí
            },
            attributes: ['id_detalle_factura', 'id_factura', 'id_producto', 'cantidad']
        });

        // Combinar detalles con las facturas
        const facturasConDetalles = facturas.map(factura => {
            const detallesDeEstaFactura = detalles.filter(
                detalle => detalle.id_factura === factura.id_factura
            );
            return {
                ...factura.toJSON(),
                detalles: detallesDeEstaFactura
            };
        });

        // Responder con todo
        res.status(200).json({
            message: `Facturas para el cliente con ID ${id_cliente} obtenidas exitosamente.`,
            facturas: facturasConDetalles
        });

    } catch (error) {
        console.error("Error al obtener las facturas:", error);
        res.status(500).json({
            message: "Error al obtener las facturas",
            error: error.message
        });
    }
};

exports.getDetallesByFactura = async (req, res) => {
    const { idFactura } = req.params;

    if (isNaN(idFactura)) {
        return res.status(400).json({
            message: "El ID de la factura debe ser un valor numérico válido."
        });
    }

    const idFacturaNum = parseInt(idFactura, 10);

    try {
        const detalles = await DetalleFacturas.findAll({
            where: { id_factura: idFacturaNum },
            include: [{
                model: ListaProductos,
                as: 'ListaProducto', // 👈 Modelo correcto
                attributes: ['NOMBRE', 'PRECIO'], // 👈 Campos reales en Oracle
                required: true
            }]
        });

        if (detalles.length === 0) {
            return res.status(404).json({
                message: `No se encontraron detalles para la factura con ID ${idFacturaNum}.`
            });
        }

        const detallesFormateados = detalles.map(det => ({
            nombre_producto: det.ListaProducto.NOMBRE,
            precio_unitario: det.ListaProducto.PRECIO,
            cantidad: det.cantidad
        }));

        res.status(200).json({
            message: `Detalles de la factura con ID ${idFacturaNum} obtenidos exitosamente.`,
            detalles: detallesFormateados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Ocurrió un error al obtener los detalles de la factura.",
            error: error.message
        });
    }
};

exports.getNextFacturaNumber = getNextFacturaNumber;
