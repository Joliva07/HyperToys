const db = require('../config/databse.config.js');
const ListaProducto = db.ListaProductos;

// Obtener todos los productos (con paginación)
exports.getAllProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ListaProducto.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['NOMBRE', 'ASC']]
    });

    const productosConImagen = rows.map(p => ({
      ...p.dataValues,
      IMAGEN: p.IMAGEN ? p.IMAGEN.toString('base64') : null
    }));

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      productos: productosConImagen
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      error: "Error al obtener productos",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const producto = await ListaProducto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const productoConImagen = {
      ...producto.dataValues,
      IMAGEN: producto.IMAGEN ? producto.IMAGEN.toString('base64') : null
    };

    res.json(productoConImagen);

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      error: "Error al obtener el producto",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
