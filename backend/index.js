const express = require('express');
const mysql = require('mysql2'); // Asegúrate de requerir el módulo correcto
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secret_jwt = "esta-es-la-clave-secreta";

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors({
    origin: 'https://eventmate.site', // Permitir solicitudes desde tu dominio
    credentials: true // Permitir el envío de cookies
}));

// Configuración de la base de datos
const config = {
    host: process.env.DB_HOST || 'localhost', // Cambia a localhost si es necesario
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Sidas-200",
    port: 3306,
    database: process.env.DB_NAME || "eventmate_integradora"
};

// Creación del pool de conexiones
const pool = mysql.createPool(config);

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).send('Acceso no autorizado');
    }
    try {
        const data = jwt.verify(token, secret_jwt);
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).send('Acceso no autorizado');
    }
};

server.post('/registrar', async (req, res) => {
    console.log("Datos recibidos:", req.body);

    const { nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, fecha_nac, contraseña, confirmacion } = req.body;

    if (!nombre_cliente || !apellido_cliente || !correo_cliente || !telefono_cliente || !fecha_nac || !contraseña || !confirmacion) {
        return res.status(400).send({ error: "Todos los campos son obligatorios" });
    }

    if (contraseña !== confirmacion) {
        return res.status(400).send({ error: "Las contraseñas no coinciden" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoCliente = {
        nombre_cliente,
        correo_cliente,
        telefono_cliente,
        fecha_nac,
        contraseña: hashedPassword,
        apellido_cliente
    };

    const buscar = "SELECT * FROM clientes WHERE correo_cliente = ?";
    pool.query(buscar, [nuevoCliente.correo_cliente], function (err, row) {
        if (err) {
            console.log("Error searching for user", err);
            res.status(500).send('Error al buscar el cliente');
        } else {
            if (row.length > 0) {
                console.log("El usuario ya existe");
                res.status(409).send('El usuario ya existe');
            } else {
                const sql = "INSERT INTO clientes (nombre_cliente, correo_cliente, telefono_cliente, fecha_nac, codigo_unico, contraseña, apellido_cliente) VALUES (?, ?, ?, ?, NULL, ?, ?)";
                pool.query(sql, [nuevoCliente.nombre_cliente, nuevoCliente.correo_cliente, nuevoCliente.telefono_cliente, nuevoCliente.fecha_nac, nuevoCliente.contraseña, nuevoCliente.apellido_cliente], (error, results) => {
                    if (error) {
                        console.log("Error inserting data", error);
                        res.status(400).send('Error al guardar el cliente');
                    } else {
                        console.log("Cliente guardado correctamente");
                        res.status(201).send('Cliente guardado correctamente');
                    }
                });
            }
        }
    });
});

server.post("/login_cliente", (req, res) => {
    const { correo_electronico, contraseña } = req.body;

    if (!correo_electronico || !contraseña) {
        console.log("Correo electrónico y contraseña son requeridos");
        return res.status(400).send("Correo electrónico y contraseña son requeridos");
    }

    pool.query(
        "SELECT * FROM clientes WHERE correo_cliente = ?",
        [correo_electronico],
        async (error, results) => { // Solo pasamos correo_electronico aquí
            if (error) {
                console.log("Error al consultar la base de datos", error);
                return res.status(500).send("Error al consultar la base de datos");
            } else {
                if (results.length > 0) {
                    const storedHash = results[0]['contraseña'];
                    if (!storedHash) {
                        console.log("No se encontró un hash de contraseña en la base de datos");
                        return res.status(500).send("Error interno del servidor");
                    }

                    try {
                        const isMatch = await bcrypt.compare(contraseña, storedHash);
                        if (isMatch) {
                            const token = jwt.sign({ id: results[0].id_cliente }, secret_jwt, { expiresIn: '15m' });
                            const encriptada = await bcrypt.hash(contraseña, 10);
                            const sesion = {
                                correo_electronico,
                                contraseña: encriptada
                            }
                            res.cookie('access_token', token, {
                                httpOnly: true,
                                secure: true,
                                sameSite: 'strict',
                                maxAge: 1000 * 60 * 60 * 24,
                                path: '/'
                            });
                            console.log('Cookie set', res.get('Set-Cookie'));
                            const guardar = "INSERT INTO login_cliente(correo_electronico, contraseña) VALUES (?,?) ";
                            pool.query(guardar, [sesion.correo_electronico, sesion.contraseña], (err, res) => {
                                if (err) {
                                    console.log("Error inserting data", error);
                                } else {
                                    console.log("Sesion guardada");
                                }
                            });
                            return res.status(200).json({ message: "Inicio de sesión exitoso", token });
                        } else {
                            return res.status(401).json({ message: "Datos incorrectos" });
                        }
                    } catch (compareError) {
                        console.log("Error al comparar las contraseñas", compareError);
                        return res.status(500).send("Error al procesar la solicitud");
                    }
                } else {
                    return res.status(401).json({ message: "Datos incorrectos" });
                }
            }
        }
    );
});

server.get('/autorizacion', (req, res) => {
    const token = req.cookies.access_token;

    if (token) {
        jwt.verify(token, secret_jwt, (err, decoded) => {
            if (err) {
                return res.status(401).json({ authenticated: false });
            }
            return res.status(200).json({ authenticated: true });
        });
    } else {
        return res.status(401).json({ authenticated: false });
    }
});

server.get('/info-token', (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.decode(token, { complete: true });

        if (decoded) {
            return res.status(200).json({ message: 'Token decoded successfully', data: decoded });
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error decoding token', error: error.message });
    }
});

server.get('/logout', (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/'
    });
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

server.get('/user-info', verifyToken, (req, res) => {
    const userId = req.user.id; 

    const sql = "SELECT nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, fecha_nac  FROM clientes WHERE id_cliente = ?";
    pool.query(sql, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener la información del usuario", error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            const user = results[0];
            res.status(200).json({ nombre_cliente: user.nombre_cliente, apellido_cliente: user.apellido_cliente, correo_cliente: user.correo_cliente, telefono_cliente: user.telefono_cliente, fecha_nac: user.fecha_nac });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    });
});

server.post('/comentario', verifyToken, (req, res) => {
    const id = req.user.id; 
    const { comentario } = req.body;

    const nuevo_com = {
        id,
        comentario
    };
    const com = "INSERT INTO comentarios(fk_cliente, comentario) VALUES (?, ?)";
    pool.query(com, [nuevo_com.id, nuevo_com.comentario], (err, result) => {
        if (err) {
            console.log("Error al guardar el comentario");
            res.status(400).send("Error al guardar el comentario");
        } else {
            console.log("Comentario guardado exitosamente");
            res.status(201).send("Comentario guardado correctamente");
        }
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

server.get('/comentarios', (req, res) => {
    const sql = `
        SELECT c.comentario, cl.nombre_cliente 
        FROM comentarios c 
        JOIN clientes cl ON c.fk_cliente = cl.id_cliente
    `;

    pool.query(sql, (error, results) => {
        if (error) {
            console.error("Error al obtener los comentarios", error);
            return res.status(500).json({ message: 'Error al obtener los comentarios' });
        }

        res.status(200).json(results);
    });
});
