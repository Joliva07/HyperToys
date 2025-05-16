// /app/controllers/tipoProducto.controller.js
const db = require('../config/databse.config.js');
const TipoProducto = db.TipoProductos;

// Obtener todos los tipos de producto (con paginación)
exports.getAllTiposProducto = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await TipoProducto.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['TIPO', 'ASC']]
    });
    
    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      tipos: rows
    });
  } catch (error) {
    console.error('Error al obtener tipos de producto:', error);
    res.status(500).json({
      error: "Error al obtener tipos de producto",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un tipo por ID
exports.getTipoProductoById = async (req, res) => {
  try {
    const tipo = await TipoProducto.findByPk(req.params.id);
    
    if (!tipo) {
      return res.status(404).json({ error: "Tipo de producto no encontrado" });
    }
    
    res.json(tipo);
  } catch (error) {
    console.error('Error al obtener tipo de producto:', error);
    res.status(500).json({
      error: "Error al obtener el tipo de producto",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};