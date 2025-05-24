module.exports = (sequelize, Sequelize) => {
    const DetalleFactura = sequelize.define('DetalleFacturas', {
        id_detalle_factura: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'ID_DETALLE_FACTURA'
        },
        id_factura: {
            type: Sequelize.INTEGER,
            field: 'ID_FACTURA'
        },
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'ID_PRODUCTO'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            field: 'CANTIDAD'
        },
        id_reserva: {
            type: Sequelize.INTEGER,
            field: 'ID_RESERVA'
        }
    }, {
        tableName: 'DETALLE_FACTURAS',
        timestamps: false
    });

    return DetalleFactura;
};
