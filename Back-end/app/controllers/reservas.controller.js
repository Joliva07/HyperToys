const db = require('../config/databse.config.js');
const Reserva = db.Reserva;
const DetalleReserva = db.DetalleReserva;

async function getNextReservaNumber() {
    try {
        const result = await db.sequelize.query(`SELECT SEQ_RESERVA.NEXTVAL AS idReserva FROM DUAL`, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return result[0].IDRESERVA || result[0].idreserva;
    } catch (err) {
        console.error(err);
        throw new Error('Error al obtener el número de reserva');
    }
}

async function getNextDetalleReservaId() {
    const result = await db.sequelize.query(
        `SELECT SEQ_DETALLE_RESERVA.NEXTVAL AS idDetalle FROM DUAL`,
        { type: db.Sequelize.QueryTypes.SELECT }
    );
    return result[0].IDDETALLE || result[0].iddetalle;
}

exports.realizarReserva = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { id_cliente, productos, fechaReserva } = req.body;

    if (!id_cliente || !productos || productos.length === 0 || !fechaReserva) {
      return res.status(400).json({ message: 'Datos incompletos en la solicitud' });
    }

    const parsedFechaReserva = new Date(fechaReserva);
    if (isNaN(parsedFechaReserva)) {
      return res.status(400).json({ message: 'Formato de fecha inválido' });
    }
    parsedFechaReserva.setHours(0, 0, 0, 0);

    const fechaLimitePago = new Date(parsedFechaReserva);
    fechaLimitePago.setDate(fechaLimitePago.getDate() - 1);

    const idReserva = await getNextReservaNumber();

    // Calcular TOTAL_RESERVA desde LISTA_PRODUCTOS
    let totalReserva = 0;

    for (const producto of productos) {
      const { id_producto, cantidad } = producto;

      if (!id_producto || !cantidad) {
        throw new Error('Datos incompletos en los productos');
      }

      const result = await db.sequelize.query(
        `SELECT PRECIO FROM HYPER.LISTA_PRODUCTOS WHERE ID_PRODUCTO = :id`,
        {
          replacements: { id: id_producto },
          type: db.Sequelize.QueryTypes.SELECT,
          transaction: t
        }
      );

      if (!result.length) {
        throw new Error(`Producto con ID ${id_producto} no encontrado en LISTA_PRODUCTOS`);
      }

      const precio = parseFloat(result[0].PRECIO);
      totalReserva += precio * cantidad;
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      id_reserva: idReserva,
      id_cliente,
      fecha_reserva: parsedFechaReserva,
      fecha_limite_pago: fechaLimitePago,
      total_reserva: totalReserva
    }, { transaction: t });

    let idDetalleReservaContador = 1;

    for (const producto of productos) {
      const { id_producto, cantidad } = producto;

      await DetalleReserva.create({
        id_reserva: idReserva,
        id_producto,
        cantidad,
        id_detalle_reserva: idDetalleReservaContador++
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Reserva realizada con éxito', reserva: nuevaReserva });

  } catch (error) {
    await t.rollback();
    console.error('Error en la reserva:', error.message || error);
    res.status(500).json({ message: 'Error al realizar la reserva', error: error.message || error });
  }
};


exports.retrieveReservasByCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;

    const reservas = await Reserva.findAll({
      where: { id_cliente },
      attributes: ['id_reserva', 'fecha_reserva', 'fecha_limite_pago', 'total_reserva']
    });

    if (reservas.length === 0) {
      return res.status(404).json({
        message: `No se encontraron reservas para el cliente con ID ${id_cliente}.`
      });
    }

    res.status(200).json({
      message: `Reservas para el cliente con ID ${id_cliente} obtenidas exitosamente.`,
      reservas
    });

  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res.status(500).json({
      message: "Error al obtener las reservas",
      error: error.message
    });
  }
};


exports.getDetallesByReserva = async (req, res) => {
    const { idReserva } = req.params;

    if (isNaN(idReserva)) {
        return res.status(400).json({
            message: "El ID de la reserva debe ser un valor numérico válido."
        });
    }

    const idReservaNum = parseInt(idReserva, 10);

    try {
        const detalles = await DetalleReserva.findAll({
            where: { id_reserva: idReservaNum }
        });

        if (detalles.length === 0) {
            return res.status(404).json({
                message: `No se encontraron detalles para la reserva con ID ${idReservaNum}.`
            });
        }

        res.status(200).json({
            message: `Detalles de la reserva con ID ${idReservaNum} obtenidos exitosamente.`,
            detalles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Ocurrió un error al obtener los detalles de la reserva.",
            error: error.message
        });
    }
};

exports.eliminarReserva = async (req, res) => {
    const { idReserva } = req.params;

    if (isNaN(idReserva)) {
        return res.status(400).json({
            message: "El ID de la reserva debe ser un valor numérico válido."
        });
    }

    const idReservaNum = parseInt(idReserva, 10);
    const t = await db.sequelize.transaction();

    try {
        // Eliminar los detalles de la reserva primero (por FK)
        await DetalleReserva.destroy({
            where: { id_reserva: idReservaNum },
            transaction: t
        });

        // Eliminar la reserva
        const deleted = await Reserva.destroy({
            where: { id_reserva: idReservaNum },
            transaction: t
        });

        if (deleted === 0) {
            await t.rollback();
            return res.status(404).json({
                message: `No se encontró la reserva con ID ${idReservaNum}.`
            });
        }

        await t.commit();
        res.status(200).json({
            message: `La reserva con ID ${idReservaNum} y sus detalles han sido eliminados exitosamente.`
        });
    } catch (error) {
        await t.rollback();
        console.error("Error al eliminar la reserva:", error);
        res.status(500).json({
            message: "Ocurrió un error al eliminar la reserva.",
            error: error.message
        });
    }
};
