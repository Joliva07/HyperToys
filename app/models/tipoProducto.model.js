// /app/models/tipoProducto.model.js
module.exports = (sequelize, Sequelize) => {
    const TipoProducto = sequelize.define("TIPOS_PRODUCTOS", {
      ID_TIPO_PRODUCTO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      TIPO: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    }, {
      tableName: "TIPOS_PRODUCTOS",
      timestamps: false,
      schema: "C##HYPER"  // Asegúrate de usar tu esquema Oracle
    });
  
    return TipoProducto;
  };