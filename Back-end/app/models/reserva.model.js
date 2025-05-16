module.exports = (sequelize, DataTypes) => {
    const Reserva = sequelize.define("Reserva", {
      id_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'ID_RESERVA'
      },
      id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_CLIENTE'
      },
      fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'FECHA_RESERVA'
      },
      fecha_limite_pago: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'FECHA_LIMITE_PAGO'
      },
    }, {
      tableName: "RESERVAS",
      timestamps: false
    });
  
    return Reserva;
  };