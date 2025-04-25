const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/databse.config.js'); // Asegúrate de que este es el acceso correcto a Sequelize
const JWT_SECRET = 'tu_secreto_supersecreto';

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login recibido:', username, password);

    try {
        const [cliente] = await db.sequelize.query(
            `SELECT * FROM CLIENTES WHERE USUARIO = :username`,
            {
                replacements: { username },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!cliente) {
            console.log('Cliente no encontrado');
            return res.status(400).json({ error: 'Cliente no encontrado' });
        }

        console.log('Contraseña en BD:', cliente.CONTRASENA);
        console.log('Comparando con:', password);

        const isPasswordValid = await bcrypt.compare(password, cliente.CONTRASENA);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta')
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: cliente.ID_CLIENTE }, JWT_SECRET, { expiresIn: '1h' });

        console.log('Login exitoso, token generado');
        res.json({ token, id: cliente.ID_CLIENTE });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
};
