// /app/models/factura.model.js
module.exports = (sequelize, Sequelize) => {
    const Factura = sequelize.define("FACTURAS", {
      ID_FACTURA: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ID_CLIENTE: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      TOTAL_PAGAR: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ESTADO_PAGO: {
        type: Sequelize.STRING(20),
        defaultValue: 'pendiente'
      }
    }, {
      tableName: "FACTURAS",
      timestamps: false,
      schema: "C##HYPER"
    });
  
    return Factura;
  };