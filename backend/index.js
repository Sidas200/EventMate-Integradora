const express = require('express');
const db = require('mysql2');
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const {engine} = require('express-handlebars')
const session = require('express-session');
const bcrypt = require('bcrypt'); 
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');

server.use(cookieParser())
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(cors());
server.use(express.static(path.join(__dirname, 'index'))); 

// sid.signature
server.use(express.json());
server.use(session({
    secret: "esteeselmayorsecreto"
}));

server.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'index.html'));
});

const conn = db.createConnection({
    host: "localhost",
    user: "root",
    password: "Sidas-200",
    port: 3306,
    database: "eventmate_integradora"
});

conn.connect((error) => {
    if (error) {
        console.log("Error connecting to database", error);
    } else {
        console.log("Connected to database");
    }
});


server.post("/clientes", async (req, res) => {
    const { nombre_cliente, correo_cliente, telefono_cliente, fecha_nac, contraseña, confirmacion, apellido_cliente } = req.body;

    if (contraseña !== confirmacion) {
        return res.status(400).send('Las contraseñas no coinciden');
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
    conn.query(buscar, [nuevoCliente.correo_cliente], function (err, row) {
        if (err) {
            console.log("Error searching for user", err);
            res.status(500).send('Error al buscar el cliente');
        } else {
            if (row.length > 0) {
                console.log("El usuario ya existe");
                res.status(409).send('El usuario ya existe');
            } else {
                const sql = "INSERT INTO clientes (nombre_cliente, correo_cliente, telefono_cliente, fecha_nac, codigo_unico, contraseña, apellido_cliente) VALUES (?, ?, ?, ?, NULL, ?, ?)";
                conn.query(sql, [nuevoCliente.nombre_cliente, nuevoCliente.correo_cliente, nuevoCliente.telefono_cliente, nuevoCliente.fecha_nac, nuevoCliente.contraseña, nuevoCliente.apellido_cliente], (error, results) => {
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

    conn.query(
        "SELECT * FROM clientes WHERE correo_cliente = ?",
        [correo_electronico],
        async (error, results) => {
            if (error) {
                console.log("Error al consultar la base de datos", error);
                return res.status(500).send("Error al consultar la base de datos");
            } else {
                if (results.length > 0) {
                    const storedHash = results[0].contraseña;

                    if (!storedHash) {
                        console.log("No se encontró un hash de contraseña en la base de datos");
                        return res.status(500).send("Error interno del servidor");
                    }

                    try {
                        const isMatch = await bcrypt.compare(contraseña, storedHash);
                        if (isMatch) {
                            res.status(200).json({ message: "Inicio de sesión exitoso" });
                        } else {
                            res.status(401).json({ message: "Datos incorrectos" });
                        }
                    } catch (compareError) {
                        console.log("Error al comparar las contraseñas", compareError);
                        res.status(500).send("Error al procesar la solicitud");
                    }
                } else {
                    res.status(401).json({ message: "Datos incorrectos" });
                }
            }
        }
    );
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

