module.exports = (sequelize, Sequelize) => {
    const Disponibilidad = sequelize.define("DISPONIBILIDAD_PRODUCTOS", {
      ID_DISPONIBILIDAD: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      DISPONIBILIDAD: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    }, {
      tableName: "DISPONIBILIDAD_PRODUCTOS",
      timestamps: false,
      schema: "HYPER"  // Asegúrate de usar tu esquema Oracle
    });
  
    return Disponibilidad;
  };