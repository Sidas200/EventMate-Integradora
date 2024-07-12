const express = require('express');
const db = require('mysql2');
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(cors());
server.use(express.static(path.join(__dirname, 'index'))); 


server.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'index.html'));
});


const conn = db.createConnection({
    host:"localhost",
    user:"root",
    password:"Sidas-200",
    port:3306,
    database:"eventmate_integradora"
});
conn.connect((error)=>{
    if (error) {
        console.log("Error conncecting to database", error);
    }else{
        console.log("Connected to database");
    }
})

// server.get("/", (req,res)=>{
   // console.log("GET/");
    // res.json("Hola tontito");
// });
server.get("/clientes", (req,res)=>{


    conn.query("select * from clientes ", (error,results)=>{
        if(error){
            console.log("Error fetching data",error);
            res.send("Error fetching data",500);

        }else{
            console.log("Data fetched succesfully");
            res.send(results);
        }
    })
});
/*
server.get("/clientes", (req,res)=>{
    conn.query("select * from clientes", (error,results)=>{
        if (error) {
            console.log("Error fetching data", error);
            res.send("Error fetching data");
        }else{
            console.log("Data fetched succesfullly");
            res.send(results);
        }
    })
    // res.send("Miguelito");
});
*/
server.post("/clientes", (req, res) => {
    const { nombre_cliente, correo_cliente, telefono_cliente, fecha_nac, contraseña, confirmacion, apellido_cliente } = req.body;
    const nuevoCliente = {
        nombre_cliente,
        correo_cliente,
        telefono_cliente,
        fecha_nac,
        contraseña,
        confirmacion,
        apellido_cliente
    };
    const sql = "INSERT INTO clientes (nombre_cliente, correo_cliente, telefono_cliente, fecha_nac, codigo_unico, contraseña, confirmacion, apellido_cliente) VALUES (?, ?, ?, ?, NULL, ?, ?, ?)";
    conn.query(sql, [nuevoCliente.nombre_cliente, nuevoCliente.correo_cliente, nuevoCliente.telefono_cliente, nuevoCliente.fecha_nac, nuevoCliente.contraseña, nuevoCliente.confirmacion, nuevoCliente.apellido_cliente], (error, results) => {
        if (error) {
            console.log("Error inserting data", error);
            res.status(400).send('Error al guardar el cliente');
        } else {
            console.log("Cliente guardado correctamente");
            res.status(201).send('cliente guardado correctamente');
        }
    });
});

server.post("/login_cliente", (req, res) => {
    const { correo_electronico, contraseña } = req.body;
    conn.query(
        "SELECT * FROM clientes WHERE correo_cliente = ? AND contraseña = ?",
        [correo_electronico, contraseña],
        (error, results) => {
            if (error) {
                console.log("Error al consultar la base de datos", error);
                res.status(500).send("Error al consultar la base de datos");
            } else {
                if (results.length > 0) {
                 
                    res.status(200).json({ message: "Inicio de sesión exitoso" });
                } else {
                    
                    res.status(401).json({ message: "Datos incorrectas" });
                }
            }
        }
    );
});




server.listen(3000,()=>{
 console.log("Server is running on http://localhost:3000");
});