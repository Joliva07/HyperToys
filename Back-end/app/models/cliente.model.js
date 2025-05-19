module.exports = (sequelize, Sequelize) => {
    const Clientes = sequelize.define("CLIENTES", {
      ID_CLIENTE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      NOMBRES: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      APELLIDOS: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      FECHA_NACIMIENTO: {
        type: Sequelize.DATE,
        allowNull: false
      },
      NIT: {
        type: Sequelize.STRING(20)
      },
      DIRECCION: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      CORREO_ELECTRONICO: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      USUARIO: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      CONTRASENA: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      PUNTOS_COMPRA: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    }, {
      tableName: "CLIENTES",
      timestamps: false,
      schema: "HYPER"  // Especifica el esquema de Oracle
    });
  
    return Clientes;
  }