module.exports = (sequelize, DataTypes) => {
    const DetalleReserva = sequelize.define("DetalleReserva", {
      id_detalle_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'ID_DETALLE_RESERVA'
      },
      id_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'ID_RESERVA'
      },
      id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'ID_PRODUCTO'
      },
      cantidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'CANTIDAD'
      },
    }, {
      tableName: "DETALLE_RESERVAS",
      timestamps: false
    });
  
    return DetalleReserva;
  };
  