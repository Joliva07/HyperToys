module.exports = (sequelize, Sequelize) => {
    const ListaProducto = sequelize.define("LISTA_PRODUCTOS", {
      ID_PRODUCTO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      NOMBRE: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      ID_TIPO_PRODUCTO: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      DESCRIPCION: {
        type: Sequelize.STRING(200)
      },
      PRECIO: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      FECHA_INGRESO: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      ID_PROVEEDOR: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      IMAGEN: {
        type: Sequelize.BLOB,
        allowNull: false
      },
      PUNTOS: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }, {
      tableName: "LISTA_PRODUCTOS",
      timestamps: false,
      schema: "HYPER"  // Asegúrate de usar tu esquema Oracle
    });
  
    return ListaProducto;
  };