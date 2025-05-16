const db = require('../config/databse.config.js');
const Clientes = db.Clientes;
const bcrypt = require('bcryptjs');
const moment = require('moment');

// Función para obtener el próximo ID de cliente desde la secuencia de Oracle
async function getNextClienteId() {
    try {
        const result = await db.sequelize.query(
            `SELECT "HYPER"."SEQ_CLIENTE".NEXTVAL AS ID_CLIENTE FROM DUAL`, 
            { type: db.sequelize.QueryTypes.SELECT }
        );
        return result[0].ID_CLIENTE;
    } catch (err) {
        console.error('Error al obtener el ID del cliente:', err);
        throw new Error('Error al obtener el ID del cliente');
    }
}

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        
        // Obtener el próximo ID
        const idCliente = await getNextClienteId();
        
        // Preparar datos del cliente
        const clienteData = {
            ID_CLIENTE: idCliente,
            NOMBRES: req.body.NOMBRES,
            APELLIDOS: req.body.APELLIDOS,
            FECHA_NACIMIENTO: moment(req.body.FECHA_NACIMIENTO).format('YYYY-MM-DD'),
            NIT: req.body.NIT || null,
            DIRECCION: req.body.DIRECCION,
            CORREO_ELECTRONICO: req.body.CORREO_ELECTRONICO,
            USUARIO: req.body.USUARIO,
            CONTRASENA: await bcrypt.hash(req.body.CONTRASENA, 10),
            FECHA_CREACION: moment().format('YYYY-MM-DD HH:mm:ss'),
            ULTIMA_ACTUALIZACION: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        // Crear el cliente
        const nuevoCliente = await Clientes.create(clienteData, { transaction });
        
        await transaction.commit();
        
        // Excluir la contraseña en la respuesta
        const clienteResponse = nuevoCliente.toJSON();
        delete clienteResponse.CONTRASENA;
        
        res.status(201).json({
            message: "Cliente creado exitosamente",
            cliente: clienteResponse
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error al crear cliente:', error);
        res.status(500).json({
            error: "Error al crear el cliente",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener todos los clientes (con paginación)
exports.getAllClientes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const { count, rows } = await Clientes.findAndCountAll({
            attributes: { exclude: ['CONTRASENA'] },
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['APELLIDOS', 'ASC']]
        });
        
        res.json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            clientes: rows
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({
            error: "Error al obtener clientes",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
    try {
        const cliente = await Clientes.findByPk(req.params.id, {
            attributes: { exclude: ['CONTRASENA'] }
        });
        
        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        
        res.json(cliente);
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({
            error: "Error al obtener el cliente",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        
        const [updated] = await Clientes.update({
            ...req.body,
            ULTIMA_ACTUALIZACION: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: { ID_CLIENTE: req.params.id },
            transaction
        });
        
        if (!updated) {
            await transaction.rollback();
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        
        await transaction.commit();
        
        const clienteActualizado = await Clientes.findByPk(req.params.id, {
            attributes: { exclude: ['CONTRASENA'] }
        });
        
        res.json({
            message: "Cliente actualizado correctamente",
            cliente: clienteActualizado
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({
            error: "Error al actualizar el cliente",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        
        const cliente = await Clientes.findByPk(req.params.id, { transaction });
        
        if (!cliente) {
            await transaction.rollback();
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        
        await cliente.destroy({ transaction });
        await transaction.commit();
        
        res.json({
            message: "Cliente eliminado correctamente",
            cliente: {
                ID_CLIENTE: cliente.ID_CLIENTE,
                NOMBRES: cliente.NOMBRES,
                APELLIDOS: cliente.APELLIDOS
            }
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({
            error: "Error al eliminar el cliente",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Buscar cliente por correo electrónico
exports.getClienteByEmail = async (req, res) => {
    try {
        const cliente = await Clientes.findOne({
            where: { CORREO_ELECTRONICO: req.params.email },
            attributes: { exclude: ['CONTRASENA'] }
        });
        
        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        
        res.json(cliente);
    } catch (error) {
        console.error('Error al buscar cliente por email:', error);
        res.status(500).json({
            error: "Error al buscar cliente",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};