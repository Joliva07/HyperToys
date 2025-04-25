module.exports = (sequelize, Sequelize) => {
    const Factura = sequelize.define('Facturas', {
        id_factura: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'ID_FACTURA'
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'ID_CLIENTE'
        },
        total_pagar: {
            type: Sequelize.FLOAT,
            field: 'TOTAL_PAGAR'
        },
        fecha_factura: {
            type: Sequelize.DATE,
            field: 'FECHA_FACTURA'
        }
    }, {
        tableName: 'FACTURAS',
        timestamps: false
    });
    return Factura;
};
